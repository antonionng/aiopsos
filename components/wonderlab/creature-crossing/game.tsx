"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, FastForward, Lock, RotateCcw, Sparkles, Star, Tag, Volume2, VolumeX } from "lucide-react";
import {
  CROSSING_LEVELS,
  CROSSING_VERSION,
  HOMES,
  PIP,
  TUTORIAL,
  explain,
  homeOf,
  readCrossingSave,
  missingHomes,
  runHerd,
  unlocked,
  type CrossingSave,
  type Decision,
  type Home,
} from "@/lib/wonderlab/creature-crossing";
import { Pip } from "@/components/wonderlab/art";
import { useNarration } from "@/components/wonderlab/use-narration";
import type { CrossingWorld } from "./engine";
import { CreatureIcon, HOME_GLYPH } from "./creature-icon";
import { setMuted, sfx } from "./sfx";

type Phase = "title" | "teach" | "run" | "result" | "finale";
type Outcome = "home" | "lost" | "unsure";
type Guess = Home | "unsure";
const SAVE_KEY = "wonderlab-creature-crossing";
const GUESS_LABEL: Record<Guess, string> = { river: "River", woods: "Woods", sky: "Sky", unsure: "Can't decide" };
const GUESS_GLYPH: Record<Guess, string> = { ...HOME_GLYPH, unsure: "❓" };

function loadSave(): CrossingSave {
  try {
    return readCrossingSave(JSON.parse(window.localStorage.getItem(SAVE_KEY) ?? "null"));
  } catch {
    return readCrossingSave(null);
  }
}

function storeSave(save: CrossingSave) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // Progress still works for this visit when storage is unavailable.
  }
}

