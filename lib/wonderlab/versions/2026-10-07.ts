import {
  missions as originalMissions,
  bands as originalBands,
} from "./2026-10-05.ts";
import type { Band, Mission } from "../types.ts";
export { PRICE_PENCE, GENERATION_ALLOWANCE } from "./2026-10-05.ts";
export const CONTENT_VERSION = "2026-10-07.1";

export const bands = {
  ...originalBands,
  explorers: {
    ...originalBands.explorers,
    description:
      "Your child will practise giving instructions, checking mistakes and asking for help through games you play together.",
  },
  inventors: {
    ...originalBands.inventors,
    description:
      "Your child will practise explaining ideas, testing designs and checking answers through creative games.",
  },
  creators: {
    ...originalBands.creators,
    description:
      "Your child will practise writing clear AI requests, checking information and developing their own creative work.",
  },
  studio: {
    ...originalBands.studio,
    description:
      "Your teenager will practise choosing useful tools, testing AI-assisted projects and taking responsibility for what they share.",
  },
};

// Copy-only revision. Stable identifiers, answer keys and activity order remain
// unchanged, and the previous published release stays available in versions.ts.
const titles: Record<string, [string, string, string, string]> = {
  "robot-sorting-picnic": [
    "Help Pip pack the picnic.",
    "Check whether Pip’s guess is right.",
    "Choose what you need for a picnic.",
    "Sort a new basket by yourself.",
  ],
  "robot-rescue": [
    "Help Pip cross the river.",
    "Find the instruction Pip needs.",
    "Put Pip’s journey in the right order.",
    "Give Pip instructions to plant a seed.",
  ],
  "story-garden": [
    "Choose who your story is about.",
    "Give your robot a problem to solve.",
    "Put your story in order.",
    "Help your robot get home in the rain.",
  ],
  "silly-robot-detective": [
    "Look at the picture to check Pip’s answer.",
    "Check what is inside the picnic basket.",
    "Decide what you need to check first.",
    "Check Pip’s answer about a new picture.",
  ],
  "private-treasure": [
    "Choose what you can use in a pretend story.",
    "Ask for help before sharing where you live.",
    "Choose pretend details for your robot.",
    "Keep your account code private.",
  ],
  "my-helpful-invention": [
    "Choose a job that helps the plant.",
    "Build a reminder to check the plant.",
    "Test your invention’s instructions.",
    "Check whether the advice still helps.",
  ],
  "train-the-creature-sorter": [
    "Group creatures by where they live.",
    "Help the sorter learn from different examples.",
    "Check the sorter using the creature notes.",
    "Decide what you know about a new creature.",
  ],
  "creature-creator": [
    "Choose features for a rainy forest.",
    "Explain what your creature needs to do.",
    "Check whether the creature matches the request.",
    "Design a creature for a different place.",
  ],
  "comic-workshop": [
    "Choose how your comic begins.",
    "Connect the events in your comic.",
    "Make the middle of your comic clearer.",
    "Build a new comic about an unclear instruction.",
  ],
  "fact-detective": [
    "Check the opening times on the noticeboard.",
    "Recognise when you need more information.",
    "Correct the guide using the noticeboard.",
    "Check a new ferry timetable.",
  ],
  "secret-shield": [
    "Choose which details the story needs.",
    "Replace real details with pretend ones.",
    "Choose safe details for your space story.",
    "Check before sharing a photo.",
  ],
  "hobby-helper": [
    "Choose a request that fits the club’s needs.",
    "Make time to test your plan.",
    "Check whether the plan fits the materials and time.",
    "Plan an activity for a different club.",
  ],
  "inside-the-guessing-machine": [
    "Look for a misleading pattern in the examples.",
    "Choose examples that test a different pattern.",
    "Check what the test results actually show.",
    "Design a test for a music sorter.",
  ],
  "prompt-repair-shop": [
    "Explain who the sign is for and what it needs to say.",
    "Put the steps for improving a request in order.",
    "Check whether the draft follows the instructions.",
    "Write a clear request for a different sign.",
  ],
  "worldbuilder-studio": [
    "Choose the rules for your fictional world.",
    "Repair a detail that breaks your world’s rules.",
    "Plan how you will develop your own ideas.",
    "Check the rules of a different fictional world.",
  ],
  "rumour-lab": [
    "Check the news against the studio notice.",
    "Check whether the quotation has a real source.",
    "Correct the post using information you can check.",
    "Check a different exhibition announcement.",
  ],
  "digital-footprint-escape": [
    "Choose the information a writing tool needs.",
    "Question a request for your location.",
    "Protect another person’s private information.",
    "Check who can see your work before sharing it.",
  ],
  "study-quest": [
    "Use your science notes to check the answers.",
    "Ask for practice that helps you think.",
    "Plan how you will answer and check a quiz.",
    "Correct a mistake in an AI answer key.",
  ],
  "choose-the-right-helper": [
    "Match each task to a suitable tool.",
    "Decide who should resolve a disagreement.",
    "Check how AI could help with a poster.",
    "Choose a reliable source for travel times.",
  ],
  "brief-builder": [
    "Give the AI the facts and limits it needs.",
    "Plan instructions that you can test.",
    "Check the draft against the agreed instructions.",
    "Set clear limits for a podcast introduction.",
  ],
  "game-concept-studio": [
    "Design a choice that changes what happens.",
    "Plan how you will build and test a small game.",
    "Check whether both paths follow the rules.",
    "Repair an ending that players cannot reach.",
  ],
  "evidence-room": [
    "Check each statement against the source notes.",
    "Check whether a reference leads to real evidence.",
    "Resolve conflicting information before sharing it.",
    "Separate confirmed costs from unapproved estimates.",
  ],
  "publish-with-care": [
    "Choose what belongs in a public poster.",
    "Make it clear when an image is fictional.",
    "Ask before using someone else’s illustration.",
    "Explain honestly how AI helped with your work.",
  ],
  "make-life-easier": [
    "Choose a small task with a result you can check.",
    "Plan how you will create and check the result.",
    "Check that the task list matches the agreed notes.",
    "Decide whether using AI actually helped.",
  ],
};

