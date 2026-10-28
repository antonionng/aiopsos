"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Lock, Play, RotateCcw, Star, X } from "lucide-react";
import {
  FEED_LEVELS,
  HUNT_PROMPTS,
  LIBRARY,
  ORACLE_VERSION,
  QUIZ_QUESTIONS,
  SCORE,
  generate,
  isEnd,
  quizScore,
  supportedByLibrary,
  train,
  type Step,
} from "@/lib/wonderlab/oracle";

type LevelId = "feed" | "hunt" | "know";
type Save = { version: string; stars: Partial<Record<LevelId, number>> };
const SAVE_KEY = "wonderlab-autocomplete-oracle";
const LEVELS: Array<{ id: LevelId; title: string; blurb: string }> = [
  { id: "feed", title: "Feed the machine", blurb: "Choose what it reads, control what it writes." },
  { id: "hunt", title: "Confidently wrong", blurb: "Catch the fluent fakes." },
  { id: "know", title: "Know when to stop", blurb: "Decide when it should say “I don’t know”." },
];

function loadSave(): Save {
  try {
    const raw = JSON.parse(window.localStorage.getItem(SAVE_KEY) ?? "null");
    const stars: Save["stars"] = {};
    for (const level of LEVELS) {
      const value = raw?.stars?.[level.id];
      if (Number.isInteger(value) && value >= 0 && value <= 3) stars[level.id] = value;
    }
    return { version: ORACLE_VERSION, stars };
  } catch {
    return { version: ORACLE_VERSION, stars: {} };
  }
}

const show = (word: string) => (isEnd(word) ? "(end)" : word);
const cap = (word = "") => word.charAt(0).toUpperCase() + word.slice(1);

