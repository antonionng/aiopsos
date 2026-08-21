import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The Experrt wordmark.
 *
 * The asset is pure white on transparent, which is right for the dark theme
 * and invisible on a light one. `invert dark:invert-0` fixes that without a
 * second file: inverting white gives black, so the light theme gets a black
 * wordmark and the dark theme keeps the original.
 *
 * Sizes are named rather than pixel props so call sites do not have to know
 * the asset's 402x110 aspect ratio.
 */

const SIZES = {
  sm: { className: "h-5", width: 73, height: 20 },
  md: { className: "h-7", width: 102, height: 28 },
  lg: { className: "h-10", width: 146, height: 40 },
  xl: { className: "h-16 sm:h-20", width: 292, height: 80 },
} as const;

export function Wordmark({
  className,
  size = "md",
  priority = false,
}: {
  className?: string;
  size?: keyof typeof SIZES;
  priority?: boolean;
}) {
  const { className: sizeClass, width, height } = SIZES[size];

  return (
    <Image
      src="/experrt-logo.png"
      alt="Experrt"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={cn("w-auto invert dark:invert-0", sizeClass, className)}
    />
  );
}
