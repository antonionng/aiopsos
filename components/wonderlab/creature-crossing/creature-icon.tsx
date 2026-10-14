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
      {creature.limbs === "legs" && (
        <g>
          <path d={`M${32 + rx - 4} ${bodyY + 2} q12 -4 10 -16 q-8 2 -10 10Z`} fill="#fff5df" stroke={dark} strokeWidth="1.5" />
          <path d={`M21 ${bodyY - ry + 6} L19 ${bodyY - ry - 7} L28 ${bodyY - ry + 1}Z`} fill={dark} />
          <path d={`M43 ${bodyY - ry + 6} L45 ${bodyY - ry - 7} L36 ${bodyY - ry + 1}Z`} fill={dark} />
          <path d={`M22 ${bodyY - ry + 4} L21 ${bodyY - ry - 3} L26 ${bodyY - ry + 1}Z`} fill="#ffb3c7" />
          <path d={`M42 ${bodyY - ry + 4} L43 ${bodyY - ry - 3} L38 ${bodyY - ry + 1}Z`} fill="#ffb3c7" />
        </g>
      )}
      {creature.limbs === "fins" && (
        <g fill="#7fe0ff" stroke="#4fbfe6" strokeWidth="1">
          <path d={`M${32 - rx + 2} ${bodyY + 4} L${32 - rx - 9} ${bodyY - 4} L${32 - rx - 6} ${bodyY + 5} L${32 - rx - 9} ${bodyY + 14}Z`} />
        </g>
      )}
      {creature.limbs === "wings" && (
        <g fill="#fffaf0" stroke="#e7dccb" strokeWidth="1">
          <ellipse cx="27" cy={bodyY + ry - 1} rx="2.5" ry="6" transform={`rotate(30 27 ${bodyY + ry - 1})`} />
          <ellipse cx="37" cy={bodyY + ry - 1} rx="2.5" ry="6" transform={`rotate(-30 37 ${bodyY + ry - 1})`} />
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
      {creature.limbs === "wings" && (
        <>
          <path d={`M29 ${bodyY - ry + 17} L35 ${bodyY - ry + 17} L32 ${bodyY - ry + 21}Z`} fill="#ffb23f" />
          <g fill="#fff5df" stroke={dark} strokeWidth="1">
            <ellipse cx="29" cy={bodyY - ry - 2} rx="1.8" ry="4.5" transform={`rotate(-25 29 ${bodyY - ry - 2})`} />
            <ellipse cx="32" cy={bodyY - ry - 3} rx="1.8" ry="5" />
            <ellipse cx="35" cy={bodyY - ry - 2} rx="1.8" ry="4.5" transform={`rotate(25 35 ${bodyY - ry - 2})`} />
          </g>
        </>
      )}
      {creature.limbs === "legs" && <ellipse cx="32" cy={bodyY - ry + 18} rx="2.6" ry="2" fill="#1c2333" />}
      {creature.limbs === "fins" && (
        <>
          <circle cx="32" cy={bodyY - ry + 19} r="2" fill="none" stroke="#1c2333" strokeWidth="1.4" />
          <circle cx="46" cy={bodyY - ry - 2} r="2.4" fill="#dff7ff" stroke="#9fdcf2" />
          <circle cx="50" cy={bodyY - ry - 8} r="1.6" fill="#dff7ff" stroke="#9fdcf2" />
        </>
      )}
    </svg>
  );
}
