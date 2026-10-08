"use client";
import { useState } from "react";
import { gameGuides } from "@/lib/wonderlab/learning-guide";
import { arcadeCoaching } from "@/lib/wonderlab/arcade-coaching";
import { GameDemonstration } from "./game-demonstration";

export function GameGuide({
  type,
  narrate,
  stop,
}: {
  type: keyof typeof gameGuides;
  young: boolean;
  narrate: (text: string, onEnd?: () => void) => void;
  stop: () => void;
}) {
  const [open, setOpen] = useState(false);
  const lead =
    type === "route"
      ? "You’re in charge of Pip’s arrows."
      : arcadeCoaching[type].start;
  const action =
    type === "route"
      ? "Choose the steps, watch Pip move and check what happens."
      : arcadeCoaching[type].action;
  return (
    <aside className="wg-rescue-start" aria-label="How to play">
      <div className="wg-rescue-start-row">
        <p>
          <strong>{lead}</strong> {action}
        </p>
        <button
          className="wg-secondary"
          aria-expanded={open}
          onClick={() => {
            stop();
            setOpen(!open);
          }}
        >
          {open ? "Close demonstration" : "Show me how to play"}
        </button>
      </div>
      {open && (
        <>
          <GameDemonstration type={type} narrate={narrate} stop={stop} />
          <button
            className="wg-launch"
            onClick={() => {
              stop();
              setOpen(false);
              document.getElementById("wonderlab-game-board")?.focus();
            }}
          >
            I’m ready to play →
          </button>
        </>
      )}
    </aside>
  );
}
