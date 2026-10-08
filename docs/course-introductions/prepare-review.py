"""Prepare private machine transcripts and visual audit sheets, not approval.

Run with the isolated media-pilot Python environment. The speech model must
already be available locally. No transcription API or paid service is used.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--model-dir", required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
manifest = root / "docs/course-introductions/production.json"
production = json.loads(manifest.read_text())
for job in production["courses"]:
    if not job.get("output") or job.get("reviewed"):
        continue
    media = root / job["output"]
    base = media.with_suffix("")
    log = Path(str(base) + ".preparation.log")
    with log.open("a") as output:
        if not Path(str(base) + ".transcript-draft.json").exists():
            subprocess.run([sys.executable, str(root / "docs/media-pilot/transcribe-media.py"),
                            str(media), "--model-dir", args.model_dir,
                            "--prompt", "Experrt Academy. British English."],
                           check=True, stdout=output, stderr=output)
        if not Path(str(base) + "-scenes.json").exists():
            subprocess.run([sys.executable, str(root / "docs/course-introductions/inspect-video.py"),
                            str(media)], check=True, stdout=output, stderr=output)
    job["transcriptDraft"] = str(base.relative_to(root)) + ".transcript-draft.txt"
    job["captionsDraft"] = str(base.relative_to(root)) + ".captions-draft.vtt"
    job["visualAudit"] = str(base.relative_to(root)) + "-scenes.json"
    job["reviewed"] = False
    # Reload so other review notes are preserved while a longer batch runs.
    current = json.loads(manifest.read_text())
    current["courses"] = [dict(item, **{k: job[k] for k in
                          ("transcriptDraft", "captionsDraft", "visualAudit", "reviewed")})
                          if item["slug"] == job["slug"] else item
                          for item in current["courses"]]
    manifest.write_text(json.dumps(current, indent=2) + "\n")
    print(job["slug"] + ": review files prepared; recording not approved", flush=True)
