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

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || "AIOPSOS <noreply@aiopsos.com>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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
    .in("role", ["admin", "manager"]);

  return data ?? [];
}

// ---------------------------------------------------------------------------
// User-facing emails
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(to: string, name: string, orgName?: string) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "Welcome to AIOPSOS",
      react: WelcomeEmail({ name, orgName, dashboardUrl: `${BASE_URL}/dashboard` }),
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendTeamInviteEmail(to: string, name: string, inviterName: string) {
  try {
    await resend.emails.send({
      from: FROM,
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
    await resend.emails.send({
      from: FROM,
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
    await resend.emails.send({
      from: FROM,
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
    await resend.emails.send({
      from: FROM,
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
    await resend.emails.send({
      from: FROM,
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
    await resend.emails.send({
      from: FROM,
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
    await resend.emails.send({
      from: FROM,
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
  department?: string
) {
  try {
    const admins = await getOrgAdminEmails(orgId);
    if (admins.length === 0) return;

    await Promise.allSettled(
      admins.map((admin) =>
        resend.emails.send({
          from: FROM,
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
          }),
        })
      )
    );
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
    const admins = await getOrgAdminEmails(orgId);
    if (admins.length === 0) return;

    await Promise.allSettled(
      admins.map((admin) =>
        resend.emails.send({
          from: FROM,
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
    const reviewers = await getOrgAdminEmails(orgId);
    if (reviewers.length === 0) return;

    await Promise.allSettled(
      reviewers.map((reviewer) =>
        resend.emails.send({
          from: FROM,
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
