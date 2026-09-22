import { NextResponse } from "next/server";
import { isSelfServeEnabled } from "@/lib/self-serve/flag";
import { findEntitledPurchase } from "@/lib/self-serve/access";
import { canSign, courseArtefact } from "@/lib/self-serve/engine";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { sendSelfServeCompleted } from "@/lib/email";
import {
  loadProgress,
  ownedCourseSlugs,
  saveProgress,
  signProgress,
} from "@/lib/self-serve/records";
import type { CourseProgress } from "@/lib/self-serve/types";

async function entitled(slug: string) {
  return findEntitledPurchase(slug);
}

export async function GET(req: Request) {
  if (!isSelfServeEnabled()) {
    return NextResponse.json({ detail: "Not found." }, { status: 404 });
  }
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  const purchase = await entitled(slug);
  if (!purchase) {
    return NextResponse.json({ detail: "Buy the course to continue." }, { status: 401 });
  }
  return NextResponse.json({ progress: await loadProgress(purchase.id) });
}

export async function POST(req: Request) {
  if (!isSelfServeEnabled()) {
    return NextResponse.json({ detail: "Not found." }, { status: 404 });
  }

  let body: { slug?: string; progress?: CourseProgress; sign?: boolean };
  try {
    body = (await req.json()) as { slug?: string; progress?: CourseProgress; sign?: boolean };
  } catch {
    return NextResponse.json({ detail: "The progress could not be read." }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const course = getSelfServeCourse(slug);
  const purchase = await entitled(slug);
  if (!purchase || !course?.lessons) {
    return NextResponse.json({ detail: "Buy the course to continue." }, { status: 401 });
  }

  const incoming = body.progress;
  if (!incoming || typeof incoming !== "object" || !incoming.lessons) {
    return NextResponse.json({ detail: "The progress could not be read." }, { status: 400 });
  }

  if (body.sign) {
    const name = incoming.signedName ?? "";
    if (!canSign(course.lessons, incoming, name)) {
      return NextResponse.json(
        { detail: "Sign after every check has passed, using your name." },
        { status: 400 }
      );
    }
    const before = await loadProgress(purchase.id);
    const signed = await signProgress(
      purchase.id,
      {
        ...incoming,
        signedName: name.trim(),
      },
      course
    );
    if (!before.signedAt && signed.signedAt && signed.ref && purchase.email) {
      try {
        await sendSelfServeCompleted({
          email: purchase.email,
          name: signed.signedName ?? name.trim(),
          courseSlug: course.slug,
          courseTitle: course.title,
          artefactTitle: courseArtefact(course)?.title ?? "final work",
          certificateRef: signed.ref,
          signedAt: signed.signedAt,
          owned: await ownedCourseSlugs(purchase.email),
        });
      } catch (error) {
        console.error("[self-serve] completion mail", error);
      }
    }
    return NextResponse.json({ progress: signed });
  }

  const current = await loadProgress(purchase.id);
  const next: CourseProgress = {
    lessons: incoming.lessons,
    signedName: current.signedName,
    signedAt: current.signedAt,
    ref: current.ref,
  };
  return NextResponse.json({ progress: await saveProgress(purchase.id, next, course) });
}
