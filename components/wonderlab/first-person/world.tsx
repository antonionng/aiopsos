"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Compass, Footprints, KeyRound, Move, Sparkles, Square } from "lucide-react";
import type { ArcadeDesign, AvatarLook } from "@/lib/wonderlab/first-person";
import type { ArcadeWorldRuntime, WorldState } from "./world-engine";

export type WorldProps = {
  design: ArcadeDesign;
  avatar: AvatarLook;
  mode: "explore" | "play";
  runId: number;
  paused: boolean;
  reducedMotion: boolean;
  guided: boolean;
  onReady: () => void;
  onError: (message: string) => void;
  onInteract: () => void;
  onCollect: (count: number) => void;
  onKeyCollect?: () => void;
  onComplete: () => void;
};

export default function ArcadeWorld(props: WorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<ArcadeWorldRuntime | null>(null);
  const propsRef = useRef(props);
  const joystickPointer = useRef<number | null>(null);
  const [status, setStatus] = useState("Your world is opening.");
  const [destination, setDestination] = useState<"workshop" | "collectible" | "key" | "portal">("workshop");
  const [stick, setStick] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [walking, setWalking] = useState(false);
  const [bonusNotice, setBonusNotice] = useState<{ runId: number; message: string } | null>(null);

  useEffect(() => {
    propsRef.current = props;
    runtimeRef.current?.update(props as WorldState);
    if (props.paused && document.activeElement === canvasRef.current) canvasRef.current?.blur();
  }, [props]);

  useEffect(() => {
    // Opening a menu removes the captured touch control. Do not rely on the browser
    // dispatching lostpointercapture to that removed element before allowing a new touch.
    joystickPointer.current = null;
    if (!props.paused) canvasRef.current?.focus({ preventScroll: true });
    const timer = window.setTimeout(() => setStick({ x: 0, y: 0 }), 0);
    return () => window.clearTimeout(timer);
  }, [props.paused, props.mode, props.runId]);

  useEffect(() => {
    if (!bonusNotice) return;
    const timer = window.setTimeout(() => setBonusNotice(null), 8000);
    return () => window.clearTimeout(timer);
  }, [bonusNotice]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    void import("./world-engine").then(({ createArcadeWorld }) => {
      if (cancelled) return;
      try {
        runtimeRef.current = createArcadeWorld(canvas, propsRef.current, {
          onReady: () => { setReady(true); propsRef.current.onReady(); },
          onError: (message) => propsRef.current.onError(message),
          onInteract: () => propsRef.current.onInteract(),
          onCollect: (count) => propsRef.current.onCollect(count),
          onKeyCollect: () => propsRef.current.onKeyCollect?.(),
          onComplete: () => propsRef.current.onComplete(),
          onStatus: (message) => {
            if (message.startsWith("You found the hidden golden spark.") || message.startsWith("You found the golden key.")) {
              setBonusNotice({ runId: propsRef.current.runId, message });
            } else setStatus(message);
          },
          onDestination: setDestination,
          onWalking: setWalking,
        });
      } catch {
        propsRef.current.onError("Your browser could not open this 3D world. Try a recent browser with 3D graphics enabled.");
      }
    }).catch(() => {
      if (!cancelled) propsRef.current.onError("The game could not finish loading. Check your connection and reload to try again.");
    });
    return () => {
      cancelled = true;
      runtimeRef.current?.dispose();
      runtimeRef.current = null;
    };
  }, []);

  function moveStick(event: ReactPointerEvent<HTMLDivElement>) {
    if (joystickPointer.current !== event.pointerId || props.paused) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - rect.left - rect.width / 2) / (rect.width * 0.32);
    const dy = (event.clientY - rect.top - rect.height / 2) / (rect.height * 0.32);
    const magnitude = Math.max(1, Math.hypot(dx, dy));
    const x = dx / magnitude;
    const y = dy / magnitude;
    setStick({ x, y });
    runtimeRef.current?.setJoystick(x, y);
  }
  function releaseStick() {
    joystickPointer.current = null;
    setStick({ x: 0, y: 0 });
    runtimeRef.current?.setJoystick(0, 0);
  }
  const guidedLabel = destination === "workshop" ? "Walk to the workshop" : destination === "portal" ? "Walk to the open portal" : destination === "key" ? "Find the golden key" : `Find the next ${props.design.collectible}`;

  return (
    <div className="fp-world" data-ready={ready}>
      <canvas
        ref={canvasRef}
        className="fp-canvas"
        tabIndex={props.paused ? -1 : 0}
        aria-hidden={props.paused || undefined}
        aria-label="Explore your first-person arcade world. Use W, A, S and D or the arrow keys to move. Drag to look around. You can also use the walking button."
        style={{ width: "100%", height: "100%", display: "block", touchAction: "none", outlineOffset: -4 }}
      />
      <div className="fp-world-crosshair" aria-hidden="true" />
      {!props.paused && ready && (
        <>
          <div className="fp-world-navigation">
            <div
              className="fp-joystick"
              role="group"
              aria-label="Touch movement control. Drag from the centre to walk."
              onPointerDown={(event) => {
                if (joystickPointer.current !== null) return;
                joystickPointer.current = event.pointerId;
                event.currentTarget.setPointerCapture(event.pointerId);
                moveStick(event);
              }}
              onPointerMove={moveStick}
              onPointerUp={releaseStick}
              onPointerCancel={releaseStick}
              onLostPointerCapture={releaseStick}
              style={{ touchAction: "none" }}
            >
              <Move size={22} aria-hidden="true" className="fp-joystick-directions" />
              <span className="fp-joystick-thumb" style={{ transform: `translate(${stick.x * 29}px, ${stick.y * 29}px)` }} aria-hidden="true"><Footprints size={22} /></span>
              <span className="fp-joystick-label">Walk</span>
            </div>
            <div className="fp-world-shortcut">
              <button type="button" className="fp-move" aria-pressed={walking} onClick={() => { runtimeRef.current?.toggleGuidedWalk(); canvasRef.current?.focus({ preventScroll: true }); }}>
                {walking ? <Square size={18} aria-hidden="true" /> : destination === "portal" ? <Sparkles size={18} aria-hidden="true" /> : destination === "key" ? <KeyRound size={18} aria-hidden="true" /> : <Compass size={18} aria-hidden="true" />}
                {walking ? "Stop walking" : guidedLabel}
              </button>
              <span className="fp-look-hint">{walking ? "Pip will keep walking. Drag the view to take over." : "Drag the world to look around."}</span>
            </div>
          </div>
          <p className="fp-world-status" role="status" aria-live="polite">{status}</p>
          {props.mode === "play" && bonusNotice?.runId === props.runId && (
            <div className="fp-world-toast" role="status" aria-live="polite">
              <Sparkles size={22} aria-hidden="true" />
              <p>{bonusNotice.message}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
