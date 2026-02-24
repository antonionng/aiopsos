import { Resend } from "resend";
import { supabaseAdmin } from "./supabase/admin";
import { WelcomeEmail } from "./emails/welcome";
import { InviteEmail } from "./emails/invite";
import { AssessmentInviteEmail } from "./emails/assessment-invite";
import { AssessmentReminderEmail } from "./emails/assessment-reminder";
import { ScoreCardEmail } from "./emails/score-card";
import { AssessmentResultsEmail } from "./emails/assessment-results";
import { AdminAssessmentCompletedEmail } from "./emails/admin-assessment-completed";
import { AdminNewMemberEmail } from "./emails/admin-new-member";
import { ApprovalRequestEmail } from "./emails/approval-request";
import { ApprovalDecisionEmail } from "./emails/approval-decision";
import { RoadmapReadyEmail } from "./emails/roadmap-ready";
import type { DimensionScores } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || "AIOPSOS <noreply@aiopsos.com>",
  };
}

function getResend() {
  return new Resend(getEmailConfig().apiKey);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export async function getOrgAdminEmails(
  orgId: string
): Promise<{ email: string; name: string }[]> {
  const { data } = await supabaseAdmin
    .from("user_profiles")
    .select("email, name")
    .eq("org_id", orgId)
    .in("role", ["admin", "manager", "super_admin"]);

  return data ?? [];
}

// ---------------------------------------------------------------------------
// User-facing emails
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(
  to: string,
  name: string,
  orgName?: string,
  scoreData?: {
    scores: DimensionScores;
    overall: number;
    tierLabel: string;
    insights: string[];
  }
) {
  try {
    const { apiKey, from } = getEmailConfig();
    if (!apiKey) {
      console.warn("[email] RESEND_API_KEY is not set; skipping welcome email");
      return;
    }
    await getResend().emails.send({
      from,
      to,
      subject: scoreData
        ? `Welcome to AIOPSOS — Your AI Readiness Score: ${scoreData.overall.toFixed(1)}/5`
        : "Welcome to AIOPSOS",
      react: WelcomeEmail({
        name,
        orgName,
        dashboardUrl: `${BASE_URL}/dashboard`,
        scores: scoreData?.scores,
        overall: scoreData?.overall,
        tierLabel: scoreData?.tierLabel,
        insights: scoreData?.insights,
      }),
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendTeamInviteEmail(to: string, name: string, inviterName: string) {
  try {
    const { from } = getEmailConfig();
    await getResend().emails.send({
      from,
      to,
      subject: `You're invited to join AIOPSOS`,
      react: InviteEmail({ name, inviterName, loginUrl: `${BASE_URL}/auth/login` }),
    });
  } catch (error) {
    console.error("Failed to send invite email:", error);
  }
}

export async function sendAssessmentResultsEmail(
  to: string,
  name: string,
  scores: DimensionScores,
  overall: number,
  tierLabel: string
) {
  try {
    const { from } = getEmailConfig();
    await getResend().emails.send({
      from,
      to,
      subject: `Your AI Maturity Score: ${overall.toFixed(1)} / 5`,
      react: AssessmentResultsEmail({
        name,
        scores,
        overall,
        tierLabel,
        resultsUrl: `${BASE_URL}/dashboard/my-results`,
      }),
    });
  } catch (error) {
    console.error("Failed to send assessment results email:", error);
  }
}

export async function sendApprovalDecisionEmail(
  to: string,
  requesterName: string,
  reviewerName: string,
  decision: "approved" | "rejected",
  comment?: string
) {
  try {
    const { from } = getEmailConfig();
    await getResend().emails.send({
      from,
      to,
      subject: decision === "approved" ? "Your request was approved" : "Your request was declined",
      react: ApprovalDecisionEmail({
        requesterName,
        reviewerName,
        decision,
        comment,
        dashboardUrl: `${BASE_URL}/dashboard`,
      }),
    });
  } catch (error) {
    console.error("Failed to send approval decision email:", error);
  }
}

export async function sendRoadmapReadyEmail(
  to: string,
  name: string,
  orgName: string,
  phaseCount: number
) {
  try {
    const { from } = getEmailConfig();
    await getResend().emails.send({
      from,
      to,
      subject: "Your 90-Day AI Adoption Roadmap is Ready",
      react: RoadmapReadyEmail({
        name,
        orgName,
        phaseCount,
        roadmapUrl: `${BASE_URL}/dashboard/roadmap`,
      }),
    });
  } catch (error) {
    console.error("Failed to send roadmap ready email:", error);
  }
}

// ---------------------------------------------------------------------------
// Assessment campaign emails
// ---------------------------------------------------------------------------

export async function sendAssessmentInviteEmail(
  to: string,
  recipientName: string,
  orgName: string,
  assessmentTitle: string,
  assessUrl: string
) {
  try {
    const { from } = getEmailConfig();
    await getResend().emails.send({
      from,
      to,
      subject: `${orgName} needs your input — ${assessmentTitle} (5 min)`,
      react: AssessmentInviteEmail({ recipientName, orgName, assessmentTitle, assessUrl }),
    });
  } catch (error) {
    console.error("Failed to send assessment invite email:", error);
  }
}

export async function sendAssessmentReminderEmail(
  to: string,
  recipientName: string,
  orgName: string,
  assessmentTitle: string,
  assessUrl: string,
  completedCount: number,
  totalInvited: number
) {
  try {
    const { from } = getEmailConfig();
    await getResend().emails.send({
      from,
      to,
      subject: `Reminder: ${orgName} ${assessmentTitle}`,
      react: AssessmentReminderEmail({
        recipientName,
        orgName,
        assessmentTitle,
        assessUrl,
        completedCount,
        totalInvited,
      }),
    });
  } catch (error) {
    console.error("Failed to send assessment reminder email:", error);
  }
}

export async function sendScoreCardEmail(
  to: string,
  name: string,
  orgName: string,
  overallScore: number,
  tierLabel: string,
  dimensions: DimensionScores,
  shareUrl: string
) {
  try {
    const { from } = getEmailConfig();
    await getResend().emails.send({
      from,
      to,
      subject: `Your AI Readiness Score: ${overallScore.toFixed(1)} / 5`,
      react: ScoreCardEmail({
        name,
        orgName,
        overallScore,
        tierLabel,
        dimensions,
        resultsUrl: `${BASE_URL}/dashboard/my-results`,
        shareUrl,
      }),
    });
  } catch (error) {
    console.error("Failed to send score card email:", error);
  }
}

// ---------------------------------------------------------------------------
// Admin notification emails
// ---------------------------------------------------------------------------

export async function sendAdminAssessmentCompletedEmail(
  orgId: string,
  orgName: string,
  respondentName: string,
  respondentEmail: string,
  overall: number,
  tierLabel: string,
  department?: string,
  options?: {
    scores?: DimensionScores;
    respondentRole?: string;
    toolsUsed?: string[];
    /** When org has no admin/manager, send to this recipient so the link/assessment creator still gets notified */
    fallbackNotify?: { email: string; name: string };
  }
) {
  try {
    const { apiKey, from } = getEmailConfig();
    if (!apiKey) {
      console.warn("[email] RESEND_API_KEY is not set; skipping admin assessment completed email");
      return;
    }

    const admins = await getOrgAdminEmails(orgId);
    let recipients = admins.length > 0 ? admins : (options?.fallbackNotify ? [options.fallbackNotify] : []);

    // Fallback: org owner
    if (recipients.length === 0) {
      const { data: org } = await supabaseAdmin
        .from("organisations")
        .select("owner_id")
        .eq("id", orgId)
        .single();

      if (org?.owner_id) {
        const { data: owner } = await supabaseAdmin
          .from("user_profiles")
          .select("email, name")
          .eq("id", org.owner_id)
          .single();

        if (owner?.email) {
          recipients = [{ email: owner.email, name: owner.name || "Owner" }];
        }
      }
    }

    // Fallback: platform-level NOTIFY_EMAIL
    if (recipients.length === 0 && process.env.NOTIFY_EMAIL) {
      recipients = [{ email: process.env.NOTIFY_EMAIL, name: "Notify" }];
    }

    if (recipients.length === 0) {
      console.warn(
        `[email] No admin/manager, org owner, or fallbackNotify for org ${orgId}; not sending assessment completed email`
      );
      return;
    }

    console.log(
      `[email] Sending assessment completed email to ${recipients.length} recipient(s):`,
      recipients.map((r) => r.email).join(", ")
    );
    console.log("[email] Using from:", from);

    const resend = getResend();
    const results = await Promise.allSettled(
      recipients.map((admin) =>
        resend.emails.send({
          from,
          to: admin.email,
          subject: `New assessment completed by ${respondentName}`,
          react: AdminAssessmentCompletedEmail({
            adminName: admin.name,
            respondentName,
            respondentEmail,
            department,
            overallScore: overall,
            tierLabel,
            orgName,
            resultsUrl: `${BASE_URL}/dashboard/analytics`,
            dimensionScores: options?.scores,
            respondentRole: options?.respondentRole,
            toolsUsed: options?.toolsUsed,
          }),
        })
      )
    );

    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(`[email] Admin assessment completed send failed (recipient ${recipients[i]?.email}):`, result.reason);
      } else if (result.value?.error) {
        console.error(
          `[email] Resend API error for ${recipients[i]?.email}:`,
          JSON.stringify(result.value.error)
        );
      } else {
        console.log(`[email] Assessment completed email sent to ${recipients[i]?.email}`);
      }
    });
  } catch (error) {
    console.error("Failed to send admin assessment notification:", error);
  }
}

export async function sendAdminNewMemberEmail(
  orgId: string,
  orgName: string,
  memberName: string,
  memberEmail: string,
  department?: string
) {
  try {
    const { from } = getEmailConfig();
    const admins = await getOrgAdminEmails(orgId);
    if (admins.length === 0) return;

    await Promise.allSettled(
      admins.map((admin) =>
        getResend().emails.send({
          from,
          to: admin.email,
          subject: `${memberName} has joined ${orgName}`,
          react: AdminNewMemberEmail({
            adminName: admin.name,
            memberName,
            memberEmail,
            department,
            orgName,
            teamUrl: `${BASE_URL}/dashboard/settings`,
          }),
        })
      )
    );
  } catch (error) {
    console.error("Failed to send admin new member notification:", error);
  }
}

export async function sendApprovalRequestEmail(
  orgId: string,
  requesterName: string,
  contentPreview: string
) {
  try {
    const { from } = getEmailConfig();
    const reviewers = await getOrgAdminEmails(orgId);
    if (reviewers.length === 0) return;

    await Promise.allSettled(
      reviewers.map((reviewer) =>
        getResend().emails.send({
          from,
          to: reviewer.email,
          subject: `Approval request from ${requesterName}`,
          react: ApprovalRequestEmail({
            reviewerName: reviewer.name,
            requesterName,
            contentPreview,
            approvalsUrl: `${BASE_URL}/dashboard/approvals`,
          }),
        })
      )
    );
  } catch (error) {
    console.error("Failed to send approval request email:", error);
  }
}
