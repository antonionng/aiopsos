import type { Band } from "./types";

// Browsing copy addresses the parent choosing a lesson. The versioned mission
// content continues to address the child inside their learning space.
export const parentLevels: Record<Band, string> = {
  explorers:
    "Your child will build early foundations for communicating with AI, questioning mistakes and knowing when to ask for help. Picture stories and simple games let you practise these skills together, without live AI.",
  inventors:
    "Your child will build clearer communication, creative thinking and the habit of checking before trusting a machine. They’ll practise through creature-design games, comic stories and detective challenges using prepared examples.",
  creators:
    "Your child will learn to communicate effectively with AI and question answers that sound convincing but may be wrong. Creative projects, mysteries and revision games help them practise keeping their own judgement in charge.",
  studio:
    "Your teenager will develop the judgement to decide when AI is useful, communicate what they need and take responsibility for checking the result. They’ll apply these skills to creative work, study and practical club projects.",
};

export const parentMissions: Record<
  string,
  { summary: string; project: string }
> = {
  "robot-sorting-picnic": {
    summary:
      "Your child will begin to understand why AI can get things wrong: a few examples don’t tell the whole story. By checking Pip’s picnic sorting, they’ll practise noticing patterns, questioning guesses and explaining their own reasoning.",
    project:
      "Your child will draw a sorting mat and explain why each object belongs in its group. Together, you can try the same idea with safe objects at home.",
  },
  "robot-rescue": {
    summary:
      "Your child will build foundations for communicating with AI: explaining what they need, giving ordered instructions and recognising a missing step. They’ll practise these skills by helping Pip find a route to the treehouse.",
    project:
      "Your child will draw three direction cards for a simple task. You’ll follow the cards together to see whether the instructions work.",
  },
  "story-garden": {
    summary:
      "Your child will practise the creative choices that matter when making things with AI: developing an idea, connecting events and deciding how a story should end. A lost robot’s garden adventure gives them picture pieces to shape into their own story.",
    project:
      "Your child will draw their own ending and tell you how it solves the robot’s problem. You can bring their story to life with toys or drawings.",
  },
  "silly-robot-detective": {
    summary:
      "Your child will learn an early habit of critical thinking: a robot can sound sure and still be wrong. By investigating Pip’s picture mix-ups, they’ll practise checking evidence and recognising when they don’t yet have enough information to know.",
    project:
      "Your child will draw a silly mistake, correct it and explain what they checked. You can practise together by giving a toy the wrong name.",
  },
  "private-treasure": {
    summary:
      "Your child will begin to understand boundaries with digital tools: some information stays private, and an on-screen request doesn’t mean they should share it. A treasure-chest game helps them practise pausing and asking a trusted adult.",
    project:
      "Your child will draw a privacy shield and practise asking a trusted adult before sharing information. They won’t need to type anyone’s real name or personal details.",
  },
  "my-helpful-invention": {
    summary:
      "Your child will build early problem-solving skills and learn that a helpful machine still needs human judgement. By designing a pretend plant-care invention, they’ll practise explaining a job, testing an instruction and deciding when to question its advice.",
    project:
      "Your child will draw their invention, explain its job and test one instruction with you. Together, you’ll identify something the machine needs a person to check.",
  },
  "train-the-creature-sorter": {
    summary:
      "Your child will learn to question how reliable an AI prediction is, rather than assuming a correct answer once means it is always right. They’ll investigate a creature sorter, improve its examples and test unfamiliar creatures.",
    project:
      "Your child will invent two creature cards with different colours and habitats, then design a test that could reveal a sorting mistake.",
  },
  "creature-creator": {
    summary:
      "Your child will build the foundations for useful AI conversations: explaining what they want, spotting when a result misses the point and improving the request. They’ll practise by designing a creature suited to a rainy forest.",
    project:
      "Your child will make a creature card describing its habitat, two useful features and one improvement. They can draw the creature and ask someone to check it against the description.",
  },
  "comic-workshop": {
    summary:
      "Your child will develop their own creative judgement: connecting ideas, asking clarifying questions and improving a first attempt. Building a three-panel robot comic helps them practise the choices they’ll need when creating with AI.",
    project:
      "Your child will draw or describe a three-panel comic, include a question that clarifies an instruction and explain a change they made.",
  },
  "fact-detective": {
    summary:
      "Your child will learn that a convincing AI answer is not proof that something is true. Through an island detective story, they’ll practise checking claims against evidence, correcting mistakes and recognising when a fact is still unknown.",
    project:
      "Your child will create a corrected fact file with a mistaken claim, its replacement and the evidence behind the change. Someone else can use the same evidence to check their work.",
  },
  "secret-shield": {
    summary:
      "Your child will build the judgement to use AI without sharing more about themselves than a task needs. By repairing a fictional character’s story request, they’ll practise recognising identifying details and replacing them with useful made-up ones.",
    project:
      "Your child will make a before-and-after privacy card using entirely fictional details, showing how a story request can work without identifying a real person.",
  },
  "hobby-helper": {
    summary:
      "Your child will learn how to make AI assistance useful in everyday tasks: explain the goal, set practical limits and test whether the advice works. A fictional club’s paper-rocket challenge gives them a plan to check and improve.",
    project:
      "Your child will write a club activity plan with materials, timing and steps, then test it and explain an improvement. They can try the paper activity with you or a friend.",
  },
  "inside-the-guessing-machine": {
    summary:
      "Your child will develop a more questioning understanding of AI: predictions depend on the examples a system has seen, and apparent success can hide unreliable shortcuts. They’ll uncover those limits by testing a fictional creature classifier.",
    project:
      "Your child will write a short test report describing the examples, a suspected shortcut and a new test that could expose an unreliable prediction.",
  },
  "prompt-repair-shop": {
    summary:
      "Your child will learn to communicate purposefully with AI, giving it the context and limits it needs while staying responsible for the result. Repairing a fictional museum-sign request lets them compare vague instructions with a clear, testable brief.",
    project:
      "Your child will keep an original request, an improved version and a comparison of the results. Reading the sign aloud helps them check whether it suits its intended visitors.",
  },
  "worldbuilder-studio": {
    summary:
      "Your child will practise using AI as a creative assistant while keeping ownership of their ideas. By designing a fictional world, they’ll learn to set their own rules, question suggestions and revise details that don’t fit their vision.",
    project:
      "Your child will create a world guide with a setting, three rules and a scene. They’ll explain a creative revision and can sketch a map to help someone else explore the idea.",
  },
  "rumour-lab": {
    summary:
      "Your child will learn to recognise when AI sounds authoritative but has invented details. Investigating an island news post gives them practice tracing claims to evidence, challenging unsupported quotations and correcting misinformation before it spreads.",
    project:
      "Your child will write a corrected news post using the supplied facts and explain an unsupported detail they removed.",
  },
  "digital-footprint-escape": {
    summary:
      "Your child will build the judgement to protect their privacy when using AI and other digital tools. A fictional studio escape challenge helps them question unnecessary permissions, consider who can see their work and respect other people’s information.",
    project:
      "Your child will create a permission checklist covering why information is needed, who can see it and how to protect other people’s details.",
  },
  "study-quest": {
    summary:
      "Your child will learn to use AI to support their understanding rather than simply accept an answer. By creating and testing revision questions from science notes, they’ll practise recalling ideas, explaining them and catching errors in an AI answer key.",
    project:
      "Your child will make two revision cards with answers and supporting notes, explain a check they made and invite someone to try the questions.",
  },
  "choose-the-right-helper": {
    summary:
      "Your teenager will build the judgement to decide when AI helps and when another tool or a person is a better choice. Fictional youth-club tasks let them weigh accuracy, creative needs and responsibility for decisions involving people.",
    project:
      "Your teenager will create a guide matching three tasks to suitable tools, explain their choices and identify what a person still needs to check.",
  },
  "brief-builder": {
    summary:
      "Your teenager will develop the communication skills to direct AI towards a useful result and hold it to clear requirements. Turning a messy club-poster request into a tested brief gives them practice specifying purpose, facts, limits and quality.",
    project:
      "Your teenager will keep a creative brief, a draft and a review against at least three requirements, showing how they repaired a mismatch.",
  },
  "game-concept-studio": {
    summary:
      "Your teenager will practise turning a creative idea into something that works, using planning, testing and revision rather than accepting a first draft. A branching story game gives them meaningful choices and consistent rules to design and check.",
    project:
      "Your teenager will write a playable opening, two choices and two endings, then record a test of each path and a repair. Another person can try the game using the written choices.",
  },
  "evidence-room": {
    summary:
      "Your teenager will learn to challenge confident AI claims, including references that look credible but don’t support the answer. Reviewing a fictional exhibition brief helps them verify sources, resolve contradictions and communicate what remains uncertain.",
    project:
      "Your teenager will make an evidence review listing three claims, their sources and a decision to keep, correct or leave each claim unresolved.",
  },
  "publish-with-care": {
    summary:
      "Your teenager will develop responsible judgement about sharing AI-assisted work: protecting people’s privacy, respecting permission and avoiding misleading impressions. They’ll review a fictional club project and practise explaining honestly how AI contributed.",
    project:
      "Your teenager will create a publication checklist covering private details, permissions and facts, together with a truthful note explaining how AI helped.",
  },
  "make-life-easier": {
    summary:
      "Your teenager will learn to judge AI by whether it helps with a task, not just whether its output looks impressive. Turning fictional club notes into an action checklist lets them test accuracy, usefulness and the need for human checks.",
    project:
      "Your teenager will write a project report describing the task, instructions and result, two tests and one limitation. They’ll explain whether the process helped and invite someone else to test it.",
  },
};

export const parentSkillLabels = [
  "Understanding AI",
  "Communicating with AI",
  "Creative thinking",
  "Critical thinking",
  "Privacy and judgement",
  "Practical problem-solving",
] as const;
