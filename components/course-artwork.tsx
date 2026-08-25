import type { CourseCategory } from "@/lib/constants";

/**
 * Abstract artwork per subject.
 *
 * Openly graphic rather than pretending to be a photograph of a course. For a
 * training academy the images that actually sell are photographs of real
 * delivery, and stock or generated imagery would undercut the claim that a
 * person teaches this. Until there are real photos, this gives the three
 * subjects a visual identity without lying about anything.
 *
 * Inline SVG using currentColor, so it inherits the theme rather than needing
 * a light and a dark asset.
 */

function AiArtwork() {
  // A small network: nodes and the connections between them.
  const nodes = [
    [22, 30], [58, 18], [92, 38], [40, 58], [76, 66], [14, 68],
  ];
  const links = [[0, 1], [1, 2], [0, 3], [3, 4], [2, 4], [0, 5], [3, 5]];
  return (
    <svg viewBox="0 0 110 84" className="h-full w-full" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.7" opacity="0.35">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 4 : 2.6}
                fill="currentColor" opacity={i % 3 === 0 ? 0.9 : 0.5} />
      ))}
    </svg>
  );
}

function TechnologyArtwork() {
  // Stacked layers: the tools already in place, being used properly.
  return (
    <svg viewBox="0 0 110 84" className="h-full w-full" aria-hidden="true">
      <g stroke="currentColor" fill="none" strokeWidth="1.1">
        <rect x="18" y="50" width="74" height="16" rx="3" opacity="0.75" />
        <rect x="26" y="32" width="58" height="16" rx="3" opacity="0.5" />
        <rect x="34" y="14" width="42" height="16" rx="3" opacity="0.3" />
      </g>
      <g fill="currentColor" opacity="0.85">
        <circle cx="26" cy="58" r="2.2" />
        <circle cx="34" cy="40" r="2.2" />
        <circle cx="42" cy="22" r="2.2" />
      </g>
    </svg>
  );
}

function RoboticsArtwork() {
  // An articulated arm and its arc of travel.
  return (
    <svg viewBox="0 0 110 84" className="h-full w-full" aria-hidden="true">
      <path d="M20 70 L20 44 L48 30 L78 40" stroke="currentColor" strokeWidth="2.4"
            fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <path d="M78 40 l9 -5 M78 40 l7 7" stroke="currentColor" strokeWidth="2.2"
            fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M34 24 A 36 36 0 0 1 92 44" stroke="currentColor" strokeWidth="0.8"
            fill="none" strokeDasharray="3 4" opacity="0.4" />
      <rect x="12" y="68" width="18" height="5" rx="1.6" fill="currentColor" opacity="0.7" />
      <circle cx="20" cy="44" r="3.4" fill="currentColor" />
      <circle cx="48" cy="30" r="3" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

const ARTWORK: Record<CourseCategory, () => React.JSX.Element> = {
  ai: AiArtwork,
  technology: TechnologyArtwork,
  robotics: RoboticsArtwork,
};

// The SVGs draw in currentColor, so the subject hue is one class here.
const ARTWORK_COLOR: Record<CourseCategory, string> = {
  ai: "text-cat-ai",
  technology: "text-cat-technology",
  robotics: "text-cat-robotics",
};

export function CourseArtwork({
  category,
  className = "",
}: {
  category: CourseCategory;
  className?: string;
}) {
  const Art = ARTWORK[category] ?? AiArtwork;
  const color = ARTWORK_COLOR[category] ?? "text-foreground/70";
  return (
    <div className={`pointer-events-none ${color} ${className}`}>
      <Art />
    </div>
  );
}
