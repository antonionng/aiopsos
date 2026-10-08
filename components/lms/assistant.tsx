"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sparkles, ArrowUp, Square, Inbox } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { AssistantMessage } from "./assistant-message";
const AssistantContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  manager: boolean;
}>({ open: false, setOpen: () => {}, manager: false });
export function AssistantButton() {
  const { open, setOpen } = useContext(AssistantContext);
  return (
    <button
      className="flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
    >
      <Sparkles size={16} />
      Ask Experrt
    </button>
  );
}
export function ActivityButton() {
  const { manager } = useContext(AssistantContext);
  return manager ? (
    <Link
      href="/dashboard/agents"
      aria-label="Activity and approvals"
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <Inbox size={17} />
      <span className="hidden sm:inline">Activity</span>
    </Link>
  ) : null;
}
const transport = new DefaultChatTransport({ api: "/api/chat" });
export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [manager, setManager] = useState(false);
  const [input, setInput] = useState("");
  const [notice, setNotice] = useState("");
  const [starting, setStarting] = useState(false);
  const conversation = useRef<string | null>(null);
  const lock = useRef(false);
  const pathname = usePathname();
  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    setMessages,
    clearError,
  } = useChat({
    transport,
    experimental_throttle: 75,
  });
  let errorText = "The companion could not finish. Please try again.";
  if (error?.message) {
    try {
      const detail = JSON.parse(error.message);
      if (typeof detail.message === "string") errorText = detail.message;
      else if (typeof detail.error === "string" && !detail.error.includes("_"))
        errorText = detail.error;
    } catch {
      /* Keep internal provider errors out of the interface. */
    }
  }
  const busy = starting || status === "submitted" || status === "streaming";
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((r) =>
        setManager(
          ["admin", "manager", "super_admin"].includes(r.profile?.role),
        ),
      )
      .catch(() => {});
  }, []);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "auto", block: "nearest" });
  }, [messages, status]);
  const area = pathname.includes("/cohorts")
    ? "live"
    : pathname.includes("/studio")
      ? "course"
      : pathname.includes("/programmes")
        ? "programme"
        : pathname.includes("/records")
          ? "records"
          : pathname.includes("/clients")
            ? "people"
            : pathname.includes("/learn/")
              ? "lesson"
              : "learning";
  const contextLabel = {
    live: "Live training delivery",
    course: "Course creation",
    programme: "Programme planning",
    records: "Learning records",
    people: "People & clients",
    lesson: "Your current lesson",
    learning: "Your learning workspace",
  }[area];
  const suggestions =
    area === "live"
      ? [
          "What do I need to prepare for this live group?",
          "How do attendance, assessed work and certificates connect?",
        ]
      : area === "course"
        ? [
            "Help me define clear learning outcomes",
            "Suggest a practical challenge",
          ]
        : area === "programme"
          ? [
              "How do I assign a programme?",
              "Help me plan learning for a client",
            ]
          : area === "records"
            ? [
                "What needs my review?",
                "Explain the evidence behind completion",
              ]
            : area === "lesson"
              ? ["Help me understand this lesson", "Give me a practice example"]
              : ["What should I focus on next?", "Help me find my way around"];
  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (lock.current || busy || !input.trim()) return;
    lock.current = true;
    setStarting(true);
    setNotice("");
    clearError();
    const text = input.trim();
    try {
      if (!conversation.current) {
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companion: manager ? "ld" : "learning",
            model: "gpt-4o-mini",
          }),
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "Could not open your conversation.");
        conversation.current = result.conversation.id;
      }
      setInput("");
      await sendMessage(
        { text },
        {
          body: {
            conversation_id: conversation.current,
            companion: manager ? "ld" : "learning",
            learning_page: pathname,
          },
        },
      );
    } catch (e) {
      setNotice(
        e instanceof Error ? e.message : "Could not reach your companion.",
      );
      setInput(text);
    } finally {
      lock.current = false;
      setStarting(false);
    }
  }
  return (
    <AssistantContext.Provider value={{ open, setOpen, manager }}>
      <div
        className={
          open ? "transition-[padding] xl:pr-[420px]" : "transition-[padding]"
        }
      >
        {children}
      </div>
      <Sheet open={open} onOpenChange={setOpen} modal={false}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 p-0 sm:max-w-[420px]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <header className="border-b px-6 py-5">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles size={19} className="text-brand" />
              Experrt, beside you.
            </SheetTitle>
            <SheetDescription className="mt-2">
              {contextLabel}. Give me a goal. I’ll check the records and prepare
              the next step.
            </SheetDescription>
          </header>
          <div className="flex-1 overflow-y-auto px-5 py-5" aria-live="polite">
            {!messages.length && (
              <>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  {manager
                    ? "Ask me to inspect your records or prepare a course, programme or delivery review. Proposals stay in Activity for your review."
                    : "Ask me to explain your lesson, find your next learning step or check your progress."}
                </p>
                <div className="grid gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      className="rounded-xl border p-3 text-left text-sm hover:bg-muted"
                      onClick={() => setInput(s)}
                    >
                      {s} ↗
                    </button>
                  ))}
                </div>
              </>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`mb-4 rounded-2xl p-4 text-sm leading-relaxed ${m.role === "user" ? "ml-5 bg-brand/10" : "bg-muted/50"}`}
              >
                <span className="mb-2 block text-xs font-semibold text-muted-foreground">
                  {m.role === "user" ? "You" : "Experrt"}
                </span>
                {m.parts.map((p, i) =>
                  p.type === "text" ? (
                    m.role === "user" ? (
                      <div key={i} className="whitespace-pre-wrap break-words">
                        {p.text}
                      </div>
                    ) : (
                      <AssistantMessage key={i} text={p.text} />
                    )
                  ) : p.type.startsWith("tool-") ? (
                    <AssistantTaskStep
                      key={i}
                      part={p}
                      onOpen={() => setOpen(false)}
                    />
                  ) : null,
                )}
              </div>
            ))}
            {(notice || error) && (
              <p
                role="status"
                className="my-4 rounded-xl border p-3 text-sm leading-relaxed"
              >
                {notice || errorText}
              </p>
            )}
            {status === "submitted" && (
              <p className="text-sm text-muted-foreground">
                Checking your request…
              </p>
            )}
            <div ref={end} />
          </div>
          <form onSubmit={ask} className="border-t bg-background p-4">
            <label htmlFor="companion-message" className="sr-only">
              Message Experrt
            </label>
            <textarea
              id="companion-message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={4000}
              placeholder="What would you like help with?"
              className="min-h-[95px] w-full resize-none rounded-xl border bg-background p-3 text-sm focus:outline-brand"
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              {manager ? (
                <Link
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                  href="/dashboard/agents"
                  onClick={() => setOpen(false)}
                >
                  <Inbox size={14} />
                  Activity & approvals
                </Link>
              ) : (
                <button
                  type="button"
                  className="text-xs text-muted-foreground"
                  onClick={() => {
                    stop();
                    setMessages([]);
                    conversation.current = null;
                  }}
                >
                  New conversation
                </button>
              )}
              {busy ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Stop response"
                  className="rounded-full bg-foreground p-3 text-background"
                >
                  <Square size={15} />
                </button>
              ) : (
                <button
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="rounded-full bg-foreground p-3 text-background disabled:opacity-40"
                >
                  <ArrowUp size={17} />
                </button>
              )}
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </AssistantContext.Provider>
  );
}

