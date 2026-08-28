import { test } from "node:test";
import assert from "node:assert/strict";

import {
  assessSubmission,
  gibberishScore,
  isLatinText,
  HONEYPOT_FIELD,
  MIN_FILL_MS,
} from "../spam-defence.ts";

const HUMAN_DELAY = 30_000;
const NOW = 1_800_000_000_000;
const human = (over: Record<string, unknown> = {}) => ({
  startedAt: NOW - HUMAN_DELAY,
  now: NOW,
  ...over,
});

// ── the spam actually being received ────────────────────────────────────

test("blocks the random-string submissions we keep getting", () => {
  // Verbatim from the 28 Aug 2026 contact form email. The address is a real
  // harvested corporate one, so only the text gives it away.
  const verdict = assessSubmission(
    human({
      name: "Myrdcjoj Hrwqyyuwd",
      email: "steffen.ahlendorf@e-t-a.de",
      message: "nROPZJqUlqLIbmlNzuepZXC",
    })
  );
  assert.equal(verdict.spam, true);
});

test("scores machine-generated strings high", () => {
  assert.ok(gibberishScore("nROPZJqUlqLIbmlNzuepZXC") >= 0.9);
  assert.ok(gibberishScore("Myrdcjoj Hrwqyyuwd") >= 0.5);
});

// ── the expensive failure: real enquiries ───────────────────────────────

test("lets ordinary enquiries through", () => {
  const verdict = assessSubmission(
    human({
      name: "Sarah Whitfield",
      email: "sarah.whitfield@council.gov.uk",
      message:
        "We have about 40 staff in operations and want to run the prompting course in person. What does availability look like for October, and can you invoice us?",
    })
  );
  assert.equal(verdict.spam, false, verdict.reasons.join(","));
});

test("a consonant-dense real name is not enough to block", () => {
  // Krzysztof, Nguyen and Dvorak all trip naive vowel-ratio checks.
  for (const name of ["Krzysztof Wojciechowski", "Nguyen Thi Hong", "Antonin Dvorak"]) {
    const verdict = assessSubmission(
      human({
        name,
        email: "someone@example.com",
        message:
          "Hello, I would like to discuss training for our engineering team next quarter. Please could someone call me back.",
      })
    );
    assert.equal(verdict.spam, false, `${name}: ${verdict.reasons.join(",")}`);
  }
});

test("non-Latin messages are never character-scored", () => {
  // These have no Latin vowels at all and would look like junk to the
  // character checks, which is why isLatinText gates them out.
  for (const message of [
    "您好，我们想为团队安排人工智能培训课程，请问十月份是否有空档？",
    "مرحبا، نود ترتيب دورة تدريبية لفريقنا. هل يمكنكم إرسال التفاصيل؟",
    "Здравствуйте, мы хотели бы обсудить обучение для нашей команды.",
  ]) {
    assert.equal(isLatinText(message), false);
    const verdict = assessSubmission(
      human({ name: "Li Wei", email: "li@example.cn", message })
    );
    assert.equal(verdict.spam, false, verdict.reasons.join(","));
  }
});

test("a very short genuine message is not scored", () => {
  const verdict = assessSubmission(
    human({ name: "Tom Reed", email: "tom@example.com", message: "Please call me" })
  );
  assert.equal(verdict.spam, false, verdict.reasons.join(","));
});

test("acronyms and product names survive", () => {
  const verdict = assessSubmission(
    human({
      name: "J. McgRath",
      email: "j@nhs.uk",
      message:
        "Our L&D team at the NHS trust uses ChatGPT and GitHub Copilot already. We need the responsible AI module for roughly 120 people before the EU AI Act deadline.",
    })
  );
  assert.equal(verdict.spam, false, verdict.reasons.join(","));
});

// ── the cheap, decisive layers ──────────────────────────────────────────

test("a filled honeypot is decisive on its own", () => {
  const verdict = assessSubmission(
    human({
      name: "Sarah Whitfield",
      email: "sarah@example.com",
      message: "A completely normal message about booking a training course for the team.",
      [HONEYPOT_FIELD]: undefined,
      honeypot: "http://spam.example",
    })
  );
  assert.deepEqual(verdict, { spam: true, reasons: ["honeypot"] });
});

test("an instant submission is decisive on its own", () => {
  const verdict = assessSubmission({
    name: "Sarah Whitfield",
    email: "sarah@example.com",
    message: "A completely normal message about booking a training course for the team.",
    startedAt: NOW - (MIN_FILL_MS - 500),
    now: NOW,
  });
  assert.deepEqual(verdict, { spam: true, reasons: ["too_fast"] });
});

test("a replayed day-old payload is rejected", () => {
  const verdict = assessSubmission({
    name: "Sarah Whitfield",
    email: "sarah@example.com",
    message: "A completely normal message about booking a training course for the team.",
    startedAt: NOW - 24 * 60 * 60 * 1000,
    now: NOW,
  });
  assert.equal(verdict.spam, true);
  assert.deepEqual(verdict.reasons, ["stale_form"]);
});

test("a missing or unusable timestamp fails open, never closed", () => {
  // A cached page or a stripped field must not lock a real person out.
  for (const startedAt of [undefined, null, "", "not-a-number", 0, -1]) {
    const verdict = assessSubmission({
      name: "Sarah Whitfield",
      email: "sarah@example.com",
      message: "We would like to book the applied robotics course for eight people in November.",
      startedAt,
      now: NOW,
    });
    assert.equal(verdict.spam, false, `startedAt=${String(startedAt)}`);
  }
});

test("an empty honeypot is not a signal", () => {
  const verdict = assessSubmission(
    human({
      name: "Sarah Whitfield",
      email: "sarah@example.com",
      message: "We would like to book the applied robotics course for eight people in November.",
      honeypot: "",
    })
  );
  assert.equal(verdict.spam, false);
});
