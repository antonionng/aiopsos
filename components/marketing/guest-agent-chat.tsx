"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUp, ArrowUpRight, Check, FileText, Loader2, Mail, Plus, Share2, Sparkles } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { GUEST_TURN_LIMIT, type GuestView, type GuestContact } from "@/lib/guest-agent";

const AssistantMessage = dynamic(() => import("@/components/lms/assistant-message").then((module) => module.AssistantMessage));
const endpoint = "/api/public/learning-agent";
const empty: GuestView = { pack: null, remaining: GUEST_TURN_LIMIT, capture: false, locked: false, delivered: false, busy: false, progress: [], messages: [], contact: null };
const starters = [
  { label: "Get my team started with AI", brief: "Create a practical two-week AI starter programme for a team of 12 beginners. Include a hands-on exercise and a short knowledge check." },
  { label: "Build a better onboarding experience", brief: "Create a first-week onboarding learning pack for new customer support colleagues, with a practice scenario and a manager checklist." },
  { label: "Create a workshop I can deliver", brief: "Create a 60-minute workshop for HR teams on using AI responsibly. Include a facilitator plan, a participant worksheet and a follow-up email draft." },
];

export function GuestAgentChat({ initialBrief = "" }: { initialBrief?: string }) {
  const [view, setView] = useState<GuestView>(empty);
  const [brief, setBrief] = useState(initialBrief.slice(0, 2000));
  const [initialised, setInitialised] = useState(false);
  const [working, setWorking] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [deliveryError, setDeliveryError] = useState("");
  const [submittedBrief, setSubmittedBrief] = useState("");
  const [selected, setSelected] = useState(0);
  const [mobilePanel, setMobilePanel] = useState("conversation");
  const appFrame = useRef<HTMLDivElement>(null);
  const [showCapture, setShowCapture] = useState(false);
  const [shared, setShared] = useState(false);
  const [contact, setContact] = useState<GuestContact>({ name: "", email: "", organisation_name: "", consent: true, company_website: "" });
  const [consent, setConsent] = useState(false);
  const composer = useRef<HTMLTextAreaElement>(null);
  const conversationEnd = useRef<HTMLDivElement>(null);
  const requestPending = useRef(false);
  const busy = working || view.busy;

  async function refresh() {
    const response = await fetch(endpoint, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Please try again shortly.");
    setView(data);
    if (data.contact) { setContact(data.contact); setConsent(true); }
    return data as GuestView;
  }
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    // Follow the visible area when the mobile keyboard or browser chrome moves.
    const syncViewport = () => {
      if (viewport.scale !== 1) return;
      appFrame.current?.style.setProperty("--ga-viewport-height", `${viewport.height}px`);
      appFrame.current?.style.setProperty("--ga-viewport-top", `${viewport.offsetTop}px`);
    };
    syncViewport();
    viewport.addEventListener("resize", syncViewport);
    viewport.addEventListener("scroll", syncViewport);
    return () => {
      viewport.removeEventListener("resize", syncViewport);
      viewport.removeEventListener("scroll", syncViewport);
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    fetch(endpoint, { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (cancelled) return;
      setView(data); setInitialised(true);
      if (data.contact) { setContact(data.contact); setConsent(true); }
    }).catch((cause) => { if (!cancelled) setError(cause.message || "The agent is unavailable. Please refresh to retry."); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!busy) return;
    const timer = setInterval(() => { void refresh().catch(() => {}); }, 2500);
    return () => clearInterval(timer);
  }, [busy]);
  useEffect(() => { if (view.messages.length || submittedBrief) conversationEnd.current?.scrollIntoView({ block: "nearest" }); }, [view.messages.length, submittedBrief]);

  async function generate(event: React.FormEvent) {
    event.preventDefault();
    if (requestPending.current || busy || !initialised || view.locked || view.remaining <= 0) return;
    requestPending.current = true;
    setWorking(true); setError(""); setSubmittedBrief(brief.trim());
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brief }), signal: AbortSignal.timeout(115000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setView(data); setBrief(""); setSelected(0);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The agent couldn't finish. Please retry.");
      await refresh().catch(() => {});
    } finally { setWorking(false); setSubmittedBrief(""); requestPending.current = false; }
  }
  async function deliver(event: React.FormEvent) {
    event.preventDefault();
    if (sending || !consent || busy) return;
    setSending(true); setDeliveryError("");
    try {
      const response = await fetch(`${endpoint}/deliver`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...contact, consent }), signal: AbortSignal.timeout(55000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setView((previous) => ({ ...previous, delivered: true, locked: true }));
    } catch (cause) { setDeliveryError(cause instanceof Error ? cause.message : "Please retry sending your pack."); }
    finally { await refresh().catch(() => {}); setSending(false); }
  }
  async function share() {
    try { await navigator.clipboard.writeText(`${window.location.origin}/learning-agent`); setShared(true); }
    catch { setError("Share this link: " + window.location.origin + "/learning-agent"); }
  }
  const selectedItem = view.pack?.items[selected] ?? view.pack?.items[0];

  return <div ref={appFrame} className="ga-app" data-mobile-panel={mobilePanel}>
    <header className="ga-app-header">
      <Link href="/learning-agent" aria-label="Meet the Experrt learning agent"><Wordmark size="md" /></Link>
      <span className="ga-live-label"><span /> Your learning agent</span>
      <button type="button" className="ga-share" onClick={share}><Share2 size={15} /> {shared ? "Link copied" : "Share agent"}</button>
    </header>
    <nav className="ga-mobile-panels" aria-label="Learning agent views">
      <button type="button" aria-pressed={mobilePanel === "conversation"} aria-controls="ga-conversation" onClick={() => setMobilePanel("conversation")}>Conversation</button>
      <button type="button" aria-pressed={mobilePanel === "materials"} aria-controls="ga-materials" onClick={() => setMobilePanel("materials")}>Materials ({view.pack?.items.length ?? 0})</button>
    </nav>
    <main className="ga-workbench">
      <section id="ga-conversation" className="ga-conversation" aria-label="Conversation with your learning agent">
        <div className="ga-session-heading"><span className="ga-eyebrow">A LITTLE AMBITION. A WORKING START.</span><span className="ga-guest-badge">Guest session</span></div>
        <div className="ga-messages">
          <div className="ga-agent-avatar" aria-hidden="true"><Sparkles size={23} /></div>
          <h1>What shall we<br /><span>make possible?</span></h1>
          <p className="ga-welcome">Give me a learning goal. I’ll turn it into a pack you can actually use, with materials to open, refine and take away.</p>
          {!view.messages.length && !busy && <div className="ga-starters">{starters.map((starter) => <button key={starter.label} type="button" onClick={() => { setBrief(starter.brief); composer.current?.focus(); }}>{starter.label}<ArrowUpRight size={17} /></button>)}</div>}
          {view.messages.map((message, index) => <div key={index} ref={index === view.messages.length - 1 && !submittedBrief ? conversationEnd : undefined} className={`ga-message ga-message-${message.role}`}><span className="ga-message-author">{message.role === "user" ? "You" : "Experrt"}</span><p>{message.text}</p></div>)}
          {!busy && view.pack && <div className="ga-created-links"><span className="ga-message-author">Open your materials</span>{view.pack.items.map((item, index) => <button key={index} type="button" onClick={() => { setSelected(index); setMobilePanel("materials"); }}><FileText size={16} /><span>{item.title}</span><ArrowUpRight size={16} /></button>)}</div>}
          {submittedBrief && <div ref={conversationEnd} className="ga-message ga-message-user"><span className="ga-message-author">You</span><p>{submittedBrief}</p></div>}
          {view.progress.length > 0 && <div className="ga-activity" aria-label="Agent activity"><span className="ga-message-author">{busy ? "Working on your pack" : "Agent activity"}</span>{view.progress.map((step, index) => <div key={`${index}-${step}`}><Check size={14} /><span>{step}</span></div>)}</div>}
          {busy && <p className="ga-working" role="status"><Loader2 size={16} className="ga-spin" /> Creating and checking your materials. This can take a minute.</p>}
          {!busy && view.pack && !view.delivered && (view.capture || showCapture) && <section className="ga-capture" aria-labelledby="ga-capture-title">
            <span className="ga-eyebrow">YOURS TO PUT INTO PRACTICE</span><h2 id="ga-capture-title">Where shall I send your pack?</h2>
            <p>The complete materials, delivered to your inbox. Our team can help you take the next step.</p>
            <form onSubmit={deliver}>
              <fieldset disabled={sending || view.locked}>
                <label htmlFor="ga-name">Your name<input id="ga-name" autoComplete="name" value={contact.name} maxLength={150} required onChange={(event) => setContact({ ...contact, name: event.target.value })} /></label>
                <label htmlFor="ga-email">Your email<input id="ga-email" type="email" autoComplete="email" value={contact.email} maxLength={254} required onChange={(event) => setContact({ ...contact, email: event.target.value })} /></label>
                <label htmlFor="ga-organisation">Organisation <span>(optional)</span><input id="ga-organisation" autoComplete="organization" value={contact.organisation_name} maxLength={200} onChange={(event) => setContact({ ...contact, organisation_name: event.target.value })} /></label>
                <label className="ga-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={contact.company_website} onChange={(event) => setContact({ ...contact, company_website: event.target.value })} /></label>
                <label className="ga-consent"><input type="checkbox" checked={consent} required onChange={(event) => setConsent(event.target.checked)} /><span>Email my pack and share my details, brief and materials with the Experrt team at ag@experrt.com so they can follow up about it. <Link href="/privacy">Privacy policy</Link>.</span></label>
              </fieldset>
              {deliveryError && <p role="alert" className="ga-error">{deliveryError}</p>}
              <button className="ga-button ga-button-dark" disabled={sending || !consent} type="submit">{sending ? <Loader2 size={17} className="ga-spin" /> : <Mail size={17} />}{sending ? "Sending your pack" : view.locked ? "Retry delivery" : "Send me my learning pack"}</button>
            </form>
          </section>}
          {view.delivered && <div className="ga-success" role="status"><Check size={22} /><h2>Your pack is on its way.</h2><p>We’ve sent the materials to your email and shared your brief with the Experrt team.</p><Link href="/register">Keep creating in your workspace <ArrowUpRight size={16} /></Link></div>}
          {error && <p role="alert" className="ga-error">{error}</p>}
        </div>
        <div className="ga-composer-wrap">
          {view.remaining > 0 && !view.locked ? <form onSubmit={generate} className="ga-composer">
            <label className="sr-only" htmlFor="ga-brief">{view.pack ? "Refine your learning pack" : "Your learning goal"}</label>
            <textarea ref={composer} id="ga-brief" value={brief} onChange={(event) => setBrief(event.target.value)} minLength={10} maxLength={2000} required disabled={busy} placeholder={view.pack ? "Make it more specific. Add a practical exercise…" : "I’d like my team to…"} />
            <div><span>{view.pack ? `${view.remaining} ${view.remaining === 1 ? "refinement" : "refinements"} remaining` : "No sign-up needed"}</span><button type="submit" disabled={busy || !initialised || brief.trim().length < 10} aria-label={view.pack ? "Refine my pack" : "Create my learning pack"}>{busy ? <Loader2 size={19} className="ga-spin" /> : <ArrowUp size={21} />}</button></div>
          </form> : <div className="ga-session-complete"><p>{view.pack ? "A good start deserves a next step." : "You’ve reached the free session limit."}</p><Link href="/register">Continue with Experrt <ArrowUpRight size={16} /></Link></div>}
          <p className="ga-session-note">One free pack, up to two refinements. AI-created drafts for your review. <Link href="/learning-agent">About your agent</Link></p>
        </div>
      </section>
      <aside id="ga-materials" className="ga-materials" aria-label="Your created learning materials">
        <div className="ga-materials-heading"><span className="ga-eyebrow">YOUR WORK, TAKING SHAPE</span><span className="ga-item-count">{view.pack?.items.length ?? 0} items</span></div>
        {view.pack ? <>
          <h2>{view.pack.title}</h2>
          <div className="ga-material-tabs" role="tablist" aria-label="Learning materials">{view.pack.items.map((item, index) => <button key={index} id={`ga-tab-${index}`} role="tab" aria-selected={selected === index} aria-controls="ga-document" type="button" onClick={() => setSelected(index)}><FileText size={16} />{item.title}</button>)}</div>
          <article className="ga-document" id="ga-document" role="tabpanel" aria-labelledby={`ga-tab-${selected}`}><div className="ga-document-brand"><Wordmark size="md" className="ga-document-logo" /><span>CREATED FOR YOUR GOAL</span></div><h3>{selectedItem?.title}</h3><AssistantMessage text={selectedItem?.content ?? ""} allowImages={false} /></article>
          {!view.delivered && <button className="ga-button ga-button-dark ga-send-pack" disabled={busy || sending} type="button" onClick={() => { setShowCapture(true); setMobilePanel("conversation"); setTimeout(() => document.getElementById("ga-capture-title")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50); }}><Mail size={17} /> Email me this pack</button>}
        </> : <div className="ga-materials-empty"><div className="ga-paper-stack" aria-hidden="true"><div /><div /><div><Sparkles size={28} /><span>Room for your<br />next big idea.</span><i /><i /><i /></div></div><h2>More than a conversation.</h2><p>Your agent can create a learning programme, a workshop, a quiz, or the materials that bring them to life.</p><div className="ga-material-types"><span><Plus size={13} /> Programmes</span><span><Plus size={13} /> Worksheets</span><span><Plus size={13} /> Assessments</span></div></div>}
        <div className="ga-powered-note">From the Experrt learning platform.<br /><Link href="/courses">Explore our academy <ArrowUpRight size={14} /></Link></div>
      </aside>
    </main>
  </div>;
}