function AssistantTaskStep({
  part,
  onOpen,
}: {
  part: unknown;
  onOpen: () => void;
}) {
  const p = part as {
    type: string;
    state?: string;
    output?: { error?: string; href?: string; state?: string };
  };
  const task = p.type === "tool-prepareLearningTask";
  const done = p.state === "output-available";
  const failed = p.state === "output-error" || Boolean(p.output?.error);
  return (
    <div
      role="status"
      className="my-3 rounded-xl border bg-background p-3 text-xs leading-relaxed"
    >
      <p className="font-semibold">
        {failed
          ? "Action needs attention"
          : task
            ? done
              ? p.output?.state === "needs_review"
                ? "Proposal ready for review"
                : "Task saved in Activity"
              : "Preparing your proposal…"
            : done
              ? "Records checked"
              : "Checking authorised records…"}
      </p>
      {failed && (
        <p className="mt-1">
          {p.output?.error || "This action could not finish. Please try again."}
        </p>
      )}
      {task && !done && !failed && (
        <p className="mt-1 text-muted-foreground">
          Reading records, preparing the work and saving it to Activity.
        </p>
      )}
      {p.output?.href === "/dashboard/agents" && (
        <Link
          href="/dashboard/agents"
          onClick={onOpen}
          className="mt-2 block font-semibold text-brand underline"
        >
          {failed
            ? "Check task in Activity"
            : p.output?.state === "needs_review"
              ? "Review proposal in Activity"
              : "Follow task in Activity"}{" "}
          →
        </Link>
      )}
    </div>
  );
}
