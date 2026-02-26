import type { DepartmentType, Dimension } from "./constants";

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

export interface DimensionScores {
  confidence: number;
  practice: number;
  tools: number;
  responsible: number;
  culture: number;
}

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
