import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { sendContactAlert } from "@/lib/email";
import { captureInbound } from "@/lib/inbound-capture";
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { currentLearner } from "@/lib/self-serve/access";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { courseHoldings } from "@/lib/self-serve/records";

const FORMATS = { in_person: "In person", online: "Live online", either: "Either" } as const;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  const user = await currentLearner();
  if (!user?.email) {
    return NextResponse.json({ detail: "Sign in to send an enquiry." }, { status: 401 });
  }
  const rl = rateLimit(`learn-enquiry:${user.id}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json(
      { detail: "You have sent several enquiries already. We will be in touch soon." },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = clean(body.name, 200) || (user.user_metadata?.name as string | undefined) || user.email;
  const organisation = clean(body.organisation, 200);
  const format = FORMATS[body.format as keyof typeof FORMATS] ?? FORMATS.either;
  const people = clean(body.people, 40);
  const timing = clean(body.timing, 200);
  const note = clean(body.message, 3000);
  const requested = Array.isArray(body.courses)
    ? body.courses
        .map((slug) => (typeof slug === "string" ? getSelfServeCourse(slug)?.title : undefined))
        .filter((title): title is string => Boolean(title))
        .slice(0, 10)
    : [];
  if (!note && requested.length === 0) {
    return NextResponse.json(
      { detail: "Choose a course or tell us what the session should cover." },
      { status: 400 }
    );
  }

  const holdings = await courseHoldings(user.id, user.email).catch(() => []);
  const taken = holdings
    .map((holding) => getSelfServeCourse(holding.purchase.course_slug)?.title)
    .filter(Boolean);

  const message = [
    "Trainer-led session enquiry from a self-paced learner.",
    `Format: ${format}`,
    people ? `People: ${people}` : "",
    timing ? `Timing: ${timing}` : "",
    requested.length ? `Courses for the session: ${requested.join("; ")}` : "",
    taken.length ? `Courses already taken: ${taken.join("; ")}` : "",
    note ? `\n${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await captureInbound({
      request_id: randomUUID(),
      name,
      email: user.email,
      organisation_name: organisation,
      message,
      source: "dashboard",
      marketing_consent: false,
    });
  } catch (error) {
    console.error("[learn] enquiry save failed", error);
    return NextResponse.json(
      { detail: "We could not send that. Try again, or email hello@experrt.com." },
      { status: 503 }
    );
  }
  try {
    await sendContactAlert({
      name,
      email: user.email,
      message: `${organisation ? `Organisation: ${organisation}\n\n` : ""}${message}`,
    });
  } catch (error) {
    console.error("[learn] enquiry saved; alert failed", error);
  }
  return NextResponse.json({ ok: true });
}
