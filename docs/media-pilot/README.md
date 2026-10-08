# Experrt private media pilot

Two AI-generated samples have been created from Foundations module 1, **Choose a task you do every day or week**. The pilot uses Google's Notebook web interface, with no application integration or deployment.

## Files

- `foundations-module-01-source.md`: the module-specific teaching source uploaded to Google.
- `video-generation-prompt.md`: video content instructions and Experrt illustration style.
- `audio-generation-prompt.md`: two-host beginner discussion instructions.
- `course-version.json`: source version, fingerprints and generation settings.
- `review-checklist.md`: checks required before approving the complete recordings.
- `video-revision-source.md`, `video-revision-prompt.md` and `audio-revision-prompt.md`: shorter source and revised instructions following the first reviews.
- `review-notes.md`: complete content and visual review findings, remaining checks and rejected attempts.
- `../../output/media-pilot/`: downloaded media, actual transcript drafts, captions and review evidence.

## Production record

The private notebook is [Experrt AI-generated pilot | Foundations 01 | Choose a regular task](https://notebook.google.com/notebook/e65d2aa9-fc3f-4fe9-9b36-edcbd590850d).

The existing signed-in Google account already displays Pro access. No purchase, upgrade or paid API was requested or used. Standard Audio Overview Deep Dive and Video Overview Explainer formats were selected. Watermark removal was not requested. Sharing was inspected: only the owner is listed; no additional people were added and no public access was enabled.

On 3 October 2026, both generation jobs visibly entered their generating state. Audio settings: English, Deep Dive, Default length, requested target 8 to 12 minutes. Video settings: English, Explainer, Custom visual style, requested target 5 to 7 minutes. Google controls the actual lengths and output styling.

## Samples ready for private review

| Sample | Actual duration | Downloaded original |
| --- | --- | --- |
| Narrated video, attempt 2 | 5:45 | `output/media-pilot/foundations-01-video.ai-generated.mp4` |
| Two-host discussion, attempt 3 | 10:58 | `output/media-pilot/foundations-01-audio.ai-generated.m4a` |

The branded [local review page](http://127.0.0.1:3033/) offers playback, transcript draft downloads, video VTT/SRT captions and the unchanged written exercise. Its file is `output/media-pilot/index.html`. The preview server binds only to 127.0.0.1 and serves only the pilot output folder. It is not a public site or an application deployment.

Start or restart the preview with `python3 docs/media-pilot/serve-preview.py`. This uses concurrent requests and HTTP byte ranges so the video and audio players can load and seek independently. The initial simple HTTP server was replaced after a reported playback failure. Range responses, their actual file bytes, invalid ranges and simultaneous audio/video requests were checked; results are saved in `output/media-pilot/playback-server-checks.json`.

Complete transcripts were reviewed against the source; the opening and all 18 detected video scene changes were inspected. Captions were format-checked and verified visibly during playback. First attempts with unsupported claims or unsuitable length are preserved privately with review notes.

Generation is not approval. The assistant cannot receive audio input in this session, so it cannot claim a full listening review or word-for-word caption verification. Those checks remain outstanding, including a possible Larch pronunciation issue at 03:26 in the video and literal timezone wording. Google's branding control was partial, and the generated exercise instructions are compressed; the full original exercise is provided beside the media. Both recordings remain AI-generated review copies, not approved content for paid courses.
