"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import { useEffect, useState, useCallback, useRef } from "react";
import { UK_LOCATIONS, getWeatherDescription } from "@/lib/weather-api";
import type { WeatherData } from "@/lib/weather-api";
import { FLOOD_AREA_COORDINATES } from "@/lib/flood-api";
import type { FloodWarning } from "@/lib/flood-api";

const CITY_LABELS: Record<string, string> = {
  loughborough: "Loughborough",
  london: "London",
  birmingham: "Birmingham",
  manchester: "Manchester",
  bristol: "Bristol",
  leeds: "Leeds",
  sheffield: "Sheffield",
  nottingham: "Nottingham",
  leicester: "Leicester",
};

const PRIMARY_CITIES = ["london", "bristol", "birmingham", "manchester", "leeds", "loughborough"];

const SEVERITY_COLORS: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
};

const UK_BOUNDS: L.LatLngBoundsExpression = [
  [49.5, -8],
  [59, 2],
];
const RADAR_FRAME_INTERVAL_MS = 1800;

const BASEMAP_PROVIDERS = [
  {
    name: "Carto Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    name: "Carto Positron",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    name: "Esri Streets",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
] as const;

interface RadarFrame {
  time: number;
  path: string;
}

function tempToColor(temp: number): string {
  if (temp < 0) return "#60a5fa";
  if (temp < 5) return "#93c5fd";
  if (temp < 10) return "#67e8f9";
  if (temp < 15) return "#a3e635";
  if (temp < 20) return "#facc15";
  return "#fb923c";
}

function weatherEmoji(code: number): string {
  if (code >= 95) return "⚡";
  if (code >= 71) return "❄";
  if (code >= 51) return "🌧";
  if (code >= 45) return "🌫";
  if (code >= 2) return "☁";
  return "☀";
}

function createCityIcon(temp: number, name: string, code: number, primary: boolean): L.DivIcon {
  const color = tempToColor(temp);
  const emoji = weatherEmoji(code);
  const desc = getWeatherDescription(code);

  if (!primary) {
    return L.divIcon({
      className: "",
      html: `<div style="display:flex;align-items:center;gap:4px;">
        <div style="width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color};"></div>
        <span style="font-size:11px;font-weight:700;color:${color};font-family:monospace;text-shadow:0 1px 4px rgba(0,0,0,0.9);">${Math.round(temp)}°</span>
      </div>`,
      iconSize: [60, 20],
      iconAnchor: [4, 10],
    });
  }

  return L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;gap:6px;">
      <div style="width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 12px ${color};border:1.5px solid rgba(255,255,255,0.3);"></div>
      <div>
        <div style="display:flex;align-items:center;gap:4px;">
          <span style="font-size:14px;font-weight:700;color:${color};font-family:ui-monospace,monospace;text-shadow:0 1px 4px rgba(0,0,0,0.9);">${Math.round(temp)}°</span>
          <span style="font-size:12px;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.8));">${emoji}</span>
        </div>
        <div style="font-size:10px;color:rgba(255,255,255,0.55);font-family:system-ui,sans-serif;text-shadow:0 1px 3px rgba(0,0,0,0.9);white-space:nowrap;">${name} · ${desc}</div>
      </div>
    </div>`,
    iconSize: [180, 40],
    iconAnchor: [7, 20],
  });
}

function getFloodLatLng(warning: FloodWarning): L.LatLngExpression | null {
  const area = warning.areaName.toLowerCase();
  for (const [key, coords] of Object.entries(FLOOD_AREA_COORDINATES)) {
    if (area.includes(key)) return [coords.lat, coords.lng];
  }
  const desc = warning.description.toLowerCase();
  for (const [key, coords] of Object.entries(FLOOD_AREA_COORDINATES)) {
    if (desc.includes(key)) return [coords.lat, coords.lng];
  }
  return [51 + Math.random() * 5, -3 + Math.random() * 4];
}

function MapSetter({ onMap }: { onMap: (m: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onMap(map);
  }, [map, onMap]);
  return null;
}

interface MapInnerProps {
  weatherData: Record<string, WeatherData> | null;
  floods: FloodWarning[];
  activePhase?: number;
  compact?: boolean;
  showTimeline?: boolean;
}

export default function MapInner({
  weatherData,
  floods,
  activePhase,
  compact = false,
  showTimeline = false,
}: MapInnerProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  const [baseMapIndex, setBaseMapIndex] = useState(0);
  const [forecastHour, setForecastHour] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [radarFrames, setRadarFrames] = useState<RadarFrame[]>([]);
  const [radarHost, setRadarHost] = useState("");
  const [radarFrameIndex, setRadarFrameIndex] = useState(0);
  const [radarTimestamp, setRadarTimestamp] = useState<string | null>(null);
  const [radarStatus, setRadarStatus] = useState<"loading" | "ok" | "error">("loading");
  const radarDirectionRef = useRef<1 | -1>(1);

  const showWeather = !activePhase || activePhase >= 1;
  const showFloods = !activePhase || activePhase >= 2;
  const showAssets = activePhase !== undefined && activePhase >= 3;
  const showPriority = activePhase !== undefined && activePhase >= 4;
  const showNotify = activePhase !== undefined && activePhase >= 5;

  const activeWarnings = floods.filter((w) => w.severityLevel <= 3);
  const activeBaseMap = BASEMAP_PROVIDERS[baseMapIndex];

  const handleSetMap = useCallback((m: L.Map) => setMap(m), []);
  const handleBaseTileError = useCallback(() => {
    setBaseMapIndex((current) => (current < BASEMAP_PROVIDERS.length - 1 ? current + 1 : current));
  }, []);

  // Fetch RainViewer radar frames
  useEffect(() => {
    setRadarStatus("loading");
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((r) => r.json())
      .then((data) => {
        const frames = data?.radar?.past ?? [];
        const host = data?.host ?? "";
        if (!host || frames.length === 0) {
          setRadarStatus("error");
          return;
        }
        setRadarHost(host);
        setRadarFrames(frames);
        setRadarFrameIndex(0);
        const firstFrame = frames[0];
        const firstTime = new Date(firstFrame.time * 1000);
        setRadarTimestamp(
          firstTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
        );
        setRadarStatus("ok");
      })
      .catch(() => {
        setRadarStatus("error");
      });
  }, []);

  // Animate radar frames
  useEffect(() => {
    if (radarFrames.length === 0) return;
    const interval = setInterval(() => {
      setRadarFrameIndex((i) => {
        if (radarFrames.length === 1) return i;
        let next = i + radarDirectionRef.current;
        if (next >= radarFrames.length) {
          radarDirectionRef.current = -1;
          next = radarFrames.length - 2;
        } else if (next < 0) {
          radarDirectionRef.current = 1;
          next = 1;
        }
        const frame = radarFrames[next];
        if (frame) {
          const d = new Date(frame.time * 1000);
          setRadarTimestamp(
            d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
          );
        }
        return next;
      });
    }, RADAR_FRAME_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [radarFrames]);

  // Forecast timeline auto-play
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setForecastHour((h) => (h >= 23 ? 0 : h + 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [playing]);

  const activeRadarFrame = radarFrames[radarFrameIndex];
  const radarTileUrl =
    activeRadarFrame && radarHost
      ? `${radarHost}${activeRadarFrame.path}/256/{z}/{x}/{y}/2/1_1.png`
      : null;

  // Sensor dots scattered around UK cities (agentic phase 3)
  const sensorDots: L.LatLngExpression[] = showAssets
    ? Array.from({ length: 40 }, (_, i) => {
        const cities = Object.values(UK_LOCATIONS);
        const base = cities[i % cities.length];
        return [
          base.lat + Math.sin(i * 2.3) * 0.7 + Math.cos(i * 3.1) * 0.3,
          base.lng + Math.cos(i * 1.7) * 0.5 + Math.sin(i * 2.9) * 0.2,
        ] as L.LatLngExpression;
      })
    : [];

  return (
    <div className="relative h-full w-full">
      <style>{`
        .leaflet-container { background: #0d1117 !important; }
        .leaflet-control-attribution { font-size: 8px !important; opacity: 0.3 !important; }
        .radar-tiles { transition: opacity 1000ms linear; }
        .leaflet-popup-content-wrapper {
          background: rgba(10, 10, 10, 0.95) !important;
          color: #e5e7eb !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .leaflet-popup-tip {
          background: rgba(10, 10, 10, 0.95) !important;
        }
        @keyframes floodPulse { 0%,100% { stroke-opacity: 0.3; stroke-width: 2; } 50% { stroke-opacity: 0.8; stroke-width: 4; } }
        .flood-pulse { animation: floodPulse 2.5s ease-in-out infinite; }
        @keyframes notifyExpand { 0% { stroke-width: 2; stroke-opacity: 0.6; } 100% { stroke-width: 0; stroke-opacity: 0; } }
        .notify-pulse { animation: notifyExpand 2s ease-out infinite; }
      `}</style>

      <MapContainer
        bounds={UK_BOUNDS}
        boundsOptions={{ padding: [10, 10] }}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        minZoom={4}
        maxZoom={14}
      >
        <MapSetter onMap={handleSetMap} />

        {/* Basemap with provider fallback on tile error */}
        <TileLayer
          key={activeBaseMap.name}
          url={activeBaseMap.url}
          attribution={activeBaseMap.attribution}
          eventHandlers={{ tileerror: handleBaseTileError }}
        />

        {/* RainViewer animated radar overlay */}
        {radarTileUrl && (
          <TileLayer
            url={radarTileUrl}
            attribution='<a href="https://www.rainviewer.com/">RainViewer</a>'
            opacity={0.48}
            maxNativeZoom={7}
            className="radar-tiles"
          />
        )}

        {/* City weather markers */}
        {showWeather &&
          weatherData &&
          Object.entries(UK_LOCATIONS).map(([name, coords]) => {
            const weather = weatherData[name];
            if (!weather) return null;
            const temp =
              forecastHour > 0
                ? (weather.hourlyForecast.temperature[forecastHour] ?? weather.temperature)
                : weather.temperature;
            const isPrimary = PRIMARY_CITIES.includes(name);
            const icon = createCityIcon(
              temp,
              CITY_LABELS[name] ?? name,
              weather.weatherCode,
              isPrimary
            );
            return <Marker key={name} position={[coords.lat, coords.lng]} icon={icon} />;
          })}

        {/* Flood warning markers */}
        {showFloods &&
          activeWarnings.map((warning, i) => {
            const latLng = getFloodLatLng(warning);
            if (!latLng) return null;
            const color = SEVERITY_COLORS[warning.severityLevel] ?? SEVERITY_COLORS[3];
            return (
              <CircleMarker
                key={warning.id || `flood-${i}`}
                center={latLng}
                radius={10}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.5,
                  weight: 2.5,
                  opacity: 0.95,
                  className: "flood-pulse",
                }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={0.9}>
                  Click for warning details
                </Tooltip>
                <Popup>
                  <div className="w-64 space-y-1.5 text-[11px]">
                    <div className="text-xs font-semibold text-white">{warning.severity}</div>
                    <div className="text-zinc-200">{warning.description}</div>
                    <div className="text-zinc-400">
                      <span className="font-medium text-zinc-300">Area:</span> {warning.areaName || "Unknown"}
                    </div>
                    <div className="text-zinc-400">
                      <span className="font-medium text-zinc-300">County:</span> {warning.county || "Unknown"}
                    </div>
                    {warning.riverOrSea && (
                      <div className="text-zinc-400">
                        <span className="font-medium text-zinc-300">River/Sea:</span> {warning.riverOrSea}
                      </div>
                    )}
                    {warning.timeRaised && (
                      <div className="text-zinc-400">
                        <span className="font-medium text-zinc-300">Raised:</span>{" "}
                        {new Date(warning.timeRaised).toLocaleString("en-GB")}
                      </div>
                    )}
                    {warning.message && (
                      <div className="border-t border-white/10 pt-1 text-zinc-300">
                        {warning.message.slice(0, 220)}
                        {warning.message.length > 220 ? "..." : ""}
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {/* Sensor dots (phase 3) */}
        {sensorDots.map((pos, i) => (
          <CircleMarker
            key={`sensor-${i}`}
            center={pos}
            radius={2}
            pathOptions={{
              color: "#93c5fd",
              fillColor: "#93c5fd",
              fillOpacity: 0.5,
              weight: 0,
            }}
          />
        ))}

        {/* Priority zones (phase 4) */}
        {showPriority &&
          (
            [
              [52.8, -1.3],
              [51.4, -2.6],
              [51.5, -0.1],
            ] as L.LatLngExpression[]
          ).map((pos, i) => (
            <CircleMarker
              key={`zone-${i}`}
              center={pos}
              radius={30}
              pathOptions={{
                color: "rgba(251,191,36,0.4)",
                fillOpacity: 0,
                weight: 2,
                dashArray: "6 4",
              }}
            />
          ))}

        {/* Notification pulses (phase 5) */}
        {showNotify &&
          (
            [
              [52.77, -1.2],
              [51.51, -0.12],
              [53.48, -2.24],
            ] as L.LatLngExpression[]
          ).map((pos, i) => (
            <CircleMarker
              key={`notify-${i}`}
              center={pos}
              radius={20}
              pathOptions={{
                color: "rgba(255,255,255,0.5)",
                fillOpacity: 0,
                weight: 1,
                className: "notify-pulse",
              }}
            />
          ))}
      </MapContainer>

      {/* Info panel */}
      {weatherData && (
        <div
          className="absolute left-3 top-3 rounded-lg bg-black/70 px-3 py-2 backdrop-blur-sm"
          style={{ zIndex: 900 }}
        >
          <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE UK CONDITIONS
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="text-[9px] text-zinc-500">Source: Open-Meteo API</span>
            <span className="text-[9px] text-zinc-500">Source: Environment Agency</span>
            <span className="text-[9px] text-zinc-500">Radar: RainViewer</span>
            <span className="text-[9px] text-zinc-500">Map: {activeBaseMap.name}</span>
          </div>
          {radarStatus === "error" && (
            <div className="mt-1 text-[10px] text-amber-300">Radar temporarily unavailable</div>
          )}
          {radarTimestamp && (
            <div className="mt-1 text-[10px] text-zinc-400">
              Radar {radarTimestamp}
            </div>
          )}
          {forecastHour > 0 && (
            <div className="mt-0.5 text-[10px] text-zinc-500">Forecast +{forecastHour}h</div>
          )}
        </div>
      )}

      {/* Warning count */}
      {showFloods && activeWarnings.length > 0 && (
        <div
          className="absolute right-3 top-3 rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-sm"
          style={{ zIndex: 900 }}
        >
          <span className="text-xs text-zinc-400">
            <span className="font-bold text-white">{activeWarnings.length}</span> active warnings
          </span>
        </div>
      )}

      {/* Legend */}
      {showFloods && activeWarnings.length > 0 && !compact && (
        <div
          className="absolute bottom-14 left-3 flex flex-col gap-1 rounded-lg bg-black/70 p-2 backdrop-blur-sm"
          style={{ zIndex: 900 }}
        >
          {Object.entries(SEVERITY_COLORS).map(([level, color]) => (
            <div key={level} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-zinc-400">
                {level === "1" ? "Severe" : level === "2" ? "Warning" : "Alert"}
              </span>
            </div>
          ))}
          <span className="pt-1 text-[9px] text-zinc-500">Click markers for details</span>
        </div>
      )}

      {/* Zoom controls */}
      <div
        className="absolute right-3 bottom-14 flex flex-col gap-1"
        style={{ zIndex: 900 }}
      >
        <button
          onClick={() => map?.zoomIn()}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-xs font-bold text-white backdrop-blur-sm hover:bg-black/90"
        >
          +
        </button>
        <button
          onClick={() => map?.zoomOut()}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-xs font-bold text-white backdrop-blur-sm hover:bg-black/90"
        >
          -
        </button>
        <button
          onClick={() => map?.fitBounds(UK_BOUNDS, { padding: [10, 10] })}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-[8px] font-bold text-white backdrop-blur-sm hover:bg-black/90"
          title="Reset view"
        >
          UK
        </button>
      </div>

      {/* Sensor badge (phase 3) */}
      {showAssets && (
        <div
          className="absolute bottom-14 right-12 rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-sm"
          style={{ zIndex: 900 }}
        >
          <span className="text-[10px] text-zinc-400">
            <span className="font-bold text-blue-300">1,847</span> sensors active
          </span>
        </div>
      )}

      {/* Forecast timeline */}
      {showTimeline && weatherData && (
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-black/80 px-4 py-2 backdrop-blur-sm"
          style={{ zIndex: 900 }}
        >
          <button
            onClick={() => setPlaying(!playing)}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-[10px] text-white hover:bg-white/10"
          >
            {playing ? "⏸" : "▶"}
          </button>
          <div className="relative h-1 flex-1 rounded-full bg-white/10">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-white/40 transition-all duration-300"
              style={{ width: `${(forecastHour / 23) * 100}%` }}
            />
          </div>
          <span className="w-12 text-right text-[10px] font-mono text-zinc-400">
            +{forecastHour}h
          </span>
        </div>
      )}
    </div>
  );
}
