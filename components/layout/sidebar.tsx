"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  FileCheck,
  Settings,
  Library,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Shield,
  Mail,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Wordmark } from "@/components/wordmark";
import { createClient } from "@/lib/supabase/client";
import { useWorkspaceIdentity } from "./current-org-context";
export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const identity = useWorkspaceIdentity();
  const role = identity?.role || "user";
  const orgId = identity?.currentOrgId || null;
  const orgs = identity?.organisations || [];
  const mounted = identity?.ready || false;
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  async function switchOrg(next: string) {
    setSwitching(true);
    const db = createClient();
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { error } = await db
      .from("user_profiles")
      .update({ org_id: next })
      .eq("id", user.id);
    if (error) {
      setError("Could not switch workspace. Please retry.");
      setSwitching(false);
    } else window.location.assign("/dashboard/learning");
  }
  const manager = ["admin", "manager", "super_admin"].includes(role);
  const items = [
    {href:"/dashboard/programmes",label:"Programmes",hint:"Your learning and teaching",icon:BookOpen,match:["/dashboard/programmes","/dashboard/delivery","/dashboard/learning","/dashboard/learn/"]},
    ...(manager ? [
      {href:"/dashboard/studio",label:"Content library",hint:"Reusable courses and materials",icon:Library,match:["/dashboard/studio"]},
      {href:"/dashboard/clients",label:"People & organisations",hint:"Your team and clients",icon:Users,match:["/dashboard/clients"]},
      {href:"/dashboard/records",label:"Organisation records",hint:"Records across programmes",icon:FileCheck,match:["/dashboard/records","/dashboard/evidence"]},
    ] : [{href:"/dashboard/transcript",label:"My record",hint:"Learning and certificates",icon:FileCheck,match:["/dashboard/transcript","/dashboard/my-results"]}]),
  ];
  return (
    <aside
      className={`${onNavigate ? "relative w-full" : "fixed left-0 top-0 z-40 w-[240px]"} flex h-dvh flex-col border-r border-sidebar-border bg-sidebar`}
    >
      <div className="px-6 pt-7 pb-6">
        <Link
          href="/dashboard/learning"
          aria-label="Experrt home"
          onClick={onNavigate}
        >
          <Wordmark size="md" />
        </Link>
      </div>
      <div className="px-4 pb-5">
        {role === "super_admin" ? (
          <label className="relative block">
            <span className="sr-only">Current organisation</span>
            <select
              disabled={switching}
              value={orgId || ""}
              onChange={(e) => switchOrg(e.target.value)}
              className="w-full appearance-none rounded-xl border border-sidebar-border bg-background px-3 py-3 pr-7 text-sm"
            >
              <option value="" disabled>
                Choose organisation
              </option>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-3.5 h-4 w-4" />
          </label>
        ) : (
          <p className="truncate px-2 text-sm font-semibold">
            {orgs[0]?.name || "Your learning space"}
          </p>
        )}
        {identity?.error && <div role="alert" className="mt-3 rounded-xl border border-destructive/20 p-3 text-xs"><p>{identity.error}</p><button onClick={identity.retry} className="mt-2 font-semibold underline">Retry workspace</button></div>}
        {error && (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1 overflow-y-auto px-3"
      >
        {!mounted ? <div aria-label="Loading navigation" className="space-y-3 p-3">{[1,2,3,4].map(n => <div key={n} className="h-14 rounded-xl bg-sidebar-accent" />)}</div> : items.map((item) => {
          const active = item.match.some(
            (p) =>
              pathname === p ||
              pathname.startsWith(p + "/") ||
              (p.endsWith("/") && pathname.startsWith(p)),
          );
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-start gap-3 rounded-2xl px-4 py-3 transition-colors ${active ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-sidebar-accent"}`}
            >
              <item.icon className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                <span className="block text-sm font-semibold">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  {item.hint}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-sidebar-border p-3">
        <Link
          href="/dashboard/resources"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-sidebar-accent"
        >
          <Library size={17} />
          Resources & tools
        </Link>
        {role === "super_admin" && (
          <Link
            href="/dashboard/admin"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-sidebar-accent"
          >
            <Shield size={17} />
            Platform administration
          </Link>
        )}
        {role === "super_admin" && (
          <Link
            href="/dashboard/admin/emails"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-sidebar-accent"
          >
            <Mail size={17} />
            Emails
          </Link>
        )}
        <Link
          href="/dashboard/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-sidebar-accent"
        >
          <Settings size={17} />
          Settings
        </Link>
        <div className="flex items-center justify-between px-3 pt-3">
          <button
            aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"}
            className="rounded-lg p-2 hover:bg-sidebar-accent"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && theme === "dark" ? (
              <Sun size={17} />
            ) : (
              <Moon size={17} />
            )}
          </button>
          <button
            className="flex items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground"
            onClick={async () => {
              await createClient().auth.signOut();
              router.push("/login");
              router.refresh();
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
