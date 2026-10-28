"use client";

import dynamic from "next/dynamic";

export const SnackSorterLoader = dynamic(
  () => import("@/components/wonderlab/snack-sorter/game").then((module) => module.SnackSorter),
  { ssr: false, loading: () => <div className="cc-shell cc-boot">Setting up Pip&apos;s picnic…</div> },
);
