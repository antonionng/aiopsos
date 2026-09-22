import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CourseEnquiryForm } from "@/components/course-enquiry-form";
import { ArrowRight } from "lucide-react";
import { fetchPublishedCourses } from "@/lib/courses";
import { StructuredData, ORGANISATION_LD } from "@/components/structured-data";
import { CatalogueFilters } from "@/components/courses/catalogue-filters";
import { CourseCardGrid } from "@/components/courses/course-card";
import { getSectors } from "@/lib/sectors";
import {
  COURSE_CATEGORIES,
  COURSE_CATEGORY_DESCRIPTIONS,
  COURSE_LEVELS,
  COURSE_LEVEL_DESCRIPTIONS,
  COURSE_SECTOR_LABELS,
  COURSE_SECTOR_SLUGS,
  type CourseCategory,
  type CourseLevel,
} from "@/lib/constants";
import { coursesIndexMetadata } from "@/lib/public-share-metadata";
import { isSelfServeEnabled } from "@/lib/self-serve/flag";
import { SELF_SERVE_TRACKS } from "@/lib/self-serve/catalog";
import { SelfServeAcademyCatalogue } from "@/components/learn/self-serve-marketing";
import { AcademyFormats } from "@/components/courses/academy-formats";
import type { SelfServeTrack } from "@/lib/self-serve/types";

export const metadata: Metadata = coursesIndexMetadata();

export const dynamic = "force-dynamic";

function isCourseLevel(value: string | undefined): value is CourseLevel {
  return !!value && (COURSE_LEVELS as readonly string[]).includes(value);
}

