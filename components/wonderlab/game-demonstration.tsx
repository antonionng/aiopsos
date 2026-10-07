"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { demonstrations } from "@/lib/wonderlab/game-demonstrations";
import { Pip } from "./art";
import { Creature } from "./game-stage";
import { Treehouse } from "./game-scenery";

export function GameDemonstration({
  type,
  narrate,
  stop,
}: {
  type: keyof typeof demonstrations;
  narrate: (text: string, onEnd?: () => void) => void;
  stop: () => void;
}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const generation = useRef(0);
  const slides = demonstrations[type];
  useEffect(
    () => () => {
      generation.current++;
    },
    [],
  );
  function play(index: number, token = ++generation.current) {
    setStarted(true);
    setStep(index);
    setPlaying(true);
    narrate(slides[index], () => {
      if (generation.current !== token) return;
      if (index < slides.length - 1) play(index + 1, token);
      else setPlaying(false);
    });
  }
  function pause() {
    generation.current++;
    setPlaying(false);
    stop();
  }
  const corrected = step >= 2;
  return (
    <div
      className={`wg-demonstration ${type} step-${step} ${playing ? "playing" : "paused"}`}
    >
      <div className="wg-demo-top">
        <strong>Watch the example, then try it yourself.</strong>
        <span>DEMONSTRATION · {step + 1} / 4</span>
      </div>
      <div
        className="wg-demo-animation"
        aria-hidden="true"
        key={`${type}-${step}`}
      >
        {type === "route" ? (
          <>
            <div className="wg-demo-river" />
            <div className="wg-demo-bridge" />
            <div className="wg-demo-squares">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} />
              ))}
            </div>
            <div className="wg-demo-home">
              <Treehouse />
            </div>
            <div className="wg-demo-pip">
              <Pip small />
            </div>
            <div className="wg-demo-arrows">
              {(corrected ? ["→", "→", "→", "→"] : ["→", "↑"]).map(
                (arrow, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.6}s` }}>
                    {arrow}
                  </span>
                ),
              )}
              <b>
                {step === 1
                  ? "CHECK THE ROUTE"
                  : corrected
                    ? "TRY THE NEW ROUTE"
                    : "BUILD THE INSTRUCTIONS"}
              </b>
            </div>
          </>
        ) : type === "creature" ? (
          <>
            <div className="wg-demo-creature">
              <Creature
                features={
                  step === 0
                    ? []
                    : corrected
                      ? ["Rain boots", "Leaf disguise"]
                      : ["Space helmet"]
                }
                happy={corrected}
              />
            </div>
            <div className="wg-demo-feature one">
              {corrected ? "Rain boots ✓" : "Space helmet ?"}
            </div>
            <div className="wg-demo-feature two">
              {corrected ? "Leaf disguise ✓" : "Hide among leaves?"}
            </div>
          </>
        ) : type === "prompt" ? (
          <>
            <div className="wg-demo-source">
              FACT CARD
              <br />
              <strong>The Moon reflects sunlight.</strong>
            </div>
            <div className="wg-demo-prompt">
              {corrected ? "Use the fact card only" : "Invent exciting facts"}
              <span>↓</span>
            </div>
            <div
              className={`wg-demo-draft ${corrected ? "correct" : "incorrect"}`}
            >
              {corrected
                ? "The Moon reflects light from the Sun. ✓"
                : "A celebrity is visiting the museum! ?"}
            </div>
          </>
        ) : (
          <>
            <div className="wg-demo-source">
              SOURCE
              <br />
              <strong>
                The club meets on Saturday in the library. Food has not been
                confirmed.
              </strong>
            </div>
            <div className="wg-demo-poster">
              <strong>DESIGN CLUB</strong>
              <span className={step >= 1 ? "fixed" : ""}>
                {step >= 1 ? "Saturday ✓" : "Sunday ?"}
              </span>
              <span className={step >= 1 ? "fixed" : ""}>
                In the library {step >= 1 && "✓"}
              </span>
              <span className={corrected ? "removed" : ""}>
                Free pizza for everyone!
              </span>
            </div>
          </>
        )}
      </div>
      <p className="wg-demo-caption" aria-live="polite">
        {started
          ? slides[step]
          : "Press Play to watch a short, spoken demonstration. You can pause or move to the next step whenever you like."}
      </p>
      <div className="wg-demo-controls">
        <button onClick={() => (playing ? pause() : play(step))}>
          {playing ? <Pause size={18} /> : <Play size={18} />}{" "}
          {playing
            ? "Pause"
            : started
              ? "Play this step"
              : "Play demonstration"}
        </button>
        <button
          onClick={() => {
            pause();
            play(0);
          }}
          aria-label="Replay demonstration"
        >
          <RotateCcw size={18} /> Replay
        </button>
        <button
          onClick={() => {
            pause();
            setStarted(true);
            setStep((step + 1) % slides.length);
          }}
        >
          <SkipForward size={18} /> Next step
        </button>
      </div>
      <p className="wg-micro">
        Then try the game below. The demonstration does not earn a sticker.
      </p>
    </div>
  );
}
