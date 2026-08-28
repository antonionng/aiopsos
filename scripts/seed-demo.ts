/**
 * Seed Antonio's organisation with a realistic, story-shaped demo dataset:
 * departments, people, assessments (maturity + training-needs), cohorts on
 * real published courses with sessions/attendance/submissions/trainer
 * grades/certificates, and 60 days of usage logs.
 *
 * Run:   node --experimental-strip-types scripts/seed-demo.ts
 * Purge: node --experimental-strip-types scripts/seed-demo.ts --purge
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 *
 * Every seeded person lives at @demo.experrt.com and carries
 * preferences.demo=true; created row ids are written to
 * scripts/.seed-manifest.json so --purge removes exactly what was created.
 * The story the numbers tell: Engineering is strong, Finance is weak but
 * improving after their cohort completed, usage climbs after training.
 */

import { createClient } from "@supabase/supabase-js";
import { randomBytes, randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";

const OWNER_EMAIL = "ag@experrt.com";
const DEMO_DOMAIN = "demo.experrt.com";
const MANIFEST = new URL("./.seed-manifest.json", import.meta.url).pathname;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

// Deterministic PRNG so re-runs shape the same story.
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260826);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const between = (lo: number, hi: number) => lo + rand() * (hi - lo);
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);

const REF_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function certRef(): string {
  const bytes = randomBytes(10);
  let ref = "";
  for (let i = 0; i < 10; i++) ref += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  return ref;
}

const DEPARTMENTS = [
  { name: "Engineering", type: "engineering", strength: 3.9, headcount: 7 },
  { name: "Operations", type: "operations", strength: 2.6, headcount: 7 },
  { name: "Finance", type: "finance", strength: 1.7, headcount: 5 },
  { name: "Marketing", type: "marketing", strength: 2.9, headcount: 6 },
  { name: "Customer Support", type: "support", strength: 2.2, headcount: 5 },
];

const FIRST = ["Amara", "Ben", "Chloe", "Daniel", "Efe", "Fatima", "George", "Hana", "Idris", "Jasmine", "Kofi", "Leila", "Marcus", "Nadia", "Oliver", "Priya", "Quentin", "Rosa", "Sam", "Tara", "Umar", "Vera", "Will", "Xena", "Yusuf", "Zara", "Aled", "Bella", "Cian", "Dina"];
const LAST = ["Okafor", "Hughes", "Zhang", "Petrov", "Ademola", "Khan", "Bailey", "Sato", "Diallo", "Novak", "Mensah", "Haddad", "Reid", "Iqbal", "Grant", "Sharma", "Dubois", "Alvarez", "Cole", "Nair", "Farouk", "Kovacs", "Ellis", "Papas", "Rahman", "Bianchi", "Morgan", "Silva", "Byrne", "Aziz"];

const GRADE_FEEDBACK = [
  "Clear verification steps - exactly the habit the course builds. Watch the source-citing on claims you did not check yourself.",
  "Strong applied example from your own workflow. The rollout risks section needed one more mitigation.",
  "Good instinct to challenge the model's first answer. Next time document what you changed and why.",
  "Solid work. The prompt library you started is worth sharing with your team.",
  "You identified the hallucination but accepted the second answer too quickly - run the same check twice.",
  "Excellent - the before/after comparison makes the time saving concrete.",
];

interface Manifest {
  userIds: string[];
  departmentIds: string[];
  assessmentIds: string[];
  cohortIds: string[];
  facilitatorUserId: string | null;
  facilitatorId: string | null;
}

function loadManifest(): Manifest | null {
  if (!existsSync(MANIFEST)) return null;
  return JSON.parse(readFileSync(MANIFEST, "utf8"));
}

async function resolveOrg(): Promise<{ orgId: string; ownerId: string }> {
  const { data, error } = await db
    .from("user_profiles")
    .select("id, org_id")
    .eq("email", OWNER_EMAIL)
    .single();
  if (error || !data?.org_id) throw new Error(`Owner org not found: ${error?.message}`);
  return { orgId: data.org_id, ownerId: data.id };
}

