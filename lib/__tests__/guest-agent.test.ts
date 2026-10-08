import { test } from "node:test";
import assert from "node:assert/strict";
import { guestBriefSchema, guestContactSchema, guestPackSchema, packMarkdown } from "../guest-agent.ts";
import { isPublicPath } from "../public-routes.ts";

test("guest marketing, chat and API are accessible without opening authenticated workspace routes", () => {
  for (const path of ["/learning-agent", "/learning-agent/chat", "/api/public/learning-agent", "/api/public/learning-agent/deliver"]) assert.equal(isPublicPath(path), true);
  for (const path of ["/dashboard/agents", "/api/lms/agents/run", "/learning-agent/private"]) assert.equal(isPublicPath(path), false);
});
test("guest input is bounded and requires explicit contact consent", () => {
  assert.equal(guestBriefSchema.safeParse({ brief: "   " }).success, false);
  assert.equal(guestBriefSchema.safeParse({ brief: "a".repeat(2001) }).success, false);
  const input = { name: " Visitor ", email: " Visitor@EXAMPLE.com ", consent: true };
  assert.equal(guestContactSchema.parse(input).email, "visitor@example.com");
  assert.equal(guestContactSchema.safeParse({ ...input, consent: false }).success, false);
  assert.equal(guestContactSchema.safeParse({ ...input, email: "not email" }).success, false);
  assert.equal(guestContactSchema.safeParse({ ...input, company_website: "bot" }).success, false);
});
test("a deliverable contains complete material and exports every item", () => {
  const pack = { title: "A useful first week", summary: "A practical introduction for the support team.", ready: true, next_step: "Where should I send your pack?", items: [{ title: "Practice", content: "Use this fictional support request to practise. ".repeat(5) }] };
  const valid = guestPackSchema.parse(pack);
  assert.match(packMarkdown(valid), /## Practice/);
  assert.ok(packMarkdown(valid).includes(valid.items[0].content));
  assert.equal(guestPackSchema.safeParse({ ...pack, items: [] }).success, false);
  assert.equal(guestPackSchema.safeParse({ ...pack, items: [{ title: "Promise", content: "I will create it" }] }).success, false);
});
