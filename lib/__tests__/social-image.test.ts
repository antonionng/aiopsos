import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  SITE_OG_IMAGE_HEIGHT,
  SITE_OG_IMAGE_PATH,
  SITE_OG_IMAGE_WIDTH,
  SITE_TWITTER_CARD,
  metadataHasShareImage,
  siteOgImageUrl,
  siteShareImage,
  withSiteShareImages,
} from "../social-image.ts";
import {
  blogRedirectMetadata,
  cookiesMetadata,
  coursePageMetadata,
  coursesIndexMetadata,
  experrtAiMetadata,
  insightArticleMetadata,
  insightsIndexMetadata,
  privacyMetadata,
  termsMetadata,
  useCasePageMetadata,
  useCasesIndexMetadata,
  verifyCertificateMetadata,
} from "../public-share-metadata.ts";
import { getPublishedInsights } from "../insights/catalog.ts";
import { getUseCases } from "../use-cases.ts";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

test("the branded card is 1200x630 at an absolute www.experrt.com URL", () => {
  const image = siteShareImage();
  assert.equal(image.url, "https://www.experrt.com/opengraph-image.png");
  assert.equal(image.url, siteOgImageUrl());
  assert.equal(image.width, SITE_OG_IMAGE_WIDTH);
  assert.equal(image.height, SITE_OG_IMAGE_HEIGHT);
  assert.equal(SITE_OG_IMAGE_WIDTH, 1200);
  assert.equal(SITE_OG_IMAGE_HEIGHT, 630);
  assert.equal(SITE_OG_IMAGE_PATH, "/opengraph-image.png");
});

test("withSiteShareImages fills a title-only export so it cannot drop the card", () => {
  const bare = {
    title: "Insights",
    description: "Briefings",
    openGraph: {
      title: "Insights",
      description: "Briefings",
      type: "website",
    },
    twitter: {
      title: "Insights",
      description: "Briefings",
    },
  };

  assert.equal(metadataHasShareImage(bare), false);

  const filled = withSiteShareImages(bare);
  assert.equal(metadataHasShareImage(filled), true);
  assert.equal(filled.twitter.card, SITE_TWITTER_CARD);
  assert.notEqual(filled.twitter.card, "summary");
});

test("withSiteShareImages will not let a page reset twitter:card to summary", () => {
  const filled = withSiteShareImages({
    title: "Article",
    twitter: { card: "summary", title: "Article" },
  });
  assert.equal(filled.twitter.card, "summary_large_image");
  assert.equal(metadataHasShareImage(filled), true);
});

test("every public marketing metadata builder emits og:image and a large Twitter card", () => {
  const builders: [string, ReturnType<typeof withSiteShareImages>][] = [
    ["/", withSiteShareImages({ title: "Experrt" })],
    ["/insights", insightsIndexMetadata()],
    ["/courses", coursesIndexMetadata()],
    ["/use-cases", useCasesIndexMetadata()],
    ["/experrt-ai", experrtAiMetadata()],
    ["/blog", blogRedirectMetadata()],
    ["/verify", verifyCertificateMetadata()],
    ["/terms", termsMetadata()],
    ["/privacy", privacyMetadata()],
    ["/cookies", cookiesMetadata()],
  ];

  for (const [route, metadata] of builders) {
    assert.equal(metadataHasShareImage(metadata), true, route);
  }

  for (const article of getPublishedInsights()) {
    const metadata = insightArticleMetadata(article);
    assert.equal(
      metadataHasShareImage(metadata),
      true,
      `/insights/${article.slug}`
    );
    assert.equal(metadata.twitter.card, "summary_large_image");
    assert.notEqual(metadata.twitter.card, "summary");
    assert.equal(metadata.openGraph.type, "article");
    assert.equal(metadata.title, article.title);
  }

  for (const entry of getUseCases()) {
    const metadata = useCasePageMetadata(entry);
    assert.equal(
      metadataHasShareImage(metadata),
      true,
      `/use-cases/${entry.slug}`
    );
    assert.equal(metadata.title, `${entry.name} - Use cases`);
  }
});

test("course pages keep a local generated card and still force summary_large_image", () => {
  const metadata = coursePageMetadata({
    title: "AI foundations",
    summary: "A live course.",
    slug: "ai-foundations-for-every-role",
  });
  assert.equal(metadata.twitter.card, "summary_large_image");
  assert.equal("images" in (metadata.openGraph ?? {}), false);

  const courseImage = join(
    REPO_ROOT,
    "app/(public)/courses/[slug]/opengraph-image.tsx"
  );
  assert.equal(existsSync(courseImage), true);
});

function walkPages(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "dashboard" || entry.name === "api") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkPages(full, acc);
    else if (entry.name === "page.tsx" || entry.name === "layout.tsx") acc.push(full);
  }
  return acc;
}

test("a public page that sets metadata must keep a share image", () => {
  // The 27 Aug 2026 LinkedIn scrape: Insights, courses, use-cases and
  // /experrt-ai set title/description/openGraph and dropped the parent card.
  // Fail here if that pattern comes back.
  const files = walkPages(join(REPO_ROOT, "app")).filter((file) => {
    const rel = relative(REPO_ROOT, file);
    return (
      !rel.startsWith("app/dashboard") &&
      (rel.endsWith("page.tsx") || rel === "app/layout.tsx")
    );
  });

  const metadataPages: string[] = [];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const setsMetadata =
      /export const metadata/.test(source) ||
      /export async function generateMetadata/.test(source);
    if (!setsMetadata) continue;
    metadataPages.push(relative(REPO_ROOT, file));

    const usesHelper =
      source.includes("public-share-metadata") ||
      source.includes("social-image") ||
      source.includes("withSiteShareImages");
    const dir = dirname(file);
    const hasLocalCard =
      existsSync(join(dir, "opengraph-image.tsx")) ||
      existsSync(join(dir, "opengraph-image.png"));

    assert.ok(
      usesHelper || hasLocalCard,
      `${relative(REPO_ROOT, file)} sets metadata without the site share card or a local opengraph-image`
    );

    if (/twitter:\s*\{[\s\S]*?card:\s*["']summary["']/.test(source)) {
      assert.fail(
        `${relative(REPO_ROOT, file)} sets twitter:card back to summary`
      );
    }
  }

  for (const required of [
    "app/(public)/insights/page.tsx",
    "app/(public)/insights/[slug]/page.tsx",
    "app/(public)/courses/page.tsx",
    "app/(public)/use-cases/page.tsx",
    "app/(public)/use-cases/[slug]/page.tsx",
    "app/(company)/experrt-ai/page.tsx",
  ]) {
    assert.ok(
      metadataPages.includes(required),
      `${required} must export metadata so the share-image check covers it`
    );
  }
});
