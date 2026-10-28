"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Compass, Download, Expand, Footprints, Gem, KeyRound, LoaderCircle, Menu, Play, RotateCcw, Sparkles, Star, Undo2, Volume2, VolumeX, WandSparkles, X } from "lucide-react";
import {
  applyPracticeRequest, containsPrivateDetails, createArcadeDownload, DEFAULT_DESIGN,
  getDesignInstructions, restoreArcadeProject, validateArcadeDesign,
  type ArcadeDesign, type AvatarLook, type SavedArcadeProject, type WorldBand,
} from "@/lib/wonderlab/first-person";
import { NEW_ADVENTURE, arcadeBrief, arcadeLearningSummary, arcadeTeaching, currentChapter, finishArcadeChapter, restoreArcadeAdventure, type ArcadeAdventure, type ArcadeTeachingMoment } from "@/lib/wonderlab/arcade-adventure";
import { useNarration } from "@/components/wonderlab/use-narration";
import { useGameScreen } from "@/components/wonderlab/use-game-screen";
import { AvatarPortrait } from "./avatar";
import { LiveDesignHelper } from "./live-design-helper";
import { PicturePrompt } from "./picture-prompt";
import { FamilyProject } from "./family-project";

const World = dynamic(() => import("./world"), { ssr: false, loading: () => <div className="fp-loading"><LoaderCircle size={24} /><span>Your world is waking up.</span></div> });
const STORAGE_KEY = "wonderlab:arcade-apprentice:v1";
const INITIAL: SavedArcadeProject = { version: 1, band: "inventors", avatar: { kind: "explorer", colour: "#5eead4" }, design: DEFAULT_DESIGN, revisions: 0, playtests: 0 };
const looks: { kind: AvatarLook["kind"]; name: string }[] = [
  { kind: "explorer", name: "Explorer" }, { kind: "robot", name: "Sparkbot" }, { kind: "sprite", name: "Moonling" },
];
const colours = [{ value: "#5eead4", name: "Sea glass" }, { value: "#a78bfa", name: "Lilac" }, { value: "#fbbf24", name: "Sunshine" }, { value: "#fb7185", name: "Coral" }, { value: "#93c5fd", name: "Sky blue" }];
const bands: { id: WorldBand; name: string }[] = [{ id: "explorers", name: "4–6 · With a grown-up" }, { id: "inventors", name: "7–10 · Inventors" }, { id: "creators", name: "11–13 · Creators" }, { id: "studio", name: "14–16 · Future Studio" }];
const suggestions = ["Make a forest game with five crystals.", "Keep the world, but collect fireflies.", "Add a key that unlocks the portal.", "Add a golden bonus treasure.", "Make the world sunset and walk faster."];
type View = "welcome" | "explore" | "create" | "play" | "complete";

function objectName(design: ArcadeDesign) { return design.collectible === "firefly" ? "fireflies" : `${design.collectible}s`; }

