import { test } from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_NOTIFY_EMAIL, getNotifyEmail } from "../notify-email.ts";

test("missing NOTIFY_EMAIL still delivers to ag@experrt.com", () => {
  const previous = process.env.NOTIFY_EMAIL;
  delete process.env.NOTIFY_EMAIL;

  assert.equal(DEFAULT_NOTIFY_EMAIL, "ag@experrt.com");
  assert.equal(getNotifyEmail(), "ag@experrt.com");

  if (previous === undefined) delete process.env.NOTIFY_EMAIL;
  else process.env.NOTIFY_EMAIL = previous;
});

test("blank NOTIFY_EMAIL is treated as missing", () => {
  const previous = process.env.NOTIFY_EMAIL;
  process.env.NOTIFY_EMAIL = "   ";

  assert.equal(getNotifyEmail(), "ag@experrt.com");

  if (previous === undefined) delete process.env.NOTIFY_EMAIL;
  else process.env.NOTIFY_EMAIL = previous;
});

test("NOTIFY_EMAIL overrides the default when set", () => {
  const previous = process.env.NOTIFY_EMAIL;
  process.env.NOTIFY_EMAIL = "ops@experrt.com";

  assert.equal(getNotifyEmail(), "ops@experrt.com");

  if (previous === undefined) delete process.env.NOTIFY_EMAIL;
  else process.env.NOTIFY_EMAIL = previous;
});

test("a leftover Kumo inbox is not used for Experrt alerts", () => {
  const previous = process.env.NOTIFY_EMAIL;
  process.env.NOTIFY_EMAIL = "antonio@kumohr.com";

  assert.equal(getNotifyEmail(), "ag@experrt.com");

  if (previous === undefined) delete process.env.NOTIFY_EMAIL;
  else process.env.NOTIFY_EMAIL = previous;
});
