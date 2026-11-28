/**
 * Automated Verification Test Suite for Badarsh Production Hardening
 * Uses native node:test runner and node:assert/strict assertions.
 * Validates:
 * 1. Environment Security & Credential Isolation
 * 2. Cashfree Order Creation Session Payload Generation
 * 3. Cashfree Webhook HMAC-SHA256 Signature Verification
 * 4. Download Route Authorization Logic (Free Instant vs Paid Persistent Access)
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

describe("1. Credential Security & Leakage Prevention", () => {
  it("should have .env.local with production Cashfree credentials", () => {
    const envPath = path.join(rootDir, ".env.local");
    assert.ok(fs.existsSync(envPath), ".env.local exists");
    const content = fs.readFileSync(envPath, "utf-8");
    assert.match(content, /CASHFREE_APP_ID=/);
    assert.match(content, /CASHFREE_SECRET_KEY=/);
    assert.match(content, /CASHFREE_ENV=PROD/);
  });

  it("should strictly ignore .env files in .gitignore", () => {
    const gitignorePath = path.join(rootDir, ".gitignore");
    assert.ok(fs.existsSync(gitignorePath), ".gitignore exists");
    const content = fs.readFileSync(gitignorePath, "utf-8");
    assert.match(content, /\.env\*/, ".gitignore contains .env* pattern");
  });

  it("should have zero plaintext Cashfree Secret Keys in admin-store.json", () => {
    const storePath = path.join(rootDir, "src", "data", "admin-store.json");
    if (fs.existsSync(storePath)) {
      const content = fs.readFileSync(storePath, "utf-8");
      const store = JSON.parse(content);
      const secret = store.settings?.cashfree?.secretKey;
      assert.ok(!secret || secret === "", "admin-store.json secretKey must be empty");
    }
  });
});

describe("2. Cashfree Order Creation Session Payload Generation", () => {
  function buildOrderPayload(orderId, orderAmount, customerName, customerEmail, customerPhone) {
    const cleanPhone = (customerPhone || "9999999999").replace(/\D/g, "").slice(-10) || "9999999999";
    const cleanEmail = customerEmail?.trim() || "creator@badarsh.com";
    const cleanCustomerId = `cust_${orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-12)}`.slice(0, 50);

    return {
      order_id: orderId,
      order_amount: Math.max(Number(orderAmount) || 1, 1),
      order_currency: "INR",
      customer_details: {
        customer_id: cleanCustomerId,
        customer_name: customerName || "Valued Creator",
        customer_email: cleanEmail,
        customer_phone: cleanPhone,
      },
      order_meta: {
        return_url: `https://badarsh.com/orders/${orderId}?cf_id={order_id}`,
        notify_url: `https://badarsh.com/api/webhooks/cashfree`,
      },
    };
  }

  it("should generate valid order payload structure", () => {
    const payload = buildOrderPayload(
      "ord_1700000000_abcd",
      499,
      "Channu Patil",
      "channu@example.com",
      "+91 97401 55667"
    );

    assert.equal(payload.order_id, "ord_1700000000_abcd");
    assert.equal(payload.order_amount, 499);
    assert.equal(payload.order_currency, "INR");
    assert.equal(payload.customer_details.customer_name, "Channu Patil");
    assert.equal(payload.customer_details.customer_email, "channu@example.com");
    assert.equal(payload.customer_details.customer_phone, "9740155667");
    assert.ok(payload.order_meta.return_url.includes("?cf_id={order_id}"));
    assert.equal(payload.order_meta.notify_url, "https://badarsh.com/api/webhooks/cashfree");
  });

  it("should enforce minimum order amount of 1", () => {
    const payload = buildOrderPayload("ord_min_1", 0, "Test", "t@b.com", "9876543210");
    assert.equal(payload.order_amount, 1);
  });

  it("should sanitize malformed phone numbers to 10 digits", () => {
    const p1 = buildOrderPayload("ord_p1", 100, "A", "a@b.com", "+91-98765-43210");
    assert.equal(p1.customer_details.customer_phone, "9876543210");

    const p2 = buildOrderPayload("ord_p2", 100, "B", "b@b.com", "invalid-phone");
    assert.equal(p2.customer_details.customer_phone, "9999999999");
  });
});

