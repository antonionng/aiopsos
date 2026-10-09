"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

type GameScreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type GameScreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
};

const fallbackMessage =
  "The game fills this window. Your browser controls stay visible.";

function fullscreenElement(doc: GameScreenDocument) {
  return doc.fullscreenElement || doc.webkitFullscreenElement || null;
}

function fullscreenRequest(element: GameScreenElement) {
  const doc = element.ownerDocument as GameScreenDocument;
  if (element.requestFullscreen && doc.fullscreenEnabled !== false)
    return () => element.requestFullscreen();
  if (element.webkitRequestFullscreen && doc.webkitFullscreenEnabled !== false)
    return () => element.webkitRequestFullscreen!();
  return null;
}

async function exitOwnedScreen(element: GameScreenElement) {
  const doc = element.ownerDocument as GameScreenDocument;
  if (fullscreenElement(doc) !== element) return;
  if (doc.fullscreenElement === element && doc.exitFullscreen)
    await doc.exitFullscreen();
  else if (doc.webkitFullscreenElement === element && doc.webkitExitFullscreen)
    await doc.webkitExitFullscreen();
}

/**
 * Expanded game view with native fullscreen when the browser permits it.
 * isFullscreen means the expanded game layout, not the browser's native state.
 * The caller supplies viewport CSS and a visible Exit control calling exit().
 * Escape or native fullscreen teardown reveals browser chrome but keeps the
 * game expanded. Only the in-game Exit control leaves the expanded layout.
 * Call enter from an explicit click so the native request retains user activation.
 */
export function useGameScreen(ref: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const mounted = useRef(false);
  const requested = useRef(false);
  const nativeActive = useRef(false);
  const owned = useRef<GameScreenElement | null>(null);
  const operation = useRef(0);

  useEffect(() => {
    mounted.current = true;
    const doc = (ref.current?.ownerDocument || document) as GameScreenDocument;
    const capabilityTimer = setTimeout(() => {
      if (mounted.current)
        setCanFullscreen(
          Boolean(ref.current && fullscreenRequest(ref.current)),
        );
    }, 0);
    function changed() {
      const current = fullscreenElement(doc);
      if (owned.current && current === owned.current) {
        if (!requested.current) {
          // An earlier request may finish after the learner has pressed Exit.
          void exitOwnedScreen(owned.current).catch(() => {});
          return;
        }
        nativeActive.current = true;
        setIsFullscreen(true);
        setMessage("");
      } else if (nativeActive.current) {
        nativeActive.current = false;
        if (requested.current) {
          // Native Escape and embedded-browser teardown both keep the game usable.
          // Do not automatically request native fullscreen again.
          setIsFullscreen(true);
          setMessage(fallbackMessage);
        }
      }
    }
    doc.addEventListener("fullscreenchange", changed);
    doc.addEventListener("webkitfullscreenchange", changed);
    return () => {
      mounted.current = false;
      requested.current = false;
      clearTimeout(capabilityTimer);
      doc.removeEventListener("fullscreenchange", changed);
      doc.removeEventListener("webkitfullscreenchange", changed);
      const element = owned.current;
      if (element) void exitOwnedScreen(element).catch(() => {});
    };
  }, [ref]);

  const enter = useCallback(async () => {
    const element = ref.current as GameScreenElement | null;
    if (!mounted.current || requested.current) return;
    if (!element) {
      setMessage("The game is still loading. Try again in a moment.");
      return;
    }
    owned.current = element;
    requested.current = true;
    const token = ++operation.current;
    setIsFullscreen(true);
    setMessage("");
    const doc = element.ownerDocument as GameScreenDocument;
    if (fullscreenElement(doc) === element) {
      nativeActive.current = true;
      return;
    }
    const request = fullscreenRequest(element);
    setCanFullscreen(Boolean(request));
    if (!request) {
      setMessage(fallbackMessage);
      return;
    }
    try {
      // No awaited work precedes this call: Safari/Chromium require the click gesture.
      await request();
      if (!mounted.current || !requested.current) {
        await exitOwnedScreen(element).catch(() => {});
        return;
      }
      if (token !== operation.current) return;
      nativeActive.current = fullscreenElement(doc) === element;
      setMessage(nativeActive.current ? "" : fallbackMessage);
    } catch {
      if (mounted.current && requested.current && token === operation.current) {
        nativeActive.current = fullscreenElement(doc) === element;
        setMessage(nativeActive.current ? "" : fallbackMessage);
      }
    }
  }, [ref]);

  const exit = useCallback(async () => {
    requested.current = false;
    operation.current++;
    nativeActive.current = false;
    if (mounted.current) {
      setIsFullscreen(false);
      setMessage("");
    }
    const element = owned.current;
    if (!element) return;
    try {
      await exitOwnedScreen(element);
    } catch {
      if (
        mounted.current &&
        fullscreenElement(element.ownerDocument as GameScreenDocument) ===
          element
      ) {
        nativeActive.current = true;
        requested.current = true;
        setIsFullscreen(true);
        setMessage(
          "Use your browser’s full-screen control to leave this view.",
        );
      }
    }
  }, []);

  return { enter, exit, isFullscreen, canFullscreen, message };
}
