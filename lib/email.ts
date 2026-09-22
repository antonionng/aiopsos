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
import { CohortEnrolmentEmail } from "./emails/cohort-enrolment";
import { SessionReminderEmail } from "./emails/session-reminder";
import { CertificateIssuedEmail } from "./emails/certificate-issued";
import { EnquiryReceivedEmail, EnquiryAlertEmail } from "./emails/enquiry-received";
import {
  InsightConfirmEmail,
  InsightNewArticleEmail,
} from "./emails/insight-list";
import { InvoiceEmail } from "./emails/invoice-email";
import type { InvoicePayload } from "./invoices";
import { ContactAlertEmail } from "./emails/contact-alert";
import { ConfirmWelcomeEmail, ResetPasswordEmail } from "./emails/confirm-welcome";
import { SelfServeReceiptEmail } from "./emails/self-serve-receipt";
import { SelfServePurchaseAlertEmail } from "./emails/self-serve-purchase-alert";
import { SelfServeNudgeEmail } from "./emails/self-serve-nudge";
import { SelfServeAccountAlertEmail, SelfServeWelcomeEmail } from "./emails/self-serve-welcome";
import { SelfServeCompletedAlertEmail, SelfServeCompletedEmail } from "./emails/self-serve-completed";
import { SignupAlertEmail } from "./emails/signup-alert";
import { recommendCourses, workNoun } from "./self-serve/upsell";
import { linkedInAddUrl, verifyUrl } from "./self-serve/share-links";
import type { SelfServeNudgeKind } from "./self-serve/nudges";
import { LITERACY_DISCLAIMER } from "./constants";
import { getNotifyEmail } from "./notify-email";
import { getPublicSiteUrl } from "./site";
import type { DimensionScores } from "./types";

const BASE_URL = getPublicSiteUrl();

/**
 * Links in the insights emails point at the public marketing origin, not at
 * BASE_URL. BASE_URL is the app origin and may be an apex or a preview host;
 * `getPublicSiteUrl` normalises to the canonical www host, which is the one
 * the articles are indexed under.
 */
function publicUrl(path: string): string {
  return `${getPublicSiteUrl()}${path}`;
}

function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || "Experrt <noreply@experrt.com>",
  };
}

function getResend() {
  return new Resend(getEmailConfig().apiKey);
}

