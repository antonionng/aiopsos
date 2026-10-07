"use client";
import { useState } from "react";
const prefix = "My Wonderlab branching game\n";
const blank = {
  opening: "You reach an observatory with a locked door.",
  choiceA: "Look for a key",
  endingA: "You find a key under a plant pot. The door opens.",
  choiceB: "Ask the keeper for help",
  endingB:
    "The keeper asks what you want to learn, then gives you a key. You use it to open the door.",
  notes: "",
};
export function StoryGameMaker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [path, setPath] = useState<"A" | "B" | null>(null);
  const [tested, setTested] = useState<string[]>([]);
  let draft = { ...blank, notes: value };
  if (value.startsWith(prefix)) {
    try {
      const parsed = JSON.parse(value.slice(prefix.length));
      draft = Object.fromEntries(
        Object.entries(blank).map(([key, fallback]) => [
          key,
          typeof parsed[key] === "string"
            ? parsed[key].slice(0, 1000)
            : fallback,
        ]),
      ) as typeof blank;
    } catch {
      /* Keep the editable defaults. */
    }
  }
  function edit(key: keyof typeof blank, text: string) {
    onChange(prefix + JSON.stringify({ ...draft, [key]: text }));
    setTested([]);
  }
  return (
    <div className="wg-workshop wg-story-maker">
      <div className="wg-workshop-heading">
        <span>YOU CAN BUILD AND TEST YOUR OWN GAME.</span>
        <h3>Create a story that your reader can play.</h3>
        <p>
          In a branching story, each choice takes the player to a different
          ending. Edit the example below to make your own story, then test both
          paths. Check that the events follow your rules and repair any details
          that do not make sense.
        </p>
      </div>
      <div className="wg-story-tabs">
        <button
          className="wg-secondary"
          aria-pressed={!playing}
          onClick={() => setPlaying(false)}
        >
          Edit my story
        </button>
        <button
          className="wg-launch"
          aria-pressed={playing}
          onClick={() => {
            if (!value.startsWith(prefix))
              onChange(prefix + JSON.stringify(draft));
            setPlaying(true);
            setPath(null);
          }}
        >
          Test my story →
        </button>
      </div>
      {playing ? (
        <div className="wg-story-screen">
          <span>YOUR GAME / {path ? `ENDING ${path}` : "START"}</span>
          <h3>
            {path ? "This is what happens next." : "Choose what happens next."}
          </h3>
          <p>
            {path
              ? path === "A"
                ? draft.endingA
                : draft.endingB
              : draft.opening}
          </p>
          {path ? (
            <button className="wg-launch" onClick={() => setPath(null)}>
              Try the other path ↻
            </button>
          ) : (
            <div className="wg-action-paths">
              {(["A", "B"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setPath(option);
                    setTested((old) =>
                      old.includes(option) ? old : [...old, option],
                    );
                  }}
                >
                  {option === "A" ? draft.choiceA : draft.choiceB} →
                </button>
              ))}
            </div>
          )}
          <p className="wg-micro">
            You have tried {tested.length} of the two paths during this visit. A
            path being playable does not mean its story makes sense. Check the
            events yourself.
          </p>
        </div>
      ) : (
        <div className="wg-story-fields">
          {(
            [
              ["opening", "Describe how your story begins."],
              ["choiceA", "What is the first choice the player can make?"],
              ["endingA", "What happens after that choice?"],
              ["choiceB", "What is the second choice the player can make?"],
              ["endingB", "What happens after the second choice?"],
              ["notes", "What did you repair after testing?"],
            ] as const
          ).map(([key, label]) => (
            <label className="wl-form" key={key}>
              {label}
              <textarea
                maxLength={1000}
                value={draft[key]}
                onChange={(event) => edit(key, event.target.value)}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
