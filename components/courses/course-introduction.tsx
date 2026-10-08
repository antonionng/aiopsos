"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, FileCheck2, PlayCircle } from "lucide-react";
import { getCourseIntroduction, getIntroductionVideo, hasLessonRecordings } from "@/lib/course-introductions";
import "./course-introduction.css";

export function CourseIntroduction({ slug }: { slug: string }) {
  const course = getCourseIntroduction(slug);
  const video = getIntroductionVideo(slug);
  if (!course) return null;
  return <section id="course-introduction" className={`course-introduction ${course.family === "self-paced" ? "is-self-paced" : ""}`} aria-labelledby="course-introduction-title">
    <div className="course-introduction-heading"><p className="course-introduction-eyebrow">{video ? "WATCH THE COURSE INTRODUCTION" : "GET TO KNOW THIS COURSE"}</p><h2 id="course-introduction-title">What you will learn and how you can use it at work</h2><p>{course.learn}</p>{video ? <p>Watch the course explainer to understand who the course is for, what you will practise and what you will produce. Pause or replay any part you want to revisit, then read the outline below to decide whether the course fits your needs.</p> : null}{hasLessonRecordings(slug) ? <p>The course also includes a recorded lesson explanation. Watch the example, pause to try the task yourself and return to the recording when you need a reminder.</p> : null}</div>
    <div className="course-introduction-grid">
      {video ? <IntroductionPlayer video={video} title={course.title} /> : <div className="course-introduction-art"><Image src={course.image} alt={`Illustration of practical work related to ${course.title}`} width={1536} height={1024} sizes="(max-width: 760px) 100vw, 55vw" /><span>Learn through practical work</span></div>}
      <div className="course-introduction-copy"><div><BookOpen size={21} aria-hidden="true" /><h3>Is this the right course for you?</h3><p>{course.audience}</p></div><div><FileCheck2 size={21} aria-hidden="true" /><h3>What you will practise and produce</h3><p>{course.project}</p></div><div><ClipboardCheck size={21} aria-hidden="true" /><h3>How you show what you have learned</h3><p>{course.assessment}</p></div></div>
    </div>
    <div className="course-introduction-benefit"><h3>How these skills can help you at work</h3><p>{course.benefit}</p><a href={course.family === "agent" ? "#agent-course-outline" : "#course-curriculum"}>Explore the course outline <ArrowRight size={17} aria-hidden="true" /></a></div>
  </section>;
}

export function IntroductionPlayer({ video, title, kind = "Course introduction" }: { video: NonNullable<ReturnType<typeof getIntroductionVideo>>; title: string; kind?: "Course introduction" | "Lesson explanation" }) {
  const [failed, setFailed] = useState(false);
  return <div className="course-introduction-player">
    {!video.reviewed ? <p className="course-introduction-review-note">Private review copy. This recording and its draft captions still need checking before publication.</p> : null}
    {failed ? <div className="course-introduction-error" role="status"><h3>The video could not load.</h3><p>You can still use the written explanations or open the video directly.</p><a href={video.src}>Open the video</a></div> : <video controls playsInline crossOrigin="anonymous" preload="none" poster={video.poster} aria-label={`${title}: ${kind.toLowerCase()}`} onError={() => setFailed(true)} src={video.src}><track kind="captions" src={video.captions} srcLang="en-GB" label="English" default />Your browser cannot play this video. <a href={video.src}>Open the video</a>.</video>}
    <div className="course-introduction-player-footer"><span>{video.durationLabel} · {kind}</span><a href={video.transcript}>Read the transcript{video.reviewed ? "" : " draft"}</a></div>
  </div>;
}

export function AcademyIntroduction({ homepage = false }: { homepage?: boolean }) {
  const video = getIntroductionVideo("academy-overview");
  const recordedLessonsAvailable = hasLessonRecordings();
  return <section id="academy-introduction" className={`academy-introduction ${homepage ? "is-homepage" : ""}`} aria-labelledby="academy-introduction-title"><div className="academy-introduction-inner"><div className="academy-introduction-heading"><p className="course-introduction-eyebrow">WELCOME TO EXPERRT ACADEMY</p><h2 id="academy-introduction-title">Learn with clear explanations and practical exercises</h2><p>Choose a course that helps with a task you want to do better. Work through examples, try the method yourself and use feedback to check your understanding. Explore AI, technology, robotics and HR at your own pace, or learn with an Experrt trainer as a team.</p>{video ? <p>Watch our Academy explainer to see how the courses work, what you will practise and how assessment and certificates fit into your learning.</p> : null}<div className="academy-introduction-actions"><Link href="/register">Create your Experrt account <ArrowRight size={18} aria-hidden="true" /></Link><Link href="/learn">Explore self-paced courses <ArrowRight size={18} aria-hidden="true" /></Link></div><p className="academy-introduction-account-note">Creating an account is free. Course prices and what is included are shown on each course page.</p></div>
      {video ? <IntroductionPlayer video={video} title="Welcome to Experrt Academy" /> : <div className="academy-introduction-cover"><Image src="/courses/always-on-agents/agent-collaboration.png" alt="Illustration of professionals planning, practising and reviewing work together" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 50vw" /></div>}
      <div className={`academy-introduction-features ${recordedLessonsAvailable ? "has-recordings" : ""}`}>
        {recordedLessonsAvailable ? <div><PlayCircle size={25} aria-hidden="true" /><h3>Watch an explanation, then try it yourself</h3><p>Recorded lesson explanations walk you through an example before you practise. Pause to follow a step and replay anything you want to understand better. Each course page shows the recordings available in that course.</p></div> : null}
        <div><BookOpen size={25} aria-hidden="true" /><h3>Learn through examples and practice</h3><p>Work through explanations, realistic examples and questions with feedback. The agent courses also include illustrated lessons, practice files and a workbook for your project.</p></div><div><ClipboardCheck size={25} aria-hidden="true" /><h3>Check your understanding and improve your work</h3><p>Self-paced courses include lesson checks and a scenario assessment. In agent courses, submit your written project for assessment, receive feedback and download or receive your report by email.</p></div><div><FileCheck2 size={25} aria-hidden="true" /><h3>Keep a record of your learning</h3><p>Meet the course’s assessment requirements to earn an Experrt certificate with a record that can be verified. Your practical work gives you a specific example to discuss with a manager or client.</p></div></div>
      <div className="academy-introduction-bottom"><p>Learn when it suits you, with progress or notes saved to your account and 12 months of access to purchased self-paced courses. For a group, explore team places or enquire about a live course.</p><Link href="/courses">Explore the Academy <ArrowRight size={18} aria-hidden="true" /></Link></div>
    </div></section>;
}
