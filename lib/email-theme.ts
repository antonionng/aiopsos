import { getPublicSiteUrl } from "@/lib/site";

/**
 * Brand literals for email HTML. Email clients get no CSS variables, so the
 * palette from the live marketing site (www.experrt.com, `.ex-home`) is
 * repeated here. If those tokens change on the site, change them here too.
 *
 *   --ex-ink    #201c29
 *   --ex-paper  #fffefa
 *   --ex-violet #7046eb
 *   --ex-citrus #e4f477
 *   --ex-line   #dedce1
 *
 * The wordmark asset is white. It sits on the ink header, the same way the
 * dark theme shows it. Buttons use the citrus fill from the site's primary
 * bright call to action.
 */
export const EMAIL_INK = "#201c29";
export const EMAIL_PAPER = "#fffefa";
export const EMAIL_VIOLET = "#7046eb";
export const EMAIL_CITRUS = "#e4f477";
export const EMAIL_LINE = "#dedce1";
export const EMAIL_MUTED = "#66616e";
export const EMAIL_CARD = "#ffffff";

/** Citrus button with ink label — the bright brand action. */
export const EMAIL_BRAND = EMAIL_CITRUS;
export const EMAIL_BRAND_FOREGROUND = EMAIL_INK;

export const EMAIL_FOOTER =
  "Curiosity is a good place to start. Experrt is a learning platform, academy and AI Labs.";

/** Absolute URL of the live wordmark. Email clients will not load a relative path. */
export function emailLogoUrl(): string {
  return `${getPublicSiteUrl()}/experrt-logo.png`;
}
