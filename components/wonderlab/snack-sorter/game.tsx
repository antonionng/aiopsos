"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, FastForward, Lock, RotateCcw, Sparkles, Star, Volume2, VolumeX } from "lucide-react";
import {
  ITEMS,
  PIP_LINES,
  SORTER_LEVELS,
  SORTER_TUTORIAL,
  SORTER_VERSION,
  explain,
  missingBaskets,
  readSorterSave,
  runBelt,
  sorterUnlocked,
  type Basket,
  type Decision,
  type SorterSave,
} from "@/lib/wonderlab/snack-sorter";
import { Pip } from "@/components/wonderlab/art";
import { useNarration } from "@/components/wonderlab/use-narration";
import { setMuted, sfx } from "@/components/wonderlab/creature-crossing/sfx";
import type { SorterWorld } from "./engine";

type Phase = "title" | "teach" | "run" | "result" | "finale";
type Guess = Basket | "unsure";
type Outcome = "right" | "wrong" | "unsure";
type BeltDecision = Decision & { key: string };
const SAVE_KEY = "wonderlab-snack-sorter";
const BASKET_EMOJI: Record<Guess, string> = { yummy: "😋", yucky: "🤢", unsure: "🤔" };
const BASKET_NAME: Record<Guess, string> = { yummy: "Yummy", yucky: "Yucky", unsure: "Can't decide" };

function loadSave(): SorterSave {
  try {
    return readSorterSave(JSON.parse(window.localStorage.getItem(SAVE_KEY) ?? "null"));
  } catch {
    return readSorterSave(null);
  }
}

function storeSave(save: SorterSave) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // Stars still count for this visit when storage is unavailable.
  }
}

