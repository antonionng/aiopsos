"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import localFont from "next/font/local";
import { Wordmark } from "@/components/wordmark";
import { COMPANY } from "@/lib/legal";
import "./certificate-art.css";

const script = localFont({
  src: "../../public/fonts/mrs-saint-delafield.ttf",
  variable: "--font-signature",
  display: "block",
});

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const CONFETTI = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 13) % 10) / 10,
  drift: ((i * 29) % 60) - 30,
  spin: ((i * 71) % 540) + 180,
  hue: i % 3,
  wide: i % 4 === 0,
}));

/**
 * A handwritten signature that draws itself.
 * The outline is traced by a stroke dash, a mask sweeps left to right so the
 * ink appears where the pen has been, and a nib rides the leading edge. The
 * box is measured after the script font loads, so long and short names both
 * fill the line without distortion.
 */
function MotionSignature({
  text,
  delay,
  duration,
  run,
}: {
  text: string;
  delay: number;
  duration: number;
  run: number;
}) {
  const maskId = useId().replace(/:/g, "");
  const textRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState({ x: 0, y: 0, width: 600, height: 140 });

  useIsoLayoutEffect(() => {
    let cancelled = false;
    const measure = () => {
      const node = textRef.current;
      if (!node || cancelled) return;
      const b = node.getBBox();
      if (b.width > 0) setBox({ x: b.x, y: b.y, width: b.width, height: b.height });
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [text]);

  const pad = 16;
  const style = {
    "--sig-delay": `${delay}s`,
    "--sig-duration": `${duration}s`,
    "--sig-width": `${box.width}px`,
  } as React.CSSProperties;

  return (
    <svg
      key={run}
      className="xc-sig"
      viewBox={`${box.x - pad} ${box.y - pad} ${box.width + pad * 2} ${box.height + pad * 2}`}
      style={style}
      role="img"
      aria-label={`Signature: ${text}`}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect
            className="xc-sig-wipe"
            x={box.x - pad}
            y={box.y - pad * 4}
            width={box.width + pad * 2}
            height={box.height + pad * 8}
            fill="white"
          />
        </mask>
      </defs>
      <text
        ref={textRef}
        className="xc-sig-text"
        x="0"
        y="100"
        mask={`url(#${maskId})`}
      >
        {text}
      </text>
      <g className="xc-sig-nib" transform={`translate(${box.x} ${box.y + box.height * 0.62})`}>
        <g className="xc-sig-nib-track">
          <circle r="5" />
          <circle className="xc-sig-nib-glow" r="14" />
        </g>
      </g>
    </svg>
  );
}

function Seal() {
  const pathId = useId().replace(/:/g, "");
  const ring = "EXPERRT · SIGNED RECORD · VERIFIABLE ONLINE · ";
  return (
    <div className="xc-seal" aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          <path id={pathId} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="96" className="xc-seal-edge" />
        <circle cx="100" cy="100" r="62" className="xc-seal-core" />
        <g className="xc-seal-ring">
          <text>
            <textPath href={`#${pathId}`} startOffset="0">
              {ring}
              {ring}
            </textPath>
          </text>
        </g>
        <path className="xc-seal-tick" d="M74 102 l18 18 l36 -40" />
      </svg>
    </div>
  );
}

export function CertificateArt({
  title,
  name,
  signedAt,
  reference,
  recordLine,
  celebrate = false,
}: {
  title: string;
  name: string;
  signedAt: string | null;
  reference: string;
  recordLine?: string | null;
  celebrate?: boolean;
}) {
  const [run, setRun] = useState(0);
  const date = signedAt
    ? new Date(signedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <section className={`xc ${script.variable}`}>
      <div className="xc-card" key={run}>
        <div className="xc-guilloche" aria-hidden="true" />
        <div className="xc-sheen" aria-hidden="true" />
        <div className="xc-inner">
          <header className="xc-head">
            <Wordmark size="md" />
            <Seal />
          </header>
          <p className="xc-eyebrow">Certificate of completion</p>
          <p className="xc-certifies">This certifies that</p>
          <h1 className="xc-name">{name}</h1>
          <p className="xc-certifies">has completed the self-paced course</p>
          <h2 className="xc-title">{title}</h2>
          {recordLine ? <p className="xc-line">{recordLine}</p> : null}

          <div className="xc-signs">
            <div className="xc-sign">
              <MotionSignature text={name} delay={0.9} duration={2.6} run={run} />
              <span className="xc-rule" />
              <p>
                <strong>{name}</strong>
                <span>Learner{date ? ` · signed ${date}` : ""}</span>
              </p>
            </div>
            <div className="xc-sign">
              <MotionSignature text={COMPANY.manager} delay={3.3} duration={2} run={run} />
              <span className="xc-rule" />
              <p>
                <strong>{COMPANY.manager}</strong>
                <span>General Manager, {COMPANY.tradingName}</span>
              </p>
            </div>
          </div>

          <footer className="xc-foot">
            <span>Reference {reference}</span>
            <span>Verify at experrt.com/verify/{reference}</span>
          </footer>
        </div>
      </div>
      {celebrate ? (
        <div className="xc-confetti" aria-hidden="true" key={`c${run}`}>
          {CONFETTI.map((piece, i) => (
            <i
              key={i}
              className={`xc-bit xc-bit-${piece.hue}${piece.wide ? " is-wide" : ""}`}
              style={
                {
                  left: `${piece.left}%`,
                  animationDelay: `${5.4 + piece.delay}s`,
                  "--drift": `${piece.drift}vw`,
                  "--spin": `${piece.spin}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ) : null}
      <button type="button" className="xc-replay" onClick={() => setRun((n) => n + 1)}>
        Replay the signing
      </button>
    </section>
  );
}
