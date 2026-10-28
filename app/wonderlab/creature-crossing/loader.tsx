"use client";

import dynamic from "next/dynamic";

export const CreatureCrossingLoader = dynamic(
  () => import("@/components/wonderlab/creature-crossing/game").then((module) => module.CreatureCrossing),
  { ssr: false, loading: () => <div className="cc-shell cc-boot">Opening the island…</div> },
);
