export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  rain: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  hourlyForecast: {
    time: string[];
    temperature: number[];
    precipitationProbability: number[];
    precipitation: number[];
  };
}

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export function getWeatherDescription(code: number): string {
  return WEATHER_CODES[code] ?? "Unknown";
}

export const UK_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  loughborough: { lat: 52.77, lng: -1.2 },
  london: { lat: 51.51, lng: -0.12 },
  birmingham: { lat: 52.48, lng: -1.89 },
  manchester: { lat: 53.48, lng: -2.24 },
  bristol: { lat: 51.45, lng: -2.59 },
  leeds: { lat: 53.8, lng: -1.55 },
  sheffield: { lat: 53.38, lng: -1.47 },
  nottingham: { lat: 52.95, lng: -1.15 },
  leicester: { lat: 52.63, lng: -1.13 },
};

export async function fetchWeather(
  location: string = "loughborough"
): Promise<WeatherData> {
  const coords = UK_LOCATIONS[location.toLowerCase()] ?? UK_LOCATIONS.loughborough;

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", coords.lat.toString());
  url.searchParams.set("longitude", coords.lng.toString());
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m"
  );
  url.searchParams.set(
    "hourly",
    "temperature_2m,precipitation_probability,precipitation"
  );
  url.searchParams.set("forecast_days", "2");
  url.searchParams.set("timezone", "Europe/London");

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

  const data = await res.json();
  const current = data.current;

  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    precipitation: current.precipitation,
    rain: current.rain,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    weatherCode: current.weather_code,
    hourlyForecast: {
      time: data.hourly.time,
      temperature: data.hourly.temperature_2m,
      precipitationProbability: data.hourly.precipitation_probability,
      precipitation: data.hourly.precipitation,
    },
  };
}

export async function fetchAllCitiesWeather(): Promise<Record<string, WeatherData>> {
  const entries = Object.entries(UK_LOCATIONS);
  const results = await Promise.all(
    entries.map(async ([name]) => {
      const data = await fetchWeather(name);
      return [name, data] as const;
    })
  );
  return Object.fromEntries(results);
}

export function formatWeatherForPrompt(weather: WeatherData, location: string): string {
  return [
    `LIVE WEATHER DATA (${location}, ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}):`,
    `- Temperature: ${weather.temperature}°C`,
    `- Humidity: ${weather.humidity}%`,
    `- Conditions: ${getWeatherDescription(weather.weatherCode)}`,
    `- Current precipitation: ${weather.precipitation}mm`,
    `- Rain: ${weather.rain}mm`,
    `- Wind speed: ${weather.windSpeed} km/h`,
    `- Next 12h precipitation forecast: ${weather.hourlyForecast.precipitation.slice(0, 12).map((p, i) => `${weather.hourlyForecast.time[i]?.split("T")[1]}: ${p}mm (${weather.hourlyForecast.precipitationProbability[i]}% prob)`).join(", ")}`,
  ].join("\n");
}
