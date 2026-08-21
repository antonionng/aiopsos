import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://experrt.com";

export const metadata: Metadata = {
  // metadataBase resolves every relative canonical and OG image across the
  // app. Without it Next emits warnings and social cards resolve nowhere.
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Experrt — applied AI, technology and robotics training",
    // Course and section pages set their own title; this keeps the brand on
    // the end of it without every page repeating it by hand.
    template: "%s | Experrt",
  },
  description:
    "A training academy for applied AI, technology and robotics. Facilitated live by a trainer, in person or online, and built around your team's real work. Attendance, grades and outcomes recorded.",
  applicationName: "Experrt",
  keywords: [
    "AI training for business",
    "applied AI training",
    "corporate AI training",
    "AI literacy training",
    "EU AI Act Article 4 training",
    "applied robotics training",
    "robotics adoption training",
    "technology adoption training",
    "in-person AI training",
    "AI training academy",
  ],
  authors: [{ name: "Experrt" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Experrt",
    url: BASE_URL,
    title: "Experrt — applied AI, technology and robotics training",
    description:
      "Facilitated live by a trainer, in person or online. We train your people to actually use AI, technology and robotics at work.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experrt — applied AI, technology and robotics training",
    description:
      "We train your people to actually use AI, technology and robotics at work. Facilitated live.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster richColors position="top-right" />
            <CookieConsent />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
