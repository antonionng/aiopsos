import {
  Apple,
  Carrot,
  Leaf,
  Star,
  Bot,
  Moon,
  Sun,
  BookOpen,
  LockKeyhole,
  CloudRain,
  Footprints,
  Feather,
  Fish,
  TreePine,
  House,
  KeyRound,
  Flower2,
  Rocket,
} from "lucide-react";
import type { Picture } from "@/lib/wonderlab/types";
const icons = {
  apple: Apple,
  carrot: Carrot,
  leaf: Leaf,
  star: Star,
  robot: Bot,
  moon: Moon,
  sun: Sun,
  book: BookOpen,
  lock: LockKeyhole,
  cloud: CloudRain,
  boots: Footprints,
  wings: Feather,
  fish: Fish,
  tree: TreePine,
  home: House,
  key: KeyRound,
  flower: Flower2,
  rocket: Rocket,
};
export function PictureTile({ picture }: { picture: Picture }) {
  const Icon = icons[picture];
  return (
    <span className={`wl-picture wl-picture-${picture}`}>
      <Icon aria-hidden="true" strokeWidth={1.65} />
    </span>
  );
}
export function Pip({ small = false }: { small?: boolean }) {
  return (
    <svg
      className={small ? "wl-pip small" : "wl-pip"}
      viewBox="0 0 180 200"
      role="img"
      aria-label="Pip, our fictional robot guide"
    >
      <path d="M88 36V19" stroke="#29203e" strokeWidth="7" />
      <circle
        cx="88"
        cy="14"
        r="10"
        fill="#faaa53"
        stroke="#29203e"
        strokeWidth="4"
      />
      <rect
        x="28"
        y="36"
        width="124"
        height="93"
        rx="33"
        fill="#fff9ee"
        stroke="#29203e"
        strokeWidth="5"
      />
      <rect x="43" y="55" width="94" height="51" rx="20" fill="#29203e" />
      <rect x="59" y="67" width="14" height="23" rx="7" fill="#72dcc7" />
      <rect x="106" y="67" width="14" height="23" rx="7" fill="#72dcc7" />
      <path
        d="M52 133Q90 147 128 133L132 174Q90 197 48 174Z"
        fill="#9264ef"
        stroke="#29203e"
        strokeWidth="5"
      />
      <path
        d="M49 143L24 157M130 142L153 116M65 183L61 194M113 183L117 194"
        stroke="#29203e"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx="90" cy="163" r="9" fill="#ffbf68" />
    </svg>
  );
}
