"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  BrainCircuit,
  Building2,
  ChevronDown,
  ChevronLeft,
  ClipboardCheck,
  FileText,
  Layers,
  LayoutDashboard,
  LinkIcon,
  LogOut,
  MessageSquare,
  Route,
  ScrollText,
  Settings,
  Shield,
  Moon,
  Sun,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { useSetCurrentOrgId } from "@/components/layout/current-org-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { PlanType } from "@/lib/constants";

type UserRole = "super_admin" | "admin" | "manager" | "user";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  minRole?: UserRole[];
  requiredPlan?: "pro" | "enterprise";
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "INTELLIGENCE",
    items: [
      { href: "/dashboard/hub", icon: LayoutDashboard, label: "Overview" },
      { href: "/dashboard/assessment", icon: BrainCircuit, label: "Readiness Assessment" },
      { href: "/dashboard/my-results", icon: ClipboardCheck, label: "My Results" },
      { href: "/dashboard/recommend", icon: Layers, label: "Stack Recommendation", requiredPlan: "pro", minRole: ["super_admin", "admin", "manager"] },
      { href: "/dashboard/roadmap", icon: Route, label: "90-Day Roadmap", requiredPlan: "pro", minRole: ["super_admin", "admin", "manager"] },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics", requiredPlan: "pro", minRole: ["super_admin", "admin", "manager"] },
      { href: "/dashboard/knowledge", icon: FileText, label: "Document Library", requiredPlan: "pro", minRole: ["super_admin", "admin", "manager"] },
      { href: "/dashboard/ai-policy", icon: ScrollText, label: "AI Policy", requiredPlan: "pro" },
      { href: "/dashboard/links", icon: LinkIcon, label: "Share Links", minRole: ["super_admin", "admin", "manager"] },
    ],
  },
  {
    label: "ADMIN",
    items: [
      {
        href: "/dashboard/admin",
        icon: Shield,
        label: "Platform Admin",
        minRole: ["super_admin"],
      },
      {
        href: "/dashboard/admin/revenue",
        icon: BarChart3,
        label: "Revenue",
        minRole: ["super_admin"],
      },
      {
        href: "/dashboard/admin/users",
        icon: Users,
        label: "User Directory",
        minRole: ["super_admin"],
      },
      {
        href: "/dashboard/admin/audit",
        icon: FileText,
        label: "Audit Log",
        minRole: ["super_admin"],
      },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    ],
  },
];

const PLAN_RANK: Record<PlanType, number> = { basic: 0, pro: 1, enterprise: 2 };

interface OrgOption {
  id: string;
  name: string;
}

