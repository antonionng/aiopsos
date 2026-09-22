import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function source(relative: string): string {
  return readFileSync(path.join(root, relative), "utf8");
}

test("email theme repeats the live site palette", () => {
  const theme = source("lib/email-theme.ts");
  assert.match(theme, /EMAIL_INK = "#201c29"/);
  assert.match(theme, /EMAIL_PAPER = "#fffefa"/);
  assert.match(theme, /EMAIL_VIOLET = "#7046eb"/);
  assert.match(theme, /EMAIL_CITRUS = "#e4f477"/);
  assert.match(theme, /EMAIL_BRAND = EMAIL_CITRUS/);
  assert.match(theme, /EMAIL_BRAND_FOREGROUND = EMAIL_INK/);
  assert.match(theme, /experrt-logo\.png/);
});

test("every email template uses the bright shell, not the old dark amber one", () => {
  const dir = path.join(root, "lib/emails");
  const files = readdirSync(dir).filter((name) => name.endsWith(".tsx") || name.endsWith(".html"));
  assert.ok(files.length >= 20);

  for (const file of files) {
    const text = source(path.join("lib/emails", file));
    assert.equal(text.includes("#0d0d0d"), false, file);
    assert.equal(text.includes("#fbbf24"), false, file);
    assert.equal(text.includes("enterprise AI control layer"), false, file);
    if (file.endsWith(".tsx") && file !== "academy-shell.tsx") {
      assert.match(text, /EmailShell/, `${file} should use EmailShell`);
    }
  }

  const shell = source("lib/emails/academy-shell.tsx");
  assert.match(shell, /emailLogoUrl/);
  assert.match(shell, /EMAIL_CITRUS/);
  assert.match(shell, /EMAIL_INK/);
});
