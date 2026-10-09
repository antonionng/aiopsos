import { MissionArtwork } from "../mission-artwork";
import { missions } from "@/lib/wonderlab/catalog";
import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  Hammer,
  Radio,
  Rocket,
  Sparkles,
} from "lucide-react";
import { adventures } from "@/lib/wonderlab/adventure/catalog";
const zones = [
  {
    id: "signal",
    name: "Signal Hunt",
    icon: Radio,
    tag: "EXPLORE & INVESTIGATE",
    text: "Explore the city, follow clues and repair a broadcast you cannot trust.",
    slug: "rumour-lab",
  },
  {
    id: "forge",
    name: "World Forge",
    icon: Hammer,
    tag: "BUILD & PLAYTEST",
    text: "Give the builder a brief, create a world and step inside to test it.",
    slug: "prompt-repair-shop",
  },
  {
    id: "launch",
    name: "Launch Control",
    icon: Rocket,
    tag: "PLAN & EXPERIMENT",
    text: "Take the controls, run a rehearsal and make your plan work.",
    slug: "brief-builder",
  },
];
export function District({
  owned = false,
  preferredBand,
  nickname,
  availableSlugs,
}: {
  owned?: boolean;
  preferredBand?: "creators" | "studio";
  nickname?: string;
  availableSlugs?: string[];
}) {
  const firstGame =
    preferredBand === "studio" ? "brief-builder" : "prompt-repair-shop";
  const canStart =
    !owned || !availableSlugs || availableSlugs.includes(firstGame);
  return (
    <div className="wd-district">
      <header className="wd-district-heading">
        <span className="wd-kicker">
          <Compass size={16} /> WONDERLAB DISTRICT · AGES 11–16
        </span>
        <h1>
          {nickname ? (
            <>Choose your next game, {nickname}.</>
          ) : (
            <>
              Your ideas bring
              <br />
              <em>this district to life.</em>
            </>
          )}
        </h1>
        <p>
          Choose one game below. You will see your goal, play a challenge and
          test your idea. Each game explains the next step as you go.
        </p>
        <div className="wd-district-actions">
          {canStart && (
            <Link
              href={
                owned
                  ? `/wonderlab/play/${firstGame}`
                  : "/wonderlab/play/prompt-repair-shop?demo=1"
              }
              className="wd-primary"
            >
              {owned
                ? preferredBand === "studio"
                  ? "Play Launch Control"
                  : "Play Bridgeworks"
                : "Play free Bridgeworks"}{" "}
              <ArrowUpRight size={19} />
            </Link>
          )}
          <Link
            href={owned ? "/wonderlab/family" : "/wonderlab/games"}
            className="wd-quiet"
          >
            {owned
              ? "Back to my family space"
              : "Find a free game for another age"}
          </Link>
        </div>
      </header>
      <div className="wd-world-map" aria-label="Three game districts">
        <div className="wd-map-orbit" />
        <div className="wd-map-route" />
        <span className="wd-map-caption">YOUR IDEAS POWER THIS PLACE.</span>
        {zones.map((zone, i) => (
          <a
            href={`#${zone.id}`}
            key={zone.id}
            className={`wd-zone wd-zone-${zone.id}`}
          >
            <div className="wd-zone-building">
              <zone.icon size={50} />
              <span className="wd-zone-window" />
              <span className="wd-zone-window two" />
            </div>
            <span className="wd-zone-number">0{i + 1}</span>
            <strong>{zone.name}</strong>
            <small>{zone.tag}</small>
          </a>
        ))}
        <div className="wd-map-you">
          <Sparkles size={18} /> Your next discovery is waiting.
        </div>
      </div>
      <div className="wd-district-description">
        <h2>Choose a place to make a difference.</h2>
        <p>
          Each mission introduces its own problem. Explore in any order, try
          different ideas and keep the things you create.
        </p>
      </div>
      {zones.map((zone) => (
        <section
          key={zone.id}
          id={zone.id}
          className={`wd-zone-section ${zone.id}`}
        >
          <header>
            <span className="wd-zone-icon">
              <zone.icon />
            </span>
            <div>
              <h2>{zone.name}</h2>
              <p>{zone.text}</p>
            </div>
          </header>
          <div className="wd-mission-grid">
            {adventures
              .filter((g) => g.zone === zone.id)
              .map((g) => (
                <Link
                  key={g.slug}
                  href={
                    owned && availableSlugs && !availableSlugs.includes(g.slug)
                      ? "/wonderlab/family"
                      : !owned && !g.free
                        ? "/wonderlab/family"
                        : `/wonderlab/play/${g.slug}${g.free && !owned ? "?demo=1" : ""}`
                  }
                  className="wd-mission-card"
                >
                  <MissionArtwork
                    band={g.band}
                    number={missions.find((m) => m.slug === g.slug)!.number}
                    className="wd-mission-illustration"
                  />
                  <div className="wd-card-body">
                    <span className="wd-kicker">
                      AGES {g.band === "creators" ? "11–13" : "14–16"} ·{" "}
                      {owned
                        ? availableSlugs && !availableSlugs.includes(g.slug)
                          ? "NOT OPEN ON THIS PROFILE"
                          : "IN YOUR COLLECTION"
                        : g.free
                          ? "FREE GAME"
                          : "MEMBERSHIP GAME"}
                    </span>
                    <h3>{g.name}</h3>
                    <p>{g.subtitle}</p>
                    <span className="wd-card-link">
                      {owned
                        ? availableSlugs && !availableSlugs.includes(g.slug)
                          ? "Ask your grown-up to open this game"
                          : "Play this game"
                        : g.free
                          ? "Play the free game"
                          : "Open family space to play"}
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      ))}
      <p className="wd-footnote">
        These games use prepared examples and simulations to practise AI skills.
        Your creations are private. There are no rankings, streak penalties or
        purchase prompts inside play.
      </p>
    </div>
  );
}