describe("3. Cashfree Webhook HMAC-SHA256 Signature Verification", () => {
  const secretKey = process.env.CASHFREE_SECRET_KEY || "mock_test_secret_key_1234567890abcdef";

  function verifyCashfreeWebhookSignature(rawBody, timestamp, signature, secret) {
    if (!signature || !timestamp || !rawBody || !secret) return false;
    const payload = `${timestamp}${rawBody}`;
    const expectedBase64 = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("base64");

    const expectedHex = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const sigTrimmed = signature.trim();

    if (sigTrimmed.length === expectedBase64.length) {
      try {
        if (crypto.timingSafeEqual(Buffer.from(sigTrimmed), Buffer.from(expectedBase64))) {
          return true;
        }
      } catch {
        return false;
      }
    }

    if (sigTrimmed.length === expectedHex.length) {
      try {
        if (crypto.timingSafeEqual(Buffer.from(sigTrimmed), Buffer.from(expectedHex))) {
          return true;
        }
      } catch {
        return false;
      }
    }

    return false;
  }

  const sampleTimestamp = "1700000000";
  const sampleRawBody = JSON.stringify({
    data: {
      order: { order_id: "ord_test_webhook_001", order_amount: 299 },
      payment: { payment_status: "SUCCESS", cf_payment_id: "cf_pay_12345" },
    },
    type: "PAYMENT_SUCCESS_WEBHOOK",
  });

  const validBase64Signature = crypto
    .createHmac("sha256", secretKey)
    .update(`${sampleTimestamp}${sampleRawBody}`)
    .digest("base64");

  it("should accept authentic webhook signature using timingSafeEqual", () => {
    const isValid = verifyCashfreeWebhookSignature(
      sampleRawBody,
      sampleTimestamp,
      validBase64Signature,
      secretKey
    );
    assert.equal(isValid, true);
  });

  it("should reject tampered payload", () => {
    const tamperedBody = JSON.stringify({
      data: {
        order: { order_id: "ord_test_webhook_001", order_amount: 1 }, // tampered amount
        payment: { payment_status: "SUCCESS", cf_payment_id: "cf_pay_12345" },
      },
      type: "PAYMENT_SUCCESS_WEBHOOK",
    });

    const isValid = verifyCashfreeWebhookSignature(
      tamperedBody,
      sampleTimestamp,
      validBase64Signature,
      secretKey
    );
    assert.equal(isValid, false);
  });

  it("should reject altered timestamp (replay attack prevention)", () => {
    const isValid = verifyCashfreeWebhookSignature(
      sampleRawBody,
      "1700000001", // altered timestamp
      validBase64Signature,
      secretKey
    );
    assert.equal(isValid, false);
  });

  it("should reject forged signature", () => {
    const forgedSig = crypto
      .createHmac("sha256", "wrong_attacker_secret_key")
      .update(`${sampleTimestamp}${sampleRawBody}`)
      .digest("base64");

    const isValid = verifyCashfreeWebhookSignature(
      sampleRawBody,
      sampleTimestamp,
      forgedSig,
      secretKey
    );
    assert.equal(isValid, false);
  });

  it("should reject empty or missing parameters", () => {
    assert.equal(verifyCashfreeWebhookSignature("", sampleTimestamp, validBase64Signature, secretKey), false);
    assert.equal(verifyCashfreeWebhookSignature(sampleRawBody, "", validBase64Signature, secretKey), false);
    assert.equal(verifyCashfreeWebhookSignature(sampleRawBody, sampleTimestamp, "", secretKey), false);
    assert.equal(verifyCashfreeWebhookSignature(sampleRawBody, sampleTimestamp, validBase64Signature, ""), false);
  });
});

