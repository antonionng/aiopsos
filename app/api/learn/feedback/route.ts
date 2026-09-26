import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getLanguageModel } from "@/lib/model-router";
import { isSelfServeEnabled } from "@/lib/self-serve/flag";
import { findEntitledPurchase } from "@/lib/self-serve/access";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { evaluateCheck } from "@/lib/self-serve/engine";
import type { LessonAnswer, LessonCheck } from "@/lib/self-serve/types";

const MAX_ANSWER = 6000;

function describeTask(check: LessonCheck): string {
  const lines = [`Task: ${check.prompt}`];
  if (check.material) lines.push(`${check.material.label}: ${check.material.text}`);
  if (check.kind === "build") {
    lines.push(
      "Parts the learner must write:",
      ...check.fields.map((field) => `- ${field.label}: ${field.hint}`)
    );
  }
  if (check.kind === "edit") lines.push(`Starting text the learner was asked to improve: ${check.start}`);
  return lines.join("\n");
}

function describeAnswer(check: LessonCheck, answer: LessonAnswer): string {
  if (check.kind === "build" && answer && typeof answer === "object" && !Array.isArray(answer)) {
    const parts = answer as Record<string, string>;
    return check.fields.map((field) => `${field.label}: ${(parts[field.id] ?? "").trim() || "(blank)"}`).join("\n");
  }
  if (check.kind === "edit" && answer && typeof answer === "object" && "edited" in answer) {
    return String((answer as { edited: string }).edited);
  }
  return JSON.stringify(answer);
}

function tidy(text: string): string {
  return text
    .replace(/\s*[\u2014\u2013]\s*/g, ", ")
    .replace(/\*\*/g, "")
    .replace(/^#+\s*/gm, "")
    .trim();
}

/**
 * Coaching on written work. The pass rules in the engine still decide whether
 * a check passes; this only helps the learner improve the draft.
 */
export async function POST(req: Request) {
  if (!isSelfServeEnabled()) {
    return NextResponse.json({ detail: "Not found." }, { status: 404 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ detail: "Coaching is not available right now." }, { status: 503 });
  }

  let body: { slug?: unknown; lessonId?: unknown; part?: unknown; answer?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "The draft could not be read." }, { status: 400 });
  }
  const slug = typeof body.slug === "string" ? body.slug : "";
  const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";
  const part = body.part === "practice" ? "practice" : "check";
  const course = getSelfServeCourse(slug);
  const lesson = course?.lessons?.find((item) => item.id === lessonId);
  if (!course || !lesson) {
    return NextResponse.json({ detail: "That lesson could not be found." }, { status: 404 });
  }

  const purchase = await findEntitledPurchase(slug);
  if (!purchase) {
    return NextResponse.json({ detail: "Buy the course to get coaching." }, { status: 401 });
  }

  const { rateLimit } = await import("@/lib/rate-limit");
  if (!rateLimit(`learn-coach:${purchase.id}`, { limit: 30, windowMs: 60 * 60_000 }).success) {
    return NextResponse.json(
      { detail: "You have asked for a lot of coaching this hour. Try again a little later." },
      { status: 429 }
    );
  }

  const check = part === "practice" ? lesson.practice.check : lesson.check;
  if (check.kind !== "build" && check.kind !== "edit") {
    return NextResponse.json({ detail: "Coaching is for written work." }, { status: 400 });
  }
  const answer = body.answer as LessonAnswer;
  const written = describeAnswer(check, answer).slice(0, MAX_ANSWER);
  const outcome = evaluateCheck(check, answer);
  const teaching = lesson.sections
    .map((section) => `${section.heading}: ${section.paragraphs.join(" ")}`)
    .join("\n")
    .slice(0, 4000);

  try {
    const { text } = await generateText({
      model: getLanguageModel("gpt-4o"),
      temperature: 0.3,
      maxOutputTokens: 420,
      system: [
        "You are an experienced workplace tutor at Experrt, an enterprise learning academy.",
        "You coach a professional on a piece of written work they produced in a course.",
        "Write in plain British English, in full sentences, as a senior colleague would speak. Do not use em dashes, bullet symbols, headings, emoji, or exclamation marks.",
        "Do not flatter. Do not say 'great job' or similar. Be warm, specific, and direct.",
        "Refer to the learner's actual words. Judge the work only against what the lesson teaches.",
        "Structure the reply as three short paragraphs: what already works and why; the one or two changes that would most improve it, quoting the part to change; and a suggested rewrite of the weakest part.",
        "Keep the whole reply under 170 words. Do not say whether the check is passed; the course decides that.",
      ].join(" "),
      prompt: [
        `Course: ${course.title}`,
        `Lesson: ${lesson.title}`,
        `What the lesson teaches:\n${teaching}`,
        describeTask(check),
        `The learner wrote:\n${written}`,
        `The course's own check currently says: ${outcome.detail || "no result yet"}`,
      ].join("\n\n"),
    });
    return NextResponse.json({ feedback: tidy(text) });
  } catch (error) {
    console.error("[self-serve] coaching", error);
    return NextResponse.json({ detail: "Coaching could not be generated. Try again in a moment." }, { status: 502 });
  }
}
