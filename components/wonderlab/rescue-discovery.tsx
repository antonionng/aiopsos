"use client";
import { useState } from "react";
import { Check, Search, Volume2 } from "lucide-react";
import { Pip, PictureTile } from "./art";
import { rescueCoaching } from "@/lib/wonderlab/rescue-coach";

export function RescueDiscovery({
  narrate,
  onFeedback,
  onComplete,
}: {
  narrate: (text: string) => void;
  onFeedback: (text: string) => void;
  onComplete: () => void;
}) {
  const [counted, setCounted] = useState<number[]>([]);
  const [answer, setAnswer] = useState<"check" | "trust" | null>(null);
  return (
    <section
      className="wg-stage wg-discovery"
      id="wonderlab-game-board"
      tabIndex={-1}
    >
      <div className="wg-stage-top">
        <span className="wg-stage-label">ONE LAST DISCOVERY</span>
        <button
          className="wg-narrate"
          onClick={() => narrate(rescueCoaching.transfer)}
        >
          <Volume2 size={18} /> Hear the challenge
        </button>
      </div>
      <h2>Can an AI helper get it wrong?</h2>
      <p className="wg-discovery-context">
        Pip will show you a pretend AI answer. Check it together with your
        grown-up. This game does not use live AI.
      </p>
      <div className="wg-ai-claim">
        <Pip small />
        <p>
          “There are <strong>3 apples</strong>. I’m sure!”
        </p>
      </div>
      <p>Tap each apple to count it. Then check the answer.</p>
      <div
        className="wg-counting-apples"
        aria-label="Picture evidence: two apples"
      >
        {[0, 1].map((i) => (
          <button
            key={i}
            aria-label={`Count apple ${i + 1}`}
            aria-pressed={counted.includes(i)}
            onClick={() => setCounted((c) => (c.includes(i) ? c : [...c, i]))}
          >
            <PictureTile picture="apple" />
            <span>
              {counted.includes(i) ? counted.indexOf(i) + 1 : "Tap to count"}
            </span>
          </button>
        ))}
      </div>
      <p className="wg-count-status" role="status">
        {counted.length < 2
          ? "Tap both apples before choosing."
          : "You counted 2 apples. Does the AI answer match?"}
      </p>
      <div className="wg-discovery-choices">
        <button
          className="wg-secondary"
          disabled={counted.length < 2 || answer === "check"}
          onClick={() => {
            setAnswer("trust");
            onFeedback(rescueCoaching.retry);
          }}
        >
          <Check size={24} />
          <span>Yes, there are 3 apples.</span>
        </button>
        <button
          className="wg-secondary"
          disabled={counted.length < 2 || answer === "check"}
          onClick={() => {
            setAnswer("check");
            onFeedback(rescueCoaching.success);
          }}
        >
          <Search size={24} />
          <span>No, I counted 2 apples.</span>
        </button>
      </div>
      {answer && (
        <p
          className={`wg-reaction ${answer === "check" ? "won" : ""}`}
          role="status"
        >
          {answer === "check" ? rescueCoaching.success : rescueCoaching.retry}
        </p>
      )}
      {answer === "check" && (
        <button className="wg-launch" onClick={onComplete}>
          Collect my sticker ★
        </button>
      )}
    </section>
  );
}
export function RescueParentNotes({
  complete = false,
}: {
  complete?: boolean;
}) {
  return (
    <details className="wg-parent-notes">
      <summary>
        {complete
          ? "For your grown-up: what we practised"
          : "For your grown-up: how this builds AI skills"}
      </summary>
      <p>
        Your child practises giving ordered instructions, watching the result
        and changing a plan when it does not work. The final picture challenge
        asks them to check a confident, incorrect AI answer against visible
        evidence.
      </p>
      <p>
        Pip follows fixed arrows in the route game. That is a simple program,
        not an AI model learning patterns from examples. Clear instructions are
        useful with AI too, but they do not guarantee a correct answer.
      </p>
      <ul>
        <li>Ask: “Where do you think Pip will stop?” before pressing Go.</li>
        <li>
          After a mistake, ask: “Which arrow could we change?” Give them time to
          try.
        </li>
        <li>
          After the apple challenge, ask: “How did you know the answer was
          wrong?”
        </li>
      </ul>
      <p>
        Play together and read aloud if needed. Help with the controls without
        choosing the route. The sticker celebrates practice; it does not prove
        independent AI competence.
      </p>
      <p>
        <strong>Try away from the screen:</strong> use three toy steps to guide
        a grown-up to a chair. Give the instructions, watch and check together.
      </p>
    </details>
  );
}
