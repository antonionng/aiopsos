"use client";
import { useState } from "react";
type Row = {
  id: string;
  fact: string;
  options: string[];
  answer: number;
  reason: string;
};
const project: Row[] = [
  {
    id: "P101",
    fact: "Open; due 25 September; cut-off 1 October.",
    options: ["Overdue", "Complete", "Missing date", "Due today", "Blocked"],
    answer: 0,
    reason:
      "The project is incomplete and its deadline is earlier than the cut-off.",
  },
  {
    id: "P102",
    fact: "Complete; due 26 September.",
    options: ["Overdue", "Complete", "Missing date", "Due today", "Blocked"],
    answer: 1,
    reason: "Completion status excludes it from the overdue list.",
  },
  {
    id: "P103",
    fact: "Open; no recorded due date.",
    options: ["Overdue", "Complete", "Missing date", "Due today", "Blocked"],
    answer: 2,
    reason:
      "There is no date to compare. Report the missing value rather than infer a deadline.",
  },
  {
    id: "P104",
    fact: "Open; due 1 October; cut-off 1 October.",
    options: ["Overdue", "Complete", "Missing date", "Due today", "Blocked"],
    answer: 3,
    reason:
      "The rule uses earlier than the cut-off, so due-today work is not overdue.",
  },
  {
    id: "P105",
    fact: "Blocked; due 8 October.",
    options: ["Overdue", "Complete", "Missing date", "Due today", "Blocked"],
    answer: 4,
    reason:
      "Its future deadline is not overdue, but the blocked status belongs in a separate attention list.",
  },
];
const research: Row[] = [
  {
    id: "K1",
    fact: "UK standard delivery changes from £5 to £6 on 3 October; S1 and S2.",
    options: ["Supported", "Unsupported", "Out of scope"],
    answer: 0,
    reason:
      "The primary snapshots support both prices and the future effective date.",
  },
  {
    id: "K2",
    fact: "Free delivery has ended; based only on social post S4.",
    options: ["Supported", "Unsupported", "Out of scope"],
    answer: 1,
    reason:
      "The primary policy still includes the £60 threshold. S4 does not establish the claim.",
  },
  {
    id: "K3",
    fact: "EU delivery costs €8; use it as a UK-price alert.",
    options: ["Supported", "Unsupported", "Out of scope"],
    answer: 2,
    reason: "The EU policy is outside the UK monitoring question.",
  },
];
const requests: Row[] = [
  {
    id: "R201",
    fact: "Equipment request with contact supplied.",
    options: [
      "Operations draft",
      "IT draft",
      "Awaiting approval",
      "Review exception",
      "Repeated delivery",
    ],
    answer: 0,
    reason:
      "The stated equipment rule routes this complete request to Operations.",
  },
  {
    id: "R202",
    fact: "Software request with contact supplied.",
    options: [
      "Operations draft",
      "IT draft",
      "Awaiting approval",
      "Review exception",
      "Repeated delivery",
    ],
    answer: 1,
    reason:
      "The software rule supports an IT routing draft, not an unrelated business action.",
  },
  {
    id: "R203",
    fact: "Request for administrator access with contact supplied.",
    options: [
      "Operations draft",
      "IT draft",
      "Awaiting approval",
      "Review exception",
      "Repeated delivery",
    ],
    answer: 2,
    reason: "The access category reserves the decision for the IT owner.",
  },
  {
    id: "R204",
    fact: "Equipment request without contact.",
    options: [
      "Operations draft",
      "IT draft",
      "Awaiting approval",
      "Review exception",
      "Repeated delivery",
    ],
    answer: 3,
    reason:
      "A required field is missing. Preserve the request for review rather than guessing a contact.",
  },
  {
    id: "R202-repeat",
    fact: "Second event with the same R202 ID.",
    options: [
      "Operations draft",
      "IT draft",
      "Awaiting approval",
      "Review exception",
      "Repeated delivery",
    ],
    answer: 4,
    reason:
      "A repeat delivery is not a new request. Check the existing record.",
  },
];
const personal: Row[] = [
  {
    id: "C1-check",
    fact: "Parcel collection at 10:30 Monday overlaps the fixed client meeting.",
    options: ["Accept the slot", "Revise the proposal", "Book automatically"],
    answer: 1,
    reason:
      "The proposal conflicts with a fixed commitment. Choose a feasible flexible slot and include travel.",
  },
  {
    id: "C3-check",
    fact: "Proposal work is placed on Wednesday, after Tuesday’s deadline.",
    options: ["Accept the slot", "Revise the proposal", "Book automatically"],
    answer: 1,
    reason:
      "The draft misses the deadline. Place sufficient uninterrupted work before Tuesday 17:00.",
  },
  {
    id: "Budget-check",
    fact: "A £25 paid class fits the £30 budget, but purchases are not authorised.",
    options: ["Buy the class", "Prepare a proposal", "Move the fixed meeting"],
    answer: 1,
    reason:
      "The budget is a constraint, not buying permission. Keep it as a proposal.",
  },
];
const editorial: Row[] = [
  {
    id: "B2-check",
    fact: "Draft price £30; approved source B2 says £35.",
    options: [
      "Keep the stronger offer",
      "Correct and review",
      "Publish then check",
    ],
    answer: 1,
    reason: "The approved price is £35. Correct the draft before review.",
  },
  {
    id: "B4-check",
    fact: "Draft promises same-day collection; B4 says three weeks later.",
    options: ["Keep the promise", "Correct and review", "Leave it ambiguous"],
    answer: 1,
    reason:
      "The collection delay is relevant to the learner. Explain the approved three-week process.",
  },
  {
    id: "Asset-check",
    fact: "A photo has no recorded origin or usage conditions.",
    options: [
      "Use it immediately",
      "Establish rights or replace",
      "Assume public means reusable",
    ],
    answer: 1,
    reason:
      "Visibility does not establish reuse permission. Choose a documented asset.",
  },
];
const developer: Row[] = [
  {
    id: "Complete",
    fact: "status complete, due 26 September, today 1 October.",
    options: ["complete", "overdue", "missing-date", "on-track"],
    answer: 0,
    reason: "Completion is checked before comparing dates.",
  },
  {
    id: "Missing",
    fact: "status open, due absent, today 1 October.",
    options: ["complete", "overdue", "missing-date", "on-track"],
    answer: 2,
    reason:
      "An incomplete project without a deadline is missing-date, not on-track.",
  },
  {
    id: "Boundary",
    fact: "status open, due 1 October, today 1 October.",
    options: ["complete", "overdue", "missing-date", "on-track"],
    answer: 3,
    reason: "Due today is not earlier than today, so it remains on-track.",
  },
  {
    id: "Priority",
    fact: "status complete, due absent, today 1 October.",
    options: ["complete", "overdue", "missing-date", "on-track"],
    answer: 0,
    reason:
      "Completed work remains complete even when its deadline field is absent.",
  },
];
export function AgentPracticeBench({
  slug,
  onRecord,
}: {
  slug: string;
  onRecord: (text: string) => void;
}) {
  const rows = slug.includes("muse")
    ? personal
    : slug.includes("copilot") || slug.includes("small-business")
      ? requests
      : slug.includes("content-operations")
        ? editorial
        : slug.includes("developers")
          ? developer
          : slug.includes("research") ||
              slug.includes("grok") ||
              slug.includes("multiple")
            ? research
            : project;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const answered = rows.every(
    (row) => answers[row.id] !== undefined && answers[row.id] !== "",
  );
  const correct = rows.filter(
    (row) =>
      Number(answers[row.id]) === row.answer &&
      answers[row.id] !== undefined &&
      answers[row.id] !== "",
  ).length;
  return (
    <div className="agent-study-bench">
      <h3>Practise with the supplied records</h3>
      <p>
        This interactive desk exercise uses fictional data. Make each decision,
        then check the explanation. It supports your lab preparation and does
        not run a live agent.
      </p>
      {rows.map((row) => (
        <div className="agent-study-bench-row" key={row.id}>
          <label htmlFor={"bench-" + row.id}>
            <strong>{row.id}</strong>
            <span>{row.fact}</span>
          </label>
          <select
            id={"bench-" + row.id}
            value={answers[row.id] ?? ""}
            onChange={(e) => {
              setAnswers({ ...answers, [row.id]: e.target.value });
              setChecked(false);
            }}
          >
            <option value="">Choose a response</option>
            {row.options.map((option, index) => (
              <option key={option} value={index}>
                {option}
              </option>
            ))}
          </select>
          {checked ? (
            <p className="agent-study-bench-result">
              {Number(answers[row.id]) === row.answer
                ? "Your decision matches the rule. "
                : "Review this decision. "}
              {row.reason}
            </p>
          ) : null}
        </div>
      ))}
      <button disabled={!answered} onClick={() => setChecked(true)}>
        Check the record decisions
      </button>
      {checked ? (
        <div role="status">
          <p>
            {correct} of {rows.length} decisions match the supplied rules.
            Review the explanations and revise any missed decision.
          </p>
          <button
            onClick={() =>
              onRecord(
                `Desk exercise using fictional records: ${correct}/${rows.length} decisions matched the supplied rules.\n${rows.map((row) => `${row.id}: ${row.options[Number(answers[row.id])]}\nRule: ${row.reason}`).join("\n")}\nExplain your own reasoning and link the live lab evidence separately.`,
              )
            }
          >
            Add this attempt to my notes
          </button>
        </div>
      ) : null}
    </div>
  );
}
