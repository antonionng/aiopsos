"use client";

import { createArcadeDownload, type ArcadeDesign } from "@/lib/wonderlab/first-person";
import { arcadeProjectReport, type FamilyArcadeProject } from "@/lib/wonderlab/arcade-project";

function download(title: string, content: string, extension: "txt" | "html") {
  const url = URL.createObjectURL(new Blob([content], {
    type: extension === "html" ? "text/html;charset=utf-8" : "text/plain;charset=utf-8",
  }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `wonderlab-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${extension}`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function FamilyArcadeProjectCard({ saved, nickname, busy, onOpen }: {
  saved?: FamilyArcadeProject;
  nickname: string;
  busy: boolean;
  onOpen?: () => void;
}) {
  const designs: { label: string; design: ArcadeDesign }[] = saved ? [
    { label: "Current game", design: saved.snapshot.project.design },
    ...saved.snapshot.adventure.creations.map((entry, index) => ({ label: `Festival game ${index + 1}`, design: entry.design })),
  ] : [];
  return <section className="wl-membership-panel" aria-label={`${nickname}'s arcade project`}>
    <span className="wl-eyebrow">ARCADE APPRENTICE</span>
    <h3>{saved ? `${nickname} is creating games for a magical arcade.` : "Create a game and see how the idea develops."}</h3>
    <p>This optional Game Concept Studio adventure lets your child describe a game, change its rules and adapt it for a fictional visitor.</p>
    {saved ? <>
      <p>The game has reported {saved.snapshot.adventure.creations.length} of 3 festival creations played. This is a record of practice, rather than an assessment of your child’s ability.</p>
      {saved.summary.length > 0 && <ul>{saved.summary.map((line) => <li key={line}>{line}</li>)}</ul>}
      <p>Ask {nickname} what they wanted to make, which instruction changed the game and who would enjoy playing it.</p>
      <p className="wl-caption">The family save was updated on {new Date(saved.updatedAt).toLocaleDateString("en-GB", { timeZone: "Europe/London" })}. Downloaded games are lightweight versions of these creations.</p>
      <div className="wl-actions">
        <button className="wl-button wl-outline wl-button-small" onClick={() => download("arcade-practice-summary", arcadeProjectReport(saved), "txt")}>Download the practice summary</button>
        {onOpen && <button className="wl-button wl-button-small" disabled={busy} onClick={onOpen}>Continue the arcade adventure</button>}
      </div>
      <details style={{ marginTop: 16 }}>
        <summary>Download the saved games.</summary>
        {designs.map(({ label, design }) => <div className="wl-order-row" key={label}>
          <div><strong>{design.title}</strong><small>{label}</small></div>
          <button className="wl-button wl-outline wl-button-small" onClick={() => download(design.title, createArcadeDownload(design), "html")}>Download {label.toLowerCase()}</button>
        </div>)}
      </details>
    </> : <>
      <p>No arcade project has been saved to this profile yet. Open the adventure and choose to save it to the family profile. Its creations and play summary will appear here.</p>
      {onOpen && <button className="wl-button wl-button-small" disabled={busy} onClick={onOpen}>Open the arcade adventure</button>}
    </>}
  </section>;
}
