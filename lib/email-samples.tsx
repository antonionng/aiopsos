import * as React from "react";
import { ConfirmWelcomeEmail, ResetPasswordEmail } from "./emails/confirm-welcome";
import { SelfServeReceiptEmail } from "./emails/self-serve-receipt";
import { SelfServePurchaseAlertEmail } from "./emails/self-serve-purchase-alert";
import { SelfServeAccountAlertEmail, SelfServeWelcomeEmail } from "./emails/self-serve-welcome";
import { SelfServeCompletedAlertEmail, SelfServeCompletedEmail } from "./emails/self-serve-completed";
import { SelfServeNudgeEmail } from "./emails/self-serve-nudge";
import { SignupAlertEmail } from "./emails/signup-alert";
import { SELF_SERVE_COURSES } from "./self-serve/catalog";
import { courseArtefact } from "./self-serve/engine";
import { recommendCourses, workNoun } from "./self-serve/upsell";
import { linkedInAddUrl, verifyUrl } from "./self-serve/share-links";
import { getPublicSiteUrl } from "./site";

export type EmailSample = {
  id: string;
  audience: "Customer" | "Owner";
  trigger: string;
  subject: string;
  element: React.ReactElement;
};

/**
 * One example of every email a learner or the owner receives, built from the
 * real templates and a real course so a test send shows exactly what goes out.
 */
export function emailSamples(): EmailSample[] {
  const base = getPublicSiteUrl().replace(/\/$/, "");
  const course =
    SELF_SERVE_COURSES.find((c) => c.slug === "prompt-engineering-for-professional-work") ??
    SELF_SERVE_COURSES[0];
  const artefact = courseArtefact(course)?.title ?? "Final work";
  const work = workNoun(artefact);
  const picks = recommendCourses(course.slug);
  const buyer = { name: "Sam Taylor", email: "sam.taylor@example.com" };
  const now = new Date().toISOString();
  const ref = "EXP-TEST-0001";
  const learnUrl = `${base}/learn/${course.slug}`;
  const accountUrl = `${base}/learn/my-courses`;
  const amountGbp = course.priceGbp;

  return [
    {
      id: "signup-confirm",
      audience: "Customer",
      trigger: "Someone signs up to the AI LMS at /signup.",
      subject: "Confirm your email to join Northwind on Experrt",
      element: (
        <ConfirmWelcomeEmail name={buyer.name} organisationName="Northwind" confirmUrl={`${base}/login`} />
      ),
    },
    {
      id: "signup-alert",
      audience: "Owner",
      trigger: "Someone signs up to the AI LMS at /signup.",
      subject: `New sign-up: ${buyer.name}, Northwind`,
      element: <SignupAlertEmail name={buyer.name} email={buyer.email} organisationName="Northwind" />,
    },
    {
      id: "password-reset",
      audience: "Customer",
      trigger: "A user chooses Forgot password.",
      subject: "Reset your Experrt password",
      element: <ResetPasswordEmail resetUrl={`${base}/reset-password`} />,
    },
    {
      id: "receipt",
      audience: "Customer",
      trigger: "Stripe confirms payment for a self-paced course.",
      subject: `Thank you. Your place on ${course.title} is confirmed`,
      element: (
        <SelfServeReceiptEmail
          name={buyer.name}
          courseTitle={course.title}
          artefactTitle={artefact}
          amountGbp={amountGbp}
          paidAt={now}
          learnUrl={learnUrl}
          accountUrl={accountUrl}
          hasAccount={false}
          picks={picks}
          base={base}
        />
      ),
    },
    {
      id: "purchase-alert",
      audience: "Owner",
      trigger: "Stripe confirms payment for a self-paced course.",
      subject: `Course purchase: ${course.title}, bought by ${buyer.name} (${buyer.email})`,
      element: (
        <SelfServePurchaseAlertEmail
          email={buyer.email}
          name={buyer.name}
          courseTitle={course.title}
          amountGbp={amountGbp}
          paidAt={now}
          hasAccount={false}
          stripeSessionId="cs_test_sample"
        />
      ),
    },
    {
      id: "learner-welcome",
      audience: "Customer",
      trigger: "A buyer saves a password after checkout.",
      subject: "Welcome to Experrt. Your sign-in is saved",
      element: (
        <SelfServeWelcomeEmail
          name={buyer.name}
          email={buyer.email}
          courseTitle={course.title}
          accountUrl={accountUrl}
          picks={picks}
          base={base}
        />
      ),
    },
    {
      id: "learner-account-alert",
      audience: "Owner",
      trigger: "A buyer saves a password after checkout.",
      subject: `New learner account: ${buyer.name} (${buyer.email})`,
      element: <SelfServeAccountAlertEmail name={buyer.name} email={buyer.email} courseTitle={course.title} />,
    },
    {
      id: "nudge-start",
      audience: "Customer",
      trigger: "A day after payment, if no check has passed.",
      subject: `Your first lesson on ${course.title} is ready`,
      element: (
        <SelfServeNudgeEmail kind="start" courseTitle={course.title} artefactTitle={artefact} learnUrl={learnUrl} passed={0} total={7} base={base} />
      ),
    },
    {
      id: "nudge-continue",
      audience: "Customer",
      trigger: "Three days after the last passed check, if the course is unfinished.",
      subject: `Pick up where you left off on ${course.title}`,
      element: (
        <SelfServeNudgeEmail kind="continue" courseTitle={course.title} artefactTitle={artefact} learnUrl={learnUrl} passed={3} total={7} base={base} />
      ),
    },
    {
      id: "nudge-sign",
      audience: "Customer",
      trigger: "A day after every check passes, if the work is unsigned.",
      subject: `One step left: sign your ${work} for ${course.title}`,
      element: (
        <SelfServeNudgeEmail kind="sign" courseTitle={course.title} artefactTitle={artefact} learnUrl={learnUrl} passed={7} total={7} base={base} />
      ),
    },
    {
      id: "completed",
      audience: "Customer",
      trigger: "The learner signs their final work.",
      subject: `Well done. ${course.title} is complete`,
      element: (
        <SelfServeCompletedEmail
          name={buyer.name}
          courseTitle={course.title}
          artefactTitle={artefact}
          certificateRef={ref}
          verifyUrl={verifyUrl(ref)}
          certificateUrl={`${base}/learn/${course.slug}/certificate`}
          linkedInUrl={linkedInAddUrl(course.title, ref, now)}
          picks={picks}
          base={base}
        />
      ),
    },
    {
      id: "completed-alert",
      audience: "Owner",
      trigger: "The learner signs their final work.",
      subject: `Course completed: ${course.title}, by ${buyer.name}`,
      element: (
        <SelfServeCompletedAlertEmail
          name={buyer.name}
          email={buyer.email}
          courseTitle={course.title}
          certificateRef={ref}
          verifyUrl={verifyUrl(ref)}
        />
      ),
    },
    {
      id: "next-course",
      audience: "Customer",
      trigger: "Three days after the record is signed, once, unless the learner opted out.",
      subject: picks[0]
        ? `After ${course.title}: ${picks[0].title} is the natural next step`
        : `Your next course after ${course.title}`,
      element: (
        <SelfServeNudgeEmail
          kind="next"
          name={buyer.name}
          courseTitle={course.title}
          artefactTitle={artefact}
          learnUrl={learnUrl}
          passed={7}
          total={7}
          picks={picks}
          base={base}
          unsubscribeUrl={`${base}/api/learn/unsubscribe?t=sample`}
        />
      ),
    },
  ];
}
