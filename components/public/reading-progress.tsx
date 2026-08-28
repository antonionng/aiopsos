"use client";

import { useEffect, useState } from "react";

/**
 * A hairline progress bar pinned under the header.
 *
 * These briefings run to eight or nine screens on a laptop and there was
 * previously nothing telling a reader how much was left, which is the moment
 * people bail on a long page. Passive, one pixel, no layout shift.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      // A page shorter than the viewport has nothing to progress through.
      setProgress(scrollable <= 0 ? 0 : (window.scrollY / scrollable) * 100);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-14 z-50 h-px bg-transparent"
    >
      <div
        className="h-px bg-brand transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
