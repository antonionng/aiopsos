import { test } from "node:test";
import assert from "node:assert/strict";
import {
  slugFragment,
  monthDay,
  assessmentLinkToken,
  normaliseCompanyName,
  parseCompanyCsv,
  suggestedSeatLimit,
} from "../tour-provisioning.ts";

test("slugFragment produces something readable off a printed card", () => {
  assert.equal(slugFragment("Acme (M) Sdn. Bhd."), "acme-m-sdn-bhd");
  assert.equal(slugFragment("Bank Rakyat & Co"), "bank-rakyat-and-co");
  assert.equal(slugFragment("  Kuala Lumpur  "), "kuala-lumpur");
  assert.equal(slugFragment("PT Astra Internasional"), "pt-astra-internasional");
});

test("slugFragment strips accents rather than dropping the word", () => {
  // Indonesian and Malaysian company names carry these; losing the whole
  // token would leave a card reading "-oct14".
  assert.equal(slugFragment("Café Ilmu"), "cafe-ilmu");
  assert.equal(slugFragment("Señor Kopi"), "senor-kopi");
});

test("slugFragment never ends in a stray separator", () => {
  assert.equal(slugFragment("Acme!!!"), "acme");
  assert.equal(slugFragment("A".repeat(60)), "a".repeat(40));
});

test("monthDay renders a date a human can read aloud", () => {
  assert.equal(monthDay("2026-10-14"), "oct14");
  assert.equal(monthDay("2026-01-05"), "jan5");
  assert.equal(monthDay("not a date"), "");
  assert.equal(monthDay("2026-13-01"), "");
});

test("link tokens are per company per day, and disambiguate on retry", () => {
  assert.equal(
    assessmentLinkToken("Acme Sdn Bhd", "Kuala Lumpur", "2026-10-14"),
    "acme-sdn-bhd-kuala-lumpur-oct14"
  );
  // The unique index on assessment_links.token is the real guard; the caller
  // retries with an attempt number.
  assert.equal(
    assessmentLinkToken("Acme Sdn Bhd", "Kuala Lumpur", "2026-10-14", 1),
    "acme-sdn-bhd-kuala-lumpur-oct14-2"
  );
});

test("company matching normalises punctuation and case but not identity", () => {
  assert.equal(
    normaliseCompanyName("ACME  Sdn. Bhd."),
    normaliseCompanyName("acme sdn bhd")
  );
  assert.equal(
    normaliseCompanyName("Acme (M) Sdn Bhd"),
    normaliseCompanyName("acme m sdn bhd")
  );

  // Two genuinely different companies must NOT collapse into one tenant.
  // Merging tenants is much worse than creating a duplicate a human can spot.
  assert.notEqual(
    normaliseCompanyName("Acme Holdings"),
    normaliseCompanyName("Acme Trading")
  );
  assert.notEqual(
    normaliseCompanyName("Acme Sdn Bhd"),
    normaliseCompanyName("Acme Bhd")
  );
});

test("the company CSV is header-sniffed in any column order", () => {
  const rows = parseCompanyCsv(
    [
      "Seats,Contact Email,Company Name,Industry",
      "12,ops@acme.example,Acme Sdn Bhd,Manufacturing",
      "8,hr@budi.example,PT Budi Jaya,Logistics",
    ].join("\n")
  );

  assert.equal(rows.length, 2);
  assert.deepEqual(rows[0], {
    name: "Acme Sdn Bhd",
    industry: "Manufacturing",
    contact_email: "ops@acme.example",
    seats: 12,
  });
  assert.equal(rows[1].name, "PT Budi Jaya");
});

test("a headerless paste is treated as one company per line", () => {
  const rows = parseCompanyCsv("Acme Sdn Bhd\nPT Budi Jaya\n");
  assert.deepEqual(rows.map((r) => r.name), ["Acme Sdn Bhd", "PT Budi Jaya"]);
});

test("quoted commas do not shift the columns", () => {
  const rows = parseCompanyCsv(
    ['Company,Industry', '"Acme, Holdings Sdn Bhd",Manufacturing'].join("\n")
  );
  assert.equal(rows[0].name, "Acme, Holdings Sdn Bhd");
  assert.equal(rows[0].industry, "Manufacturing");
});

test("the same company listed twice is provisioned once", () => {
  const rows = parseCompanyCsv(
    ["Company", "Acme Sdn Bhd", "ACME  Sdn. Bhd.", "PT Budi Jaya"].join("\n")
  );
  assert.deepEqual(rows.map((r) => r.name), ["Acme Sdn Bhd", "PT Budi Jaya"]);
});

test("seat limit covers the whole room with headroom, never the default 12", () => {
  // The enrol route enforces seat_limit inside a loop, so an undersized
  // limit seats part of the room and then starts returning "full".
  const companies = [{ name: "A", seats: 12 }, { name: "B", seats: 8 }];
  const limit = suggestedSeatLimit(companies);
  assert.ok(limit >= 20, `expected room-sized limit, got ${limit}`);
  assert.ok(limit <= 500);

  // With no stated headcounts it still must not fall back to 12 for a big room.
  const unstated = Array.from({ length: 9 }, (_, i) => ({ name: `C${i}` }));
  assert.ok(suggestedSeatLimit(unstated) >= 36);
});