function isCourseCategory(value: string | undefined): value is CourseCategory {
  return !!value && (COURSE_CATEGORIES as readonly string[]).includes(value);
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; category?: string; self?: string }>;
}) {
  const { level, category, self } = await searchParams;
  const activeLevel = isCourseLevel(level) ? level : null;
  const activeCategory = isCourseCategory(category) ? category : null;
  const activeSelf = SELF_SERVE_TRACKS.includes(self as SelfServeTrack)
    ? (self as SelfServeTrack)
    : null;

  const allCourses = await fetchPublishedCourses();
  const courses = allCourses.filter(
    (c) =>
      (!activeLevel || c.level === activeLevel) &&
      (!activeCategory || c.category === activeCategory)
  );

  const totalHours = courses.reduce((sum, c) => sum + c.duration_hours, 0);

  return (
    <div>
      <StructuredData data={ORGANISATION_LD} />
      <header className="academy-hero">
        <div>
          <p className="academy-eyebrow">EXPERRT ACADEMY / YOUR NEXT CHAPTER</p>
          <h1>Big curiosity.<br />Practical skills.<br /><em>New possibilities.</em></h1>
          <p className="academy-intro">Experrt Academy offers two ways to build practical skills in AI, technology, robotics and HR transformation. Self-paced courses let each person learn online in their own time, and trainer-led courses bring a group together with an Experrt trainer, in person or online.</p>
          <div className="academy-actions">
            <a href="#self-paced" className="academy-button">Browse self-paced courses <ArrowRight size={18} /></a>
            <a href="#trainer-led" className="academy-text-link">Browse trainer-led courses <ArrowRight size={18} /></a>
          </div>
          <p className="academy-hero-note">Both formats are assessed on realistic work, and both end with a record your organisation can verify.</p>
        </div>
        <div className="academy-hero-visual">
          <Image src="/images/learning/together.webp" alt="An illustrative workshop scene of professionals exploring ideas together" fill priority sizes="(max-width: 760px) 100vw, 50vw" />
          <span className="academy-photo-tag">A little curiosity changes everything. ↗</span>
          <div className="academy-visual-note"><span>YOUR NEXT STEP</span><strong>Learn it.<br />Try it.<br />Make it yours.</strong></div>
        </div>
      </header>
      <AcademyFormats selfPacedOn={isSelfServeEnabled()} />
      {isSelfServeEnabled() ? (
        <SelfServeAcademyCatalogue
          track={activeSelf}
          level={activeLevel}
          category={activeCategory}
        />
      ) : null}
      <section id="trainer-led" className="academy-format-head" aria-labelledby="trainer-led-title">
        <p className="academy-eyebrow">TRAINER-LED COURSES</p>
        <h2 id="trainer-led-title">Learn with an Experrt trainer and colleagues from your organisation.</h2>
        <p>
          Trainer-led courses are delivered live, in person or online, to a group from your organisation. The trainer works through your own examples, attendance and assessed work are recorded, and each learner who meets the standard receives a certificate that names the course, the dates, and the trainer.
        </p>
      </section>
      <section className="academy-hr-discovery" aria-label="HR academy">
        <div><h2>HR, AI &amp; People Ops Academy</h2><p>Make people work better. Explore AI for HR, connected people systems and practical transformation, from everyday operations to leadership strategy.</p></div>
        <Link href="/courses?category=hr#catalogue" className="academy-text-link">Explore HR courses <ArrowRight size={18} /></Link>
      </section>
      <section id="catalogue" className="academy-catalogue-heading">
        <div><p className="academy-eyebrow">TRAINER-LED CATALOGUE</p><h2>Choose a subject and a level.</h2></div>
        <p>Filter the trainer-led catalogue by subject and level. Every course can be adapted to your sector, and we will help you choose the right starting point for your team.</p>
      </section>

      <CatalogueFilters
        active={{ category: activeCategory, level: activeLevel, sector: null }}
      />

      {activeCategory && (
        <p className="mb-2 max-w-2xl text-sm text-muted-foreground">
          {COURSE_CATEGORY_DESCRIPTIONS[activeCategory]}
        </p>
      )}
      {activeLevel && (
        <p className="mb-2 text-sm text-muted-foreground">
          {COURSE_LEVEL_DESCRIPTIONS[activeLevel]}
        </p>
      )}

      <p className="mb-8 text-xs text-muted-foreground">
        {courses.length} trainer-led course{courses.length === 1 ? "" : "s"} ·{" "}
        {totalHours} hours with a trainer
      </p>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No courses match these filters yet. Try another subject or level, or ask us to help you find the right fit.
          </p>
        </div>
      ) : (
        <CourseCardGrid courses={courses} />
      )}

      {/*
        The sector pills at the top of the page are a filter and read like
        one. This is the same eight sectors given room to say what they are
        for, which is what a reader arriving from a search for "AI training
        for banking" is actually looking for.
      */}
      <section className="mt-16">
        <h2 className="mb-2 text-xl font-semibold tracking-[-0.01em]">
          Browse by sector
        </h2>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Learning feels different when it speaks your language. Explore courses
          with the challenges, examples and opportunities of your industry in mind.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {getSectors().map((entry) => (
            <Link
              key={entry.sector}
              href={`/courses/sector/${COURSE_SECTOR_SLUGS[entry.sector]}`}
              className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
            >
              <span>
                <span className="mb-1 block text-sm font-semibold">
                  {COURSE_SECTOR_LABELS[entry.sector]}
                </span>
                <span className="block text-xs leading-relaxed text-muted-foreground">
                  {entry.tensions[0]?.title}
                </span>
              </span>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <section id="enquire" className="academy-enquiry">
        <div>
          <p className="academy-eyebrow">LET’S MAKE A START</p>
          <h2>Your next chapter<br />starts with<br /><em>a conversation.</em></h2>
          <p>Whether you need one trainer-led course or a programme for your whole team, tell us what you have in mind. We will recommend the right format, confirm dates, and send a price for your group.</p>
          <p className="academy-enquiry-note">Not sure where to start? That’s a good place to begin, too.</p>
          <Link href="/assessment/start" className="academy-text-link">Find your starting point with a learning check <ArrowRight size={18} /></Link>
        </div>
        <div className="academy-form-panel"><h3>Let’s talk about your learning</h3><CourseEnquiryForm source="catalogue" /></div>
      </section>
    </div>
  );
}
