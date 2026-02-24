"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

type RecordingState = "idle" | "recording" | "processing";

export function VoiceButton({ onTranscript, disabled }: Props) {
  const [state, setState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current?.stream
      ?.getTracks()
      .forEach((t) => t.stop());
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        stream.getTracks().forEach((t) => t.stop());

        if (chunksRef.current.length === 0) {
          setState("idle");
          return;
        }

        setState("processing");
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;

        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");
        formData.append("duration", String(elapsedSeconds));

        try {
          const res = await fetch("/api/voice/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const err = await res.json();
            console.error("Transcription error:", err.error);
            setState("idle");
            return;
          }

          const data = await res.json();
          if (data.text) {
            onTranscript(data.text);
          }
        } catch (err) {
          console.error("Transcription fetch failed:", err);
        }
        setState("idle");
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      startTimeRef.current = Date.now();
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      setState("recording");
    } catch (err) {
      console.error("Mic permission denied:", err);
      setState("idle");
    }
  }, [onTranscript]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  useEffect(() => {
    if (disabled && state === "recording") {
      stopRecording();
    }
  }, [disabled, state, stopRecording]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (state === "processing") {
    return (
      <button
        disabled
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </button>
    );
  }

  if (state === "recording") {
    return (
      <div className="flex items-center gap-2">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-1.5"
          >
            <div className="flex items-center gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full bg-red-500"
                  animate={{ height: [4, 12, 4] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
            <span className="text-xs tabular-nums text-red-500 font-medium">
              {formatDuration(duration)}
            </span>
          </motion.div>
        </AnimatePresence>
        <button
          onClick={stopRecording}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white transition-all hover:bg-red-600"
          title="Stop recording"
        >
          <Square className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={startRecording}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
      title="Voice input"
    >
      <Mic className="h-4 w-4" />
    </button>
  );
}
