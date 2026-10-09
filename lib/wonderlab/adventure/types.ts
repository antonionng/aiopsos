export const ADVENTURE_VERSION = "district-2026-10-09.1";
export type Zone = "signal" | "forge" | "launch";
export type Source = {
  id: string;
  name: string;
  text: string;
  x: number;
  y: number;
};
export type Claim = {
  id: string;
  text: string;
  source: string;
  repair: string;
  decision: "keep" | "repair" | "remove";
};
export type SignalLevel = {
  kind: "signal";
  title: string;
  mission: string;
  sources: Source[];
  claims: Claim[];
  finished: string;
};
export type ForgeLevel = {
  kind: "forge";
  title: string;
  mission: string;
  width: number;
  height: number;
  start: number;
  goals: number[];
  water: number[];
  rocks: number[];
  initial: number[];
  budget: number;
  goalNames: string[];
  rules: string[];
  finished: string;
};
export type Task = {
  id: string;
  name: string;
  duration: number;
  earliest: number;
  latest: number;
  resource: number;
  after?: string;
  helper: "person" | "calculator" | "ai";
  why: string;
};
export type LaunchLevel = {
  kind: "launch";
  title: string;
  mission: string;
  slots: number;
  resources: string[];
  tasks: Task[];
  finished: string;
};
export type Specimen = {
  id: string;
  colour: "violet" | "aqua";
  shape: "round" | "spiky";
  label: "gentle" | "lively";
};
export type LabLevel = {
  kind: "lab";
  title: string;
  mission: string;
  examples: Specimen[];
  probes: Specimen[];
  finished: string;
};
export type Level = SignalLevel | ForgeLevel | LaunchLevel | LabLevel;
export type Adventure = {
  slug: string;
  name: string;
  band: "creators" | "studio";
  zone: Zone;
  subtitle: string;
  learning: string;
  reward: string;
  levels: [Level, Level];
  free?: boolean;
};
export type RoundState = {
  visited: string[];
  links: Record<string, string>;
  decisions: Record<string, string>;
  tiles: number[];
  instructions: number[];
  testedGoals: number[];
  schedule: Record<string, { slot: number; resource: number; helper: string }>;
  examples: string[];
  moves: number;
  attempts: number;
  solved: boolean;
  feedback: string;
  failures: string[];
  reflection: string;
};
export type AdventureState = {
  version: string;
  round: number;
  rounds: RoundState[];
  completed: boolean;
  cosmetic: "aqua" | "violet" | "orange";
  collection: string[];
};
export type Action =
  | { type: "visit"; id: string }
  | { type: "link"; claim: string; source: string }
  | { type: "decide"; claim: string; decision: string }
  | { type: "tile"; cell: number }
  | { type: "fabricate" }
  | { type: "walk"; path: number[] }
  | {
      type: "schedule";
      task: string;
      slot: number;
      resource: number;
      helper: string;
    }
  | { type: "example"; id: string }
  | { type: "test" }
  | { type: "reflect"; text: string }
  | { type: "next" }
  | { type: "replay" }
  | { type: "cosmetic"; colour: "aqua" | "violet" | "orange" };
export type AdventureRecord = {
  child_id: string;
  mission_slug: string;
  game_version: string;
  revision: number;
  state: AdventureState;
  completed: boolean;
  updated_at: string;
};
