/**
 * Turn a generated illustration into a transparent asset the site can use.
 *
 * The image models in the Experrt illustration system are prompted to draw
 * white monoline art on a flat black field, because almost none of them emit
 * a usable alpha channel and they all render line work more cleanly on a
 * solid ground. This knocks that field back out.
 *
 * The operation is luminance-as-alpha, not a colour key. Every pixel becomes
 * pure white and its original brightness becomes its opacity, so the soft
 * glow keeps a genuine falloff instead of the grey halo a colour key leaves
 * behind. Recomposited on a dark ground the result is what the model drew.
 *
 * These assets are white-on-transparent and so are dark-theme only, which
 * matches how the marketing site is being built.
 *
 * Run: node --experimental-strip-types scripts/knockout-illustration.ts \
 *        <source.png> public/illustrations/<name>.png
 */

import { stat } from "node:fs/promises";
import sharp from "sharp";

const [source, destination] = process.argv.slice(2);

if (!source || !destination) {
  console.error(
    "Usage: knockout-illustration.ts <source> <destination>\n" +
      "Example: knockout-illustration.ts ~/Downloads/raw.png public/illustrations/gap.png",
  );
  process.exit(1);
}

const { width, height } = await sharp(source).metadata();

if (!width || !height) {
  console.error(`Could not read dimensions from ${source}`);
  process.exit(1);
}

// The brightness of the source becomes the opacity of the result...
const alpha = await sharp(source).greyscale().raw().toBuffer();

// ...over a field that is white everywhere.
const white = Buffer.alloc(width * height * 3, 255);

await sharp(white, { raw: { width, height, channels: 3 } })
  .joinChannel(alpha, { raw: { width, height, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(destination);

const { size } = await stat(destination);

console.log(`${destination}  ${width}x${height}  ${Math.round(size / 1024)} KB`);
