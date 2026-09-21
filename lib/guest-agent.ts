import { z } from "zod";

export const GUEST_TURN_LIMIT = 3;
export const guestBriefSchema = z.object({ brief: z.string().trim().min(10).max(2000) });
export const guestContactSchema = z.object({
  name: z.string().trim().min(1).max(150),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  organisation_name: z.string().trim().max(200).default(""),
  consent: z.literal(true),
  company_website: z.string().max(0).default(""),
});
export const guestItemSchema = z.object({
  title: z.string().min(1).max(150),
  content: z.string().min(100).max(16000).describe("Complete usable Markdown material, not an outline or a promise."),
});
export const guestConclusionSchema = z.object({
  title: z.string().min(1).max(150),
  summary: z.string().min(20).max(1500),
  ready: z.boolean().describe("True when the pack is useful enough to deliver and ask for contact details."),
  next_step: z.string().max(500),
});
export const guestPackSchema = guestConclusionSchema.extend({ items: z.array(guestItemSchema).min(1).max(4) });
export type GuestPack = z.infer<typeof guestPackSchema>;
export type GuestContact = z.infer<typeof guestContactSchema>;
export type GuestView = {
  pack: GuestPack | null;
  remaining: number;
  capture: boolean;
  locked: boolean;
  delivered: boolean;
  busy: boolean;
  progress: string[];
  messages: { role: "user" | "assistant"; text: string }[];
  contact: GuestContact | null;
};
export function packMarkdown(pack: GuestPack) {
  return `# ${pack.title}\n\n${pack.summary}\n\n${pack.items.map((item) => `## ${item.title}\n\n${item.content}`).join("\n\n---\n\n")}\n\nCreated with Experrt. AI-generated materials for your review.\n`;
}
