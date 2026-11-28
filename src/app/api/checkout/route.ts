import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { saveAdminOrder, getAdminCoupons, saveAdminCoupon, addLead, getAdminProducts, getAdminServices } from "@/lib/admin/store";
import { products as fallbackProducts } from "@/content/products";
import { services as fallbackServices } from "@/content/services";
import type { OrderItem } from "@/lib/admin/types";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";
import { sanitizeText, sanitizeEmail, sanitizePhone, isHoneypotTriggered } from "@/lib/security/sanitize";
import { getAuthenticatedUser } from "@/lib/auth/access-control";
import { createCashfreeOrder } from "@/lib/cashfree";
import { getBaseUrl } from "@/lib/metadata";
import { sendOrderConfirmationEmail } from "@/lib/email/resend";

export const dynamic = "force-dynamic";

const BESPOKE_SERVICE_PACKAGES: Record<string, { title: string; price: number }> = {
  "svc-photo-silver": {
    title: "Event & Portrait Photography — Silver Coverage (Half-Day)",
    price: 18000,
  },
  "svc-photo-gold": {
    title: "Event & Portrait Photography — Gold Coverage (Full-Day VIP)",
    price: 35000,
  },
  "svc-photo-platinum": {
    title: "Event & Portrait Photography — Platinum Suite (Multi-Day Luxury)",
    price: 65000,
  },
  "svc-prewed-teaser": {
    title: "Cinematic Pre-Wedding Films — The Instagram 4K Teaser",
    price: 25000,
  },
  "svc-prewed-story": {
    title: "Cinematic Pre-Wedding Films — The Cinematic Story Film",
    price: 48000,
  },
  "svc-prewed-royal": {
    title: "Cinematic Pre-Wedding Films — The Royal Cinema & Photo Suite",
    price: 85000,
  },
};

function resolveCheckoutOrigin(request: NextRequest): string {
  const fwdHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const fwdProto = request.headers.get("x-forwarded-proto") || "https";
  if (
    fwdHost &&
    !fwdHost.includes("localhost") &&
    !fwdHost.includes("127.0.0.1") &&
    fwdProto.startsWith("https")
  ) {
    return `https://${fwdHost}`;
  }
  return getBaseUrl();
}

