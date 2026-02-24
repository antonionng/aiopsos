"use client";

import { cn } from "@/lib/utils";

const PALETTE = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-indigo-600",
  "bg-teal-600",
];

function colorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

interface OrgAvatarProps {
  logoUrl?: string | null;
  orgName?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
} as const;

export function OrgAvatar({ logoUrl, orgName, size = "md", className }: OrgAvatarProps) {
  const sizeClass = SIZES[size];

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={orgName ?? "Organisation"}
        className={cn("rounded-full object-cover", sizeClass, className)}
      />
    );
  }

  const initial = (orgName ?? "?").charAt(0).toUpperCase();
  const bg = orgName ? colorForName(orgName) : "bg-muted";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-white",
        sizeClass,
        bg,
        className,
      )}
    >
      {initial}
    </div>
  );
}
