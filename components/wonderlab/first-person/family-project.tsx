"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloudDownload, CloudUpload, LoaderCircle } from "lucide-react";
import { arcadeChildId, readArcadeSnapshot, type ArcadeProjectSnapshot } from "@/lib/wonderlab/arcade-project";

type Context = { child: { id: string; nickname: string } | null; revision: number; snapshot: ArcadeProjectSnapshot | null; reason: string };
type Props = { snapshot: ArcadeProjectSnapshot; onLoad: (snapshot: ArcadeProjectSnapshot) => void };

/** Device creations are never silently assigned to a child on a shared device. */
export function FamilyProject({ snapshot, onLoad }: Props) {
  const [context, setContext] = useState<Context | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [conflict, setConflict] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  async function connect() {
    if (request.current) return;
    const controller = new AbortController(); request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/wonderlab/arcade-project", { cache: "no-store", signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Your family project could not be opened.");
      if (!["local", "family"].includes(data.mode) || typeof data.reason !== "string" || data.reason.length > 600) throw new Error("Your family project could not be opened.");
      if (data.mode === "local") { setContext({ child: null, revision: 0, snapshot: null, reason: data.reason }); return; }
      if (!arcadeChildId(data.child?.id) || typeof data.child.nickname !== "string" || data.child.nickname.length > 100 || !Number.isSafeInteger(data.revision) || data.revision < 0) throw new Error("Your family profile could not be opened.");
      const saved = data.snapshot === null ? null : readArcadeSnapshot(data.snapshot);
      if (data.snapshot !== null && !saved) throw new Error("Your family save could not be read. Keep your device copy.");
      setContext({ child: data.child, revision: data.revision, snapshot: saved, reason: data.reason });
      if (saved === null && data.revision === 0) setConflict(false);
      // A conflict must be resolved by loading the existing save. Merely refreshing
      // its revision must not turn the next click into a silent overwrite.
    } catch (error) {
      if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : "Your family project could not be opened.");
      else setMessage("The connection took too long. Your device copy is safe. Try again when you are connected.");
    } finally { clearTimeout(timeout); request.current = null; setBusy(false); }
  }

  async function save() {
    if (!context?.child || busy || request.current || conflict) return;
    const controller = new AbortController(); request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    const childId = context.child.id;
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/wonderlab/arcade-project", { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ childId, revision: context.revision, snapshot }) });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) setConflict(true);
        throw new Error(typeof data.error === "string" ? data.error : "Your family save could not be confirmed. Keep your device copy.");
      }
      const saved = readArcadeSnapshot(data.snapshot);
      if (data.childId !== childId || !saved || data.revision !== context.revision + 1) throw new Error("Your save could not be confirmed. Refresh your family save before trying again.");
      setContext({ ...context, revision: data.revision, snapshot: saved });
      setMessage(`Saved to ${context.child.nickname}’s private family project. Your grown-up can see your creations and practice story.`);
    } catch (error) {
      // A timeout may follow a successful commit; never retry against an assumed revision.
      setConflict(true);
      setMessage(error instanceof Error && !controller.signal.aborted ? error.message : "We could not confirm the save. Your device copy is safe. Refresh your family save to see whether it arrived.");
    } finally { clearTimeout(timeout); request.current = null; setBusy(false); }
  }

  return <section className="fp-family-project" aria-label="Your private family project">
    <h3>Keep your adventure with your family.</h3>
    <p>Your device saves automatically. Use the button below to keep a copy in your chosen child profile. Your grown-up can see these games and what you practised.</p>
    {!context && <button className="fp-secondary" disabled={busy} onClick={connect}>{busy ? <LoaderCircle size={17} /> : <CloudDownload size={17} />} Find my family project</button>}
    {context?.child && <>
      <p><strong>You are saving for {context.child.nickname}.</strong> This is a separate Arcade Apprentice project within Game Concept Studio.</p>
      {context.snapshot && <button className="fp-secondary" disabled={busy} onClick={() => { onLoad(context.snapshot!); setConflict(false); setMessage("Your family adventure is open. You can continue from its saved chapter."); }}><CloudDownload size={17} /> Continue the saved family adventure</button>}
      <button className="fp-secondary" disabled={busy || conflict} onClick={save}><CloudUpload size={17} /> Save this adventure for {context.child.nickname}</button>
      {context.snapshot && <p>Saving replaces this profile’s current arcade project with the version on this device. Continue the saved adventure first if you want to carry on from another device.</p>}
      <button className="fp-text-button" disabled={busy} onClick={connect}>Refresh my family save</button>
    </>}
    {context && !context.child && <><p>{context.reason}</p><Link className="fp-text-button" href="/wonderlab/family">Open the family space</Link></>}
    {conflict && <p>Download your current game if you want to keep both versions. Then refresh and continue the family adventure before saving more changes.</p>}
    {message && <p role="status">{message}</p>}
  </section>;
}
