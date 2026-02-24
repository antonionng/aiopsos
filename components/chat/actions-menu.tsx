"use client";

import { useState } from "react";
import { Plus, Paperclip, Globe, Image, FlaskConical, Lock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PLAN_FEATURES, type PlanType } from "@/lib/constants";

interface Props {
  plan?: string;
  onAttach: () => void;
  onWebSearch?: (query: string) => void;
  onImageGen?: (prompt: string) => void;
  onDeepResearch?: (query: string) => void;
}

export function ActionsMenu({
  plan = "basic",
  onAttach,
  onWebSearch,
  onImageGen,
  onDeepResearch,
}: Props) {
  const [open, setOpen] = useState(false);
  const features = PLAN_FEATURES[plan as PlanType] ?? PLAN_FEATURES.basic;

  const items = [
    {
      id: "attach",
      label: "Add photos & files",
      icon: Paperclip,
      available: true,
      onClick: () => {
        onAttach();
        setOpen(false);
      },
    },
    {
      id: "search",
      label: "Web search",
      icon: Globe,
      available: features.webSearch,
      requiredPlan: "Pro",
      onClick: () => {
        if (onWebSearch) onWebSearch("");
        setOpen(false);
      },
    },
    {
      id: "image",
      label: "Create image",
      icon: Image,
      available: features.imageGeneration,
      requiredPlan: "Enterprise",
      onClick: () => {
        if (onImageGen) onImageGen("");
        setOpen(false);
      },
    },
    {
      id: "research",
      label: "Deep research",
      icon: FlaskConical,
      available: features.deepResearch,
      requiredPlan: "Enterprise",
      onClick: () => {
        if (onDeepResearch) onDeepResearch("");
        setOpen(false);
      },
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Actions"
        >
          <Plus className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-1.5"
        align="start"
        side="top"
        sideOffset={8}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const locked = !item.available;

          return (
            <button
              key={item.id}
              onClick={locked ? undefined : item.onClick}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                locked
                  ? "cursor-not-allowed text-muted-foreground/50"
                  : "text-foreground hover:bg-accent"
              }`}
              disabled={locked}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {locked && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                  <Lock className="h-3 w-3" />
                  {item.requiredPlan}
                </span>
              )}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
