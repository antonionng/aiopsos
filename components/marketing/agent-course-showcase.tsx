"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { agentMarketingCourses, type AgentCourseGroup } from "@/lib/always-on-agents/marketing";
import "./agent-course-showcase.css";

export function AgentCourseShowcase({ catalogue = false }: { catalogue?: boolean }) {
  const rail = useRef<HTMLDivElement>(null);
  const [group, setGroup] = useState<AgentCourseGroup | "All courses">("All courses");
  const [available,setAvailable]=useState<string[]>(() => agentMarketingCourses.map((course) => course.slug));
  useEffect(()=>{const controller=new AbortController();void fetch("/api/public/agent-course-offers",{signal:controller.signal}).then(r=>r.ok?r.json():null).then(data=>{if(data)setAvailable(data.offers.map((o:{slug:string})=>o.slug));}).catch(()=>{});return ()=>controller.abort();},[]);
  const courses = agentMarketingCourses.filter(course => group === "All courses" || course.group === group);

  function scroll(direction: number) {
    if (!rail.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.current.scrollBy({ left: direction * Math.min(rail.current.clientWidth * .85, 740), behavior: reduced ? "instant" : "smooth" });
  }

  return <section id="agent-courses" className={`agent-showcase ${catalogue ? "agent-showcase-catalogue" : ""}`} aria-labelledby="agent-showcase-title">
    <div className="agent-showcase-inner">
      <div className="agent-showcase-heading">
        <div><p className="agent-showcase-eyebrow">EXPERRT ACADEMY / WORKING WITH AI AGENTS</p>{catalogue ? <h1 id="agent-showcase-title">Explore courses in working with always-on AI agents</h1> : <h2 id="agent-showcase-title">Learn how to make AI agents<br /><em>useful in your everyday work.</em></h2>}<p className="agent-showcase-intro">An always-on AI agent can continue an agreed task while you are away, such as checking for new information or preparing a regular report. Explore courses that teach you how to give it clear instructions, check its work and decide when it should ask for your help.</p><p className="agent-showcase-course-count">Explore {agentMarketingCourses.length} course outlines, from your first agent to running a team of agents.</p></div>
        {!catalogue && <Link href="/courses/agents" className="agent-showcase-all">Explore all agent courses <ArrowUpRight size={18} /></Link>}
      </div>
      <div className="agent-showcase-toolbar"><div className="agent-showcase-filters" aria-label="Choose a course category">{(["All courses", "Start here", "Platform courses", "Practical applications"] as const).map(item => <button key={item} aria-pressed={item === group} onClick={() => { setGroup(item); rail.current?.scrollTo({ left: 0 }); }}>{item}</button>)}</div><div className="agent-showcase-arrows"><button aria-label="Scroll to previous courses" onClick={() => scroll(-1)}><ArrowLeft size={20} /></button><button aria-label="Scroll to next courses" onClick={() => scroll(1)}><ArrowRight size={20} /></button></div></div>
      <div ref={rail} className={`agent-showcase-rail ${catalogue ? "agent-showcase-grid" : ""}`} tabIndex={0} role="region" aria-label="Browse agent courses"><div className="agent-showcase-cards">{courses.map(course => <article className="agent-showcase-card" key={course.slug}>
        <Link href={course.href} className="agent-showcase-art" tabIndex={-1} aria-hidden="true"><Image src={course.image} alt="" width={1536} height={1024} sizes="(max-width: 600px) 85vw, 360px" /><span>{course.group}</span></Link>
        <div className="agent-showcase-card-body"><p className="agent-showcase-status">{available.includes(course.slug)?"Open for enrolment · Six modules":"Coming soon · Six modules"}</p><h3><Link href={course.href}>{course.title}</Link></h3><p>{course.summary}</p><div className="agent-showcase-card-footer"><div><strong>£99</strong><span>{available.includes(course.slug)?"Course price":"Planned course price"}</span></div><Link href={course.href}>View course <ArrowUpRight size={17} /></Link></div></div>
      </article>)}</div></div>
      <div className="agent-showcase-bottom"><p>{available.length?"Choose an available course to explore its lessons, practical project and AI assessment. Each course costs £99, with 12 months of access.":"Explore the course outlines and try a sample lesson. Enrolment opens when the course and its assessment service are ready."}</p><Link href="/courses/always-on-agents-preview">Try the Foundations sample <ArrowRight size={17} /></Link></div>
    </div>
  </section>;
}
