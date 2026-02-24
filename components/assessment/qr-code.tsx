"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";

interface QrCodeProps {
  url: string;
  size?: number;
}

export function QrCode({ url, size = 200 }: QrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !url) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 2,
      color: { dark: "#ffffff", light: "#00000000" },
    });
  }, [url, size]);

  function downloadPng() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "assessment-qr-code.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  function copyUrl() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl border border-border bg-card p-6">
        <canvas ref={canvasRef} />
      </div>
      <p className="max-w-xs text-center font-mono text-xs text-muted-foreground break-all">
        {url}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copyUrl}>
          {copied ? (
            <Check className="mr-1.5 h-3.5 w-3.5 text-brand" />
          ) : (
            <Copy className="mr-1.5 h-3.5 w-3.5" />
          )}
          {copied ? "Copied!" : "Copy URL"}
        </Button>
        <Button variant="outline" size="sm" onClick={downloadPng}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Download QR
        </Button>
      </div>
    </div>
  );
}
