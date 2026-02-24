"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  UserCog,
  Plus,
  Trash2,
  Bot,
  Code,
  Megaphone,
  Scale,
  Briefcase,
  HeadphonesIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENT_TYPES, DEPARTMENT_LABELS } from "@/lib/constants";

interface Persona {
  id: string;
  name: string;
  description: string;
  system_prompt: string;
  department_type: string | null;
  icon: string;
  created_at: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  bot: Bot,
  code: Code,
  megaphone: Megaphone,
  scale: Scale,
  briefcase: Briefcase,
  headphones: HeadphonesIcon,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

const DEFAULT_PERSONAS = [
  {
    name: "Marketing Writer",
    description: "Creates compelling marketing copy, social posts, and email campaigns.",
    system_prompt: "You are a senior marketing writer. Create compelling, brand-aligned content. Use persuasive language, clear CTAs, and adapt tone to the target audience. Format output with headers and bullet points.",
    department_type: "marketing",
    icon: "megaphone",
  },
  {
    name: "Code Reviewer",
    description: "Reviews code for bugs, performance, and best practices.",
    system_prompt: "You are a senior software engineer conducting code reviews. Focus on: correctness, performance, security vulnerabilities, adherence to best practices, and readability. Provide specific, actionable feedback with code examples.",
    department_type: "engineering",
    icon: "code",
  },
  {
    name: "Legal Advisor",
    description: "Assists with contract review, compliance checks, and policy drafting.",
    system_prompt: "You are a legal assistant specialising in corporate law and compliance. Help review contracts, flag risks, and draft policy language. Always note that your output is not legal advice and should be reviewed by qualified counsel.",
    department_type: "legal",
    icon: "scale",
  },
  {
    name: "Sales Assistant",
    description: "Helps draft proposals, follow-up emails, and competitive analyses.",
    system_prompt: "You are a sales enablement assistant. Help craft persuasive proposals, follow-up emails, and competitive battle cards. Focus on value propositions, objection handling, and clear next steps.",
    department_type: "sales",
    icon: "briefcase",
  },
];

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    system_prompt: "",
    department_type: "",
    icon: "bot",
  });

  const loadPersonas = useCallback(() => {
    fetch("/api/personas")
      .then((r) => r.json())
      .then((d) => setPersonas(d.personas ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => { loadPersonas(); }, [loadPersonas]);

  async function handleCreate() {
    if (!form.name || !form.system_prompt) return;
    setCreating(true);
    try {
      await fetch("/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ name: "", description: "", system_prompt: "", department_type: "", icon: "bot" });
      loadPersonas();
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch("/api/personas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadPersonas();
  }

  async function handleQuickCreate(preset: typeof DEFAULT_PERSONAS[number]) {
    setCreating(true);
    try {
      await fetch("/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preset),
      });
      loadPersonas();
    } finally {
      setCreating(false);
    }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">AI Personas</h1>
        <p className="text-sm text-muted-foreground">
          Create department-specific AI assistants with custom system prompts.
          Users select a persona in chat to get tailored responses.
        </p>
      </motion.div>

      {/* Quick-create presets */}
      {personas.length === 0 && (
        <motion.div variants={item} className="mt-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Quick Start Templates
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {DEFAULT_PERSONAS.map((preset) => {
              const Icon = ICON_MAP[preset.icon] ?? Bot;
              return (
                <Card key={preset.name} className="border-border bg-card">
                  <CardContent className="flex items-start gap-3 py-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{preset.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{preset.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-xs"
                      onClick={() => handleQuickCreate(preset)}
                      disabled={creating}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Create form */}
      <motion.div variants={item} className="mt-8">
        <Card className="border-border bg-card">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm font-semibold">Create New Persona</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                placeholder="Persona name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Select
                value={form.department_type}
                onValueChange={(v) => setForm({ ...form, department_type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Department (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_TYPES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {DEPARTMENT_LABELS[d]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Short description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Textarea
              placeholder="System prompt -- define how this persona behaves, what it focuses on, and its tone..."
              value={form.system_prompt}
              onChange={(e) => setForm({ ...form, system_prompt: e.target.value })}
              rows={4}
            />
            <div className="flex items-center gap-3">
              <Select
                value={form.icon}
                onValueChange={(v) => setForm({ ...form, icon: v })}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ICON_MAP).map((k) => (
                    <SelectItem key={k} value={k}>{k}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1" />
              <Button onClick={handleCreate} disabled={creating || !form.name || !form.system_prompt}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Create Persona
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Persona list */}
      {personas.length > 0 && (
        <motion.div variants={item} className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">
            Active Personas ({personas.length})
          </h2>
          <div className="space-y-2">
            {personas.map((p) => {
              const Icon = ICON_MAP[p.icon] ?? Bot;
              return (
                <Card key={p.id} className="border-border bg-card">
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{p.name}</p>
                        {p.department_type && (
                          <Badge variant="secondary" className="text-[10px]">
                            {DEPARTMENT_LABELS[p.department_type as keyof typeof DEPARTMENT_LABELS] ?? p.department_type}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {p.description || p.system_prompt.slice(0, 80) + "..."}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
