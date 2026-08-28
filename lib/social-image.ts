import { getPublicSiteUrl } from "./site.ts";

/**
 * Site-wide social card: the branded 1200x630 artwork at
 * app/opengraph-image.png. Child pages that set their own openGraph object
 * replace the parent (Next does not deep-merge nested metadata), so every
 * public metadata export must re-attach these fields or LinkedIn/Facebook
 * get a bare link.
 */
export const SITE_OG_IMAGE_WIDTH = 1200;
export const SITE_OG_IMAGE_HEIGHT = 630;
export const SITE_OG_IMAGE_PATH = "/opengraph-image.png";
export const SITE_OG_IMAGE_ALT =
  "Experrt - AI training for teams that need capability, not just tools";
export const SITE_TWITTER_CARD = "summary_large_image" as const;

export type SiteShareImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export function siteOgImageUrl(baseUrl = getPublicSiteUrl()): string {
  return `${baseUrl}${SITE_OG_IMAGE_PATH}`;
}

export function siteShareImage(baseUrl = getPublicSiteUrl()): SiteShareImage {
  return {
    url: siteOgImageUrl(baseUrl),
    width: SITE_OG_IMAGE_WIDTH,
    height: SITE_OG_IMAGE_HEIGHT,
    alt: SITE_OG_IMAGE_ALT,
  };
}

type OpenGraphFields = {
  images?: unknown;
  [key: string]: unknown;
};

type TwitterFields = {
  card?: string;
  images?: unknown;
  [key: string]: unknown;
};

type ShareMetadata = {
  openGraph?: OpenGraphFields;
  twitter?: TwitterFields;
  [key: string]: unknown;
};

/**
 * Re-attach the branded card (and the large Twitter card) onto page-level
 * metadata. Existing openGraph.images / twitter.images are kept so a route
 * with its own artwork is not overwritten.
 */
export function withSiteShareImages<T extends ShareMetadata>(
  metadata: T,
  baseUrl = getPublicSiteUrl()
): T {
  const image = siteShareImage(baseUrl);
  const openGraph = { ...(metadata.openGraph ?? {}) };
  const twitter = { ...(metadata.twitter ?? {}) };

  if (openGraph.images == null) {
    openGraph.images = [image];
  }
  twitter.card = SITE_TWITTER_CARD;
  if (twitter.images == null) {
    twitter.images = [image.url];
  }

  return {
    ...metadata,
    openGraph,
    twitter,
  };
}

export function metadataHasShareImage(metadata: ShareMetadata): boolean {
  const images = metadata.openGraph?.images;
  if (!Array.isArray(images) || images.length === 0) return false;

  const first = images[0] as { url?: unknown; width?: unknown; height?: unknown };
  if (typeof first?.url !== "string" || !first.url.includes(SITE_OG_IMAGE_PATH)) {
    return false;
  }
  if (first.width !== SITE_OG_IMAGE_WIDTH || first.height !== SITE_OG_IMAGE_HEIGHT) {
    return false;
  }
  if (metadata.twitter?.card !== SITE_TWITTER_CARD) return false;

  const twitterImages = metadata.twitter?.images;
  if (!Array.isArray(twitterImages) || twitterImages.length === 0) return false;
  const twitterUrl = twitterImages[0];
  return typeof twitterUrl === "string" && twitterUrl.includes(SITE_OG_IMAGE_PATH);
}
