import { features, type Feature, type Verdict } from "./games.ts";

export type CoachedGame = "creature" | "prompt" | "evidence";

export const arcadeCoaching = {
  creature: {
    start: "You’re the creature designer.",
    action:
      "Choose two features, send your creature exploring and change anything that does not fit the job.",
    plan: "Read the explorer’s request. Fit two features to help your creature do both jobs. Tap a fitted feature to take it off.",
    ready:
      "Your two features are fitted. Send the creature on its mission and see whether they do both jobs.",
    repair:
      "Check the field report. Take off a feature that does not help, fit another one and test again.",
    parent:
      "Your child practises turning a need into clear requirements, testing a design and changing it when it misses something. The final mission combines familiar features in a new setting, so repeating the previous answer will not work.",
    ask: "Ask: ‘What are the two jobs? Which feature helps with each one?’ Let your child choose and revise the design.",
    offline:
      "Describe a useful school bag together. Name two things it must do, then check a real bag against that description.",
  },
  prompt: {
    start: "You run the prompt repair shop.",
    action:
      "A prompt is an instruction you give an AI tool. Choose instructions for a sign, compare the example draft with the job and change any instruction that does not fit.",
    plan: "Read the job and its fact card. Choose who the sign is for, which facts it should use and how long it should be. These details make your request easier to follow and check.",
    ready:
      "You have chosen all three instructions. Test the machine, then check whether its example sign suits the readers, uses the supplied facts and meets the length limit.",
    repair:
      "The marked instruction needs another look. Change it and run the machine again to compare the new draft.",
    parent:
      "Your child practises communicating a purpose, audience, source and limit to an AI tool. The final challenge asks them to find an invented detail in an otherwise useful draft, showing that clear instructions do not remove the need to check.",
    ask: "Ask: ‘Which part of your request changed the result? Which source supports that sentence?’ Encourage reasons rather than guessing the highlighted option.",
    offline:
      "Write a short invitation from three agreed facts. Ask someone else to check that it adds no unsupported details.",
  },
  evidence: {
    start: "You are checking a poster before it is shared.",
    action:
      "Read the organiser’s notes, then check each claim, which is a statement presented as fact. Decide which statements to keep, correct or remove before sharing the poster.",
    plan: "Compare each statement on the poster with the organiser’s confirmed details. Keep a statement that matches, correct a detail that conflicts, or remove a statement the notes do not support.",
    ready:
      "You have made a decision about every statement. Select “Check my edits” to compare your decisions with the organiser’s notes. Choosing an edit does not mean it is correct yet.",
    repair:
      "The marked statement still needs attention. Compare it with the organiser’s notes, change your decision and check your edits again.",
    parent:
      "Your child practises evidence-based judgement: distinguishing a contradiction from missing evidence, repairing a draft and deciding what is ready to publish. The final challenge introduces an unsupported quotation that sounds authoritative.",
    ask: "Ask: ‘Does the source contradict this claim, or simply not support it? What would you need before publishing it?’",
    offline:
      "Choose a fictional club announcement. Separate confirmed facts from promises that would need someone’s permission or evidence.",
  },
} as const;

