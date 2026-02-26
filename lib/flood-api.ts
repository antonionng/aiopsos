export interface FloodWarning {
  id: string;
  description: string;
  areaName: string;
  county: string;
  riverOrSea: string;
  severity: string;
  severityLevel: number;
  message: string;
  timeRaised: string;
  isTidal: boolean;
}

export interface FloodData {
  warnings: FloodWarning[];
  fetchedAt: string;
  totalCount: number;
}

export async function fetchFloodWarnings(limit: number = 15): Promise<FloodData> {
  const url = `https://environment.data.gov.uk/flood-monitoring/id/floods?_limit=${limit}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Flood API error: ${res.status}`);

  const data = await res.json();

  const warnings: FloodWarning[] = (data.items ?? []).map(
    (item: Record<string, unknown>) => ({
      id: (item["@id"] as string) ?? "",
      description: (item.description as string) ?? "",
      areaName: (item.eaAreaName as string) ?? "",
      county: ((item.floodArea as Record<string, unknown>)?.county as string) ?? "",
      riverOrSea: ((item.floodArea as Record<string, unknown>)?.riverOrSea as string) ?? "",
      severity: (item.severity as string) ?? "",
      severityLevel: (item.severityLevel as number) ?? 4,
      message: (item.message as string) ?? "",
      timeRaised: (item.timeRaised as string) ?? "",
      isTidal: (item.isTidal as boolean) ?? false,
    })
  );

  const active = warnings.filter((w) => w.severityLevel <= 3);

  return {
    warnings: active,
    fetchedAt: new Date().toISOString(),
    totalCount: active.length,
  };
}

export function formatFloodsForPrompt(floods: FloodData): string {
  if (floods.warnings.length === 0) {
    return "LIVE FLOOD DATA: No active flood warnings at this time.";
  }

  const warningLines = floods.warnings.map(
    (w, i) =>
      `  ${i + 1}. [${w.severity.toUpperCase()}] ${w.description} — ${w.county} (${w.riverOrSea})${w.isTidal ? " [Tidal]" : ""}\n     Raised: ${w.timeRaised}\n     Detail: ${w.message.slice(0, 300)}...`
  );

  return [
    `LIVE FLOOD WARNINGS (Environment Agency, fetched ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}):`,
    `Total active warnings: ${floods.totalCount}`,
    "",
    ...warningLines,
  ].join("\n");
}

export const FLOOD_AREA_COORDINATES: Record<string, { lat: number; lng: number }> = {
  wessex: { lat: 51.38, lng: -2.36 },
  "east midlands": { lat: 52.83, lng: -1.33 },
  "west midlands": { lat: 52.48, lng: -1.89 },
  "north east": { lat: 54.97, lng: -1.61 },
  "north west": { lat: 53.76, lng: -2.7 },
  "yorkshire": { lat: 53.96, lng: -1.08 },
  "thames": { lat: 51.51, lng: -0.12 },
  "anglian": { lat: 52.63, lng: 1.3 },
  "south west": { lat: 50.72, lng: -3.53 },
  "south east": { lat: 51.17, lng: 0.87 },
  "solent and south downs": { lat: 50.84, lng: -1.07 },
  "devon cornwall and isles of scilly": { lat: 50.39, lng: -4.87 },
};

export function getCoordinatesForWarning(warning: FloodWarning): { lat: number; lng: number } | null {
  const area = warning.areaName.toLowerCase();
  for (const [key, coords] of Object.entries(FLOOD_AREA_COORDINATES)) {
    if (area.includes(key)) return coords;
  }
  return null;
}
