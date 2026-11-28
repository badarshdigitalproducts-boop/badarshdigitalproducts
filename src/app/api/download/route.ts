import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/admin/store";
import { generateR2DownloadUrl, getDownloadSigningKey, isR2Configured } from "@/lib/storage/r2";
import { canAccessOrder } from "@/lib/auth/access-control";
import { products as fallbackProducts } from "@/content/products";
import crypto from "crypto";

const FREE_SFX_AUDIO_URLS: Record<string, { title: string; url: string }> = {
  "sfx-quattro-boom": {
    title: "Quattro-boom Whoosh SFX",
    url: "/audio/quattro-boom.wav",
  },
  "sfx-welcome": {
    title: "Welcome SFX",
    url: "/audio/welcome-chime.wav",
  },
  "sfx-explosion": {
    title: "Explosion SFX",
    url: "/audio/explosion-impact.wav",
  },
  "sfx-item-collected": {
    title: "Item Collected SFX",
    url: "/audio/item-collected.wav",
  },
  "sfx-toon-drops": {
    title: "Toon Drops SFX",
    url: "/audio/toon-drops.wav",
  },
  "sfx-platform-hit": {
    title: "SFX Platform Game Hit 1",
    url: "/audio/platform-hit.wav",
  },
  "sfx-cinematic-whoosh": {
    title: "Cinematic High-Pass Whoosh",
    url: "/audio/cinematic-whoosh.wav",
  },
  "sfx-mech-keyboard": {
    title: "Mechanical Keyboard Click & Tap",
    url: "/audio/mechanical-keyboard.wav",
  },
  "sfx-rain-thunder": {
    title: "Rain On Window & Soft Thunder",
    url: "/audio/rain-thunder.wav",
  },
  "sfx-cyber-shield": {
    title: "Sci-Fi Energy Shield Recharging",
    url: "/audio/cyber-shield.wav",
  },
  "sfx-espresso-pour": {
    title: "Domestic Coffee Pour & Ceramic Clink",
    url: "/audio/espresso-pour.wav",
  },
  "sfx-stadium-applause": {
    title: "Arena Crowd Cheer & Thunderous Applause",
    url: "/audio/stadium-applause.wav",
  },
  "sfx-subway-departure": {
    title: "Urban Metro Train Track Rumble",
    url: "/audio/subway-departure.wav",
  },
  "sfx-industrial-press": {
    title: "Heavy Hydraulic Piston Impact",
    url: "/audio/industrial-press.wav",
  },
  "sfx-trailer-braam": {
    title: "Deep Trailer Braam Impact",
    url: "/audio/trailer-braam.wav",
  },
  "sfx-crystal-transition": {
    title: "Crystal Glass Transition Riser",
    url: "/audio/crystal-transition.wav",
  },
};

const FREE_APP_DOWNLOAD_MAP: Record<string, { title: string; url: string; filename: string }> = {
  "prod-014": {
    title: "Creator Video Editing Tools & Config Vault",
    url: "/downloads/creator-video-editing-tools-config-vault.zip",
    filename: "creator-video-editing-tools-config-vault.zip",
  },
  "creator-editing-apps-vault": {
    title: "Creator Video Editing Tools & Config Vault",
    url: "/downloads/creator-video-editing-tools-config-vault.zip",
    filename: "creator-video-editing-tools-config-vault.zip",
  },
  "app-vn-editor": {
    title: "VN Video Editor Pro Studio Setup",
    url: "/downloads/vn-video-editor-pro-setup.zip",
    filename: "vn-video-editor-pro-setup.zip",
  },
  "vn-video-editor-pro-setup": {
    title: "VN Video Editor Pro Studio Setup",
    url: "/downloads/vn-video-editor-pro-setup.zip",
    filename: "vn-video-editor-pro-setup.zip",
  },
  "app-capcut-setup": {
    title: "CapCut Mobile 4K Export Suite",
    url: "/downloads/capcut-mobile-creator-suite.zip",
    filename: "capcut-mobile-creator-suite.zip",
  },
  "capcut-mobile-creator-suite": {
    title: "CapCut Mobile 4K Export Suite",
    url: "/downloads/capcut-mobile-creator-suite.zip",
    filename: "capcut-mobile-creator-suite.zip",
  },
  "app-alight-motion": {
    title: "Alight Motion Pro Preset Engine",
    url: "/downloads/alight-motion-pro-presets-engine.zip",
    filename: "alight-motion-pro-presets-engine.zip",
  },
  "alight-motion-pro-presets-engine": {
    title: "Alight Motion Pro Preset Engine",
    url: "/downloads/alight-motion-pro-presets-engine.zip",
    filename: "alight-motion-pro-presets-engine.zip",
  },
  "app-lightroom-mobile": {
    title: "Lightroom Mobile Pro Preset Injector",
    url: "/downloads/lightroom-mobile-preset-injector.zip",
    filename: "lightroom-mobile-preset-injector.zip",
  },
  "lightroom-mobile-preset-injector": {
    title: "Lightroom Mobile Pro Preset Injector",
    url: "/downloads/lightroom-mobile-preset-injector.zip",
    filename: "lightroom-mobile-preset-injector.zip",
  },
};

