# Experrt course recordings and marketing rollout

The local homepage, Academy page and all 53 purchasable course pages now explain the learning approach and include a shared course-introduction section. Course-specific copy covers the audience, practical work, assessment and grounded workplace benefits. Recorded explanations are described when the relevant recording exists; a course without one keeps its illustration and written introduction.

The scope of this batch is 53 course-page introductions plus one Academy overview. It does not mean every lesson has already been recorded. The earlier Foundations module 1 recording is also connected to the first lesson in the local development course player. Other modules retain their written lessons and exercises.

## Files and versions

- `production.json` records sources, course versions, actual notebook URLs, generation results, output files and review status.
- `sources/` contains a separate source for each course; `academy-overview-source.md` describes the Academy accurately.
- Version 1 prompts preserve the instructions used for the first batch. Version 2 preserves the initial corrections. Version 3 and the unversioned prompts address the complete transcript and scene-sheet review, including invented module names, unsupported product guarantees, software access and the assessment conditions.
- `review-findings.json` and `corrections/` record course-specific findings for all 18 downloaded overviews. These are content and scene-sheet checks, not listening approval.
- `scripts/prepare-course-introductions.mts` rebuilds sources and public introduction copy from the actual course catalogue, preserving the production ledger. It stops if an in-progress source version has changed.
- `prepare-review.py` uses a local speech model and FFmpeg to produce machine transcript drafts, timed captions and scene contact sheets. These files are preparation for review, not checked transcripts or approval.
- Downloaded recordings and review evidence stay under `output/course-introductions/`, outside `public/`.

## Publication and playback

`lib/course-introductions/media.json` is the explicit media register. All current entries have `reviewed: false`. They are displayed only in development. Production shows the written introduction and illustration until a reviewed recording has a valid published media URL.

The development-only `/api/public/course-media-preview/[filename]` handler serves only registered filenames, supports byte ranges and returns 404 outside development. This lets the page use the existing same-origin security policy without permitting a new external media origin. It makes no database changes. A separate loopback-only review server can serve the output folder on port 3034. The original module pilot remains on port 3033.

Do not set `reviewed: true` while retaining a private file path. Publication needs corrected media, checked captions and transcripts, complete listening and visual review, and accessible production URLs. Retain provider branding in the recordings. Marketing copy describes explanations and course benefits without labelling presenters as AI trainers or discussing production watermarks.

## Current quality findings

Content and detected-scene contact-sheet checks have now been recorded for all 18 downloaded overviews. Seventeen have corrections recorded. The AI Output Verification overview has no course-fact mismatch identified in those checks, but pronunciation, captions and final visual approval remain outstanding; its blue accents also depart from the requested style. None has publication approval.

The Foundations introduction needs revision: around 03:26 it says the project proves real-world application, although the AI assessor checks submitted text and practice may be simulated. The opening course title and AI pronunciation need listening checks; requested branding is only partly followed.

The Academy overview needs revision: around 01:49–02:19 its wording implies unlimited assessment attempts; the team slide at 02:08 says 2 to 60 places instead of 2 to 50; around 02:49–03:19 it overstates independent evidence of competence. The orange branding and pushy ending also depart from the requested style. The revised prompts address these issues, but regeneration must wait for the allowance to reset.

The Dots transcript describes limitations of the assessor correctly, but around 03:46 it calls the skills “real, verifiable” without preserving the distinction between submitted learning evidence and independent verification. Review the actual speech and improve that wording before release. Its transcript and scene audit have been prepared.

This session cannot receive audio input, so the assistant cannot claim a complete listening review, pronunciation check or word-for-word caption verification. Record those checks separately before release. Generated videos can depart from their sources even when the prompt is accurate.

The user has confirmed by listening that the Prompt Engineering overview says “A and I” instead of “AI”. Its pronunciation check is failed, and its replacement is prioritised. The revised generation prompt already requires “ay eye”; check each occurrence in the new recording rather than treating a prompt instruction or changed caption as an audio fix. Apply that pronunciation check to every recording.

## Continuing after the daily allowance resets

Use the existing signed-in Google account and standard Explainer format. Do not buy an upgrade or substitute Cinematic generation. Keep notebooks private. Reuse the notebooks recorded in `production.json` for failed or empty outputs and the quota-blocked course. Prepare new notebooks only for script-ready courses without a notebook URL.

Use the revised prompts for new attempts, record the exact prompt version, and visibly confirm that generation has started before changing the job status. Download finished outputs through the web interface, confirm actual local files and durations, then prepare and review the entire recording. Keep source, prompt and output versions for rejected attempts.

At this stage 18 overview recordings have been downloaded (17 courses and the Academy), leaving 36 course introductions requiring generation or a retry. Transcript and caption drafts and scene audit sheets have been prepared for all 18. The first lesson recording is an additional earlier pilot, not an extra course introduction. A standard Explainer request was rejected by the daily allowance again on 3 October; it was not accepted as a generation job. The screenshot and attempted prompt version are recorded in the ledger. No upgrade was purchased.

A proposed daily continuation was rejected by automatic approval review because explicit recurring-schedule approval was missing. The user has been asked; no recurring automation has been created.

## Authorised production release

On 3 October the user asked to publish everything when finished. This authorises the course and marketing release on the Experrt production site once the recordings are complete and checked. It does not authorise a recurring daily schedule or a paid upgrade. Do not ask for a second deployment confirmation for the same finished rollout.

Run `python3 docs/course-introductions/check-release.py` before release. It writes `output/course-introductions/release-readiness.json` and exits with a non-zero status while any overview is missing, unapproved, changed from its recorded source/output, or still references a private asset. A successful check validates the release records; it does not verify external URLs or replace watching and listening.

Resolve each recorded correction in a new output version, complete listening and visual review, and check captions against the actual speech. Record `reviewChecks.listening`, `reviewChecks.pronunciation`, `reviewChecks.captionsAgainstSpeech` and `reviewChecks.completeVisualReview` as `passed` only after those checks happen. Preserve the original recording and review notes. Record the approved output hash, source hash, `status: approved`, `reviewed: true` and resolved corrections. Update the media register only with the approved video, poster, checked captions and transcript at permanent publishable URLs. Keep private review endpoints disabled in production.

Before deployment, check actual uploaded video playback, seeking, captions and transcript downloads under the site's security policy. Run the build and relevant checks, deploy the authorised change, then verify the live homepage, Academy page, both course families and the existing checkout flow. Report the deployed URL and actual rollout coverage. Continue to describe lesson recordings only for courses where those recordings exist.

On 4 October at 07:27 London time, Google again rejected the standard Explainer request for the Prompt Engineering replacement with the daily Video Overview limit. The exact request and screenshot are saved in the attempts folder and production ledger. The old recording remains flagged; no replacement generation was accepted.
