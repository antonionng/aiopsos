# Pilot review notes

## Review capability

The current assistant can inspect complete speech-recognition transcripts and video images, but cannot receive audio input. An attempted audio review returned: “audio content omitted because you do not support audio input”. Therefore no claim of a complete listening review, verified pronunciation, voice quality or word-for-word transcript verification is made. Final listening and caption comparison remain required before approval for paid courses.

## Audio attempt 1: Default length, 21:13

Google title: Delegating daily tasks to AI agents. Downloaded original: `output/media-pilot/foundations-01-audio-v1.ai-generated.m4a`.

Excluded from the preferred pilot because it is much longer than the requested 8 to 12 minutes. No complete content or listening review was completed for this version. Preserved privately for the production record.

## Audio attempt 2: Short length, 6:01

Google title: Safe First Tasks for AI Agents. Downloaded original: `output/media-pilot/foundations-01-audio-v2.ai-generated.m4a`. The complete machine transcript was reviewed against the teaching source.

Rejected for source fidelity and tone:

- 00:00: unsupported generalisation about businesses and a toddler/bulldozer metaphor, rather than a clear trainer introduction.
- 00:29: “we all know what an AI agent is” assumes beginner knowledge.
- 00:59: “absolutely zero common sense” is an unqualified claim not taught in the source.
- 03:34: claims about AI hating empty spaces and its instinct to invent a date are unsupported additions.
- 04:21: invented 10-second drafting and 20-minute checking examples are not identified as fictional measurements.
- 05:45: changes the exercise to a stricter requirement that another human must understand without asking a question.

Useful source coverage was present, including the three questions, reporting classifications, baseline and practical exercise. The duration is below the requested target. A third attempt uses the shorter revised source, Default length and explicit corrections in `audio-revision-prompt.md`.

## Video attempt 1: Explainer, 8:44

Google title: Choose a Regular Task. Downloaded original: `output/media-pilot/foundations-01-video-v1.ai-generated.mp4`. The complete machine transcript and opening plus 14 scene-change images were reviewed against the source.

Rejected for trainer tone and an unsupported assurance:

- 04:22: says the draft workflow “guarantees” that work is reviewed. Keeping a draft only gives the owner an opportunity to check it.
- 05:18: claims checking ensures absolute accuracy.
- 06:32: “brutally honest” and “cheating yourself” are unnecessarily scolding.
- Repeated intensifiers and rhetorical transitions add length without teaching depth.
- Bright blue glossary cards and table headings depart from the requested purple and cream style. Some other visuals do use lavender and warm illustration.
- The P103 row places “Flagged” under an “Overdue” heading; narration explains a missing date, but the visual should distinguish the missing-date flag explicitly.

The reporting date and P101/P102/P103 classifications in the transcript are consistent with the course. The full practical exercise is included. Google watermark is visibly retained. Actual duration exceeds the target. The revised source and prompt preserve the exercise, remove the unsupported assurances and request consistent branding.

## Preferred audio sample: attempt 3, 10:58

Renamed in Google to Experrt Foundations 01 - AI-generated audio pilot. Downloaded original: `output/media-pilot/foundations-01-audio.ai-generated.m4a`. Actual duration: 658.077 seconds. Complete transcripts from base.en and small.en were compared with the teaching source. The smaller recogniser missed part of the September date; small.en recovered 25 September and the correct Larch name. The small.en transcript is the preferred draft; both raw outputs are retained in `transcription-audit/`.

The source's three task questions, fictional Northstar introduction, report/customer-contact/pricing comparison, P101/P102/P103 distinctions, timing method, at least three later attempts and practical task selection are present. The invented task timings and broad AI-behaviour claims from attempt 2 are absent. The sample identifies itself as an AI-generated pilot.

Remaining editorial points before paid use:

- 00:29: the introduction calls Experrt Academy the course; the accurate course name is Always-On Agents: Foundations, which is given immediately afterwards.
- 02:43: “you simply will not be able to recognise a mistake” is stronger than the source's explanation that familiarity helps checking.
- 05:09: “the damage is already done” is unnecessarily dramatic. The preceding explanation about a message having reached the customer is accurate.
- 06:03: the timezone wording needs a listening check for natural pronunciation.
- 09:02: the exercise says who checks each candidate task; the source also asks how the learner checks it. The complete unchanged exercise is supplied beside the recording in the review page.
- Repeated references to “the source” sound like a document discussion rather than direct teaching. This is a pilot editorial limitation, not approved final trainer copy.

## Preferred video sample: attempt 2, 5:45

Google title: Choose a Daily Task. Downloaded original: `output/media-pilot/foundations-01-video.ai-generated.mp4`. Actual duration: 345.141 seconds. The complete base.en and small.en transcripts, opening visual and all 18 detected scene changes were reviewed. Scene detection decoded the full recording. The small.en transcript is the preferred draft.

The false guarantee of review has been replaced at 02:21 with a clear explanation that a draft creates an opportunity for a person to check it. The scolding wording has been removed. The report/customer-contact/pricing comparison, fictional reporting date and P101/P102/P103 classifications are consistent with the source. Preparation, checking and corrections, at least three attempts at equal quality, and the Northstar alternative are covered. No certificate or full-course completion is promised. Google's visible watermark remains present.

Remaining points before paid use:

- 03:26: both recognisers returned “large website” for the source's Larch website. This could be a mispronunciation or a recognition error. It is explicitly flagged for listening review rather than silently changing the transcript.
- 02:55: “Europe slash London” is literal timezone wording; check the spoken delivery.
- The project table at 03:08 labels P103 “Missing” under “Status”. The narration correctly explains a missing date, but the visual label should say “Due date missing” and remain distinct from the underlying open status.
- Some cards use bright green despite the custom purple-and-cream instruction. Lavender, cream and illustrated studio scenes are present, but style control is partial.
- The spoken exercise is compressed. It covers three candidates, information, readers, checks and timing, then asks whether the reviewer and expected result are clear. The complete unchanged written exercise beside the recording explicitly requests the chosen task's reviewer, correct result and retained decisions.

## Caption and playback checks

Draft VTT and SRT captions were created using local word timestamps. They contain at most two lines per cue, at most 42 characters per line, non-negative cue lengths and no overlaps beyond 0.05 seconds. Video has 99 cues, ending at 05:41.480 before the final silent tail. Audio also has a timed draft, although only its transcript is linked in the player.

Experrt and Northstar spelling and British orthography were normalised; unedited recognition files are preserved. Playback of both media files was verified in the local review page. The video caption menu shows English (draft), and caption text was visibly verified during playback. Direct listening and complete speech-to-caption comparison remain outstanding.

Following a playback failure reported on 3 October, the simple preview server was replaced with `serve-preview.py`, which supports concurrent requests and byte-range responses. Both players were started through their visible controls; advancing playback time was observed, with no media errors. Video seeking to approximately 03:06 and audio seeking to approximately 06:00 were verified. The video then advanced to 03:11 and displayed its captions. This verifies player operation, not a complete listening review.

## Disposition

Both preferred samples are ready for private review and fall within the requested duration targets. They are not approved for use in paid courses. The remaining voice, pronunciation, caption and editorial checks are listed above; the review page visibly labels this status. No samples were made public, no paid upgrade or API was used, and no application, database or deployment changes were made.
