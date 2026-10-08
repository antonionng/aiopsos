import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { agentCourseBlueprints } from "../lib/always-on-agents/catalogue.ts";
import { getAgentCoursePack } from "../lib/always-on-agents/courses.ts";
import { assessmentSkills } from "../lib/always-on-agents/assessment.ts";
import { deliveryPlanSchema } from "../lib/lms/delivery-schema.ts";

// Registration is additive. It does not open enrolment, release plans or change existing offers.
const apply = process.argv.includes("--apply");
const project = process.argv.find(arg => arg.startsWith("--project="))?.slice(10);
const actor = process.argv.find(arg => arg.startsWith("--actor="))?.slice(8);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!project || !actor || !url || !key || new URL(url).hostname !== `${project}.supabase.co`) {
  throw new Error("Supply an explicit project and author, with matching local Supabase configuration.");
}
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const profile = await db.from("user_profiles").select("id,org_id,role").eq("id", actor).single();
if (profile.error) throw new Error(`The author could not be checked: ${profile.error.message}`);
if (profile.data.role !== "super_admin" || !profile.data.org_id) {
  throw new Error("Registration requires a verified platform author with a current workspace.");
}
const org = profile.data.org_id;
const access = await db.rpc("lms_assert_workspace", { p_actor: actor, p_org: org, p_manager: true });
if (access.error) throw new Error(access.error.message);
function identity(value: string) {
  const hex = createHash("sha256").update(value).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(",")}}`;
  return JSON.stringify(value);
}
async function checked<T>(request: PromiseLike<{ data: T; error: { message: string } | null }>): Promise<T> {
  const result = await request;
  if (result.error) throw new Error(result.error.message);
  return result.data;
}
for (const blueprint of agentCourseBlueprints) {
  const pack = getAgentCoursePack(blueprint.slug)!;
  const plan = deliveryPlanSchema.parse({
    brief: `${pack.project}\n\nThis course uses the dedicated AI project assessment. Every one of the six skills must score at least 3/4. An overall weighted score does not issue an agent-course certificate. The delivery plan remains unreleased while enrolment is being checked.`,
    targetRoles: pack.audience, hours: Math.ceil(pack.minutes / 60), labUrl: "", minimumPanelReviews: 1,
    activities: pack.content.activities.map((activity, index) => ({
      id: activity.id, stage: index === 34 ? "capstone" : "core", passPercent: 75,
      criteria: index === 34 ? assessmentSkills.map(skill => ({
        id: identity(`${activity.id}:${skill.id}`), skill: skill.title, description: skill.requirement,
      })) : activity.kind === "practice" ? [{
        id: identity(`${activity.id}:practice`), skill: "Explain and check your work",
        description: pack.modules[Math.floor(index / 6)].expected.slice(0, 1000),
      }] : [],
    })),
  });
  const offer = await checked(db.from("agent_course_offers").select("slug,learning_pack").eq("slug", pack.slug).maybeSingle());
  if (offer) {
    if (canonical(offer.learning_pack) !== canonical(pack)) throw new Error(`Existing offer differs: ${pack.slug}. Review a version update explicitly.`);
    console.log(`Already registered: ${pack.slug}`);
    continue;
  }
  if (!apply) { console.log(`Validated registration: ${pack.slug}`); continue; }
  let course = await checked(db.from("lms_courses").select("id,content").eq("org_id", org).eq("content->>title", pack.title).maybeSingle());
  if (course && canonical(course.content) !== canonical(pack.content)) throw new Error(`Existing draft differs: ${pack.slug}`);
  if (!course) course = await checked(db.from("lms_courses").insert({ org_id: org, created_by: actor, content: pack.content }).select("id,content").single());
  if (!course) throw new Error(`Draft registration returned no record: ${pack.slug}`);
  let version = await checked(db.from("lms_course_versions").select("id,content").eq("course_id", course.id).eq("version", 1).maybeSingle());
  if (version && canonical(version.content) !== canonical(pack.content)) throw new Error(`Published version differs: ${pack.slug}`);
  if (!version) version = await checked(db.from("lms_course_versions").insert({ course_id: course.id, org_id: org, created_by: actor, version: 1, content: pack.content }).select("id,content").single());
  if (!version) throw new Error(`Version registration returned no record: ${pack.slug}`);
  let programme = await checked(db.from("lms_programmes").select("id,version_ids").eq("org_id", org).eq("title", `Agent course template: ${pack.title}`).is("client_org_id", null).maybeSingle());
  if (programme && canonical(programme.version_ids) !== canonical([version.id])) throw new Error(`Template version differs: ${pack.slug}`);
  if (!programme) programme = await checked(db.from("lms_programmes").insert({ org_id: org, created_by: actor, title: `Agent course template: ${pack.title}`, goal: pack.project, version_ids: [version.id] }).select("id,version_ids").single());
  if (!programme) throw new Error(`Template registration returned no record: ${pack.slug}`);
  const existingPlan = await checked(db.from("lms_delivery_plans").select("content").eq("programme_id", programme.id).maybeSingle());
  if (existingPlan && canonical(existingPlan.content) !== canonical(plan)) throw new Error(`Delivery plan differs: ${pack.slug}`);
  if (!existingPlan) await checked(db.from("lms_delivery_plans").insert({ programme_id: programme.id, content: plan, updated_by: actor }));
  await checked(db.from("agent_course_offers").insert({
    slug: pack.slug, title: pack.title, version_id: version.id, template_programme_id: programme.id,
    amount: 9900, currency: "GBP", terms_version: "2026-10-02-agent-ai-v1",
    terms_url: "https://www.experrt.com/course-terms", assessment_mode: "ai", learning_pack: pack,
    assessment_ready: true, active: false,
  }));
  console.log(`Registered with enrolment closed: ${pack.slug}`);
}