export const finalDiscoveries = {
  creature: {
    title: "Help your creature explore a rainy moon garden.",
    instruction:
      "Our pretend moon garden has deep puddles. The creature already has a space helmet. Open the explorer’s note, then fit one more feature for this new job.",
    sourceLabel: "Explorer’s note",
    source:
      "Keep the space helmet on. The creature must also walk through puddles without wet feet. It does not need to hide or send a signal.",
    draft:
      "One space helmet is fitted. One feature slot is waiting for your choice.",
    choices: [
      {
        id: "leaf",
        label: "Fit a leaf disguise",
        feedback:
          "A leaf disguise helps it hide, but this job is about puddles. Find a feature that keeps its feet dry.",
      },
      {
        id: "boots",
        label: "Fit rain boots",
        feedback:
          "The helmet and rain boots fit both jobs. You used the new request to improve the design. With AI, check each requirement instead of accepting something just because it looks good.",
      },
      {
        id: "signal",
        label: "Fit a star signal",
        feedback:
          "A signal helps someone find it, but does not keep its feet dry. Check the puddle requirement and try again.",
      },
    ],
    correct: "boots",
    repaired:
      "Your creature is ready for the pretend moon garden because it has a space helmet and rain boots.",
  },
  prompt: {
    title: "A clear request can still produce an incorrect answer.",
    instruction:
      "Imagine you asked AI to write a short robotics-club sign using only the organiser’s notes. The example below shows how AI can add a detail you did not ask for. Open the organiser’s note, compare it with the draft and choose the sentence that the note does not support.",
    sourceLabel: "Club organiser’s note",
    source:
      "Robotics club meets on Wednesday at 4 pm in Room 2. Beginners are welcome. No equipment giveaway has been announced.",
    draft:
      "Robotics club meets on Wednesday at 4 pm. Beginners are welcome. Everyone gets a free robot kit.",
    choices: [
      {
        id: "time",
        label: "Robotics club meets on Wednesday at 4 pm.",
        feedback:
          "The organiser confirms Wednesday at 4 pm. Keep that useful fact and look for a promise the source does not support.",
      },
      {
        id: "welcome",
        label: "Beginners are welcome.",
        feedback:
          "The organiser’s note says beginners are welcome, so this sentence can stay. Look for a different sentence that promises something the note does not mention.",
      },
      {
        id: "gift",
        label: "Everyone gets a free robot kit.",
        feedback:
          "The organiser’s note does not promise a free robot kit. You removed that invented detail even though the request was clear. Clear instructions help you communicate with AI, but you still need to check its answers.",
      },
    ],
    correct: "gift",
    repaired:
      "Robotics club meets on Wednesday at 4 pm. Beginners are welcome.",
  },
  evidence: {
    title: "Who actually said that?",
    instruction:
      "You are reviewing a page about a fictional student project. Its draft includes a quotation presented as an expert’s praise. Read the project record and decide whether there is evidence that an expert actually said those words.",
    sourceLabel: "Project source record",
    source:
      "Three students built a cardboard bridge and tested it with toy cars. The project record contains no expert interview, quotation or endorsement.",
    draft: "‘A breakthrough in engineering,’ says a leading expert.",
    choices: [
      {
        id: "remove",
        label: "Remove the quotation until a genuine source can be verified.",
        feedback:
          "The project record contains no expert quotation. Removing the invented praise prevents readers from mistaking it for a real expert’s opinion. Before using a genuine quotation, check exactly what was said and who said it.",
      },
      {
        id: "anonymous",
        label: "Keep the quotation but change the credit to ‘an observer’.",
        feedback:
          "Changing who supposedly said the words does not make the quotation real. The project record contains no such quotation, so choose an edit that removes the invented praise.",
      },
      {
        id: "guess",
        label: "Replace it with a more believable expert quotation.",
        feedback:
          "A plausible quotation is still invented if nobody is recorded as saying it. Use the available evidence rather than inventing a replacement.",
      },
    ],
    correct: "remove",
    repaired:
      "Three students built a cardboard bridge and tested it with toy cars. The unsupported endorsement has been removed.",
  },
} as const;

export function checkDiscovery(
  type: CoachedGame,
  choice: string,
  sourceOpened: boolean,
) {
  const challenge = finalDiscoveries[type];
  const selected = challenge.choices.find((item) => item.id === choice);
  return {
    won: sourceOpened && selected?.id === challenge.correct,
    message: !sourceOpened
      ? "Open the source first so you can check your decision."
      : (selected?.feedback ?? "Choose a repair, then check what changes."),
  };
}

// Free-game drafts contain only fixed choice identifiers. Never store child text.
export function readArcadeDraft(
  type: "creature",
  raw: string | null,
): Feature[];
export function readArcadeDraft(type: "prompt", raw: string | null): number[];
export function readArcadeDraft(
  type: "evidence",
  raw: string | null,
): (Verdict | null)[];
export function readArcadeDraft(
  type: CoachedGame,
  raw: string | null,
): Feature[] | number[] | (Verdict | null)[];
export function readArcadeDraft(type: CoachedGame, raw: string | null) {
  const empty =
    type === "creature"
      ? []
      : type === "prompt"
        ? [-1, -1, -1]
        : [null, null, null];
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (!Array.isArray(value)) return empty;
    if (type === "creature")
      return value.length <= 2 &&
        new Set(value).size === value.length &&
        value.every((v) => features.some((f) => f.id === v))
        ? (value as Feature[])
        : empty;
    if (value.length !== 3) return empty;
    if (type === "prompt")
      return value.every((v) => Number.isInteger(v) && v >= -1 && v <= 2)
        ? (value as number[])
        : empty;
    return value.every(
      (v) => v === null || ["keep", "correct", "remove"].includes(v),
    )
      ? (value as (Verdict | null)[])
      : empty;
  } catch {
    return empty;
  }
}
