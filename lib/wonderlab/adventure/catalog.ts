import type {
  Adventure,
  SignalLevel,
  ForgeLevel,
  LaunchLevel,
  LabLevel,
  Claim,
} from "./types.ts";
const signal = (
  title: string,
  mission: string,
  facts: [string, string, string],
  claims: [string, string, string],
  decisions: [Claim["decision"], Claim["decision"], Claim["decision"]],
  repairs: [string, string, string],
  finished: string,
): SignalLevel => ({
  kind: "signal",
  title,
  mission,
  finished,
  sources: facts.map((text, i) => ({
    id: `source-${i}`,
    name: ["Archive", "Workshop", "Observatory"][i],
    text,
    x: [1, 5, 3][i],
    y: [1, 2, 4][i],
  })),
  claims: claims.map((text, i) => ({
    id: `claim-${i}`,
    text,
    source: `source-${i}`,
    decision: decisions[i],
    repair: repairs[i],
  })),
});
const forge = (
  title: string,
  mission: string,
  water: number[],
  rocks: number[],
  goals: number[],
  budget: number,
  rules: string[],
  goalNames: string[],
): ForgeLevel => ({
  kind: "forge",
  title,
  mission,
  width: 7,
  height: 5,
  start: 14,
  water,
  rocks,
  goals,
  budget,
  rules,
  goalNames,
  initial: [15, 16, 17, 18, 19, 20].filter(
    (n) => !rocks.includes(n) && !goals.includes(n) && !water.includes(n),
  ),
  finished:
    "You tested the construction against its rules and repaired a result that looked plausible. An AI-assisted design needs the same checking.",
});
const launch = (
  title: string,
  mission: string,
  shift = 0,
  tool = false,
): LaunchLevel => ({
  kind: "launch",
  title,
  mission,
  slots: 8,
  resources: tool
    ? ["Design desk", "Check station"]
    : ["Main stage", "Workshop"],
  finished:
    "Your plan now fits the people, resources and order of work. A polished AI plan is useful only when its details work in practice.",
  tasks: [
    {
      id: "prepare",
      name: tool ? "Draft the invitation" : "Set up the stage",
      duration: 2,
      earliest: shift,
      latest: shift + 3,
      resource: 0,
      helper: tool ? "ai" : "person",
      why: tool
        ? "AI can suggest wording from a supplied brief. A person must check the draft before it is shared."
        : "A person must physically set up and inspect the equipment.",
    },
    {
      id: "check",
      name: tool ? "Check the invitation" : "Inspect the equipment",
      duration: 1,
      earliest: 0,
      latest: 6,
      resource: 0,
      after: "prepare",
      helper: "person",
      why: "A person must check the actual result after the first job finishes.",
    },
    {
      id: "budget",
      name: tool ? "Add up the costs" : "Check the ticket total",
      duration: 1,
      earliest: shift,
      latest: 4 + shift,
      resource: 1,
      helper: "calculator",
      why: "A calculator is appropriate for this fixed arithmetic task. The figures are already supplied.",
    },
    {
      id: "show",
      name: tool ? "Approve the release" : "Run the performance",
      duration: 2,
      earliest: 4 + shift,
      latest: 8,
      resource: 0,
      after: "check",
      helper: "person",
      why: "The checked work needs a person's approval. This job cannot overlap another job using the same space.",
    },
  ],
});
const lab = (title: string, reverse = false): LabLevel => ({
  kind: "lab",
  title,
  mission: reverse
    ? "The music sorter mistakes album-cover colours for the sound. Feed it varied examples, then test unfamiliar covers. Round symbols mean gentle music; spiky symbols mean lively music."
    : "The creature sorter has only seen violet round creatures and aqua spiky creatures. It may mistake colour for behaviour. Feed it varied examples and test creatures it has never seen. The field notes say round creatures are gentle and spiky creatures are lively.",
  finished:
    "You tested a simplified nearest-example model on unfamiliar examples. Better examples can help, but this small test does not prove that a real AI system is reliable.",
  examples: [
    { id: "a", colour: "violet", shape: "round", label: "gentle" },
    { id: "b", colour: "aqua", shape: "spiky", label: "lively" },
    { id: "c", colour: "aqua", shape: "round", label: "gentle" },
    { id: "d", colour: "violet", shape: "spiky", label: "lively" },
  ],
  probes: [
    { id: "new-a", colour: "aqua", shape: "round", label: "gentle" },
    { id: "new-b", colour: "violet", shape: "spiky", label: "lively" },
  ],
});
export const adventures: Adventure[] = [
  {
    slug: "inside-the-guessing-machine",
    name: "The creature signal",
    band: "creators",
    zone: "launch",
    subtitle:
      "Choose examples for a sorter, then test whether it can recognise new ones.",
    learning:
      "Examples can contain misleading patterns. Test unfamiliar cases before trusting a prediction.",
    reward: "Pattern scout",
    levels: [
      lab("Repair the creature sorter."),
      lab("Test the music archive.", true),
    ],
  },
  {
    slug: "prompt-repair-shop",
    name: "Bridgeworks",
    band: "creators",
    zone: "forge",
    subtitle:
      "Design a delivery route, send the courier and repair any gaps it discovers.",
    learning:
      "Break a request into precise instructions, test what is built and repair missing requirements. This builder follows fixed commands; it is a simulation, not live AI.",
    reward: "Blueprint pilot",
    free: true,
    levels: [
      forge(
        "Reconnect the workshop.",
        "The workshop needs a delivery, but the suggested route has a gap. Tap the landscape to add paths and bridges. Choose Send the courier to watch your design in action. If the courier stops, use what you see to repair the route.",
        [3, 10, 17, 24, 31],
        [9, 23],
        [20],
        8,
        [
          "Reach the east workshop.",
          "Use no more than eight path pieces.",
          "Bridge every water square on your route.",
        ],
        ["Workshop"],
      ),
      forge(
        "Deliver to the observatory.",
        "The new brief sends you to the north-east observatory. The direct route is blocked by rocks. Clear the old instructions and build a route that fits the changed destination.",
        [3, 10, 17, 24, 31],
        [16, 18, 9],
        [6],
        10,
        [
          "Reach the north-east observatory.",
          "Use no more than ten path pieces.",
          "Avoid the rocks.",
        ],
        ["Observatory"],
      ),
    ],
  },
  {
    slug: "worldbuilder-studio",
    name: "The floating gardens",
    band: "creators",
    zone: "forge",
    subtitle: "Build a world whose rules actually work.",
    learning:
      "A fictional world needs consistent rules. Playtesting helps reveal contradictions in an AI-suggested design.",
    reward: "World architect",
    levels: [
      forge(
        "Connect the floating islands.",
        "An example world has beautiful islands but no usable route to its garden. Build paths and bridges, then send the courier to test your design.",
        [2, 9, 16, 23, 30, 4, 11, 18, 25, 32],
        [10],
        [13],
        11,
        [
          "Reach the garden on the east island.",
          "Place at most eleven pieces.",
          "Water is only walkable with a bridge.",
        ],
        ["Garden"],
      ),
      forge(
        "Keep both islands reachable.",
        "Your next world has two destinations. Test both journeys from the arrival point. A world that works on one route may still fail on another.",
        [3, 10, 17, 24, 31],
        [9, 25],
        [6, 34],
        14,
        [
          "Test the journey to each destination.",
          "Use at most fourteen pieces.",
          "Keep the central river crossable.",
        ],
        ["Sky garden", "Night garden"],
      ),
    ],
  },
  {
    slug: "rumour-lab",
    name: "Signal Hunt",
    band: "creators",
    zone: "signal",
    subtitle:
      "Collect clues around the city and use them to correct an unreliable broadcast.",
    learning:
      "AI can produce confident claims without evidence. Trace each claim to a source before sharing it.",
    reward: "Signal detective",
    levels: [
      signal(
        "Stop the faulty broadcast.",
        "A prepared AI news draft is sending visitors to the wrong place. Explore the district, collect three source cards and connect each claim to the evidence that checks it.",
        [
          "The studio notice says the exhibition opens on Saturday.",
          "The workshop is in the library, not the sports hall.",
          "The organiser has not announced free equipment.",
        ],
        [
          "The exhibition opens on Saturday.",
          "Visit the workshop in the sports hall.",
          "Everyone receives a free robot.",
        ],
        ["keep", "repair", "remove"],
        [
          "The exhibition opens on Saturday.",
          "Visit the workshop in the library.",
          "",
        ],
        "The broadcast now sends visitors to the confirmed event, without promising invented gifts.",
      ),
      signal(
        "Investigate a new announcement.",
        "A second broadcaster has copied an unchecked announcement. Find fresh evidence; the previous event's details do not apply.",
        [
          "The observatory notice confirms a Sunday opening.",
          "The exhibition catalogue lists twelve projects.",
          "There is no recorded quotation from an astronaut.",
        ],
        [
          "The observatory opens on Saturday.",
          "There are twelve projects to explore.",
          "An astronaut called it the best exhibition ever.",
        ],
        ["repair", "keep", "remove"],
        [
          "The observatory opens on Sunday.",
          "There are twelve projects to explore.",
          "",
        ],
        "The new broadcast contains supported details and no invented endorsement.",
      ),
    ],
  },
  {
    slug: "digital-footprint-escape",
    name: "The privacy vault",
    band: "creators",
    zone: "signal",
    subtitle: "Trace a data trail and seal the leaks.",
    learning:
      "Only share information needed for the job. Fictional profiles let you practise spotting privacy risks safely.",
    reward: "Privacy guardian",
    levels: [
      signal(
        "Seal the public profile.",
        "A fictional game profile is about to be published. Explore the vault terminals, connect the permission notes and remove details the public page does not need.",
        [
          "The public profile needs a nickname, not a home address. The address below is fictional.",
          "The player chose the fictional nickname MoonFox for public use.",
          "The drawing tool needs permission to save drawings, not to read private contacts.",
        ],
        [
          "Show the fictional address: 12 Example Lane.",
          "Display the nickname MoonFox.",
          "Allow the drawing tool to read contacts.",
        ],
        ["remove", "keep", "remove"],
        ["", "Display the nickname MoonFox.", ""],
        "The profile is ready without exposing an address or giving unrelated access.",
      ),
      signal(
        "Unlock the club workspace.",
        "A different fictional app wants access to a club profile. Inspect its purpose and permissions before opening the workspace.",
        [
          "A reminder tool needs an event time, not the account password.",
          "The fictional club meets on Monday at four.",
          "The avatar can be a drawn character. A school badge is unnecessary.",
        ],
        [
          "Send the account password to the reminder tool.",
          "Set the reminder for Monday at four.",
          "Upload a school badge as the avatar.",
        ],
        ["remove", "keep", "repair"],
        [
          "",
          "Set the reminder for Monday at four.",
          "Use a drawn character as the avatar.",
        ],
        "The workspace has the information it needs without unnecessary identifying details.",
      ),
    ],
  },
  {
    slug: "study-quest",
    name: "The knowledge relay",
    band: "creators",
    zone: "signal",
    subtitle: "Rebuild a revision trail from reliable clues.",
    learning:
      "Revision material made with AI still needs checking against your learning sources.",
    reward: "Knowledge navigator",
    levels: [
      signal(
        "Repair the planet trail.",
        "An example AI revision trail contains two mistakes. Visit the learning stations and connect evidence to repair the trail before another learner follows it.",
        [
          "The supplied science card says Earth orbits the Sun.",
          "The supplied moon card says the Moon reflects sunlight.",
          "The lesson does not state a date for a future Moon city.",
        ],
        [
          "The Sun orbits Earth.",
          "The Moon reflects sunlight.",
          "A Moon city will open next year.",
        ],
        ["repair", "keep", "remove"],
        ["Earth orbits the Sun.", "The Moon reflects sunlight.", ""],
        "The revision trail now matches the supplied science material.",
      ),
      signal(
        "Check a new revision topic.",
        "The next trail is about plants. Use its own source cards and repair the explanations.",
        [
          "The lesson says roots take in water.",
          "The lesson says leaves use light to help plants make food.",
          "The lesson does not claim every plant needs the same amount of water.",
        ],
        [
          "Roots take in water.",
          "Leaves make food without light.",
          "Every plant needs identical watering.",
        ],
        ["keep", "repair", "remove"],
        [
          "Roots take in water.",
          "Leaves use light to help plants make food.",
          "",
        ],
        "You checked a fresh topic rather than carrying over assumptions from the last trail.",
      ),
    ],
  },
  {
    slug: "choose-the-right-helper",
    name: "Mission control",
    band: "studio",
    zone: "launch",
    subtitle: "Give each job to a helper that can do it.",
    learning:
      "Choose AI, a conventional tool or a person according to the job, then check the result.",
    reward: "Tool strategist",
    levels: [
      launch(
        "Open the design studio.",
        "An example AI plan assigns every job to AI. Rebuild the timetable: assign useful helpers, choose the right workstation and leave time for human review.",
        0,
        true,
      ),
      launch(
        "Handle a late opening.",
        "The studio opens one time slot later today. Adapt the schedule and keep the review before release.",
        1,
        true,
      ),
    ],
  },
  {
    slug: "brief-builder",
    name: "Launch Control",
    band: "studio",
    zone: "launch",
    subtitle:
      "Arrange the jobs for a launch, choose who should help and test whether your plan works.",
    learning:
      "A useful brief includes resources, order, limits and checks. Test an AI-suggested plan against these requirements.",
    reward: "Launch director",
    free: true,
    levels: [
      launch(
        "Make the launch work.",
        "Your client needs a performance, an equipment inspection and a ticket check. The prepared plan overlaps jobs and misses who should do them. Build a timetable that meets the brief.",
      ),
      launch(
        "Repair the changed brief.",
        "The equipment arrives one slot later. Update the plan, run it again and check that the performance still starts after inspection.",
        1,
      ),
    ],
  },
  {
    slug: "game-concept-studio",
    name: "Two doors, one world",
    band: "studio",
    zone: "forge",
    subtitle: "Create a level with two playable endings.",
    learning:
      "Creative AI suggestions are starting points. You need to test every branch and repair rules that do not work.",
    reward: "Game maker",
    levels: [
      forge(
        "Make both endings playable.",
        "The example level promises two endings but its routes are unfinished. Build a branch to each door, then send the courier to test both journeys automatically.",
        [3, 10, 17, 24, 31],
        [2, 32],
        [6, 34],
        14,
        [
          "Play through to both ending doors.",
          "Use at most fourteen pieces.",
          "Use bridges over the canal.",
        ],
        ["Dawn ending", "Midnight ending"],
      ),
      forge(
        "Test a different level.",
        "A second level has different obstacles. Make two routes and test both. Working once does not prove a design always works.",
        [2, 9, 16, 23, 30],
        [10, 24],
        [13, 27],
        12,
        [
          "Reach both endings from the start.",
          "Use at most twelve pieces.",
          "Avoid the rocks.",
        ],
        ["Rescue ending", "Discovery ending"],
      ),
    ],
  },
  {
    slug: "evidence-room",
    name: "The evidence room",
    band: "studio",
    zone: "signal",
    subtitle: "Follow the citations before approving the project.",
    learning:
      "A citation is useful only if its source exists and supports the claim being made.",
    reward: "Evidence editor",
    levels: [
      signal(
        "Audit the project brief.",
        "The launch brief cites three district records. Visit their owners, connect each citation and decide what the brief can honestly say.",
        [
          "The test log records a fifteen-minute trial, not an hour.",
          "The event register confirms a Friday presentation.",
          "The archive contains no expert quotation or external award.",
        ],
        [
          "The prototype ran for an hour [test log].",
          "The presentation is on Friday [event register].",
          "Experts awarded the prototype first place [archive].",
        ],
        ["repair", "keep", "remove"],
        [
          "The prototype ran for fifteen minutes [test log].",
          "The presentation is on Friday [event register].",
          "",
        ],
        "The project can be presented with a clear trial limit and no fabricated award.",
      ),
      signal(
        "Check the revised brief.",
        "The next project uses new records. Audit each claim, including one with a plausible but unsupported citation.",
        [
          "The trial included six volunteers, not sixty.",
          "The release log confirms a Tuesday release.",
          "No long-term reliability study has been supplied.",
        ],
        [
          "Sixty volunteers tested the tool.",
          "The tool was released on Tuesday.",
          "Research proves the tool will never fail.",
        ],
        ["repair", "keep", "remove"],
        [
          "Six volunteers tested the tool.",
          "The tool was released on Tuesday.",
          "",
        ],
        "The revised brief states what was actually tested and avoids a claim the evidence cannot support.",
      ),
    ],
  },
  {
    slug: "publish-with-care",
    name: "The release gate",
    band: "studio",
    zone: "signal",
    subtitle: "Prepare a fictional exhibition for publication.",
    learning:
      "Check privacy, permission and misleading presentation before publishing AI-assisted work.",
    reward: "Responsible publisher",
    levels: [
      signal(
        "Open the exhibition safely.",
        "A fictional exhibition includes a visitor profile, an illustration and an AI-made portrait. Inspect the permissions before opening its public gates.",
        [
          "The fictional visitor has not agreed to publication of their email address.",
          "The illustrator has granted exhibition permission with credit to Rowan.",
          "The portrait is synthetic and must not be presented as a real event photograph.",
        ],
        [
          "Publish the visitor's email address.",
          "Show the illustration with credit to Rowan.",
          "Label the synthetic portrait as a real event photograph.",
        ],
        ["remove", "keep", "repair"],
        [
          "",
          "Show the illustration with credit to Rowan.",
          "Label the portrait as an AI-generated illustration.",
        ],
        "The exhibition opens with permission, attribution and an honest image label.",
      ),
      signal(
        "Review a new collection.",
        "The next collection has different permissions. Check the new records before copying any decisions from the previous release.",
        [
          "The fictional interviewee approved a first-name credit only.",
          "The poster licence allows display with the creator's name.",
          "The montage depicts an imagined city, not a documentary scene.",
        ],
        [
          "Publish the interviewee's full profile.",
          "Display the poster with its creator credit.",
          "Describe the montage as documentary evidence.",
        ],
        ["repair", "keep", "repair"],
        [
          "Credit the interviewee by first name only.",
          "Display the poster with its creator credit.",
          "Describe the montage as an imagined city.",
        ],
        "You applied the new permissions and kept the presentation accurate.",
      ),
    ],
  },
  {
    slug: "make-life-easier",
    name: "Festival systems",
    band: "studio",
    zone: "launch",
    subtitle: "Build a plan that survives the rehearsal.",
    learning:
      "Test whether an AI-assisted plan actually helps, adapt it to constraints and explain where people still need to check.",
    reward: "Systems builder",
    levels: [
      launch(
        "Rehearse the club festival.",
        "Help a fictional club run its festival. Set up the stage, inspect it, check ticket totals and run the performance without using the same space for two jobs at once.",
      ),
      launch(
        "Adapt when a delivery is late.",
        "The delivery now arrives one slot later. Repair the plan and rehearse again. Explain what changed and why a person still needs to inspect the equipment.",
        1,
      ),
    ],
  },
];
export function getAdventure(slug: string) {
  return adventures.find((g) => g.slug === slug);
}
