# Robot Rescue benchmark review

7 October 2026. This is an implementation and usability review, not evidence of testing with children.

## Learning objective

With a grown-up, a child aged 4–6 practises giving ordered instructions, watching what happens, repairing a mistake and checking a confident answer against visible evidence. Following fixed arrow commands is explicitly distinguished from AI learning patterns from examples.

## Findings and changes

- The original introduction and expanded demonstration pushed the game far down the page. A compact introduction now puts the playable challenge first; the animated, narrated demonstration remains available on request.
- The original route cards did not show which instruction was running or which one failed. The active arrow now highlights during movement. An unsafe arrow is marked with a cross and dashed outline, with instructions for removing it.
- Children could only undo the final arrow or clear the entire plan. Every numbered arrow is now a touch and keyboard button that removes that step. Stop Pip interrupts playback without discarding the plan.
- Explanations now change with the child's action: add an arrow, press Go, watch, repair, fetch the key or celebrate reaching home. Authored narration accompanies the new help controls.
- An unfinished route now survives refresh in the same browser tab. Free play remains anonymous; route drafts are not sent to the family database. Play again clears all three route drafts. Storage failures fall back to memory.
- Completing the three routes now leads to a separate picture-evidence challenge before the sticker. The child taps two apples to count them, then checks a fictional AI answer claiming there are three. A mistaken choice gets an explanation and unlimited retries.
- The final route changes the bridge location, requiring a new plan. Parent notes explain the developmental skills, the simulation's limits, prompts that do not give away the route and an offline activity.
- Voice-off is respected for answer feedback; explicit Hear buttons enable narration. Captions and touch/keyboard controls remain available. Reduced-motion preferences disable movement transitions, while each command is still shown.

## Verification

- Production build, TypeScript and targeted ESLint checks passed. All 18 focused game, curriculum and narration tests passed.
- All 382 current narration scripts have local audio assets, including the 11 new coaching and evidence-check recordings.
- Browser playthrough covered all three routes, keyboard input, removing a failed command, stopping and restarting Pip, draft recovery after refresh, the final evidence challenge, incorrect-answer feedback and sticker completion.
- Both apples must be counted before either answer is enabled. A wrong answer leaves the challenge available; the correct answer reveals the reward button. Voice-off stayed off during answer feedback.
- Completed progress survived refresh. Play again returned to the first route with an empty plan. The spoken demonstration progressed and its ready button returned keyboard focus to the game.
- At a 768px tablet viewport, the layout had no horizontal overflow and the route controls worked. Desktop viewport was restored after the check. No browser console errors were recorded.
- Sticker file download could not be confirmed through the in-app browser's download event, which timed out. The reward screen and completion persistence were verified; check the actual download in a normal browser during the pilot.

## Family pilot procedure

Test with families across ages 4, 5 and 6, including children who are not yet reading. Ask a grown-up to support reading and controls without supplying answers. Collect minimal anonymous observations rather than child names or recordings.

1. Open a fresh free game. Observe whether the child knows what to tap and that arrows describe future steps rather than moving Pip immediately.
2. Watch the demonstration if needed. Check whether the child understands one arrow means one square.
3. Let the child make a wrong turn. Observe whether the highlighted arrow and feedback help them repair it without restarting the whole route.
4. Complete the key mission and unfamiliar bridge layout. Note when adult help was required and whether the child can explain their change.
5. Try the apple check. Ask “How do you know?” to distinguish counting evidence from guessing a button.
6. Collect the sticker, refresh and replay. Check comfort with sound, narration, focus visibility and touch targets on a tablet.
7. Ask the parent what skill they saw practised, what was confusing and whether the wider membership would offer enough useful play.

Do not use sticker completion alone as proof of learning or independent AI competence. Use pilot observations to revise difficulty, narration length and layout before treating this as the standard for the remaining games.
