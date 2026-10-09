# Wonderlab adventure district

The older learner routes now open a graphical game player. `/wonderlab/district` is the public entrance. The two existing older free-game slugs remain free: `prompt-repair-shop` and `brief-builder`. Other game routes require the selected child’s existing mission entitlement.

## Game formats

- Signal Hunt provides a navigable district, source collection, claim-to-source connections and a fictional broadcast that changes when edited. Privacy, publication and study missions supply different evidence and decisions.
- World Forge turns placed path and bridge pieces into explicit build instructions. Learners fabricate the result, control a character to test each destination and repair blocked routes. Branching worlds require both journeys to be tested.
- Launch Control animates a schedule with resource limits, dependencies and helper assignments. Conflicts remain visible and can be repaired without a timer.
- The pattern laboratory uses an explicitly labelled nearest-example simulation. Uncertain predictions remain uncertain. Checked unfamiliar examples are compared with the model’s output.

Each of the 12 older missions has two challenges, an ungraded learner reflection, a private creation download and a cosmetic sticker reward. The download is readable text containing the actual instructions, timetable or evidence edits and the learner’s reflection. Replaying retains the previous creation until a replacement is completed.

The younger games retain their existing animations and interactions. Longer demonstrations and explanations are available through clearly labelled help, leaving the current mission and controls easier to find.

## Persistence and compatibility

`wonderlab_adventure_progress` stores checkpoints by child, mission slug and independent game version. It does not replace `wonderlab_progress`, entitlement content versions or existing creations. `?classic=1` opens the original lesson workspace, including its existing guided writing tools and parental controls.

`POST /api/wonderlab/adventure` accepts an action and expected revision. The server checks the authenticated household, selected child and entitlement, evaluates the action against its authored game definition, and saves through a service-only SQL function. The function checks ownership and access again and serialises initial inserts and later updates. A stale revision returns 409; the player restores the latest checkpoint and asks the learner to repeat their intended move. Failed requests leave the displayed saved state intact and provide an explicit retry.

Browser roles cannot read or write the checkpoint table directly. Parent insights use the existing reauthenticated family endpoint and only query the parent’s child IDs. Completed work remains exportable from that endpoint after play access expires. The checkpoint foreign key cascades when the child is finally deleted under the existing retention process.

Free games use a versioned, validated action journal in session storage. They never write to a child profile. Browser storage failure falls back to the current page’s memory. Free-game reflections are not sent to a generation provider.

## Narration and AI

The 24 new mission recordings use the existing British Marin voice and publishing configuration. Live generation settings, provider retention gates and parental enablement are unchanged. The games clearly identify prepared content and simplified simulations. Voice controls use reviewed authored recordings rather than device speech.

## Verification

Automated checks cover all 24 challenge layouts, invalid actions, inaccessible routes, sources, helper assignments, uncertainty, completion, replay retention, revisions, ownership, expiry, refunds and browser-role isolation. API integration tests run against isolated PGlite databases. Existing family, payment, narration and public-route checks also pass.

Browser checks covered a completed two-challenge construction run, keyboard movement, evidence collection and broadcast repair, a launch rehearsal, the pattern laboratory, refresh recovery, tablet/mobile layouts and the existing younger Robot Rescue animation. Family usability studies and parent-observed testing remain a human validation step; these checks do not establish educational effectiveness.

Run the focused suite with:

```sh
node --conditions=react-server --experimental-strip-types --test lib/wonderlab/*.test.ts lib/wonderlab/adventure/*.test.ts lib/__tests__/public-routes.test.ts lib/__tests__/stripe-payments.test.ts scripts/wonderlab-realtime-voice.test.mts
```
