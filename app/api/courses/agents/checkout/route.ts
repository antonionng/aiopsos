import { NextResponse } from "next/server";
import { z } from "zod";
import {
  learningActor,
  LearningError,
  learningErrorResponse,
} from "@/lib/lms/server";
import {
  agentCourseSalesEnabled,
  courseCommerceError,
  type AgentCourseOrder,
} from "@/lib/always-on-agents/commerce";
import { getAgentMarketingCourse } from "@/lib/always-on-agents/marketing";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  createStripeCheckout,
  CheckoutExpiredError,
} from "@/lib/stripe-checkout";
import { rateLimit } from "@/lib/rate-limit";
import { getActor } from "@/lib/cohorts";
import { guestToken, guestHash } from "@/lib/always-on-agents/guest-checkout";

export const dynamic = "force-dynamic";
const bodySchema = z
  .object({
    slug: z.string().max(100),
    terms_version: z.string().min(1).max(100),
  })
  .strict();
export async function POST(request: Request) {
  try {
    if (!agentCourseSalesEnabled())
      throw new LearningError(
        "These courses are not yet available to buy.",
        409,
      );
    const identity = await getActor();
    const actor = identity?.orgId ? await learningActor() : null;
    if (
      !rateLimit(`agent-course-checkout:${actor?.userId ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "guest"}`, {
        limit: 10,
        windowMs: 60000,
      }).success
    )
      throw new LearningError("Please wait a moment before trying again.", 429);
    const key = z
      .string()
      .uuid()
      .safeParse(request.headers.get("Idempotency-Key"));
    if (!key.success)
      throw new LearningError("A unique purchase request is required.");
    const raw = await request.text();
    if (raw.length > 2000)
      throw new LearningError("This purchase request is too large.", 413);
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      throw new LearningError("The purchase request could not be read.");
    }
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success || !getAgentMarketingCourse(parsed.data.slug))
      throw new LearningError("Choose an available course.");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl)
      throw new LearningError("Course checkout is not configured yet.", 503);
    const base = new URL(baseUrl);
    if (
      base.protocol !== "https:" &&
      !(
        process.env.NODE_ENV !== "production" &&
        ["localhost", "127.0.0.1"].includes(base.hostname)
      )
    )
      throw new LearningError(
        "Course checkout needs a secure return address.",
        503,
      );
    if (!actor) {
      const token = await guestToken(true);
      const { data: guest, error: reserveError } = await supabaseAdmin.rpc("agent_course_guest_reserve", { p_slug: parsed.data.slug, p_request: key.data, p_hash: guestHash(token), p_terms: parsed.data.terms_version });
      if (reserveError) throw courseCommerceError(reserveError);
      if (guest.status === "paid") return NextResponse.json({ learning_url: `/courses/agents/welcome?order=${guest.id}` });
      if (guest.status !== "pending") return NextResponse.json({ error: "This checkout has ended. Please try again.", code: "checkout_expired" }, { status: 409 });
      try {
        const session = await createStripeCheckout({ paymentId: guest.payment_id, purpose: "agent_course", amount: guest.amount, currency: guest.currency, title: guest.title, sessionId: guest.stripe_session_id,
          successUrl: `${base.origin}/api/courses/agents/claim?order=${guest.id}&session_id={CHECKOUT_SESSION_ID}`, cancelUrl: `${base.origin}/courses/agents/${guest.course_slug}`, termsUrl: `${base.origin}/course-terms` });
        const { error: saveError } = await supabaseAdmin.from("agent_course_guest_checkouts").update({ stripe_session_id: session.id, hosted_url: session.url }).eq("id", guest.id);
        if (saveError) throw new LearningError("Checkout could not be saved. Please retry.", 503);
        return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
      } catch (error) {
        if (error instanceof CheckoutExpiredError) {
          await supabaseAdmin.from("agent_course_guest_checkouts").update({ status: "voided" }).eq("id", guest.id).eq("status", "pending");
          return NextResponse.json({ error: error.message, code: "checkout_expired" }, { status: 409 });
        }
        throw error;
      }
    }
    const { data, error } = await supabaseAdmin.rpc(
      "agent_course_reserve_order",
      {
        p_actor: actor.userId,
        p_org: actor.orgId,
        p_slug: parsed.data.slug,
        p_request: key.data,
        p_terms: parsed.data.terms_version,
        p_provider: "stripe",
      },
    );
    if (error) throw courseCommerceError(error);
    const order = data as AgentCourseOrder;
    if (order.status === "captured" && order.assignment_id)
      return NextResponse.json({
        learning_url: order.assessment_mode === "ai" ? `/courses/agents/learn/${order.id}` : `/dashboard/learn/${order.assignment_id}`,
      });
    if (order.status !== "pending")
      throw new LearningError(
        "This payment attempt has ended. Return to the course page to try again.",
        409,
      );
    if (order.payment_provider !== "stripe") {
      if (order.hosted_url)
        return NextResponse.json({ url: order.hosted_url, order_id: order.id });
      throw new LearningError(
        "An earlier payment request needs to be resolved before starting a new checkout.",
        409,
      );
    }
    // The stable order reference is Stripe's idempotency key on every retry.
    let session;
    try {
      session = await createStripeCheckout({
        paymentId: order.payment_id,
        purpose: "agent_course",
        amount: order.amount,
        currency: order.currency,
        title: order.title,
        sessionId: order.stripe_session_id,
        successUrl: `${base.origin}/courses/agents/checkout/${order.id}`,
        cancelUrl: `${base.origin}/courses/agents/${order.course_slug}`,
        termsUrl: `${base.origin}/course-terms`,
      });
    } catch (error) {
      if (error instanceof CheckoutExpiredError) {
        const { error: updateError } = await supabaseAdmin
          .from("agent_course_orders")
          .update({ status: "voided" })
          .eq("id", order.id)
          .eq("status", "pending");
        if (updateError)
          throw new LearningError(
            "The expired checkout could not be updated. Please retry.",
            503,
          );
        return NextResponse.json(
          { error: error.message, code: "checkout_expired" },
          { status: 409 },
        );
      }
      throw error;
    }
    const url = session.url;
    const { error: saveError } = await supabaseAdmin
      .from("agent_course_orders")
      .update({ hosted_url: url, stripe_session_id: session.id })
      .eq("id", order.id);
    if (saveError)
      throw new LearningError(
        "Checkout could not be saved. Please retry; the same payment request will be used.",
        503,
      );
    return NextResponse.json(
      { url, order_id: order.id },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return learningErrorResponse(error);
  }
}
