import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY, LEGAL_UPDATED } from "@/lib/legal";
import { withSiteShareImages } from "@/lib/social-image";

export const metadata: Metadata = withSiteShareImages({
  title: "Course Terms of Sale",
  alternates: { canonical: "/course-terms" },
  description:
    "Terms of sale for Experrt self-paced courses: 12 months of access, one learner per purchase, and no refunds.",
});

const link = "text-foreground underline underline-offset-4";

export default function CourseTermsPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold tracking-tight">Course Terms of Sale</h1>
      <p className="text-sm text-muted-foreground">Last updated: {LEGAL_UPDATED}</p>

      <p>
        These terms apply when you buy a self-paced course on experrt.com. Please read them before you
        pay, and in particular section 5, which explains that <strong>all sales are final and no refunds
        are given</strong>. By completing a purchase you agree to these terms, to our general{" "}
        <Link href="/terms" className={link}>Terms of Service</Link>, and to the way we handle your data
        as described in our <Link href="/privacy" className={link}>Privacy Policy</Link>.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Courses are sold by <strong>{COMPANY.legalName}</strong>, trading as {COMPANY.tradingName}
        (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a free zone limited liability company in{" "}
        {COMPANY.freeZone}, {COMPANY.country}.
      </p>
      <ul>
        <li>Licence No.: {COMPANY.licenceNo}</li>
        <li>Registration No.: {COMPANY.registrationNo}</li>
        <li>General Manager: {COMPANY.manager}</li>
        <li>
          Email: <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a>
        </li>
      </ul>

      <h2>2. What you are buying</h2>
      <p>Each purchase gives one named person a personal licence to use one self-paced course. It includes:</p>
      <ul>
        <li>the course lessons, examples and practice checks, with feedback on your answers;</li>
        <li>the final assessment and the piece of work you sign at the end; and</li>
        <li>a signed record of completion with a reference that anyone you share it with can check online.</li>
      </ul>
      <p>
        A course is digital content delivered online. Nothing is posted to you. You need an email address,
        an internet connection and a current web browser. You save a password on the email address you
        use at checkout, and that is how you return to the course.
      </p>
      <p>
        <strong>Team places.</strong> You can buy several places on a course at once for other people. Each
        place is a personal licence for one person. Each person&apos;s 12 months start when they accept
        their invitation, and a place cannot be moved to someone else once it has been accepted. Places
        that nobody has accepted expire 12 months after payment. The no-refunds term in section 5 applies to
        every place, whether or not it is used.
      </p>

      <h2>3. Price and payment</h2>
      <p>
        The price is shown on the course page and at checkout in pounds sterling and includes any taxes we
        are required to charge. Payment is taken in full by card when you order, through our payment provider
        Stripe. Where we offer a promotion code, it must be entered at checkout and cannot be applied
        afterwards. The contract is formed when your payment is confirmed and we send your receipt.
      </p>

      <h2>4. Access lasts 12 months</h2>
      <ul>
        <li>
          Access starts as soon as your payment is confirmed and lasts <strong>12 months from the date of
          payment</strong>. The end date is shown on your receipt and in My learning.
        </li>
        <li>
          When the 12 months end, the lessons close. Your signed record of completion, if you signed one,
          stays on your account and stays verifiable online.
        </li>
        <li>
          You can buy another 12 months at the price then shown. The lessons you have already passed carry
          over.
        </li>
        <li>
          If you already have open access to a course, the site will take you to it rather than sell it to
          you again.
        </li>
      </ul>

      <h2>5. No refunds</h2>
      <p>
        <strong>All sales are final.</strong> Because a course is made available to you in full the moment
        your payment is confirmed, you agree when you buy that you want access to start immediately and that{" "}
        <strong>no refund will be given</strong>, in full or in part, for any reason, including if:
      </p>
      <ul>
        <li>you change your mind, or bought the wrong course;</li>
        <li>you do not start the course, do not finish it, or do not pass the checks;</li>
        <li>your 12 months of access end before you have used them;</li>
        <li>you close your account; or</li>
        <li>we suspend or end your access because you have broken these terms.</li>
      </ul>
      <p>
        If a technical fault on our side takes payment twice for the same order, we will reverse the
        duplicate payment. If a course does not work as described, tell us at{" "}
        <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a> and we will fix it.
      </p>

      <h2>6. Your signed record</h2>
      <p>
        When you finish a course and sign your work, we issue a record with a unique reference and a public
        page that shows your name, the course, the date and the work you signed. Anyone with the link or
        reference can view it. The record confirms that you completed an Experrt course. It is not an
        accredited qualification, and it does not certify that you or your organisation comply with the EU
        AI Act or any other law or regulation.
      </p>
      <p>
        <strong>Reviews.</strong> Once you have signed your record you may review the course. Reviews must be
        your own honest experience, must not include links, personal details of others, or anything
        unlawful, and must not be written in exchange for payment or a discount. We publish reviews as
        written and do not edit them. We may hide a review that breaks these rules. You can edit or remove
        your review at any time.
      </p>

      <h2>7. Fair use</h2>
      <p>Your licence is personal. You must not:</p>
      <ul>
        <li>share your sign-in, or let anyone else take the course or its checks on your account;</li>
        <li>copy, record, publish, resell or distribute course content, in whole or in part;</li>
        <li>use automated tools to scrape the course or to answer its checks; or</li>
        <li>sign a record in a name other than your own.</li>
      </ul>
      <p>
        If you do, we may suspend or end your access and withdraw any record issued. No refund is given.
      </p>
      <p>
        Organisations that want several people to take a course should contact us for a team arrangement
        rather than share one purchase.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        The courses and everything in them belong to us or our licensors. Your purchase gives you the
        personal licence described above and does not transfer any ownership. The answers and work you
        write in a course remain yours, and you allow us to store and display them to provide the course
        and your record.
      </p>

      <h2>9. Changes to a course</h2>
      <p>
        We improve courses over time and may update, reorder or replace lessons during your access period.
        If we withdraw a course while your access is open, we will either keep it open to you until your 12
        months end or move you to a comparable course.
      </p>

      <h2>10. Availability</h2>
      <p>
        We aim to keep courses available at all times but cannot promise uninterrupted access. We may take
        the site offline briefly for maintenance. Planned downtime does not extend your access period.
      </p>

      <h2>11. Our liability</h2>
      <p>
        Courses are for education. They are not legal, financial or professional advice, and you are
        responsible for how you apply what you learn. Our total liability to you for any course is limited to
        the price you paid for it. We are not liable for indirect or consequential loss, loss of profit, or
        loss of business opportunity. Nothing in these terms limits liability that cannot legally be limited,
        such as liability for fraud, or for death or personal injury caused by negligence.
      </p>

      <h2>12. Closing your account</h2>
      <p>
        You can close your learner account at any time from{" "}
        <Link href="/learn/account" className={link}>My account</Link>. Closing it ends access to every
        course on it and erases your progress and signed records. No refund is given for any course on the
        account.
      </p>

      <h2>13. Changes to these terms</h2>
      <p>
        We may update these terms. The version that applies to your purchase is the one published on the day
        you paid.
      </p>

      <h2>14. Law and disputes</h2>
      <p>
        These terms are governed by the laws of the Emirate of Ras Al Khaimah and the federal laws of the
        United Arab Emirates. Please contact us first so we can try to resolve any problem. Disputes that
        cannot be resolved will be decided by the courts of Ras Al Khaimah. If you buy as a consumer, you also
        keep any protections that the mandatory laws of the country where you live give you.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about a purchase: <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a>.
      </p>
    </article>
  );
}