async function fetchOrgs(supabase: ReturnType<typeof createClient>) {
  const { data } = await supabase
    .from("organisations")
    .select("id, name")
    .order("name");
  return data ?? [];
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [userPlan, setUserPlan] = useState<PlanType>("basic");
  const [orgs, setOrgs] = useState<OrgOption[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const setCurrentOrgId = useSetCurrentOrgId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role, org_id, plan_override")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setUserRole(profile.role as UserRole);
        setActiveOrgId(profile.org_id);
        setCurrentOrgId(profile.org_id);

        if (profile.plan_override) {
          setUserPlan(profile.plan_override as PlanType);
        } else if (profile.org_id) {
          const { data: org } = await supabase
            .from("organisations")
            .select("subscription_plan_id, subscription_status, trial_ends_at")
            .eq("id", profile.org_id)
            .maybeSingle();
          if (org?.subscription_plan_id) {
            const { data: planRow } = await supabase
              .from("subscription_plans")
              .select("name")
              .eq("id", org.subscription_plan_id)
              .maybeSingle();
            if (planRow) setUserPlan(planRow.name as PlanType);
          } else if (
            org?.subscription_status === "trialing" &&
            org?.trial_ends_at &&
            new Date(org.trial_ends_at) > new Date()
          ) {
            setUserPlan("pro");
          }
        }

        if (profile.role === "super_admin") {
          setOrgs(await fetchOrgs(supabase));
        }
      }
    }
    loadProfile();
  }, [setCurrentOrgId]);

  useEffect(() => {
    const handler = () => {
      if (userRole !== "super_admin") return;
      fetchOrgs(createClient()).then(setOrgs);
    };
    window.addEventListener("organisation-updated", handler);
    return () => window.removeEventListener("organisation-updated", handler);
  }, [userRole]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function switchOrg(orgId: string) {
    setActiveOrgId(orgId);
    setOrgSwitcherOpen(false);
    setCurrentOrgId(orgId);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("user_profiles")
        .update({ org_id: orgId })
        .eq("id", user.id);
    }
    router.refresh();
  }

  const isActive = (href: string) => {
    if (href === "/dashboard/hub") return pathname === "/dashboard/hub";
    return pathname.startsWith(href);
  };

  const canSee = (item: NavItem) => {
    if (!item.minRole) return true;
    return item.minRole.includes(userRole);
  };

  const activeOrgName = orgs.find((o) => o.id === activeOrgId)?.name;

  const isInSheet = !!onNavigate;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isInSheet ? 280 : collapsed ? 60 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={`${isInSheet ? "relative" : "fixed left-0 top-0 z-40"} flex h-screen flex-col border-r border-sidebar-border bg-sidebar`}
    >
      {/* Logo */}
      <div className="flex h-14 items-center px-4">
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Image
                src="/logo.png"
                alt="AIOPSOS"
                width={28}
                height={28}
                className="object-contain"
                unoptimized
              />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Image
                src="/logo.png"
                alt="AIOPSOS"
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
                unoptimized
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat link */}
      <div className="px-2 pb-2">
        {userRole === "super_admin" ? (
          collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/chat"
                  className="flex h-9 w-full items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors hover:bg-brand/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                Back to Chat
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/dashboard/chat"
              className="flex h-9 w-full items-center gap-2.5 rounded-lg bg-brand/10 px-3 text-sm font-medium text-brand transition-colors hover:bg-brand/20"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Back to Chat
            </Link>
          )
        ) : collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/chat"
                onClick={onNavigate}
                className="flex h-9 w-full items-center justify-center rounded-lg bg-gradient-to-r from-brand/10 to-brand/5 text-muted-foreground transition-colors hover:from-brand/20 hover:to-brand/10"
              >
                <MessageSquare className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              AI Chat -- Upgrade to Pro
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href="/dashboard/chat"
            onClick={onNavigate}
            className="flex h-9 w-full items-center gap-2.5 rounded-lg bg-gradient-to-r from-brand/10 to-brand/5 px-3 text-sm font-medium text-muted-foreground transition-colors hover:from-brand/20 hover:to-brand/10"
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span className="flex-1">AI Chat</span>
            <span className="animate-pulse rounded-full bg-brand/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand">
              Pro
            </span>
          </Link>
        )}
      </div>

      {/* Tenant switcher (super_admin only) */}
      {userRole === "super_admin" && !collapsed && orgs.length > 0 && (
        <div className="px-2 pb-2">
          <button
            onClick={() => setOrgSwitcherOpen(!orgSwitcherOpen)}
            className="flex w-full items-center justify-between rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-xs font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            <span className="flex items-center gap-2 truncate">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{activeOrgName || "Select tenant"}</span>
            </span>
            <ChevronDown
              className={`h-3 w-3 shrink-0 text-muted-foreground transition-transform ${
                orgSwitcherOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {orgSwitcherOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 overflow-hidden rounded-lg border border-sidebar-border bg-sidebar"
              >
                {orgs.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => switchOrg(org.id)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-sidebar-accent ${
                      org.id === activeOrgId
                        ? "font-semibold text-brand"
                        : "text-sidebar-foreground"
                    }`}
                  >
                    {org.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter(canSee);
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.label} className="mb-4">
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {section.label}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const gated =
                    item.requiredPlan &&
                    userRole !== "super_admin" &&
                    PLAN_RANK[userPlan] < PLAN_RANK[item.requiredPlan];
                  const active = !gated && isActive(item.href);

                  const content = (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={`group relative flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors duration-150 ${
                        active
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : gated
                            ? "text-muted-foreground/60 hover:bg-sidebar-accent/30 hover:text-muted-foreground"
                            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1.5 h-5 w-0.5 rounded-full bg-brand"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex flex-1 items-center justify-between overflow-hidden whitespace-nowrap"
                          >
                            <span>{item.label}</span>
                            {gated && (
                              <span className="ml-1.5 rounded-full bg-brand/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand">
                                {item.requiredPlan === "enterprise" ? "Ent" : "Pro"}
                              </span>
                            )}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{content}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          {item.label}
                          {gated && ` — ${item.requiredPlan === "enterprise" ? "Enterprise" : "Pro"}`}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  return content;
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="border-t border-sidebar-border p-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {!mounted ? (
              <span className="h-4 w-4" aria-hidden />
            ) : theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          {!collapsed && (
            <button
              onClick={handleSignOut}
              className="flex h-9 flex-1 items-center gap-2 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
