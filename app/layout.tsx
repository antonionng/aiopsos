import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { getPublicSiteUrl } from "@/lib/site";
import { siteOgImageUrl, siteShareImage, SITE_TWITTER_CARD } from "@/lib/social-image";
import "./globals.css";

const inter = localFont({
  src: "../public/fonts/inter.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../public/fonts/jetbrains_mono.woff2",
  weight: "100 800",
  variable: "--font-geist-mono",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "../public/fonts/space_grotesk.woff2",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

const BASE_URL = getPublicSiteUrl();

export const metadata: Metadata = {
  // metadataBase resolves every relative canonical and OG image across the
  // app. Without it Next emits warnings and social cards resolve nowhere.
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Experrt | Learning Platform, Academy & AI Labs",
    // Course and section pages set their own title; this keeps the brand on
    // the end of it without every page repeating it by hand.
    template: "%s | Experrt",
  },
  description:
    "Build capability with our agentic learning platform and academy. Build AI systems, technology products, robotics and HR transformation with Experrt AI Labs.",
  applicationName: "Experrt",
  keywords: [
    "AI training for business",
    "applied AI training",
    "corporate AI training",
    "AI literacy training",
    "learning platform for training providers",
    "enterprise learning and development",
    "applied robotics training",
    "robotics adoption training",
    "technology adoption training",
    "in-person AI training",
    "AI training academy",
  ],
  authors: [{ name: "Experrt" }],

  openGraph: {
    type: "website",
    siteName: "Experrt",
    url: BASE_URL,
    title: "Experrt | Learning Platform, Academy & AI Labs",
    description:
      "Build capability with our agentic learning platform and academy. Build AI systems, technology products, robotics and HR transformation with Experrt AI Labs.",
    images: [siteShareImage()],
  },
  twitter: {
    card: SITE_TWITTER_CARD,
    title: "Experrt | Learning Platform, Academy & AI Labs",
    description:
      "Build capability with our agentic learning platform and academy. Build AI systems, technology products, robotics and HR transformation with Experrt AI Labs.",
    images: [siteOgImageUrl()],
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
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
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
