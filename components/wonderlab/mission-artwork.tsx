import type { Band } from "@/lib/wonderlab/types";

const scenes: Record<Band, string[]> = {
  explorers: [
    "Pip sorting a colourful picnic in an orchard",
    "Pip crossing a bridge towards an island treehouse",
    "A picture book opens into a magical story garden",
    "Pip investigating a picture with a magnifying glass",
    "Pip protecting a treasure chest in a woodland hideout",
    "Pip building a helpful invention in a sunny workshop",
  ],
  inventors: [
    "A laboratory full of unusual creatures to investigate",
    "A creature with leaf camouflage and rain boots in the jungle",
    "A colourful comic-making workshop",
    "A detective treehouse full of evidence",
    "A glowing shield protecting private messages",
    "An invention workshop for creative hobbies",
  ],
  creators: [
    "An observatory exploring patterns and predictions",
    "A futuristic workshop for repairing instructions",
    "A fictional city assembled from imaginary landscapes",
    "A newsroom for tracing claims to their sources",
    "A digital escape room with keys and permission gates",
    "A library transformed into a study adventure",
  ],
  studio: [
    "A creative workspace for choosing useful tools",
    "A poster design studio with evidence and editing tools",
    "A branching story with two paths to explore",
    "An investigation room for checking project evidence",
    "A publishing studio for reviewing privacy and permissions",
    "A creative workspace for planning a club project",
  ],
};

export function MissionArtwork({
  band,
  number,
  className = "",
}: {
  band: Band;
  number: number;
  className?: string;
}) {
  const index = Math.max(0, Math.min(5, number - 1));
  return (
    <div
      className={`wl-mission-illustration ${className}`}
      role="img"
      aria-label={scenes[band][index]}
      style={{
        backgroundImage: `url(/images/wonderlab/${band}-missions.webp)`,
        backgroundPosition: `${(index % 2) * 100}% ${Math.floor(index / 2) * 50}%`,
      }}
    />
  );
}
