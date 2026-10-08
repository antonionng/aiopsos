# Workspace resource access and knowledge library

10 September 2026.

Current-workspace membership is now required for knowledge files, saved prompts and personas, both at their API boundary and through restrictive database policies. Saved prompt reads stay in the current organisation, and only the prompt creator may delete their prompt. Persona deletion retains administrator permissions. Delete endpoints report errors or missing rows rather than claiming success.

The knowledge-base storage bucket was absent. Created it private with a 4MB file limit. Uploads accept PDF, DOCX, TXT, MD and CSV, validate size and workspace department, and use generated storage names. Existing metadata policies allow admin/manager uploads and admin deletion; the UI now follows those permissions. Failed metadata writes attempt to remove their uploaded object. Deletion is still a two-system operation, not an atomic storage/database transaction; errors are reported for retry.

Downloads use an authenticated application route, a workspace-scoped metadata read, and a fresh membership check before returning the file. Responses are private/no-store attachments. Direct authenticated client reads of this bucket are disallowed. A verification failure caught a direct storage download succeeding after membership revocation; the final gateway-only path passed the repeated test. Files already downloaded cannot be retracted.

The library displays loading and actionable error states and offers download controls. Removed unsupported automatic AI indexing claims. This release provides a private file library; extraction, indexing and AI retrieval from these uploads remain future work.

## Evidence

- Real synthetic upload, learner download and admin deletion passed.
- Learner upload rejected; unrelated company download rejected.
- Another learner could not delete the creator's shared prompt.
- Revoked session denied by all three resource APIs and download API.
- Revoked direct reads of all three tables returned no rows; raw storage download denied.
- TypeScript, targeted lint and all 210 regression tests passed.
- Local app restored at localhost:3000; browser rendered meaningful content with no framework error overlay.

Multi-workspace switching remains disabled. This closes three legacy resource paths, not the entire permission migration. Broader assessment, reporting and legacy profile-scoped APIs still require conversion.

Production build and promotion succeeded for dpl_GDUaARpafmspvrc1Fg5v9cUUoCqh (aiadop-10xha9tnp). The staged signed-out resource request was redirected to authentication (307). Synthetic fixture cleanup completed, including uploaded objects and associated resource records. The earlier staging build was superseded by this corrected gateway release.
