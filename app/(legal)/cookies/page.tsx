import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | AIOPSOS",
  description: "Cookie Policy for the AIOPSOS enterprise AI adoption platform.",
};

export default function CookiesPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold tracking-tight">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: 24 February 2026</p>

      <p>
        This Cookie Policy explains how AIOPSOS (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses
        cookies and similar technologies when you visit or use the AIOPSOS
        platform (the &quot;Service&quot;). It should be read alongside our{" "}
        <Link href="/privacy" className="text-foreground underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device (computer, tablet, or
        mobile) when you visit a website. They are widely used to make websites
        work efficiently, provide a better user experience, and supply
        information to site owners. Cookies can be &quot;session&quot; cookies (deleted
        when you close your browser) or &quot;persistent&quot; cookies (remain until they
        expire or you delete them).
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>
        We use cookies for the following purposes:
      </p>

      <h3>2.1 Strictly Necessary Cookies</h3>
      <p>
        These cookies are essential for the Service to function. Without them,
        you cannot use core features. They cannot be disabled.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Provider</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>sb-*-auth-token</code></td>
              <td>Supabase</td>
              <td>Authentication session management. Keeps you signed in securely.</td>
              <td>Session / 1 year</td>
            </tr>
            <tr>
              <td><code>sb-*-auth-token-code-verifier</code></td>
              <td>Supabase</td>
              <td>PKCE code verifier for secure OAuth flows.</td>
              <td>Session</td>
            </tr>
            <tr>
              <td><code>theme</code></td>
              <td>AIOPSOS</td>
              <td>Stores your preferred colour theme (light/dark/system).</td>
              <td>1 year</td>
            </tr>
            <tr>
              <td><code>cookie-consent</code></td>
              <td>AIOPSOS</td>
              <td>Stores your cookie consent preference.</td>
              <td>1 year</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>2.2 Functional Cookies</h3>
      <p>
        These cookies enhance your experience by remembering your choices and
        preferences.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Cookie / Storage</th>
              <th>Provider</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>sidebar-collapsed</code></td>
              <td>AIOPSOS</td>
              <td>Remembers your sidebar open/closed preference.</td>
              <td>Persistent (localStorage)</td>
            </tr>
            <tr>
              <td><code>preferred-model</code></td>
              <td>AIOPSOS</td>
              <td>Remembers your last selected AI model in the chat interface.</td>
              <td>Persistent (localStorage)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>2.3 Analytics Cookies</h3>
      <p>
        We may use analytics cookies to understand how visitors interact with
        the Service. These cookies collect information in an aggregated form to
        help us improve the platform. Analytics cookies are only set if you
        consent to them.
      </p>
      <p>
        We currently do not use third-party analytics services. If this changes,
        we will update this policy and request your consent before setting any
        analytics cookies.
      </p>

      <h3>2.4 Third-Party Cookies</h3>
      <p>
        Some third-party services integrated into the platform may set their own
        cookies:
      </p>
      <ul>
        <li>
          <strong>Stripe:</strong> may set cookies for fraud prevention and
          payment processing when you interact with billing pages.
        </li>
        <li>
          <strong>Supabase:</strong> sets authentication-related cookies as
          described in section 2.1 above.
        </li>
      </ul>
      <p>
        These cookies are governed by the respective third parties&apos; privacy and
        cookie policies.
      </p>

      <h2>3. Local Storage &amp; Similar Technologies</h2>
      <p>
        In addition to cookies, we use browser localStorage to store
        preferences and consent choices. localStorage data remains on your
        device until explicitly cleared. Key items stored include:
      </p>
      <ul>
        <li>Cookie consent preference</li>
        <li>UI preferences (sidebar state, selected model)</li>
        <li>Theme preference</li>
      </ul>

      <h2>4. Managing Your Cookie Preferences</h2>

      <h3>4.1 Through Our Cookie Banner</h3>
      <p>
        When you first visit the Service, a cookie consent banner allows you to
        choose between accepting all cookies or essential cookies only. You can
        change your preference at any time by clearing your browser&apos;s stored
        data for our domain, which will cause the banner to reappear.
      </p>

      <h3>4.2 Through Your Browser</h3>
      <p>
        Most browsers allow you to control cookies through their settings. You
        can typically:
      </p>
      <ul>
        <li>View what cookies are stored and delete them individually.</li>
        <li>Block third-party cookies.</li>
        <li>Block cookies from specific sites.</li>
        <li>Block all cookies.</li>
        <li>Delete all cookies when you close your browser.</li>
      </ul>
      <p>
        Please note that blocking essential cookies will prevent the Service
        from functioning correctly. You may not be able to sign in or use core
        features.
      </p>
      <p>
        For more information on managing cookies in popular browsers:
      </p>
      <ul>
        <li>
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            Google Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-0f14e755-ced5-4e02-b2d4-f0e9dae4c6c8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            Microsoft Edge
          </a>
        </li>
      </ul>

      <h2>5. Do Not Track</h2>
      <p>
        Some browsers offer a &quot;Do Not Track&quot; (DNT) signal. As there is no
        accepted standard for how to respond to DNT signals, we do not
        currently respond to them. However, you can manage your cookie
        preferences as described above.
      </p>

      <h2>6. Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in
        technology, regulation, or our practices. The &quot;Last updated&quot; date at the
        top indicates the most recent revision. Material changes will be
        communicated via a prominent notice on the Service.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have questions about our use of cookies, please contact us at{" "}
        <a href="mailto:privacy@aiopsos.com" className="text-foreground underline underline-offset-4">
          privacy@aiopsos.com
        </a>
        .
      </p>
    </article>
  );
}
