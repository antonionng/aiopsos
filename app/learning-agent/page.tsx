import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, FileText, MoveUpRight, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Wordmark } from "@/components/wordmark";
import { withSiteShareImages } from "@/lib/social-image";

const title = "Meet your learning agent";
const description = "Give Experrt a learning goal. Watch your agent create a practical programme, workshop or learning pack you can refine and receive by email. Try it without signing up.";
export const metadata: Metadata = withSiteShareImages({ title, description, alternates: { canonical: "/learning-agent" }, openGraph: { title, description, url: "/learning-agent", type: "website" } });
const prompts = [
  { number: "01", title: "Make AI useful for my team.", detail: "A practical programme. A first exercise. A way to check what sticks.", brief: "Create a two-week AI starter programme for 12 beginners with a practical exercise and a short knowledge check.", colour: "lilac" },
  { number: "02", title: "Give new starters a better start.", detail: "A first-week learning journey, with activities and a manager checklist.", brief: "Create a first-week onboarding learning pack for new customer support colleagues, with a practice scenario and a manager checklist.", colour: "mint" },
  { number: "03", title: "Turn my expertise into a workshop.", detail: "A session plan, participant materials and something to put into practice.", brief: "Create a 60-minute workshop for HR teams on using AI responsibly, with a facilitator plan, a participant worksheet and a follow-up email draft.", colour: "citrus" },
];
export default function LearningAgentPage() {
  return <><SiteNav /><main className="ga-landing">
    <section className="ga-hero">
      <div className="ga-hero-copy"><span className="ga-eyebrow"><span className="ga-status-dot" /> MEET YOUR LEARNING AGENT</span><h1>Bring the ambition.<br /><span>Let’s make<br />something of it.</span></h1><p>A course for your team. A workshop you can deliver. A first step into AI. Give your agent a goal and watch it turn into learning you can use.</p><Link href="/learning-agent/chat" className="ga-button ga-button-dark">Try your learning agent <ArrowUpRight size={20} /></Link><span className="ga-hero-small">No account. No blank canvas. Just your next idea.</span></div>
      <div className="ga-hero-art" aria-label="Example of a learning pack the agent can create"><span className="ga-orbit-word">A LITTLE HELP. A LOT OF POSSIBILITY.</span><div className="ga-hero-spark" aria-hidden="true">✳</div><div className="ga-example-brief"><span>YOU BRING THE GOAL</span><p>“Help my team get started with AI.”</p><MoveUpRight size={22} /></div><div className="ga-example-pack"><div><Sparkles size={21} /><span>YOUR AGENT GETS TO WORK</span></div><h2>From an idea<br />to a useful first week.</h2>{["A practical learning programme", "A hands-on team exercise", "A short knowledge check"].map((item) => <p key={item}><FileText size={18} />{item}<Check size={16} /></p>)}<footer>Example pack <span>Made around your goal ↗</span></footer></div><span className="ga-art-caption">Real creation starts with your brief.</span></div>
    </section>
    <div className="ga-intro-strip"><span>THINK IT. MAKE IT. PUT IT TO WORK.</span><a href="#possibilities">Find your starting point <ArrowDown size={16} /></a></div>
    <section className="ga-possibilities" id="possibilities"><div className="ga-section-heading"><span className="ga-eyebrow">BIG IDEAS WELCOME</span><h2>What would move<br />your team forward?</h2><p>Pick a starting point, or bring a brief of your own. Your agent takes it from there.</p></div><div className="ga-prompt-grid">{prompts.map((prompt) => <Link key={prompt.number} className={`ga-prompt-card ga-${prompt.colour}`} href={`/learning-agent/chat?brief=${encodeURIComponent(prompt.brief)}`}><span className="ga-prompt-number">{prompt.number} /</span><h3>{prompt.title}</h3><p>{prompt.detail}</p><span className="ga-prompt-link">Try this brief <ArrowUpRight size={22} /></span></Link>)}</div></section>
    <section className="ga-how"><div><span className="ga-eyebrow">YOU SET THE DIRECTION</span><h2>A little less admin.<br /><span>A lot more making.</span></h2><p>Your agent does the groundwork and brings the materials back to you. Open them, shape them, then take them into your working day.</p><Link href="/learning-agent/chat" className="ga-button ga-button-dark">Let’s create something <ArrowUpRight size={19} /></Link></div><ol>{[
      ["Give it something to work towards.", "Tell it who the learning is for and what you want them to be able to do. It can make a useful start even if you’re still figuring it out."],
      ["See the work happen.", "The agent can look through Experrt’s course catalogue, create original materials and check the pack. You see its completed actions as it works."],
      ["Make it yours. Take it with you.", "Ask for up to two refinements. When the pack is ready, add your details to receive the materials by email and connect with our team."],
    ].map(([heading, body], index) => <li key={heading}><span>0{index + 1}</span><div><h3>{heading}</h3><p>{body}</p></div></li>)}</ol></section>
    <section className="ga-next"><Sparkles size={32} /><span className="ga-eyebrow">A TASTE OF WHAT COMES NEXT</span><h2>Start with a pack.<br />Grow into a learning culture.</h2><p>Explore the agent as a guest. Bring courses, programmes, learners and progress together in your Experrt workspace when you’re ready.</p><Link href="/learning-agent/chat" className="ga-button ga-button-dark">Meet your agent <ArrowUpRight size={19} /></Link><p className="ga-next-small">Your free session includes one pack and up to two refinements.<br />Materials are AI-created drafts for your review. Live training delivery happens in your workspace.</p></section>
    <footer className="ga-footer"><Link href="/" aria-label="Experrt home"><Wordmark size="md" /></Link><span>A little direction goes a long way.</span><Link href="/privacy">Privacy</Link><Link href="/contact">Talk to us <ArrowUpRight size={14} /></Link></footer>
  </main></>;
}
