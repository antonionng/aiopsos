"use client";

import { useId } from "react";
import type { CSSProperties } from "react";

type GardenBand = "explorers" | "inventors" | "creators" | "studio";
type Point = { x: number; y: number };

export const GARDEN_PLACES = [
  {
    id: "keeper",
    name: "The gardener",
    x: 220,
    y: 435,
    action: "Talk to the gardener.",
  },
  { id: "guide", name: "Pip", x: 470, y: 515, action: "Ask Pip for help." },
  {
    id: "seed",
    name: "The seed cabinet",
    x: 342,
    y: 240,
    action: "Inspect the seed cabinet.",
  },
  {
    id: "sun",
    name: "The sun sensor",
    x: 700,
    y: 160,
    action: "Inspect the sun sensor.",
  },
  {
    id: "water",
    name: "The waterwheel",
    x: 825,
    y: 415,
    action: "Inspect the waterwheel.",
  },
  {
    id: "console",
    name: "The greenhouse",
    x: 650,
    y: 350,
    action: "Use the greenhouse controls.",
  },
] as const;

function Tree({
  x,
  y,
  scale = 1,
  shade = 0,
}: Point & { scale?: number; shade?: number }) {
  const colours = ["#276858", "#307a62", "#39836a", "#24564e"];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cy="10" rx="57" ry="22" fill="#103f39" opacity=".25" />
      <path d="M-7,8l3,-83h16L10,8Z" fill="#81624a" />
      <path
        d="M3,-32l-25,-28M7,-49l25,-20"
        stroke="#81624a"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <g
        className="wq-world-tree-crown"
        style={{ animationDelay: `${shade * -1.3}s` }}
      >
        <path
          d="M-52,-65C-75,-81 -68,-112 -39,-118C-36,-150 2,-166 25,-139C54,-151 81,-124 64,-95C87,-65 51,-36 22,-47C-3,-27 -39,-36 -52,-65Z"
          fill={colours[shade % colours.length]}
        />
        <path
          d="M-39,-118C-36,-150 2,-166 25,-139C54,-151 81,-124 64,-95C28,-117 6,-87 -24,-103Z"
          fill="#5aa078"
          opacity=".57"
        />
        <path
          d="M-54,-92q18,-16 32,-7M0,-130q20,-8 29,7M25,-74q18,-13 28,-4"
          stroke="#93bb7d"
          strokeWidth="6"
          strokeLinecap="round"
          opacity=".38"
          fill="none"
        />
        {shade === 1 && (
          <g fill="#f2c15c">
            <circle cx="-23" cy="-81" r="6" />
            <circle cx="35" cy="-104" r="6" />
            <circle cx="8" cy="-58" r="5" />
          </g>
        )}
      </g>
    </g>
  );
}

function Plant({
  x,
  y,
  blooming,
  colour = "#f7b3cb",
  scale = 1,
}: Point & { blooming: boolean; colour?: string; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cy="4" rx="14" ry="5" fill="#304c3b" opacity=".23" />
      <g
        className={
          blooming ? "wq-world-plant is-blooming" : "wq-world-plant is-thirsty"
        }
      >
        <path
          d={blooming ? "M0,0Q-4,-18 0,-37" : "M0,0Q-8,-28 9,-23"}
          stroke={blooming ? "#347748" : "#82744d"}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={
            blooming
              ? "M-2,-13Q-25,-33 -21,-11Q-12,-2 -2,-13 M-2,-22Q21,-43 22,-19Q11,-9 -2,-22"
              : "M-2,-13Q-26,-16 -17,2Q-7,2 -2,-13 M1,-20Q23,-19 17,-2Q5,-4 1,-20"
          }
          fill={blooming ? "#72ad5c" : "#ac9a5e"}
        />
        {blooming && (
          <g transform="translate(0 -37)" className="wq-world-flower">
            <path
              d="M0,-3C-18,-23 -26,6 -7,8C-16,24 14,29 12,10C33,9 18,-17 4,-9C10,-27 -13,-26 0,-3Z"
              fill={colour}
            />
            <circle r="6" fill="#ffe08b" />
          </g>
        )}
      </g>
    </g>
  );
}