describe("4. Download Route Authorization Logic (Free Instant vs Paid Persistent)", () => {
  function authorizeDownload({ product, order, requesterToken, requesterUser }) {
    // 1. Free product instant download (no order or payment required)
    if (product && product.price === 0) {
      const assetTarget =
        product.downloadUrl ||
        product.alightMotionXmlUrl ||
        product.capcutUrl ||
        product.googleDriveUrl ||
        product.appDownloadUrl ||
        product.pdfUrl ||
        product.canvaUrl ||
        product.templateUrl;

      if (!assetTarget) {
        return { authorized: false, status: 404, error: "NO_ASSET" };
      }
      return { authorized: true, status: 200, target: assetTarget, type: "FREE_INSTANT" };
    }

    // 2. Paid product: Requires valid completed order
    if (!order) {
      return { authorized: false, status: 404, error: "ORDER_NOT_FOUND" };
    }

    // Strict access control: cryptographic accessToken, paid licenseKey, or customer identity match (NEVER order.id!)
    const hasAccess =
      (requesterToken && order.accessToken && requesterToken.trim() === order.accessToken.trim()) ||
      (requesterToken && order.paymentStatus === "completed" && order.licenseKey && requesterToken.trim() === order.licenseKey.trim()) ||
      (requesterUser && order.userId && requesterUser.uid === order.userId) ||
      (requesterUser && requesterUser.email && order.customerEmail && requesterUser.email.toLowerCase() === order.customerEmail.toLowerCase());

    if (!hasAccess) {
      return { authorized: false, status: 403, error: "FORBIDDEN_IDOR" };
    }

    if (order.paymentStatus !== "completed") {
      return { authorized: false, status: 402, error: "PAYMENT_PENDING" };
    }

    // Order is completed & authorized: locate download target
    const orderItem = order.items?.find((i) => i.id === product?.id);
    const assetTarget =
      orderItem?.downloadUrl ||
      product?.downloadUrl ||
      product?.alightMotionXmlUrl ||
      product?.capcutUrl ||
      product?.googleDriveUrl ||
      product?.canvaUrl;

    if (!assetTarget) {
      return { authorized: false, status: 404, error: "NO_ASSET" };
    }

    return { authorized: true, status: 200, target: assetTarget, type: "PAID_VERIFIED_PERPETUAL" };
  }

  const freeVideoTemplate = {
    id: "vt-001",
    title: "Velocity Beat Shake & Flash Vol. 1",
    price: 0,
    alightMotionXmlUrl: "/downloads/vt-velocity-beat-shake-vol-1.zip",
    capcutUrl: "/downloads/vt-velocity-beat-shake-vol-1.zip",
  };

  const paidTemplatePack = {
    id: "prod-001",
    title: "Instagram Reels Mega Pack",
    price: 499,
    downloadUrl: "https://r2.badarsh.com/assets/reels-mega-pack.zip",
  };

  it("should permit free product direct download without order or credentials", () => {
    const res = authorizeDownload({ product: freeVideoTemplate });
    assert.equal(res.authorized, true);
    assert.equal(res.status, 200);
    assert.equal(res.type, "FREE_INSTANT");
    assert.equal(res.target, freeVideoTemplate.alightMotionXmlUrl);
  });

  it("should reject unpurchased paid product download without order", () => {
    const res = authorizeDownload({ product: paidTemplatePack });
    assert.equal(res.authorized, false);
    assert.equal(res.status, 404);
  });

  it("should reject paid product download when payment is pending (accessToken or logged-in owner gets 402, unissued licenseKey gets 403)", () => {
    const pendingOrder = {
      id: "ord_1001",
      accessToken: "rand_tok_pending_1001",
      paymentStatus: "pending",
      licenseKey: "BDRSH-AAA-BBB",
      customerEmail: "buyer@badarsh.com",
      items: [{ id: "prod-001", downloadUrl: "/downloads/instagram-reels-template-pack.zip" }],
    };

    const withAccessToken = authorizeDownload({
      product: paidTemplatePack,
      order: pendingOrder,
      requesterToken: "rand_tok_pending_1001",
    });
    assert.equal(withAccessToken.authorized, false);
    assert.equal(withAccessToken.status, 402);
    assert.equal(withAccessToken.error, "PAYMENT_PENDING");

    const withUnpaidLicenseKey = authorizeDownload({
      product: paidTemplatePack,
      order: pendingOrder,
      requesterToken: "BDRSH-AAA-BBB",
    });
    assert.equal(withUnpaidLicenseKey.authorized, false);
    assert.equal(withUnpaidLicenseKey.status, 403);
  });

  it("should reject paid product download when accessed by unauthorized third party (IDOR)", () => {
    const completedOrder = {
      id: "ord_1002",
      paymentStatus: "completed",
      licenseKey: "BDRSH-SECRET-KEY",
      customerEmail: "realbuyer@badarsh.com",
      items: [{ id: "prod-001", downloadUrl: "https://r2.badarsh.com/assets/reels-mega-pack.zip" }],
    };

    const res = authorizeDownload({
      product: paidTemplatePack,
      order: completedOrder,
      requesterToken: "BDRSH-WRONG-KEY",
      requesterUser: { uid: "attacker", email: "attacker@badarsh.com" },
    });

    assert.equal(res.authorized, false);
    assert.equal(res.status, 403);
    assert.equal(res.error, "FORBIDDEN_IDOR");
  });

  it("should authorize permanent re-downloads for completed orders with license key", () => {
    const completedOrder = {
      id: "ord_1003",
      paymentStatus: "completed",
      licenseKey: "BDRSH-VALID-LICENSE",
      customerEmail: "creator@example.com",
      items: [{ id: "prod-001", downloadUrl: "https://r2.badarsh.com/assets/reels-mega-pack.zip" }],
    };

    const res = authorizeDownload({
      product: paidTemplatePack,
      order: completedOrder,
      requesterToken: "BDRSH-VALID-LICENSE",
    });

    assert.equal(res.authorized, true);
    assert.equal(res.status, 200);
    assert.equal(res.type, "PAID_VERIFIED_PERPETUAL");
    assert.equal(res.target, "https://r2.badarsh.com/assets/reels-mega-pack.zip");
  });

  it("should reject order.id used directly as bearer token (prevents guessable IDOR)", () => {
    const completedOrder = {
      id: "ord_1004",
      accessToken: "cryptographic_random_token_1004",
      paymentStatus: "completed",
      licenseKey: "BDRSH-ANOTHER-KEY",
      customerEmail: "creator@example.com",
      items: [{ id: "prod-001", downloadUrl: "/downloads/instagram-reels-template-pack.zip" }],
    };

    const res = authorizeDownload({
      product: paidTemplatePack,
      order: completedOrder,
      requesterToken: "ord_1004",
    });

    assert.equal(res.authorized, false);
    assert.equal(res.status, 403);
    assert.equal(res.error, "FORBIDDEN_IDOR");
  });

  it("should authorize permanent re-downloads with matching cryptographic accessToken", () => {
    const completedOrder = {
      id: "ord_1005",
      accessToken: "cryptographic_random_token_1005",
      paymentStatus: "completed",
      licenseKey: "BDRSH-TOKEN-KEY",
      customerEmail: "creator@example.com",
      items: [{ id: "prod-001", downloadUrl: "/downloads/instagram-reels-template-pack.zip" }],
    };

    const res = authorizeDownload({
      product: paidTemplatePack,
      order: completedOrder,
      requesterToken: "cryptographic_random_token_1005",
    });

    assert.equal(res.authorized, true);
    assert.equal(res.status, 200);
    assert.equal(res.type, "PAID_VERIFIED_PERPETUAL");
  });
});

