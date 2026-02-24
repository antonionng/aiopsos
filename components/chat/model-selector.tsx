"use client";

import { Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAvailableModels } from "@/lib/model-router";
import { PLAN_MODELS, type PlanType } from "@/lib/constants";

interface Props {
  value: string;
  onChange: (value: string) => void;
  plan?: PlanType;
}

const providerLabels: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  mistral: "Mistral",
};

export function ModelSelector({ value, onChange, plan = "pro" }: Props) {
  const models = getAvailableModels();
  const allowedModels = PLAN_MODELS[plan] as readonly string[];

  const grouped = models.reduce(
    (acc, m) => {
      const key = m.provider;
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    },
    {} as Record<string, typeof models>
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 w-auto gap-1.5 rounded-full border-border bg-surface px-3 text-xs font-medium">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(grouped).map(([provider, models]) => (
          <div key={provider}>
            <div className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {providerLabels[provider] ?? provider}
            </div>
            {models.map((m) => {
              const locked = !allowedModels.includes(m.id);
              return (
                <SelectItem
                  key={m.id}
                  value={m.id}
                  disabled={locked}
                  className="text-sm"
                >
                  <span className="flex items-center gap-2">
                    {m.label}
                    {locked && <Lock className="h-3 w-3 text-muted-foreground/50" />}
                  </span>
                </SelectItem>
              );
            })}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}
