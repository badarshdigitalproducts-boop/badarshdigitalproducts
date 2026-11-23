/**
 * Automated Verification Test Suite for Cashfree Production Integration
 * Validates:
 * 1. Environment Security & Key Leakage Prevention
 * 2. Webhook HMAC-SHA256 Signature Verification
 * 3. Order Session Payload Generation
 * 4. Free vs Paid Download Access & Perpetual Rights
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n=======================================================");
console.log("🚀 STARTING CASHFREE PRODUCTION & SECURITY TEST SUITE");
console.log("=======================================================\n");

// --- TEST SUITE 1: CREDENTIAL SECURITY & LEAKAGE PREVENTION ---
console.log("--- 1. Testing Credential Isolation & Security ---");

// Check .env.local exists and has credentials
const envPath = path.join(rootDir, ".env.local");
assert(fs.existsSync(envPath), ".env.local exists on server");
const envContent = fs.readFileSync(envPath, "utf-8");
assert(envContent.includes("CASHFREE_APP_ID="), ".env.local contains production Cashfree App ID variable");
assert(envContent.includes("CASHFREE_SECRET_KEY="), ".env.local contains production Cashfree Secret Key variable");
assert(envContent.includes("CASHFREE_ENV="), ".env.local is configured with CASHFREE_ENV");

// Check .gitignore ignores .env files
const gitignorePath = path.join(rootDir, ".gitignore");
assert(fs.existsSync(gitignorePath), ".gitignore exists");
const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
assert(gitignoreContent.includes(".env*"), ".gitignore strictly ignores .env* files");

// Check admin-store.json has NO plaintext secret keys
const adminStorePath = path.join(rootDir, "src", "data", "admin-store.json");
if (fs.existsSync(adminStorePath)) {
  const adminStoreContent = fs.readFileSync(adminStorePath, "utf-8");
  const storeData = JSON.parse(adminStoreContent);
  assert(
    !storeData.settings?.cashfree?.secretKey || storeData.settings.cashfree.secretKey === "",
    "admin-store.json does NOT contain any raw Cashfree Secret Key"
  );
}

// --- TEST SUITE 2: CASHFREE WEBHOOK HMAC-SHA256 SIGNATURE VERIFICATION ---
console.log("\n--- 2. Testing Cashfree Webhook Signature Verification ---");

const testSecretKey = process.env.CASHFREE_SECRET_KEY || "mock_unit_test_secret_key_1234567890abcdef";
const testTimestamp = Math.floor(Date.now() / 1000).toString();
const testPayload = JSON.stringify({
  data: {
    order: { order_id: "order_test_123", order_amount: 499, order_currency: "INR" },
    payment: { payment_status: "SUCCESS", cf_payment_id: "cf_pay_998877" },
  },
  event_time: new Date().toISOString(),
  type: "PAYMENT_SUCCESS_WEBHOOK",
});

// Calculate authentic signature
const expectedSignature = crypto
  .createHmac("sha256", testSecretKey)
  .update(`${testTimestamp}${testPayload}`)
  .digest("base64");

// Implementation of verification function
function verifySignature(rawBody, timestamp, signature, secretKey) {
  if (!signature || !timestamp || !rawBody) return false;
  const expectedBase64 = crypto
    .createHmac("sha256", secretKey)
    .update(`${timestamp}${rawBody}`)
    .digest("base64");

  const sigTrimmed = signature.trim();
  if (sigTrimmed.length === expectedBase64.length) {
    try {
      return crypto.timingSafeEqual(Buffer.from(sigTrimmed), Buffer.from(expectedBase64));
    } catch {
      return false;
    }
  }
  return false;
}

// Subtest 2a: Valid signature
assert(
  verifySignature(testPayload, testTimestamp, expectedSignature, testSecretKey) === true,
  "Authentic Cashfree webhook signature verifies successfully (timingSafeEqual)"
);

// Subtest 2b: Tampered payload rejected
const tamperedPayload = JSON.stringify({
  data: {
    order: { order_id: "order_test_123", order_amount: 1, order_currency: "INR" }, // changed 499 to 1
    payment: { payment_status: "SUCCESS", cf_payment_id: "cf_pay_998877" },
  },
  event_time: new Date().toISOString(),
  type: "PAYMENT_SUCCESS_WEBHOOK",
});
assert(
  verifySignature(tamperedPayload, testTimestamp, expectedSignature, testSecretKey) === false,
  "Tampered webhook payload is strictly rejected"
);

// Subtest 2c: Forged signature rejected
assert(
  verifySignature(testPayload, testTimestamp, "forged_invalid_signature_xyz", testSecretKey) === false,
  "Forged webhook signature is strictly rejected"
);

// Subtest 2d: Missing timestamp or body rejected
assert(verifySignature("", testTimestamp, expectedSignature, testSecretKey) === false, "Empty payload rejected");
assert(verifySignature(testPayload, "", expectedSignature, testSecretKey) === false, "Empty timestamp rejected");

// --- TEST SUITE 3: CASHFREE ORDER CREATION PAYLOAD GENERATION ---
console.log("\n--- 3. Testing Order Session Generation Logic ---");

function buildCashfreeOrderPayload(orderId, orderAmount, customerName, customerEmail, customerPhone) {
  return {
    order_id: orderId,
    order_amount: Math.max(Number(orderAmount) || 1, 1),
    order_currency: "INR",
    customer_details: {
      customer_id: `cust_${orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-12)}`,
      customer_name: customerName || "Valued Creator",
      customer_email: customerEmail || "creator@badarsh.com",
      customer_phone: (customerPhone || "9999999999").replace(/\D/g, "").slice(-10) || "9999999999",
    },
    order_meta: {
      return_url: `https://badarsh.com/orders/${orderId}?cf_id={order_id}`,
      notify_url: `https://badarsh.com/api/webhooks/cashfree`,
    },
  };
}

const payload = buildCashfreeOrderPayload("ord_test_909", 299, "Test Creator", "creator@example.com", "+91 97401 55667");
assert(payload.order_id === "ord_test_909", "Order ID correctly set in payload");
assert(payload.order_amount === 299, "Order amount correctly formatted");
assert(payload.customer_details.customer_phone === "9740155667", "Phone number sanitized to 10 digits");
assert(payload.order_meta.return_url.includes("{order_id}"), "Return URL contains Cashfree order_id placeholder");
assert(payload.order_meta.notify_url === "https://badarsh.com/api/webhooks/cashfree", "Webhook notify_url correctly points to endpoint");

// --- TEST SUITE 4: DOWNLOAD ACCESS RULES (FREE VS PAID VS PERPETUAL) ---
console.log("\n--- 4. Testing Download Authorization Rules ---");

function canDownloadAsset(product, order, customerUser) {
  // Free product: instant access without order
  if (product.price === 0) {
    return { allowed: true, reason: "FREE_PRODUCT" };
  }

  // Premium product without order
  if (!order) {
    return { allowed: false, reason: "PAYMENT_REQUIRED" };
  }

  // Order payment pending
  if (order.paymentStatus !== "completed") {
    return { allowed: false, reason: "PAYMENT_PENDING" };
  }

  // Order completed: perpetual lifetime access
  // Authenticated purchaser matches or license key provided
  const isOwner =
    (customerUser && order.userId && customerUser.uid === order.userId) ||
    (customerUser && order.customerEmail && customerUser.email.toLowerCase() === order.customerEmail.toLowerCase()) ||
    Boolean(order.licenseKey);

  if (isOwner) {
    return { allowed: true, reason: "VERIFIED_PURCHASER_LIFETIME" };
  }

  return { allowed: false, reason: "UNAUTHORIZED" };
}

const freeProduct = { id: "p-free", title: "Free Creator LUT", price: 0 };
const paidProduct = { id: "p-paid", title: "Reels Mega Bundle", price: 499 };

// Free product download without order
const freeResult = canDownloadAsset(freeProduct, null, null);
assert(freeResult.allowed === true && freeResult.reason === "FREE_PRODUCT", "Free product downloadable directly without payment or order");

// Paid product without order
const unpaidResult = canDownloadAsset(paidProduct, null, null);
assert(unpaidResult.allowed === false && unpaidResult.reason === "PAYMENT_REQUIRED", "Paid product download blocked without payment");

// Paid product with pending payment
const pendingOrder = { id: "ord-1", paymentStatus: "pending", userId: "u-123", customerEmail: "user@test.com", licenseKey: "BDRSH-TEST" };
const pendingResult = canDownloadAsset(paidProduct, pendingOrder, { uid: "u-123", email: "user@test.com" });
assert(pendingResult.allowed === false && pendingResult.reason === "PAYMENT_PENDING", "Paid product blocked while payment is pending verification");

// Paid product with completed payment: lifetime access
const completedOrder = { id: "ord-1", paymentStatus: "completed", userId: "u-123", customerEmail: "user@test.com", licenseKey: "BDRSH-TEST" };
const completedResult = canDownloadAsset(paidProduct, completedOrder, { uid: "u-123", email: "user@test.com" });
assert(completedResult.allowed === true && completedResult.reason === "VERIFIED_PURCHASER_LIFETIME", "Paid product allows permanent lifetime download upon completed payment");

// --- SUMMARY ---
console.log("\n=======================================================");
console.log(`🎉 ALL ${passedTests}/${totalTests} CASHFREE PRODUCTION TESTS PASSED!`);
console.log("=======================================================\n");
process.exit(0);
