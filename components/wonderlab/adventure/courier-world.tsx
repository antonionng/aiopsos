"use client";
import { useId } from "react";
import { neighbours } from "@/lib/wonderlab/adventure/engine";
import type { ForgeLevel } from "@/lib/wonderlab/adventure/types";

export function CourierWorld({
  level,
  pieces,
  position,
  gap,
  running,
  solved,
  testedGoals,
  disabled,
  onPlace,
}: {
  level: ForgeLevel;
  pieces: number[];
  position: number;
  gap: number | null;
  running: boolean;
  solved: boolean;
  testedGoals: number[];
  disabled: boolean;
  onPlace: (cell: number) => void;
}) {
  const id = useId().replace(/:/g, "");
  const x = (cell: number) => (cell % level.width) * 100 + 50;
  const y = (cell: number) => Math.floor(cell / level.width) * 100 + 50;
  const connected = new Set([level.start, ...level.goals, ...pieces]);
  return (
    <div
      className={`wd-courier-world ${running ? "is-running" : ""} ${solved ? "is-delivered" : ""}`}
    >
      <svg
        viewBox={`0 0 ${level.width * 100} ${level.height * 100}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${id}-land`} x2="0.8" y2="1">
            <stop stopColor="#245b51" />
            <stop offset="1" stopColor="#143c40" />
          </linearGradient>
          <linearGradient id={`${id}-water`} x2="1" y2="1">
            <stop stopColor="#44c3cf" />
            <stop offset="1" stopColor="#2587ab" />
          </linearGradient>
          <radialGradient id={`${id}-light`}>
            <stop stopColor="#f8e9a1" stopOpacity=".3" />
            <stop offset="1" stopColor="#f8e9a1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-robot`} x2="0.5" y2="1">
            <stop stopColor="#fffdf2" />
            <stop offset="1" stopColor="#aecdc7" />
          </linearGradient>
        </defs>
        <rect width="700" height="500" fill={`url(#${id}-land)`} />
        <ellipse
          cx="530"
          cy="80"
          rx="270"
          ry="190"
          fill={`url(#${id}-light)`}
        />
        {Array.from({ length: level.width * level.height }, (_, cell) => (
          <g key={cell}>
            {level.water.includes(cell) ? (
              <g>
                <rect
                  x={x(cell) - 50}
                  y={y(cell) - 50}
                  width="100"
                  height="100"
                  fill={`url(#${id}-water)`}
                />
                <path
                  d={`M${x(cell) - 34},${y(cell) - 22}q16,-7 32,0t30,0 M${x(cell) - 22},${y(cell) + 26}q16,-7 32,0t24,0`}
                  fill="none"
                  stroke="#b9f3e9"
                  strokeOpacity=".35"
                  strokeWidth="3"
                  className="wd-current"
                />
              </g>
            ) : (
              <g fill="#83b990" opacity=".22">
                <path
                  d={`M${x(cell) - 28},${y(cell) + 30}l-3,-8m3,8l4,-6 M${x(cell) + 28},${y(cell) - 24}l-3,-8m3,8l4,-6`}
                  fill="none"
                  stroke="#8ac998"
                  strokeWidth="2"
                />
                <circle cx={x(cell) + 32} cy={y(cell) + 29} r="2" />
              </g>
            )}
          </g>
        ))}
        {[...connected].flatMap((cell) =>
          neighbours(level, cell)
            .filter((next) => next > cell && connected.has(next))
            .map((next) => (
              <g key={`${cell}-${next}`}>
                <path
                  d={`M${x(cell)},${y(cell) + 5}L${x(next)},${y(next) + 5}`}
                  stroke="#133e36"
                  strokeWidth="37"
                  strokeLinecap="round"
                />
                <path
                  d={`M${x(cell)},${y(cell)}L${x(next)},${y(next)}`}
                  stroke="#c6b58a"
                  strokeWidth="30"
                  strokeLinecap="round"
                />
                <path
                  d={`M${x(cell)},${y(cell)}L${x(next)},${y(next)}`}
                  stroke="#e9d9af"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
              </g>
            )),
        )}
        {pieces.map((cell) => (
          <g key={cell} transform={`translate(${x(cell)} ${y(cell)})`}>
            {level.water.includes(cell) ? (
              <g className="wd-world-build">
                <rect
                  x="-47"
                  y="-24"
                  width="94"
                  height="54"
                  rx="6"
                  fill="#175d71"
                />
                <rect
                  x="-47"
                  y="-28"
                  width="94"
                  height="48"
                  rx="4"
                  fill="#e7ad76"
                  stroke="#8c614b"
                  strokeWidth="3"
                />
                {[-30, -15, 0, 15, 30].map((n) => (
                  <path
                    key={n}
                    d={`M${n},-27v45`}
                    stroke="#b97e58"
                    strokeWidth="3"
                  />
                ))}
                <path
                  d="M-48,-30h96M-48,23h96"
                  stroke="#fbe0b5"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <g className="wd-world-build">
                <ellipse cy="4" rx="21" ry="16" fill="#123e35" />
                <rect
                  x="-21"
                  y="-18"
                  width="42"
                  height="32"
                  rx="12"
                  fill="#eadab2"
                />
                <path
                  d="M-11,-8h11m-4,14h13"
                  stroke="#c3ae83"
                  strokeWidth="2"
                />
              </g>
            )}
          </g>
        ))}
        {level.rocks.map((cell) => (
          <g key={cell} transform={`translate(${x(cell)} ${y(cell)})`}>
            <ellipse cy="25" rx="38" ry="16" fill="#103530" opacity=".7" />
            <path
              d="M-31,18L-38,-10L-16,-39L13,-32L36,-9L26,23Z"
              fill="#8b94a0"
              stroke="#4e6470"
              strokeWidth="4"
            />
            <path
              d="M-38,-10L-8,-6L-16,-39M-8,-6L26,23M-8,-6L36,-9"
              fill="none"
              stroke="#b8bec1"
              strokeWidth="3"
            />
            <path d="M-13,8l8,-8m-8,0l8,8" stroke="#526573" strokeWidth="3" />
          </g>
        ))}
        {level.goals.map((cell, i) => (
          <g key={cell} transform={`translate(${x(cell)} ${y(cell)})`}>
            <ellipse cy="25" rx="43" ry="18" fill="#092f32" opacity=".65" />
            <rect
              x="-30"
              y="-20"
              width="60"
              height="47"
              rx="7"
              fill="#f4dfbd"
            />
            <path
              d="M-39,-17L0,-47L39,-17Z"
              fill={testedGoals.includes(cell) ? "#a0db9e" : "#ac97e1"}
              stroke="#625789"
              strokeWidth="3"
            />
            <rect x="-10" y="3" width="20" height="24" rx="5" fill="#335a62" />
            <rect x="-23" y="-9" width="12" height="12" rx="3" fill="#ffc66e" />
            <rect x="12" y="-9" width="12" height="12" rx="3" fill="#ffc66e" />
            <circle
              cx="30"
              cy="-40"
              r="12"
              fill={testedGoals.includes(cell) ? "#b6edac" : "#fff6d9"}
            />
            <text
              x="30"
              y="-36"
              textAnchor="middle"
              fill="#243b42"
              fontSize="12"
              fontWeight="800"
            >
              {testedGoals.includes(cell) ? "✓" : i + 1}
            </text>
          </g>
        ))}
        <g transform={`translate(${x(level.start)} ${y(level.start)})`}>
          <ellipse rx="34" ry="23" fill="#a8d9c0" opacity=".28" />
          <ellipse
            rx="25"
            ry="16"
            fill="none"
            stroke="#b7ddc7"
            strokeWidth="2"
            strokeDasharray="4 5"
          />
          <text
            y="39"
            textAnchor="middle"
            fill="#d2edda"
            fontSize="10"
            fontWeight="700"
          >
            DEPOT
          </text>
        </g>
        {gap !== null && (
          <g
            className="wd-world-gap"
            transform={`translate(${x(gap)} ${y(gap)})`}
          >
            <circle
              r="33"
              fill="#ffc875"
              fillOpacity=".14"
              stroke="#ffe0a2"
              strokeWidth="3"
              strokeDasharray="7 4"
            />
            <text
              y="7"
              textAnchor="middle"
              fill="#fff0cb"
              fontSize="28"
              fontWeight="700"
            >
              +
            </text>
          </g>
        )}
        <g
          className="wd-courier"
          style={{ transform: `translate(${x(position)}px, ${y(position)}px)` }}
        >
          <ellipse cy="18" rx="23" ry="8" fill="#15332e" opacity=".4" />
          <g className="wd-courier-body">
            <path
              d="M-17,3l-16,7v-12l15,-5M17,3l16,7v-12l-15,-5"
              fill="#f4b26c"
              stroke="#425563"
              strokeWidth="2"
            />
            <rect
              x="-18"
              y="-23"
              width="36"
              height="37"
              rx="14"
              fill={`url(#${id}-robot)`}
              stroke="#365766"
              strokeWidth="2"
            />
            <rect
              x="-13"
              y="-16"
              width="26"
              height="16"
              rx="7"
              fill="#25414c"
            />
            <path
              d="M-6,-10v4m12,-4v4"
              stroke="#91efdb"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect x="-8" y="3" width="16" height="9" rx="3" fill="#9c7fd4" />
            <path d="M0,-24v-7" stroke="#aac5c3" strokeWidth="3" />
            <circle cy="-33" r="4" fill="#ffce7f" />
          </g>
        </g>
        <g className="wd-world-fireflies" fill="#f4e6a0" opacity=".6">
          <circle cx="68" cy="76" r="2" />
          <circle cx="598" cy="377" r="2" />
          <circle cx="233" cy="452" r="2" />
        </g>
      </svg>
      <div
        className="wd-world-hotspots"
        role="group"
        aria-label="Build your delivery route. Select a space to add or remove a path; select water to add or remove a bridge."
        style={{ gridTemplateColumns: `repeat(${level.width},1fr)` }}
      >
        {Array.from({ length: level.width * level.height }, (_, cell) => (
          <button
            key={cell}
            disabled={
              disabled ||
              level.rocks.includes(cell) ||
              cell === level.start ||
              level.goals.includes(cell)
            }
            aria-label={`Column ${(cell % level.width) + 1}, row ${Math.floor(cell / level.width) + 1}: ${level.goals.includes(cell) ? level.goalNames[level.goals.indexOf(cell)] : cell === level.start ? "depot" : level.rocks.includes(cell) ? "rock" : pieces.includes(cell) ? (level.water.includes(cell) ? "remove bridge" : "remove path") : level.water.includes(cell) ? "add bridge" : "add path"}`}
            aria-pressed={pieces.includes(cell)}
            onClick={() => onPlace(cell)}
          >
            <span aria-hidden="true">{pieces.includes(cell) ? "−" : "+"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