async function resolveVerifiedServicePackage(productId: string): Promise<{ title: string; price: number } | null> {
  if (!productId) return null;
  if (BESPOKE_SERVICE_PACKAGES[productId]) {
    return BESPOKE_SERVICE_PACKAGES[productId];
  }
  const [adminServices] = await Promise.all([getAdminServices().catch(() => [])]);
  const allServices = [...adminServices, ...fallbackServices];
  for (const svc of allServices) {
    const svcKey = svc.title.toLowerCase().replace(/[^a-z0-9]/g, "-");
    for (const pkg of svc.packages || []) {
      const pkgKey = pkg.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const expectedId = `svc-${svcKey}-${pkgKey}`;
      if (productId === expectedId) {
        return {
          title: `${svc.title} — ${pkg.name}`,
          price: pkg.price,
        };
      }
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  // 1. Rate limiting: Max 10 checkouts per 5 minutes per IP
  const rateLimit = checkRateLimit(request, {
    maxRequests: 10,
    windowSeconds: 300,
    prefix: "checkout",
  });
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  try {
    const body = await request.json();

    // 2. Honeypot bot protection
    if (isHoneypotTriggered(body)) {
      return NextResponse.json(
        { error: "Submission rejected by security policy." },
        { status: 400 }
      );
    }

    // 3. Sanitize inputs
    const cleanCustomerName = sanitizeText(body.customerName, 80);
    const cleanCustomerEmail = sanitizeEmail(body.customerEmail) || "";
    const cleanCustomerPhone = sanitizePhone(body.customerPhone);
    const productId = sanitizeText(body.productId, 100);
    const couponCode = sanitizeText(body.couponCode, 30);
    const paymentMethod = sanitizeText(body.paymentMethod || "UPI", 20);
    const includeUpsell = Boolean(body.includeUpsell);

    if (!cleanCustomerName) {
      return NextResponse.json(
        { error: "A valid customer name is required" },
        { status: 400 }
      );
    }

    // 4. NEVER TRUST THE FRONTEND: Authoritative Product / Service Verification & Pricing
    const adminProducts = await getAdminProducts().catch(() => []);
    const verifiedProduct =
      adminProducts.find((p) => p.id === productId || p.slug === productId) ||
      fallbackProducts.find((p) => p.id === productId || p.slug === productId);

    const verifiedService = !verifiedProduct ? await resolveVerifiedServicePackage(productId) : null;

    if (!verifiedProduct && !verifiedService) {
      return NextResponse.json(
        { error: "Selected product or service package was not found." },
        { status: 404 }
      );
    }

    let authoritativeTitle = cleanCustomerName;
    let basePrice = 299;
    let authoritativeDownloadUrl = "";
    let authoritativeCanvaUrl = "";
    let productType = "template";

    if (verifiedProduct) {
      authoritativeTitle = verifiedProduct.title;
      basePrice = typeof verifiedProduct.price === "number" ? verifiedProduct.price : 299;
      authoritativeDownloadUrl =
        verifiedProduct.downloadUrl ||
        verifiedProduct.googleDriveUrl ||
        verifiedProduct.pdfUrl ||
        verifiedProduct.appDownloadUrl ||
        "";
      authoritativeCanvaUrl =
        verifiedProduct.canvaUrl ||
        verifiedProduct.templateUrl ||
        "";
      productType = verifiedProduct.category || "template";
    } else if (verifiedService) {
      authoritativeTitle = verifiedService.title;
      basePrice = verifiedService.price;
      productType = "service";
    }

    const upsellPrice = includeUpsell ? 199 : 0;
    const subtotal = basePrice + upsellPrice;

    let discountAmount = 0;
    let appliedCoupon = null;

    // 5. Server-side coupon verification
    if (couponCode) {
      const cleanCode = couponCode.toUpperCase().trim();
      const coupons = await getAdminCoupons().catch(() => []);
      const matched = coupons.find(
        (c) => c.code.toUpperCase() === cleanCode && c.status === "active"
      );

      if (matched) {
        if (!matched.minOrderAmount || subtotal >= matched.minOrderAmount) {
          if (!matched.usageLimit || matched.usageCount < matched.usageLimit) {
            const isNotExpired =
              !matched.expiresAt || new Date(matched.expiresAt).getTime() > Date.now();

            if (isNotExpired) {
              appliedCoupon = matched;
              if (matched.discountType === "percentage") {
                discountAmount = Math.round((subtotal * matched.discountValue) / 100);
              } else {
                discountAmount = Math.min(matched.discountValue, subtotal);
              }

              // Increment coupon usage count
              await saveAdminCoupon({
                ...matched,
                usageCount: matched.usageCount + 1,
              }).catch((e) => console.warn("Coupon usage increment error:", e));
            }
          }
        }
      }
    }

    const finalAmount = Math.max(subtotal - discountAmount, 0);

    // 6. Build items array with server-verified data
    const items: OrderItem[] = [
      {
        id: productId || `item-${Date.now()}`,
        title: authoritativeTitle,
        price: basePrice,
        quantity: 1,
        productType,
        downloadUrl: authoritativeDownloadUrl,
        templateUrl: authoritativeCanvaUrl || undefined,
        canvaUrl: authoritativeCanvaUrl || undefined,
      },
    ];

    if (includeUpsell) {
      const upsellPlanner =
        adminProducts.find((p) => p.category === "planners") ||
        fallbackProducts.find((p) => p.category === "planners");
      items.push({
        id: upsellPlanner?.id || "upsell-planner",
        title: upsellPlanner?.title || "30-Day Viral Content Planner Bundle",
        price: 199,
        quantity: 1,
        productType: "planners",
        downloadUrl:
          upsellPlanner?.downloadUrl ||
          upsellPlanner?.googleDriveUrl ||
          upsellPlanner?.pdfUrl ||
          "",
      });
    }

    // 7. Generate cryptographically distinct license key
    const p1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const p2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const licenseKey = `BDRSH-${p1}-${p2}`;
    const orderId = `ord_${Date.now()}_${p1.toLowerCase()}`;

    // 8. Associate authenticated user if session exists
    const authenticatedUser = getAuthenticatedUser(request);
    const userId = authenticatedUser ? authenticatedUser.uid : undefined;

    // 9. Payment Gateway Routing: Free products vs Cashfree Production
    const isFree = finalAmount === 0;
    const isOnlineCheckout =
      !isFree &&
      (paymentMethod === "Cashfree" ||
        paymentMethod === "Online" ||
        paymentMethod === "UPI" ||
        paymentMethod === "Card" ||
        paymentMethod === "Stripe" ||
        !paymentMethod ||
        paymentMethod === "");

    let paymentSessionId: string | undefined = undefined;
    let cfEnv: string = "PROD";
    let cfErrorMessage: string | undefined = undefined;

    const orderAccessToken = crypto.randomBytes(24).toString("hex");

    if (isOnlineCheckout) {
      try {
        const originUrl = resolveCheckoutOrigin(request);
        const cfResult = await createCashfreeOrder({
          orderId,
          orderAmount: finalAmount,
          customerName: cleanCustomerName,
          customerEmail: cleanCustomerEmail,
          customerPhone: cleanCustomerPhone,
          customerId: userId || `cust_${orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-12)}`,
          returnUrl: `${originUrl}/orders/${orderId}?cf_id={order_id}&token=${encodeURIComponent(orderAccessToken)}`,
          notifyUrl: `${originUrl}/api/webhooks/cashfree`,
        });

        if (cfResult.success && cfResult.paymentSessionId) {
          paymentSessionId = cfResult.paymentSessionId;
          cfEnv = cfResult.env || "PROD";
        } else {
          cfErrorMessage = cfResult.error || "Payment session could not be created.";
          console.error("Cashfree order creation failed:", cfResult.error);
        }
      } catch (cfErr: any) {
        cfErrorMessage = cfErr?.message || "Payment gateway connection error.";
        console.warn("Payment session creation warning:", cfErr);
      }

      if (!paymentSessionId) {
        return NextResponse.json(
          {
            success: false,
            error:
              cfErrorMessage ||
              "Unable to initialize secure payment gateway. Please verify your phone number and try again.",
          },
          { status: 502 }
        );
      }
    }

    // Determine initial payment status:
    // If free product -> status "completed" immediately
    // If online checkout -> status "pending" until verified via webhook or redirect sync
    // If manual mode (UPI QR / WhatsApp) -> status "pending"
    const paymentStatus = isFree ? "completed" : "pending";

    // 10. Save order securely
    const order = await saveAdminOrder({
      id: orderId,
      accessToken: orderAccessToken,
      customerName: cleanCustomerName,
      customerEmail: cleanCustomerEmail,
      customerPhone: cleanCustomerPhone,
      userId,
      items,
      totalAmount: finalAmount,
      currency: "INR",
      paymentMethod: isFree ? "Free Product" : paymentSessionId ? "Online (UPI / Card)" : paymentMethod,
      paymentStatus,
      licenseKey,
      canvaAccessDelivered: paymentStatus === "completed",
      deliveryNotes: `Online checkout ${appliedCoupon ? `[Coupon: ${appliedCoupon.code} -₹${discountAmount}]` : ""} ${paymentSessionId ? `[Session: ${paymentSessionId.slice(0, 12)}...]` : ""}`.trim(),
    });

    // 11. Auto-capture lead & send instant confirmation email for completed (free / 100% coupon) orders
    if (order.paymentStatus === "completed") {
      await sendOrderConfirmationEmail({ ...order, accessToken: orderAccessToken }).catch(() => {});
    }

    if (cleanCustomerEmail || cleanCustomerPhone) {
      await addLead({
        name: cleanCustomerName,
        email: cleanCustomerEmail || "checkout@customer.com",
        phone: cleanCustomerPhone,
        interest: `Purchased: ${authoritativeTitle}`,
        message: `Purchased order ${order.id} for ₹${finalAmount} with license ${licenseKey}`,
        budget: `₹${finalAmount}`,
      }).catch((e) => console.warn("Auto-lead capture error:", e));
    }

    const isCompleted = order.paymentStatus === "completed";

    return NextResponse.json({
      success: true,
      paymentRequired: Boolean(paymentSessionId),
      paymentSessionId,
      cfEnv,
      orderId: order.id,
      accessToken: orderAccessToken,
      order: {
        id: order.id,
        accessToken: orderAccessToken,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        totalAmount: order.totalAmount,
        discountAmount,
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
        items: order.items,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        ...(isCompleted
          ? {
              licenseKey: order.licenseKey,
              downloadUrl:
                authoritativeDownloadUrl ||
                `/api/download?orderId=${encodeURIComponent(order.id)}&productId=${encodeURIComponent(items[0].id)}&key=${encodeURIComponent(order.licenseKey)}`,
              canvaUrl: authoritativeCanvaUrl || null,
            }
          : {}),
      },
    });
  } catch (error: any) {
    console.error("Checkout API error:", error?.message);
    return NextResponse.json(
      { error: "Internal error processing order. Please try again." },
      { status: 500 }
    );
  }
}