export function SnackSorter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<SorterWorld | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("title");
  const [levelIndex, setLevelIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [decisions, setDecisions] = useState<BeltDecision[]>([]);
  const [arrivals, setArrivals] = useState<Record<string, Outcome>>({});
  const [review, setReview] = useState<string | null>(null);
  const [save, setSave] = useState<SorterSave>(() => readSorterSave(null));
  const [muted, setMutedState] = useState(false);
  const [fast, setFast] = useState(false);
  const [pipLine, setPipLine] = useState<string>(PIP_LINES.welcome);
  const [tutorial, setTutorial] = useState<number | null>(null);
  const [predicting, setPredicting] = useState<string | null>(null);
  const [reveal, setReveal] = useState<{ decision: BeltDecision; guess: Guess } | null>(null);
  const [predictions, setPredictions] = useState({ right: 0, total: 0 });
  const [answer, setAnswer] = useState<{ index: number; correct: boolean } | null>(null);
  const level = SORTER_LEVELS[levelIndex];
  const { speak, stop: stopVoice } = useNarration("explorers");
  const phaseRef = useRef(phase);
  const levelRef = useRef(level);
  const selectedRef = useRef(selected);
  const tutorialRef = useRef(tutorial);
  const mutedRef = useRef(muted);
  const holds = useRef(0);

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
    if (!reveal) return;
    const timer = window.setTimeout(() => setReveal(null), 2200);
    return () => window.clearTimeout(timer);
  }, [reveal]);

  /** Pip's words always appear on screen; the recorded voice plays unless sound is off. */
  const say = useCallback(
    (text: string, then?: () => void) => {
      setPipLine(text);
      if (mutedRef.current) {
        stopVoice();
        then?.();
      } else speak(text, then);
    },
    [speak, stopVoice],
  );

  const onHold = useCallback(
    (key: string) => {
      setReveal(null);
      setPredicting(key);
      sfx.unsure();
      say(holds.current === 0 ? PIP_LINES.predict : PIP_LINES.next);
      holds.current += 1;
    },
    [say],
  );

  const handlers = useRef({ onHold });
  useEffect(() => {
    handlers.current = { onHold };
  }, [onHold]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    void import("./engine")
      .then(({ createSorterWorld }) => {
        if (cancelled) return;
        try {
          worldRef.current = createSorterWorld(
            canvas,
            {
              onReady: () => setReady(true),
              onError: setError,
              onHold: (key) => handlers.current.onHold(key),
              onScan: () => sfx.scan(),
              onArrive: (key, outcome) => {
                setArrivals((previous) => ({ ...previous, [key]: outcome }));
                if (outcome === "right") sfx.home();
                else if (outcome === "wrong") sfx.lost();
                else sfx.unsure();
              },
              onRunComplete: () => window.setTimeout(() => setPhase("result"), 700),
            },
            { reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches },
          );
          worldRef.current.setLevel(levelRef.current);
        } catch (problem) {
          console.error("snack-sorter:create", problem);
          setError("Your browser could not open this 3D picnic. Try a recent browser with 3D graphics turned on.");
        }
      })
      .catch(() => setError("The game could not load. Check your connection and reload the page."));
    return () => {
      cancelled = true;
      worldRef.current?.dispose();
      worldRef.current = null;
    };
  }, []);

  const result = useMemo(() => (decisions.length ? runBelt(level, selected) : null), [decisions, level, selected]);
  const counts = useMemo(() => {
    const values = Object.values(arrivals);
    return { right: values.filter((v) => v === "right").length, wrong: values.filter((v) => v !== "right").length };
  }, [arrivals]);

  useEffect(() => {
    if (phase !== "result" || !result) return;
    const timer = window.setTimeout(() => {
      setSave((previous) => {
        const best = Math.max(previous.stars[level.id] ?? 0, result.stars);
        if (best === previous.stars[level.id]) return previous;
        const next = { version: SORTER_VERSION, stars: { ...previous.stars, [level.id]: best } };
        storeSave(next);
        return next;
      });
      say(result.stars === 3 ? PIP_LINES.allRight : result.stars > 0 ? PIP_LINES.some : PIP_LINES.many);
      if (result.stars > 0) {
        sfx.win();
        worldRef.current?.celebrate();
        for (let index = 0; index < result.stars; index += 1) window.setTimeout(() => sfx.star(index), 500 + index * 260);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [phase, result, level.id, say]);

  const toggleExample = (id: string) => {
    if (phase !== "teach") return;
    if (tutorial !== null && tutorial < SORTER_TUTORIAL.length) {
      // During the guided start only the item Pip asked for can be chosen.
      if (id !== SORTER_TUTORIAL[tutorial].target) {
        say(SORTER_TUTORIAL[tutorial].say);
        return;
      }
      const next = tutorial + 1;
      setTutorial(next);
      say(next < SORTER_TUTORIAL.length ? SORTER_TUTORIAL[next].say : PIP_LINES.start);
    }
    if (selected.includes(id)) {
      const next = selected.filter((item) => item !== id);
      setSelected(next);
      worldRef.current?.setExamples(next);
      sfx.unpick();
      return;
    }
    if (selected.length >= level.slots) {
      say(PIP_LINES.full);
      return;
    }
    const next = [...selected, id];
    setSelected(next);
    worldRef.current?.setExamples(next);
    sfx.pick();
  };

  const startLevel = (index: number) => {
    const next = SORTER_LEVELS[index];
    const guided = index === 0 && !(save.stars[next.id] ?? 0);
    setLevelIndex(index);
    setSelected([]);
    setDecisions([]);
    setArrivals({});
    setReview(null);
    setAnswer(null);
    setPredictions({ right: 0, total: 0 });
    setTutorial(guided ? 0 : null);
    setPhase("teach");
    levelRef.current = next;
    worldRef.current?.setLevel(next);
    if (guided) say(next.pip, () => say(SORTER_TUTORIAL[0].say));
    else say(next.pip);
  };

  const startBelt = () => {
    if (!selected.length) return;
    const outcome = runBelt(level, selected);
    holds.current = 0;
    setDecisions(outcome.decisions);
    setArrivals({});
    setReview(null);
    setReveal(null);
    setAnswer(null);
    setPredictions({ right: 0, total: 0 });
    setTutorial(null);
    setPhase("run");
    worldRef.current?.setSpeed(fast ? 2.4 : 1);
    worldRef.current?.run(outcome.decisions, true);
    stopVoice();
    sfx.gate();
  };

  const predict = (guess: Guess) => {
    const decision = decisions.find((item) => item.key === predicting);
    if (!decision) return;
    const right = decision.sentTo === guess;
    setPredictions((previous) => ({ right: previous.right + (right ? 1 : 0), total: previous.total + 1 }));
    if (right) sfx.win();
    say(right ? PIP_LINES.right : PIP_LINES.wrong);
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

  const tryAgain = () => {
    setPhase("teach");
    setDecisions([]);
    setArrivals({});
    setReview(null);
    setAnswer(null);
    worldRef.current?.resetBelt();
    say(level.pip);
  };

  const nextLevel = () => {
    if (levelIndex + 1 < SORTER_LEVELS.length) startLevel(levelIndex + 1);
    else {
      setPhase("finale");
      say(PIP_LINES.finale);
      worldRef.current?.celebrate();
    }
  };

  const openReview = (decision: BeltDecision) => {
    setReview(decision.key);
    say(explain(decision));
  };

  const chooseAnswer = (index: number, correct: boolean) => {
    setAnswer({ index, correct });
    if (correct) sfx.win();
    else sfx.lost();
    say(correct ? PIP_LINES.answerRight : PIP_LINES.answerWrong);
  };

  const held = predicting ? decisions.find((item) => item.key === predicting) : null;
  const shown = held ?? reveal?.decision ?? null;
  const reviewDecision = review ? decisions.find((item) => item.key === review) : null;
  const misses = decisions.filter((decision) => !decision.correct);
  const missing = missingBaskets(level, selected);
  const totalStars = Object.values(save.stars).reduce((sum, value) => sum + value, 0);
  const nextPlayable = Math.max(0, SORTER_LEVELS.findIndex((item, index) => sorterUnlocked(save, index) && (save.stars[item.id] ?? 0) < 3));
  const tutorialTarget = tutorial !== null && tutorial < SORTER_TUTORIAL.length ? SORTER_TUTORIAL[tutorial].target : null;
  const rotated = (() => {
    const options = level.question.options.map((option, index) => ({ ...option, index }));
    const shift = levelIndex % options.length;
    return [...options.slice(shift), ...options.slice(0, shift)];
  })();

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
    <div className={`cc-shell ss-shell${phase === "title" || phase === "finale" ? " cc-dim" : ""}`}>
      <canvas ref={canvasRef} className="cc-canvas" aria-label="Pip's picnic. A conveyor belt carries things to Pip, who sorts them into a yummy basket and a yucky basket." tabIndex={-1} />
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
          <button type="button" className="cc-round" onClick={() => setMutedState((value) => !value)} aria-label={muted ? "Turn sound and voice on" : "Turn sound and voice off"}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </header>

      {!ready && !error && (
        <div className="cc-loading" role="status">
          <span className="cc-spinner" aria-hidden="true" />
          Setting up Pip&apos;s picnic…
        </div>
      )}
      {error && (
        <div className="cc-loading" role="alert">
          {error}
        </div>
      )}

      {phase === "title" && (
        <section className="cc-title" aria-labelledby="ss-title-heading">
          <div className="cc-title-copy">
            <p className="cc-kicker">
              <span /> Free game · Ages 4 to 6 · Play with a grown-up
            </p>
            <h1 id="ss-title-heading">
              Pip&apos;s <em>Snack Sorter</em>
            </h1>
            <p className="cc-lede">Teach Pip the robot which things are yummy and which are yucky. Then watch Pip sort the lunch belt all by itself!</p>
            {ready && (
              <button type="button" className="cc-go cc-play" onClick={() => startLevel(nextPlayable)}>
                {totalStars ? `Play level ${nextPlayable + 1}` : "Start playing"} <ArrowRight size={18} />
              </button>
            )}
            <details className="cc-grownups">
              <summary>For grown-ups: what your child is learning</summary>
              <p>
                Pip is a pretend AI that learns from examples. Your child chooses a few things to put in Pip&apos;s yummy and yucky baskets, then watches Pip sort new things by finding the example that looks most alike. Pip mostly looks at colour, so if every yummy example is red, Pip will try to eat a red toy car. Your child discovers that an AI only knows what it has been shown, and that it needs new examples when the rules change. Pip&apos;s voice is a recording made with an AI voice. There is no live AI, no account and nothing your child types. Sit with your child, play the voice and let them choose.
              </p>
            </details>
          </div>
          <div className="cc-levels" role="list" aria-label="Levels">
            {SORTER_LEVELS.map((item, index) => {
              const open = sorterUnlocked(save, index);
              const stars = save.stars[item.id] ?? 0;
              return (
                <button key={item.id} role="listitem" type="button" className="cc-level-card" disabled={!open || !ready} onClick={() => startLevel(index)}>
                  <span className="cc-level-number">{open ? item.number : <Lock size={16} />}</span>
                  <span className="cc-level-name">
                    {item.title}
                    <small>{item.pen.slice(0, 4).map((id) => ITEMS[id].emoji).join(" ")}</small>
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
              <Sparkles size={14} /> {totalStars} of {SORTER_LEVELS.length * 3} stars. Saved on this device.
            </p>
          </div>
        </section>
      )}

      {phase === "teach" && (
        <section className="cc-dock ss-dock" aria-label="Teach Pip">
          <div className="cc-brief">{pipBubble}</div>
          <div className="cc-pen">
            <p className="cc-label">Tap things to teach Pip</p>
            <div className="ss-tray">
              {level.pen.map((id) => {
                const item = ITEMS[id];
                const basket = level.rule(item);
                const chosen = selected.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    className={`ss-card ss-${basket}${chosen ? " chosen" : ""}${tutorialTarget === id ? " cc-guide" : ""}`}
                    aria-pressed={chosen}
                    aria-label={`${item.name}, ${basket}${chosen ? ", in Pip's basket" : ""}`}
                    onClick={() => toggleExample(id)}
                  >
                    <span className="ss-emoji" aria-hidden="true">
                      {item.emoji}
                    </span>
                    <span className="ss-tag">
                      {BASKET_EMOJI[basket]} {BASKET_NAME[basket]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="cc-launch">
            <p className="cc-label">
              Pip remembers {selected.length} of {level.slots}
            </p>
            <div className="ss-memory">
              {(["yummy", "yucky"] as const).map((basket) => (
                <div key={basket} className={`ss-basket ss-${basket}${missing.includes(basket) && selected.length ? " empty" : ""}`}>
                  <span aria-hidden="true">{BASKET_EMOJI[basket]}</span>
                  <span className="ss-basket-items">
                    {selected
                      .filter((id) => level.rule(ITEMS[id]) === basket)
                      .map((id) => ITEMS[id].emoji)
                      .join(" ") || "…"}
                  </span>
                </div>
              ))}
            </div>
            {selected.length > 0 && missing.length > 0 && (
              <p className="cc-warning" role="status">
                Pip has no {missing.map((basket) => BASKET_NAME[basket].toLowerCase()).join(" or ")} examples yet.
              </p>
            )}
            <button
              type="button"
              className={`cc-go${tutorial === SORTER_TUTORIAL.length ? " cc-guide" : ""}`}
              onClick={startBelt}
              disabled={!selected.length || (tutorial !== null && tutorial < SORTER_TUTORIAL.length)}
            >
              Start the belt ▶
            </button>
          </div>
        </section>
      )}

      {phase === "run" && (
        <>
          <div className="cc-scoreboard" role="status" aria-live="polite">
            <span className="cc-score home">✅ {counts.right}</span>
            <span className="cc-score lost">❌ {counts.wrong}</span>
            <span className="cc-score left">{decisions.length - counts.right - counts.wrong} to go</span>
          </div>
          {shown ? (
            <section className="cc-predict" aria-labelledby="ss-predict-heading">
              {pipBubble}
              <div className="cc-predict-body">
                <div className="cc-predict-who">
                  <span className="ss-big" aria-hidden="true">
                    {shown.item.emoji}
                  </span>
                  <span>{shown.item.name}</span>
                </div>
                {reveal && (
                  <div className="cc-predict-memory">
                    <span className="cc-label">Pip thinks it looks like</span>
                    <div>
                      {reveal.decision.nearest.map((example) => (
                        <span key={example.id} className="cc-example cc-match ss-match">
                          {example.emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {reveal ? (
                <div className={`cc-reveal ${reveal.guess === reveal.decision.sentTo ? "right" : "wrong"}`} role="status">
                  <strong>
                    Pip says: {BASKET_EMOJI[reveal.decision.sentTo]} {BASKET_NAME[reveal.decision.sentTo]}
                  </strong>
                  <span>{reveal.guess === reveal.decision.sentTo ? "🔮 You guessed it!" : `You guessed ${BASKET_NAME[reveal.guess]}`}</span>
                </div>
              ) : (
                <>
                  <h2 id="ss-predict-heading">Which basket will Pip choose?</h2>
                  <div className="cc-guesses ss-guesses">
                    {(["yummy", "yucky", "unsure"] as const).map((guess) => (
                      <button key={guess} type="button" className={`cc-guess ss-guess-${guess}`} onClick={() => predict(guess)}>
                        <span aria-hidden="true">{BASKET_EMOJI[guess]}</span>
                        {BASKET_NAME[guess]}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <button type="button" className="cc-skip" onClick={letTheRestGo}>
                Let Pip finish <FastForward size={14} />
              </button>
            </section>
          ) : (
            <button
              type="button"
              className={`cc-fast${fast ? " on" : ""}`}
              onClick={() =>
                setFast((value) => {
                  worldRef.current?.setSpeed(!value ? 2.4 : 1);
                  return !value;
                })
              }
              aria-pressed={fast}
            >
              <FastForward size={18} /> {fast ? "Normal speed" : "Speed up"}
            </button>
          )}
        </>
      )}

      {phase === "result" && result && (
        <section className="cc-result" aria-labelledby="ss-result-heading">
          <div className="cc-stars" aria-label={`${result.stars} of 3 stars`}>
            {[0, 1, 2].map((s) => (
              <Star key={s} size={40} className={s < result.stars ? "cc-star-on cc-pop" : ""} style={{ animationDelay: `${0.3 + s * 0.26}s` }} />
            ))}
          </div>
          <h2 id="ss-result-heading">
            {result.right} of {result.total} in the right basket
          </h2>
          {predictions.total > 0 && (
            <p className="cc-mind">
              🔮 You guessed {predictions.right} of {predictions.total}
            </p>
          )}
          {pipBubble}
          {misses.length > 0 && (
            <div className="cc-misses">
              {misses.map((decision) => (
                <button
                  key={decision.key}
                  type="button"
                  className={`cc-miss ss-miss${review === decision.key ? " active" : ""}`}
                  onClick={() => openReview(decision)}
                  aria-label={`Why did Pip get the ${decision.item.name} wrong?`}
                >
                  <span aria-hidden="true">{decision.item.emoji}</span>
                  <span>{decision.sentTo === "unsure" ? "🤔" : "❗"}</span>
                </button>
              ))}
            </div>
          )}
          {reviewDecision && (
            <div className="cc-thinking" aria-live="polite">
              <div className="cc-compare ss-compare">
                <span className="ss-big">{reviewDecision.item.emoji}</span>
                <span className="cc-arrow">looked like</span>
                {reviewDecision.nearest.map((example) => (
                  <span key={example.id} className="ss-big">
                    {example.emoji}
                  </span>
                ))}
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
                    className={`cc-answer ss-answer${answer?.index === option.index ? (option.correct ? " right" : " wrong") : ""}`}
                    onClick={() => chooseAnswer(option.index, option.correct)}
                    disabled={answer?.correct === true}
                  >
                    <span aria-hidden="true">{option.emoji}</span> {option.text}
                  </button>
                ))}
              </div>
              {answer?.correct && <p className="cc-lesson-text">{level.lesson}</p>}
            </div>
          )}
          <div className="cc-actions">
            <button type="button" className="cc-secondary" onClick={tryAgain}>
              <RotateCcw size={16} /> Teach again
            </button>
            {result.stars > 0 && (
              <button type="button" className="cc-go" onClick={nextLevel}>
                {levelIndex + 1 < SORTER_LEVELS.length ? "Next level" : "Finish"} <ArrowRight size={18} />
              </button>
            )}
          </div>
        </section>
      )}

      {phase === "finale" && (
        <section className="cc-title cc-finale" aria-labelledby="ss-finale-heading">
          <div className="cc-title-copy">
            <p className="cc-kicker">
              <span /> Snack Sorter complete
            </p>
            <h1 id="ss-finale-heading">
              You are a <em>Robot Teacher</em>
            </h1>
            <p className="cc-lede">You taught Pip with examples. You found out that Pip only knows what you show it, and that Pip needs new examples when the rules change.</p>
            <div className="cc-actions">
              <button type="button" className="cc-go" onClick={() => setPhase("title")}>
                Play again for more stars <ArrowRight size={18} />
              </button>
              <Link className="cc-secondary" href="/wonderlab/games">
                More Wonderlab games
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
