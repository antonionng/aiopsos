# Arcade Apprentice: playable festival adventure

Implemented locally at `/wonderlab/arcade-preview` on 11 October 2026.

This is one adventure for testing the new first-person direction. It is not the completed four-world, 40-game curriculum in `wonderlab-first-person-worlds-plan.md`. The four help levels share the world. Little Explorers use picture choices with simpler spoken guidance; older learners write and revise instructions.

## The adventure

Mira needs games for the lantern festival. The player creates and plays three versions:

1. A treasure hunt whose objects and count come from their instructions.
2. A revised game with a golden key. Both the key and the treasure quota are needed to open the portal.
3. A new version for a visitor. Moss wants a short, gentle hunt without a key; Nova wants a longer key quest. The saved rules must differ from the previous creation.

The chapters advance after the player finishes a matching game. Designing alone does not finish a chapter. Three separate design snapshots are retained. These are records of practice reported by the client, not assessed mastery.

## What works

- An original Babylon.js island with a workshop, animated Pip, treasure, a golden key garden, a locked portal and festival lanterns that light progressively.
- Three selectable avatars, five colours and a matching first-person glove or compass.
- Touch movement, drag-to-look, keyboard movement and continuous guided walking. One tap walks through the complete game; Stop walking, manual movement and the menu interrupt it.
- One Build and play action for every help level. Walking never edits the design.
- A clearly labelled practice helper that changes the world, treasure, count, walking speed, key rule and optional bonus. It uses prepared rules rather than generating code.
- Twenty authored teaching clips in the existing Marin voice. Voice is optional and the same words appear on screen. Younger children hear simpler explanations. Only fixed curriculum text was sent to the voice service.
- Device-local saving, legacy-save migration, a downloadable learning story and self-contained playable HTML exports. The export uses a lightweight renderer with the same treasure, key and portal rules.
- Optional older-learner AI naming and explanation. It keeps the existing parent permission, entitlement, moderation and allowance checks. The server receives supported settings, not typed prompts or custom titles.
- Explicit family load/save controls with revision conflicts. A device creation is never silently assigned to a child on a shared device.
- A separate family project card, factual practice summaries and downloads of the current game and chapter creations. This optional project uses the existing Game Concept Studio entitlement and a separate adventure version. It never marks the original mission completed.

## Verification

- 97 Wonderlab tests passed, including chapter progression, strict design parsing, executable downloaded gameplay, narration assets, guided AI and account routes.
- PGlite tests execute the existing database RPCs and cover ownership, entitlements, expiry, refunds, revision conflicts, exports and isolation from original lesson progress.
- All 20 new MP3 files passed transcript matching during generation, manifest checks and MP3 signature checks.
- Targeted ESLint, TypeScript checks and the production build passed. The local preview route returned HTTP 200.
- The earlier prototype was played through in the browser on desktop and a 390 × 844 viewport, including downloads and local restore.
- The updated three-chapter/key-quest browser playthrough still needs completion: browser control timed out while the Mac was locked. Physical phone and family playtests also remain.
- No real child records were written during verification, and no live child-facing generation was requested. Provider response behaviour was tested with mocks. Production deployment is not part of this local pass.

## Next validation

After the Mac is unlocked, play all three chapters on desktop and mobile, verify key-first collection, interrupt and resume guided walking, hear Pip at chapter transitions, refresh a saved adventure and exercise family saves with an authorised testing profile. Watch whether a child can explain what their prompt changed and why they chose a different game for a visitor.

The next development milestone is a different practical creation adventure, followed by distinct experiences for each age band. Earned AI avatars and the remaining planned adventures are not implemented in this preview.
