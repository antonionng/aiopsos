"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  CheckCheck,
  ChevronRight,
  Layers3,
  Plus,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";
import { PlatformFeatures } from "@/components/marketing/platform-features";
import { Wordmark } from "@/components/wordmark";
import { SiteNav } from "@/components/site-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COURSE_TITLES } from "@/lib/published-course-slugs";
import { SelfServeHomePitch } from "@/components/learn/self-serve-marketing";
import { showSelfServeOnHomepage } from "@/lib/self-serve/flag";
import "./learning-home.css";

const courses = [
  {
    slug: "ai-for-everyday-hr", category: "HR & People Ops",
    tag: "More human work", art: "mint", mark: "We",
    detail: "Put AI to work in HR with confidence and care.",
  },
  {
    slug: "hr-transformation-strategy-and-roadmap", category: "HR & People Ops",
    tag: "People. Systems. Possibility.", art: "mint", mark: "↗",
    detail: "Connect people, technology and a practical transformation roadmap.",
  },
  {
    slug: "ai-foundations-for-every-role",
    category: "AI",
    tag: "Start somewhere brilliant",
    art: "violet",
    mark: "Aa",
    detail: "Build confidence. Find your first useful application.",
  },
  {
    slug: "prompting-and-output-verification",
    category: "AI",
    tag: "Think. Create. Check.",
    art: "citrus",
    mark: "↗",
    detail: "Get better answers and learn how to check them.",
  },
  {
    slug: "working-alongside-a-cobot",
    category: "Robotics",
    tag: "Meet your next skill",
    art: "coral",
    mark: "01 /",
    detail: "Explore practical skills for working with robotics.",
  },
  {
    slug: "automating-the-work-nobody-wants",
    category: "Technology",
    tag: "Make room for better work",
    art: "blue",
    mark: "⌘",
    detail: "Find the repeatable work worth simplifying.",
  },
];
const previewSteps = [
  {
    title: "Find your starting point",
    type: "Assessment",
    time: "5 min",
    done: true,
  },
  {
    title: "Make AI useful in your role",
    type: "Live learning",
    time: "With a facilitator",
    done: false,
  },
  {
    title: "Try it on a real task",
    type: "Guided practice",
    time: "Your next step",
    done: false,
  },
];
const audiences = {
  providers: {
    eyebrow: "FOR TRAINING PROVIDERS",
    title: "Your expertise.\nA bigger possibility.",
    body: "Bring your courses, clients and delivery together. Explore a platform designed to give your learning business more room to grow.",
    points: [
      "Your programmes, under your brand",
      "A connected view of delivery and records",
      "AI support for the work around learning",
    ],
    cta: "Talk about your training business",
  },
  teams: {
    eyebrow: "FOR ENTERPRISE L&D",
    title: "Big ambitions.\nClear next steps.",
    body: "Connect your people with the learning they need. Bring internal expertise, training partners and progress into the same conversation.",
    points: [
      "Learning shaped around roles and goals",
      "A clearer view of people and progress",
      "Training records you can trace and share",
    ],
    cta: "Talk about your team's learning",
  },
};

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PlatformPreview() {
  const router = useRouter();
  const [brief, setBrief] = useState("Help my team get started with AI");
  return (
    <div className="ex-workspace">
      <div className="ex-workspace-bar">
        <span className="ex-mini-logo">
          e<span>✳</span>
        </span>
        <span>My learning space</span>
        <span className="ex-preview-label">Explore Experrt</span>
      </div>
      <Tabs defaultValue="plan" className="ex-preview-tabs">
        <TabsList className="ex-tab-list">
          <TabsTrigger value="learn">My learning</TabsTrigger>
          <TabsTrigger value="plan">Try the learning agent</TabsTrigger>
        </TabsList>
        <TabsContent value="learn" className="ex-tab-content">
          <div className="ex-preview-heading">
            <div>
              <span className="ex-small-label">
                A LITTLE PROGRESS, EVERY DAY
              </span>
              <h3>What will you learn next?</h3>
            </div>
            <span className="ex-avatar">You</span>
          </div>
          <div className="ex-path-banner">
            <div>
              <span className="ex-small-label">YOUR EXAMPLE PATHWAY</span>
              <h4>AI, in your everyday work.</h4>
              <span>From curious to confident.</span>
            </div>
            <span className="ex-path-glyph" aria-hidden="true">
              ↗
            </span>
          </div>
          <div className="ex-step-list">
            {previewSteps.map((step, i) => (
              <div className="ex-step" key={step.title}>
                <span
                  className={`ex-step-number ${step.done ? "is-done" : ""}`}
                >
                  {step.done ? <Check size={15} /> : `0${i + 1}`}
                </span>
                <div>
                  <strong>{step.title}</strong>
                  <span>
                    {step.type} · {step.time}
                  </span>
                </div>
                <ChevronRight size={17} />
              </div>
            ))}
          </div>
          <div className="ex-coach-note">
            <span className="ex-coach-dot" aria-hidden="true" />
            <p>
              <strong>A nudge in the right direction.</strong>
              <br />
              Explore how learning and AI support could work together.
            </p>
            <ArrowUpRight size={18} />
          </div>
        </TabsContent>
        <TabsContent value="plan" className="ex-tab-content">
          <div className="ex-preview-heading">
            <div>
              <span className="ex-small-label">START WITH AN AMBITION</span>
              <h3>Give your learning a direction.</h3>
            </div>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (brief.trim()) router.push(`/learning-agent/chat?brief=${encodeURIComponent(brief.trim())}`);
            }}
            className="ex-brief-form"
          >
            <label htmlFor="programme-brief">
              What would you like your team to learn?
            </label>
            <textarea
              id="programme-brief"
              value={brief}
              onChange={(event) => {
                setBrief(event.target.value);
              }}
              minLength={10}
              maxLength={2000}
              required
            />
            <button className="ex-button ex-button-dark" type="submit">
              Take this to my agent <Send size={15} />
            </button>
          </form>
            <div className="ex-plan-hint">
              <Layers3 size={24} />
              <p>
                Real materials, created around your goal. Open them, refine them
                and have the pack emailed to you. No account needed.{" "}
                <Link href="/learning-agent">Meet your learning agent ↗</Link>
              </p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Home() {
  const [category, setCategory] = useState("All learning");
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState<keyof typeof audiences>("providers");
  const selected = audiences[audience];
  const filteredCourses = courses.filter(
    (course) =>
      (category === "All learning" || course.category === category) &&
      `${COURSE_TITLES[course.slug]} ${course.detail}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );

  return (
    <div className="ex-home">
      <a className="ex-skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main">
        <section className="ex-hero ex-container">
          <Reveal className="ex-hero-copy">
            <div className="ex-eyebrow">
              <span /> THE NEXT CHAPTER OF LEARNING
            </div>
            <h1>
              Stay curious.
              <br />
              Get{" "}
              <span className="ex-word-highlight">
                unstoppable
                <svg viewBox="0 0 520 20" aria-hidden="true">
                  <path d="M4 13Q210 -4 515 9M85 18Q300 5 480 15" />
                </svg>
              </span>
              .
            </h1>
            <p>
              Experrt teaches courses you can buy and start on your own, and programmes you take with a facilitator. This autumn, learn to brief AI the way you would brief a colleague.
            </p>
            <div className="ex-hero-actions">
              <Link className="ex-button ex-button-dark" href="/learn">
                Explore courses <ArrowRight size={18} />
              </Link>
              <a className="ex-button ex-button-plain" href="#capabilities">
                Explore the platform <ArrowUpRight size={19} />
              </a>
            </div>
            <div className="ex-hero-foot">
              <span className="ex-stacked-labels">
                <span>L</span>
                <span>D</span>
                <span>↗</span>
              </span>
              <span>
                For learners. For teams.
                <br />
                <strong>For what comes next.</strong>
              </span>
            </div>
          </Reveal>
          <Reveal className="ex-hero-art">
            <Image
              src="/images/learning/possibility.webp"
              alt="Colourful sculptural forms representing new connections and possibilities"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 50vw"
              className="ex-hero-image"
            />
            <span className="ex-art-label">
              MAKE SPACE
              <br />
              FOR POSSIBILITY.
            </span>
            <div className="ex-floating-card ex-floating-top">
              <span className="ex-card-check">
                <CheckCheck size={22} />
              </span>
              <div>
                <strong>Small steps. Real growth.</strong>
                <span>That&apos;s the learning mindset.</span>
              </div>
            </div>
            <div className="ex-floating-card ex-floating-bottom">
              <span className="ex-progress-icon" aria-hidden="true">
                ↗
              </span>
              <div>
                <span>YOUR NEXT CHAPTER</span>
                <strong>Starts with a little curiosity.</strong>
              </div>
            </div>
            <span className="ex-art-caption">
              A different shape of learning.
            </span>
          </Reveal>
        </section>

        {showSelfServeOnHomepage() ? <SelfServeHomePitch /> : null}

        <div className="ex-ribbon">
          <div className="ex-container">
            <span>Human curiosity.</span>
            <Plus aria-hidden="true" />
            <span>Expert knowledge.</span>
            <Plus aria-hidden="true" />
            <span>AI possibility.</span>
            <span className="ex-ribbon-end">
              All in a day&apos;s learning. <ArrowUpRight size={20} />
            </span>
          </div>
        </div>

        <PlatformFeatures />

        <section id="platform" className="ex-platform ex-container ex-section">
          <Reveal className="ex-section-copy">
            <span className="ex-eyebrow">MEET YOUR LEARNING SPACE</span>
            <h2>
              Less finding your way.
              <br />
              More finding your <em>spark.</em>
            </h2>
            <p>
              Your learning should feel like it is going somewhere. Explore our
              learning platform: clear programmes, useful AI
              support and a home for every step forward.
            </p>
            <div className="ex-feature-line">
              <span>01</span>
              <div>
                <h3>A direction, not just a catalogue.</h3>
                <p>Connect learning to the things people want to do.</p>
              </div>
            </div>
            <div className="ex-feature-line">
              <span>02</span>
              <div>
                <h3>A little help along the way.</h3>
                <p>Bring questions, learning and feedback together.</p>
              </div>
            </div>
            <div className="ex-feature-line">
              <span>03</span>
              <div>
                <h3>Progress you can come back to.</h3>
                <p>Keep training and results connected to their records.</p>
              </div>
            </div>
            <Link href="/dashboard/learning" className="ex-text-link">
              Open your learning workspace <ArrowUpRight size={18} />
            </Link>
          </Reveal>
          <Reveal className="ex-preview-shell">
            <PlatformPreview />
            <p className="ex-preview-caption">
              Try the agent with your own goal, or explore My learning with
              example data.
            </p>
          </Reveal>
        </section>

        <section id="academy" className="ex-academy ex-section">
          <div className="ex-container">
            <Reveal className="ex-section-heading">
              <div>
                <span className="ex-eyebrow">
                  EXPERT-LED. CURIOSITY-FUELLED.
                </span>
                <h2>
                  Big possibilities.
                  <br />
                  Start with one new skill.
                </h2>
              </div>
              <Link href="/courses" className="ex-text-link">
                Explore the academy <ArrowUpRight size={19} />
              </Link>
            </Reveal>
            <div className="ex-catalogue-controls">
              <div
                className="ex-category-filters"
                aria-label="Filter featured courses"
              >
                {["All learning", "AI", "Robotics", "Technology", "HR & People Ops"].map(
                  (item) => (
                    <button
                      key={item}
                      aria-pressed={category === item}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
              <label className="ex-course-search">
                <Search size={17} />
                <span className="sr-only">Search featured courses</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find your next thing"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>
            </div>
            <div className="ex-course-grid" aria-live="polite">
              {filteredCourses.map((course) => (
                <Reveal key={course.slug}>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="ex-course-card"
                  >
                    <div className={`ex-course-cover ex-cover-${course.art}`}>
                      <span>{course.tag}</span>
                      <strong aria-hidden="true">{course.mark}</strong>
                      <span className="ex-cover-bottom">
                        EXPER<span>RT</span> ACADEMY <ArrowUpRight size={20} />
                      </span>
                    </div>
                    <div className="ex-course-body">
                      <span className={`ex-category ex-category-${course.art}`}>
                        {course.category}
                      </span>
                      <h3>{COURSE_TITLES[course.slug]}</h3>
                      <p>{course.detail}</p>
                      <div className="ex-course-meta">
                        <span>
                          <Users size={14} /> Trainer-led course
                        </span>
                        <ArrowUpRight size={17} />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            {filteredCourses.length === 0 && (
              <div className="ex-no-results">
                <h3>No featured courses match that search.</h3>
                <button
                  className="ex-text-link"
                  onClick={() => {
                    setCategory("All learning");
                    setQuery("");
                  }}
                >
                  Clear filters <ArrowRight size={16} />
                </button>
                <Link href="/courses">Or explore the full catalogue</Link>
              </div>
            )}
            <p className="ex-catalogue-note">
              A taste of our academy. Visit each course for its outline and
              delivery options.
            </p>
          </div>
        </section>

        <section
          id="enterprise"
          className="ex-audience ex-section ex-container"
        >
          <Reveal>
            <div
              className="ex-audience-switch"
              aria-label="Choose your organisation type"
            >
              <button
                aria-pressed={audience === "providers"}
                onClick={() => setAudience("providers")}
              >
                I run a training business
              </button>
              <button
                aria-pressed={audience === "teams"}
                onClick={() => setAudience("teams")}
              >
                I develop a team
              </button>
            </div>
            <div className="ex-audience-grid">
              <div className="ex-audience-copy" aria-live="polite">
                <span className="ex-eyebrow">{selected.eyebrow}</span>
                <h2>
                  {selected.title.split("\n").map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h2>
                <p>{selected.body}</p>
                <ul>
                  {selected.points.map((point) => (
                    <li key={point}>
                      <Check size={17} />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="ex-button ex-button-dark">
                  {selected.cta} <ArrowUpRight size={18} />
                </Link>
              </div>
              <div className="ex-programme-board">
                <div className="ex-board-header">
                  <span>
                    <span className="ex-status-dot" /> THE PROGRAMME VIEW
                  </span>
                  <span>Example programme</span>
                </div>
                <h3>
                  {audience === "providers"
                    ? "Great learning. All together."
                    : "Your team's next big step."}
                </h3>
                <div className="ex-board-cards">
                  <div>
                    <span className="ex-board-symbol">↗</span>
                    <strong>
                      {audience === "providers"
                        ? "Your expertise"
                        : "Your priorities"}
                    </strong>
                    <span>
                      {audience === "providers"
                        ? "Courses & learning material"
                        : "Goals & role-based learning"}
                    </span>
                  </div>
                  <div>
                    <span className="ex-board-symbol">◎</span>
                    <strong>Your people</strong>
                    <span>Learners & facilitators</span>
                  </div>
                  <div>
                    <span className="ex-board-symbol">≡</span>
                    <strong>Your progress</strong>
                    <span>Delivery & training records</span>
                  </div>
                </div>
                <div className="ex-board-footer">
                  <span className="ex-mini-logo">
                    e<span>✳</span>
                  </span>
                  <p>
                    A shared direction.
                    <br />
                    <strong>Every detail in its place.</strong>
                  </p>
                  <ArrowUpRight size={24} />
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="ex-labs-home ex-container" aria-labelledby="labs-home-title">
          <Reveal><span className="ex-eyebrow">EXPERRT AI LABS / CONSULTING + DELIVERY</span><h2 id="labs-home-title">Big ideas.<br/><em>Working systems.</em></h2><p>We build and implement AI systems, technology products, robotics solutions and HR transformation for SMBs and enterprises.</p><Link href="/ai-labs" className="ex-button ex-button-dark">Find out more about AI Labs <ArrowUpRight size={20}/></Link><p><Link href="/case-studies">See what we’ve built →</Link></p></Reveal>
          <div className="ex-labs-home-grid">{[["01","AI systems & agents"],["02","Technology products"],["03","Robotics implementation"],["04","HR transformation"]].map(([n,t])=><Link key={n} href="/ai-labs"><span>{n}</span><strong>{t}</strong><ArrowUpRight size={20}/></Link>)}</div>
        </section>

        <section id="services" className="ex-services ex-container">
          <Reveal className="ex-services-image">
            <Image
              src="/images/learning/together.webp"
              alt="An illustrative creative workshop with professionals learning together"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            <span className="ex-image-sticker">
              GOOD PEOPLE.
              <br />
              GREAT POSSIBILITIES.
            </span>
          </Reveal>
          <Reveal className="ex-services-copy">
            <span className="ex-eyebrow">THE PEOPLE BEHIND THE PROGRESS</span>
            <h2>
              Great technology.
              <br />
              <em>Even better together.</em>
            </h2>
            <p>
              A platform is only part of the picture. Our consulting and
              training team helps you make sense of AI and robotics, choose a
              direction, and build the skills to move forward.
            </p>
            <Link href="/ai-labs" className="ex-service-row">
              <div>
                <h3>Let&apos;s work out what&apos;s next.</h3>
                <span>AI Labs · Consulting & implementation</span>
              </div>
              <ArrowUpRight size={23} />
            </Link>
            <Link href="/courses" className="ex-service-row">
              <div>
                <h3>Let&apos;s learn by doing.</h3>
                <span>Practical training with expert facilitators</span>
              </div>
              <ArrowUpRight size={23} />
            </Link>
          </Reveal>
        </section>

        <section id="pricing" className="ex-pricing ex-section ex-container">
          <Reveal className="ex-section-heading">
            <div>
              <span className="ex-eyebrow">CHOOSE YOUR STARTING POINT</span>
              <h2>
                One ambition.
                <br />A few ways to get there.
              </h2>
            </div>
            <p>
              Explore the platform, learn with us, or bring an expert into the
              room.
            </p>
          </Reveal>
          <div className="ex-offer-grid">
            <Reveal>
              <span className="ex-offer-number">01 / PLATFORM</span>
              <h3>Run your learning.</h3>
              <p>Explore Experrt for your training business or L&D team.</p>
              <Link href="/contact" className="ex-text-link">
                Discuss the platform <ArrowUpRight size={17} />
              </Link>
            </Reveal>
            <Reveal>
              <span className="ex-offer-number">02 / ACADEMY</span>
              <h3>Build the skills.</h3>
              <p>
                Self-paced and trainer-led courses in AI, technology, robotics and HR transformation, each assessed on realistic work.
              </p>
              <Link href="/courses" className="ex-text-link">
                Find a course <ArrowUpRight size={17} />
              </Link>
            </Reveal>
            <Reveal>
              <span className="ex-offer-number">03 / CONSULTING</span>
              <h3>Find your direction.</h3>
              <p>Expert guidance shaped around your organisation and goals.</p>
              <Link href="/contact" className="ex-text-link">
                Start a conversation <ArrowUpRight size={17} />
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="ex-final">
          <div className="ex-container">
            <span className="ex-eyebrow">
              THERE&apos;S ALWAYS A NEXT CHAPTER.
            </span>
            <h2>
              Make yours
              <br />
              <span>an interesting one.</span>
            </h2>
            <Link className="ex-button ex-button-citrus" href="/contact">
              Let&apos;s make it happen <ArrowUpRight size={21} />
            </Link>
            <span className="ex-final-arrow" aria-hidden="true">
              ↗
            </span>
          </div>
        </section>
      </main>
      <footer className="ex-footer ex-container">
        <div className="ex-footer-top">
          <div>
            <Link className="ex-footer-logo" href="/">
              <Wordmark size="lg" className="!invert" />
            </Link>
            <p>Curiosity is a good place to start.</p>
          </div>
          <div>
            <strong>Platform</strong>
            <a href="#platform">Explore Experrt</a>
            <a href="#enterprise">Providers & teams</a>
            <Link href="/login">Sign in</Link>
          </div>
          <div>
            <strong>Expertise</strong>
            <Link href="/courses">Academy</Link>
            <Link href="/ai-labs">AI Labs · Consulting</Link>
            <Link href="/use-cases">Use cases</Link>
          </div>
          <div>
            <strong>Get to know us</strong>
            <Link href="/about">About Experrt</Link>
            <Link href="/insights">Insights</Link>
            <Link href="/contact">Get in touch</Link>
            <Link href="/docs">Documentation</Link>
          </div>
        </div>
        <div className="ex-footer-bottom">
          <span>© {new Date().getFullYear()} Experrt</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/course-terms">Course terms</Link>
            <Link href="/learn/faq">FAQ</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
          <span>Keep learning. Keep moving.</span>
        </div>
      </footer>
    </div>
  );
}
