export type Band = "explorers" | "inventors" | "creators" | "studio";
export type Picture =
  | "apple"
  | "carrot"
  | "leaf"
  | "star"
  | "robot"
  | "moon"
  | "sun"
  | "book"
  | "lock"
  | "cloud"
  | "boots"
  | "wings"
  | "fish"
  | "tree"
  | "home"
  | "key"
  | "flower"
  | "rocket";
export type Option = {
  id: string;
  text: string;
  picture?: Picture;
  feedback?: string;
};
export type Activity = {
  id: string;
  title: string;
  intro: string;
  instruction: string;
  kind: "choose" | "sort" | "order" | "evidence" | "scene";
  options: Option[];
  correct: string[];
  feedback: string;
  hint: string;
  evidence?: string[];
  categories?: [string, string];
};
export type Mission = {
  slug: string;
  band: Band;
  number: number;
  title: string;
  skill: string;
  summary: string;
  introduction: string;
  outcome: string;
  takeaway: string;
  activities: Activity[];
  project: { title: string; prompt: string; checks: string[]; offline: string };
  aiBrief?: string;
  version: string;
};
export type Answer = string[];
export type SavedProgress = {
  revision: number;
  answers: Record<string, Answer>;
  creation: string;
  completed: boolean;
  updated_at?: string;
};
export type Child = {
  id: string;
  nickname: string;
  band: Band;
  avatar: Picture;
  ai_enabled: boolean;
  narration: boolean;
  deletion_requested_at: string | null;
};
export type Order = {
  id: string;
  child_id: string;
  mission_slug: string;
  state: "pending" | "paid" | "refunded";
  expires_at: string | null;
  generations_used: number;
};