async function sendEmail(options: Parameters<Resend["emails"]["send"]>[0]) {
  const result = await getResend().emails.send(options);
  if (result.error) throw new Error(`Email delivery rejected: ${result.error.message}`);
  return result;
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
  },
  logoUrl?: string
) {
  try {
    const { apiKey, from } = getEmailConfig();
    if (!apiKey) {
      console.warn("[email] RESEND_API_KEY is not set; skipping welcome email");
      return;
    }
    const subject = scoreData
      ? (orgName
          ? `Thanks for completing your assessment - Your AI Readiness Score: ${scoreData.overall.toFixed(1)}/5`
          : `Your AI Readiness Score: ${scoreData.overall.toFixed(1)}/5`)
      : orgName
        ? `Thanks for joining ${orgName}`
        : "Welcome to Experrt";
    await sendEmail({
      from,
      to,
      subject,
      react: WelcomeEmail({
        name,
        orgName,
        dashboardUrl: `${BASE_URL}/dashboard`,
        logoUrl,
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

export async function sendTeamInviteEmail(to: string, name: string, inviterName: string, inviteUrl: string) {
  const { from } = getEmailConfig();
  await sendEmail({
    from, to,
    subject: "You're invited to join Experrt",
    react: InviteEmail({ name, inviterName, loginUrl: inviteUrl }),
  });
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
    await sendEmail({
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
    await sendEmail({
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
    await sendEmail({
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
    await sendEmail({
      from,
      to,
      subject: `${orgName} needs your input - ${assessmentTitle} (5 min)`,
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
    await sendEmail({
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
    await sendEmail({
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
    logoUrl?: string;
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

    // Fallback: platform-level notify address (NOTIFY_EMAIL, else ag@experrt.com)
    if (recipients.length === 0) {
      recipients = [{ email: getNotifyEmail(), name: "Notify" }];
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
          subject: `New assessment completed - ${orgName}`,
          react: AdminAssessmentCompletedEmail({
            adminName: admin.name,
            respondentName,
            respondentEmail,
            department,
            overallScore: overall,
            tierLabel,
            orgName,
            resultsUrl: `${BASE_URL}/dashboard/analytics`,
            logoUrl: options?.logoUrl,
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
        sendEmail({
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
        sendEmail({
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

// ---------------------------------------------------------------------------
// Academy emails
// ---------------------------------------------------------------------------

export async function sendCohortEnrolmentEmail(
  to: string,
  details: {
    recipientName: string;
    cohortTitle: string;
    courseTitle: string;
    startsOn: string | null;
    timezone: string;
  }
) {
  try {
    const { from } = getEmailConfig();
    await sendEmail({
      from,
      to,
      subject: `You are enrolled: ${details.courseTitle}`,
      react: CohortEnrolmentEmail({
        ...details,
        learningUrl: `${BASE_URL}/dashboard/my-learning`,
      }),
    });
  } catch (error) {
    console.error("Failed to send cohort enrolment email:", error);
  }
}

export async function sendSessionReminderEmail(
  to: string,
  details: {
    recipientName: string;
    sessionTitle: string;
    cohortTitle: string;
    startsAt: string;
    timezone: string;
    location: string | null;
    joinUrl: string | null;
  }
) {
  try {
    const { from } = getEmailConfig();
    await sendEmail({
      from,
      to,
      subject: `Tomorrow: ${details.sessionTitle}`,
      react: SessionReminderEmail({
        ...details,
        learningUrl: `${BASE_URL}/dashboard/my-learning`,
      }),
    });
  } catch (error) {
    console.error("Failed to send session reminder email:", error);
  }
}

export async function sendCertificateIssuedEmail(
  to: string,
  details: {
    recipientName: string;
    courseTitle: string;
    attendancePct: number;
    gradePct: number | null;
    publicRef: string;
  }
) {
  try {
    const { from } = getEmailConfig();
    await sendEmail({
      from,
      to,
      subject: `Certificate issued: ${details.courseTitle}`,
      react: CertificateIssuedEmail({
        recipientName: details.recipientName,
        courseTitle: details.courseTitle,
        attendancePct: details.attendancePct,
        gradePct: details.gradePct,
        verifyUrl: `${BASE_URL}/verify/${details.publicRef}`,
        // The certificate records completion of a course. It is not evidence
        // of compliance, and the email must not imply otherwise.
        disclaimer: LITERACY_DISCLAIMER,
      }),
    });
  } catch (error) {
    console.error("Failed to send certificate issued email:", error);
  }
}

/**
 * The wallet just crossed the low-balance threshold: tell the people who
 * can top it up before AI features stop for the whole org.
 */
export async function sendLowCreditsEmail(orgId: string, balance: number) {
  try {
    const { apiKey, from } = getEmailConfig();
    if (!apiKey) return;
    const admins = await getOrgAdminEmails(orgId);
    if (admins.length === 0) return;

    const { LowCreditsEmail } = await import("./emails/low-credits");
    await sendEmail({
      from,
      to: admins.map((a) => a.email),
      subject: `AI credits running low - ${balance.toLocaleString()} left`,
      react: LowCreditsEmail({
        balance,
        billingUrl: `${BASE_URL}/dashboard/billing`,
      }),
    });
  } catch (error) {
    console.error("Failed to send low-credits email:", error);
  }
}

/**
 * An invoice (or overdue reminder), PDF attached, to the org's billing
 * contact - or all its admins when none is set. Throws on Resend error so
 * lib/invoices can log that delivery failed while keeping the invoice sent.
 */
export async function sendInvoiceEmail(
  recipients: { email: string; name: string }[],
  payload: InvoicePayload,
  pdf: Buffer,
  options: { isReminder?: boolean } = {}
) {
  const { apiKey, from } = getEmailConfig();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not set; skipping invoice email");
    return;
  }
  const to = recipients.map((r) => r.email).filter(Boolean);
  if (to.length === 0) {
    console.warn("[email] invoice has no recipients", payload.invoice_number);
    return;
  }
  await sendEmail({
    from,
    to,
    subject: options.isReminder
      ? `Payment reminder: invoice ${payload.invoice_number}`
      : `Invoice ${payload.invoice_number} from Experrt`,
    react: InvoiceEmail({
      orgName: payload.org.name,
      invoiceNumber: payload.invoice_number,
      totalAmount: payload.total_amount,
      currency: payload.currency,
      dueDate: payload.due_date,
      termsDays: payload.terms_days,
      lines: payload.lines.map((l) => ({
        description: l.description,
        total_amount: l.total_amount,
      })),
      isReminder: options.isReminder,
    }),
    attachments: [
      {
        filename: `${payload.invoice_number}.pdf`,
        content: pdf,
      },
    ],
  });
}

/**
 * A course enquiry: confirm to the enquirer, alert us.
 *
 * Both are attempted independently. A bounced confirmation must not stop the
 * alert reaching us - the lead is the thing that matters.
 */
/**
 * The single signup email: welcome + confirmation in one. Throws on Resend
 * error so the caller can fail the registration visibly rather than leaving
 * an account nobody can activate.
 */
export async function sendConfirmWelcomeEmail(
  to: string,
  name: string,
  organisationName: string | null | undefined,
  confirmUrl: string
) {
  const { from } = getEmailConfig();
  const { error } = await sendEmail({
    from,
    to,
    subject: organisationName
      ? `Confirm your email to join ${organisationName} on Experrt`
      : "Confirm your email to get started with Experrt",
    react: ConfirmWelcomeEmail({ name, organisationName, confirmUrl }),
  });
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
}

/** Branded password reset. Throws on Resend error. */
export async function sendResetPasswordEmail(to: string, resetUrl: string) {
  const { from } = getEmailConfig();
  const { error } = await sendEmail({
    from,
    to,
    subject: "Reset your Experrt password",
    react: ResetPasswordEmail({ resetUrl }),
  });
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
}

function courseBase(origin?: string | null): string {
  return (origin ?? getPublicSiteUrl()).replace(/\/$/, "");
}

/** Customer emails come from a no-reply sender, so replies reach the owner inbox. */
function customerReplyTo(): string {
  return getNotifyEmail();
}

export async function sendSelfServeReceipt(details: {
  email: string;
  name?: string | null;
  courseSlug: string;
  courseTitle: string;
  artefactTitle?: string | null;
  amountGbp: number;
  paidAt?: string | null;
  learnUrl: string;
  accountUrl: string;
  hasAccount: boolean;
  owned?: string[];
  origin?: string | null;
}) {
  const { apiKey, from } = getEmailConfig();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not set; skipping self-serve receipt");
    return;
  }
  const base = courseBase(details.origin);
  await sendEmail({
    from,
    to: details.email,
    replyTo: customerReplyTo(),
    subject: `Thank you. Your place on ${details.courseTitle} is confirmed`,
    react: SelfServeReceiptEmail({
      ...details,
      base,
      picks: recommendCourses(details.courseSlug, details.owned),
    }),
  });
}

export async function sendSelfServePurchaseAlert(details: {
  email: string;
  name?: string | null;
  courseTitle: string;
  amountGbp: number;
  paidAt?: string | null;
  hasAccount: boolean;
  stripeSessionId: string;
}) {
  const { apiKey, from } = getEmailConfig();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not set; skipping self-serve purchase alert");
    return;
  }
  const notify = getNotifyEmail();
  const who = details.name?.trim() ? `${details.name.trim()} (${details.email})` : details.email;
  await sendEmail({
    from,
    to: notify,
    replyTo: details.email,
    subject: `Course purchase: ${details.courseTitle}, bought by ${who}`,
    react: SelfServePurchaseAlertEmail(details),
  });
}

export async function sendSelfServeWelcome(details: {
  email: string;
  name?: string | null;
  courseSlug?: string | null;
  courseTitle?: string | null;
  accountUrl: string;
  owned?: string[];
}) {
  const { apiKey, from } = getEmailConfig();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not set; skipping learner welcome");
    return;
  }
  await sendEmail({
    from,
    to: details.email,
    replyTo: customerReplyTo(),
    subject: "Welcome to Experrt. Your sign-in is saved",
    react: SelfServeWelcomeEmail({
      ...details,
      base: courseBase(),
      picks: recommendCourses(details.courseSlug, details.owned),
    }),
  });
}

export async function sendSelfServeAccountAlert(details: {
  email: string;
  name?: string | null;
  courseTitle?: string | null;
}) {
  const { apiKey, from } = getEmailConfig();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not set; skipping learner account alert");
    return;
  }
  const who = details.name?.trim() ? `${details.name.trim()} (${details.email})` : details.email;
  await sendEmail({
    from,
    to: getNotifyEmail(),
    replyTo: details.email,
    subject: `New learner account: ${who}`,
    react: SelfServeAccountAlertEmail(details),
  });
}

/**
 * The learner's completion email and the owner's alert. Sent independently
 * so a bounced learner address never hides the completion from the owner.
 */
export async function sendSelfServeCompleted(details: {
  email: string;
  name: string;
  courseSlug: string;
  courseTitle: string;
  artefactTitle: string;
  certificateRef: string;
  signedAt: string;
  owned?: string[];
}) {
  const { apiKey, from } = getEmailConfig();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not set; skipping completion emails");
    return;
  }
  const base = courseBase();
  const verify = verifyUrl(details.certificateRef);
  const results = await Promise.allSettled([
    sendEmail({
      from,
      to: details.email,
      replyTo: customerReplyTo(),
      subject: `Well done. ${details.courseTitle} is complete`,
      react: SelfServeCompletedEmail({
        name: details.name,
        courseTitle: details.courseTitle,
        artefactTitle: details.artefactTitle,
        certificateRef: details.certificateRef,
        verifyUrl: verify,
        certificateUrl: `${base}/learn/${details.courseSlug}/certificate`,
        linkedInUrl: linkedInAddUrl(details.courseTitle, details.certificateRef, details.signedAt),
        base,
        picks: recommendCourses(details.courseSlug, details.owned),
      }),
    }),
    sendEmail({
      from,
      to: getNotifyEmail(),
      replyTo: details.email,
      subject: `Course completed: ${details.courseTitle}, by ${details.name}`,
      react: SelfServeCompletedAlertEmail({
        name: details.name,
        email: details.email,
        courseTitle: details.courseTitle,
        certificateRef: details.certificateRef,
        verifyUrl: verify,
      }),
    }),
  ]);
  for (const result of results) {
    if (result.status === "rejected") console.error("[email] completion mail", result.reason);
  }
}

const NUDGE_SUBJECT: Record<
  SelfServeNudgeKind,
  (title: string, work: string, next: string | null) => string
> = {
  start: (title) => `Your first lesson on ${title} is ready`,
  continue: (title) => `Pick up where you left off on ${title}`,
  sign: (title, work) => `One step left: sign your ${work} for ${title}`,
  next: (title, _work, next) =>
    next ? `After ${title}: ${next} is the natural next step` : `Your next course after ${title}`,
};

export async function sendSelfServeNudge(details: {
  email: string;
  kind: SelfServeNudgeKind;
  courseSlug: string;
  courseTitle: string;
  artefactTitle?: string | null;
  name?: string | null;
  learnUrl: string;
  passed: number;
  total: number;
  owned?: string[];
  unsubscribeUrl?: string;
}) {
  const { apiKey, from } = getEmailConfig();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not set; skipping self-serve nudge");
    return false;
  }
  const picks = details.kind === "next" ? recommendCourses(details.courseSlug, details.owned, 3) : [];
  if (details.kind === "next" && picks.length === 0) return false;
  const work = workNoun(details.artefactTitle);
  await sendEmail({
    from,
    to: details.email,
    replyTo: customerReplyTo(),
    subject: NUDGE_SUBJECT[details.kind](details.courseTitle, work, picks[0]?.title ?? null),
    react: SelfServeNudgeEmail({ ...details, base: courseBase(), picks }),
    ...(details.unsubscribeUrl
      ? {
          headers: {
            "List-Unsubscribe": `<${details.unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }
      : {}),
  });
  return true;
}

export async function sendSignupAlert(details: {
  name: string;
  email: string;
  organisationName?: string | null;
}) {
  const { apiKey, from } = getEmailConfig();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not set; skipping signup alert");
    return;
  }
  await sendEmail({
    from,
    to: getNotifyEmail(),
    replyTo: details.email,
    subject: `New sign-up: ${details.name || details.email}${details.organisationName ? `, ${details.organisationName}` : ""}`,
    react: SignupAlertEmail(details),
  });
}

export async function sendContactAlert(details: {
  name: string;
  email: string;
  message: string;
}) {
  const { from } = getEmailConfig();
  const notify = getNotifyEmail();
  console.log("[email] contact notify-to", notify);

  const { error } = await sendEmail({
    from,
    to: notify,
    replyTo: details.email,
    subject: `Contact form: ${details.name}`,
    react: ContactAlertEmail(details),
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}

export async function sendEnquiryEmails(details: {
  name: string;
  email: string;
  organisationName: string;
  message: string;
  seats: number | null;
  courseTitle: string | null;
  courseSlug: string | null;
  source: string;
}) {
  const { from } = getEmailConfig();
  const notify = getNotifyEmail();
  console.log("[email] enquiry notify-to", notify);

  await Promise.allSettled([
    sendEmail({
      from,
      to: details.email,
      subject: details.courseTitle
        ? `We have your enquiry about ${details.courseTitle}`
        : "We have your training enquiry",
      react: EnquiryReceivedEmail({
        recipientName: details.name,
        courseTitle: details.courseTitle,
      }),
    }),
    sendEmail({
      from,
      to: notify,
      replyTo: details.email,
      subject: details.courseTitle
        ? `Enquiry: ${details.courseTitle} - ${details.organisationName || details.name}`
        : `Training enquiry - ${details.organisationName || details.name}`,
      react: EnquiryAlertEmail({
        name: details.name,
        email: details.email,
        organisationName: details.organisationName,
        courseTitle: details.courseTitle,
        seats: details.seats,
        message: details.message,
        source: details.source,
      }),
    }),
  ]);
}

// ---------------------------------------------------------------------------
// Insights list
// ---------------------------------------------------------------------------

/**
 * Step two of the double opt-in. Nothing else is ever sent to an address
 * that has not come back through this link.
 */
export async function sendInsightConfirmationEmail(
  to: string,
  confirmToken: string
) {
  const { from } = getEmailConfig();

  await sendEmail({
    from,
    to,
    subject: "Confirm your Experrt insights subscription",
    react: InsightConfirmEmail({
      confirmUrl: publicUrl(`/insights/confirm?token=${confirmToken}`),
    }),
  });
}

/**
 * One new-article email to one confirmed subscriber.
 *
 * Sent per recipient rather than as one message with everyone in `bcc`, so
 * each carries its own unsubscribe link. A shared bcc send cannot do that,
 * and an unsubscribe link that unsubscribes the wrong person is worse than
 * none. The caller is responsible for pacing the loop.
 */
export async function sendInsightArticleEmail(
  to: string,
  article: {
    slug: string;
    title: string;
    dek: string;
    topic: string;
    readingMinutes: number;
  },
  unsubscribeToken: string
) {
  const { from } = getEmailConfig();
  const unsubscribeUrl = publicUrl(
    `/insights/unsubscribe?token=${unsubscribeToken}`
  );

  await sendEmail({
    from,
    to,
    subject: article.title,
    // List-Unsubscribe lets Gmail and Outlook show their own unsubscribe
    // control next to the sender name. Readers who use it never mark the
    // message as spam instead, which is what protects the sending domain.
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    react: InsightNewArticleEmail({
      title: article.title,
      dek: article.dek,
      topic: article.topic,
      readingMinutes: article.readingMinutes,
      articleUrl: publicUrl(`/insights/${article.slug}`),
      unsubscribeUrl,
    }),
  });
}

/**
 * Sends every sample in `lib/email-samples` to one inbox, each subject marked
 * as a test. Used by the owner's email check in platform administration.
 */
export async function sendEmailSamples(to: string, ids?: string[]) {
  const { apiKey, from } = getEmailConfig();
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const { emailSamples } = await import("./email-samples");
  const samples = emailSamples().filter((sample) => !ids?.length || ids.includes(sample.id));
  const results: { id: string; ok: boolean; error?: string }[] = [];
  for (const [index, sample] of samples.entries()) {
    // Resend allows two requests a second on the default plan.
    if (index > 0) await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      await sendEmail({
        from,
        to,
        subject: `[Test] ${sample.subject}`,
        react: sample.element,
      });
      results.push({ id: sample.id, ok: true });
    } catch (error) {
      results.push({ id: sample.id, ok: false, error: error instanceof Error ? error.message : String(error) });
    }
  }
  return results;
}
