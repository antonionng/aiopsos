"use client";
import { useRef, useState } from "react";
import { PictureTile } from "./art";
import type { Mission, Picture } from "@/lib/wonderlab/types";
const pieces: Picture[] = [
  "robot",
  "flower",
  "tree",
  "home",
  "apple",
  "carrot",
  "key",
  "star",
  "cloud",
  "boots",
  "book",
  "rocket",
];
const prefix = "My Wonderlab picture\n";
type Drawing = { cells: (Picture | null)[]; note: string };
function unpack(value: string): Drawing {
  if (value.startsWith(prefix)) {
    try {
      const parsed = JSON.parse(value.slice(prefix.length));
      if (Array.isArray(parsed.cells) && parsed.cells.length === 12)
        return {
          cells: parsed.cells.map((v: Picture) =>
            pieces.includes(v) ? v : null,
          ),
          note: typeof parsed.note === "string" ? parsed.note : "",
        };
    } catch {
      /* Earlier written projects still open as notes. */
    }
  }
  return { cells: Array(12).fill(null), note: value };
}
export function CreationWorkshop({
  mission,
  value,
  onChange,
}: {
  mission: Mission;
  value: string;
  onChange: (value: string) => void;
}) {
  const canvas = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Picture>("robot");
  const [erase, setErase] = useState(false);
  const drawing = unpack(value);
  function update(next: Drawing) {
    onChange(
      next.cells.some(Boolean) ? prefix + JSON.stringify(next) : next.note,
    );
  }
  return (
    <div className="wg-workshop">
      <div className="wg-workshop-heading">
        <span>YOUR MAKING SPACE</span>
        <h3>
          {mission.number === 1
            ? "Make your own sorting mat."
            : mission.number === 2
              ? "Build a picture plan."
              : mission.number === 3
                ? "Create your story scene."
                : mission.number === 4
                  ? "Show what you checked."
                  : mission.number === 5
                    ? "Design your privacy shield."
                    : "Design your helpful invention."}
        </h3>
        <p>
          Choose a piece, then tap a square to place it. Choose another piece to
          replace it, or use the rubber to remove it.
        </p>
      </div>
      {mission.number === 1 && (
        <div className="wg-canvas-groups">
          <span>Group one</span>
          <span>Group two</span>
        </div>
      )}
      <div
        ref={canvas}
        className={`wg-canvas ${mission.number === 1 ? "sorting" : ""}`}
        aria-label="Your picture, four columns and three rows"
      >
        {drawing.cells.map((picture, i) => (
          <button
            key={i}
            aria-label={`Square ${i + 1}: ${picture ?? "empty"}. ${erase ? "Erase" : `Place ${selected}`}`}
            onClick={() =>
              update({
                ...drawing,
                cells: drawing.cells.map((item, j) =>
                  i === j ? (erase ? null : selected) : item,
                ),
              })
            }
          >
            {picture ? (
              <PictureTile picture={picture} />
            ) : (
              <span aria-hidden="true">+</span>
            )}
          </button>
        ))}
      </div>
      <button
        className="wg-secondary"
        style={{ marginTop: 15 }}
        disabled={!drawing.cells.some(Boolean)}
        onClick={() => {
          const parts = Array.from(canvas.current?.children ?? []).map(
            (cell, i) => {
              const icon = cell.querySelector("svg");
              return icon
                ? `<g transform="translate(${(i % 4) * 140 + 44},${Math.floor(i / 4) * 140 + 44}) scale(2.4)" fill="none" stroke="#29213c" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${icon.innerHTML}</g>`
                : "";
            },
          );
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="420" viewBox="0 0 560 420"><title>My Wonderlab picture</title><rect width="560" height="420" rx="20" fill="#fffaf0"/>${parts.join("")}</svg>`;
          const url = URL.createObjectURL(
            new Blob([svg], { type: "image/svg+xml" }),
          );
          const link = document.createElement("a");
          link.href = url;
          link.download = "my-wonderlab-picture.svg";
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }}
      >
        Keep my picture ↓
      </button>
      <div className="wg-palette" aria-label="Picture pieces">
        {pieces.map((picture) => (
          <button
            key={picture}
            aria-label={`Choose ${picture}`}
            aria-pressed={!erase && selected === picture}
            onClick={() => {
              setSelected(picture);
              setErase(false);
            }}
          >
            <PictureTile picture={picture} />
          </button>
        ))}
        <button aria-pressed={erase} onClick={() => setErase(!erase)}>
          Rubber
        </button>
      </div>
      <label className="wl-form">
        {mission.band === "explorers"
          ? "Tell your grown-up about your picture. They can add your words here."
          : "Add your story, instructions or what you checked."}
        <textarea
          value={drawing.note}
          maxLength={6500}
          onChange={(event) => update({ ...drawing, note: event.target.value })}
          placeholder="Describe what you made."
        />
      </label>
    </div>
  );
}
