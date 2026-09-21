"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardCheck,
  GraduationCap,
  FileCheck2,
  LibraryBig,
  MessageSquareText,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Find the starting point",
    name: "Assessments",
    icon: ClipboardCheck,
    href: "/assessment/start",
    for: "Learners & teams",
    description:
      "Understand training needs and AI readiness, then explore courses matched to the results.",
    detail:
      "Readiness and training-needs assessments help identify priorities. Results reflect the assessment completed, rather than a practical qualification.",
    action: "Try the free learning check",
  },
  {
    title: "Keep learning together",
    name: "Live delivery",
    icon: Users,
    href: "/dashboard/cohorts",
    for: "Delivery teams",
    description:
      "Organise training groups, sessions, enrolments and facilitator-led delivery.",
    detail:
      "Manage scheduled cohorts and their sessions, then maintain attendance and results as training happens. Available actions depend on your role.",
    action: "Open training groups",
  },
  {
    title: "Know what comes next",
    name: "Programmes",
    icon: GraduationCap,
    href: "/dashboard/learning",
    for: "Learners",
    description:
      "Follow assigned lessons, knowledge checks and practical challenges, with trainer feedback.",
    detail:
      "Programmes use published course versions. Your attempts, practical reviews and completion dates remain connected to the content you learned.",
    action: "Open my learning",
  },
  {
    title: "Ask with context",
    name: "Agent work",
    icon: MessageSquareText,
    href: "/dashboard/agents",
    for: "Learners & teams",
    description:
      "Give an agent a learning goal. It can draft a course, propose a programme or review delivery.",
    detail:
      "Agents read authorised workspace records and prepare proposals for a manager to approve. AI provider configuration and credits are required; practical grading stays with trainers.",
    action: "Open agent work",
  },
  {
    title: "Bring knowledge closer",
    name: "Learning studio",
    icon: LibraryBig,
    href: "/dashboard/studio",
    for: "Organisation teams",
    description: "Build lessons, quizzes, practical challenges and supervised observations.",
    detail:
      "Save a draft, publish a fixed course version and use it in programmes for your own people or connected clients.",
    action: "Open learning studio",
  },
  {
    title: "Keep the evidence",
    name: "Training records",
    icon: FileCheck2,
    href: "/dashboard/records",
    for: "Organisation teams",
    description:
      "Bring training records into dated evidence packs, with certificate verification.",
    detail:
      "Evidence packs capture a dated snapshot. Certificates record completion under the course rules; neither is a blanket declaration of regulatory compliance.",
    action: "Open records & reviews",
  },
];

export function PlatformFeatures() {
  const [active, setActive] = useState(0);
  const feature = features[active];
  const Icon = feature.icon;
  return (
    <section
      id="capabilities"
      className="ex-capabilities ex-section ex-container"
    >
      <div className="ex-section-heading">
        <div>
          <span className="ex-eyebrow">EXPLORE WHAT&apos;S IN THE APP</span>
          <h2>
            More than a place
            <br />
            to put your courses.
          </h2>
        </div>
        <p>Meet the tools already connecting learning, delivery and records.</p>
      </div>
      <div className="ex-feature-explorer">
        <div
          className="ex-feature-buttons"
          aria-label="Explore platform features"
        >
          {features.map((item, index) => (
            <button
              aria-pressed={active === index}
              aria-controls="feature-detail"
              onClick={() => setActive(index)}
              key={item.name}
            >
              <item.icon size={19} />
              <span>{item.name}</span>
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
        <div
          id="feature-detail"
          className="ex-feature-detail"
          aria-live="polite"
        >
          <span className="ex-feature-icon">
            <Icon size={35} strokeWidth={1.4} />
          </span>
          <span className="ex-small-label">{feature.for}</span>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          <p className="ex-feature-footnote">{feature.detail}</p>
          <Link href={feature.href} className="ex-button ex-button-dark">
            {feature.action} <ArrowUpRight size={17} />
          </Link>
          <span className="ex-feature-access">
            Sign in to use your account&apos;s available features.
          </span>
        </div>
      </div>
    </section>
  );
}