function Gardener() {
  return (
    <g transform="translate(220 414)" className="wq-world-gardener">
      <ellipse cy="18" rx="30" ry="10" fill="#193f35" opacity=".3" />
      <path
        d="M-12,-10v24m25,-24v24"
        stroke="#435d6c"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M-18,15h12m13,0h15"
        stroke="#293e46"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path d="M-24,-36q23,-14 45,0l3,29h-49Z" fill="#e9956d" />
      <path d="M-10,-38h20l9,35h-40Z" fill="#a9c095" />
      <path d="M-5,-21h12v12H-5Z" fill="#789378" />
      <path
        d="M-25,-31l-9,22m54,-24l18,9"
        stroke="#b77755"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <ellipse cy="-55" rx="22" ry="23" fill="#bb805c" />
      <path
        d="M-21,-56q-5,-21 18,-24q25,-1 25,27l-5,-6q-5,-2 -7,-13q-15,16 -31,16Z"
        fill="#393c38"
      />
      <ellipse cy="-71" rx="34" ry="8" fill="#c2a573" />
      <path d="M-23,-73l5,-18q18,-9 35,0l6,18Z" fill="#e7c78b" />
      <path d="M-22,-73h44" stroke="#9b7859" strokeWidth="5" />
      <circle cx="-7" cy="-52" r="2" fill="#2c3435" />
      <circle cx="8" cy="-52" r="2" fill="#2c3435" />
      <path
        d="M-4,-42q5,4 10,-1"
        fill="none"
        stroke="#704a39"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g transform="translate(42 -17)">
        <path d="M-3,-3l8,-8h13v17H-5Z" fill="#8fc4b8" />
        <path
          d="M18,-8q14,-8 14,2q0,10 -14,9"
          fill="none"
          stroke="#72ab9e"
          strokeWidth="4"
        />
        <path d="M-5,0l-13,-8l-3,4l16,13" fill="#8fc4b8" />
      </g>
    </g>
  );
}

function Explorer() {
  return (
    <g className="wq-world-explorer-body">
      <ellipse cy="6" rx="24" ry="8" fill="#193a35" opacity=".3" />
      <path
        d="M-10,-17l-2,20m23,-20l2,20"
        stroke="#334355"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M-16,4h9m15,0h10"
        stroke="#27323c"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect x="-23" y="-47" width="19" height="31" rx="7" fill="#a17555" />
      <path d="M-18,-43q18,-12 36,0l3,28q-20,8 -42,0Z" fill="#b9a0eb" />
      <path d="M-5,-44v29" stroke="#e1d1f8" strokeWidth="3" />
      <path
        d="M-20,-37l-9,20m47,-20l9,20"
        stroke="#d39b75"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <ellipse cy="-62" rx="21" ry="22" fill="#e2ae83" />
      <path
        d="M-22,-60q-6,-26 19,-28q23,-2 25,26l-8,-5l-8,-14q-4,17 -28,21Z"
        fill="#493d39"
      />
      <path d="M-25,-76q25,-17 48,0l-2,-8q-18,-16 -39,0Z" fill="#655293" />
      <path
        d="M-25,-75q25,-9 49,0"
        stroke="#8a70bb"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="-7" cy="-60" r="2.3" fill="#342e32" />
      <circle cx="8" cy="-60" r="2.3" fill="#342e32" />
      <path
        d="M-4,-49q5,3 9,-1"
        fill="none"
        stroke="#955f4d"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M5,-37l7,7l-7,7l-7,-7Z" fill="#ffe3a2" />
    </g>
  );
}