async function purge() {
  const manifest = loadManifest();
  const { data: demoProfiles } = await db
    .from("user_profiles")
    .select("id")
    .like("email", `%@${DEMO_DOMAIN}`);
  const userIds = Array.from(
    new Set([...(manifest?.userIds ?? []), ...(demoProfiles ?? []).map((p) => p.id)])
  );
  const facilitatorUserId = manifest?.facilitatorUserId;

  console.log(`Purging ${userIds.length} demo users + related rows...`);

  if (userIds.length) {
    await db.from("usage_logs").delete().in("user_id", userIds);
    const { data: enr } = await db.from("enrolments").select("id").in("user_id", userIds);
    const enrIds = (enr ?? []).map((e) => e.id);
    if (enrIds.length) {
      await db.from("certificates").delete().in("enrolment_id", enrIds);
      await db.from("grades").delete().in("enrolment_id", enrIds);
      await db.from("submissions").delete().in("enrolment_id", enrIds);
      await db.from("attendance").delete().in("enrolment_id", enrIds);
      await db.from("enrolments").delete().in("id", enrIds);
    }
    await db.from("assessment_responses").delete().in("user_id", userIds);
  }
  for (const id of manifest?.cohortIds ?? []) {
    await db.from("sessions").delete().eq("cohort_id", id);
    await db.from("cohorts").delete().eq("id", id);
  }
  for (const id of manifest?.assessmentIds ?? []) {
    await db.from("assessment_responses").delete().eq("assessment_id", id);
    await db.from("assessments").delete().eq("id", id);
  }
  if (manifest?.facilitatorId) await db.from("facilitators").delete().eq("id", manifest.facilitatorId);
  for (const uid of [...userIds, ...(facilitatorUserId ? [facilitatorUserId] : [])]) {
    const { error } = await db.auth.admin.deleteUser(uid);
    if (error && !/not found/i.test(error.message)) console.warn(`  user ${uid}: ${error.message}`);
  }
  // Departments stay - they may have acquired real members.
  if (existsSync(MANIFEST)) unlinkSync(MANIFEST);
  console.log("Purge complete.");
}

