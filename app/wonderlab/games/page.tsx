import Link from "next/link";
import { withSiteShareImages } from "@/lib/social-image";
import { wonderlabShare } from "@/lib/wonderlab/share";
import { GameCards } from "@/components/wonderlab/game-cards";
import { FeaturedGames } from "@/components/wonderlab/featured-games";
export const metadata = withSiteShareImages({
  ...wonderlabShare,
  title: "Choose your game world",
  description:
    "Free games where children aged 4–16 teach an AI, predict what it will do and fix its mistakes.",
});
export default function Page() {
  return (
    <div className="wl-section wg-game-lobby">
      <header className="wgl-lobby-head">
        <span className="wl-eyebrow">WONDERLAB ARCADE / FREE TO PLAY</span>
        <h1>
          Pick a game.
          <br />
          <em>Teach an AI.</em>
        </h1>
        <p>
          In these games you do not just read about AI. You teach it, test it
          and catch it making mistakes, then work out how to make it better.
        </p>
      </header>
      <FeaturedGames />
      <div className="wgl-more">
        <h2>More games to try</h2>
        <Link href="/wonderlab/district">Browse the full collection for ages 11–16</Link>
      </div>
      <GameCards />
      <div className="wl-notice">
        Little Explorers play with a grown-up. Every game has optional
        read-aloud, unlimited retries and no timer. These free games use
        examples written in advance to help you understand AI. They do not use
        live AI. Free-game progress is not saved to a child’s profile, so
        download any creation before leaving.
      </div>
    </div>
  );
}
