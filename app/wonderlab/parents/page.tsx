import { withSiteShareImages } from "@/lib/social-image";
import { wonderlabShare } from "@/lib/wonderlab/share";
import { launchStatus } from "@/lib/wonderlab/flags";
import Link from "next/link";
export const metadata = withSiteShareImages({
  ...wonderlabShare,
  title: "A guide for parents and guardians",
});
export default function Page() {
  return (
    <article className="wl-article">
      <span className="wl-eyebrow">FOR THE GROWN-UPS</span>
      <h1>
        Help your child develop
        <br />
        useful AI skills through play.
      </h1>
      <p>
        Wonderlab helps your child build the communication, creative thinking
        and judgement they’ll need when using AI. They’ll practise explaining
        what they want, questioning answers that sound convincing and deciding
        what needs a person’s attention. Stories, games and projects give them
        concrete situations in which to try these skills, make mistakes and
        improve.
      </p>
      {!launchStatus().commerce && (
        <div className="wl-notice">
          We are preparing the paid programme for a family pilot and launch
          review. Four free activities are available now. Paid checkout and live
          AI remain closed until the required checks are complete.
        </div>
      )}
      <h2>Choose a level that fits your child’s age.</h2>
      <ul>
        <li>
          <strong>Little Explorers, ages 4–6.</strong> Your child plays animated
          games with a grown-up. Each lesson is designed to take around 25–30
          minutes, including an activity away from the screen, and can be split
          into short sessions.
        </li>
        <li>
          <strong>Inventors, ages 7–10.</strong> Your child explores cartoon
          adventures and creative projects. Each lesson is designed to take
          around 35–45 minutes, with places to pause.
        </li>
        <li>
          <strong>Creators, ages 11–13.</strong> Your child investigates
          mysteries, builds fictional worlds and checks revision activities.
          Each lesson is designed to take around 45–60 minutes.
        </li>
        <li>
          <strong>Future Studio, ages 14–16.</strong> Your teenager writes clear
          project instructions, checks evidence and tests useful creations. Each
          lesson is designed to take around 60–75 minutes.
        </li>
      </ul>
      <p>
        These timings are design targets being tested with families. Children
        can take longer, pause or repeat an activity.
      </p>
      <h2>One £20 monthly membership includes every course.</h2>
      <p>
        One monthly membership gives one child access to all 24 game-based
        courses, across all four age levels. There are no separate lesson
        charges. Start with the games recommended for their age, then explore
        and replay at their own pace.
      </p>
      <p>
        Each course includes guided challenges, a creative project, a mission
        sticker and downloadable work. You can see their progress and export
        their private creations from your family space.
      </p>
      <p>
        Membership costs £20 per month per child, including any applicable
        taxes, and renews monthly until cancelled. Cancel in your family area at
        any time; access continues until the end of the paid month. Saved work
        remains available for export under our retention policy.
      </p>
      <p>
        For ages 11–16, eligible courses include up to 30 successful guided AI
        generations per course in each paid month, when you enable them. Failed
        or blocked generations do not use the allowance. Games with prepared
        examples can be replayed without a limit during membership.
      </p>
      <h2>Your child will learn about AI in ways suited to their age.</h2>
      <p>
        Children aged 4–10 use games and examples written in advance. These
        simplified activities demonstrate ideas about AI while teaching children
        to give instructions and check results. They do not connect children to
        live AI.
      </p>
      <p>
        For ages 11–16, selected missions offer guided tools that create text
        with AI when you enable them. Each tool uses checked instructions for a
        fictional task and a small set of choices. Children’s nicknames, private
        project text and profile details are not included in generation
        requests. Generated drafts still need checking.
      </p>
      <h2>You manage your child’s learning in the family space.</h2>
      <p>
        You manage the account, memberships and child profiles. Children use a
        nickname and avatar and do not need an email address. Opening a child’s
        mission map locks the parent area. Your account password is needed to
        return to membership and settings.
      </p>
      <p>
        Saved work is private to your family and authorised service operations.
        We explain to children that you can see their creations and progress.
        You can export work and request profile deletion.
      </p>
      <h2>A mission sticker records what your child has practised.</h2>
      <p>
        A mission sticker records completion of that mission’s activities and
        project checks. It is not a professional qualification or a guarantee of
        independent competence. Feedback explains the reasoning and lets
        children try again.
      </p>
      <h2>Your child can play at their own pace.</h2>
      <p>
        There are no public leaderboards, streak penalties, loot boxes or
        child-to-child messages. Activities support touch and keyboard, and
        instructions stay visible when narration is used. The interface respects
        reduced-motion preferences.
      </p>
      <div className="wl-actions">
        <Link href="/wonderlab" className="wl-button">
          Find a free activity →
        </Link>
        <Link href="/wonderlab/family" className="wl-button wl-outline">
          Open family space
        </Link>
      </div>
    </article>
  );
}
