import type { AvatarLook } from "@/lib/wonderlab/first-person";

export function AvatarPortrait({ avatar, small = false }: { avatar: AvatarLook; small?: boolean }) {
  const robot = avatar.kind === "robot";
  const sprite = avatar.kind === "sprite";
  return (
    <svg className={`fp-avatar ${small ? "fp-avatar-small" : ""}`} viewBox="0 0 160 190" role="img" aria-label={`${avatar.kind} avatar`}>
      <ellipse cx="80" cy="174" rx="45" ry="10" fill="#000" opacity=".16" />
      <path d="M58 126 53 166Q62 177 74 166L78 134M88 133 88 169Q105 178 112 168L104 124" fill="#253149" />
      <path d="M50 164Q63 169 74 163L76 175H49ZM88 165Q100 171 114 164L116 177H88Z" fill="#f2dba8" />
      <path d="M52 93Q32 107 35 139L48 145 64 111M104 95Q123 107 126 140L112 145 97 111" fill={avatar.colour} />
      <path d="M32 137Q27 151 40 155Q54 157 50 142M114 141Q109 156 125 153Q137 149 128 137" fill={robot ? "#d2e4e5" : "#f0c8a2"} />
      <path d="M55 89Q80 79 105 89L111 137Q80 151 49 137Z" fill={avatar.colour} />
      <path d="M53 94 67 118 93 118 106 93" fill="none" stroke="#203b48" strokeWidth="5" opacity=".5" />
      <path d="m80 109 3 7 8 1-6 5 1 8-6-4-7 4 2-8-6-5 8-1Z" fill="#fff0b5" />
      {sprite && <><path d="M51 66 26 49 36 80 53 82M108 66 133 49 123 80 106 82" fill="#bde3d8" /><path d="m62 36 4-19 16 12 16-12 6 22" fill={avatar.colour} /></>}
      {robot ? <>
        <path d="M80 34V20" stroke="#e6d69d" strokeWidth="5" /><circle cx="80" cy="17" r="7" fill="#ffe9a2" />
        <rect x="45" y="34" width="70" height="57" rx="20" fill="#e1e6d6" />
        <rect x="52" y="44" width="56" height="33" rx="12" fill="#193b46" />
        <rect x="62" y="54" width="7" height="13" rx="3" fill="#8bead6" /><rect x="91" y="54" width="7" height="13" rx="3" fill="#8bead6" />
        <path d="M70 81h20" stroke="#567c7d" strokeWidth="3" strokeLinecap="round" />
      </> : <>
        <path d="M47 50Q43 24 78 28Q119 24 116 58L108 85H53Z" fill={sprite ? "#e0ead1" : "#4d3a37"} />
        <rect x="51" y="42" width="58" height="51" rx="24" fill={sprite ? "#bde3d8" : "#f0c8a2"} />
        <path d="M50 56Q51 32 80 34Q110 34 112 55L91 48 80 57 69 47Z" fill={sprite ? "#e0ead1" : "#4d3a37"} />
        <ellipse cx="65" cy="65" rx="3.5" ry="5" fill="#243040" /><ellipse cx="94" cy="65" rx="3.5" ry="5" fill="#243040" />
        <path d="M74 77q6 5 12 0" fill="none" stroke="#8b675b" strokeWidth="2.5" strokeLinecap="round" />
        {!sprite && <><path d="M45 42Q45 14 79 15Q111 16 113 42Z" fill={avatar.colour} /><path d="M40 43q40-12 79 0" fill="none" stroke="#fff0bc" strokeWidth="7" strokeLinecap="round" /></>}
      </>}
      <path d="M53 91q27 13 55-1l-7 12-14-1 9 17-14 6-15-24Z" fill="#f1cd8b" />
      <path d="m131 98 2 5 6 1-5 4 1 6-4-3-5 3 1-6-4-4 5-1ZM25 85l2 4 5 1-4 3 1 5-4-2-4 2 1-5-3-3 4-1Z" fill="#eadea5" opacity=".8" />
    </svg>
  );
}
