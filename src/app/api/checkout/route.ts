import { NextRequest, NextResponse } from "next/server";
import { saveAdminOrder, getAdminCoupons, saveAdminCoupon, addLead, getAdminProducts } from "@/lib/admin/store";
import { products as fallbackProducts } from "@/content/products";
import type { OrderItem } from "@/lib/admin/types";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";
import { sanitizeText, sanitizeEmail, sanitizePhone, isHoneypotTriggered } from "@/lib/security/sanitize";
import { getAuthenticatedUser } from "@/lib/auth/access-control";
import { createCashfreeOrder } from "@/lib/cashfree";

export const dynamic = "force-dynamic";

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

    // 4. NEVER TRUST THE FRONTEND: Authoritative Product Verification & Pricing
    const adminProducts = await getAdminProducts().catch(() => []);
    const verifiedProduct =
      adminProducts.find((p) => p.id === productId || p.slug === productId) ||
      fallbackProducts.find((p) => p.id === productId || p.slug === productId);

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
    } else {
      // Fallback if product not explicitly in DB: check client provided title safely
      authoritativeTitle = sanitizeText(body.productTitle, 120) || "Digital Product";
      // Enforce minimum price floor - never allow 0 or arbitrary client overrides
      basePrice = Math.max(Number(body.productPrice) || 299, 99);
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
      items.push({
        id: "upsell-planner",
        title: "30-Day Viral Content Planner Bundle",
        price: 199,
        quantity: 1,
        productType: "planner",
        downloadUrl: "/downloads/30-day-content-planner.zip",
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

    if (isOnlineCheckout) {
      try {
        const cfResult = await createCashfreeOrder({
          orderId,
          orderAmount: finalAmount,
          customerName: cleanCustomerName,
          customerEmail: cleanCustomerEmail,
          customerPhone: cleanCustomerPhone,
          customerId: userId || `cust_${orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-12)}`,
        });

        if (cfResult.success && cfResult.paymentSessionId) {
          paymentSessionId = cfResult.paymentSessionId;
          cfEnv = cfResult.env || "PROD";
        } else {
          cfErrorMessage = cfResult.error || "Payment session could not be created.";
          console.error("Cashfree order creation failed:", cfResult.error);
        }
      } catch (cfErr: any) {
        cfErrorMessage = cfErr?.message || "Cashfree connection error.";
        console.warn("Cashfree session creation warning:", cfErr);
      }

      if (!paymentSessionId) {
        return NextResponse.json(
          {
            success: false,
            error:
              cfErrorMessage ||
              "Unable to initialize Cashfree payment gateway. Please verify your phone number and try again.",
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
      customerName: cleanCustomerName,
      customerEmail: cleanCustomerEmail,
      customerPhone: cleanCustomerPhone,
      userId,
      items,
      totalAmount: finalAmount,
      currency: "INR",
      paymentMethod: isFree ? "Free Product" : paymentSessionId ? "Cashfree" : paymentMethod,
      paymentStatus,
      licenseKey,
      canvaAccessDelivered: paymentStatus === "completed",
      deliveryNotes: `Online checkout ${appliedCoupon ? `[Coupon: ${appliedCoupon.code} -₹${discountAmount}]` : ""} ${paymentSessionId ? `[Cashfree Session: ${paymentSessionId.slice(0, 16)}...]` : ""}`.trim(),
    });

    // 11. Auto-capture lead
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

    return NextResponse.json({
      success: true,
      paymentRequired: Boolean(paymentSessionId),
      paymentSessionId,
      cfEnv,
      orderId: order.id,
      order: {
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        totalAmount: order.totalAmount,
        discountAmount,
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
        licenseKey: order.licenseKey,
        items: order.items,
        downloadUrl: authoritativeDownloadUrl || `/downloads/${order.id}.zip`,
        canvaUrl: authoritativeCanvaUrl || null,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
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
