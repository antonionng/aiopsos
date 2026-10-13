import { validateArcadeDesign, type ArcadeDesign, type WorldBand } from "./first-person.ts";
import { narrationId } from "./narration.ts";

export type ArcadeVisitor = "moss" | "nova";
export type ArcadeChapter = "first-game" | "key-quest" | "visitor-game";
export type ArcadeAdventure = {
  version: 1;
  visitor: ArcadeVisitor;
  creations: { chapter: ArcadeChapter; design: ArcadeDesign }[];
};
export const NEW_ADVENTURE: ArcadeAdventure = { version: 1, visitor: "moss", creations: [] };
const chapters: ArcadeChapter[] = ["first-game", "key-quest", "visitor-game"];

export function currentChapter(adventure: ArcadeAdventure): ArcadeChapter | "opened" {
  return chapters[adventure.creations.length] ?? "opened";
}

export function chapterFits(chapter: ArcadeChapter, design: ArcadeDesign, visitor: ArcadeVisitor): boolean {
  if (chapter === "first-game") return design.challenge === "collect";
  if (chapter === "key-quest") return design.challenge === "key";
  return visitor === "moss"
    ? design.target === 3 && design.speed === "calm" && design.challenge === "collect"
    : design.target >= 5 && design.challenge === "key";
}

/** Local playtest evidence, never an assessment or an account entitlement. */
export function finishArcadeChapter(adventure: ArcadeAdventure, design: ArcadeDesign, play: { collected: number; keyFound: boolean; enteredPortal: boolean }): ArcadeAdventure {
  const valid = validateArcadeDesign(design);
  const chapter = currentChapter(adventure);
  if (!valid || chapter === "opened" || !play.enteredPortal || play.collected < valid.target
    || (valid.challenge === "key" && !play.keyFound) || !chapterFits(chapter, valid, adventure.visitor)) return adventure;
  if (chapter === "visitor-game" && sameGameRules(valid, adventure.creations[1].design)) return adventure;
  return { ...adventure, creations: [...adventure.creations, { chapter, design: valid }] };
}

function sameGameRules(a: ArcadeDesign, b: ArcadeDesign) {
  return a.collectible === b.collectible && a.target === b.target && a.palette === b.palette
    && a.speed === b.speed && a.bonus === b.bonus && a.challenge === b.challenge;
}

export function restoreArcadeAdventure(value: unknown): ArcadeAdventure | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (v.version !== 1 || (v.visitor !== "moss" && v.visitor !== "nova") || !Array.isArray(v.creations) || v.creations.length > 3) return null;
  const creations: ArcadeAdventure["creations"] = [];
  for (let i = 0; i < v.creations.length; i++) {
    const entry = v.creations[i];
    if (!entry || typeof entry !== "object" || entry.chapter !== chapters[i]) return null;
    const design = validateArcadeDesign(entry.design);
    if (!design || !chapterFits(chapters[i], design, v.visitor) || (i === 2 && sameGameRules(design, creations[1].design))) return null;
    creations.push({ chapter: chapters[i], design });
  }
  return { version: 1, visitor: v.visitor, creations };
}

export function arcadeBrief(adventure: ArcadeAdventure, band: WorldBand) {
  const young = band === "explorers";
  switch (currentChapter(adventure)) {
    case "first-game": return {
      title: "Make the arcade’s first game.", speaker: "Mira, the arcade keeper", number: 1,
      story: young ? "Mira is opening her magical arcade. Make a treasure game for her first visitors." : "The lantern festival is tonight, but Mira’s arcade has no games. Create a treasure hunt that visitors can step inside.",
      goal: "Choose a world, a treasure and how many pieces the player will find. For this first game, the treasure opens the portal without a key.",
      learning: "You will turn an idea into clear instructions that make a playable game.",
      hint: "Make a forest game with three crystals. Remove the key.",
    };
    case "key-quest": return {
      title: "Turn your game into a key quest.", speaker: "Nova, the explorer", number: 2,
      story: young ? "Nova loves finding hidden things. Add a key that opens the portal." : "Nova wants a treasure hunt with a locked portal. Keep your creation and add a golden key that the player must find before the portal will open.",
      goal: "Add a key, then find the treasure and the key in your game.",
      learning: "You will improve an existing creation by asking for one new game rule.",
      hint: "Keep my world and treasure. Add a key that unlocks the portal.",
    };
    case "visitor-game": return {
      title: "Make a game for your visitor.", speaker: "You are the arcade designer", number: 3,
      story: young ? "Choose who will play. Make a game they will enjoy." : "The first visitors have arrived. Choose who you are designing for, then use what you have learnt to make a game that suits them.",
      goal: adventure.visitor === "moss" ? "Make a new version for Moss with three treasures, a gentle walking speed and no key to find." : "Make a new version for Nova with at least five treasures and a key to find before opening the portal.",
      learning: "You will tell a helper who your creation is for and turn their needs into a playable idea.",
      hint: adventure.visitor === "moss" ? "Make a calm game with three stars. Remove the key." : `Make a ${adventure.creations[1]?.design.palette === "sunset" ? "forest" : "sunset"} game with five fireflies and a key that unlocks the portal.`,
    };
    default: return {
      title: "Your arcade is open.", speaker: "Mira, the arcade keeper", number: 3,
      story: "The festival has three games made by you. You can keep exploring, change your ideas or download a game to play again.",
      goal: "Choose what you would like to create next.", learning: "You have practised describing, improving and adapting a creation.",
      hint: "Make a sunset game with five fireflies and a bonus treasure.",
    };
  }
}

