"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <AlertTriangle className="mb-4 h-10 w-10 text-destructive" />
      <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button
        onClick={reset}
        className="bg-brand text-brand-foreground hover:bg-brand/90"
      >
        Try again
      </Button>
    </div>
  );
}