function Pip() {
  return (
    <g className="wq-world-pip-body">
      <ellipse cy="9" rx="17" ry="5" fill="#1a4140" opacity=".22" />
      <g className="wq-world-pip-hover">
        <path d="M-10,-8l-4,13l11,-5m13,-8l4,13l-11,-5" fill="#bfa3ed" />
        <rect
          x="-13"
          y="-15"
          width="26"
          height="20"
          rx="8"
          fill="#b39ad9"
          stroke="#3f5260"
          strokeWidth="2"
        />
        <circle cy="-5" r="4" fill="#ffe19b" />
        <path d="M0,-40v-8" stroke="#526f70" strokeWidth="3" />
        <circle cy="-50" r="4" fill="#ffdb7b" />
        <rect
          x="-20"
          y="-40"
          width="40"
          height="30"
          rx="12"
          fill="#fff0cd"
          stroke="#45686a"
          strokeWidth="2.5"
        />
        <rect x="-14" y="-34" width="28" height="18" rx="7" fill="#254e58" />
        <path
          d="M-6,-28v6m12,-6v6"
          stroke="#a1eee0"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M-19,-4l-6,-8m44,8l7,-9"
          stroke="#d6c1ee"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

export function GardenWorld({
  band,
  active,
  position,
  restored,
  flowering,
  visited,
  onExplore,
  disabled = false,
  testing = false,
  waterOn = false,
  waterLarge = false,
  shadeOn = false,
  drainOn = false,
  newPlant = false,
}: {
  band: GardenBand;
  active: string | null;
  position: Point;
  restored: boolean;
  flowering: boolean;
  visited: string[];
  onExplore: (id: string) => void;
  disabled?: boolean;
  testing?: boolean;
  waterOn?: boolean;
  waterLarge?: boolean;
  shadeOn?: boolean;
  drainOn?: boolean;
  newPlant?: boolean;
}) {
  const unique = useId().replace(/:/g, "");
  const id = (name: string) => `${unique}-${name}`;
  const pipPositions = [
    { x: position.x + 150, y: position.y + 24 },
    { x: position.x - 150, y: position.y + 24 },
    { x: position.x, y: position.y + 150 },
    { x: position.x, y: position.y - 150 },
  ].map((point) => ({
    x: Math.max(80, Math.min(920, point.x)),
    y: Math.max(95, Math.min(602, point.y)),
  }));
  // Keep Pip's touch target separate from nearby objects on narrow screens.
  const pip =
    pipPositions.find((point) =>
      GARDEN_PLACES.every(
        (place) =>
          place.id === "guide" ||
          Math.abs(place.x - point.x) >= 145 ||
          Math.abs(place.y - point.y) >= 145,
      ),
    ) ?? pipPositions[0];
  const waterFlowing = restored || waterOn;
  return (
    <div
      className={`wq-world wq-world-${band} ${restored ? "is-restored" : ""} ${flowering ? "is-flowering" : ""} ${testing ? "is-testing" : ""}`}
      aria-label="An explorable garden with six places to investigate."
    >
      <svg viewBox="0 0 1000 660" aria-hidden="true" className="wq-world-scene">
        <defs>
          <linearGradient id={id("ground")} x2=".75" y2="1">
            <stop stopColor="var(--wq-ground-top)" />
            <stop offset="1" stopColor="var(--wq-ground-bottom)" />
          </linearGradient>
          <radialGradient id={id("sunlight")}>
            <stop stopColor="#ffe7a0" stopOpacity=".7" />
            <stop offset="1" stopColor="#ffe7a0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id("lake")} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#64c6c4" />
            <stop offset=".45" stopColor="#2f939d" />
            <stop offset="1" stopColor="#216674" />
          </linearGradient>
          <linearGradient id={id("glass")} x2=".8" y2="1">
            <stop stopColor="#d5f5db" stopOpacity=".65" />
            <stop offset="1" stopColor="#76bba2" stopOpacity=".32" />
          </linearGradient>
          <linearGradient id={id("roof")} x2=".5" y2="1">
            <stop stopColor="#bde5cb" stopOpacity=".78" />
            <stop offset="1" stopColor="#65a691" stopOpacity=".65" />
          </linearGradient>
          <linearGradient id={id("soil")} x2="0" y2="1">
            <stop stopColor="#7d644c" />
            <stop offset="1" stopColor="#5e5341" />
          </linearGradient>
          <linearGradient id={id("path")} x2=".5" y2="1">
            <stop stopColor="#d6c5a0" />
            <stop offset="1" stopColor="#bba983" />
          </linearGradient>
          <pattern
            id={id("grass")}
            width="91"
            height="76"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M12,31l-3,-8m3,8l4,-6M65,66l-4,-7m4,7l4,-8"
              stroke="#c0d091"
              strokeOpacity=".3"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="44" cy="13" r="1.5" fill="#e6d590" opacity=".4" />
          </pattern>
          <filter id={id("soft")}>
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <clipPath id={id("bounds")}>
            <rect width="1000" height="660" rx="28" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id("bounds")})`}>
          <rect width="1000" height="660" fill={`url(#${id("ground")})`} />
          <ellipse
            cx="522"
            cy="295"
            rx="422"
            ry="287"
            fill="#bad18b"
            opacity=".23"
          />
          <path
            d="M0,370Q145,287 233,337T475,318T748,291T1000,347V660H0Z"
            fill="#759b6c"
            opacity=".23"
          />
          <rect width="1000" height="660" fill={`url(#${id("grass")})`} />
          <ellipse
            cx="592"
            cy="60"
            rx="381"
            ry="317"
            fill={`url(#${id("sunlight")})`}
          />
          <g className="wq-world-light-rays" fill="#fff1b6" opacity=".07">
            <path d="M532,-40L62,660H205L601,-40Z" />
            <path d="M658,-40L290,660H387L711,-40Z" />
          </g>

          <path
            d="M897,85C810,141 831,244 878,275C915,300 940,336 896,395C853,453 820,475 855,551C880,605 945,651 1048,647L1074,92Z"
            fill="#3d796a"
            opacity=".8"
            stroke="#7aa688"
            strokeWidth="16"
          />
          <path
            d="M909,82C822,141 843,240 890,272C934,301 952,339 909,400C866,459 837,482 870,548C905,614 965,634 1048,633L1074,92Z"
            fill={`url(#${id("lake")})`}
          />
          <g
            className="wq-world-water"
            stroke="#c8f0da"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity=".5"
          >
            <path d="M881,163q32,-8 57,2m-24,27q32,-8 57,2M926,299q24,8 53,0M903,458q32,-8 57,2M907,548q34,8 72,-1" />
            <path
              d="M922,224q29,-7 57,0M955,366q18,-8 48,-1M935,490q20,8 48,0"
              opacity=".55"
            />
          </g>
          <g fill="#86c394">
            <ellipse cx="969" cy="230" rx="17" ry="8" />
            <ellipse cx="950" cy="250" rx="12" ry="6" />
            <ellipse cx="947" cy="520" rx="18" ry="8" />
            <ellipse cx="970" cy="507" rx="10" ry="5" />
          </g>
          <g fill="#f2c4cd">
            <path d="M948,229q-12,-20 -18,0q13,9 18,0q15,6 12,-8q-8,-5 -12,8Z" />
            <path d="M950,519q-12,-21 -17,0q11,8 17,0q13,5 12,-8q-8,-6 -12,8Z" />
          </g>

          <g opacity=".78">
            <Tree x={75} y={100} scale={1.45} shade={3} />
            <Tree x={213} y={72} scale={1.1} shade={0} />
            <Tree x={356} y={62} scale={0.9} shade={2} />
            <Tree x={772} y={88} scale={1.15} shade={0} />
            <Tree x={950} y={98} scale={1.5} shade={2} />
          </g>
          <path
            d="M493,697C535,607 569,574 514,540C471,512 390,492 325,461C226,413 285,373 313,315C333,274 324,249 348,224M329,463C456,484 625,469 688,405C753,339 742,263 703,199M672,420Q750,408 840,439"
            stroke="#254f42"
            strokeOpacity=".22"
            strokeWidth="59"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M493,689C535,600 569,567 514,533C471,505 390,485 325,454C226,406 285,366 313,308C333,267 324,242 348,217M329,456C456,477 625,462 688,398C753,332 742,256 703,192M672,413Q750,401 840,432"
            stroke={`url(#${id("path")})`}
            strokeWidth="46"
            strokeLinecap="round"
            fill="none"
          />
          <g stroke="#e6d7b2" strokeWidth="2.5" opacity=".65" fill="none">
            <path d="M285,388l16,-5m24,-83l15,4m-39,133l17,-3m58,32l17,4m134,38l13,9m-33,67l15,7m142,-148l13,-4m38,-91l16,5m64,63l14,3" />
            <path d="M484,611l19,7m-67,-141l16,5m245,-177l15,5" />
          </g>

          <g className="wq-world-greenhouse">
            <ellipse
              cx="528"
              cy="321"
              rx="195"
              ry="44"
              fill="#244f40"
              opacity=".25"
            />
            <path
              d="M370,205L585,239L713,166V300L585,374L370,340Z"
              fill="#557966"
              stroke="#3d6859"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d="M379,202L582,236V351L379,319Z"
              fill={`url(#${id("glass")})`}
            />
            <path
              d="M585,235L704,166V291L585,359Z"
              fill="#9cc7ad"
              opacity=".55"
            />
            <path
              d="M368,204L465,97L590,119L716,165L585,242Z"
              fill={`url(#${id("roof")})`}
              stroke="#557f68"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            <path
              d="M465,99L585,241M410,157L631,207M437,128L674,182M520,108L635,215M573,118L674,191"
              fill="none"
              stroke="#d0d7b1"
              strokeWidth="4"
              opacity=".9"
            />
            <g className={`wq-world-shade ${shadeOn ? "is-open" : ""}`}>
              <path
                d="M369,193L462,92L584,114L697,161L581,230Z"
                fill="#82719b"
                fillOpacity=".88"
                stroke="#534b6b"
                strokeWidth="3"
              />
              <path
                d="M409,151L622,201M438,121L665,176M491,99L605,216M539,108L649,190"
                fill="none"
                stroke="#b5a2c5"
                strokeWidth="5"
              />
              <path
                d="M369,193L581,230L697,161v10L581,241L369,204Z"
                fill="#6d6185"
              />
            </g>
            <path
              d="M382,213L570,244M422,214v113m55,-104v113m53,-106v113m53,-103v111M619,218v112m43,-137v111"
              stroke="#d5d8b8"
              strokeWidth="5"
              opacity=".95"
            />
            <path
              d="M382,261l191,33m19,6l108,-63"
              stroke="#d5d8b8"
              strokeWidth="4"
            />
            <path
              d="M381,218l18,90m50,-76l15,86m163,-96l-11,74"
              stroke="#eef3dc"
              strokeWidth="7"
              opacity=".24"
            />
            <path
              d="M368,331L585,367L715,294v20L585,390L368,352Z"
              fill="#a8a484"
              stroke="#737e63"
              strokeWidth="3"
            />
            <path
              d="M595,310L632,287v68l-37,22Z"
              fill="#365a50"
              stroke="#d1d4b2"
              strokeWidth="4"
            />
            <circle cx="622" cy="334" r="3" fill="#e9d295" />
            <g opacity=".78">
              <Plant
                x={404}
                y={311}
                blooming={restored}
                colour="#fac395"
                scale={0.6}
              />
              <Plant
                x={454}
                y={320}
                blooming={restored}
                colour="#e4b2e7"
                scale={0.75}
              />
              <Plant
                x={507}
                y={329}
                blooming={restored}
                colour="#f6c087"
                scale={0.7}
              />
              <Plant
                x={555}
                y={337}
                blooming={restored}
                colour="#f2a9c0"
                scale={0.65}
              />
            </g>
            <path
              d="M342,351l223,39"
              stroke="#5b8067"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M337,351l223,39"
              stroke={waterFlowing ? "#a4e8d0" : "#aca88a"}
              strokeWidth="5"
              strokeLinecap="round"
              className={waterFlowing ? "wq-world-irrigation" : undefined}
              strokeDasharray={waterFlowing ? "12 9" : undefined}
            />
          </g>

          <g transform="translate(700 154)">
            <ellipse cy="30" rx="32" ry="11" fill="#234b3b" opacity=".2" />
            <path d="M-7,27v-61h14v61" fill="#9a9273" />
            <path
              d="M-13,26h26"
              stroke="#d3c89a"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <g className="wq-world-sun-lens">
              <circle
                cy="-49"
                r="26"
                fill="#657f6a"
                stroke="#e6d097"
                strokeWidth="5"
              />
              <circle cy="-49" r="19" fill="#7db6b4" />
              <path
                d="M-12,-61q15,-7 24,7"
                stroke="#e1f7db"
                strokeWidth="5"
                fill="none"
                opacity=".75"
              />
              <circle cy="-49" r="8" fill="#fce1a0" />
              <path
                d="M0,-85v-8m26,19l6,-6m-58,6l-6,-6M35,-49h8m-78,0h-8"
                stroke="#f2cf84"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
            <rect
              x="-13"
              y="-10"
              width="26"
              height="13"
              rx="3"
              fill="#465f59"
            />
            <circle cx="-6" cy="-3" r="2" fill="#d6efaf" />
            <path d="M0,-3h8" stroke="#a7cba4" strokeWidth="2" />
          </g>

          <g transform="translate(342 231)">
            <ellipse cy="25" rx="45" ry="14" fill="#294a3b" opacity=".25" />
            <path
              d="M-37,-69L31,-77L41,20L-31,30Z"
              fill="#755e48"
              stroke="#4c5542"
              strokeWidth="3"
            />
            <path d="M-32,-64L25,-70L32,15L-27,23Z" fill="#b99767" />
            <path
              d="M-33,-63l56,-6m-52,31l56,-6m-53,32l56,-6"
              stroke="#776548"
              strokeWidth="4"
            />
            <path
              d="M-45,-69L-40,-82L32,-90L43,-78Z"
              fill="#9baa7c"
              stroke="#667957"
              strokeWidth="3"
            />
            <g fill="#efdfb7" stroke="#aa8f61" strokeWidth="1.5">
              <rect
                x="-24"
                y="-58"
                width="18"
                height="18"
                rx="2"
                transform="rotate(-7)"
              />
              <rect
                x="4"
                y="-58"
                width="18"
                height="18"
                rx="2"
                transform="rotate(-7)"
              />
              <rect
                x="-23"
                y="-26"
                width="18"
                height="20"
                rx="2"
                transform="rotate(-7)"
              />
              <rect
                x="4"
                y="-27"
                width="18"
                height="20"
                rx="2"
                transform="rotate(-7)"
              />
            </g>
            <path
              d="M-18,-50q-7,-8 0,-6q7,-6 7,1q-2,6 -7,5M11,-53q-5,12 1,10q8,-4 -1,-10M-16,-10v-8m0,5q-11,-9 -2,-7m2,7q12,-10 3,-9"
              fill="#60834c"
              stroke="#60834c"
              strokeWidth="1.5"
            />
            <circle cx="13" cy="-15" r="5" fill="#d9966e" />
          </g>

          <g transform="translate(802 360)">
            <path d="M-10,59L76,80L110,60L30,39Z" fill="#375b4b" opacity=".3" />
            <path
              d="M-7,42L69,59L89,43L13,26Z"
              fill="#bd9970"
              stroke="#7b7454"
              strokeWidth="3"
            />
            <path
              d="M-5,43v20m71,-7v21m17,-32v19"
              stroke="#79694f"
              strokeWidth="7"
            />
            <g
              className={
                waterFlowing || testing
                  ? "wq-world-wheel is-turning"
                  : "wq-world-wheel"
              }
            >
              <circle r="43" fill="#304d43" stroke="#795f45" strokeWidth="10" />
              <circle r="35" fill="#2c706d" stroke="#c0a078" strokeWidth="6" />
              {[0, 45, 90, 135].map((angle) => (
                <path
                  key={angle}
                  d="M-42,0H42"
                  stroke="#b99a70"
                  strokeWidth="8"
                  transform={`rotate(${angle})`}
                />
              ))}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <rect
                  key={angle}
                  x="-12"
                  y="-50"
                  width="24"
                  height="12"
                  rx="3"
                  fill="#ccae81"
                  stroke="#846d50"
                  strokeWidth="2"
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle r="11" fill="#d4bb91" stroke="#776953" strokeWidth="4" />
            </g>
            <path d="M0,0l16,64" stroke="#808b71" strokeWidth="9" />
            <circle r="6" fill="#cbd5b0" />
            <path
              d="M-19,10L-65,24L-107,17"
              stroke="#5d826b"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M-19,10L-65,24L-107,17"
              stroke={waterFlowing ? "#a9e9d2" : "#8f9e79"}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={waterFlowing ? "12 9" : undefined}
              className={waterFlowing ? "wq-world-irrigation" : undefined}
            />
            {waterFlowing && (
              <g className="wq-world-splash" fill="#b4eee0">
                <circle cx="34" cy="23" r="4" />
                <circle cx="47" cy="13" r="3" />
                <circle cx="40" cy="37" r="2" />
              </g>
            )}
          </g>

          <g transform="translate(650 333)">
            <ellipse cy="26" rx="35" ry="11" fill="#294c3d" opacity=".25" />
            <path d="M-16,21l3,-30h25l5,30Z" fill="#7b8c77" />
            <path
              d="M-24,-47L20,-52L31,-15L-18,-10Z"
              fill="#9eb297"
              stroke="#5c7966"
              strokeWidth="4"
            />
            <path d="M-17,-40L15,-44L22,-21L-12,-17Z" fill="#254b49" />
            <path
              d={restored ? "M-9,-29l7,5l13,-11" : "M-7,-27l7,-9l9,10"}
              stroke={restored ? "#c7eca4" : "#f4ce8a"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="20" cy="-6" r="4" fill="#c9acdf" />
            <circle cx="7" cy="-4" r="3" fill="#edc68d" />
          </g>

          <g className="wq-world-crop-beds">
            <path
              d="M339,517L455,549L402,598L284,562Z"
              fill="#365d46"
              opacity=".3"
            />
            <path
              d="M339,502L459,533L403,582L282,550Z"
              fill="#a39166"
              stroke="#726d49"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M340,511L443,537L400,572L299,546Z"
              fill={`url(#${id("soil")})`}
            />
            <path
              d="M644,509L777,480L811,527L680,562Z"
              fill="#a39166"
              stroke="#726d49"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M650,517L771,490L797,523L683,551Z"
              fill={`url(#${id("soil")})`}
            />
            <path
              d="M332,522l90,23m-107,-6l90,23m254,-34l114,-26m-103,42l117,-28"
              stroke="#a18b61"
              strokeOpacity=".4"
              strokeWidth="2"
            />
            {waterOn && ((!newPlant && waterLarge) || !drainOn) && (
              <g className="wq-world-flood" fill="#73baba" fillOpacity=".65">
                <path d="M340,511L443,537L400,572L299,546Z" />
                <path d="M650,517L771,490L797,523L683,551Z" />
              </g>
            )}
            {waterOn && drainOn && (
              <path
                d="M443,548q45,13 75,-6M778,537q40,-3 61,-16"
                className="wq-world-irrigation"
                stroke="#a5e6da"
                strokeWidth="7"
                strokeDasharray="12 9"
                strokeLinecap="round"
                fill="none"
              />
            )}
            {[
              [333, 535],
              [372, 546],
              [411, 552],
              [352, 523],
              [391, 533],
              [672, 531],
              [712, 522],
              [754, 511],
              [694, 545],
              [735, 536],
              [776, 527],
            ].map(([x, y], index) => (
              <Plant
                key={`${x}-${y}`}
                x={x}
                y={y}
                blooming={restored || flowering}
                colour={
                  index % 3 === 0
                    ? "#e7dcf5"
                    : index % 3 === 1
                      ? "#dbb3ed"
                      : "#c7c9f1"
                }
                scale={flowering ? 1.07 : 0.83}
              />
            ))}
            {waterOn && (
              <g
                className={`wq-world-sprinklers ${waterLarge ? "is-heavy" : ""}`}
                stroke="#bceee4"
                strokeWidth="3"
                strokeDasharray="4 8"
                fill="none"
                strokeLinecap="round"
              >
                <path d="M455,507Q401,420 322,513M455,507Q377,455 358,548M637,490Q691,410 769,489M637,490Q717,443 756,530" />
                {waterLarge && (
                  <path d="M455,507Q377,410 333,535M455,507Q424,406 411,552M637,490Q759,390 776,527M637,490Q657,403 672,531" />
                )}
              </g>
            )}
          </g>

          {(newPlant || flowering) && (
            <g transform="translate(571 537)" className="wq-world-new-plant">
              <ellipse cy="21" rx="29" ry="10" fill="#345241" opacity=".25" />
              <path
                d="M-24,-4l6,28h35l6,-28Z"
                fill="#d5a477"
                stroke="#a77e5b"
                strokeWidth="2"
              />
              <ellipse cy="-4" rx="24" ry="7" fill="#e5ba8d" />
              <ellipse cy="-4" rx="18" ry="5" fill="#6d6646" />
              <Plant
                x={0}
                y={-4}
                blooming={flowering}
                colour="#ffcc61"
                scale={flowering ? 1.5 : 1}
              />
              {!flowering && (
                <g transform="translate(9 -28)">
                  <path d="M-8,0q-5,-17 8,-17q13,1 8,17Z" fill="#f4cf70" />
                  <path d="M-8,0q9,6 16,0" fill="#7c9f56" />
                </g>
              )}
              <path d="M24,-4v-23" stroke="#937d5b" strokeWidth="3" />
              <path
                d="M18,-36h21v14H18Z"
                fill="#f0dcaa"
                stroke="#bca173"
                strokeWidth="1.5"
              />
              <circle cx="28" cy="-29" r="4" fill="#e5ad4b" />
            </g>
          )}

          <g transform="translate(159 356)">
            <ellipse cy="30" rx="35" ry="13" fill="#2d523e" opacity=".2" />
            <path d="M-33,-5l9,44h45l10,-44Z" fill="#ad7960" />
            <ellipse cy="-5" rx="33" ry="10" fill="#cf9a78" />
            <ellipse cy="-5" rx="25" ry="7" fill="#665641" />
            <Plant x={0} y={-6} blooming colour="#f4b867" scale={1.2} />
          </g>
          <g stroke="#75815b" strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M145,495l-57,6m60,19l-57,6m15,-45l-2,57m29,-61l-1,58M110,502l-49,-5m48,26l-49,-5m12,-35l-2,50" />
            <path d="M775,562l61,-17m-58,40l61,-17m-51,-30l7,58m28,-66l7,60" />
          </g>
          <g fill="#9db476">
            <path d="M852,264q-28,-51 -13,-68q23,28 13,68M851,264q9,-52 25,-50q3,35 -25,50M848,266q-34,-27 -27,-41q25,11 27,41" />
            <path d="M876,566q-28,-51 -13,-68q23,28 13,68M875,566q9,-52 25,-50q3,35 -25,50" />
          </g>
          <g fill="#d9bd79">
            <ellipse cx="839" cy="200" rx="5" ry="13" />
            <ellipse cx="863" cy="502" rx="5" ry="13" />
          </g>
          <Gardener />

          {visited
            .filter((place) => place !== "guide")
            .map((place) => {
              const location = GARDEN_PLACES.find(
                (candidate) => candidate.id === place,
              );
              return location ? (
                <g
                  key={place}
                  transform={`translate(${location.x + 29} ${location.y - 59})`}
                  className="wq-world-found"
                >
                  <circle
                    r="10"
                    fill="#deebbf"
                    stroke="#688b65"
                    strokeWidth="2"
                  />
                  <path
                    d="M-4,0l3,3l6,-6"
                    fill="none"
                    stroke="#427052"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ) : null;
            })}

          <g
            className="wq-world-avatar"
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          >
            <Explorer />
          </g>
          <g
            className="wq-world-companion"
            style={{ transform: `translate(${pip.x}px, ${pip.y}px)` }}
          >
            <Pip />
          </g>

          <g className="wq-world-butterfly" transform="translate(555 440)">
            <path
              d="M0,0C-23,-24 -28,11 -3,5C-12,27 17,26 5,3C26,8 21,-23 0,0Z"
              fill="#f5ce8c"
            />
            <path d="M0,0l3,8" stroke="#8e8459" strokeWidth="2" />
          </g>
          <g
            className="wq-world-butterfly wq-world-butterfly-second"
            transform="translate(277 293)"
          >
            <path
              d="M0,0C-17,-19 -24,9 -3,5C-12,22 15,22 5,3C23,8 19,-20 0,0Z"
              fill="#d5b5ed"
            />
          </g>
          <g className="wq-world-motes" fill="#f2e4a4">
            {[
              [112, 228],
              [570, 459],
              [778, 284],
              [600, 525],
              [249, 541],
              [381, 423],
              [796, 107],
            ].map(([x, y], i) => (
              <circle
                key={x}
                cx={x}
                cy={y}
                r={i % 2 === 0 ? 2.5 : 1.7}
                style={{ animationDelay: `${i * -0.7}s` }}
              />
            ))}
          </g>
          {flowering && (
            <g className="wq-world-celebration" fill="#f4d59c">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                <path
                  key={n}
                  d="M0,-7L2,-2L7,0L2,2L0,7L-2,2L-7,0L-2,-2Z"
                  transform={`translate(${310 + n * 59} ${469 - (n % 3) * 14})`}
                  style={{ animationDelay: `${n * -0.21}s` }}
                />
              ))}
            </g>
          )}

          <Tree x={5} y={378} scale={1.45} shade={3} />
          <Tree x={88} y={639} scale={1.45} shade={0} />
          <Tree x={212} y={696} scale={1.2} shade={1} />
          <Tree x={973} y={727} scale={1.6} shade={0} />
          <Tree x={1031} y={453} scale={1.2} shade={3} />
          <g fill="#d4d9a1" opacity=".35">
            <path d="M188,604q-31,-43 -20,-53q28,13 20,53M188,604q-1,-46 17,-48q14,22 -17,48M891,627q-31,-43 -20,-53q28,13 20,53M891,627q-1,-46 17,-48q14,22 -17,48" />
          </g>
        </g>
      </svg>

      <div className="wq-world-location" aria-hidden="true">
        <span className="wq-world-location-star">✦</span>
        <span>
          {band === "explorers"
            ? "Pip’s garden"
            : band === "inventors"
              ? "The invention garden"
              : "The glasshouse gardens"}
        </span>
      </div>
      <div className="wq-world-objects">
        {GARDEN_PLACES.map((place) => {
          const location = place.id === "guide" ? pip : place;
          const style = {
            left: `${location.x / 10}%`,
            top: `${location.y / 6.6}%`,
          } as CSSProperties;
          return (
            <button
              type="button"
              key={place.id}
              style={style}
              className={`wq-world-object ${active === place.id ? "is-active" : ""} ${visited.includes(place.id) ? "is-visited" : ""} ${place.id === "guide" ? "is-pip" : ""}`}
              aria-label={place.action}
              aria-pressed={active === place.id}
              disabled={disabled}
              onClick={() => onExplore(place.id)}
            >
              <span className="wq-world-object-ring" aria-hidden="true" />
              <span className="wq-world-object-name">
                {place.name}
                <span className="wq-world-object-arrow" aria-hidden="true">
                  ↗
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="wq-world-compass" aria-hidden="true">
        <span>N</span>
        <svg viewBox="0 0 36 36">
          <path d="M18,3L23,18L18,33L13,18Z" fill="#edd6a2" />
          <path d="M18,3v30l-5,-15Z" fill="#96bba5" />
          <circle cx="18" cy="18" r="3" fill="#385c53" />
        </svg>
      </div>
    </div>
  );
}