export function CreatureCrossing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<CrossingWorld | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("title");
  const [levelIndex, setLevelIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [arrivals, setArrivals] = useState<Record<string, Outcome>>({});
  const [review, setReview] = useState<string | null>(null);
  const [save, setSave] = useState<CrossingSave>(() => readCrossingSave(null));
  const [muted, setMutedState] = useState(false);
  const [fast, setFast] = useState(false);
  const [labels, setLabels] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [pipLine, setPipLine] = useState<string>(PIP.welcome);
  // Index into TUTORIAL while Pip is guiding the first moves; TUTORIAL.length means "open the gate".
  const [tutorial, setTutorial] = useState<number | null>(null);
  const [predicting, setPredicting] = useState<string | null>(null);
  const [predictions, setPredictions] = useState({ right: 0, total: 0 });
  // The gate's answer, shown briefly after each prediction.
  const [reveal, setReveal] = useState<{ decision: Decision; guess: Guess } | null>(null);
  const holdsThisRun = useRef(0);
  const [streak, setStreak] = useState<{ count: number; key: number } | null>(null);
  const [answer, setAnswer] = useState<{ index: number; correct: boolean } | null>(null);
  const level = CROSSING_LEVELS[levelIndex];
  const { speak, stop: stopVoice, message: voiceMessage } = useNarration("inventors");
  const phaseRef = useRef(phase);
  const levelRef = useRef(level);
  const selectedRef = useRef(selected);
  const tutorialRef = useRef(tutorial);
  const mutedRef = useRef(muted);
  const runStreak = useRef(0);

  useEffect(() => {
    phaseRef.current = phase;
    levelRef.current = level;
    selectedRef.current = selected;
    tutorialRef.current = tutorial;
    mutedRef.current = muted;
  }, [phase, level, selected, tutorial, muted]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSave(loadSave()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMuted(muted);
    if (muted) stopVoice();
  }, [muted, stopVoice]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!streak) return;
    const timer = window.setTimeout(() => setStreak(null), 1600);
    return () => window.clearTimeout(timer);
  }, [streak]);

  /** Pip's words always appear on screen; the recorded voice plays unless sound is off. */
  const say = useCallback(
    (text: string, then?: () => void) => {
      setPipLine(text);
      if (mutedRef.current) {
        stopVoice();
        then?.();
        return;
      }
      speak(text, then);
    },
    [speak, stopVoice],
  );

  const toggleExample = useCallback(
    (id: string) => {
      if (phaseRef.current !== "teach") return;
      const step = tutorialRef.current;
      if (step !== null && step < TUTORIAL.length) {
        // During the guided start only the creature Pip asked for can be chosen.
        if (id !== TUTORIAL[step].target) {
          say(TUTORIAL[step].say);
          return;
        }
        const next = step + 1;
        setTutorial(next);
        if (next < TUTORIAL.length) {
          worldRef.current?.setPointer(TUTORIAL[next].target);
          say(TUTORIAL[next].say);
        } else {
          worldRef.current?.setPointer(null);
          say(PIP.openGate);
        }
      }
      const current = selectedRef.current;
      const limit = levelRef.current.slots;
      if (current.includes(id)) {
        const next = current.filter((item) => item !== id);
        setSelected(next);
        worldRef.current?.setSelected(next);
        sfx.unpick();
        return;
      }
      if (current.length >= limit) {
        setNotice(`The gate can remember ${limit} examples. Tap one you chose to swap it out.`);
        say(PIP.memoryFull);
        return;
      }
      const next = [...current, id];
      setSelected(next);
      worldRef.current?.setSelected(next);
      sfx.pick();
    },
    [say],
  );

  const pickInWorld = useCallback(
    (id: string) => {
      if (phaseRef.current === "teach") toggleExample(id);
      else if (phaseRef.current === "result" && id.startsWith("h")) setReview(id);
    },
    [toggleExample],
  );

  const onHold = useCallback(
    (id: string) => {
      setReveal(null);
      setPredicting(id);
      sfx.unsure();
      say(holdsThisRun.current === 0 ? PIP.predict : PIP.next);
      holdsThisRun.current += 1;
    },
    [say],
  );

  useEffect(() => {
    if (!reveal) return;
    const timer = window.setTimeout(() => setReveal(null), 2200);
    return () => window.clearTimeout(timer);
  }, [reveal]);

  // The 3D world is created once; its events reach the latest handlers through refs.
  const handlers = useRef({ pickInWorld, onHold });
  useEffect(() => {
    handlers.current = { pickInWorld, onHold };
  }, [pickInWorld, onHold]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    void import("./engine")
      .then(({ createCrossingWorld }) => {
        if (cancelled) return;
        try {
          worldRef.current = createCrossingWorld(
            canvas,
            {
              onReady: () => setReady(true),
              onError: setError,
              onPick: (id) => handlers.current.pickInWorld(id),
              onScan: () => sfx.scan(),
              onHold: (id) => handlers.current.onHold(id),
              onArrive: (id, outcome) => {
                setArrivals((previous) => ({ ...previous, [id]: outcome }));
                if (outcome === "home") {
                  sfx.home();
                  runStreak.current += 1;
                  if (runStreak.current >= 3) setStreak({ count: runStreak.current, key: Date.now() });
                } else {
                  runStreak.current = 0;
                  if (outcome === "lost") sfx.lost();
                  else sfx.unsure();
                }
              },
              onRunComplete: () => window.setTimeout(() => setPhase("result"), 700),
            },
            { reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches },
          );
          worldRef.current.setLevel(levelRef.current);
        } catch (problem) {
          console.error("creature-crossing:create", problem);
          setError("Your browser could not open this 3D world. Try a recent browser with 3D graphics turned on.");
        }
      })
      .catch(() => setError("The game could not load. Check your connection and reload the page."));
    return () => {
      cancelled = true;
      worldRef.current?.dispose();
      worldRef.current = null;
    };
  }, []);

  const result = useMemo(() => (decisions.length ? runHerd(level, selected) : null), [decisions, level, selected]);
  const counts = useMemo(() => {
    const values = Object.values(arrivals);
    return { home: values.filter((v) => v === "home").length, lost: values.filter((v) => v === "lost").length, unsure: values.filter((v) => v === "unsure").length };
  }, [arrivals]);

  // Record stars and let Pip react once a run finishes.
  useEffect(() => {
    if (phase !== "result" || !result) return;
    const timer = window.setTimeout(() => {
      setSave((previous) => {
        const best = Math.max(previous.stars[level.id] ?? 0, result.stars);
        if (best === previous.stars[level.id]) return previous;
        const next = { version: CROSSING_VERSION, stars: { ...previous.stars, [level.id]: best } };
        storeSave(next);
        return next;
      });
      say(result.stars === 3 ? PIP.allHome : result.stars > 0 ? PIP.someLost : PIP.manyLost);
      if (result.stars > 0) {
        sfx.win();
        for (let index = 0; index < result.stars; index += 1) window.setTimeout(() => sfx.star(index), 500 + index * 260);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [phase, result, level.id, say]);

  useEffect(() => {
    if (!review) return;
    const decision = decisions.find((item) => item.creature.id === review);
    if (decision) worldRef.current?.showThinking(review, decision.nearest.map((example) => example.id));
  }, [review, decisions]);

  const openReview = (id: string) => {
    if (!review) say(PIP.review);
    setReview(id);
  };

  const startLevel = (index: number) => {
    const next = CROSSING_LEVELS[index];
    const guided = index === 0 && !(save.stars[next.id] ?? 0);
    setLevelIndex(index);
    setSelected([]);
    setDecisions([]);
    setArrivals({});
    setReview(null);
    setAnswer(null);
    setMoreOpen(false);
    setPredictions({ right: 0, total: 0 });
    setTutorial(guided ? 0 : null);
    setPhase("teach");
    levelRef.current = next;
    worldRef.current?.setLevel(next);
    worldRef.current?.setLabels(labels);
    worldRef.current?.resetView();
    if (guided) {
      worldRef.current?.setPointer(TUTORIAL[0].target);
      say(next.pip, () => say(TUTORIAL[0].say));
    } else say(next.pip);
  };

  const openGate = () => {
    if (!selected.length) return;
    const outcome = runHerd(level, selected);
    runStreak.current = 0;
    setDecisions(outcome.decisions);
    setArrivals({});
    setReview(null);
    setAnswer(null);
    setPredictions({ right: 0, total: 0 });
    setPhase("run");
    worldRef.current?.setPointer(null);
    worldRef.current?.setSpeed(fast ? 2.6 : 1);
    worldRef.current?.resetView();
    holdsThisRun.current = 0;
    setReveal(null);
    // Every creature stops at the gate for a prediction; "Let the rest go" ends that.
    worldRef.current?.run(outcome.decisions, outcome.decisions.map((decision) => decision.creature.id));
    setTutorial(null);
    stopVoice();
    sfx.gate();
  };

  const predict = (guess: Guess) => {
    const decision = decisions.find((item) => item.creature.id === predicting);
    if (!decision) return;
    const right = decision.sentTo === guess;
    setPredictions((previous) => ({ right: previous.right + (right ? 1 : 0), total: previous.total + 1 }));
    if (right) sfx.win();
    say(right ? PIP.predictRight : PIP.predictWrong);
    setReveal({ decision, guess });
    setPredicting(null);
    worldRef.current?.release();
  };

  const letTheRestGo = () => {
    setPredicting(null);
    setReveal(null);
    stopVoice();
    worldRef.current?.releaseAll();
  };

  const changeExamples = () => {
    setPhase("teach");
    setDecisions([]);
    setArrivals({});
    setReview(null);
    setAnswer(null);
    worldRef.current?.resetHerd();
    worldRef.current?.resetView();
    say(level.pip);
  };

  const nextLevel = () => {
    if (levelIndex + 1 < CROSSING_LEVELS.length) startLevel(levelIndex + 1);
    else {
      worldRef.current?.resetView();
      setPhase("finale");
      say(PIP.finale);
    }
  };

  const chooseAnswer = (index: number, correct: boolean) => {
    setAnswer({ index, correct });
    if (correct) {
      sfx.win();
      say(PIP.answerRight);
    } else {
      sfx.lost();
      say(PIP.answerWrong);
    }
  };

  const toggleFast = () => {
    setFast((value) => {
      worldRef.current?.setSpeed(!value ? 2.6 : 1);
      return !value;
    });
  };

  const toggleLabels = () => {
    setLabels((value) => {
      worldRef.current?.setLabels(!value);
      return !value;
    });
  };

  const reviewDecision = review ? decisions.find((item) => item.creature.id === review) : null;
  const heldDecision = predicting ? decisions.find((item) => item.creature.id === predicting) : null;
  const misses = decisions.filter((decision) => !decision.correct);
  const totalStars = Object.values(save.stars).reduce((sum, value) => sum + value, 0);
  // The first level without three stars that is open to play.
  const nextPlayable = Math.max(0, CROSSING_LEVELS.findIndex((item, index) => unlocked(save, index) && (save.stars[item.id] ?? 0) < 3));
  const guesses: Guess[] = [...level.homes, ...(level.homes.includes("sky") ? (["unsure"] as const) : [])];
  const tutorialTarget = tutorial !== null && tutorial < TUTORIAL.length ? TUTORIAL[tutorial].target : null;
  // Rotate answer order between levels so the right answer is not always first.
  const options = level.question.options.map((option, index) => ({ ...option, index }));
  const rotated = [...options.slice(levelIndex % options.length), ...options.slice(0, levelIndex % options.length)];
  const examples = level.pen.filter((creature) => selected.includes(creature.id));
  const missing = missingHomes(level, selected);

  const pipBubble = (
    <div className="cc-pip" aria-live="polite">
      <span className="cc-pip-face" aria-hidden="true">
        <Pip small />
      </span>
      <p>{pipLine}</p>
      {!muted && (
        <button type="button" className="cc-pip-replay" onClick={() => say(pipLine)} aria-label="Hear Pip again">
          <Volume2 size={16} />
        </button>
      )}
    </div>
  );

  return (
    <div className={`cc-shell${phase === "title" || phase === "finale" ? " cc-dim" : ""}`}>
      <canvas ref={canvasRef} className="cc-canvas" aria-label="Creature Crossing island. Tap creatures in the training pen to choose examples." tabIndex={-1} />
      <div className="cc-vignette" aria-hidden="true" />

      <header className="cc-topbar">
        <Link href="/wonderlab/games" className="cc-round" aria-label="Back to Wonderlab games">
          <ArrowLeft size={20} />
        </Link>
        {phase !== "title" && phase !== "finale" ? (
          <button type="button" className="cc-level-chip" onClick={() => setPhase("title")}>
            <span>Level {level.number}</span>
            {level.title}
          </button>
        ) : (
          <span className="cc-brand">
            <span aria-hidden="true">✳</span> wonderlab
          </span>
        )}
        <div className="cc-top-actions">
          {(phase === "teach" || phase === "result") && (
            <button type="button" className="cc-round" onClick={toggleLabels} aria-pressed={labels} aria-label={labels ? "Hide home labels" : "Show home labels"} title={labels ? "Hide home labels" : "Show home labels"}>
              <Tag size={18} />
            </button>
          )}
          <button type="button" className="cc-round" onClick={() => setMutedState((value) => !value)} aria-label={muted ? "Turn sound and voice on" : "Turn sound and voice off"}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </header>

      {!ready && !error && (
        <div className="cc-loading" role="status">
          <span className="cc-spinner" aria-hidden="true" />
          Opening the island…
        </div>
      )}
      {error && (
        <div className="cc-loading" role="alert">
          {error}
        </div>
      )}

      {phase === "title" && (
        <section className="cc-title" aria-labelledby="cc-title-heading">
          <div className="cc-title-copy">
            <p className="cc-kicker">
              <span /> Free game · Ages 7 to 13 · Playtest
            </p>
            <h1 id="cc-title-heading">
              Creature <em>Crossing</em>
            </h1>
            <p className="cc-lede">Teach the magic gate where creatures live. Then open it and watch the stampede. Can you make it smart enough to get everyone home?</p>
            {ready && (
              <button type="button" className="cc-go cc-play" onClick={() => startLevel(nextPlayable)}>
                {totalStars ? `Play level ${nextPlayable + 1}` : "Start playing"} <ArrowRight size={18} />
              </button>
            )}
            <details className="cc-grownups">
              <summary>For grown-ups: what your child is learning</summary>
              <p>
                Many AI systems learn from examples instead of following rules a person wrote. The Wonder Gate is a simple AI of this kind: it compares each new creature with the examples your child chose and copies the home of the closest one. Your child will discover that an AI is only as good as its examples. Lopsided examples teach it the wrong clue, and it cannot recognise something it has never been shown. During each stampede the game pauses so your child can predict what the gate will do, which is a good way to check they understand how it decides. Pip&apos;s voice is a recording made with an AI voice. The gate itself runs entirely in this browser, with no live AI, no account and nothing your child types.
              </p>
            </details>
          </div>
          <div className="cc-levels" role="list" aria-label="Levels">
            {CROSSING_LEVELS.map((item, index) => {
              const open = unlocked(save, index);
              const stars = save.stars[item.id] ?? 0;
              return (
                <button key={item.id} role="listitem" type="button" className="cc-level-card" disabled={!open || !ready} onClick={() => startLevel(index)}>
                  <span className="cc-level-number">{open ? item.number : <Lock size={16} />}</span>
                  <span className="cc-level-name">
                    {item.title}
                    <small>
                      {item.homes.map((home) => HOME_GLYPH[home]).join(" ")} · {item.slots} examples
                    </small>
                  </span>
                  <span className="cc-level-stars" aria-label={`${stars} of 3 stars`}>
                    {[0, 1, 2].map((s) => (
                      <Star key={s} size={15} className={s < stars ? "cc-star-on" : ""} />
                    ))}
                  </span>
                </button>
              );
            })}
            <p className="cc-total">
              <Sparkles size={14} /> {totalStars} of {CROSSING_LEVELS.length * 3} stars collected. Progress is saved on this device.
            </p>
          </div>
        </section>
      )}

      {phase === "teach" && (
        <section className="cc-dock" aria-label="Teach the gate">
          <div className="cc-brief">
            {pipBubble}
            {tutorial === null && (
              <>
                <button type="button" className="cc-more" onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen}>
                  {moreOpen ? "Less" : "Tell me more"} <ChevronDown size={14} className={moreOpen ? "cc-flip" : ""} />
                </button>
                {moreOpen && (
                  <div className="cc-more-text">
                    <p>{level.brief}</p>
                    <p className="cc-hint">
                      <Sparkles size={14} /> {level.hint}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="cc-pen">
            <p className="cc-label">Training pen: tap a creature to teach the gate</p>
            <div className="cc-roster">
              {level.pen.map((creature) => {
                const chosen = selected.includes(creature.id);
                return (
                  <button
                    key={creature.id}
                    type="button"
                    className={`cc-chip${chosen ? " chosen" : ""}${tutorialTarget === creature.id ? " cc-guide" : ""}`}
                    aria-pressed={chosen}
                    onClick={() => toggleExample(creature.id)}
                    aria-label={`${creature.colour} ${creature.pattern} ${creature.shape} creature with ${creature.limbs}, lives in ${HOMES[homeOf(creature)].place}${chosen ? ", chosen" : ""}`}
                  >
                    <CreatureIcon creature={creature} size={46} title="" />
                    {labels && <span className={`cc-chip-home cc-home-${homeOf(creature)}`}>{HOMES[homeOf(creature)].name}</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="cc-launch">
            <p className="cc-label">
              Gate memory {selected.length} of {level.slots}
            </p>
            <div className="cc-slots">
              {Array.from({ length: level.slots }, (_, index) => {
                const creature = level.pen.find((item) => item.id === selected[index]);
                return (
                  <span key={index} className={`cc-slot${creature ? " filled" : ""}`}>
                    {creature ? <CreatureIcon creature={creature} size={34} /> : null}
                    {creature && <small>{HOME_GLYPH[homeOf(creature)]}</small>}
                  </span>
                );
              })}
            </div>
            <div className="cc-taught" aria-label="Examples for each home">
              {level.homes.map((home) => {
                const count = examples.filter((example) => homeOf(example) === home).length;
                return (
                  <span key={home} className={count ? "" : "cc-none"}>
                    {HOME_GLYPH[home]} {HOMES[home].name} {count}
                  </span>
                );
              })}
            </div>
            {selected.length > 0 && missing.length > 0 && (
              <p className="cc-warning" role="status">
                The gate has not seen any {missing.map((home) => HOMES[home].name).join(" or ")} creatures yet, so it cannot send anything there.
              </p>
            )}
            <button
              type="button"
              className={`cc-go${tutorial === TUTORIAL.length ? " cc-guide" : ""}`}
              onClick={openGate}
              disabled={!selected.length || (tutorial !== null && tutorial < TUTORIAL.length)}
            >
              Open the gate <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}

      {phase === "run" && (
        <>
          <div className="cc-scoreboard" role="status" aria-live="polite">
            <span className="cc-score home">🏠 {counts.home}</span>
            <span className="cc-score lost">❗ {counts.lost}</span>
            <span className="cc-score unsure">❓ {counts.unsure}</span>
            <span className="cc-score left">{decisions.length - counts.home - counts.lost - counts.unsure} to go</span>
          </div>
          {streak && (
            <div key={streak.key} className="cc-streak" aria-hidden="true">
              🔥 {streak.count} in a row!
            </div>
          )}
          {heldDecision || reveal ? (
            <section className="cc-predict" aria-labelledby="cc-predict-heading">
              {pipBubble}
              <div className="cc-predict-body">
                <div className="cc-predict-who">
                  <CreatureIcon creature={(heldDecision ?? reveal!.decision).creature} size={72} />
                  <span>This creature</span>
                </div>
                <div className="cc-predict-memory">
                  <span className="cc-label">{reveal ? "The gate thinks it looks like" : "Your examples"}</span>
                  <div>
                    {(reveal ? reveal.decision.nearest : examples).map((example) => (
                      <span key={example.id} className={`cc-example${reveal ? " cc-match" : ""}`}>
                        <CreatureIcon creature={example} size={reveal ? 52 : 40} />
                        <small>{HOME_GLYPH[homeOf(example)]}</small>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {reveal ? (
                <div className={`cc-reveal ${reveal.guess === reveal.decision.sentTo ? "right" : "wrong"}`} role="status">
                  <strong>
                    Gate says: {GUESS_GLYPH[reveal.decision.sentTo]} {GUESS_LABEL[reveal.decision.sentTo]}
                  </strong>
                  <span>{reveal.guess === reveal.decision.sentTo ? "🔮 You read its mind!" : `You guessed ${GUESS_LABEL[reveal.guess]}`}</span>
                </div>
              ) : (
                <>
                  <h2 id="cc-predict-heading">Where will the gate send it?</h2>
                  <div className="cc-guesses">
                    {guesses.map((guess) => (
                      <button key={guess} type="button" className="cc-guess" onClick={() => predict(guess)}>
                        <span aria-hidden="true">{GUESS_GLYPH[guess]}</span>
                        {GUESS_LABEL[guess]}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <button type="button" className="cc-skip" onClick={letTheRestGo}>
                Let the rest go <FastForward size={14} />
              </button>
            </section>
          ) : (
            <button type="button" className={`cc-fast${fast ? " on" : ""}`} onClick={toggleFast} aria-pressed={fast}>
              <FastForward size={18} /> {fast ? "Normal speed" : "Speed up"}
            </button>
          )}
        </>
      )}

      {phase === "result" && result && (
        <section className="cc-result" aria-labelledby="cc-result-heading">
          <div className="cc-stars" aria-label={`${result.stars} of 3 stars`}>
            {[0, 1, 2].map((s) => (
              <Star key={s} size={40} className={s < result.stars ? "cc-star-on cc-pop" : ""} style={{ animationDelay: `${0.3 + s * 0.26}s` }} />
            ))}
          </div>
          <h2 id="cc-result-heading">
            {result.home} of {result.total} got home
          </h2>
          {predictions.total > 0 && (
            <p className="cc-mind">
              🔮 Mind reader: you predicted {predictions.right} of {predictions.total}
            </p>
          )}
          {pipBubble}

          {misses.length > 0 && (
            <div className="cc-misses">
              {misses.map((decision) => (
                <button
                  key={decision.creature.id}
                  type="button"
                  className={`cc-miss${review === decision.creature.id ? " active" : ""}`}
                  onClick={() => openReview(decision.creature.id)}
                  aria-pressed={review === decision.creature.id}
                  aria-label={`See why this ${decision.creature.colour} creature with ${decision.creature.limbs} got lost`}
                >
                  <CreatureIcon creature={decision.creature} size={44} />
                  <span>{decision.sentTo === "unsure" ? "❓" : "❗"}</span>
                </button>
              ))}
            </div>
          )}

          {reviewDecision && (
            <div className="cc-thinking" aria-live="polite">
              <p className="cc-label">What the gate was thinking</p>
              <div className="cc-compare">
                <CreatureIcon creature={reviewDecision.creature} size={58} />
                <span className="cc-arrow">looked like</span>
                {reviewDecision.nearest.length ? (
                  reviewDecision.nearest.slice(0, 3).map((example) => (
                    <span key={example.id} className="cc-example">
                      <CreatureIcon creature={example} size={58} />
                      <small>{HOME_GLYPH[homeOf(example)]}</small>
                    </span>
                  ))
                ) : (
                  <span className="cc-example">nothing yet</span>
                )}
              </div>
              <p>{explain(reviewDecision)}</p>
            </div>
          )}

          {result.stars > 0 && (
            <div className="cc-question">
              <p className="cc-label">Pip&apos;s question</p>
              <h3>{level.question.ask}</h3>
              <div className="cc-answers">
                {rotated.map((option) => (
                  <button
                    key={option.index}
                    type="button"
                    className={`cc-answer${answer?.index === option.index ? (option.correct ? " right" : " wrong") : ""}`}
                    onClick={() => chooseAnswer(option.index, option.correct)}
                    disabled={answer?.correct === true}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
              {answer?.correct && <p className="cc-lesson-text">{level.lesson}</p>}
            </div>
          )}

          <div className="cc-actions">
            <button type="button" className="cc-secondary" onClick={changeExamples}>
              <RotateCcw size={16} /> Change my examples
            </button>
            {result.stars > 0 && (
              <button type="button" className="cc-go" onClick={nextLevel}>
                {levelIndex + 1 < CROSSING_LEVELS.length ? "Next level" : "Finish"} <ArrowRight size={18} />
              </button>
            )}
          </div>
        </section>
      )}

      {phase === "finale" && (
        <section className="cc-title cc-finale" aria-labelledby="cc-finale-heading">
          <div className="cc-title-copy">
            <p className="cc-kicker">
              <span /> Creature Crossing complete
            </p>
            <h1 id="cc-finale-heading">
              You are a <em>Gate Keeper</em>
            </h1>
            <p className="cc-lede">
              You taught an AI by choosing its examples, and you found out what happens when those examples are lopsided or missing something important. People who build AI do this every day: they check what their system learned from, test it on new examples and fix the gaps they find.
            </p>
            <div className="cc-how">
              <div>
                <b>✓</b>AI learns from examples
              </div>
              <div>
                <b>✓</b>Lopsided examples teach the wrong clue
              </div>
              <div>
                <b>✓</b>AI cannot recognise what it has never seen
              </div>
            </div>
            <div className="cc-actions">
              <button type="button" className="cc-go" onClick={() => setPhase("title")}>
                Replay a level for more stars <ArrowRight size={18} />
              </button>
              <Link className="cc-secondary" href="/wonderlab/games">
                More Wonderlab games
              </Link>
            </div>
          </div>
        </section>
      )}

      {notice && (
        <div className="cc-notice" role="status">
          {notice}
        </div>
      )}
      {voiceMessage && !muted && <span className="cc-sr">{voiceMessage}</span>}
    </div>
  );
}
