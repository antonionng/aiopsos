import { fetchWeather, fetchAllCitiesWeather } from "@/lib/weather-api";
import { fetchFloodWarnings } from "@/lib/flood-api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    if (type === "weather") {
      const data = await fetchWeather("loughborough");
      return Response.json(data);
    }

    if (type === "weather-all") {
      const data = await fetchAllCitiesWeather();
      return Response.json(data);
    }

    if (type === "floods") {
      const data = await fetchFloodWarnings(20);
      return Response.json(data);
    }

    return Response.json({ error: "Specify type=weather, weather-all, or type=floods" }, { status: 400 });
  } catch (err) {
    return Response.json(
      { error: "Failed to fetch data", detail: String(err) },
      { status: 500 }
    );
  }
}