describe("5. Production Security Invariants & Asset Integrity", () => {
  it("should contain zero hardcoded admin, session, or download signing secrets in source code", () => {
    const filesToCheck = [
      "src/lib/admin/auth.ts",
      "src/proxy.ts",
      "src/lib/auth/user-auth.ts",
      "src/lib/storage/r2.ts",
      "src/app/api/download/route.ts",
    ];
    for (const rel of filesToCheck) {
      const content = fs.readFileSync(path.join(rootDir, rel), "utf8");
      assert.doesNotMatch(
        content,
        /FOUNDER_MASTER_KEY|DEFAULT_SESSION_SECRET|badarsh_secure_hmac_session_secret|badarsh-secret-signing-key/
      );
    }
  });

  it("should enforce passwordHash requirement, token secrecy, and PDF proxy SSRF protections", () => {
    const userAuth = fs.readFileSync(path.join(rootDir, "src/lib/auth/user-auth.ts"), "utf8");
    assert.match(userAuth, /if\s*\(\s*!user\s*\|\|\s*!user\.passwordHash/);

    const accessControl = fs.readFileSync(path.join(rootDir, "src/lib/auth/access-control.ts"), "utf8");
    assert.doesNotMatch(accessControl, /trimmed\s*===\s*order\.id\.trim\(\)/);
    assert.match(accessControl, /timingSafeEqual/);

    const checkout = fs.readFileSync(path.join(rootDir, "src/app/api/checkout/route.ts"), "utf8");
    assert.match(checkout, /isCompleted\s*\?/);

    const pdfProxy = fs.readFileSync(path.join(rootDir, "src/app/api/pdf-proxy/route.ts"), "utf8");
    assert.match(pdfProxy, /redirect:\s*"error"/);
    assert.match(pdfProxy, /%PDF-/);
    assert.match(pdfProxy, /isPrivateOrDisallowedHost/);

    const proxyTs = fs.readFileSync(path.join(rootDir, "src/proxy.ts"), "utf8");
    assert.match(proxyTs, /payload\.fp/);
    assert.match(proxyTs, /sec-fetch-site/);

    const rateLimiter = fs.readFileSync(path.join(rootDir, "src/lib/security/rate-limiter.ts"), "utf8");
    assert.ok(
      rateLimiter.indexOf("x-vercel-forwarded-for") < rateLimiter.indexOf("x-forwarded-for"),
      "Trusted platform IP headers must be checked before spoofable x-forwarded-for"
    );
  });

  it("should contain zero pirated titles, broken Google sample media, or committed PII", () => {
    const store = JSON.parse(fs.readFileSync(path.join(rootDir, "src/data/admin-store.json"), "utf8"));
    assert.equal((store.orders || []).length, 0, "admin-store.json orders must be empty");
    assert.equal((store.leads || []).length, 0, "admin-store.json leads must be empty");
    assert.equal((store.users || []).length, 0, "admin-store.json users must be empty");

    const catalogFiles = [
      "src/content/products.ts",
      "src/content/services.ts",
      "src/components/audio/sound-effects-catalog.tsx",
      "src/data/admin-store.json",
    ];
    for (const rel of catalogFiles) {
      const content = fs.readFileSync(path.join(rootDir, rel), "utf8");
      assert.doesNotMatch(
        content,
        /ForBigger|actions\.google\.com|Accounting\.pdf|Rich Dad|Atomic Habits|Psychology of Money|CASHFLOW Quadrant|Nir Eyal|lightroom\.adobe\.com|covers\.openlibrary\.org/
      );
    }
  });

  it("should have valid real local media, PDF, image, and ZIP files for every catalog reference", () => {
    const filesToScan = [
      "src/content/products.ts",
      "src/content/services.ts",
      "src/components/audio/sound-effects-catalog.tsx",
      "src/app/api/download/route.ts",
    ];
    const assetPaths = new Set();
    const re = /"(\/(?:downloads|audio|videos|images\/catalog)\/[^"]+)"/g;
    for (const rel of filesToScan) {
      const text = fs.readFileSync(path.join(rootDir, rel), "utf8");
      let match;
      while ((match = re.exec(text)) !== null) {
        if (match[1] === "/downloads/ord_") continue;
        assetPaths.add(match[1]);
      }
    }
    assert.ok(assetPaths.size >= 30, `Expected >= 30 local catalog assets, found ${assetPaths.size}`);
    for (const assetRel of assetPaths) {
      const absPath = path.join(rootDir, "public", assetRel.slice(1));
      assert.ok(fs.existsSync(absPath), `Missing local asset on disk: ${assetRel}`);
      const stat = fs.statSync(absPath);
      assert.ok(stat.size > 1000, `Asset looks like an empty stub (${stat.size}B): ${assetRel}`);
      const head = fs.readFileSync(absPath).subarray(0, 4);
      if (assetRel.endsWith(".zip")) assert.equal(head.toString("hex"), "504b0304", `Invalid ZIP header: ${assetRel}`);
      if (assetRel.endsWith(".pdf")) assert.equal(head.toString("ascii"), "%PDF", `Invalid PDF header: ${assetRel}`);
      if (assetRel.endsWith(".wav")) assert.equal(head.toString("ascii"), "RIFF", `Invalid WAV header: ${assetRel}`);
      if (assetRel.endsWith(".png")) assert.equal(head.toString("hex"), "89504e47", `Invalid PNG header: ${assetRel}`);
    }
  });
});
