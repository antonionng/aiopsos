import type { Creature, Home } from "@/lib/wonderlab/creature-crossing";

const FILL: Record<Creature["colour"], string> = { blue: "#4d9cff", orange: "#ff9636", green: "#4fcf6d", pink: "#ff78c0" };
const DARK: Record<Creature["colour"], string> = { blue: "#2f6fc4", orange: "#c86a1c", green: "#2f9a4a", pink: "#c84f92" };

export const HOME_GLYPH: Record<Home, string> = { river: "🌊", woods: "🌳", sky: "☁️" };

/** A flat portrait of a creature, drawn from the same features the gate compares. */
export function CreatureIcon({ creature, size = 64, title }: { creature: Creature; size?: number; title?: string }) {
  const fill = FILL[creature.colour];
  const dark = DARK[creature.colour];
  const tall = creature.shape === "tall";
  const bodyY = tall ? 34 : 38;
  const rx = tall ? 15 : 19;
  const ry = tall ? 23 : 17;
  const clip = `cc-clip-${creature.id}`;
  const label = title ?? `${creature.colour}, ${creature.pattern}, ${creature.shape} body, ${creature.limbs}`;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} role="img" aria-label={label} className="cc-icon">
      <defs>
        <clipPath id={clip}>
          <ellipse cx="32" cy={bodyY} rx={rx} ry={ry} />
        </clipPath>
      </defs>
      <ellipse cx="32" cy="60" rx="16" ry="3" fill="#00000022" />
      {creature.limbs === "wings" && (
        <g fill="#fffaf0" stroke="#e7dccb" strokeWidth="1.2">
          <ellipse cx={32 - rx - 7} cy={bodyY - 2} rx="11" ry="5" transform={`rotate(-20 ${32 - rx - 7} ${bodyY - 2})`} />
          <ellipse cx={32 + rx + 7} cy={bodyY - 2} rx="11" ry="5" transform={`rotate(20 ${32 + rx + 7} ${bodyY - 2})`} />
        </g>
      )}
      {creature.limbs === "legs" && (
        <g fill={dark}>
          <rect x="21" y={bodyY + ry - 5} width="6" height="12" rx="3" />
          <rect x="37" y={bodyY + ry - 5} width="6" height="12" rx="3" />
        </g>
      )}
      {creature.limbs === "fins" && (
        <g fill="#7fe0ff" stroke="#4fbfe6" strokeWidth="1">
          <ellipse cx={32 - rx - 2} cy={bodyY + 3} rx="4" ry="8" transform={`rotate(25 ${32 - rx - 2} ${bodyY + 3})`} />
          <ellipse cx={32 + rx + 2} cy={bodyY + 3} rx="4" ry="8" transform={`rotate(-25 ${32 + rx + 2} ${bodyY + 3})`} />
          <ellipse cx="32" cy={bodyY - ry - 1} rx="3" ry="6" />
        </g>
      )}
      {creature.shape === "spiky" && (
        <g fill={dark}>
          {[-14, -7, 0, 7, 14].map((dx) => (
            <path key={dx} d={`M${32 + dx - 4} ${bodyY - ry + 5 + Math.abs(dx) * 0.5} L${32 + dx} ${bodyY - ry - 6 + Math.abs(dx) * 0.6} L${32 + dx + 4} ${bodyY - ry + 5 + Math.abs(dx) * 0.5}Z`} />
          ))}
        </g>
      )}
      <ellipse cx="32" cy={bodyY} rx={rx} ry={ry} fill={fill} />
      <g clipPath={`url(#${clip})`} fill="#fff5df">
        {creature.pattern === "stripes" && [-9, 0, 9].map((dy) => <rect key={dy} x="0" y={bodyY + dy + 2} width="64" height="3.6" />)}
        {creature.pattern === "spots" && (
          <>
            <circle cx="22" cy={bodyY + 6} r="3.2" />
            <circle cx="41" cy={bodyY + 9} r="2.8" />
            <circle cx="35" cy={bodyY + 2} r="2.2" />
            <circle cx="26" cy={bodyY + 13} r="2.2" />
          </>
        )}
        {creature.pattern === "plain" && <ellipse cx="32" cy={bodyY + 8} rx={rx - 7} ry={ry - 8} fill="#ffffff40" />}
      </g>
      <g>
        <circle cx="26" cy={bodyY - ry + 11} r="5" fill="#fff" />
        <circle cx="38" cy={bodyY - ry + 11} r="5" fill="#fff" />
        <circle cx="26.8" cy={bodyY - ry + 11.6} r="2.4" fill="#1c2333" />
        <circle cx="38.8" cy={bodyY - ry + 11.6} r="2.4" fill="#1c2333" />
      </g>
      {creature.limbs === "wings" && <path d={`M29 ${bodyY - ry + 17} L35 ${bodyY - ry + 17} L32 ${bodyY - ry + 21}Z`} fill="#ffb23f" />}
    </svg>
  );
}
