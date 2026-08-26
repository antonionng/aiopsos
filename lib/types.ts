import type {
  AttendanceStatus,
  CohortStatus,
  CourseCategory,
  CourseLevel,
  CourseStatus,
  DeliveryMode,
  DepartmentType,
  Dimension,
  EnrolmentStatus,
  RespondentRole,
} from "./constants";

export interface Organisation {
  id: string;
  name: string;
  industry: string;
  size: string;
  logo_url: string | null;
  website: string;
  description: string;
  location: string;
  founded_year: number | null;
  mission: string;
  products_services: string;
  tech_stack: string;
  created_at: string;
}

export interface Department {
  id: string;
  org_id: string;
  name: string;
  type: DepartmentType;
}

export interface UserProfile {
  id: string;
  org_id: string;
  department_id: string | null;
  role: "super_admin" | "admin" | "manager" | "user";
  email: string;
  name: string;
  job_title: string;
  bio: string;
  skills: string;
  preferences: Record<string, unknown>;
  avatar_url: string | null;
}

export interface Assessment {
  id: string;
  org_id: string;
  created_by: string;
  title: string;
  status: "draft" | "active" | "completed";
  created_at: string;
}

export interface AssessmentResponse {
  id: string;
  assessment_id: string;
  user_id: string;
  department_id: string;
  confidence_score: number;
  practice_score: number;
  tools_score: number;
  responsible_score: number;
  culture_score: number;
  respondent_role: string | null;
  tools_used: string[] | null;
  raw_answers: Record<string, number>;
  submitted_at: string;
}

// A mapped type rather than an interface so it stays assignable to
// Record<string, number> - the generic scoring math takes any axis set.
export type DimensionScores = {
  [K in "confidence" | "practice" | "tools" | "responsible" | "culture"]: number;
};

export interface Recommendation {
  id: string;
  org_id: string;
  assessment_id: string;
  model_routing: ModelRouting[];
  control_layer: ControlLayer;
  generated_at: string;
}

export interface ModelRouting {
  department_type: DepartmentType;
  department_name?: string;
  primary_model: string;
  secondary_model: string;
  use_case: string;
  reasoning: string;
}

export interface ControlLayer {
  logging_level: "full" | "summary" | "metadata-only";
  cost_budget_monthly: number;
  guardrails: string[];
  access_policies: Record<string, string[]>;
}

