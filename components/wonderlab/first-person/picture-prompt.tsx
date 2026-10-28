"use client";

import { Bug, Check, Footprints, Gem, KeyRound, MoonStar, Star, Sunset, Trees, Zap } from "lucide-react";
import { applyPracticeRequest, type ArcadeDesign } from "@/lib/wonderlab/first-person";

type PicturePromptProps = {
  current: ArcadeDesign;
  request: string;
  disabled: boolean;
  onRequest: (text: string) => void;
  showRules?: boolean;
  showSpeed?: boolean;
};

const places = [
  { value: "twilight", label: "Moonlit", Icon: MoonStar },
  { value: "forest", label: "Forest", Icon: Trees },
  { value: "sunset", label: "Sunset", Icon: Sunset },
] as const;

const treasures = [
  { value: "star", label: "Stars", Icon: Star },
  { value: "crystal", label: "Crystals", Icon: Gem },
  { value: "firefly", label: "Fireflies", Icon: Bug },
] as const;

const numberWords: Record<number, string> = { 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight" };

/** Picture choices prepare a prompt. The parent's build action applies it to the game. */
export function PicturePrompt({ current, request, disabled, onRequest, showRules = false, showSpeed = false }: PicturePromptProps) {
  const intended = applyPracticeRequest(request, current).design;
  const TreasureIcon = treasures.find((treasure) => treasure.value === intended.collectible)?.Icon ?? Star;

  function choose(patch: Partial<Pick<ArcadeDesign, "palette" | "collectible" | "target" | "challenge" | "speed">>) {
    if (disabled) return;
    const next = { ...intended, ...patch };
    const treasure = next.collectible === "firefly" ? "fireflies" : `${next.collectible}s`;
    onRequest(`Make a ${next.palette} game with ${numberWords[next.target]} ${treasure}. Walk at a ${next.speed} speed. ${next.challenge === "key" ? "Add a key that unlocks the portal." : "Remove the key."}`);
  }

  return (
    <div className="fp-picture-prompt">
      <p className="fp-picture-intro">Choose a place and some treasure. Pip will turn your choices into words.</p>
      <fieldset className="fp-picture-group" disabled={disabled}>
        <legend>Choose a place.</legend>
        <div className="fp-picture-options">
          {places.map(({ value, label, Icon }) => (
            <button
              type="button"
              key={value}
              className={`fp-picture-card fp-picture-place fp-picture-${value}`}
              style={{ minWidth: 48, minHeight: 72 }}
              aria-label={`Choose a ${label.toLowerCase()} world`}
              aria-pressed={intended.palette === value}
              onClick={() => choose({ palette: value })}
            >
              <Icon size={30} aria-hidden="true" />
              <span>{label}</span>
              {intended.palette === value && <Check className="fp-picture-check" size={16} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </fieldset>
      {showRules && <fieldset className="fp-picture-group" disabled={disabled}><legend>How will the portal open?</legend><div className="fp-picture-options fp-picture-pair">{([{ value: "collect", label: "Find the treasure", Icon: Star }, { value: "key", label: "Find treasure and a key", Icon: KeyRound }] as const).map(({ value, label, Icon }) => <button className="fp-picture-card" key={value} aria-pressed={intended.challenge === value} onClick={() => choose({ challenge: value })}><Icon size={28} /><span>{label}</span>{intended.challenge === value && <Check className="fp-picture-check" size={16} />}</button>)}</div></fieldset>}
      {showSpeed && <fieldset className="fp-picture-group" disabled={disabled}><legend>How quickly will you walk?</legend><div className="fp-picture-options fp-picture-pair">{([{ value: "calm", label: "Gently", Icon: Footprints }, { value: "swift", label: "Quickly", Icon: Zap }] as const).map(({ value, label, Icon }) => <button className="fp-picture-card" key={value} aria-pressed={intended.speed === value} onClick={() => choose({ speed: value })}><Icon size={28} /><span>{label}</span>{intended.speed === value && <Check className="fp-picture-check" size={16} />}</button>)}</div></fieldset>}
      <fieldset className="fp-picture-group" disabled={disabled}>
        <legend>Choose your treasure.</legend>
        <div className="fp-picture-options">
          {treasures.map(({ value, label, Icon }) => (
            <button
              type="button"
              key={value}
              className="fp-picture-card fp-picture-treasure"
              style={{ minWidth: 48, minHeight: 72 }}
              aria-label={`Choose ${label.toLowerCase()}`}
              aria-pressed={intended.collectible === value}
              onClick={() => choose({ collectible: value })}
            >
              <Icon size={30} aria-hidden="true" />
              <span>{label}</span>
              {intended.collectible === value && <Check className="fp-picture-check" size={16} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="fp-picture-group" disabled={disabled}>
        <legend>How many will you find?</legend>
        <div className="fp-picture-options">
          {[3, 5, 8].map((target) => (
            <button
              type="button"
              key={target}
              className="fp-picture-card fp-picture-number"
              style={{ minWidth: 48, minHeight: 72 }}
              aria-label={`Find ${numberWords[target]} ${intended.collectible === "firefly" ? "fireflies" : `${intended.collectible}s`}`}
              aria-pressed={intended.target === target}
              onClick={() => choose({ target })}
            >
              <strong>{target}</strong>
              <span className="fp-picture-count" aria-hidden="true">
                {Array.from({ length: target }, (_, index) => <TreasureIcon key={index} size={12} />)}
              </span>
              {intended.target === target && <Check className="fp-picture-check" size={16} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
