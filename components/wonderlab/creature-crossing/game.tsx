"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, FastForward, Lock, RotateCcw, Sparkles, Star, Tag, Volume2, VolumeX, X } from "lucide-react";
import {
  CROSSING_LEVELS,
  CROSSING_VERSION,
  HOMES,
  explain,
  homeOf,
  readCrossingSave,
  runHerd,
  unlocked,
  type CrossingSave,
  type Decision,
} from "@/lib/wonderlab/creature-crossing";
import type { CrossingWorld } from "./engine";
import { CreatureIcon, HOME_GLYPH } from "./creature-icon";
import { setMuted, sfx } from "./sfx";

type Phase = "title" | "teach" | "run" | "result" | "finale";
type Outcome = "home" | "lost" | "unsure";
const SAVE_KEY = "wonderlab-creature-crossing";

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
  const [briefOpen, setBriefOpen] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const level = CROSSING_LEVELS[levelIndex];
  const phaseRef = useRef(phase);
  const levelRef = useRef(level);
  const selectedRef = useRef(selected);

  useEffect(() => {
    phaseRef.current = phase;
    levelRef.current = level;
    selectedRef.current = selected;
  }, [phase, level, selected]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSave(loadSave());
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => setMuted(muted), [muted]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const toggleExample = useCallback((id: string) => {
    if (phaseRef.current !== "teach") return;
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
      setNotice(`The gate can remember ${limit} examples. Tap a chosen creature to swap it out.`);
      return;
    }
    const next = [...current, id];
    setSelected(next);
    worldRef.current?.setSelected(next);
    sfx.pick();
  }, []);

  const pickInWorld = useCallback(
    (id: string) => {
      if (phaseRef.current === "teach") toggleExample(id);
      else if (phaseRef.current === "result" && id.startsWith("h")) setReview(id);
    },
    [toggleExample],
  );

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
              onPick: (id) => pickInWorld(id),
              onScan: () => sfx.scan(),
              onArrive: (id, outcome) => {
                setArrivals((previous) => ({ ...previous, [id]: outcome }));
                if (outcome === "home") sfx.home();
                else if (outcome === "lost") sfx.lost();
                else sfx.unsure();
              },
              onRunComplete: () => window.setTimeout(() => setPhase("result"), 700),
            },
            { reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches },
          );
          worldRef.current.setLevel(levelRef.current);
        } catch {
          setError("Your browser could not open this 3D world. Try a recent browser with 3D graphics turned on.");
        }
      })
      .catch(() => setError("The game could not load. Check your connection and reload the page."));
    return () => {
      cancelled = true;
      worldRef.current?.dispose();
      worldRef.current = null;
    };
  }, [pickInWorld]);

  const result = useMemo(() => (decisions.length ? runHerd(level, selected) : null), [decisions, level, selected]);
  const counts = useMemo(() => {
    const values = Object.values(arrivals);
    return { home: values.filter((v) => v === "home").length, lost: values.filter((v) => v === "lost").length, unsure: values.filter((v) => v === "unsure").length };
  }, [arrivals]);

  // Record stars once a run finishes.
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
      if (result.stars > 0) {
        sfx.win();
        for (let index = 0; index < result.stars; index += 1) window.setTimeout(() => sfx.star(index), 500 + index * 260);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [phase, result, level.id]);

  useEffect(() => {
    if (!review) return;
    const decision = decisions.find((item) => item.creature.id === review);
    if (decision) worldRef.current?.showThinking(review, decision.nearest.map((example) => example.id));
  }, [review, decisions]);

  const startLevel = (index: number) => {
    setLevelIndex(index);
    setSelected([]);
    setDecisions([]);
    setArrivals({});
    setReview(null);
    // On phones the mission card would cover the island, so it starts folded.
    setBriefOpen(window.innerWidth > 720);
    setPhase("teach");
    levelRef.current = CROSSING_LEVELS[index];
    worldRef.current?.setLevel(CROSSING_LEVELS[index]);
    worldRef.current?.setLabels(labels);
    worldRef.current?.resetView();
  };

  const openGate = () => {
    if (!selected.length) return;
    const outcome = runHerd(level, selected);
    setDecisions(outcome.decisions);
    setArrivals({});
    setReview(null);
    setBriefOpen(false);
    setPhase("run");
    worldRef.current?.setSpeed(fast ? 2.6 : 1);
    worldRef.current?.resetView();
    worldRef.current?.run(outcome.decisions);
    sfx.gate();
  };

  const changeExamples = () => {
    setPhase("teach");
    setDecisions([]);
    setArrivals({});
    setReview(null);
    worldRef.current?.resetHerd();
    worldRef.current?.resetView();
  };

  const nextLevel = () => {
    if (levelIndex + 1 < CROSSING_LEVELS.length) startLevel(levelIndex + 1);
    else {
      worldRef.current?.resetView();
      setPhase("finale");
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
  const misses = decisions.filter((decision) => !decision.correct);
  const totalStars = Object.values(save.stars).reduce((sum, value) => sum + value, 0);
  // The first level without three stars that is open to play.
  const nextPlayable = Math.max(0, CROSSING_LEVELS.findIndex((item, index) => unlocked(save, index) && (save.stars[item.id] ?? 0) < 3));

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
          <button type="button" className="cc-round" onClick={() => setMutedState((value) => !value)} aria-label={muted ? "Turn sound on" : "Turn sound off"}>
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
            <p className="cc-lede">
              The Wonder Gate sends every creature on the island to its home. The gate is a simple kind of AI: it has never met a creature before, so it learns from the examples you show it. Choose your examples, open the gate and watch the herd find out whether it learned the right thing.
            </p>
            {ready && (
              <button type="button" className="cc-go cc-play" onClick={() => startLevel(nextPlayable)}>
                {totalStars ? `Play level ${nextPlayable + 1}` : "Start playing"} <ArrowRight size={18} />
              </button>
            )}
            <div className="cc-how">
              <div>
                <b>1</b>Teach the gate with creatures from the pen
              </div>
              <div>
                <b>2</b>Open the gate and watch the stampede
              </div>
              <div>
                <b>3</b>Find out why creatures got lost and fix it
              </div>
            </div>
            <details className="cc-grownups">
              <summary>For grown-ups: what your child is learning</summary>
              <p>
                Many AI systems learn from examples instead of following rules a person wrote. In this game the gate compares each new creature with the examples your child chose and copies the home of the closest one. Your child will see that an AI is only as good as its examples: lopsided examples teach the wrong clue, and an AI cannot recognise something it has never been shown. The gate runs entirely in this browser. There is no live AI, no account and nothing your child types.
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
          <div className={`cc-brief${briefOpen ? " open" : ""}`}>
            <button type="button" className="cc-brief-toggle" onClick={() => setBriefOpen((value) => !value)} aria-expanded={briefOpen}>
              <span>Your mission</span>
              {briefOpen ? <X size={16} /> : <ArrowRight size={16} />}
            </button>
            {briefOpen && (
              <>
                <h2>{level.title}</h2>
                <p>{level.brief}</p>
                <p className="cc-hint">
                  <Sparkles size={14} /> {level.hint}
                </p>
              </>
            )}
          </div>
          <div className="cc-pen">
            <p className="cc-label">Training pen: tap a creature to teach the gate with it</p>
            <div className="cc-roster">
              {level.pen.map((creature) => {
                const chosen = selected.includes(creature.id);
                return (
                  <button
                    key={creature.id}
                    type="button"
                    className={`cc-chip${chosen ? " chosen" : ""}`}
                    aria-pressed={chosen}
                    onClick={() => toggleExample(creature.id)}
                    aria-label={`${creature.colour} ${creature.pattern} ${creature.shape} creature with ${creature.limbs}, lives in ${HOMES[homeOf(creature)].place}${chosen ? ", chosen" : ""}`}
                  >
                    <CreatureIcon creature={creature} size={46} title="" />
                    {labels && <span className="cc-chip-home">{HOME_GLYPH[homeOf(creature)]}</span>}
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
                  </span>
                );
              })}
            </div>
            <button type="button" className="cc-go" onClick={openGate} disabled={!selected.length}>
              Open the gate <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}

      {phase === "run" && (
        <>
          <div className="cc-scoreboard" role="status" aria-live="polite">
            <span className="cc-score home">🏠 {counts.home} home</span>
            <span className="cc-score lost">❗ {counts.lost} lost</span>
            <span className="cc-score unsure">❓ {counts.unsure} unsure</span>
            <span className="cc-score left">{decisions.length - counts.home - counts.lost - counts.unsure} to go</span>
          </div>
          <button type="button" className={`cc-fast${fast ? " on" : ""}`} onClick={toggleFast} aria-pressed={fast}>
            <FastForward size={18} /> {fast ? "Normal speed" : "Speed up"}
          </button>
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
            {result.home} of {result.total} creatures found their way home
          </h2>
          {result.stars === 0 && <p>The gate needs better examples before the herd can cross safely. Tap a lost creature below to find out what the gate was thinking.</p>}
          {result.stars > 0 && result.stars < 3 && <p>Some creatures were sent to the wrong home. Tap one to see which of your examples it was compared with, then change your examples and try again.</p>}
          {result.stars === 3 && <p>Every creature reached the right home. The gate learned the clue that really matters.</p>}

          {misses.length > 0 && (
            <div className="cc-misses">
              {misses.map((decision) => (
                <button
                  key={decision.creature.id}
                  type="button"
                  className={`cc-miss${review === decision.creature.id ? " active" : ""}`}
                  onClick={() => setReview(decision.creature.id)}
                  aria-pressed={review === decision.creature.id}
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
            <div className="cc-lesson">
              <p className="cc-label">What you discovered</p>
              <p>{level.lesson}</p>
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
      {reducedMotion && <span className="cc-sr">Reduced motion is on. Animations are shortened.</span>}
    </div>
  );
}
