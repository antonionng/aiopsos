"use client";

import dynamic from "next/dynamic";
import type { WeatherData } from "@/lib/weather-api";
import type { FloodWarning } from "@/lib/flood-api";

const MapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#060610]">
      <div className="flex flex-col items-center gap-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
        <span className="text-[10px] text-zinc-600">Loading map...</span>
      </div>
    </div>
  ),
});

interface LiveWeatherMapProps {
  weatherData: Record<string, WeatherData> | null;
  floods: FloodWarning[];
  activePhase?: number;
  compact?: boolean;
  showTimeline?: boolean;
}

export function LiveWeatherMap({
  weatherData,
  floods,
  activePhase,
  compact,
  showTimeline,
}: LiveWeatherMapProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10">
      <MapInner
        weatherData={weatherData}
        floods={floods}
        activePhase={activePhase}
        compact={compact}
        showTimeline={showTimeline}
      />
    </div>
  );
}
