# Wonderlab age-level game review

7 October 2026. This extends the Robot Rescue review to the three free games for ages 7–16. It is an implementation review, not a family pilot or a claim that all 24 paid missions have been validated with children.

## Changes

- All four free games start with a compact introduction. An optional animated demonstration explains the controls without pushing the playable activity behind a long lesson.
- Creature Creator, Prompt Repair Shop and Launch Studio retain fixed-choice drafts in the same browser tab. Invalid stored values are rejected. Replay clears that game's drafts; no free-game choices are sent to the family database.
- Editing a choice clears stale error feedback. Coaching changes between planning, testing and repair, with optional recorded narration.
- Creature Creator shows two functional requirements and a field report after testing. The final rainy moon garden needs a different combination of familiar features.
- Prompt Repair Shop identifies the first mismatched instruction. Its final challenge requires removing an unsupported giveaway from an otherwise useful draft, despite a clear request.
- Launch Studio keeps the current claim visible after a decision rather than immediately advancing. Decisions are explicitly unverified until checked. The first mismatch is marked and opened for repair. Its final challenge rejects an invented expert quotation.
- Each new final challenge requires opening supplied evidence, selecting a repair and testing it before collecting the sticker. Wrong choices receive explanations and unlimited retries. The result changes visibly when repaired.
- Parent notes explain the developmental skills, prompts for discussion, an offline activity and the limits of these authored simulations.
- Completed activities disable editing without hiding the creation or source text from assistive technology. Keyboard focus moves to the next action or earned reward.

## Verification

- The 21 focused game, curriculum, draft-validation and narration tests passed. TypeScript, targeted lint and production compilation were checked.
- All 406 current narration scripts have valid local MP3 assets, including 24 new clips. The publisher sends only authored text, never child inputs.
- Browser playthroughs covered all three main rounds and the final challenge in each updated game. Incorrect choices gave specific feedback; corrected choices unlocked progression. Source gates prevented answering the final challenge before opening its evidence.
- Refresh restored unfinished creature, prompt and claim choices. Creature completion also survived refresh. Voice-off remained off during answer feedback.
- Replay returned each game to empty choices. All three layouts stayed within a 768px viewport. Keyboard activation worked, and the final prompt challenge moved focus to the reward button after success. Completed prompt text remained present in the accessibility tree. No console errors were recorded during the inspected flows.
- The final production build passed and is running locally on port 3003. The in-app browser did not expose a completed sticker download event, so file export still needs confirmation in a normal browser.

## Next: family pilot

Use the procedure in `wonderlab-robot-rescue-review.md` for ages 4–6. For each older band, ask a learner and parent to play the corresponding free game without giving them the answer pattern. Observe whether they can explain the goal, repair an error, interpret feedback and explain why the final answer is supported.

Record anonymous notes on where help was required, whether narration and controls were understandable, how the game felt for their age, and what skill the parent saw practised. Include tablet, keyboard and reduced-motion preferences. Do not treat opening a source card or earning a sticker as proof that the learner understood it.

Use these observations before extending the benchmark to all paid missions. Membership checkout and live child AI remain subject to the existing launch checks.
