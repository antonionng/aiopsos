import Link from "next/link";
import { withSiteShareImages } from "@/lib/social-image";
import { wonderlabShare } from "@/lib/wonderlab/share";
import { GameCards } from "@/components/wonderlab/game-cards";
export const metadata = withSiteShareImages({
  ...wonderlabShare,
  title: "Choose your game world",
  description:
    "Four free interactive AI-learning games for ages 4–16. Build, investigate, solve and collect your discovery sticker.",
});
export default function Page() {
  return (
    <div className="wl-section wg-game-lobby">
      <span className="wl-eyebrow">WONDERLAB / FREE TO PLAY</span>
      <h1>
        What will you
        <br />
        discover today?
      </h1>
      <p>
        Choose a game for your age to practise giving clear instructions or
        checking what a machine tells you. Each game explains what to do, lets
        you test your ideas and helps you learn from mistakes. Complete the
        game’s challenges and explain what you discovered to earn your sticker.
      </p>
      <GameCards />
      <p className="wl-caption">
        For more games for ages 11–16,{" "}
        <Link href="/wonderlab/district">browse the full game collection</Link>.
      </p>
      <div className="wl-notice">
        Little Explorers play with a grown-up. Every game has written
        instructions, optional read-aloud, unlimited retries and no timer. These
        free games use examples written in advance to help you understand AI.
        They do not use live AI. Free-game progress is not saved to a child’s
        profile. Download your creation before leaving.
      </div>
    </div>
  );
}
