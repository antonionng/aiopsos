import type { Metadata } from "next";
import Link from "next/link";

import { privacyMetadata } from "@/lib/public-share-metadata";
import { COMPANY, LEGAL_UPDATED } from "@/lib/legal";

export const metadata: Metadata = privacyMetadata();

export default function PrivacyPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {LEGAL_UPDATED}</p>

      <p>
        Experrt (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your
        privacy. This Privacy Policy explains how we collect, use, disclose, and
        safeguard your personal data when you use the Experrt platform, website,
        and related services (the &quot;Service&quot;).
      </p>

      <h2>Who is responsible for your data</h2>
      <p>
        The controller of your personal data is <strong>{COMPANY.legalName}</strong>, trading as
        Experrt, a free zone limited liability company in {COMPANY.freeZone}, {COMPANY.country}
        (Licence No. {COMPANY.licenceNo}, Registration No. {COMPANY.registrationNo}). Contact us about
        anything in this policy at{" "}
        <a href={`mailto:${COMPANY.email}`} className="text-foreground underline underline-offset-4">{COMPANY.email}</a>.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>1.1 Information You Provide</h3>
      <ul>
        <li>
          <strong>Account Data:</strong> name, email address, job title,
          department, bio, skills, and profile avatar when you register or update
          your profile.
        </li>
        <li>
          <strong>Organisation Data:</strong> company name, industry, size,
          website, department structure, and organisation logo.
        </li>
        <li>
          <strong>Assessment Data:</strong> responses to AI maturity assessments,
          quiz answers, and self-reported scores.
        </li>
        <li>
          <strong>Chat &amp; AI Interaction Data:</strong> prompts, messages,
          uploaded files, and conversation history when using the AI chat
          interface.
        </li>
        <li>
          <strong>Billing Data:</strong> payment method details are collected and
          processed directly by Stripe. We store your Stripe customer ID and
          subscription status but do not store credit card numbers.
        </li>
        <li>
          <strong>Communications:</strong> emails you send to us and feedback you
          provide through the platform.
        </li>
      </ul>

      <h3>Self-paced courses</h3>
      <p>When you buy a self-paced course, Stripe collects your card details on our behalf; we never see or store your card number. Stripe sends us your name, email address, the amount paid and payment references, which we keep as the record of your purchase.</p>
      <p>When you save a sign-in, we create a learner account with your name, email address and password (stored only as a secure hash by our authentication provider). As you work through a course we store your answers, check results, progress and the work you sign at the end.</p>
      <p>When you sign your final work, we publish a record page showing your name, the course, the date and the work you signed. Anyone with the link or reference can view it. You choose whether to share it.</p>
      <p>We email you a receipt, a sign-in confirmation, reminders to continue a course you have bought and, once you finish, one suggestion for a next course. You can stop course suggestions at any time from the link in the email or in My account; receipts and account emails are always sent. We also notify our team at {COMPANY.email} of each purchase, new learner account and completed course, and of any team-session enquiry you send from My learning.</p>
      <p>You can download your learner data or close your learner account yourself from <Link href="/learn/account" className="text-foreground underline underline-offset-4">My account</Link>.</p>

      <h3>Public learning check and enquiries</h3>
      <p>When you try the public learning agent, we save your brief, generated materials and task progress in a guest session. An essential cookie lets you return to that session for up to 12 hours. We use usage counters and a hashed network identifier to limit free use. Your brief is processed by our AI provider to create the materials. If you ask us to email your pack, we save your name, email, optional organisation and permission, send the pack to you, and share your details, brief and materials with our team at ag@experrt.com for follow-up about your request. This does not subscribe you to a newsletter.</p>
      <p>When you unlock a public learning check, we save your name, email, optional organisation, selected subjects, answers and calculated learning priorities. We also record your consent choices and when you submitted them. Answers remain in your browser tab until you submit the results form. This self-reported check is not automatically linked to an employer or added to an employee assessment record.</p>
      <p>We save contact enquiries so our team can respond even if an email notification fails. Access to these enquiries is restricted to authorised staff. Submitting an enquiry or unlocking results does not subscribe you to marketing. We use a separate optional choice for learning ideas and promotional updates; you can withdraw it by contacting ag@experrt.com or using the unsubscribe option in a marketing email.</p>
      <h3>1.2 Information Collected Automatically</h3>
      <ul>
        <li>
          <strong>Usage Data:</strong> pages visited, features used, AI model
          usage, token consumption, timestamps, and interaction patterns.
        </li>
        <li>
          <strong>Device &amp; Browser Data:</strong> IP address, browser type,
          operating system, device identifiers, and screen resolution.
        </li>
        <li>
          <strong>Cookies &amp; Similar Technologies:</strong> see our{" "}
          <Link href="/cookies" className="text-foreground underline underline-offset-4">
            Cookie Policy
          </Link>{" "}
          for details.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We process your personal data for the following purposes:</p>
      <ul>
        <li>
          <strong>Providing the Service:</strong> authenticating your identity,
          managing your account, processing AI requests, generating
          recommendations and roadmaps, and delivering assessment results.
        </li>
        <li>
          <strong>Billing &amp; Payments:</strong> processing subscriptions,
          managing seat allocation, and handling invoicing through Stripe.
        </li>
        <li>
          <strong>Communications:</strong> sending transactional emails
          (assessment invitations, reminders, results, approval notifications)
          and important service updates.
        </li>
        <li>
          <strong>Analytics &amp; Improvement:</strong> understanding how the
          Service is used, diagnosing technical issues, and improving features.
        </li>
        <li>
          <strong>Security &amp; Compliance:</strong> detecting and preventing
          fraud, abuse, and security threats; enforcing our Terms of Service;
          and meeting legal obligations.
        </li>
        <li>
          <strong>AI Model Routing:</strong> selecting the appropriate AI model
          based on your plan, usage quotas, and query complexity.
        </li>
      </ul>

      <h2>3. Legal Basis for Processing</h2>
      <p>If you are in the United Kingdom or the European Economic Area (EEA), the UK GDPR or EU GDPR applies to our processing of your data, and we rely on:</p>
      <ul>
        <li>
          <strong>Contract Performance:</strong> processing necessary to provide
          the Service you signed up for.
        </li>
        <li>
          <strong>Legitimate Interests:</strong> analytics, security, and service
          improvement, where your rights do not override our interests.
        </li>
        <li>
          <strong>Consent:</strong> for optional cookies and marketing
          communications, which you can withdraw at any time.
        </li>
        <li>
          <strong>Legal Obligation:</strong> where processing is required by law,
          such as keeping sales records for tax.
        </li>
        <li>
          <strong>Course purchases and learning:</strong> providing a course you
          have bought, your progress and your signed record is contract
          performance. Suggesting a next course to someone who has bought one is
          based on our legitimate interests, and you can opt out at any time.
        </li>
      </ul>

      <h2>4. Third-Party Service Providers</h2>
      <p>
        We share your data with trusted third-party processors who assist in
        operating the Service. These providers are contractually obligated to
        protect your data:
      </p>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Purpose</th>
              <th>Data Shared</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Supabase</td>
              <td>Authentication, database, file storage</td>
              <td>Account data, organisation data, all platform data</td>
            </tr>
            <tr>
              <td>Stripe</td>
              <td>Payment processing</td>
              <td>Billing information, email, subscription details</td>
            </tr>
            <tr>
              <td>OpenAI</td>
              <td>AI model inference</td>
              <td>Chat prompts and context (no PII sent intentionally)</td>
            </tr>
            <tr>
              <td>Anthropic</td>
              <td>AI model inference</td>
              <td>Chat prompts and context</td>
            </tr>
            <tr>
              <td>Google (Gemini)</td>
              <td>AI model inference</td>
              <td>Chat prompts and context</td>
            </tr>
            <tr>
              <td>Mistral</td>
              <td>AI model inference</td>
              <td>Chat prompts and context</td>
            </tr>
            <tr>
              <td>Resend</td>
              <td>Transactional email delivery</td>
              <td>Email address, name, email content</td>
            </tr>
            <tr>
              <td>Vercel</td>
              <td>Hosting and edge delivery</td>
              <td>Request metadata, IP address</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>5. AI Data Processing</h2>
      <p>
        When you interact with our AI features, your prompts and contextual data
        are sent to third-party AI model providers for processing. Important
        details:
      </p>
      <ul>
        <li>
          We apply guardrails including PII detection and prompt injection
          prevention to minimise sensitive data exposure.
        </li>
        <li>
          AI providers process data according to their own privacy policies and
          data processing agreements.
        </li>
        <li>
          We do not use your data to train our own AI models. Third-party
          providers&apos; data retention policies vary; we select providers that offer
          zero-data-retention options where available.
        </li>
        <li>
          Chat conversations are stored in our database for your continued
          access and may be deleted by you at any time.
        </li>
      </ul>

      <h2>6. Data Retention</h2>
      <ul>
        <li>
          <strong>Account Data:</strong> retained for as long as your account is
          active. Deleted within 30 days of account deletion.
        </li>
        <li>
          <strong>Chat History:</strong> retained until you delete individual
          conversations or your account.
        </li>
        <li>
          <strong>Assessment Data:</strong> retained for the lifetime of the
          organisation account to support historical trend analysis.
        </li>
        <li>
          <strong>Billing Records:</strong> retained as required by tax and
          financial regulations (typically 7 years).
        </li>
        <li>
          <strong>Learner Accounts and Course Progress:</strong> kept while your
          learner account is open. Closing the account erases your sign-in,
          progress and signed records straight away. Course purchase records are
          kept without your name or email for as long as tax law requires.
        </li>
        <li>
          <strong>Audit Logs:</strong> retained for up to 12 months for security
          and compliance purposes.
        </li>
        <li>
          <strong>Usage Analytics:</strong> aggregated and anonymised data may be
          retained indefinitely.
        </li>
      </ul>

      <h2>7. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your data,
        including:
      </p>
      <ul>
        <li>Encryption in transit (TLS 1.2+) and at rest.</li>
        <li>Row-level security (RLS) policies to isolate tenant data.</li>
        <li>Secure session management with HTTP-only cookies.</li>
        <li>Rate limiting and abuse prevention.</li>
        <li>Regular security reviews and dependency audits.</li>
      </ul>
      <p>
        No system is completely secure. While we strive to protect your data, we
        cannot guarantee absolute security.
      </p>

      <h2>8. Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have the following rights
        regarding your personal data:
      </p>

      <h3>8.1 UK and EU GDPR Rights</h3>
      <ul>
        <li><strong>Access:</strong> request a copy of your personal data.</li>
        <li><strong>Rectification:</strong> correct inaccurate data.</li>
        <li><strong>Erasure:</strong> request deletion of your data (&quot;right to be forgotten&quot;).</li>
        <li><strong>Portability:</strong> receive your data in a structured, machine-readable format.</li>
        <li><strong>Restriction:</strong> request limitation of processing.</li>
        <li><strong>Objection:</strong> object to processing based on legitimate interests.</li>
        <li><strong>Withdraw Consent:</strong> withdraw consent at any time where processing is based on consent.</li>
      </ul>

      <h3>8.2 CCPA Rights (California Residents)</h3>
      <ul>
        <li>Right to know what personal information is collected and how it is used.</li>
        <li>Right to delete personal information.</li>
        <li>Right to opt out of the sale of personal information. We do not sell your personal information.</li>
        <li>Right to non-discrimination for exercising your privacy rights.</li>
      </ul>

      <h3>8.3 UAE Residents</h3>
      <p>
        If you are in the United Arab Emirates, you have the rights given by the UAE Personal
        Data Protection Law, including access, correction, erasure and objection.
      </p>

      <p>
        Learners can download their data and close their account at any time from{" "}
        <Link href="/learn/account" className="text-foreground underline underline-offset-4">My account</Link>. To exercise any other right,
        contact us at{" "}
        <a href={`mailto:${COMPANY.email}`} className="text-foreground underline underline-offset-4">
          {COMPANY.email}
        </a>
        . We will respond within one month.
      </p>

      <h2>9. International Data Transfers</h2>
      <p>
        We are based in the United Arab Emirates, and our service providers
        process data in the European Union, the United Kingdom and the United
        States. Where your data leaves the UK or the EEA, we rely on appropriate
        safeguards such as the European Commission&apos;s Standard Contractual
        Clauses and the UK International Data Transfer Addendum, or on an
        adequacy decision.
      </p>

      <h2>10. Children&apos;s Privacy</h2>
      <p>
        The Service is not intended for individuals under the age of 18. We do
        not knowingly collect personal data from children. If we become aware
        that we have collected data from a child, we will delete it promptly.
      </p>

      <h2>11. Third-Party Links</h2>
      <p>
        The Service may contain links to third-party websites. We are not
        responsible for the privacy practices of those websites and encourage
        you to review their privacy policies.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes
        will be communicated via email or a prominent notice on the Service. The
        &quot;Last updated&quot; date at the top reflects the most recent revision.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        If you have questions, concerns, or requests regarding this Privacy
        Policy or your personal data, contact us at:
      </p>
      <ul>
        <li>
          Email:{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-foreground underline underline-offset-4">
            {COMPANY.email}
          </a>
        </li>
        <li>
          Post: {COMPANY.legalName}, {COMPANY.freeZone}, {COMPANY.country}
        </li>
      </ul>
      <p>
        If you believe we have not handled your data properly, you can complain
        to a data protection authority: in the UK, the Information
        Commissioner&apos;s Office (ico.org.uk); in the EEA, the authority where
        you live or work. We would appreciate the chance to put things right
        first.
      </p>
    </article>
  );
}
