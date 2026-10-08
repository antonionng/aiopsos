// Run after next build. Page metadata imports the course image module, so both
// functions need their filesystem assets included in the deployment trace.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = process.cwd();
const required = ['public/experrt-logo.png', 'public/fonts/space-grotesk-bold.ttf'];
const traces = ['.next/server/app/(public)/courses/[slug]/page.js.nft.json', '.next/server/app/opengraph-image.png/route.js.nft.json'];
for (const trace of traces) {
  const absolute = path.join(root, trace);
  const files = JSON.parse(fs.readFileSync(absolute, 'utf8')).files.map(file => path.resolve(path.dirname(absolute), file));
  for (const asset of required) {
    const target = path.join(root, asset);
    assert(files.includes(target), `${trace} does not package ${asset}`);
    assert(fs.statSync(target).size > 0, `${asset} is empty`);
  }
}
console.log('Course metadata and social-image functions package their logo and font.');
