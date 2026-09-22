import type { SelfServeLesson } from "./types.ts";

export const PROMPT_ENGINEERING_LESSONS: SelfServeLesson[] = [
  {
    id: "brief-the-model",
    title: "Brief the model",
    emphasis: "model",
    decision: "A weak answer is usually a weak brief.",
    paragraphs: [
      "A model continues the pattern you gave it. Where the brief is silent, it fills the gap with something that sounds finished. That fill is not a fact you supplied. It is a guess, written in a confident voice.",
      "The mechanism is simple. The prompt is the only evidence the model has about this client, this discount, and this deadline. If those are missing, it will still often write as if it knows them. The failure is not that the sentence looks wrong. The failure is that the sentence adds a commitment nobody made.",
    ],
    exampleTitle: "The reply the model wrote",
    example:
      "Thanks for your note. We can extend the pilot by two weeks and apply a 15% discount to the outstanding invoice, as discussed.",
    check: {
      kind: "mark",
      prompt: "The prompt was only: write a polite reply. Mark each sentence.",
      passLabel: "Holds",
      failLabel: "Invented",
      sentences: [
        {
          id: "thanks",
          text: "Thanks for your note.",
          fail: false,
          why: "A thank-you does not add a commercial fact. That line can hold.",
        },
        {
          id: "weeks",
          text: "We can extend the pilot by two weeks.",
          fail: true,
          why: "Two weeks was not in the brief. The model invented a commitment.",
        },
        {
          id: "discount",
          text: "Apply a 15% discount to the outstanding invoice, as discussed.",
          fail: true,
          why: "There was no discussion in the prompt. 'As discussed' is how a guess disguises itself.",
        },
      ],
    },
  },
  {
    id: "four-parts",
    title: "Four parts of a brief",
    emphasis: "brief",
    decision: "A colleague should be able to run your prompt without you in the room.",
    paragraphs: [
      "A usable brief has four parts. Role: who the model is speaking as. Context: the facts that are actually true. Constraints: what it must not add, promise, or change. Output: the shape of the thing you want back.",
      "Leave one out and the model supplies it. Leave out the constraint and you get the discount. Leave out the output shape and you get a memo when you needed three lines.",
    ],
    exampleTitle: "Two briefs for the same reply",
    example: "Choose the brief you would hand to a colleague on Monday.",
    check: {
      kind: "choose",
      prompt: "Which brief can someone else run without guessing?",
      leftLabel: "Brief A",
      left: "Write a nice reply to the client about the pilot.",
      rightLabel: "Brief B",
      right:
        "You are the account manager. The client asked for an update. Facts: the pilot ends Friday, no extension has been agreed, no discount has been discussed. Do not invent dates, prices, or prior agreements. Reply in four lines: thanks, status, what we need from them, next step.",
      correct: "right",
      why: "Brief B names the role, the true facts, the ban on invented commitments, and the shape of the reply. Brief A asks for 'nice' and leaves every commercial fact open.",
    },
  },
  {
    id: "iterate",
    title: "Fix the miss",
    emphasis: "miss",
    decision: "Do not start again. Name the constraint that was missing.",
    paragraphs: [
      "When the output is wrong, the useful move is to point at the miss and add the constraint that would have prevented it. Starting from a blank prompt throws away the parts that were already right.",
      "Order matters. If you add a new instruction before you have said what failed, you are guessing at the fix. Read the miss first.",
    ],
    exampleTitle: "The miss",
    example: "The reply invented a 15% discount. Everything else was usable.",
    check: {
      kind: "order",
      prompt: "Put the repair in the order you would actually do it.",
      steps: [
        { id: "read", label: "Read the sentence that invented the discount." },
        { id: "name", label: "Name the missing constraint: do not invent a price." },
        { id: "add", label: "Add that constraint to the same brief." },
        { id: "check", label: "Check the new reply for any price or date you did not supply." },
      ],
      correct: ["read", "name", "add", "check"],
      why: "Read the miss, name the constraint, add it, then check. A new prompt before you know the miss just hides the same gap.",
    },
  },
  {
    id: "prompt-card",
    title: "The prompt card",
    emphasis: "card",
    decision: "Leave with a card a colleague can run on a real task.",
    paragraphs: [
      "The card is the artefact. It is not a slogan. It is four lines about a task you actually have this week: the role, the true context, the constraints, and the output you want.",
      "Write it so that a person who was not in this lesson could paste it into the tool and would not need to ask you what you meant.",
    ],
    exampleTitle: "What complete looks like",
    example:
      "Role: account manager. Context: pilot ends Friday, no extension agreed. Constraint: do not invent a price, a date, or a prior promise. Output: four lines, no subject line.",
    check: {
      kind: "build",
      prompt: "Write the card for one real task. Each line has to be specific enough to run.",
      fields: [
        { id: "role", label: "Role", hint: "Who is speaking.", min: 8 },
        { id: "context", label: "Context", hint: "The facts that are true. No invented ones.", min: 24 },
        {
          id: "constraints",
          label: "Constraints",
          hint: "What the reply must not add or promise.",
          min: 24,
        },
        { id: "output", label: "Output", hint: "The shape of the result.", min: 12 },
      ],
    },
  },
];
