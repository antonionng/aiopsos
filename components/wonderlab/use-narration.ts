"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Band } from "@/lib/wonderlab/types";
import { narrationId } from "@/lib/wonderlab/narration";
import clips from "@/lib/wonderlab/narration-manifest.json";

export function useNarration(band: Band) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const request = useRef(0);
  const [message, setMessage] = useState("");
  const stop = useCallback(() => {
    request.current++;
    setMessage("");
    if (audio.current) {
      audio.current.pause();
      audio.current.removeAttribute("src");
      audio.current.load();
      audio.current = null;
    }
  }, []);
  useEffect(() => stop, [stop]);
  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      stop();
      const id = request.current;
      const ended = () => {
        if (request.current === id) onEnd?.();
      };
      const unavailable = () => {
        if (request.current !== id) return;
        setMessage(
          "The voice could not play. You can try again or read the words on screen.",
        );
      };
      const src = (clips as Record<string, string>)[narrationId(band, text)];
      if (!src) {
        unavailable();
        return;
      }
      const recording = new Audio(src);
      audio.current = recording;
      let failed = false;
      const fail = () => {
        if (request.current !== id || failed) return;
        failed = true;
        recording.pause();
        unavailable();
      };
      recording.onerror = fail;
      recording.onended = ended;
      setMessage("Loading the voice…");
      void recording
        .play()
        .then(() => {
          if (request.current === id && !failed) setMessage("");
        })
        .catch(fail);
    },
    [band, stop],
  );
  return { speak, stop, message };
}
