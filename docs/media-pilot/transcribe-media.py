"""Create local draft transcripts and timed captions; review them before approval.

Usage: <temporary-venv>/bin/python transcribe-media.py MEDIA --model-dir MODEL
No course material or recordings are sent to a transcription API.
"""

import argparse
import json
from pathlib import Path
import textwrap

from faster_whisper import WhisperModel


def stamp(seconds, separator="."):
    milliseconds = round(max(0, seconds) * 1000)
    hours, milliseconds = divmod(milliseconds, 3600000)
    minutes, milliseconds = divmod(milliseconds, 60000)
    seconds, milliseconds = divmod(milliseconds, 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02}{separator}{milliseconds:03}"


def cues_for(words):
    cues = []
    group = []
    for word in words:
        candidate = "".join(w["word"] for w in group) + word["word"]
        if group and (len(textwrap.wrap(candidate.strip(), width=42)) > 2
                      or word["end"] - group[0]["start"] > 5.5):
            cues.append(group)
            group = []
        group.append(word)
        if word["word"].rstrip().endswith((".", "?", "!")) and len(group) >= 4:
            cues.append(group)
            group = []
    if group:
        cues.append(group)
    return [{"start": g[0]["start"], "end": g[-1]["end"],
             "text": "".join(w["word"] for w in g).strip()} for g in cues]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("media", type=Path)
    parser.add_argument("--model-dir", required=True)
    parser.add_argument("--prompt", default="Experrt Academy. British English.",
                        help="Names and terminology present in this recording only.")
    args = parser.parse_args()
    model = WhisperModel(args.model_dir, device="cpu", compute_type="int8", cpu_threads=6)
    segments, info = model.transcribe(
        str(args.media), language="en", beam_size=5, word_timestamps=True,
        vad_filter=True,
        initial_prompt=args.prompt,
    )
    records = []
    for segment in segments:
        item = {"start": segment.start, "end": segment.end, "text": segment.text.strip(),
                "words": [{"start": w.start, "end": w.end, "word": w.word}
                          for w in segment.words or []]}
        records.append(item)
        print(f"{stamp(segment.start)} {item['text']}", flush=True)
    base = args.media.with_suffix("")
    metadata = {"status": "machine draft; complete recording review required",
                "model": args.model_dir, "language": info.language,
                "durationSeconds": info.duration, "segments": records}
    base.with_suffix(".transcript-draft.json").write_text(json.dumps(metadata, indent=2))
    base.with_suffix(".transcript-draft.txt").write_text(
        "AI-generated pilot. Machine transcript draft, not yet checked.\n\n" +
        "\n\n".join(f"[{stamp(r['start'])}] {r['text']}" for r in records) + "\n")
    cues = cues_for([word for record in records for word in record["words"]])
    base.with_suffix(".captions-draft.vtt").write_text("WEBVTT\n\n" + "\n\n".join(
        f"{stamp(c['start'])} --> {stamp(c['end'])}\n" +
        textwrap.fill(c["text"], width=42) for c in cues) + "\n")
    base.with_suffix(".captions-draft.srt").write_text("\n\n".join(
        f"{index}\n{stamp(c['start'], ',')} --> {stamp(c['end'], ',')}\n" +
        textwrap.fill(c["text"], width=42) for index, c in enumerate(cues, 1)) + "\n")


if __name__ == "__main__":
    main()
