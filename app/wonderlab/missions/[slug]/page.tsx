import { withSiteShareImages } from "@/lib/social-image";
import { wonderlabShare } from "@/lib/wonderlab/share";
import { MissionArtwork } from "@/components/wonderlab/mission-artwork";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bands, getMission, missions } from "@/lib/wonderlab/catalog";
import { parentMissions } from "@/lib/wonderlab/parent-copy";
import { launchStatus } from "@/lib/wonderlab/flags";
export function generateStaticParams() {
  return missions.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const m = getMission((await params).slug);
  return withSiteShareImages({
    ...wonderlabShare,
    title: m?.title ?? "Mission not found",
    description: m ? parentMissions[m.slug].summary : undefined,
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const m = getMission((await params).slug);
  if (!m) notFound();
  const b = bands[m.band];
  const copy = parentMissions[m.slug];
  const learner = m.band === "studio" ? "Your teenager" : "Your child";
  const launch = launchStatus();
  return (
    <div className="wl-detail">
      <Link
        href={`/wonderlab/${b.audience}#${m.band}`}
        className="wl-breadcrumb"
      >
        ← Back to {b.name}
      </Link>
      <div className="wl-detail-grid">
        <div>
          <span className="wl-eyebrow">
            {b.name} · AGES {b.ages} · MISSION {m.number}
          </span>
          <h1>{m.title}</h1>
          <p>{copy.summary}</p>
          <div className="wl-actions">
            <Link href="/wonderlab/family" className="wl-button">
              {launch.commerce
                ? "Join · £20/month per child"
                : "Explore the family space"}{" "}
              →
            </Link>
            {m.number === 2 && (
              <Link
                className="wl-button wl-outline"
                href={`/wonderlab/play/${m.slug}?demo=1`}
              >
                Try a free activity
              </Link>
            )}
          </div>
          {!launch.commerce && (
            <div className="wl-notice">
              This lesson is being prepared for our family pilot. Paid enrolment
              opens after the launch review. The four free activities are
              available now.
            </div>
          )}
          <div className="wl-box">
            <h2>Your child will practise useful AI skills.</h2>
            <p>
              {learner} will learn to{" "}
              {m.outcome.charAt(0).toLowerCase() + m.outcome.slice(1)}.
            </p>
            <p>
              {m.band === "explorers"
                ? "You’ll read and play together, help with the controls and join the offline activity. Each lesson can be split into short sessions."
                : "Your child can read or listen to instructions, try each activity and use the feedback to improve. They can pause, return and retry at their own pace."}
            </p>
            <p>
              Instruction and sorting games are simplified simulations.
              Following a fixed sequence is different from an AI model learning
              patterns from examples.
            </p>
          </div>
          <div className="wl-box">
            <h2>Your child will learn through guided play.</h2>
            <p>
              Your child will work through three guided activities, then apply
              the skill to a fresh challenge. Feedback explains their choices
              and helps them try again.
            </p>
            <ol>
              {m.activities.map((a, i) => (
                <li key={a.id}>
                  <strong>{a.title}</strong>
                  {i === 3 && (
                    <p>
                      Your child will try a new challenge to show how they can
                      use what they have practised.
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="wl-box">
            <h2>Your child will create something of their own.</h2>
            <h3 style={{ marginTop: 18 }}>{m.project.title}</h3>
            <p>{copy.project}</p>
            <p>
              You’ll be able to download their written record and see their
              progress in your family space.
            </p>
          </div>
        </div>
        <aside>
          <MissionArtwork
            className="wl-detail-art"
            band={m.band}
            number={m.number}
          />
          <div className="wl-box">
            <div className="wl-price">
              £20 <small>per month, per child</small>
            </div>
            <ul>
              <li>
                Your membership includes this game and all 23 other courses.
              </li>
              <li>
                You can cancel at any time, with access until the end of the
                paid month.
              </li>
              <li>
                The lesson is designed to take {b.duration}, with places to
                pause.
              </li>
              <li>
                Your child will play three guided activities and try a new
                challenge.
              </li>
              <li>
                They will create a project, replay activities and earn a mission
                sticker.
              </li>
              <li>
                Their work stays private, and you can see a summary of their
                progress.
              </li>
              {m.aiBrief && (
                <li>
                  If you enable guided AI, your child can create up to 30 AI
                  drafts in this course per paid month.
                </li>
              )}
            </ul>
            <Link href="/wonderlab/parents" className="wl-quiet-link">
              Read the parent guide →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
