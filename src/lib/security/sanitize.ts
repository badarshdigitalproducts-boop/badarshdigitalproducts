/**
 * Input sanitization, bot-trap (honeypot) validation, and XSS defense utilities
 */

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Strips HTML tags, trims whitespace, and limits text length to prevent XSS and payload stuffing.
 */
export function sanitizeText(input: unknown, maxLength: number = 1000): string {
  if (typeof input !== "string") return "";

  // Strip script, style, and HTML tags
  let cleaned = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ""); // strip ASCII control chars

  // Normalize Unicode and whitespace
  cleaned = cleaned.trim().replace(/\s+/g, " ");

  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }

  return cleaned;
}

/**
 * Validates and normalizes an email address. Returns null if invalid.
 */
export function sanitizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim().toLowerCase();

  if (trimmed.length > 254 || !EMAIL_REGEX.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * Strips non-digit characters from phone numbers while preserving leading '+'.
 */
export function sanitizePhone(input: unknown): string {
  if (typeof input !== "string") return "";
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) return "";
  return hasPlus ? `+${digits.slice(0, 15)}` : digits.slice(0, 15);
}

/**
 * Validates honeypot fields to silently block automated spambots.
 * If any trap field contains text, it was filled by a bot!
 */
export function isHoneypotTriggered(
  data: Record<string, any>,
  trapFields: string[] = ["_hp_trap", "hp_website", "bot_check", "middle_name"]
): boolean {
  for (const field of trapFields) {
    if (data[field] !== undefined && data[field] !== null && String(data[field]).trim() !== "") {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a form was submitted unnaturally fast (e.g. less than 600ms after load),
 * which is a definitive indicator of an automated script or scraper.
 */
export function isSubmissionUnnaturallyFast(
  renderedTimestamp: unknown,
  minDurationMs: number = 600
): boolean {
  if (!renderedTimestamp) return false;
  const startTime = Number(renderedTimestamp);
  if (isNaN(startTime) || startTime <= 0) return false;

  const duration = Date.now() - startTime;
  return duration > 0 && duration < minDurationMs;
}
