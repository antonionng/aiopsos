"use client";

import { useEffect, useState, use } from "react";
import { Bot, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
interface SharedMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  model: string | null;
  created_at: string;
}

interface SharedConversation {
  id: string;
  title: string;
  model: string;
  created_at: string;
}

export default function SharedConversationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [conversation, setConversation] = useState<SharedConversation | null>(null);
  const [messages, setMessages] = useState<SharedMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/shared/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => {
        setConversation(d.conversation);
        setMessages(d.messages ?? []);
      })
      .catch(() => setError("This shared conversation was not found or has been removed."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SharedNav />
        <div className="flex items-center justify-center py-32">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-background">
        <SharedNav />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <MessageSquare className="mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="mb-2 text-lg font-semibold">Not Found</h2>
          <p className="text-sm text-muted-foreground">
            {error ?? "This conversation is no longer shared."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedNav />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold">{conversation.title}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Shared conversation &middot; {conversation.model}
          </p>
        </div>

        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-2xl rounded-br-md bg-brand/10 px-4 py-2.5 text-sm leading-relaxed text-foreground">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {msg.model && (
                      <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
                        {msg.model}
                      </p>
                    )}
                    <div className="prose-chat text-sm leading-relaxed text-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            This is a read-only view of a shared conversation.
          </p>
        </div>
      </main>
    </div>
  );
}

function SharedNav() {
  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-bold tracking-tight">
          AIOPSOS
        </Link>
      </div>
    </nav>
  );
}