export interface Roadmap {
  id: string;
  org_id: string;
  assessment_id: string;
  phases: RoadmapPhase[];
  generated_at: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  days: string;
  objectives: string[];
  deliverables: string[];
  milestones: RoadmapMilestone[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  day: number;
  completed: boolean;
}

export interface Conversation {
  id: string;
  user_id: string;
  org_id: string;
  model: string;
  title: string;
  folder?: string | null;
  pinned: boolean;
  project_id?: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  org_id: string;
  name: string;
  description: string;
  instructions: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  filename: string;
  storage_path: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokens_used: number;
  model: string;
  cost: number;
  created_at: string;
}

export interface UsageLog {
  id: string;
  org_id: string;
  user_id: string;
  department_id: string;
  model: string;
  tokens_in: number;
  tokens_out: number;
  cost: number;
  customer_charge: number;
  endpoint: string;
  created_at: string;
}

export interface PromptTemplate {
  id: string;
  org_id: string;
  department_type: DepartmentType;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: "basic" | "pro";
  stripe_price_id: string | null;
  allowed_models: string[];
  price_per_seat: number;
  currency: string;
}

export interface KnowledgeBaseFile {
  id: string;
  org_id: string;
  department_id: string | null;
  filename: string;
  storage_path: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

export interface SavedPrompt {
  id: string;
  user_id: string;
  org_id: string;
  title: string;
  content: string;
  is_shared: boolean;
  created_at: string;
}

export interface ModelPersona {
  id: string;
  org_id: string;
  department_type: DepartmentType | null;
  name: string;
  description: string;
  system_prompt: string;
  icon: string;
  created_by: string;
  created_at: string;
}

export interface AssessmentLink {
  id: string;
  org_id: string;
  created_by: string;
  token: string;
  title: string;
  description: string;
  active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface PendingResponse {
  id: string;
  link_id: string;
  raw_answers: Record<string, number>;
  confidence_score: number;
  practice_score: number;
  tools_score: number;
  responsible_score: number;
  culture_score: number;
  respondent_role: string | null;
  tools_used: string[] | null;
  session_token: string;
  claimed_by: string | null;
  created_at: string;
}

export interface ApprovalRequest {
  id: string;
  org_id: string;
  message_id: string | null;
  conversation_id: string | null;
  requested_by: string;
  reviewer_id: string | null;
  status: "pending" | "approved" | "rejected";
  comment: string | null;
  content_preview: string;
  created_at: string;
  resolved_at: string | null;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: CourseLevel;
  category: CourseCategory;
  duration_hours: number;
  delivery_modes: DeliveryMode[];
  learning_outcomes: string[];
  target_roles: RespondentRole[];
  target_dimensions: Dimension[];
  status: CourseStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  position: number;
  title: string;
  summary: string;
  duration_hours: number;
  outcomes: string[];
  lab_url: string | null;
  created_at: string;
}

/** A course recommendation with the reasoning that produced it. */
export interface CourseMatch {
  course: Course;
  /** Weighted overlap with the respondent's weakest dimensions. */
  score: number;
  /** Which weak dimensions this course addresses, weakest first. */
  matched_dimensions: Dimension[];
}

/**
 * A course recommendation flattened for the wire. Shared by the public
 * assessment results endpoint and the signed-in one so both can render
 * through the same component.
 */
export interface CourseRecommendation {
  slug: string;
  title: string;
  summary: string;
  level: CourseLevel;
  duration_hours: number;
  delivery_modes: DeliveryMode[];
  match_score: number;
  matched_dimensions: Dimension[];
}

// --- Cohort delivery ---

export interface FacilitatorCredential {
  title: string;
  issuer?: string;
  reference?: string;
  year?: number;
}

export interface Facilitator {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  credentials: FacilitatorCredential[];
  active: boolean;
  created_at: string;
}

export interface Cohort {
  id: string;
  course_id: string;
  org_id: string | null;
  facilitator_id: string | null;
  title: string;
  delivery_mode: DeliveryMode;
  location: string | null;
  timezone: string;
  seat_limit: number;
  starts_on: string | null;
  ends_on: string | null;
  status: CohortStatus;
  price_amount: number | null;
  currency: string;
  stripe_session_id: string | null;
  paid_at: string | null;
  pass_attendance_pct: number;
  pass_grade_pct: number;
  created_at: string;
}

export interface CohortSession {
  id: string;
  cohort_id: string;
  module_id: string | null;
  position: number;
  title: string;
  starts_at: string;
  ends_at: string;
  join_url: string | null;
  created_at: string;
}

export interface Enrolment {
  id: string;
  cohort_id: string;
  user_id: string;
  org_id: string;
  department_id: string | null;
  status: EnrolmentStatus;
  enrolled_at: string;
  completed_at: string | null;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  enrolment_id: string;
  status: AttendanceStatus;
  minutes_attended: number;
  recorded_by: string | null;
  recorded_at: string;
}

export interface Submission {
  id: string;
  session_id: string;
  enrolment_id: string;
  artefact_url: string | null;
  notes: string;
  submitted_at: string;
}

export interface Grade {
  id: string;
  enrolment_id: string;
  module_id: string | null;
  submission_id: string | null;
  score: number;
  max_score: number;
  rubric: Record<string, unknown>;
  feedback: string;
  graded_by: string | null;
  graded_at: string;
}

/** Frozen at issue so later catalogue edits never rewrite history. */
export interface CertificateSnapshot {
  participant_name: string;
  course_title: string;
  course_level: CourseLevel;
  course_slug: string;
  cohort_title: string;
  delivery_mode: DeliveryMode;
  starts_on: string | null;
  ends_on: string | null;
  facilitator_name: string | null;
  facilitator_credentials: FacilitatorCredential[];
  modules: { position: number; title: string; outcomes: string[] }[];
  learning_outcomes: string[];
  attendance_pct: number;
  grade_pct: number | null;
  pass_attendance_pct: number;
  pass_grade_pct: number;
  issued_by_org: string | null;
}

export interface Certificate {
  id: string;
  enrolment_id: string;
  public_ref: string;
  issued_at: string;
  revoked_at: string | null;
  snapshot: CertificateSnapshot;
}
