import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { arcadeGames } from "@/lib/wonderlab/games";
import { getAdventure } from "@/lib/wonderlab/adventure/catalog";
import { MissionArtwork } from "./mission-artwork";

export function GameCards() {
  return (
    <div className="wg-game-cards">
      {arcadeGames.map((game) => {
        const adventure = getAdventure(game.slug);
        return (
          <Link key={game.slug} href={`/wonderlab/play/${game.slug}?demo=1`}>
            <MissionArtwork
              band={game.band}
              number={2}
              className="wg-card-illustration"
            />
            <span>AGES {game.ages}</span>
            <div>
              <h3>{adventure?.name ?? game.name}</h3>
              <p>{adventure?.subtitle ?? game.pitch}</p>
              <strong>
                Play this free game <ArrowRight size={17} />
              </strong>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
