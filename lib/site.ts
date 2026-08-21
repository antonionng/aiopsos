/**
 * Public origin used for canonicals, robots, and the sitemap.
 *
 * Marketing lives on www. The env var wins when it is a real URL, except we
 * normalise the apex host so crawlers are not split between experrt.com and
 * www.experrt.com. A trailing slash is stripped so path concatenation is safe.
 */
export const DEFAULT_SITE_URL = "https://www.experrt.com";

export function getPublicSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;

  try {
    const url = new URL(raw);
    if (url.hostname === "experrt.com") {
      url.hostname = "www.experrt.com";
    }
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