const explanations: Record<string, string> = {
  "The bridge comes before the treehouse. Pip starts at the picnic blanket.":
    "Pip wants to get home to the treehouse. Pip starts at the picnic blanket and needs to cross the bridge on the way.",
  "Use the bridge names a clear action Pip can follow.":
    "‘Use the bridge’ tells Pip how to cross the river. Naming the action makes your instruction clearer.",
  "The evidence picture is a carrot. Pip calls it a boot.":
    "Pip says this picture shows a boot. Look closely at the picture so you can check Pip’s answer.",
  "What is in the evidence picture?": "What can you see in the picture?",
  "Our evidence says the basket holds one apple and one carrot. Choose what is really inside.":
    "We have checked the basket. It holds one apple and one carrot. Choose the pictures that match what we found.",
  "Both pieces match the evidence. The moon was an extra claim.":
    "You chose the apple and carrot that we found in the basket. Pip’s idea about the moon did not match what we checked.",
  "We need to look for evidence before saying what is inside.":
    "We cannot see inside the closed box yet. We need to look inside with a grown-up before we can say what it holds.",
  "You checked a new claim by looking at the evidence.":
    "You looked at the picture and saw the sun. Checking for yourself helped you spot Pip’s mistake.",
  "We can use pretend story ideas in this game. Real details about you need a trusted adult.":
    "We can use made-up ideas in our story. Before sharing real details about yourself, such as where you live, ask a grown-up you trust.",
  "Our plant needs care.":
    "You are making a pretend invention to help care for a plant. A grown-up needs to check whether the plant needs water.",
  "Group creatures by where they live, not by colour.":
    "You are choosing examples for a pretend creature sorter. Each card tells you where the creature lives. Use that information to choose its group.",
  "The labels describe the task we want the sorter to learn.":
    "You grouped the creatures by where they live. These examples show the sorter which groups we want it to recognise.",
  "Use these habitat notes to check the sorter.":
    "A habitat is the place where a creature lives. Read the habitat notes below, then check which statements about the creatures match the notes.",
  "A new creature has no habitat notes. The sorter guesses water.":
    "The sorter guesses that a new creature lives in water, but we have no notes about where it lives. Decide how to record this guess without pretending that it is a checked fact.",
  "An unfamiliar example can expose a limit. Record uncertainty rather than inventing a fact.":
    "We do not yet know where this creature lives. Marking the guess as uncertain tells other people that they still need to check it.",
  "The creature needs rain boots for puddles and leaf camouflage. Choose both.":
    "An explorer needs a creature that can walk through puddles and hide among leaves. Give it rain boots and leaf camouflage, which is a leafy disguise that helps it blend into the forest.",
  "Both choices meet the explorer’s requirements. The pieces are authored examples, not live AI generation.":
    "The boots keep its feet dry, and the leafy disguise helps it hide. You checked both parts of the request. These creature pieces were made for the game; they are not created by live AI.",
  "“Make a cool creature” produced a bird without boots.":
    "In this example, the request ‘Make a cool creature’ led to a bird without boots. The explorer still needs rain boots and a leafy disguise, so help them describe those needs clearly.",
  "Requested: rain boots and leaf camouflage.":
    "The explorer requested rain boots and leaf camouflage to help the creature hide.",
  "Result: leaf body, bare feet and a long tail.":
    "The creature has a leafy body, bare feet and a long tail.",
  "The leaf body fits. Bare feet do not meet the boots requirement.":
    "The leafy body helps the creature hide, as requested. Its bare feet show that the rain boots are missing, so the design still needs a change.",
  "Check the guide against the noticeboard.":
    "You are checking an island visitor guide. The noticeboard below gives the confirmed opening times. Use it to decide which statements in the guide are correct.",
  "Workshop opens at 10 am.": "The workshop opens at 10 am.",
  "Garden opens at 9 am.": "The garden opens at 9 am.",
  "Investigate a new timetable.":
    "You are checking when visitors can catch the island ferry. Read the timetable below and choose the statements that match it.",
  "First ferry: 11 am.": "The first ferry leaves at 11 am.",
  "Last ferry: 4 pm.": "The last ferry leaves at 4 pm.",
  "No service on Mondays.": "The ferry does not run on Mondays.",
  "The character wants a story about a space garden.":
    "A made-up character wants help writing a story about a space garden. Sort the details below by whether they help the story or should stay out of the request.",
  "“Use my real school name and class timetable in a robot adventure.”":
    "A made-up character has written this request: ‘Use my real school name and class timetable in a robot adventure.’ Choose a replacement that keeps the adventure without sharing those real-life details.",
  "Arrange the activity.":
    "You are planning a paper-rocket activity for the club. Put the steps in order so the group has time to make a rocket, test it and improve it before showing someone else.",
  "Check the suggested plan.":
    "The club needs a plan that uses only its available materials and fits the time limit. Read the club’s notes below, then choose the statements that match those limits.",
  "Available materials: paper and pencils.":
    "The club has paper and pencils to use.",
  "Time limit: 20 minutes.": "The activity must fit into 20 minutes.",
  "Training examples show every water creature as blue and every land creature as orange.":
    "An AI model learns patterns from training examples, which are examples shown to it while it learns. In this pretend creature sorter, every water creature in the examples is blue and every land creature is orange. Think about which pattern it might use to guess a creature’s home.",
  "Label new examples using their documented habitats.":
    "You are choosing new examples for the creature sorter. Each card names the creature’s habitat, which is where it lives. Use that information to group the creatures, even when their colours differ from earlier examples.",
  "Check what the results establish.":
    "The notes below record how the creature sorter performed on examples it had not seen before. Check which conclusions follow from those results and which go beyond what was tested.",
  "Which test best probes its shortcut?":
    "Which new example would test whether the sorter is relying on speed instead of mood?",
  "“Write something about space” produced a long technical essay. The museum needs a short sign for young visitors.":
    "A fictional museum asked an AI tool to ‘write something about space’ and received a long technical essay. It actually needs a short sign for young visitors. Decide what the request should explain more clearly.",
  "Arrange the repair process.":
    "You are improving the museum’s request to an AI tool. Put the steps in order so you explain the job before generating a draft and then check whether the draft meets it.",
  "Use the brief to review a proposed sign.":
    "A brief is a set of instructions describing what someone needs. The notes below describe the museum’s brief and the draft it received. Compare them to identify what needs changing.",
  "Brief: at most 60 words.": "The brief asks for a sign of at most 60 words.",
  "Draft: 90 words and a claim that the Moon makes its own light.":
    "The draft contains 90 words and says that the Moon makes its own light.",
  "The new brief states a measurable limit and a clear evidence boundary.":
    "This request sets a word limit and names the only facts the sign may use. Those instructions give you specific things to check in the result.",
  "Arrange a creative workflow.":
    "You are using AI suggestions to develop your fictional world. Put the steps in order so your own rules guide the suggestions and you check the details before keeping them.",
  "Check a new setting.":
    "You are checking a story set in a floating library. Read its rules below and choose the details that fit this world.",
  "Review the fictional notice.":
    "An island news post describes a fictional studio closure. The studio’s own notice is your source: the information you can use to check the post. Read the notice below and choose the statements it supports.",
  "Put the verification steps in order.":
    "Verification means checking whether something is accurate using information you can trace. Put the steps in order to correct the news post and show readers where its facts came from.",
  "Check a fictional exhibition update.":
    "A new post announces a fictional exhibition. Use the organiser’s two confirmed facts below to decide which statements can be included in the post.",
  "Use the supplied science notes.":
    "You are creating revision questions about how water changes. The science notes below are your source material: the facts your questions and answers must use. Choose the statements that match these notes.",
  "You want to practise the two processes.":
    "You want to practise the difference between evaporation, when liquid water becomes vapour, and condensation, when vapour becomes liquid. Decide how to ask an AI tool for useful practice.",
  "Arrange the study loop.":
    "You are using a quiz to practise the ideas in your notes. Put the steps in order so you answer for yourself, check your answer and explain any correction.",
  "Current operational information needs an authoritative current source.":
    "The transport operator publishes the timetable for its own services. Check that current timetable before using any journey times, because an AI answer may contain old or invented information.",
  "“Make an exciting poster” leaves the model guessing. The club meets Saturday at 2 pm in the library.":
    "A fictional club needs a poster for teenagers. The request ‘Make an exciting poster’ leaves out useful instructions. The confirmed details are Saturday at 2 pm in the library. Choose a brief, meaning a set of task instructions, that makes the facts and limits clear.",
  "Arrange the process.":
    "You are preparing instructions for an AI draft. Put the steps in order so you explain the purpose, supply confirmed facts and decide how you will check the result.",
  "Compare a draft with the brief.":
    "The notes below describe the club’s instructions and the poster draft it received. Compare the details to identify changes that would make the draft accurate.",
  "Brief: Saturday, 2 pm, library; no invented prices.":
    "The brief confirms Saturday at 2 pm in the library and says not to invent prices.",
  "Draft: Sunday, 2 pm, library; tickets £5.":
    "The draft advertises Sunday at 2 pm in the library and says tickets cost £5.",
  "Keep the draft inside the evidence boundary.":
    "Look for an instruction that uses the supplied facts and identifies missing information instead of inventing it.",
  "The instruction limits fabrication and makes uncertainty visible.":
    "Asking the tool to use only supplied facts discourages invented details. Asking it to flag missing information helps you see what still needs checking, although you must still review the draft yourself.",
  "A player reaches a locked observatory.":
    "You are designing a branching story, where a player’s choices lead to different scenes. The player has reached a locked observatory, a building used to study the sky. Decide which pair of choices would give the player meaningfully different routes forward.",
  "Arrange the development loop.":
    "You are making a small branching story. Put the steps in order so you plan the rules, write two paths and test each path before repairing anything that does not work.",
  "Read the game rules and test log.":
    "A test log records what happened when someone played the game. Read the rule and results below, then decide which statements about the two paths are supported.",
  "Your map has a final scene with no incoming choice.":
    "Your story has a final scene, but none of the player’s choices leads to it. Decide how to repair the game so that a player can reach that ending.",
  "Compare the brief’s claims with the source pack.":
    "You are checking a draft about a fictional exhibition. A claim is a statement presented as fact. Read the two source notes below, then choose the claims that those notes support.",
  "Source A: exhibition opens 12 June.":
    "Source A states that the exhibition opens on 12 June.",
  "Source B: venue capacity is 80 visitors.":
    "Source B states that the venue can hold 80 visitors.",
  "The draft cites “Source C”, which is absent from the supplied pack.":
    "A citation is a reference showing where a claim comes from. The draft refers to ‘Source C’, but no such document is in the supplied pack. Decide what to do before trusting the claim.",
  "Check a new brief.":
    "You are reviewing the budget for a fictional exhibition. The notes distinguish an agreed cost from an estimate still awaiting approval. Choose the statements that describe both the amounts and their approval status accurately.",
  "Confirmed room hire: £100.": "Room hire has been confirmed at £100.",
  "Printing quote: £40, awaiting approval.":
    "The printer has quoted £40, but this cost has not yet been approved.",
  "A bounded drafting task has clear input, output and a human check.":
    "This task gives the AI specific notes to work from and asks for a checklist that a person can check. Keeping the task small makes it easier to spot and correct errors.",
  "Arrange the work.":
    "A workflow is a sequence of steps for completing a task. Put these steps in order to turn the club’s notes into a checklist, then check whether the instructions produced a useful result.",
  "Notes: Alex makes a poster by Friday.":
    "The agreed notes say that Alex will make a poster by Friday.",
  "Notes: Sam checks the room booking on Thursday.":
    "The agreed notes say that Sam will check the room booking on Thursday.",
  "Draft: Alex books the room; Sam makes a poster.":
    "The draft instead assigns the room booking to Alex and the poster to Sam.",
};
const revise = (text: string) => explanations[text] ?? text;
export const missions: Mission[] = originalMissions.map((mission) => ({
  ...mission,
  version: CONTENT_VERSION,
  activities: mission.activities.map((activity, index) => ({
    ...activity,
    title: titles[mission.slug][index],
    intro: revise(activity.intro),
    instruction:
      activity.kind === "sort"
        ? "Choose a group for the item shown. You will see whether it belongs there straight away. If it does not, try the other group."
        : activity.kind === "evidence"
          ? "Read the notes, then select every statement that matches them. Leave a statement unselected if the notes do not support it. Select it again if you want to undo your choice."
          : revise(activity.instruction),
    feedback: revise(activity.feedback),
    hint:
      activity.kind === "evidence"
        ? "Compare each statement with the notes. Does a note confirm it, disagree with it, or leave it unanswered?"
        : revise(activity.hint),
    evidence: activity.evidence?.map(revise),
  })),
}));
export const getMission = (slug: string) =>
  missions.find((mission) => mission.slug === slug);
export const missionsForBand = (band: Band) =>
  missions.filter((mission) => mission.band === band);
