import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

/** The newest games, shown with real gameplay images. */
export function FeaturedGames({ showHowItPlays = true }: { showHowItPlays?: boolean }) {
  return (
    <div className="wgl-featured">
      <Link href="/wonderlab/creature-crossing" className="wgl-hero-card">
        <div className="wgl-hero-shot">
        <Image
          src="/images/wonderlab/games/creature-crossing-stampede.webp"
          alt="A herd of fish, fox and bird creatures crossing a floating island towards the glowing Wonder Gate, with the river, the woods and the training pen around it"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 1400px"
          className="wgl-shot"
        />
        </div>
        <span className="wgl-sticker" aria-hidden="true">
          NEW!
        </span>
        <div className="wgl-hero-copy">
          <span className="wgl-tags">
            <span>Ages 7 to 13</span>
            <span>4 levels</span>
            <span>Free</span>
          </span>
          <h2>Creature Crossing</h2>
          <p>Teach the magic gate where creatures live, then watch the stampede. Can you beat the colour trap?</p>
          <span className="wgl-play">
            <Play size={20} fill="currentColor" /> Play now
          </span>
          <ul className="wgl-perks" aria-label="What makes it fun">
            <li>🎙️ Pip talks you through it</li>
            <li>🔮 Predict what the AI will do</li>
            <li>⭐ Win up to 12 stars</li>
          </ul>
        </div>
      </Link>

      <div className="wgl-row">
        <Link href="/wonderlab/arcade-preview" className="wgl-card wgl-card-night">
          <div className="wgl-card-shot">
            <Image
              src="/images/wonderlab/games/arcade-apprentice-world.webp"
              alt="The Starlight Arcade at night, with a glowing game cabinet, lanterns and Pip the robot"
              fill
              sizes="(max-width: 900px) 100vw, 700px"
              className="wgl-shot"
            />
            <span className="wgl-badge">Playtest</span>
          </div>
          <div className="wgl-card-copy">
            <h3>Arcade Apprentice</h3>
            <p>Describe a game, step inside it and play what you made. Then change your words and watch the game change.</p>
            <span className="wgl-play wgl-play-small">
              <Play size={16} fill="currentColor" /> Play
            </span>
          </div>
        </Link>

        <Link href="/wonderlab/snack-sorter" className="wgl-card wgl-card-picnic">
          <div className="wgl-card-shot">
            <Image
              src="/images/wonderlab/games/snack-sorter-belt.webp"
              alt="Pip the robot at a picnic, sorting fruit and a rock from a conveyor belt into a yummy basket and a yucky basket"
              fill
              sizes="(max-width: 900px) 100vw, 600px"
              className="wgl-shot"
            />
            <span className="wgl-badge">New · Ages 4 to 6</span>
          </div>
          <div className="wgl-card-copy">
            <h3>Pip&apos;s Snack Sorter</h3>
            <p>Teach Pip the robot which things are yummy and which are yucky, then watch Pip sort the lunch belt. Play together with a grown-up.</p>
            <span className="wgl-play wgl-play-small">
              <Play size={16} fill="currentColor" /> Play
            </span>
          </div>
        </Link>

        <Link href="/wonderlab/autocomplete-oracle" className="wgl-card wgl-card-night">
          <div className="wgl-card-shot">
            <Image
              src="/images/wonderlab/games/autocomplete-oracle-orb.webp"
              alt="The Autocomplete Oracle, a glowing orb, writing a sentence word by word with bars showing how likely each next word is"
              fill
              sizes="(max-width: 900px) 100vw, 600px"
              className="wgl-shot"
            />
            <span className="wgl-badge">New · Ages 11 to 16</span>
          </div>
          <div className="wgl-card-copy">
            <h3>Autocomplete Oracle</h3>
            <p>Train a tiny text generator, catch it writing confident nonsense and decide when it should say “I don’t know”.</p>
            <span className="wgl-play wgl-play-small">
              <Play size={16} fill="currentColor" /> Play
            </span>
          </div>
        </Link>

        {showHowItPlays && (
          <div className="wgl-card wgl-how">
            <div className="wgl-card-shot">
              <Image
                src="/images/wonderlab/games/creature-crossing-predict.webp"
                alt="Creature Crossing pauses a striped fish under the gate and asks the player to predict whether the gate will send it to the river or the woods"
                fill
                sizes="(max-width: 900px) 100vw, 700px"
                className="wgl-shot"
              />
            </div>
            <div className="wgl-card-copy">
              <h3>How you learn by playing</h3>
              <ol>
                <li>
                  <b>1</b> Teach an AI with examples
                </li>
                <li>
                  <b>2</b> Predict what it will do
                </li>
                <li>
                  <b>3</b> Spot its mistakes and fix them
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
