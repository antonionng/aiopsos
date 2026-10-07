import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Compass,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  parentLevels,
  parentMissions,
  parentSkillLabels,
} from "@/lib/wonderlab/parent-copy";
import { bands, missionsForBand } from "@/lib/wonderlab/catalog";
import type { Band, Mission } from "@/lib/wonderlab/types";
import { launchStatus } from "@/lib/wonderlab/flags";
import { Pip } from "./art";
import { MissionArtwork } from "./mission-artwork";
import { GameCards } from "./arcade";
export function WorldCard({ band }: { band: Band }) {
  const b = bands[band];
  return (
    <Link
      className={`wl-world ${b.colour}`}
      href={`/wonderlab/${b.audience}#${band}`}
    >
      <div className="wl-world-image">
        <Image
          src={`/images/wonderlab/${band}.png`}
          alt={`${b.name} illustrated adventure world`}
          fill
          sizes="(max-width: 700px) 90vw, 25vw"
        />
        <span className="wl-age">AGES {b.ages}</span>
      </div>
      <div className="wl-world-copy">
        <h3>
          {b.name}
          <ArrowUpRight />
        </h3>
        <p>{parentLevels[band]}</p>
        <span className="wl-text-link">
          Explore 6 missions <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
export function MissionCard({ mission }: { mission: Mission }) {
  return (
    <Link
      href={`/wonderlab/missions/${mission.slug}`}
      className="wl-mission-card"
    >
      <div className={`wl-mission-art ${bands[mission.band].colour}`}>
        <span className="wl-mission-number">
          MISSION {String(mission.number).padStart(2, "0")}
        </span>
        <MissionArtwork band={mission.band} number={mission.number} />
      </div>
      <div className="wl-mission-copy">
        <span className="wl-eyebrow">
          {parentSkillLabels[mission.number - 1]}
        </span>
        <h3>{mission.title}</h3>
        <p>{parentMissions[mission.slug].summary}</p>
        <div className="wl-card-bottom">
          <span>{bands[mission.band].duration}</span>
          <strong>
            Included <span aria-hidden="true">↗</span>
          </strong>
        </div>
      </div>
    </Link>
  );
}
export function AudiencePage({ audience }: { audience: "kids" | "teens" }) {
  const kids = audience === "kids";
  const keys: Band[] = kids
    ? ["explorers", "inventors"]
    : ["creators", "studio"];
  return (
    <>
      <section className={`wl-audience-hero ${kids ? "mint" : "lilac"}`}>
        <div>
          <span className="wl-eyebrow">
            {kids
              ? "AI LEARNING THROUGH PLAY · AGES 4–10"
              : "PRACTICAL AI SKILLS · AGES 11–16"}
          </span>
          <h1>
            {kids ? (
              <>
                Your child can learn
                <br />
                AI skills through play.
              </>
            ) : (
              <>
                Help your teenager use AI
                <br />
                for study and creativity.
              </>
            )}
          </h1>
          <p>
            {kids
              ? "Help your child build the foundations for life with AI: communicating what they need, thinking creatively and questioning answers that may be wrong. Illustrated stories and games make these ideas concrete, with prepared activities and no live AI for ages 4–10."
              : "Help your child develop the judgement to use AI thoughtfully: communicate with purpose, recognise confident mistakes and use assistance without handing over their own thinking. They’ll practise through creative projects, investigations and study challenges."}
          </p>
          <a href={`#${keys[0]}`} className="wl-button">
            See lessons for your child <ArrowUpRight size={18} />
          </a>
        </div>
        <Image
          src={`/images/wonderlab/${keys[1]}.png`}
          alt={
            kids
              ? "A floating island with a workshop and imaginary creatures"
              : "An illustrated creative studio district"
          }
          width={850}
          height={560}
          priority
        />
      </section>
      <nav className="wg-age-nav" aria-label="All four age levels">
        {(Object.keys(bands) as Band[]).map((band) => (
          <Link
            key={band}
            href={`/wonderlab/${bands[band].audience}#${band}`}
            className={keys.includes(band) ? "active" : ""}
          >
            <span>Ages {bands[band].ages}</span>
            <strong>{bands[band].name}</strong>
            <ArrowUpRight size={17} />
          </Link>
        ))}
      </nav>
      {keys.map((key) => (
        <section key={key} id={key} className="wl-section wl-level">
          <div className="wl-section-heading">
            <div>
              <span className="wl-eyebrow">
                AGES {bands[key].ages} · {bands[key].duration} PER LESSON
              </span>
              <h2>{bands[key].name}</h2>
              <p>{parentLevels[key]}</p>
            </div>
            <Link
              className="wl-button wl-outline"
              href={`/wonderlab/play/${missionsForBand(key)[1].slug}?demo=1`}
            >
              Play a free game <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="wl-mission-grid">
            {missionsForBand(key).map((m) => (
              <MissionCard key={m.slug} mission={m} />
            ))}
          </div>
          <p className="wl-caption">
            A £20/month membership includes all 24 courses for one child. You
            can cancel at any time.{" "}
            {key === "explorers"
              ? "These games are designed for you and your child to play together."
              : "Your child can pause and return at their own pace."}{" "}
            {!launchStatus().commerce &&
              "Paid enrolment opens after our launch review."}
          </p>
        </section>
      ))}
      <section className="wl-section wg-next-worlds">
        <span className="wl-eyebrow">
          {kids
            ? "THE ADVENTURE GROWS WITH THEM"
            : "EXPLORE THE YOUNGER LEVELS"}
        </span>
        <h2>
          {kids
            ? "Looking for the teenage years?"
            : "You can explore games for younger children too."}
        </h2>
        <p>
          {kids
            ? "Creators (11–13) and Future Studio (14–16) bring more independent thinking, creative challenges and practical AI skills."
            : "Little Explorers (4–6) and Inventors (7–10) build early skills through picture games and playful making."}
        </p>
        <div className="wl-world-grid">
          {(kids ? ["creators", "studio"] : ["explorers", "inventors"]).map(
            (band) => (
              <WorldCard key={band} band={band as Band} />
            ),
          )}
        </div>
      </section>
    </>
  );
}
export function Home() {
  return (
    <>
      <section className="wl-hero">
        <div className="wl-hero-copy">
          <span className="wl-pill">
            <span /> BIG IDEAS START WITH A LITTLE WONDER
          </span>
          <h1>
            Help your child
            <br />
            think, create
            <br />
            <span className="wl-heading-pop">
              and use AI well.
              <svg viewBox="0 0 520 22" aria-hidden="true">
                <path d="M4 14Q220-4 512 11" />
              </svg>
            </span>
          </h1>
          <p>
            Your child will learn how to communicate with AI, question answers
            that sound convincing and keep their own judgement in charge.
            Stories, games and creative projects bring these skills to life
            across four age levels, from 4 to 16.
          </p>
          <div className="wl-actions">
            <Link className="wl-button" href="/wonderlab/games">
              Start learning with a free game <ArrowUpRight size={20} />
            </Link>
            <Link className="wl-quiet-link" href="/wonderlab/parents">
              How it works for your family <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="wl-hero-facts">
            <span>
              <Check size={16} /> Learn through play
            </span>
            <span>
              <Check size={16} /> Four age levels
            </span>
            <span>
              <Check size={16} /> £20/month · all courses
            </span>
          </div>
        </div>
        <div className="wl-hero-art">
          <Image
            src="/images/wonderlab/inventors.png"
            alt="An imaginative island with an invention workshop, colourful creatures and Pip the robot"
            fill
            sizes="(max-width: 850px) 100vw, 55vw"
            priority
          />
          <div className="wl-art-label">
            <Sparkles size={19} /> Discover what your ideas can do.
          </div>
          <span className="wl-float-sticker">
            Let your
            <br />
            <strong>ideas grow.</strong>
            <span aria-hidden="true">✳</span>
          </span>
        </div>
      </section>
      <section
        className="wl-membership-offer"
        aria-labelledby="membership-title"
      >
        <div>
          <span className="wl-eyebrow">
            ONE MEMBERSHIP INCLUDES EVERY AGE LEVEL.
          </span>
          <h2 id="membership-title">Your child can explore every adventure.</h2>
          <p>
            Help your child build confidence with AI through all 24 learning
            games. Follow their age level, revisit favourites and watch their
            skills grow.
          </p>
          <ul>
            <li>Your child can explore all 24 courses across ages 4–16.</li>
            <li>
              They can replay the games as often as they like while their
              membership is active.
            </li>
            <li>
              Their creations stay private, and you can follow their progress.
            </li>
          </ul>
        </div>
        <div className="wl-membership-price">
          <p>
            <strong>£20</strong>
            <span>per month, per child</span>
          </p>
          <Link className="wl-button" href="/wonderlab/games">
            Start learning with a free game <ArrowUpRight size={18} />
          </Link>
          <p className="wl-caption">
            Your membership renews monthly. You can cancel at any time, and
            access continues until the end of the paid month.
          </p>
          {!launchStatus().commerce && (
            <p className="wl-caption">
              Membership opens after our launch review. Try a free game today.
            </p>
          )}
        </div>
      </section>
      <div className="wl-ribbon">
        <span>IMAGINE IT</span>
        <span aria-hidden="true">✳</span>
        <span>MAKE IT</span>
        <span aria-hidden="true">✳</span>
        <span>QUESTION IT</span>
        <span aria-hidden="true">✳</span>
        <span>TRY AGAIN</span>
        <span aria-hidden="true">✳</span>
        <span>MAKE IT YOURS</span>
      </div>
      <section className="wl-section" id="worlds">
        <div className="wl-section-heading">
          <div>
            <span className="wl-eyebrow">CHOOSE YOUR CHILD’S AGE LEVEL</span>
            <h2>Your child can build on what they learn.</h2>
          </div>
          <p>
            From picture games you play together to independent teen projects,
            each level teaches practical skills through age-appropriate
            activities.
          </p>
        </div>
        <div className="wl-world-grid">
          {(Object.keys(bands) as Band[]).map((b) => (
            <WorldCard key={b} band={b} />
          ))}
        </div>
      </section>
      <section className="wl-section wg-featured-games">
        <span className="wl-eyebrow">YOUR CHILD CAN LEARN BY PLAYING.</span>
        <h2>Let them play.</h2>
        <p>
          There is a free game for each of the four age levels. Your child can
          try ideas, learn from what happens and earn a sticker by completing a
          new challenge.
        </p>
        <GameCards />
      </section>
      <section className="wl-pip-section">
        <div className="wl-pip-portrait">
          <Pip />
          <span className="wl-handnote">Hello, I’m Pip!</span>
        </div>
        <div>
          <span className="wl-eyebrow">
            PIP HELPS YOUR CHILD PRACTISE CHECKING.
          </span>
          <h2>
            Even robots
            <br />
            get things wrong.
          </h2>
          <p>
            Pip is our fictional robot guide. Sometimes Pip’s instructions get
            muddled, or a confident answer needs another look. Your child helps
            investigate what went wrong.
          </p>
          <p>
            By helping Pip, your child will practise giving clear instructions,
            checking answers against evidence and deciding what to change.
          </p>
          <Link
            href="/wonderlab/play/robot-rescue?demo=1"
            className="wl-button"
          >
            Try a free activity together <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="wl-section">
        <div className="wl-section-heading">
          <div>
            <span className="wl-eyebrow">PLAY WITH A PURPOSE</span>
            <h2>Your child will practise skills they can use again.</h2>
          </div>
        </div>
        <div className="wl-benefits">
          {[
            [
              Compass,
              "Your child will learn to explain what they need.",
              "Your child will practise explaining what they need, giving useful context and improving a request when the result misses the point.",
            ],
            [
              Palette,
              "Your child will practise making their own creative decisions.",
              "Your child will develop their own ideas, make choices and revise first attempts, learning to treat AI suggestions as something to evaluate.",
            ],
            [
              ShieldCheck,
              "Your child will learn to question a convincing answer.",
              "Your child will learn that a confident answer can still be wrong, and practise checking evidence before trusting or sharing it.",
            ],
          ].map(([Icon, title, copy]) => {
            const I = Icon as typeof Compass;
            return (
              <article key={String(title)}>
                <I size={32} />
                <h3>{String(title)}</h3>
                <p>{String(copy)}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="wl-parent-banner">
        <div>
          <span className="wl-eyebrow">FOR PARENTS AND GUARDIANS</span>
          <h2>
            Help your child build
            <br />
            useful habits through play.
          </h2>
          <p>
            The activities are designed for your child’s age, their creations
            stay private and the family space helps you follow their progress.{" "}
            {launchStatus().commerce
              ? "Start learning with a free game before choosing a membership."
              : "Start learning with a free game while we prepare memberships for launch."}
          </p>
        </div>
        <Link href="/wonderlab/parents" className="wl-button wl-light">
          See how Wonderlab works <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}
