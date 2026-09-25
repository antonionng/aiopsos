import { test } from "node:test";
import assert from "node:assert/strict";

import { clampSeats, isSeatPurchase, parseInvites } from "../self-serve/team-rules.ts";

test("a team is between two and fifty places", () => {
  assert.equal(clampSeats(1), null);
  assert.equal(clampSeats(2), 2);
  assert.equal(clampSeats("12"), 12);
  assert.equal(clampSeats(50), 50);
  assert.equal(clampSeats(51), null);
  assert.equal(clampSeats(3.5), null);
});

test("invites read plain emails, named emails, and name-comma-email lines once each", () => {
  const { invites, rejected } = parseInvites(
    [
      "sam@example.com",
      "Aisha Khan <Aisha@Example.com>",
      "Tom Reed, tom@example.co.uk",
      "a@x.io; b@x.io",
      "SAM@example.com",
      "not-an-email",
    ].join("\n")
  );
  assert.deepEqual(
    invites.map((invite) => [invite.email, invite.name]),
    [
      ["sam@example.com", null],
      ["aisha@example.com", "Aisha Khan"],
      ["tom@example.co.uk", "Tom Reed"],
      ["a@x.io", null],
      ["b@x.io", null],
    ]
  );
  assert.deepEqual(rejected, ["not-an-email"]);
});

test("seat purchases are recognised by their session prefix", () => {
  assert.equal(isSeatPurchase("team_seat:abc"), true);
  assert.equal(isSeatPurchase("cs_live_123"), false);
  assert.equal(isSeatPurchase(null), false);
});
