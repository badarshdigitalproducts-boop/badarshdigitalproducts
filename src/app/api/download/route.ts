import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/admin/store";
import { generateR2DownloadUrl, isR2Configured } from "@/lib/storage/r2";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");
  const key = searchParams.get("key");
  const token = searchParams.get("token");
  const exp = searchParams.get("exp");

  try {
    const db = await getDatabase();

    // 1. Token-based direct download validation
    if (key && token && exp) {
      const now = Math.floor(Date.now() / 1000);
      if (now > parseInt(exp, 10)) {
        return NextResponse.json(
          { error: "This secure download link has expired. Please refresh your order page to get a new download link." },
          { status: 403 }
        );
      }

      const expectedToken = crypto
        .createHmac("sha256", "badarsh-secret-signing-key")
        .update(`${key}:${exp}`)
        .digest("hex");

      if (token !== expectedToken) {
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
      return NextResponse.redirect(new URL(key.startsWith("/") ? key : `/${key}`, request.url));
    }

    // 2. Order + Product validation
    if (orderId && productId) {
      const order = db.orders.find((o) => o.id === orderId);
      if (!order) {
        return NextResponse.json(
          { error: "Order not found. Please verify your purchase details." },
          { status: 404 }
        );
      }

      if (order.paymentStatus !== "completed") {
        return NextResponse.json(
          { error: "Payment verification pending. File downloads unlock automatically once payment is confirmed." },
          { status: 402 }
        );
      }

      const product = db.products.find((p) => p.id === productId || p.slug === productId);
      if (!product) {
        return NextResponse.json({ error: "Product file not found in catalog." }, { status: 404 });
      }

      // Check for Cloudflare R2 file key or link
      const fileTarget =
        product.downloadUrl ||
        product.googleDriveUrl ||
        product.appDownloadUrl ||
        product.pdfUrl ||
        product.presetLinkUrl ||
        product.alightMotionXmlUrl;

      if (!fileTarget) {
        return NextResponse.json(
          { error: "No download asset has been configured for this product." },
          { status: 404 }
        );
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

      // Standard direct download redirect
      return NextResponse.redirect(
        fileTarget.startsWith("http") ? fileTarget : new URL(fileTarget, request.url)
      );
    }

    // 3. Free product instant download validation
    if (productId && !orderId) {
      const product = db.products.find((p) => p.id === productId || p.slug === productId);
      if (!product || product.price > 0) {
        return NextResponse.json(
          { error: "This is a premium product. Please complete checkout to obtain a verified download link." },
          { status: 403 }
        );
      }

      const freeTarget =
        product.downloadUrl ||
        product.googleDriveUrl ||
        product.appDownloadUrl ||
        product.pdfUrl ||
        product.presetLinkUrl;

      if (freeTarget) {
        if (freeTarget.includes("drive.google.com")) {
          const idMatch = freeTarget.match(/\/d\/([a-zA-Z0-9_-]+)/) || freeTarget.match(/id=([a-zA-Z0-9_-]+)/);
          if (idMatch && idMatch[1]) {
            return NextResponse.redirect(`https://docs.google.com/uc?export=download&id=${idMatch[1]}`, 307);
          }
        }
        return NextResponse.redirect(
          freeTarget.startsWith("http") ? freeTarget : new URL(freeTarget, request.url)
        );
      }
    }

    return NextResponse.json({ error: "Missing required download parameters" }, { status: 400 });
  } catch (err: any) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Internal download dispatch error" }, { status: 500 });
  }
}
