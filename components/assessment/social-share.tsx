"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  MessageSquare,
  Linkedin,
  Mail,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareProps {
  url: string;
  assessmentTitle: string;
  orgName: string;
}

interface ChannelConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  getDefaultMessage: (url: string, title: string, org: string) => string;
  getShareUrl?: (message: string) => string;
}

const CHANNELS: ChannelConfig[] = [
  {
    id: "slack",
    label: "Slack",
    icon: <MessageSquare className="h-4 w-4" />,
    getDefaultMessage: (url, title, org) =>
      `Hey team — ${org} is running the ${title}. It takes about 5 minutes and helps shape our AI strategy. Take it here: ${url}`,
  },
  {
    id: "teams",
    label: "Microsoft Teams",
    icon: <MessageSquare className="h-4 w-4" />,
    getDefaultMessage: (url, title, org) =>
      `Hi everyone — ${org} is measuring our AI readiness with the ${title}. Please take 5 minutes to complete it: ${url}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: <Smartphone className="h-4 w-4" />,
    getDefaultMessage: (url, title, org) =>
      `${org} — ${title}: Quick 5-min assessment to measure our AI readiness. ${url}`,
    getShareUrl: (msg) =>
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    getDefaultMessage: (url, _title, org) =>
      `We're measuring AI readiness at ${org}. Curious where your organisation stands? Try the assessment:`,
    getShareUrl: (msg) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(msg.match(/https?:\/\/\S+/)?.[0] ?? "")}`,
  },
  {
    id: "email",
    label: "Email Client",
    icon: <Mail className="h-4 w-4" />,
    getDefaultMessage: (url, title, org) =>
      `${org} is running the ${title}. It takes about 5 minutes. Take it here: ${url}`,
    getShareUrl: (msg) =>
      `mailto:?subject=${encodeURIComponent("AI Readiness Assessment")}&body=${encodeURIComponent(msg)}`,
  },
];

export function SocialShare({
  url,
  assessmentTitle,
  orgName,
}: SocialShareProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});

  function getMessage(channel: ChannelConfig) {
    return (
      messages[channel.id] ??
      channel.getDefaultMessage(url, assessmentTitle, orgName)
    );
  }

  function setMessage(channelId: string, msg: string) {
    setMessages((prev) => ({ ...prev, [channelId]: msg }));
  }

  function copyMessage(channel: ChannelConfig) {
    navigator.clipboard.writeText(getMessage(channel));
    setCopiedId(channel.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Pre-crafted messages for each platform. Edit to customize, then copy or
        share directly.
      </p>
      {CHANNELS.map((channel) => {
        const msg = getMessage(channel);
        const isCopied = copiedId === channel.id;
        return (
          <div
            key={channel.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              {channel.icon}
              <span className="text-sm font-semibold">{channel.label}</span>
            </div>
            <textarea
              value={msg}
              onChange={(e) => setMessage(channel.id, e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm focus:border-brand/40 focus:outline-none"
            />
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyMessage(channel)}>
                {isCopied ? (
                  <Check className="mr-1.5 h-3.5 w-3.5 text-brand" />
                ) : (
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                )}
                {isCopied ? "Copied!" : "Copy Message"}
              </Button>
              {channel.getShareUrl && (
                <a
                  href={channel.getShareUrl(msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                    Open {channel.label}
                  </Button>
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
