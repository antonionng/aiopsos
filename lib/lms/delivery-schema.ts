import { z } from "zod";

export const stages = ["baseline", "core", "pathway_a", "pathway_b", "capstone"] as const;
export const stageLabels: Record<(typeof stages)[number], string> = {
  baseline: "Entry assessment", core: "Common foundation", pathway_a: "Pathway A",
  pathway_b: "Pathway B", capstone: "Final project",
};
const criterion = z.object({ id: z.string().uuid(), skill: z.string().trim().min(2).max(100), description: z.string().trim().min(3).max(1000), weight: z.number().int().min(1).max(100).optional() });
export const deliveryPlanSchema = z.object({
  brief: z.string().trim().min(10).max(6000),
  targetRoles: z.string().trim().min(3).max(2000),
  hours: z.number().int().min(1).max(2000),
  labUrl: z.string().url().refine(v => v.startsWith("https://"), "Use an HTTPS lab link").or(z.literal("")),
  minimumPanelReviews: z.number().int().min(1).max(5),
  activities: z.array(z.object({
    id: z.string().uuid(), stage: z.enum(stages),
    passPercent: z.number().int().min(1).max(100),
    criteria: z.array(criterion).max(20),
  })).min(1).max(800),
}).superRefine((v, ctx) => {
  if (new Set(v.activities.map(a => a.id)).size !== v.activities.length)
    ctx.addIssue({ code: "custom", message: "An activity may appear only once." });
  for (const a of v.activities) if (new Set(a.criteria.map(c => c.id)).size !== a.criteria.length)
    ctx.addIssue({ code: "custom", message: "Criteria must have unique identifiers." });
});
export type DeliveryPlan = z.infer<typeof deliveryPlanSchema>;
export const deliveryCommandSchema = z.discriminatedUnion("action", [
  z.object({action:z.literal("ai.publish"),ai_review_id:z.string().uuid(),progress_id:z.string().uuid(),revision:z.number().int().positive(),
    scores:z.record(z.string().uuid(),z.number().int().min(0).max(4)),feedback:z.string().trim().min(10).max(4000),observation_context:z.string().trim().max(2000).default(""),decision:z.enum(["passed","returned"])}),
  z.object({action:z.literal("session.create"),cohort_id:z.string().uuid(),title:z.string().trim().min(3).max(180),starts_at:z.string().datetime(),ends_at:z.string().datetime(),join_url:z.string().url().refine(v=>v.startsWith("https://"),"Use an HTTPS meeting link").or(z.literal(""))}),
  z.object({action:z.literal("attendance.save"),session_id:z.string().uuid(),enrolment_id:z.string().uuid(),status:z.enum(["present","late","absent","excused"]),expected_status:z.enum(["present","late","absent","excused"]).nullable()}),
  z.object({ action: z.literal("plan.save"), revision: z.number().int().min(0), plan: deliveryPlanSchema }),
  z.object({ action: z.literal("plan.approve"), revision: z.number().int().positive() }),
  z.object({ action: z.literal("plan.release"), revision: z.number().int().positive() }),
  z.object({ action: z.literal("staff.invite"), email: z.string().email(), role: z.enum(["trainer", "reviewer"]) }),
  z.object({ action: z.literal("staff.accept") }),
  z.object({ action: z.literal("staff.revoke"), user_id: z.string().uuid() }),
  z.object({ action: z.literal("review"), progress_id: z.string().uuid(), revision: z.number().int().positive(),
    scores: z.record(z.string().uuid(), z.number().int().min(0).max(4)),
    feedback: z.string().trim().min(10).max(4000), observation_context: z.string().trim().max(2000).default(""),
    decision: z.enum(["passed", "returned", "panel"]),
  }),
  z.object({ action: z.literal("decision"), assignment_id: z.string().uuid(),
    kind: z.enum(["pathway_a", "pathway_b", "ready", "support"]),
    reason: z.string().trim().min(10).max(4000),
  }),
]);
export type DeliveryCommand = z.infer<typeof deliveryCommandSchema>;
export type DeliveryActivity = { id: string; title: string; kind: string; content: string; criteria: string; course_title: string };
export type DeliveryRecord = {
  id: string; user_id: string; name: string; completed_at: string | null;
  progress: { id: string; activity_id: string; state: string; revision: number; answer: string; feedback: string; updated_at: string }[];
  history: { id: string; action: string; actor_id: string; created_at: string; snapshot: {activity_id: string; state: string; answer: string; feedback: string; scores?: Record<string, number>; files?: string[]} }[];
  files: {id: string; activity_id: string; name: string; bytes: number; sha256: string; attempt_id: string | null; created_at: string}[];
  reviews: {id: string; activity_id: string; revision: number; reviewer_id: string; scores: Record<string, number>; feedback: string; kind: string; created_at: string}[];
  decisions: {id: string; kind: string; reason: string; actor_id: string; created_at: string}[];
};
export type DeliveryWorkspace = {
  viewer_id?: string;
  programme: {id: string; title: string; goal: string; status: string; client_org_id: string | null};
  role: "manager" | "client" | "trainer" | "reviewer" | "learner";
  plan: {revision: number; content: DeliveryPlan; released_at: string | null; provider_approved_by: string | null; client_approved_by: string | null} | null;
  activities: DeliveryActivity[];
  records: DeliveryRecord[];
  staff: {user_id: string; name: string; role: string; state: string}[];
};

