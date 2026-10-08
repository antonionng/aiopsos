import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { LearningError } from "@/lib/lms/server";
import { getAgentMarketingCourse } from "./marketing";

export function agentCourseSalesEnabled() {
  return process.env.AGENT_COURSE_COMMERCE_ENABLED === "true";
}

export async function getAgentCourseOffer(slug: string) {
  if (!agentCourseSalesEnabled() || !getAgentMarketingCourse(slug)) return null;
  const { data, error } = await supabaseAdmin
    .from("agent_course_offers")
    .select("slug,title,amount,currency,terms_version,terms_url")
    .eq("slug", slug)
    .eq("active", true)
    .eq("assessment_ready", true)
    .maybeSingle();
  if (error)
    throw new LearningError(
      "Course availability could not be checked. Please try again.",
      503,
    );
  return data;
}

export type AgentCourseOrder = {
  id: string;
  course_slug: string;
  user_id: string;
  org_id: string;
  payment_id: string;
  title: string;
  amount: number;
  currency: string;
  status: "pending" | "captured" | "failed" | "voided" | "refunded";
  payment_provider: "mooov" | "stripe";
  stripe_session_id?: string | null;
  hosted_url: string | null;
  assignment_id: string | null;
  assessment_mode?: "human" | "ai";
};

export function courseCommerceError(error: { code?: string; message: string }) {
  return new LearningError(
    ["PGRST202", "42P01"].includes(error.code || "")
      ? "Course enrolment has not been enabled yet."
      : error.message,
    error.code === "42501"
      ? 403
      : error.code === "P0002"
        ? 404
        : error.code === "PT409"
          ? 409
          : 503,
  );
}

export async function getAgentCourseOffers() {
  if (!agentCourseSalesEnabled()) return [];
  const {data,error}=await supabaseAdmin.from("agent_course_offers").select("slug,title,amount,currency,terms_version,terms_url").eq("active",true).eq("assessment_ready",true);
  if(error)throw new LearningError("Course availability could not be checked.",503);
  return (data||[]).filter(offer=>getAgentMarketingCourse(offer.slug));
}
