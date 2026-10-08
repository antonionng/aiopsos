"""Check the complete overview rollout without uploading or deploying anything.

Exit 0 means the local release record is complete, not that live URLs have been
verified. Live playback and URL checks are still required after media upload.
"""
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit

root = Path(__file__).resolve().parents[2]
production = json.loads((root / "docs/course-introductions/production.json").read_text())
register = json.loads((root / "lib/course-introductions/media.json").read_text())
catalogue = json.loads((root / "lib/course-introductions/catalogue.json").read_text())
jobs = [production["academy"], *production["courses"]]
records = []

def check_media_url(value):
    if not isinstance(value, str) or not value:
        return False
    url = urlsplit(value)
    if url.query or url.fragment or "/api/public/course-media-preview/" in value:
        return False
    if value.startswith("/") and not value.startswith("//"):
        return (root / "public" / value.lstrip("/")).is_file()
    # HTTPS media must use a permanent public URL; signed downloads and local
    # review URLs are not publishable. Accessibility is verified before deploy.
    return url.scheme == "https" and url.hostname not in {
        None, "localhost", "127.0.0.1", "::1", "drum.usercontent.google.com",
    }

for job in jobs:
    blockers = []
    slug = job["slug"]
    if not job.get("output") or not (root / job.get("output", "__missing__")).is_file():
        blockers.append("Recording not downloaded")
    elif job.get("outputSha256") != hashlib.sha256((root / job["output"]).read_bytes()).hexdigest():
        blockers.append("Record the hash of the exact reviewed output")
    source = root / job["source"]
    if not source.is_file() or job.get("sourceSha256") != hashlib.sha256(source.read_bytes()).hexdigest():
        blockers.append("Source missing or source version not recorded")
    if job.get("reviewed") is not True or job.get("status") != "approved":
        blockers.append("Recording not approved")
    checks = job.get("reviewChecks", {})
    for check in ("listening", "pronunciation", "captionsAgainstSpeech", "completeVisualReview"):
        if checks.get(check) != "passed":
            blockers.append(f"{check} pending")
    if job.get("unresolvedIssues") or (job.get("issues") and not job.get("correctionsResolved")):
        blockers.append("Recorded corrections unresolved")
    media = register.get(slug, {})
    if media.get("reviewed") is not True:
        blockers.append("Public media register not approved")
    for field in ("src", "poster", "captions", "transcript"):
        if not check_media_url(media.get(field)):
            blockers.append(f"{field} needs a published asset")
    records.append({"slug": slug, "ready": not blockers, "blockers": blockers})

catalogue_slugs = {c["slug"] for c in catalogue}
job_slugs = [j["slug"] for j in production["courses"]]
scope_ok = len(job_slugs) == len(set(job_slugs)) and set(job_slugs) == catalogue_slugs
authorised = production.get("release", {}).get("authorisedByUser") is True
ready = scope_ok and authorised and all(r["ready"] for r in records)
report = {
    "checkedAt": datetime.now(timezone.utc).isoformat(),
    "publicationAuthorised": authorised,
    "scopeMatchesCatalogue": scope_ok,
    "overviewsExpected": len(records),
    "overviewsDownloaded": sum(bool(j.get("output")) for j in jobs),
    "readyCount": sum(r["ready"] for r in records),
    "readyForRelease": ready,
    "liveAssetPlaybackVerified": False,
    "records": records,
}
output = root / "output/course-introductions/release-readiness.json"
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(report, indent=2) + "\n")
print(f"Publication authorised: {authorised}. {report['readyCount']}/{len(records)} overview records ready. Report: {output}")
sys.exit(0 if ready else 1)
