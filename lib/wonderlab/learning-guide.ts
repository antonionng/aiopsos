import type { Mission } from "./types.ts";

export const gameGuides = {
  route: {
    title: "Learn to give instructions and check them.",
    intro:
      "Pip needs your help to get home. You will tell Pip where to go, watch what happens and fix any steps that do not work. It is fine to try again!",
    connection:
      "When you use an AI helper, say clearly what you want and check what it does. In this game, Pip only follows arrows. Real AI works differently: it uses patterns learnt from examples and can make mistakes even with clear instructions.",
    steps: [
      "Tap an arrow for each square you want Pip to move.",
      "Press Go and watch Pip follow your arrows in order.",
      "If Pip stops in the wrong place, change the arrows and try again.",
    ],
    discovery:
      "You planned, tested and checked. Keep that habit when a grown-up helps you use AI: a result still needs checking, even when your instructions are clear.",
    spoken:
      "You are helping Pip get home. Tap an arrow for each square, then press Go. Watch what happens. If Pip goes wrong, change your arrows and try again. You are practising giving instructions and checking what happens. Those skills help when using AI with a grown-up. Pip only follows arrows in this game. It is not real AI.",
  },
  creature: {
    title: "Learn to explain what you need.",
    intro:
      "You are the creature designer. Read what the explorer needs, choose two useful features and test your design. If something is missing, change a feature and test again.",
    connection:
      "AI cannot know every detail of the result you want. Giving it a clear description helps. This game uses ready-made creature pieces to practise describing a need, checking a result and improving it. There is no live AI in this activity.",
    steps: [
      "Find the two things the creature needs to do.",
      "Tap two features to fit them, then send it on its mission.",
      "Read the feedback. Tap a fitted feature to remove it and try another.",
    ],
    discovery:
      "You checked the design against the job instead of accepting the first result. Do the same with AI: explain your requirements, inspect the result and improve your request.",
  },
  prompt: {
    title: "Learn to make an AI request useful.",
    intro:
      "A prompt is the instruction you give an AI tool. Your job is to repair a request for a public sign: tell the drafting machine who will read it, which facts to use and how short it should be.",
    connection:
      "A vague request can produce an unsuitable answer. These prepared drafts show how different instructions change a result. Real AI may respond differently each time, so even a well-written prompt needs its output checked.",
    steps: [
      "Read the job and its fact card.",
      "Choose one instruction in each slot, then test the machine.",
      "Compare the example sign with the job and its fact card. Change an instruction if the sign does not meet the request.",
    ],
    discovery:
      "Audience, sources and limits helped you describe the job. They do not guarantee an accurate AI answer. Checking the output is still your responsibility.",
  },
  evidence: {
    title: "Learn to challenge a confident AI answer.",
    intro:
      "You are checking a poster before it is shared. It contains a correct detail, a mistake and an invented statement. The organiser’s notes are your source: the information you use to check the poster. Decide which statements should stay, change or go.",
    connection:
      "AI can produce confident, polished text containing invented details. That does not mean it is deliberately lying. This prepared editing game practises checking claims against evidence before trusting or publishing them.",
    steps: [
      "Read the source card before judging the poster.",
      "Select each claim and choose keep, correct or remove.",
      "Select “Check my edits”, then use the feedback to understand and change any decision that does not match the notes.",
    ],
    discovery:
      "You used evidence rather than confidence or appearance. Apply that to AI-produced work: verify details, question missing sources and remove claims you cannot support.",
  },
} as const;

export function guideNarration(type: keyof typeof gameGuides) {
  const guide = gameGuides[type];
  if ("spoken" in guide) return guide.spoken;
  return `${guide.intro} ${guide.steps.join(" ")} ${guide.connection}`;
}

const childSkills = [
  "AI can learn patterns from examples, but its guesses can be wrong. You will look closely at examples and check a guess. Our sorting game is a pretend model of this idea.",
  "You will practise saying what you need, trying an instruction and checking what happens. These habits help when using AI. Following fixed game instructions is different from AI learning patterns from examples.",
  "You will choose ideas and make something of your own. AI can help people create, but you still decide what belongs in your work and what to change.",
  "AI can sound sure and still be wrong. You will look for clues and check what Pip says. A confident answer is not the same as a correct answer.",
  "You will practise keeping private information safe. Before sharing information with an AI tool, stop and ask a trusted grown-up. We only use pretend examples here.",
  "You will explain a job, try an idea and check whether it helps. AI can suggest ideas, but people still need to test them and decide what is useful.",
];
const teenSkills = [
  "You will explore how examples and task choice affect whether an AI tool is useful. A successful prediction once is not proof that the tool will be reliable in a new situation.",
  "You will turn a need into clear instructions, compare the result with the requirements and revise it. Those are core skills for communicating with AI, whose outputs still need checking.",
  "You will develop and revise your own creative work. The aim is to use AI assistance with purpose while keeping control of the ideas, decisions and final result.",
  "You will check confident claims against supplied evidence. AI can invent details and citations, so a polished answer is not a reason to trust it.",
  "You will practise spotting private information, unnecessary permissions and publishing risks. Useful AI assistance should not require sharing more information than the task needs.",
  "You will build and test something useful for study, a hobby or a club. The aim is to judge whether AI assistance actually helps and explain where a person still needs to check it.",
];

export function missionPurpose(mission: Mission) {
  const young = mission.band === "explorers" || mission.band === "inventors";
  return (young ? childSkills : teenSkills)[mission.number - 1];
}
