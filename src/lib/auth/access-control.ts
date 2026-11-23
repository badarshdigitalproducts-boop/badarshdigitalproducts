import { NextResponse } from "next/server";
import { verifyUserSessionToken, USER_COOKIE_NAME } from "@/lib/auth/user-auth";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import type { OrderRecord } from "@/lib/admin/types";

export interface AuthenticatedUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
}

/**
 * Extracts and cryptographically verifies the creator user session from Request cookies.
 * Returns null if the cookie is absent, tampered with, or expired.
 */
export function getAuthenticatedUser(request: Request): AuthenticatedUser | null {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`${USER_COOKIE_NAME}=([^;]+)`));
    const token = match ? match[1] : undefined;
    return verifyUserSessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Checks if the request carries a valid, cryptographically verified admin session.
 */
export function isAdminAuthenticated(request: Request): boolean {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
    return verifySessionToken(match ? match[1] : undefined);
  } catch {
    return false;
  }
}

/**
 * Enforces that the request is authenticated and that authenticatedUser.uid strictly matches targetUserId.
 * Under India's DPDP Act, this eliminates Insecure Direct Object References (IDOR) preventing user enumeration.
 */
export function requireOwnership(
  request: Request,
  targetUserId: string
): { authorized: true; user: AuthenticatedUser } | { authorized: false; response: NextResponse } {
  // Admins can manage any resource for compliance/support
  if (isAdminAuthenticated(request)) {
    return {
      authorized: true,
      user: {
        uid: "admin",
        email: "admin@badarsh.com",
        displayName: "System Administrator",
      },
    };
  }

  const user = getAuthenticatedUser(request);
  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Active session required to access this resource." },
        { status: 401 }
      ),
    };
  }

  if (user.uid !== targetUserId) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error:
            "Forbidden: You do not have permission to access or modify another user's personal data (DPDP Act IDOR Protection).",
        },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user };
}

/**
 * Validates ownership of an order to prevent IDOR order enumeration.
 * Verifies that the order's customerEmail matches the authenticated user, or that the request
 * has an admin session or order secret token.
 */
export function canAccessOrder(
  request: Request,
  order: OrderRecord,
  orderSecretToken?: string | null
): boolean {
  // 1. Admin can access all orders
  if (isAdminAuthenticated(request)) return true;

  // 2. Order secret token (license key or explicit fulfillment token)
  if (orderSecretToken && order.licenseKey) {
    if (
      orderSecretToken.trim() === order.licenseKey.trim() ||
      orderSecretToken.trim() === order.id.trim()
    ) {
      return true;
    }
  }

  // 3. Authenticated customer whose email matches order.customerEmail
  const user = getAuthenticatedUser(request);
  if (user && user.email && order.customerEmail) {
    if (user.email.toLowerCase().trim() === order.customerEmail.toLowerCase().trim()) {
      return true;
    }
  }

  return false;
}
