"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept(level: "all" | "essential") {
    localStorage.setItem(STORAGE_KEY, level);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-border/60 bg-background/95 backdrop-blur-lg"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 sm:items-center">
              <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground sm:mt-0" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                We use cookies to keep you signed in and remember your
                preferences. You can accept all cookies or limit to essentials
                only.{" "}
                <Link
                  href="/cookies"
                  className="text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
                >
                  Learn more
                </Link>
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => accept("essential")}
                className="text-xs"
              >
                Essential Only
              </Button>
              <Button
                size="sm"
                onClick={() => accept("all")}
                className="text-xs"
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
