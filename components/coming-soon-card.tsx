"use client";

import { motion } from "framer-motion";
import { Lock, Rocket, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ComingSoonCardProps {
  title: string;
  description: string;
  features?: string[];
  ctaHref?: string;
  ctaLabel?: string;
}

export function ComingSoonCard({
  title,
  description,
  features,
  ctaHref = "/dashboard/billing",
  ctaLabel = "View Plans",
}: ComingSoonCardProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-lg text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Lock className="h-7 w-7 text-muted-foreground" />
        </div>

        <Badge variant="secondary" className="mb-4 text-xs">
          Unlock with a Plan
        </Badge>

        <h2 className="mb-2 text-2xl font-bold tracking-tight">{title}</h2>

        <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {features && features.length > 0 && (
          <div className="mx-auto mb-8 grid max-w-sm gap-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-4 py-2.5 text-left text-sm"
              >
                <Rocket className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        )}

        <Link href={ctaHref}>
          <Button variant="default" size="sm" className="gap-1.5">
            {ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
