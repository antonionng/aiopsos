# Local transcript and caption preparation

The pilot uses a temporary Python virtual environment at `/private/tmp/experrt-media-pilot-venv`, separate from application dependencies. Its installed versions are recorded in `requirements-transcription.txt`.

Free tools downloaded from PyPI: faster-whisper, imageio-ffmpeg and Pillow, plus their dependencies. The public `Systran/faster-whisper-small.en` speech-recognition model was downloaded from Hugging Face into `/private/tmp/experrt-media-pilot-whisper-small-en`. A smaller public `Systran/faster-whisper-base.en` model was also downloaded into `/private/tmp/experrt-media-pilot-whisper-base-en` for quicker review drafts. Model inference runs locally on the CPU. Recordings are not uploaded to a speech-recognition API. PyAV was pinned to 16.1.0 after version 19 removed a decode option used by faster-whisper 1.2.1.

To create draft transcripts and captions from a downloaded recording:

```sh
/private/tmp/experrt-media-pilot-venv/bin/python docs/media-pilot/transcribe-media.py output/media-pilot/RECORDING.mp4 --model-dir /private/tmp/experrt-media-pilot-whisper-small-en
```

The script produces a timestamped transcript, segment and word metadata, WebVTT and SRT caption drafts. These remain labelled drafts until compared with the actual recording. Speech recognition can mishear names, dates and numbers. Factual review against the teaching source is an additional check and cannot replace listening to the recording.

The temporary environment and model are not shipped with the site. No application package or database changes are needed. The media-processing FFmpeg binary is supplied by imageio-ffmpeg; the downloaded provider recordings retain their original watermarks.