const youngLines = {
  explore: "Mira needs a game for her magical arcade. Let’s go to the glowing workshop and make one together.",
  create: "Choose a place and some treasure. Your choices become words that tell the helper what to make. We call these words a prompt.",
  play: "You chose what this game would be. Walk up to the glowing treasure to collect it. The counter shows how many you have found.",
  collected: "You found some treasure. Your words told the helper what to put here. Keep going to find the rest.",
  keyCreate: "Let’s give your game a new rule. Ask for a key to open the portal. Then step inside and find it.",
  keyPlay: "You added a key hunt. Find the treasure and the golden key. You need both to open the portal.",
  keyFound: "You found the key. It belongs to the rule you added. Find any treasure you still need, then walk to the portal.",
  portal: "The portal is open. Walk through the glowing arch to finish your game.",
  visitor: "Who will play your game? Choose a visitor. Listen to what they like, then make a game for them.",
  finished: "You made three games for the festival. You chose an idea, added a rule and made a game for someone else. Mira can open the arcade now.",
};
const olderLines: typeof youngLines = {
  explore: "Mira needs games for tonight’s lantern festival. Visit the glowing workshop to create the arcade’s first treasure hunt.",
  create: "A prompt is the instruction you give an AI tool. Name the world, what players collect and how many they need. This practice helper turns those choices into a game you can play.",
  play: "Your instructions chose the world and the player’s goal. Try the game you made. As you explore, notice how those choices affect the experience.",
  collected: "The treasure and the counter come from your instructions. Changing the number changes how much exploring a player needs to do.",
  keyCreate: "You can improve a creation without starting again. Ask the helper to keep your world and add a key that opens the portal. That changes what the player needs to do.",
  keyPlay: "Your new instruction added a game rule. Collect the treasure and find the golden key. The portal will open when you have both.",
  keyFound: "You found the key that your instruction added. Once you have all the treasure, the portal will open. You have changed how the game works, as well as how it looks.",
  portal: "Your game’s goal is complete. Walk through the glowing portal to finish this playthrough.",
  visitor: "A useful prompt starts with the person you are helping. Choose a visitor and turn their wishes into game instructions. You can use the same approach when asking AI for a study activity, a presentation or a design.",
  finished: "You created a game, changed its rules and adapted it for someone else. Those are useful habits when making things with AI. Your three creations are ready for Mira’s festival arcade.",
};
export type ArcadeTeachingMoment = keyof typeof youngLines;
export function arcadeTeaching(band: WorldBand, moment: ArcadeTeachingMoment): string {
  return (band === "explorers" ? youngLines : olderLines)[moment];
}
export function arcadeNarrationScripts() {
  return (["explorers", "inventors"] as const).flatMap((band) => Object.values(band === "explorers" ? youngLines : olderLines).map((text) => ({ id: narrationId(band, text), band, text })));
}

export function arcadeLearningSummary(adventure: ArcadeAdventure): string[] {
  return adventure.creations.map(({ chapter, design }) => {
    const treasure = design.collectible === "firefly" ? "fireflies" : `${design.collectible}s`;
    if (chapter === "first-game") return `Created and played a ${design.palette} game with ${design.target} ${treasure}. This practises describing a clear creative goal.`;
    if (chapter === "key-quest") return "Added a key-finding rule and finished the game with that rule. This practises revising a creation with an additional instruction.";
    return `Adapted and played a game for ${adventure.visitor === "moss" ? "Moss, who wanted a short, gentle treasure hunt" : "Nova, who wanted a longer key quest"}. This practises designing for another person.`;
  });
}
