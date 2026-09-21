"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBotGuard, HoneypotField } from "@/components/form-bot-guard";

import { labServices, projectStages, projectTimelines } from "@/lib/contact-enquiry";

const interests = ["Train my team", "Explore the platform", "Deliver training with Experrt", "AI Labs consulting & delivery", "Something else"];
const prompts: Record<string, string> = {
  "AI Labs consulting & delivery": "What do you want to build or improve? Tell us who will use it, the problem today and what success would look like.",
  "Train my team": "What should your team be able to do better? Tell us the skills, people and any timing you have in mind.",
  "Explore the platform": "What would you like your learning platform to make easier? Tell us how you run learning today.",
  "Deliver training with Experrt": "What do you teach, who do you train, and where could Experrt help?",
  "Something else": "What are you working on, and how could we help?",
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [interest, setInterest] = useState(interests[0]);
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");
  const [sourceArticle, setSourceArticle] = useState("");
  const [projectService, setProjectService] = useState("");
  const [projectStage, setProjectStage] = useState("");
  const [projectTimeline, setProjectTimeline] = useState("");
  const [projectSystems, setProjectSystems] = useState("");
  const [sourceCaseStudy, setSourceCaseStudy] = useState("");
  const isLabs = interest === "AI Labs consulting & delivery";
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const botGuard = useBotGuard();
  const requestId = useRef("");
  const pending = useRef(false);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    if (from === "ai-labs") setInterest("AI Labs consulting & delivery");
    const caseStudy = params.get("case");
    if (caseStudy && /^[a-z0-9-]{1,150}$/.test(caseStudy)) setSourceCaseStudy(caseStudy);
    const service = params.get("service");
    if (service && labServices.some(value => value === service)) setProjectService(service);
    if (from && /^[a-z0-9-]{1,150}$/.test(from)) setSourceArticle(from);
  }, []);
  useEffect(() => { if (sentTo) successRef.current?.focus(); }, [sentTo]);
  function edited() { requestId.current = ""; setError(""); }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending.current) return;
    pending.current = true;
    requestId.current ||= crypto.randomUUID();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId.current, name: name.trim(), email: email.trim(),
          organisation_name: organisation.trim(), interest, team_size: teamSize, source_article: sourceArticle,
          message: message.trim(), project_service: isLabs ? projectService : "", project_stage: isLabs ? projectStage : "", project_timeline: isLabs ? projectTimeline : "", project_systems: isLabs ? projectSystems : "", source_case_study: sourceCaseStudy, ...botGuard.fields() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "We couldn't save your enquiry. Please try again.");
      }
      setSentTo(email.trim());
      requestId.current = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Your answers are still here. Please try again.");
    } finally { pending.current = false; setSending(false); }
  }

  return (
    <div>
      <header className="mb-10 max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand">A conversation. A clearer next step.</p>
        <h1 className="mb-5 text-4xl font-bold tracking-[-0.04em] sm:text-6xl">{isLabs ? <>Your next build.<br />Starts here.</> : <>Big idea?<br />Let’s make it happen.</>}</h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{isLabs ? "AI systems, technology products, robotics or HR transformation. Share a short project brief and we’ll explore the right delivery approach." : "Better skills. A learning programme that works. A new way to deliver training. Tell us where you want to go."}</p>
      </header>
      <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-12">
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:col-span-3" aria-label="Contact Experrt">
          {sentTo ? (
            <div className="py-6" role="status">
              <CheckCircle2 className="mb-6 h-10 w-10 text-brand" aria-hidden />
              <h2 ref={successRef} tabIndex={-1} className="mb-4 text-3xl font-bold tracking-tight outline-none">You’ve started something.</h2>
              <p className="mb-3 text-base leading-relaxed">Your enquiry is saved. We’ll reply to <strong className="break-all">{sentTo}</strong> to work out the next step together.</p>
              <p className="mb-8 text-sm text-muted-foreground">You haven’t been added to a mailing list.</p>
              <Link href="/insights" className="inline-flex items-center gap-2 font-semibold text-brand">Find an idea to try meanwhile <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative space-y-6" aria-busy={sending}>
              <HoneypotField value={botGuard.honeypot} onChange={botGuard.setHoneypot} />
              <fieldset disabled={sending}>
                <legend className="mb-3 text-sm font-semibold">What brings you here?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {interests.map(option => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${interest === option ? "border-brand bg-brand/10" : "border-border hover:border-brand/50"}`}>
                    <input type="radio" name="interest" value={option} checked={interest === option} onChange={() => {setInterest(option); edited();}} className="accent-[#7046EB]" />{option}
                  </label>)}
                </div>
              </fieldset>
              <p className="text-xs text-muted-foreground">Name, email and your message are required. Everything else is optional.</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="name">Your name</Label><Input id="name" name="name" autoComplete="name" maxLength={200} placeholder="Alex Smith" value={name} onChange={e => {setName(e.target.value); edited();}} disabled={sending} required pattern=".*\S.*" className="h-12" /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@company.com" value={email} onChange={e => {setEmail(e.target.value); edited();}} disabled={sending} required className="h-12" /></div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="organisation">Organisation <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id="organisation" name="organisation" autoComplete="organization" maxLength={300} placeholder="Your organisation" value={organisation} onChange={e => {setOrganisation(e.target.value); edited();}} disabled={sending} className="h-12" /></div>
                {!isLabs && <div className="space-y-2"><Label htmlFor="team-size">People learning <span className="font-normal text-muted-foreground">(optional)</span></Label><select id="team-size" name="team-size" value={teamSize} onChange={e => {setTeamSize(e.target.value); edited();}} disabled={sending} className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"><option value="">Not sure yet</option>{["Just me", "2–10", "11–50", "51–200", "201+"].map(size => <option key={size}>{size}</option>)}</select></div>}
              </div>
              {isLabs && <fieldset disabled={sending} className="space-y-5 rounded-2xl border border-brand/20 bg-brand/5 p-5">
                <legend className="px-2 text-sm font-semibold">Your project brief <span className="font-normal">(optional details)</span></legend>
                <div className="grid gap-5 sm:grid-cols-2">{[
                  {id:"project-service", label:"What would you like to build?", value:projectService, set:setProjectService, options:labServices},
                  {id:"project-stage", label:"Where are you today?", value:projectStage, set:setProjectStage, options:projectStages},
                  {id:"project-timeline", label:"When would you like to start?", value:projectTimeline, set:setProjectTimeline, options:projectTimelines},
                ].map(field => <div className="space-y-2" key={field.id}><Label htmlFor={field.id}>{field.label}</Label><select id={field.id} value={field.value} onChange={e=>{field.set(e.target.value); edited();}} className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Not sure yet</option>{field.options.map(option=><option key={option}>{option}</option>)}</select></div>)}</div>
                <div className="space-y-2"><Label htmlFor="project-systems">What needs to connect?</Label><Textarea id="project-systems" maxLength={1000} value={projectSystems} onChange={e=>{setProjectSystems(e.target.value); edited();}} placeholder="For example: our HR system, CRM, documents, customer portal or equipment."/><p className="text-xs text-muted-foreground">A high-level description is enough. Leave out passwords and confidential records.</p></div>
              </fieldset>}
              <div className="space-y-2"><Label htmlFor="message">What would a good outcome look like?</Label><p id="message-hint" className="text-sm text-muted-foreground">{prompts[interest]} A few sentences is plenty.</p><Textarea id="message" name="message" aria-describedby="message-hint" maxLength={5000} placeholder="We’d love to…" className="min-h-[150px]" value={message} onChange={e => {setMessage(e.target.value); edited();}} disabled={sending} required /></div>
              {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error} Your message is still here. You can also email <a href="mailto:ag@experrt.com" className="underline">ag@experrt.com</a>.</p>}
              <Button type="submit" disabled={sending} className="h-12 w-full rounded-full text-base">{sending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving your enquiry…</> : <>{isLabs ? "Send project brief" : "Let’s talk"} <ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
              <p className="text-xs leading-relaxed text-muted-foreground">We use your details to respond to your enquiry, never to subscribe you to marketing. Read our <Link href="/privacy" className="underline underline-offset-2">privacy notice</Link>.</p>
            </form>
          )}
        </section>
        <aside className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl bg-[#201C29] p-7 text-[#FFFEFA] sm:p-8">
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#E4F477]">What happens next</p>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Your ambition.<br />Our starting point.</h2>
            <ol className="space-y-5">{[["We read your brief", "A real conversation starts with understanding what you need."], ["We work out the fit", isLabs ? "The users, systems, constraints and delivery expertise your project needs." : "The people, the skills and the kind of support that would help."], ["We agree a next step", isLabs ? "A discovery conversation, a scoped build or a practical implementation plan." : "That could be a platform walkthrough, a training plan or a useful introduction."]].map(([title,copy],i) => <li key={title} className="flex gap-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#E4F477]/40 text-xs text-[#E4F477]">{i+1}</span><div><h3 className="mb-1 text-sm font-semibold">{title}</h3><p className="text-sm leading-relaxed text-white/70">{copy}</p></div></li>)}</ol>
          </div>
          {isLabs ? <div className="px-2"><h2 className="mb-2 font-semibold">See how we build.</h2><p className="mb-3 text-sm text-muted-foreground">Explore implementation stories from our own platform before we discuss yours.</p><Link href="/case-studies" className="text-sm font-semibold text-brand">Explore our case studies →</Link></div> : <div className="px-2"><h2 className="mb-2 font-semibold">Still finding your starting point?</h2><p className="mb-3 text-sm leading-relaxed text-muted-foreground">Our short learning check helps you explore your priorities. Enter your name and email after the questions to unlock your results.</p><Link href="/assessment/start" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">Find my learning priorities <ArrowRight className="h-4 w-4" /></Link></div>}
          <a href="mailto:ag@experrt.com" className="inline-flex items-center gap-3 px-2 text-sm font-medium"><Mail className="h-4 w-4" />Prefer email? ag@experrt.com</a>
        </aside>
      </div>
    </div>
  );
}