async function seed() {
  if (loadManifest()) {
    console.error("A seed manifest exists - run --purge first (idempotency guard).");
    process.exit(1);
  }
  const { orgId, ownerId } = await resolveOrg();
  console.log(`Seeding org ${orgId} (owner ${OWNER_EMAIL})`);

  const manifest: Manifest = {
    userIds: [], departmentIds: [], assessmentIds: [], cohortIds: [],
    facilitatorUserId: null, facilitatorId: null,
  };
  const save = () => writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));

  // ── departments (find-or-create; only mark created ones) ──
  const deptIds: Record<string, string> = {};
  for (const d of DEPARTMENTS) {
    const { data: existing } = await db
      .from("departments").select("id").eq("org_id", orgId).eq("name", d.name).maybeSingle();
    if (existing) { deptIds[d.name] = existing.id; continue; }
    const { data: created, error } = await db
      .from("departments").insert({ org_id: orgId, name: d.name, type: d.type }).select("id").single();
    if (error) throw new Error(`department ${d.name}: ${error.message}`);
    deptIds[d.name] = created.id;
    manifest.departmentIds.push(created.id);
  }
  save();

  // ── people ──
  type Person = { id: string; name: string; email: string; dept: (typeof DEPARTMENTS)[number]; role: string };
  const people: Person[] = [];
  let nameIdx = 0;
  for (const dept of DEPARTMENTS) {
    for (let i = 0; i < dept.headcount; i++) {
      const name = `${FIRST[nameIdx % FIRST.length]} ${LAST[nameIdx % LAST.length]}`;
      nameIdx++;
      const email = `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@${DEMO_DOMAIN}`;
      const role = i === 0 ? "manager" : "user";
      const { data: created, error } = await db.auth.admin.createUser({
        email,
        password: randomUUID() + randomUUID(),
        email_confirm: true,
        user_metadata: { name },
      });
      if (error || !created.user) throw new Error(`createUser ${email}: ${error?.message}`);
      const id = created.user.id;
      manifest.userIds.push(id);
      const { error: pErr } = await db.from("user_profiles").upsert({
        id, email, name, org_id: orgId, department_id: deptIds[dept.name], role,
        job_title: role === "manager" ? `${dept.name} Manager` : pick(["Analyst", "Specialist", "Coordinator", "Senior Associate", "Executive"]),
        preferences: { demo: true },
      });
      if (pErr) throw new Error(`profile ${email}: ${pErr.message}`);
      people.push({ id, name, email, dept, role });
    }
    save();
    console.log(`  ${dept.name}: ${dept.headcount} people`);
  }

  // ── maturity assessment + responses (dept-correlated, spread over 45d) ──
  const { data: matAssessment, error: aErr } = await db.from("assessments").insert({
    org_id: orgId, created_by: ownerId, title: "Q3 AI Readiness Baseline",
    template_id: "org-wide", status: "active",
  }).select("id").single();
  if (aErr) throw new Error(aErr.message);
  manifest.assessmentIds.push(matAssessment.id); save();

  const clamp5 = (v: number) => Math.max(0, Math.min(5, Number(v.toFixed(2))));
  for (const p of people) {
    const base = p.dept.strength;
    const scores = {
      confidence: clamp5(base + between(-0.7, 0.7)),
      practice: clamp5(base + between(-0.9, 0.5)),
      tools: clamp5(base + between(-0.4, 1.0)),
      responsible: clamp5(base + between(-1.1, 0.3)),
      culture: clamp5(base + between(-0.6, 0.6)),
    };
    const { error } = await db.from("assessment_responses").insert({
      assessment_id: matAssessment.id, user_id: p.id, department_id: deptIds[p.dept.name],
      template_id: "org-wide", dimension_scores: scores,
      confidence_score: scores.confidence, practice_score: scores.practice,
      tools_score: scores.tools, responsible_score: scores.responsible, culture_score: scores.culture,
      respondent_role: p.role === "manager" ? "manager" : "individual_contributor",
      tools_used: pick([["ChatGPT"], ["ChatGPT", "Copilot"], ["None"], ["ChatGPT", "Claude"], ["Copilot"]]),
      raw_answers: {}, submitted_at: daysAgo(Math.floor(between(5, 45))).toISOString(),
    });
    if (error) throw new Error(`response ${p.email}: ${error.message}`);
  }
  console.log(`  maturity responses: ${people.length}`);

  // ── training-needs assessment + responses ──
  const { data: tnaAssessment, error: tErr } = await db.from("assessments").insert({
    org_id: orgId, created_by: ownerId, title: "Training Needs Analysis",
    template_id: "training-needs", status: "active",
  }).select("id").single();
  if (tErr) throw new Error(tErr.message);
  manifest.assessmentIds.push(tnaAssessment.id); save();

  const NEED_BY_DEPT: Record<string, { ai: number; technology: number; robotics: number }> = {
    Engineering: { ai: 1.6, technology: 1.2, robotics: 2.4 },
    Operations: { ai: 3.2, technology: 3.0, robotics: 3.8 },
    Finance: { ai: 4.3, technology: 3.4, robotics: 0.9 },
    Marketing: { ai: 3.6, technology: 2.2, robotics: 0.6 },
    "Customer Support": { ai: 3.9, technology: 3.1, robotics: 0.8 },
  };
  let tnaCount = 0;
  for (const p of people) {
    if (rand() < 0.3) continue; // ~70% completion, realistic
    const base = NEED_BY_DEPT[p.dept.name];
    const needs = {
      ai: clamp5(base.ai + between(-0.5, 0.5)),
      technology: clamp5(base.technology + between(-0.5, 0.5)),
      robotics: clamp5(base.robotics + between(-0.4, 0.4)),
    };
    const { error } = await db.from("assessment_responses").insert({
      assessment_id: tnaAssessment.id, user_id: p.id, department_id: deptIds[p.dept.name],
      template_id: "training-needs", dimension_scores: needs,
      confidence_score: 0, practice_score: 0, tools_score: 0, responsible_score: 0, culture_score: 0,
      respondent_role: p.role === "manager" ? "manager" : "individual_contributor",
      raw_answers: {}, submitted_at: daysAgo(Math.floor(between(2, 20))).toISOString(),
    });
    if (error) throw new Error(`tna ${p.email}: ${error.message}`);
    tnaCount++;
  }
  console.log(`  training-needs responses: ${tnaCount}`);

  // ── facilitator ──
  const facEmail = `elena.marsh@${DEMO_DOMAIN}`;
  const { data: facUser, error: fuErr } = await db.auth.admin.createUser({
    email: facEmail, password: randomUUID() + randomUUID(), email_confirm: true,
    user_metadata: { name: "Elena Marsh" },
  });
  if (fuErr || !facUser.user) throw new Error(`facilitator user: ${fuErr?.message}`);
  manifest.facilitatorUserId = facUser.user.id;
  await db.from("user_profiles").upsert({
    id: facUser.user.id, email: facEmail, name: "Elena Marsh", org_id: orgId,
    role: "user", job_title: "Lead Facilitator", preferences: { demo: true },
  });
  const { data: fac, error: facErr } = await db.from("facilitators").insert({
    user_id: facUser.user.id, display_name: "Elena Marsh",
    bio: "Applied AI trainer; 11 years of workplace capability programmes.",
    credentials: [{ title: "CIPD Level 7", issuer: "CIPD", year: 2019 }, { title: "MSc Human-Computer Interaction", issuer: "UCL", year: 2013 }],
    active: true,
  }).select("id").single();
  if (facErr) throw new Error(`facilitator: ${facErr.message}`);
  manifest.facilitatorId = fac.id; save();

  // ── cohorts on real published courses ──
  const { data: courses } = await db
    .from("courses").select("id, slug, title, level, learning_outcomes")
    .eq("status", "published")
    .in("slug", [
      "responsible-ai-use-at-work",
      "prompting-and-output-verification",
      "getting-value-from-tools-you-already-own",
      "ai-in-the-executive-workflow",
    ]);
  if (!courses || courses.length < 3) throw new Error("Expected published courses not found");
  const bySlug = Object.fromEntries(courses.map((c) => [c.slug, c]));

  type CohortSpec = {
    slug: string; title: string; status: string; startDaysAgo: number;
    departments: string[]; seats: number; completed: boolean;
  };
  const cohortSpecs: CohortSpec[] = [
    { slug: "responsible-ai-use-at-work", title: "Responsible AI Use - Finance & Ops", status: "completed", startDaysAgo: 42, departments: ["Finance", "Operations"], seats: 12, completed: true },
    { slug: "prompting-and-output-verification", title: "Prompting & Verification - Support", status: "running", startDaysAgo: 10, departments: ["Customer Support", "Marketing"], seats: 10, completed: false },
    { slug: "getting-value-from-tools-you-already-own", title: "Tools You Already Own - Marketing", status: "completed", startDaysAgo: 55, departments: ["Marketing"], seats: 8, completed: true },
    { slug: "ai-in-the-executive-workflow", title: "AI in the Executive Workflow - Leads", status: "scheduled", startDaysAgo: -12, departments: ["Engineering", "Finance", "Operations"], seats: 8, completed: false },
  ];

  for (const spec of cohortSpecs) {
    const course = bySlug[spec.slug];
    if (!course) { console.warn(`  skip cohort (no course): ${spec.slug}`); continue; }
    const starts = daysAgo(spec.startDaysAgo);
    const ends = new Date(starts.getTime() + 21 * 86400000);
    const { data: cohort, error: cErr } = await db.from("cohorts").insert({
      course_id: course.id, org_id: orgId, facilitator_id: fac.id, title: spec.title,
      delivery_mode: pick(["in_person", "virtual"]), timezone: "Europe/London",
      seat_limit: spec.seats, starts_on: starts.toISOString().slice(0, 10),
      ends_on: ends.toISOString().slice(0, 10), status: spec.status,
    }).select("id").single();
    if (cErr) throw new Error(`cohort ${spec.title}: ${cErr.message}`);
    manifest.cohortIds.push(cohort.id); save();

    const sessions: { id: string }[] = [];
    for (let i = 0; i < 3; i++) {
      const s = new Date(starts.getTime() + i * 7 * 86400000);
      s.setHours(9 + i, 30, 0, 0);
      const e = new Date(s.getTime() + 2 * 3600000);
      const { data: session, error: sErr } = await db.from("sessions").insert({
        cohort_id: cohort.id, position: i + 1, title: `Session ${i + 1}`,
        starts_at: s.toISOString(), ends_at: e.toISOString(),
      }).select("id").single();
      if (sErr) throw new Error(`session: ${sErr.message}`);
      sessions.push(session);
    }

    const candidates = people.filter((p) => spec.departments.includes(p.dept.name));
    const enrolled = candidates.slice(0, spec.seats);
    for (const p of enrolled) {
      const { data: enr, error: eErr } = await db.from("enrolments").insert({
        cohort_id: cohort.id, user_id: p.id, org_id: orgId,
        department_id: deptIds[p.dept.name],
        status: spec.completed ? (rand() < 0.85 ? "completed" : "enrolled") : "enrolled",
        enrolled_at: daysAgo(spec.startDaysAgo + 5).toISOString(),
      }).select("id, status").single();
      if (eErr) throw new Error(`enrolment: ${eErr.message}`);

      if (spec.startDaysAgo > 0) {
        const sessionsHeld = spec.completed ? 3 : Math.min(3, Math.floor(spec.startDaysAgo / 7) + 1);
        let attended = 0;
        for (let i = 0; i < sessionsHeld; i++) {
          const status = rand() < 0.86 ? "present" : rand() < 0.5 ? "late" : "absent";
          if (status !== "absent") attended++;
          await db.from("attendance").insert({
            session_id: sessions[i].id, enrolment_id: enr.id, status,
            minutes_attended: status === "absent" ? 0 : Math.floor(between(95, 120)),
            recorded_by: facUser.user.id,
          });
        }
        if (spec.completed) {
          const gradeCount = 2;
          let total = 0;
          for (let g = 0; g < gradeCount; g++) {
            const score = Math.floor(between(58, 96));
            total += score;
            const { data: sub } = await db.from("submissions").insert({
              session_id: sessions[g].id, enrolment_id: enr.id,
              notes: "Applied exercise submitted after the session.",
            }).select("id").single();
            await db.from("grades").insert({
              enrolment_id: enr.id, submission_id: sub?.id ?? null,
              score, max_score: 100, feedback: pick(GRADE_FEEDBACK),
              graded_by: facUser.user.id,
              graded_at: daysAgo(spec.startDaysAgo - 7 * (g + 1)).toISOString(),
            });
          }
          const attendancePct = (attended / 3) * 100;
          const gradePct = total / gradeCount;
          if (enr.status === "completed" && attendancePct >= 80 && gradePct >= 70) {
            await db.from("certificates").insert({
              enrolment_id: enr.id, public_ref: certRef(),
              issued_at: daysAgo(spec.startDaysAgo - 22).toISOString(),
              snapshot: {
                participant_name: p.name, course_title: course.title,
                course_level: course.level, course_slug: course.slug,
                cohort_title: spec.title, delivery_mode: "in_person",
                starts_on: starts.toISOString().slice(0, 10),
                ends_on: ends.toISOString().slice(0, 10),
                facilitator_name: "Elena Marsh",
                facilitator_credentials: [{ title: "CIPD Level 7", issuer: "CIPD", year: 2019 }],
                modules: [], learning_outcomes: course.learning_outcomes ?? [],
                attendance_pct: Number(attendancePct.toFixed(1)),
                grade_pct: Number(gradePct.toFixed(1)),
                pass_attendance_pct: 80, pass_grade_pct: 70,
                issued_by_org: "NEW CORP",
              },
            });
          }
        }
      }
    }
    console.log(`  cohort "${spec.title}": ${enrolled.length} enrolled (${spec.status})`);
  }

  // ── usage logs: 60 days, dept-weighted, Finance climbs after training ──
  const models = ["gpt-4o-mini", "gpt-4o-mini", "gpt-4o-mini", "gpt-4o"];
  const rows: Record<string, unknown>[] = [];
  for (let day = 60; day >= 1; day--) {
    for (const p of people) {
      let weight = p.dept.strength / 5;
      if (p.dept.name === "Finance") weight = day > 20 ? 0.08 : 0.45; // the cohort landed ~day 20
      if (p.dept.name === "Engineering") weight = 0.75;
      const requests = rand() < weight ? Math.floor(between(1, 5)) : 0;
      for (let r = 0; r < requests; r++) {
        const model = pick(models);
        const tokensIn = Math.floor(between(300, 2200));
        const tokensOut = Math.floor(between(150, 900));
        const cost = model === "gpt-4o" ? tokensIn * 0.0000025 + tokensOut * 0.00001 : tokensIn * 0.00000015 + tokensOut * 0.0000006;
        const at = daysAgo(day);
        at.setHours(Math.floor(between(8, 18)), Math.floor(between(0, 59)), 0, 0);
        rows.push({
          org_id: orgId, user_id: p.id, department_id: deptIds[p.dept.name],
          model, tokens_in: tokensIn, tokens_out: tokensOut,
          cost: Number(cost.toFixed(6)), endpoint: "/api/chat",
          created_at: at.toISOString(),
        });
      }
    }
  }
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await db.from("usage_logs").insert(rows.slice(i, i + 500));
    if (error) throw new Error(`usage_logs batch: ${error.message}`);
  }
  console.log(`  usage logs: ${rows.length}`);
  save();
  console.log("Seed complete. Manifest written to scripts/.seed-manifest.json");
}

const mode = process.argv.includes("--purge") ? "purge" : "seed";
(mode === "purge" ? purge() : seed()).catch((err) => {
  console.error(err);
  process.exit(1);
});
