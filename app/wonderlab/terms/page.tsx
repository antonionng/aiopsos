import { withSiteShareImages } from "@/lib/social-image";
import { wonderlabShare } from "@/lib/wonderlab/share";
import Link from "next/link";
export const metadata = withSiteShareImages({
  ...wonderlabShare,
  title: "Access, purchases and privacy",
});
export default function Page() {
  return (
    <article className="wl-article">
      <span className="wl-eyebrow">WONDERLAB INFORMATION</span>
      <h1>
        Clear information
        <br />
        for your family.
      </h1>
      <div className="wl-notice">
        Paid enrolment is not open. The information below describes the planned
        service. Reviewed purchase, cancellation, refund and child-privacy terms
        must be published here before checkout is enabled.
      </div>
      <h2>Monthly membership</h2>
      <p>
        The planned membership is £20 per month per child, including any
        applicable taxes. It includes all 24 Wonderlab courses across all age
        levels. One membership covers one child profile. Each child’s membership
        renews monthly until cancelled; there are no separate lesson charges.
      </p>
      <p>
        Access begins after confirmed payment and lasts for the paid billing
        period. Each successful monthly renewal extends access. Game replays are
        unlimited during membership. Eligible teen courses include 30 successful
        guided AI generations per course in each paid month, when
        parent-enabled. Failed or blocked generations do not use the allowance;
        unused generations do not roll over.
      </p>
      <h2>Private family profiles</h2>
      <p>
        Profiles contain a nickname, selected age level, avatar and learning
        preferences. Saved records contain activity answers, project text and
        progress. Parents can see their child’s saved work. Free activities do
        not save progress to a child profile.
      </p>
      <h2>What is sent for guided generation</h2>
      <p>
        Only reviewed fictional lesson briefs and predefined choices are used
        for generation. Child nicknames, private creations and profile
        identifiers are not sent in those requests. Live generation remains
        disabled pending provider configuration and the child-data review.
      </p>
      <h2>Exports and deletion requests</h2>
      <p>
        Parents can export saved creations from the family area. A deletion
        request is accepted once any pending checkout is resolved and monthly
        renewal is cancelled. The accepted request pauses the child profile and
        disables guided AI. If a checkout or cancellation needs attention, the
        family area explains what to do next. The retention schedule, deletion
        response times and treatment of required purchase records will be
        published before paid launch.
      </p>
      <h2>Cancellation and refunds</h2>
      <p>
        The paid service’s reviewed cancellation and refund terms will be
        published before purchases are accepted. Parents can cancel monthly
        renewal in the family area and keep access until the end of the paid
        month. A full refund removes access for the refunded billing period; a
        later paid period remains valid. Cancelling renewal does not itself
        request a refund. The checkout will show the terms and any required
        immediate-access acknowledgement before payment.
      </p>
      <p>
        For enquiries, <Link href="/contact">contact Experrt</Link>. See the
        existing <Link href="/privacy">Experrt privacy information</Link> for
        the wider site.
      </p>
    </article>
  );
}