export function ArcadePreview() {
  const [project, setProject] = useState<SavedArcadeProject>(INITIAL);
  const [adventure, setAdventure] = useState<ArcadeAdventure>(NEW_ADVENTURE);
  const [advanced, setAdvanced] = useState(false);
  const [keyFound, setKeyFound] = useState(false);
  // Pip speaks by default: children should not need to read to follow the adventure.
  const [voice, setVoice] = useState(true);
  const [restored, setRestored] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Your progress stays on this device.");
  const [view, setView] = useState<View>("welcome");
  const [ready, setReady] = useState(false);
  const [worldError, setWorldError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [guided, setGuided] = useState(false);
  // Each chapter starts with an empty prompt, so the child makes the choices.
  const [request, setRequest] = useState("");
  const [writeOwn, setWriteOwn] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [changes, setChanges] = useState<string[]>([]);
  const [previous, setPrevious] = useState<ArcadeDesign | null>(null);
  const [collected, setCollected] = useState(0);
  const [runId, setRunId] = useState(0);
  const [expandedHelp, setExpandedHelp] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const promptInput = useRef<HTMLTextAreaElement>(null);
  const menuDialog = useRef<HTMLDialogElement>(null);
  const finishedRun = useRef(-1);
  const gameScreen = useGameScreen(screen);
  const narration = useNarration(project.band === "explorers" ? "explorers" : "inventors");
  const chapter = currentChapter(adventure);
  const brief = arcadeBrief(adventure, project.band);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const old = restoreArcadeProject(parsed);
          if (old) {
            setProject(old); setGuided(old.band === "explorers");
            const journey = restoreArcadeAdventure(parsed.adventure) ?? NEW_ADVENTURE;
            setAdventure(journey);
          }
          else setSaveMessage("Your old preview could not be opened. You can begin a new creation.");
        }
      } catch { setSaveMessage("Device saving is unavailable. Download your game to keep it."); }
      setRestored(true);
      if (new URLSearchParams(window.location.search).get("family") === "1") setMenuOpen(true);
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }, 0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { clearTimeout(timer); document.body.style.overflow = previousOverflow; };
  }, []);

  useEffect(() => {
    if (!restored) return;
    let message = "Saved on this device.";
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...project, adventure })); }
    catch { message = "Device saving is unavailable. Download your game to keep it."; }
    const timer = window.setTimeout(() => {
      setSaveMessage(message);
    }, 0);
    return () => clearTimeout(timer);
  }, [project, adventure, restored]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (view === "create" || view === "complete") {
        screen.current?.querySelector<HTMLElement>(view === "create" ? "#fp-workshop-title" : "#fp-finish-title")?.focus({ preventScroll: true });
      } else if (view === "explore" || view === "play") {
        screen.current?.querySelector<HTMLCanvasElement>("canvas")?.focus({ preventScroll: true });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [view]);

  useEffect(() => {
    const dialog = menuDialog.current;
    if (menuOpen && dialog && !dialog.open) dialog.showModal();
    else if (!menuOpen && dialog?.open) dialog.close();
  }, [menuOpen]);

  const start = () => {
    setView(adventure.creations.length ? "create" : "explore");
    if (window.matchMedia("(pointer: coarse)").matches) void gameScreen.enter();
  };
  const openWorkshop = useCallback(() => { setView("create"); setExpandedHelp(false); }, []);
  const collectKey = useCallback(() => setKeyFound(true), []);
  const worldReady = useCallback(() => setReady(true), []);
  const reportWorldError = useCallback((message: string) => setWorldError(message), []);
  const complete = useCallback(() => {
    if (finishedRun.current === runId) return;
    finishedRun.current = runId;
    const next = finishArcadeChapter(adventure, project.design, { collected, keyFound, enteredPortal: true });
    setAdvanced(next !== adventure);
    setAdventure(next);
    setProject((p) => ({ ...p, playtests: Math.min(10000, p.playtests + 1) }));
    setView("complete");
  }, [runId, adventure, project.design, collected, keyFound]);

  function play() {
    setCollected(0); setKeyFound(false); setRunId((i) => i + 1); setView("play"); setExpandedHelp(false);
  }

  function applyRequest() {
    const result = applyPracticeRequest(request, project.design);
    setFeedback(result.message);
    setChanges(result.changes);
    if (result.changes.length) {
      setPrevious(project.design);
      setProject((p) => ({ ...p, design: result.design, revisions: Math.min(10000, p.revisions + 1) }));
    }
    return result;
  }

  function buildAndPlay() {
    const result = applyRequest();
    if (result.matched) play();
  }

  function undo() {
    if (!previous) return;
    setProject((p) => ({ ...p, design: previous })); setPrevious(null);
    setChanges([]); setFeedback("Your previous design is back. You can try a different idea.");
  }

  function applyAiDesign(design: ArcadeDesign, explanation: string) {
    setPrevious(project.design);
    setProject((p) => ({ ...p, design, revisions: Math.min(10000, p.revisions + 1) }));
    setChanges(["Your chosen changes are ready to play."]);
    setFeedback(`AI explanation: ${explanation}`);
  }

  function download() {
    const valid = validateArcadeDesign(project.design);
    if (!valid) return;
    const url = URL.createObjectURL(new Blob([createArcadeDownload(valid)], { type: "text/html" }));
    const a = document.createElement("a"); a.href = url; a.download = "my-wonderlab-game.html"; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
    setFeedback("Your game has been downloaded. Open the HTML file in a browser to play a lightweight version.");
  }

  const isPlaying = view === "play";
  // Younger players build their prompt from picture choices; 7 to 10 year olds can switch to writing it.
  const pictureMode = project.band === "explorers" || (project.band === "inventors" && !writeOwn);
  // The preview card shows what the current prompt would build, so each choice visibly changes it.
  const preview = request.trim() ? applyPracticeRequest(request, project.design).design : project.design;
  const TreasureIcon = project.design.collectible === "crystal" ? Gem : project.design.collectible === "star" ? Star : Sparkles;
  const overlay = view === "welcome" || view === "create" || view === "complete";
  const portalOpen = collected >= project.design.target && (project.design.challenge === "collect" || keyFound);
  const teachingMoment: ArcadeTeachingMoment = view === "explore" ? "explore"
    : view === "complete" && chapter === "opened" ? "finished"
    : view === "create" || view === "complete" ? chapter === "key-quest" ? "keyCreate" : chapter === "visitor-game" ? "visitor" : "create"
    : portalOpen ? "portal" : keyFound ? "keyFound" : project.design.challenge === "key" ? "keyPlay" : collected > 0 ? "collected" : "play";
  const guide = arcadeTeaching(project.band, teachingMoment);
  const { speak, stop } = narration;
  useEffect(() => {
    if (voice && view !== "welcome" && !menuOpen) speak(guide);
    else stop();
    return stop;
  }, [voice, guide, view, menuOpen, speak, stop]);

  function nextChapter() {
    setRequest(""); setFeedback(""); setChanges([]); setPrevious(null); openWorkshop();
  }

  function downloadLearning() {
    const text = ["Wonderlab: my Lantern Arcade adventure", "", "This is a practice record from this device, not an assessment of independent AI skill.", "", ...arcadeLearningSummary(adventure), "", "Ask together: What did you ask the helper to change? How did that change the game? What else would you like to make?"].join("\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "my-arcade-learning.txt"; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  const voiceButton = <button className="fp-voice" aria-pressed={voice} onClick={() => { if (voice) stop(); setVoice(!voice); }}>{voice ? <VolumeX size={17} /> : <Volume2 size={17} />}{voice ? "Turn Pip’s voice off" : "Hear Pip as you play"}</button>;

  return (
    <div className={`fp-shell fp-${project.design.palette} ${overlay ? "fp-has-overlay" : ""}`} ref={screen}>
      <div className="fp-scene" inert={overlay || menuOpen}>
        <World design={project.design} avatar={project.avatar} mode={isPlaying || view === "complete" ? "play" : "explore"} runId={runId}
          paused={overlay || menuOpen} reducedMotion={reducedMotion} guided={guided}
          onReady={worldReady} onError={reportWorldError} onInteract={openWorkshop} onCollect={setCollected} onKeyCollect={collectKey} onComplete={complete} />
      </div>
      <div className="fp-vignette" aria-hidden="true" />
      <header className="fp-topbar">
        <Link href="/wonderlab/games" className="fp-icon-button" aria-label="Leave the arcade preview"><ArrowLeft size={21} /></Link>
        <div className="fp-wordmark"><span aria-hidden="true">✳</span> wonderlab <small>THE ARCADE APPRENTICE</small></div>
        <button className="fp-icon-button" disabled={aiBusy} onClick={() => setMenuOpen(true)} aria-label="Open game menu"><Menu size={21} /></button>
      </header>

      {worldError && <div className="fp-world-error" role="alert"><strong>The 3D world could not open.</strong><p>{worldError}</p><button className="fp-primary" onClick={download}><Download size={18} /> Download the lightweight game</button><Link href="/wonderlab/games">Return to Wonderlab</Link></div>}

      {view === "welcome" && !worldError && <section className="fp-welcome" aria-labelledby="fp-welcome-title">
        <div className="fp-welcome-story">
          <span className="fp-kicker"><span /> A FIRST-PERSON PLAYTEST</span>
          <p className="fp-world-name">Welcome to Asterhaven.</p>
          <h1 id="fp-welcome-title">Reopen the<br /><em>lantern arcade.</em></h1>
          <p>Mira needs your games for the festival. Create a treasure hunt, add a magical key and make a game for your first visitor.</p>
          <div className="fp-journey"><span><Compass size={17} /> Explore</span><i /><span><WandSparkles size={17} /> Create</span><i /><span><Play size={17} /> Play</span></div>
          <p className="fp-preview-note">Learn to turn an idea into a prompt, improve what you make and design for another person. This preview uses prepared game choices.</p>
        </div>
        <div className="fp-character-card">
          <div className="fp-card-heading"><span>YOUR ADVENTURE STARTS WITH YOU</span><Sparkles size={17} /></div>
          <div className="fp-character-stage"><div className="fp-orbit fp-orbit-one" /><div className="fp-orbit fp-orbit-two" /><AvatarPortrait avatar={project.avatar} /><span className="fp-avatar-name">{looks.find((l) => l.kind === project.avatar.kind)?.name}</span></div>
          <fieldset className="fp-avatar-options"><legend>Choose your character.</legend>{looks.map((look) => <button key={look.kind} aria-pressed={project.avatar.kind === look.kind} onClick={() => setProject((p) => ({ ...p, avatar: { ...p.avatar, kind: look.kind } }))}>{look.name}</button>)}</fieldset>
          <fieldset className="fp-colours"><legend>Pick your colour.</legend>{colours.map((colour) => <button key={colour.value} style={{ background: colour.value }} aria-label={colour.name} aria-pressed={project.avatar.colour === colour.value} onClick={() => setProject((p) => ({ ...p, avatar: { ...p.avatar, colour: colour.value } }))}>{project.avatar.colour === colour.value && <Check size={17} />}</button>)}</fieldset>
          <label className="fp-band-label">Choose your help level.<select value={project.band} onChange={(e) => { const band = e.target.value as WorldBand; setProject((p) => ({ ...p, band })); setGuided(band === "explorers"); }}>{bands.map((band) => <option key={band.id} value={band.id}>{band.name}</option>)}</select></label>
          <button className="fp-primary fp-enter" disabled={!ready || !restored} onClick={start}>{ready ? <>{adventure.creations.length > 0 ? "Continue my adventure" : "Enter the arcade"}<ArrowRight size={20} /></> : <><LoaderCircle size={18} className="fp-spin" /> Opening your world…</>}</button>
          <small className="fp-device-note">{saveMessage} You can also keep a copy in your family space from the game menu.</small>
        </div>
      </section>}

      {!overlay && !worldError && <>
        <div className="fp-objective"><span className="fp-kicker">{isPlaying ? "YOU ARE PLAYING YOUR CREATION" : `CHAPTER ${brief.number} OF 3`}</span><h1>{isPlaying ? portalOpen ? "Step through your portal." : collected >= project.design.target ? "Find the golden key." : `Find ${project.design.target} ${objectName(project.design)}.` : "Visit Mira’s workshop."}</h1>{isPlaying ? <div className="fp-collection" aria-label={`${collected} of ${project.design.target} collected`}><TreasureIcon size={18} /><strong>{collected} / {project.design.target}</strong>{project.design.challenge === "key" && <span className="fp-key-status" aria-label={keyFound ? "Key found" : "Key still to find"}><KeyRound size={18} />{keyFound && <Check size={14} />}</span>}<div><span style={{ width: `${100 * collected / project.design.target}%` }} /></div></div> : <p>Find the glowing workshop to make your game.</p>}</div>
        <div className="fp-pip-bubble"><AvatarPortrait avatar={{ kind: "robot", colour: "#a78bfa" }} small /><div><span>PIP · YOUR FICTIONAL GUIDE</span><p aria-live="polite">{guide}</p>{voiceButton}</div><button className="fp-icon-button" aria-label={expandedHelp ? "Hide movement help" : "Show movement help"} onClick={() => setExpandedHelp((v) => !v)}><ChevronDown size={18} /></button></div>
        {expandedHelp && <div className="fp-movement-help">Drag the view to look around. Use the touch control or W, A, S and D to walk. You can also use the guided-walk button. Your creations are saved on this device.</div>}
        {isPlaying && <div className="fp-side-actions"><button onClick={openWorkshop}><WandSparkles size={20} /><span>Change my game</span></button><button onClick={play} aria-label="Restart my game"><RotateCcw size={20} /></button></div>}
        <span className="fp-source-tag">{narration.message || "Prepared game helper · Optional AI-generated voice"}</span>
      </>}

      {view === "create" && !worldError && <section className={`fp-workshop ${project.band === "explorers" ? "fp-workshop-young" : ""} ${pictureMode ? "fp-workshop-picture" : ""}`} aria-labelledby="fp-workshop-title">
        <div className="fp-workshop-heading"><div><span className="fp-kicker">{chapter === "opened" ? "YOUR OPEN ARCADE" : `CHAPTER ${brief.number} OF 3`}</span><h1 id="fp-workshop-title" tabIndex={-1}>{brief.title}</h1></div><button className="fp-icon-button" disabled={aiBusy} onClick={() => setView("explore")} aria-label="Return to exploring"><X size={22} /></button></div>
        <div className="fp-chapter-progress" aria-label={`${adventure.creations.length} of three festival games completed`}>{["Make a game", "Add a key quest", "Design for a visitor"].map((title, i) => <span key={title} aria-current={adventure.creations.length === i ? "step" : undefined}>{adventure.creations.length > i ? <Check size={15} /> : <b>{i + 1}</b>}{title}</span>)}</div>
        <div className="fp-story-brief"><AvatarPortrait avatar={{ kind: chapter === "key-quest" ? "sprite" : "explorer", colour: chapter === "key-quest" ? "#a78bfa" : "#fbbf24" }} small /><div><span>{brief.speaker}</span><p>{brief.story}</p><strong>{brief.goal}</strong></div></div>
        {chapter === "visitor-game" && <fieldset className="fp-visitors"><legend>Who are you making this game for?</legend>{([{ id: "moss", name: "Moss", wish: "I would like a short, gentle treasure hunt.", kind: "sprite", colour: "#5eead4" }, { id: "nova", name: "Nova", wish: "I would like a longer adventure with a key to find.", kind: "explorer", colour: "#a78bfa" }] as const).map((visitor) => <button key={visitor.id} aria-pressed={adventure.visitor === visitor.id} onClick={() => { setAdventure((a) => ({ ...a, visitor: visitor.id })); setRequest(""); setFeedback(""); }}><AvatarPortrait avatar={{ kind: visitor.kind, colour: visitor.colour }} small /><span><strong>{visitor.name}</strong>{visitor.wish}</span>{adventure.visitor === visitor.id && <Check size={18} />}</button>)}</fieldset>}
        <div className="fp-workshop-grid">
          <div className="fp-maker">
            <div className="fp-tutor"><AvatarPortrait avatar={{ kind: "robot", colour: "#a78bfa" }} small /><div><p>{guide}</p>{voiceButton}{narration.message && <p role="status">{narration.message}</p>}</div></div>
            {project.band === "inventors" && <button type="button" className="fp-text-button fp-prompt-mode" onClick={() => { setWriteOwn((value) => !value); setRequest(""); }}>{writeOwn ? <><Sparkles size={16} /> Use picture choices instead</> : <><WandSparkles size={16} /> Write the prompt myself</>}</button>}
            {pictureMode && <PicturePrompt showRules={chapter !== "first-game"} showSpeed={chapter === "visitor-game" || chapter === "opened"} current={project.design} request={request} disabled={aiBusy} onRequest={setRequest} />}
            {!pictureMode && <>
            <label className="fp-prompt-label" htmlFor="arcade-prompt">Describe the game you want to make.</label>
            <textarea disabled={aiBusy} id="arcade-prompt" ref={promptInput} value={request} maxLength={350} rows={3} onChange={(e) => setRequest(e.target.value)} placeholder="Make a forest game with five crystals." />
            <div className="fp-prompt-meta"><span><span className="fp-status-dot" /> Practice helper · Prepared responses</span><span>{request.length}/350</span></div>
            <div className="fp-prompt-actions"><button className="fp-primary" disabled={aiBusy || !request.trim()} onClick={buildAndPlay}><Play size={18} /> Build and play my game</button><button className="fp-secondary fp-undo" disabled={aiBusy || !previous} onClick={undo} aria-label="Undo my last design change"><Undo2 size={19} /></button></div>
            <details className="fp-ideas"><summary>See an example instruction.</summary><div>{[brief.hint, ...suggestions].filter((value, i, all) => all.indexOf(value) === i).map((idea) => <button key={idea} disabled={aiBusy} onClick={() => { setRequest(idea); promptInput.current?.focus(); }}><Sparkles size={14} />{idea}</button>)}</div></details>
            <p className="fp-helper-limits">You can choose the world, treasure, number to find, walking speed, a key quest and a bonus. Your words stay in this browser.</p>
            </>}
            {(project.band === "creators" || project.band === "studio") && <LiveDesignHelper current={project.design} request={request} band={project.band} onApply={applyAiDesign} onBusyChange={setAiBusy} />}
            {feedback && <div className={`fp-feedback ${changes.length ? "fp-feedback-success" : ""}`} role="status">{changes.length ? <><strong><Check size={17} /> Your game has changed.</strong><ul>{changes.map((change) => <li key={change}>{change}</li>)}</ul><p>{feedback}</p></> : feedback}</div>}
          </div>
          {project.band !== "explorers" && <div className={`fp-design-card fp-design-${preview.palette}`}>
            <div className="fp-design-art" aria-hidden="true"><div className="fp-design-moon" /><div className="fp-design-orbit" /><div className="fp-design-island"><div className="fp-design-portal" />{Array.from({ length: 3 }, (_, i) => <span key={i} className={`fp-mini-treasure fp-mini-${i}`}>{preview.collectible === "crystal" ? <Gem /> : preview.collectible === "star" ? <Star /> : <Sparkles />}</span>)}</div><span className="fp-build-badge">{preview === project.design ? "YOUR PLAYABLE CREATION" : "PREVIEW OF YOUR PROMPT"}</span></div>
            <div className="fp-design-content"><label htmlFor="arcade-title">Name your game.</label><input disabled={aiBusy} id="arcade-title" key={project.design.title} defaultValue={project.design.title} maxLength={60} onBlur={(event) => {
              const typed = event.currentTarget.value.replace(/[<>\x00-\x1f]/g, "").trim();
              const hasPrivateDetails = containsPrivateDetails(typed);
              if (hasPrivateDetails) {
                event.currentTarget.value = "My Arcade Adventure";
                setFeedback("Game names cannot include an email, link, phone number, address or your real name, so we changed it back. Try a made-up name instead.");
              }
              const title = (hasPrivateDetails ? "" : typed) || "My Arcade Adventure";
              setProject((p) => ({ ...p, design: { ...p.design, title } }));
            }} /><ul>{getDesignInstructions(preview).slice(1, 5).map((line) => <li key={line}><Check size={15} /> {line}</li>)}</ul>{preview.bonus && <span className="fp-bonus-note"><Star size={15} /> You added a golden bonus treasure.</span>}<button className="fp-text-button" onClick={download}><Download size={16} /> Download a lightweight playable copy</button></div>
          </div>}
        </div>
        {pictureMode && <div className="fp-young-start"><p aria-live="polite">{request ? <>Your prompt: “{request}”</> : "Tap your choices above. Pip will turn them into a prompt."}</p><button className="fp-primary" disabled={aiBusy || !request.trim()} onClick={buildAndPlay}><Play size={19} fill="currentColor" /> Build and play my game</button><small>This helper uses prepared game choices. You are practising how to ask AI to make something.</small></div>}
      </section>}

      {view === "complete" && !worldError && <section className="fp-finished" aria-labelledby="fp-finish-title">
        <div className="fp-reward">{chapter === "opened" ? <Sparkles size={50} /> : <Star size={50} fill="currentColor" />}</div>
        <span className="fp-kicker">{adventure.creations.length} OF 3 FESTIVAL GAMES READY</span>
        <h1 id="fp-finish-title" tabIndex={-1}>{chapter === "opened" ? "Your arcade is open!" : advanced ? "Your game is ready." : "You finished your game."}</h1>
        <p>{chapter === "opened" ? "Mira can welcome the festival visitors. You made a treasure hunt, added a key quest and created a game for someone else." : advanced ? chapter === "key-quest" ? "Mira has her first game. Nova has an idea for your next creation: a magical key that opens the portal." : "Your key quest works. Now a visitor is waiting for a game made especially for them." : `You completed this design. To finish the chapter, try this change: ${brief.goal}`}</p>
        <div className="fp-finish-project"><AvatarPortrait avatar={project.avatar} small /><div><strong>{project.design.title}</strong><span>{project.design.target} {objectName(project.design)} · {project.design.challenge === "key" ? "Key quest" : "Treasure hunt"}</span></div><Check size={22} /></div>
        <div className="fp-finish-actions"><button className="fp-primary" onClick={nextChapter}><WandSparkles size={18} />{chapter === "opened" ? "Make something new" : advanced ? "Meet my next visitor" : "Change my game"}</button><button className="fp-secondary" onClick={download}><Download size={18} /> Keep this playable game</button><button className="fp-text-button" onClick={play}><RotateCcw size={16} /> Play this game again</button></div>
        {adventure.creations.length > 0 && <details className="fp-learning-record"><summary>See what you practised.</summary><ul>{arcadeLearningSummary(adventure).map((line) => <li key={line}>{line}</li>)}</ul><button className="fp-text-button" onClick={downloadLearning}><Download size={16} /> Keep my learning story</button><p>This is a record of practice, not a test of independent AI skill.</p></details>}
        <button className="fp-text-button" onClick={() => setMenuOpen(true)}><Download size={16} /> Save to my family space</button><small>{saveMessage}</small>
      </section>}

      <dialog className="fp-menu" ref={menuDialog} onCancel={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} aria-labelledby="fp-menu-title"><header><h2 id="fp-menu-title">Your adventure</h2><button className="fp-icon-button" aria-label="Close game menu" onClick={() => setMenuOpen(false)}><X size={21} /></button></header><p>This is the first playable version of a new Wonderlab world. Your avatar, games and adventure are saved on this device.</p>{voiceButton}<label className="fp-setting"><span><Footprints size={20} /> Help me move around.</span><input type="checkbox" checked={guided} onChange={(e) => setGuided(e.target.checked)} /></label><label className="fp-setting"><span><Sparkles size={20} /> Use less animation.</span><input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} /></label><button className="fp-secondary" onClick={() => { setMenuOpen(false); void gameScreen.enter(true); }}><Expand size={18} /> Fill the screen</button><button className="fp-secondary" onClick={() => { setMenuOpen(false); openWorkshop(); }}><WandSparkles size={18} /> Open my workshop</button><button className="fp-secondary" onClick={() => { setMenuOpen(false); setView("welcome"); }}><AvatarPortrait avatar={project.avatar} small /> Change my character</button><button className="fp-secondary" onClick={download}><Download size={18} /> Download my game</button><Link className="fp-text-button" href="/wonderlab/games"><ArrowLeft size={17} /> Return to Wonderlab</Link><FamilyProject snapshot={{ project, adventure }} onLoad={(saved) => { setProject(saved.project); setAdventure(saved.adventure); setRequest(""); setPrevious(null); setFeedback(""); setChanges([]); setGuided(saved.project.band === "explorers"); setCollected(0); setKeyFound(false); setRunId((id) => id + 1); setView("create"); setMenuOpen(false); }} /><small>{saveMessage} Optional narration uses an AI-generated voice. Your learning story records practice, not assessed skills.</small>{gameScreen.message && <small>{gameScreen.message}</small>}</dialog>
    </div>
  );
}