/** Animated next-word probabilities for one generation step. */
function Bars({ step, reveal }: { step: Step; reveal: boolean }) {
  return (
    <div className="or-bars" aria-label={`After “${step.after}”, the Oracle could write: ${step.options.map((o) => `${show(o.word)} ${Math.round(o.share * 100)}%`).join(", ")}`}>
      <p className="or-after">
        after <b>{step.after}</b>
      </p>
      {step.options.slice(0, 4).map((option) => (
        <div key={option.word} className={`or-bar${reveal && option.word === step.chosen ? " chosen" : ""}`}>
          <span className="or-word">{show(option.word)}</span>
          <span className="or-track">
            <span className="or-fill" style={{ width: `${Math.round(option.share * 100)}%` }} />
          </span>
          <span className="or-share">{Math.round(option.share * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

function Orb({ busy }: { busy: boolean }) {
  return (
    <div className={`or-orb${busy ? " busy" : ""}`} aria-hidden="true">
      <span />
    </div>
  );
}

function StarsRow({ count, size = 30 }: { count: number; size?: number }) {
  return (
    <span className="or-stars" aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <Star key={i} size={size} className={i < count ? "on" : ""} />
      ))}
    </span>
  );
}

export function AutocompleteOracle() {
  const [save, setSave] = useState<Save>({ version: ORACLE_VERSION, stars: {} });
  const [level, setLevel] = useState<LevelId | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setSave(loadSave()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const award = (id: LevelId, stars: number) =>
    setSave((previous) => {
      if ((previous.stars[id] ?? 0) >= stars) return previous;
      const next = { version: ORACLE_VERSION, stars: { ...previous.stars, [id]: stars } };
      try {
        window.localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      } catch {
        // Stars still count for this visit when storage is unavailable.
      }
      return next;
    });

  const unlocked = (index: number) => index === 0 || (save.stars[LEVELS[index - 1].id] ?? 0) > 0;
  const total = Object.values(save.stars).reduce((sum, value) => sum + (value ?? 0), 0);
  const index = level ? LEVELS.findIndex((item) => item.id === level) : -1;
  const next = index >= 0 && index + 1 < LEVELS.length ? LEVELS[index + 1] : null;

  return (
    <div className="or-shell">
      <header className="or-top">
        {level ? (
          <button type="button" className="or-round" onClick={() => setLevel(null)} aria-label="Back to levels">
            <ArrowLeft size={20} />
          </button>
        ) : (
          <Link href="/wonderlab/games" className="or-round" aria-label="Back to Wonderlab games">
            <ArrowLeft size={20} />
          </Link>
        )}
        <span className="or-brand">
          <span aria-hidden="true">✳</span> Autocomplete Oracle
        </span>
        <span className="or-total">
          <Star size={16} /> {total}/9
        </span>
      </header>

      {!level && (
        <main className="or-home">
          <div className="or-hero">
            <Orb busy />
            <p className="or-kicker">Free game · Ages 11 to 16</p>
            <h1>
              How does AI <em>write?</em>
            </h1>
            <p>
              The Oracle is a tiny text generator. It has read a few sentences and learned one thing: which word usually comes next. That is a simplified version of how chatbots write, and it is why they can sound sure of themselves and still be wrong.
            </p>
          </div>
          <div className="or-levels">
            {LEVELS.map((item, i) => (
              <button key={item.id} type="button" className="or-level" disabled={!unlocked(i)} onClick={() => setLevel(item.id)}>
                <span className="or-level-n">{unlocked(i) ? i + 1 : <Lock size={16} />}</span>
                <span className="or-level-text">
                  <b>{item.title}</b>
                  <small>{item.blurb}</small>
                </span>
                <StarsRow count={save.stars[item.id] ?? 0} size={16} />
              </button>
            ))}
          </div>
          <details className="or-grownups">
            <summary>For parents and teachers</summary>
            <p>
              Large language models are trained to predict the next piece of text from a huge amount of writing. This game uses a deliberately tiny version, a model that only looks at the previous word, so the mechanism is visible. Players shape its output by choosing its training text, catch fluent statements that are false, and decide when a model should decline to answer. Everything runs in the browser with no live AI, no account and nothing typed.
            </p>
          </details>
        </main>
      )}

      {level === "feed" && <FeedLevel onWin={(stars) => award("feed", stars)} onNext={() => setLevel("hunt")} />}
      {level === "hunt" && <HuntLevel onWin={(stars) => award("hunt", stars)} onNext={() => setLevel("know")} />}
      {level === "know" && <KnowLevel onWin={(stars) => award("know", stars)} onNext={next ? () => setLevel(next.id) : () => setLevel(null)} />}
    </div>
  );
}

function useStepper(steps: Step[], running: boolean, onDone: () => void) {
  const [shown, setShown] = useState(0);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);
  useEffect(() => {
    if (!running) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0;
    const timer = window.setInterval(
      () => {
        i += 1;
        setShown(i);
        if (i >= steps.length) {
          window.clearInterval(timer);
          window.setTimeout(() => done.current(), 400);
        }
      },
      reduced ? 250 : 900,
    );
    return () => window.clearInterval(timer);
  }, [running, steps]);
  return [shown, setShown] as const;
}

function FeedLevel({ onWin, onNext }: { onWin: (stars: number) => void; onNext: () => void }) {
  const level = FEED_LEVELS[0];
  const [chosen, setChosen] = useState<string[]>([]);
  const [run, setRun] = useState<{ steps: Step[]; text: string; stopped: boolean } | null>(null);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [tries, setTries] = useState(0);
  const [full, setFull] = useState(false);
  const machine = useRef<HTMLElement>(null);
  const [shown, setShown] = useStepper(run?.steps ?? [], running, () => {
    setRunning(false);
    setFinished(true);
  });
  const won = finished && run?.text === level.target && run.stopped;

  useEffect(() => {
    if (won) onWin(tries <= 1 ? 3 : tries <= 3 ? 2 : 1);
  }, [won, tries, onWin]);

  const toggle = (card: string) => {
    if (running) return;
    setFinished(false);
    setRun(null);
    const removing = chosen.includes(card);
    setFull(!removing && chosen.length >= level.slots);
    setChosen((current) => (current.includes(card) ? current.filter((c) => c !== card) : current.length < level.slots ? [...current, card] : current));
  };
  const go = () => {
    const out = generate(train(chosen), level.prompt);
    setRun(out);
    setShown(0);
    setFinished(false);
    setRunning(true);
    setTries((t) => t + 1);
    // On phones the Oracle sits below the reading pile; bring it into view so the writing is seen.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    machine.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  };
  const written = run ? [level.prompt, ...run.steps.slice(0, shown).map((s) => s.chosen).filter((w) => !isEnd(w))].join(" ") : level.prompt;
  const current = run && shown < run.steps.length ? run.steps[Math.max(0, shown)] : run?.steps.at(-1);

  return (
    <main className="or-level-screen">
      <section className="or-panel or-brief">
        <p className="or-kicker">Level 1 · Feed the machine</p>
        <h2>
          Make it write: <q>{level.target}</q>
        </h2>
        <p>{level.intro}</p>
      </section>
      <section className="or-panel">
        <p className="or-label">
          <BookOpen size={15} /> Reading pile · choose {level.slots}
        </p>
        <div className="or-cards">
          {level.cards.map((card) => (
            <button key={card} type="button" className={`or-card${chosen.includes(card) ? " on" : ""}`} aria-pressed={chosen.includes(card)} onClick={() => toggle(card)}>
              {card}
            </button>
          ))}
        </div>
        {full && (
          <p className="or-note" role="status">
            You can choose {level.slots}. Tap a chosen sentence to put it back.
          </p>
        )}
        <button type="button" className="or-go" disabled={!chosen.length || running} onClick={go}>
          <Play size={18} fill="currentColor" /> Let it write
        </button>
      </section>
      <section className="or-panel or-machine" ref={machine}>
        <Orb busy={running} />
        <p className="or-output" aria-live="polite">
          {written}
          {running && <span className="or-caret">▍</span>}
        </p>
        {current && <Bars step={current} reveal={!running || shown > 0} />}
        {finished && !won && (
          <p className="or-hint">
            It wrote <q>{run?.text}</q>. Look at the bars: after each word it picks whichever word followed most often in what it read. Which sentence would make <b>moon</b> beat <b>fish</b> after <b>the</b>?
          </p>
        )}
        {won && (
          <div className="or-win">
            <StarsRow count={tries <= 1 ? 3 : tries <= 3 ? 2 : 1} />
            <p>{level.lesson}</p>
            <button type="button" className="or-go" onClick={onNext}>
              Next level <ArrowRight size={18} />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function HuntLevel({ onWin, onNext }: { onWin: (stars: number) => void; onNext: () => void }) {
  const model = useMemo(() => train(LIBRARY), []);
  const outputs = useMemo(() => HUNT_PROMPTS.map((prompt) => ({ prompt, ...generate(model, prompt) })), [model]);
  const [marks, setMarks] = useState<Record<number, boolean>>({});
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const correct = outputs.filter((out, i) => marks[i] === supportedByLibrary(out.text)).length;
  const stars = correct === outputs.length ? 3 : correct >= outputs.length - 1 ? 2 : correct >= outputs.length - 3 ? 1 : 0;

  const check = () => {
    setChecked(true);
    if (stars > 0) onWin(stars);
  };

  return (
    <main className="or-level-screen">
      <section className="or-panel or-brief">
        <p className="or-kicker">Level 2 · Confidently wrong</p>
        <h2>Which of these did the Oracle get wrong?</h2>
        <p>The Oracle read only the source library below, then finished each prompt. Every answer sounds sure of itself. Mark each one true or fake, using the library to check.</p>
      </section>
      <section className="or-panel or-library">
        <p className="or-label">
          <BookOpen size={15} /> Source library: everything the Oracle read
        </p>
        <ul>
          {LIBRARY.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
      <section className="or-panel or-hunt">
        {outputs.map((out, i) => {
          const truth = supportedByLibrary(out.text);
          const mark = marks[i];
          return (
            <div key={out.prompt} className={`or-claim${checked ? (mark === truth ? " good" : " bad") : ""}`}>
              <p>
                <span className="or-prompt">{out.prompt}</span>
                {out.text.slice(out.prompt.length)}
              </p>
              <div className="or-mark">
                <button type="button" aria-pressed={mark === true} disabled={checked} onClick={() => setMarks((m) => ({ ...m, [i]: true }))}>
                  <Check size={16} /> True
                </button>
                <button type="button" aria-pressed={mark === false} disabled={checked} onClick={() => setMarks((m) => ({ ...m, [i]: false }))}>
                  <X size={16} /> Fake
                </button>
              </div>
              {checked && (
                <div className="or-why">
                  <p>{truth ? "True: the library says exactly this." : "Fake: the library does not say this. The Oracle chained together the most common word pairs it had read."}</p>
                  <button type="button" className="or-link" onClick={() => setOpen(open === i ? null : i)}>
                    {open === i ? "Hide" : "Show"} how it chose each word
                  </button>
                  {open === i && (
                    <div className="or-steps">
                      {out.steps.map((step, s) => (
                        <Bars key={s} step={step} reveal />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {!checked ? (
          <button type="button" className="or-go" disabled={Object.keys(marks).length < outputs.length} onClick={check}>
            Check my answers
          </button>
        ) : (
          <div className="or-win">
            <StarsRow count={stars} />
            <p>
              You spotted {correct} of {outputs.length}. Most of the Oracle&apos;s answers were fluent and confident, and most were false. A model that predicts likely words is not checking facts. That is why you check AI answers against a reliable source before you trust or share them.
            </p>
            <div className="or-actions">
              <button
                type="button"
                className="or-secondary"
                onClick={() => {
                  setChecked(false);
                  setMarks({});
                  setOpen(null);
                }}
              >
                <RotateCcw size={16} /> Try again
              </button>
              {stars > 0 && (
                <button type="button" className="or-go" onClick={onNext}>
                  Next level <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function KnowLevel({ onWin, onNext }: { onWin: (stars: number) => void; onNext: () => void }) {
  const [threshold, setThreshold] = useState(50);
  const [locked, setLocked] = useState(false);
  const result = quizScore(threshold / 100);
  const best = Math.max(...[0, 50, 60, 70, 80, 90, 100].map((t) => quizScore(t / 100).total));
  const stars = result.total >= best ? 3 : result.total > 0 ? 1 : 0;

  return (
    <main className="or-level-screen">
      <section className="or-panel or-brief">
        <p className="or-kicker">Level 3 · Know when to stop</p>
        <h2>When should the Oracle say “I don’t know”?</h2>
        <p>
          The Oracle read a pile of quiz notes, some of them wrong. Now it is in a quiz: a right answer scores {SCORE.right} point, a wrong answer loses {Math.abs(SCORE.wrong)}, and saying “I don’t know” scores {SCORE.pass}. Set how sure it must be before it answers.
        </p>
      </section>
      <section className="or-panel or-wide">
        <label className="or-slider">
          <span>
            Only answer when at least <b>{threshold}%</b> sure
          </span>
          <input type="range" min={0} max={100} step={10} value={threshold} disabled={locked} onChange={(e) => setThreshold(Number(e.target.value))} />
        </label>
        <div className="or-quiz">
          {result.rows.map((row) => (
            <div key={row.country} className={`or-q ${row.outcome}`}>
              <span className="or-q-ask">Capital of {cap(row.country)}?</span>
              <span className="or-q-conf">
                <span className="or-track">
                  <span className="or-fill" style={{ width: `${Math.round((row.result?.share ?? 0) * 100)}%` }} />
                  <span className="or-mark-line" style={{ left: `${threshold}%` }} />
                </span>
                {Math.round((row.result?.share ?? 0) * 100)}% sure
              </span>
              <span className="or-q-out">
                {row.outcome === "pass" ? "🤐 I don’t know" : `${cap(row.result?.word)} ${locked ? (row.outcome === "right" ? "✅" : "❌") : ""}`}
              </span>
            </div>
          ))}
        </div>
        {!locked ? (
          <button
            type="button"
            className="or-go"
            onClick={() => {
              setLocked(true);
              if (stars > 0) onWin(stars);
            }}
          >
            Run the quiz
          </button>
        ) : (
          <div className="or-win">
            <p className="or-score">
              Score: {result.total} {Math.abs(result.total) === 1 ? "point" : "points"}
            </p>
            <StarsRow count={stars} />
            <p>
              {stars === 3
                ? "Best possible score. "
                : "There is a better setting. "}
              Look at Italy and Peru: the Oracle was equally sure about both, but only one answer was right ({cap(QUIZ_QUESTIONS.find((q) => q.country === "peru")?.answer)} is the capital of Peru). Being confident is not the same as being correct. A well-designed AI says “I don’t know” when its evidence is thin, and you should still check the answers it does give.
            </p>
            <div className="or-actions">
              <button type="button" className="or-secondary" onClick={() => setLocked(false)}>
                <RotateCcw size={16} /> Change the setting
              </button>
              {stars > 0 && (
                <button type="button" className="or-go" onClick={onNext}>
                  Finish <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