export function skillResults(record: DeliveryRecord, plan: DeliveryPlan) {
  const results = new Map<string, {skill: string; baseline: number[]; final: number[]; evidence: string[]}>();
  for (const activity of plan.activities) {
    if (!["baseline", "capstone"].includes(activity.stage)) continue;
    const current = record.progress.find(p => p.activity_id === activity.id);
    if (!current || !["passed", "returned"].includes(current.state)) continue;
    const review = record.history.filter(h => h.action === "learning.review" && h.snapshot.activity_id === activity.id).at(-1);
    if (!review?.snapshot.scores) continue;
    for (const c of activity.criteria) {
      const score = review.snapshot.scores[c.id];
      if (typeof score !== "number") continue;
      const key = c.skill.trim().toLowerCase();
      const item = results.get(key) || {skill: c.skill, baseline: [], final: [], evidence: []};
      item[activity.stage === "baseline" ? "baseline" : "final"].push(score * 25);
      item.evidence.push(review.id); results.set(key, item);
    }
  }
  const mean = (values: number[]) => values.length ? Math.round(values.reduce((a,b) => a+b, 0) / values.length) : null;
  return [...results.values()].map(r => ({skill: r.skill, baseline: mean(r.baseline), final: mean(r.final), evidence: r.evidence,
    change: r.baseline.length && r.final.length ? mean(r.final)! - mean(r.baseline)! : null}));
}

export function deliveryInsights(record: DeliveryRecord, plan: DeliveryPlan) {
  const items: {label: string; evidence: string[]}[] = [];
  const pending = record.progress.filter(p => p.state === "submitted");
  const returned = record.progress.filter(p => p.state === "returned" && !plan.activities.some(a => a.id === p.activity_id && a.stage === "baseline"));
  if (pending.length) items.push({label: `${pending.length} submissions need trainer review`, evidence: pending.map(p => p.id)});
  if (returned.length) items.push({label: `${returned.length} ${returned.length === 1 ? "activity needs" : "activities need"} another attempt`, evidence: returned.map(p => p.id)});
  for (const s of skillResults(record, plan)) if (s.change !== null)
    items.push({label: `${s.skill}: ${s.change >= 0 ? "+" : ""}${s.change} percentage points from entry to final assessment`, evidence: s.evidence});
  if (!items.length) items.push({label: "No intervention or comparable skill change is evidenced yet", evidence: []});
  return items;
}
