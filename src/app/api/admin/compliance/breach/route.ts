import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/access-control";
import {
  generateIncidentId,
  DEFAULT_DPO_CONTACT,
  queryAffectedUsers,
  generateDPBIReportPayload,
  generateUserBreachAdvisoryEmail,
  executeBreachNotificationPlan,
  type BreachIncident,
  type BreachTargetCriteria,
} from "@/lib/compliance/breach-notifier";
import { getDatabase } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/compliance/breach
 * Returns DPDP Act Section 8(6) readiness status, incident defaults, and audit logs.
 */
export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  try {
    const db = await getDatabase();
    const users = db.users || [];
    const validUsers = users.filter(
      (u) =>
        u.email &&
        !u.email.startsWith("anonymized-") &&
        !u.email.includes("@badarsh.local")
    );

    const auditLogs = db.auditLogs || [];
    const breachAuditLogs = auditLogs.filter(
      (a) =>
        a.action === "DPDP_BREACH_NOTIFICATION_SIMULATION" ||
        a.action === "DPDP_STATUTORY_BREACH_NOTIFICATION_DISPATCH" ||
        a.action === "DPDP_RIGHT_TO_ERASURE_PURGE"
    );

    const now = new Date().toISOString();

    const sampleIncident: BreachIncident = {
      incidentId: generateIncidentId(),
      detectedAt: now,
      occurredAt: now,
      severity: "high",
      category: "unauthorized_access",
      summary:
        "Suspicious API access pattern detected on legacy session token endpoint resulting in potential metadata enumeration.",
      affectedDataCategories: ["Account Full Name", "Registered Email Address"],
      unaffectedDataCategories: [
        "Payment Card Numbers & CVVs (Never stored)",
        "UPI PINs & Bank Account Access (Never stored)",
        "Salted Password Hashes (Argon2/PBKDF2 encrypted, uncompromised)",
      ],
      affectedUserCount: validUsers.length,
      rootCause:
        "Rate-limit evasion attempt targeted at token verification endpoint; patched immediately within 45 minutes.",
      containmentActions: [
        "Revoked all existing customer active authentication session cookies",
        "Enforced mandatory password re-verification on next login attempt",
        "Implemented strict Cloudflare edge IP-rate limiting (10 req/min per IP)",
        "Rotated internal HMAC signing secrets across all environment worker runtimes",
      ],
      recommendedUserActions: [
        "Verify your BADARSH account credentials and set a fresh, strong password",
        "Review your recent orders to ensure no unauthorized activity",
        "Be alert to any phishing emails claiming to be from BADARSH or payment gateways",
      ],
      dpoContact: DEFAULT_DPO_CONTACT,
      status: "contained",
    };

    return NextResponse.json({
      success: true,
      complianceStandard: "DPDP Act, 2023 (Section 8(6)) & CERT-In Directives",
      metrics: {
        totalRegisteredUsers: validUsers.length,
        anonymizedUsersCount: users.length - validUsers.length,
        totalOrdersCount: db.orders?.length || 0,
        breachLogsCount: breachAuditLogs.length,
      },
      dpoContact: DEFAULT_DPO_CONTACT,
      templateIncident: sampleIncident,
      recentAuditLogs: breachAuditLogs.slice(0, 10),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to load breach compliance status: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/compliance/breach
 * Handles statutory preview, simulation, and live dispatch of breach notifications.
 */
export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const action = body.action || "preview";
    const incident: BreachIncident = body.incident;
    const dryRun = body.dryRun !== false; // default true for safety
    const targetCriteria: BreachTargetCriteria = body.targetCriteria || {};

    if (!incident || !incident.incidentId || !incident.summary) {
      return NextResponse.json(
        { error: "Missing required incident fields (incidentId, summary)." },
        { status: 400 }
      );
    }

    if (action === "dpbi_report") {
      const users = await queryAffectedUsers(targetCriteria);
      const report = generateDPBIReportPayload(incident, users.length);
      return NextResponse.json({ success: true, dpbiReportPayload: report });
    }

    if (action === "sample_email") {
      const sampleUser = { name: "Sample User", email: "user@example.com" };
      const email = generateUserBreachAdvisoryEmail(sampleUser, incident);
      return NextResponse.json({ success: true, email });
    }

    // Default: execute notification plan (preview / live)
    const result = await executeBreachNotificationPlan(incident, {
      dryRun,
      targetCriteria,
      operatorId: "admin",
    });

    return NextResponse.json({
      success: true,
      actionExecuted: dryRun ? "simulation_preview" : "statutory_dispatch",
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process breach notification: " + error.message },
      { status: 500 }
    );
  }
}
