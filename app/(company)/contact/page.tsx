"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const canSubmit = name.trim() && isValidEmail(email) && message.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message");
      }

      setSent(true);
      toast.success("Message sent! We'll be in touch soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* Hero */}
      <motion.div variants={fadeUp} custom={0} className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Contact us
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Have a question about AIOPSOS, want to discuss enterprise adoption, or
          just want to say hello? We'd love to hear from you.
        </p>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-5">
        {/* Form */}
        <motion.div variants={fadeUp} custom={1} className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={sending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={sending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="How can we help?"
                className="min-h-[160px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={!canSubmit || sending}
              className="h-11 w-full rounded-full sm:w-auto sm:px-8"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send message
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Contact info */}
        <motion.div variants={fadeUp} custom={2} className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Get in touch</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href="mailto:ag@experrt.com"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ag@experrt.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                We typically respond within 24 hours on business days. For
                enterprise enquiries, let us know your organisation size and
                use case and we'll schedule a call.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