function findProduct(dbProducts: any[], productId: string) {
  const normalizedId = productId.toLowerCase().trim();
  return (
    dbProducts.find((p) => p.id?.toLowerCase() === normalizedId || p.slug?.toLowerCase() === normalizedId) ||
    fallbackProducts.find((p) => p.id?.toLowerCase() === normalizedId || p.slug?.toLowerCase() === normalizedId)
  );
}

function getProductAssetTarget(product: any): string | null {
  return (
    product.freeDownloadUrl ||
    product.downloadUrl ||
    product.alightMotionXmlUrl ||
    product.capcutUrl ||
    product.googleDriveUrl ||
    product.appDownloadUrl ||
    product.pdfUrl ||
    product.presetLinkUrl ||
    product.audioPreviewUrl ||
    product.canvaUrl ||
    product.templateUrl ||
    null
  );
}

async function resolveDownloadRedirect(fileTarget: string, request: NextRequest, productTitle?: string) {
  // If Canva or CapCut web template, direct redirect to editor
  if (fileTarget.includes("canva.com") || fileTarget.includes("capcut.com/template")) {
    return NextResponse.redirect(fileTarget, 307);
  }

  // If stored in R2 (or starts with "r2://" or "uploads/")
  if (fileTarget.startsWith("r2://") || (!fileTarget.startsWith("http") && !fileTarget.startsWith("/"))) {
    const cleanKey = fileTarget.replace(/^r2:\/\/[^/]+\//, "");
    if (isR2Configured()) {
      const signedUrl = await generateR2DownloadUrl(cleanKey, 14400); // 4 hours
      return NextResponse.redirect(signedUrl, 307);
    }
  }

  // If Google Drive link: transform to high-speed direct download link
  if (fileTarget.includes("drive.google.com")) {
    const idMatch = fileTarget.match(/\/d\/([a-zA-Z0-9_-]+)/) || fileTarget.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      const directDriveUrl = `https://docs.google.com/uc?export=download&id=${idMatch[1]}`;
      return NextResponse.redirect(directDriveUrl, 307);
    }
  }

  // For remote HTTP/HTTPS files: only fetch HTTPS from non-private hosts without open redirects
  if (fileTarget.startsWith("https://")) {
    try {
      const parsedUrl = new URL(fileTarget);
      if (
        parsedUrl.hostname !== "localhost" &&
        !parsedUrl.hostname.endsWith(".local") &&
        !parsedUrl.hostname.endsWith(".internal") &&
        !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(parsedUrl.hostname)
      ) {
        const upstreamRes = await fetch(fileTarget, {
          redirect: "error",
          signal: AbortSignal.timeout(15000),
          headers: {
            "User-Agent": "BADARSH-Downloader/1.0",
          },
        });

        if (upstreamRes.ok) {
          let safeName = "badarsh-download";
          try {
            const rawName = parsedUrl.pathname.split("/").pop();
            if (rawName && rawName.includes(".")) {
              safeName = decodeURIComponent(rawName).replace(/[^a-zA-Z0-9._-]/g, "-");
            } else if (productTitle) {
              safeName = `${productTitle.toLowerCase().replace(/[^a-z0-9_-]+/g, "-")}-master.pdf`;
            }
          } catch {
            if (productTitle) {
              safeName = `${productTitle.toLowerCase().replace(/[^a-z0-9_-]+/g, "-")}.bin`;
            }
          }

          const contentType = upstreamRes.headers.get("content-type") || "application/octet-stream";
          const arrayBuffer = await upstreamRes.arrayBuffer();

          return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Content-Disposition": `attachment; filename="${safeName}"`,
              "Cache-Control": "public, max-age=3600",
            },
          });
        }
      }
    } catch (streamErr) {
      console.warn("Direct stream fetch failed, falling back to redirect:", streamErr);
    }

    return NextResponse.redirect(fileTarget, 307);
  }

  // Serve local static files in public/downloads/, public/audio/, public/videos/ with accurate Content-Type
  if (
    fileTarget.startsWith("/downloads/") ||
    fileTarget.startsWith("downloads/") ||
    fileTarget.startsWith("/audio/") ||
    fileTarget.startsWith("audio/") ||
    fileTarget.startsWith("/videos/") ||
    fileTarget.startsWith("videos/")
  ) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const publicRoot = path.resolve(process.cwd(), "public");
      const cleanPath = fileTarget.replace(/^\/+/, "");
      const fullPath = path.resolve(publicRoot, cleanPath);
      if (fullPath.startsWith(publicRoot + path.sep) && fs.existsSync(fullPath)) {
        const fileBuffer = fs.readFileSync(fullPath);
        const filename = path.basename(fullPath);
        const ext = path.extname(filename).toLowerCase();
        const mimeMap: Record<string, string> = {
          ".zip": "application/zip",
          ".pdf": "application/pdf",
          ".wav": "audio/wav",
          ".mp3": "audio/mpeg",
          ".ogg": "audio/ogg",
          ".mp4": "video/mp4",
          ".xml": "application/xml",
          ".cube": "text/plain; charset=utf-8",
          ".xmp": "application/rdf+xml",
        };
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": mimeMap[ext] || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    } catch (fsErr) {
      console.warn("Local download read failed, falling back to URL redirect:", fsErr);
    }
  }

  // Standard direct download redirect
  return NextResponse.redirect(
    fileTarget.startsWith("http") ? fileTarget : new URL(fileTarget, request.url),
    307
  );
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");
  const key = searchParams.get("key");
  const token = searchParams.get("token");
  const exp = searchParams.get("exp");

  try {
    const db = await getDatabase(true);

    // 1. Token-based direct download validation
    if (key && token && exp) {
      const now = Math.floor(Date.now() / 1000);
      if (now > parseInt(exp, 10)) {
        return NextResponse.json(
          { error: "This secure download link has expired. Please refresh your order page to get a new download link." },
          { status: 403 }
        );
      }

      const signingKey = getDownloadSigningKey();
      if (!signingKey) {
        return NextResponse.json(
          { error: "Download signing is not configured on the server." },
          { status: 503 }
        );
      }
      const expectedToken = crypto
        .createHmac("sha256", signingKey)
        .update(`${key}:${exp}`)
        .digest("hex");

      const tokenBuf = Buffer.from(token);
      const expectedBuf = Buffer.from(expectedToken);
      if (tokenBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(tokenBuf, expectedBuf)) {
        return NextResponse.json(
          { error: "Invalid signature. This download link cannot be shared or pirated." },
          { status: 403 }
        );
      }

      // If R2 is active, generate authentic signed R2 link
      if (isR2Configured()) {
        const r2Url = await generateR2DownloadUrl(key, 14400);
        return NextResponse.redirect(r2Url, 307);
      }

      // Fallback local file redirect
      return NextResponse.redirect(new URL(key.startsWith("/") ? key : `/${key}`, request.url), 307);
    }

    // 2. Order + Product validation (Paid persistent re-downloads)
    if (orderId && productId) {
      const order = db.orders.find((o) => o.id === orderId);
      if (!order) {
        return NextResponse.json(
          { error: "Order not found. Please verify your purchase details." },
          { status: 404 }
        );
      }

      // Strict ownership / access check (DPDP IDOR protection & license key verification)
      const hasAccess = canAccessOrder(request, order, key || token);
      if (!hasAccess) {
        return NextResponse.json(
          { error: "Forbidden: You do not have permission to download files for this order." },
          { status: 403 }
        );
      }

      if (order.paymentStatus !== "completed") {
        return NextResponse.json(
          { error: "Payment verification pending. File downloads unlock automatically once payment is confirmed." },
          { status: 402 }
        );
      }

      // Check order items first for saved download URL
      const orderItem = order.items?.find(
        (i) => i.id?.toLowerCase() === productId.toLowerCase() || i.id === productId
      );
      let fileTarget = orderItem?.downloadUrl || orderItem?.canvaUrl || orderItem?.templateUrl;

      // If not in order item or item has generic placeholder, check catalog
      if (!fileTarget || fileTarget.includes("/downloads/ord_")) {
        const product = findProduct(db.products, productId);
        if (product) {
          fileTarget = getProductAssetTarget(product) || fileTarget;
        }
      }

      if (!fileTarget) {
        return NextResponse.json(
          { error: "No download asset has been configured for this product." },
          { status: 404 }
        );
      }

      return await resolveDownloadRedirect(fileTarget, request, orderItem?.title);
    }

    // 3. Free product instant download validation
    if (productId && !orderId) {
      const normId = productId.toLowerCase().trim();
      const staticApp = FREE_APP_DOWNLOAD_MAP[normId];
      if (staticApp) {
        return await resolveDownloadRedirect(staticApp.url, request, staticApp.title);
      }

      const staticSfx = FREE_SFX_AUDIO_URLS[normId];
      if (staticSfx) {
        return await resolveDownloadRedirect(staticSfx.url, request, staticSfx.title);
      }

      const product = findProduct(db.products, productId);
      if (!product) {
        return NextResponse.json({ error: "Product not found in catalog." }, { status: 404 });
      }

      if (product.price > 0) {
        return NextResponse.json(
          { error: "This is a premium product. Please complete checkout to obtain a verified download link." },
          { status: 403 }
        );
      }

      const freeTarget = getProductAssetTarget(product);
      if (freeTarget) {
        return await resolveDownloadRedirect(freeTarget, request, product.title);
      }

      return NextResponse.json(
        { error: "No download asset has been configured for this free product." },
        { status: 404 }
      );
    }

    return NextResponse.json({ error: "Missing required download parameters" }, { status: 400 });
  } catch (err: any) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Internal download dispatch error" }, { status: 500 });
  }
}
