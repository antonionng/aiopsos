"use client";

import Image from "next/image";
import { useState } from "react";
import { agentCourseBlueprints, AGENT_COURSE_PRICE_GBP } from "@/lib/always-on-agents/catalogue";
import { briefFields, emptyBrief, exportAgentWorkbook, foundationModules, type AgentBrief } from "@/lib/always-on-agents/foundations-preview";

export function AgentCoursePreview() {
  const [selected, setSelected] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [brief, setBrief] = useState<AgentBrief>({ ...emptyBrief });
  const [downloaded, setDownloaded] = useState(false);
  const lesson = foundationModules[selected];
  const answer = answers[lesson.id];
  const scene = selected < 3
    ? { src: "/courses/always-on-agents/northstar-planning.png", alt: "Illustration of the fictional Northstar Studio team planning a recurring reporting task with an AI agent." }
    : { src: "/courses/always-on-agents/northstar-review.png", alt: "Illustration of a Northstar Studio reviewer comparing an agent-prepared report with the original project records." };
  const answered = foundationModules.filter(item => answers[item.id] !== undefined).length;
  const correct = foundationModules.filter(item => item.choices[answers[item.id]]?.best).length;
  const fieldsComplete = briefFields.filter(field => brief[field.key].trim()).length;

  function downloadWorkbook() {
    const url = URL.createObjectURL(new Blob([exportAgentWorkbook(brief)], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "experrt-agent-foundations-workbook.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }

  function selectModule(index: number) {
    setSelected(index);
    document.getElementById("agent-lesson-title")?.focus();
  }

  return <div className="agent-preview">
    <header className="agent-preview-hero">
      <div className="agent-hero-copy">
      <p className="agent-eyebrow">EXPERRT ACADEMY / INTRODUCTORY COURSE PREVIEW</p>
      <h1>Learn the foundations of <em>working with always-on AI agents.</em></h1>
      <p className="agent-lead">Always-on AI agents can continue working on agreed tasks between your conversations with them. This introductory preview is for people who are new to these tools and want to learn how to choose suitable tasks, write clear instructions, check the results and respond when something goes wrong.</p>
      <div className="agent-hero-facts"><span>Six introductory lessons</span><span>No previous agent experience needed</span><span>Create a brief for your own task</span></div>
      <p className="agent-preview-note">You can try the lessons below without enrolling or connecting an AI tool. The full courses are still being developed. Your answers and written work are not saved when you leave or reload this page, so download the workbook if you would like to keep them.</p>
      </div>
      <figure className="agent-hero-art"><Image src="/courses/always-on-agents/agent-collaboration.png" alt="Editorial illustration of a professional working with an AI agent that organises documents, schedules and reports for human review." width={1536} height={1024} sizes="(max-width: 850px) 100vw, 42vw" priority /><figcaption>Learn how to delegate ongoing work while remaining responsible for the result.</figcaption></figure>
    </header>

    <section className="agent-preview-orientation" aria-labelledby="agent-preview-how"><h2 id="agent-preview-how">How to use this course preview</h2><p>Start with the first lesson, or choose a topic from the lesson list. Each lesson explains a principle, shows how it applies in a fictional business and asks you to make a decision. After reading the feedback, use the practical exercise to develop your own instructions in the brief builder further down the page.</p><p>Throughout the preview, Northstar Studio is a fictional design business. Its project tracker is a table recording each project’s owner, deadline and status. We use this example to show how an agent could prepare a weekly report while a person remains responsible for checking and sharing it.</p><a href="#agent-lesson-title">Start the first lesson ↓</a></section>

    <section className="agent-learning-shell" aria-label="Foundations interactive sample">
      <aside className="agent-outline">
        <p className="agent-eyebrow">INTRODUCTION TO WORKING WITH AGENTS</p>
        <h2>Choose a lesson</h2>
        <label htmlFor="agent-practice-progress">You have answered a practice question in {answered} of the 6 lessons.</label>
        <progress id="agent-practice-progress" value={answered} max={6} />
        <nav aria-label="Sample lessons">{foundationModules.map((item, index) => <button key={item.id} onClick={() => selectModule(index)} aria-current={selected === index ? "step" : undefined}>
          <span className="agent-step-number">{String(index + 1).padStart(2, "0")}</span>
          <span>{item.title}<small>{answers[item.id] !== undefined ? "Practice question answered" : "Explanation, example and practice question"}</small></span>
        </button>)}</nav>
        <div className="agent-practice-summary"><strong>{correct} of 6 practice questions currently answered correctly</strong><p>You can change an answer after reading the feedback. These questions help you practise your decisions; the full course will also assess how you apply the skills in a practical project.</p></div>
      </aside>

      <article className="agent-lesson">
        <p className="agent-eyebrow">LESSON {selected + 1} OF 6</p>
        <h2 id="agent-lesson-title" tabIndex={-1}>{lesson.title}</h2>
        <p className="agent-outcome">By the end of this lesson, you should be able to {lesson.outcome.charAt(0).toLowerCase() + lesson.outcome.slice(1)}</p>
        <figure><Image src={lesson.image} alt={lesson.alt} width={1100} height={340} sizes="(max-width: 850px) 100vw, 75vw" /><figcaption>{lesson.alt}</figcaption></figure>
        <p>{lesson.concept}</p>
        <div className="agent-worked-example"><div className="agent-example-illustration"><Image src={scene.src} alt={scene.alt} width={1536} height={1024} sizes="(max-width: 850px) 100vw, 58vw" /><span>Illustrated case study · Fictional business</span></div><div className="agent-example-copy"><span className="agent-eyebrow">A WORKED EXAMPLE</span><h3>How this applies at Northstar Studio</h3><p>{lesson.example}</p></div></div>
        <details className="agent-deeper"><summary>Read more about the reasoning behind this approach</summary><p>{lesson.deeper}</p></details>

        <fieldset className="agent-scenario">
          <legend>Practice question: applying this lesson</legend>
          <p>{lesson.scenario}</p><p className="agent-question-help">Choose the response you would use in this situation. You will receive an explanation of your choice, and you can try another answer afterwards.</p>
          <div className="agent-choices">{lesson.choices.map((choice, index) => <label key={choice.text} className={answer === index ? "selected" : ""}>
            <input type="radio" name={`scenario-${lesson.id}`} checked={answer === index} onChange={() => setAnswers(previous => ({ ...previous, [lesson.id]: index }))} />
            <span>{choice.text}</span>
          </label>)}</div>
          {answer !== undefined && <div role="status" className={`agent-feedback ${lesson.choices[answer].best ? "agent-feedback-best" : ""}`}><strong>{lesson.choices[answer].best ? "This is the recommended approach." : "Why this approach needs reconsidering"}</strong><p>{lesson.choices[answer].feedback}</p></div>}
        </fieldset>

        <section className="agent-lab"><p className="agent-eyebrow">APPLY WHAT YOU HAVE LEARNED</p><h3>Practise with a task of your own</h3><p>{lesson.lab}</p><p><strong>What to record in your workbook:</strong> {lesson.evidence}</p><a href="#agent-brief-builder">Write your instructions in the brief builder below ↓</a></section>
        <div className="agent-lesson-actions"><button disabled={selected === 0} onClick={() => selectModule(selected - 1)}>Previous lesson</button>{selected < foundationModules.length - 1 ? <button onClick={() => selectModule(selected + 1)}>Next lesson →</button> : <a href="#agent-brief-builder">Continue to the brief builder →</a>}</div>
      </article>
    </section>

    <section id="agent-brief-builder" className="agent-builder">
      <div><p className="agent-eyebrow">WRITE INSTRUCTIONS FOR YOUR AGENT</p><h2>Create a clear brief for a task you want to delegate</h2><p>An agent brief is a set of instructions explaining the work you want done, the information the agent should use and the limits it must follow. Use the questions below to draft a brief for your own task, or practise with the fictional Northstar Studio example. You can download your answers with the lesson exercises in a workbook. Use sample information rather than private business records, passwords or access keys.</p></div>
      <div className="agent-brief-grid">{briefFields.map(field => <div key={field.key}><label htmlFor={`agent-brief-${field.key}`}>{field.label}</label><p id={`agent-hint-${field.key}`}>{field.hint}</p><textarea id={`agent-brief-${field.key}`} aria-describedby={`agent-hint-${field.key}`} value={brief[field.key]} maxLength={4000} rows={4} onChange={event => {setBrief(previous => ({ ...previous, [field.key]: event.target.value })); setDownloaded(false);}} /></div>)}</div>
      <div className="agent-export"><span>You have added notes to {fieldsComplete} of the 8 sections. Use the lesson examples to review whether your instructions are clear enough for someone else to follow.</span><button onClick={downloadWorkbook}>Download your brief and practice workbook ↓</button></div>
      {downloaded && <p role="status">Your workbook download has been requested. It contains your brief, the practical exercises and a table for recording your checks. The download saves a copy of your work for you; it does not send it to an assessor.</p>}
    </section>

    <section className="agent-assessment"><p className="agent-eyebrow">HOW ASSESSMENT WILL WORK IN THE FULL COURSES</p><h2>Show how you can apply what you have learned</h2><p>In the full courses, you will complete a practical project and explain how you checked its results, handled a problem and measured its usefulness. An Experrt reviewer will assess your work against the six skill areas below and ask you to explain a decision or adapt your project to a changed situation. If a skill needs further work, you will receive feedback and an opportunity to improve your submission.</p><div>{["Choosing and describing the task", "Setting permissions", "Making the workflow work", "Checking the results", "Handling failures", "Measuring value and explaining the process"].map(skill => <span key={skill}>{skill}</span>)}</div><p>The planned Experrt certificate will be awarded when your practical work meets the requirements in all six areas. It will record the skills assessed by Experrt and will not represent an externally accredited qualification. This introductory preview provides practice only; it does not include assessment or award a certificate.</p></section>

    <section className="agent-catalogue"><p className="agent-eyebrow">EXPLORE THE COURSES WE ARE DEVELOPING</p><h2>Continue learning with a course suited to your work</h2><p>We are developing separate courses for individual agent platforms and for specific types of work, such as research, content production and small business operations. Each proposed course includes six modules and a final practical project. The planned price is £{AGENT_COURSE_PRICE_GBP} per course; enrolment is not yet available.</p><div className="agent-course-grid">{agentCourseBlueprints.map(course => <article key={course.slug}><span className="agent-eyebrow">PROPOSED COURSE / £99 PLANNED PRICE</span><h3>{course.title}</h3><p>{course.audience}</p><details><summary>See what the six modules will cover</summary><ol>{course.modules.map(item => <li key={item.title}><strong>{item.title}</strong><p>What you will produce: {item.evidence}</p></li>)}</ol><p><strong>Before you start:</strong> {course.prerequisites}</p></details><p className="agent-capstone"><strong>Your final project</strong>{course.capstone}</p></article>)}</div></section>
  </div>;
}
