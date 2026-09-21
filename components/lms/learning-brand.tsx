"use client";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/wordmark";
export type LearningBrand = {
  name: string;
  logo_url: string | null;
  website: string;
  description: string;
  location: string;
};
/** Read the authenticated learner's organisation, never a course author's tenant. */
export function useLearningBrand() {
  const [brand, setBrand] = useState<LearningBrand | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/organisation", { signal: controller.signal, cache: "no-store" })
      .then(async (r) => { if (!r.ok) return; const data = await r.json(); if (data.organisation?.name) setBrand(data.organisation); })
      .catch(() => { /* The course remains available if company settings cannot load. */ });
    return () => controller.abort();
  }, []);
  return brand;
}
export function LearningBrandHeader({ brand }: { brand: LearningBrand | null }) {
  return <div className="mb-6 flex flex-wrap items-center gap-5 rounded-2xl border bg-card p-5">
    <Wordmark size="md" />
    {brand && <><span className="text-muted-foreground" aria-hidden="true">×</span>
      {brand.logo_url && <img src={brand.logo_url} alt={`${brand.name} logo`} className="max-h-12 max-w-32 object-contain" />}
      <div><p className="font-semibold">{brand.name}</p><p className="text-xs text-muted-foreground">Your learning workspace{brand.location ? ` · ${brand.location}` : ""}</p></div>
    </>}
  </div>;
}
