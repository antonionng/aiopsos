"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

/**
 * The one top bar for the whole public site.
 *
 * There used to be five of these. The homepage had the real menu; the
 * courses, insights and use-cases layouts shared a second, shorter one; and
 * the company, resources and legal layouts each had a bare "Back to Experrt"
 * arrow. A reader who clicked Academy from the homepage lost four of the six
 * links and gained no way back to pricing or the enterprise section, which
 * reads as leaving the site rather than moving around it.
 *
 * This is the homepage bar, lifted as-is, made route-aware so it can be
 * mounted anywhere.
 *
 * `fixed` rather than `sticky` is deliberate: the homepage hero sits behind
 * it and compensates with its own `pt-14`. Every other layout does the same
 * on its content wrapper.
 */

const NAV_LINKS = [
  { href: "#capabilities", label: "Experrt AI" },
  { href: "/courses", label: "Academy" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/insights", label: "Insights" },
  { href: "#enterprise", label: "Enterprise" },
  { href: "#pricing", label: "Pricing" },
] as const;

/**
 * A link that is either a route or an in-page anchor, decided by the href.
 *
 * On the homepage the anchors stay plain `<a>` so the browser does the
 * scrolling. Everywhere else there is no `#pricing` on the page, so they
 * become `/#pricing` and route home first - the old behaviour was a link
 * that silently did nothing.
 */
function NavLink({
  href,
  onHome,
  children,
  ...rest
}: {
  href: string;
  onHome: boolean;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"a">, "href" | "children">) {
  if (href.startsWith("#")) {
    if (onHome) {
      return (
        <a href={href} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={`/${href}`} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

/** A route link is current if the path is it or sits underneath it. */
function isActive(href: string, pathname: string) {
  if (href.startsWith("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Experrt home"
            onClick={close}
          >
            <Wordmark size="md" />
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, pathname);
              return (
                <NavLink
                  key={link.href}
                  href={link.href}
                  onHome={onHome}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm transition-colors hover:text-foreground",
                    active
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden h-9 items-center justify-center px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-nav-mobile"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="site-nav-mobile"
          className="border-t border-border/40 bg-background md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col px-6 pb-4 pt-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, pathname);
              return (
                <NavLink
                  key={link.href}
                  href={link.href}
                  onHome={onHome}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b border-border/40 py-3 text-sm transition-colors hover:text-foreground",
                    active
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </NavLink>
              );
            })}
            <Link
              href="/login"
              onClick={close}
              className="py-3 text-sm font-medium text-foreground"
            >
              Sign in
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

