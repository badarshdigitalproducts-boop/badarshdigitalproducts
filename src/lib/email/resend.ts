import { Resend } from "resend";
import type { OrderRecord } from "@/lib/admin/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.badarsh.com";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || "BADARSH Studio <orders@badarsh.com>";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendOrderConfirmationEmail(
  order: OrderRecord
): Promise<{ sent: boolean; id?: string; reason?: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }
  const to = order.customerEmail?.trim();
  if (!to || !to.includes("@")) {
    return { sent: false, reason: "Invalid customer email" };
  }

  const orderToken = order.accessToken || order.licenseKey;
  const orderLink = orderToken
    ? `${SITE_URL}/orders/${encodeURIComponent(order.id)}?token=${encodeURIComponent(orderToken)}`
    : `${SITE_URL}/orders/${encodeURIComponent(order.id)}`;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<li style="margin:6px 0;"><strong>${escapeHtml(item.title)}</strong> &times; ${item.quantity} — &#8377;${item.price}</li>`
    )
    .join("");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827; background: #ffffff;">
      <h1 style="font-size: 20px; margin: 0 0 8px;">Your BADARSH Order Is Ready</h1>
      <p style="font-size: 14px; color: #4b5563; margin: 0 0 20px;">Hi ${escapeHtml(order.customerName || "Creator")}, thank you for your order with BADARSH.</p>
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-size: 13px;"><strong>Order ID:</strong> ${escapeHtml(order.id)}</p>
        <p style="margin: 0 0 8px; font-size: 13px;"><strong>License Key:</strong> <code style="background:#eef2ff;padding:2px 6px;border-radius:4px;">${escapeHtml(order.licenseKey)}</code></p>
        <p style="margin: 0; font-size: 13px;"><strong>Total Paid:</strong> &#8377;${order.totalAmount}</p>
      </div>
      <h2 style="font-size: 15px; margin: 0 0 8px;">Items Unlocked</h2>
      <ul style="padding-left: 18px; margin: 0 0 24px; font-size: 14px;">${itemsHtml}</ul>
      <a href="${orderLink}" style="display: inline-block; background: #111827; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 20px; border-radius: 8px;">Download Your Assets</a>
      <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">If the button doesn't open, paste this link in your browser:<br />${escapeHtml(orderLink)}</p>
      <p style="font-size: 12px; color: #6b7280; margin-top: 12px;">Need help? Reply to this email or visit ${SITE_URL}/about</p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: getFromAddress(),
      to: [to],
      subject: `Order Confirmed (${order.id}) — Download Your BADARSH Assets`,
      html,
    });
    if (result.error) {
      console.warn("Resend order confirmation warning:", result.error.message);
      return { sent: false, reason: result.error.message };
    }
    return { sent: true, id: result.data?.id };
  } catch (err) {
    console.warn("Resend order email error:", (err as Error).message);
    return { sent: false, reason: (err as Error).message };
  }
}

export async function sendNewsletterWelcomeEmail(
  email: string
): Promise<{ sent: boolean; id?: string; reason?: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827;">
      <h1 style="font-size: 20px; margin: 0 0 8px;">Welcome to BADARSH Creator Club</h1>
      <p style="font-size: 14px; color: #4b5563; margin: 0 0 18px;">You're subscribed! Explore our free creator sound effects, LUT/preset starter kits, and digital creator tools anytime:</p>
      <ul style="padding-left: 18px; font-size: 14px; margin: 0 0 22px;">
        <li style="margin:6px 0;"><a href="${SITE_URL}/sound-effects" style="color:#4f46e5;">Royalty-Free Sound Effects Library</a></li>
        <li style="margin:6px 0;"><a href="${SITE_URL}/video-templates" style="color:#4f46e5;">Reels &amp; Motion Video Templates</a></li>
        <li style="margin:6px 0;"><a href="${SITE_URL}/templates" style="color:#4f46e5;">Social &amp; Pitch Deck Design Templates</a></li>
      </ul>
      <p style="font-size: 12px; color: #6b7280;">You can manage preferences or unsubscribe anytime at ${SITE_URL}.</p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: getFromAddress(),
      to: [email],
      subject: "Welcome to BADARSH — Your Free Creator Vault",
      html,
    });
    if (result.error) {
      return { sent: false, reason: result.error.message };
    }
    return { sent: true, id: result.data?.id };
  } catch (err) {
    return { sent: false, reason: (err as Error).message };
  }
}
