"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Building2, Users, Shield, User, Camera, Loader2, UserPlus, Trash2,
  MoreHorizontal, CreditCard, Crown, Check, Lock, ExternalLink, Sparkles,
  ArrowUpRight, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SUBSCRIPTION_PLANS,
  PLAN_FEATURES,
  PLAN_MODELS,
  FEATURE_QUOTAS,
  FEATURE_LABELS,
  FEATURE_UNITS,
  type PlanType,
} from "@/lib/constants";
import { useCurrentOrgId } from "@/components/layout/current-org-context";
import { toast } from "sonner";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

interface OrgData {
  name: string;
  industry: string;
  size: string;
  website: string;
  description: string;
  location: string;
  founded_year: number | null;
  mission: string;
  products_services: string;
  tech_stack: string;
  logo_url: string | null;
}

interface ProfileData {
  name: string;
  email: string;
  job_title: string;
  bio: string;
  skills: string;
  preferences: Record<string, string>;
}

const EMPTY_ORG: OrgData = {
  name: "",
  industry: "",
  size: "",
  website: "",
  description: "",
  location: "",
  founded_year: null,
  mission: "",
  products_services: "",
  tech_stack: "",
  logo_url: null,
};

const EMPTY_PROFILE: ProfileData = {
  name: "",
  email: "",
  job_title: "",
  bio: "",
  skills: "",
  preferences: {},
};

interface BillingData {
  plan: PlanType;
  status: string;
  trialEndsAt: string | null;
  seatCount: number;
  memberCount: number;
  currentMonthUsage: {
    totalRequests: number;
    totalTokens: number;
    totalCharge: number;
  };
}

type UserRole = "super_admin" | "admin" | "manager" | "user";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgData>(EMPTY_ORG);
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [orgSaving, setOrgSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [orgSaved, setOrgSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [canEditOrg, setCanEditOrg] = useState(true);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    job_title: string;
    avatar_url: string | null;
    department_name: string | null;
    plan_override: string | null;
    is_self: boolean;
  }

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [callerRole, setCallerRole] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [inviting, setInviting] = useState(false);

  const [billing, setBilling] = useState<BillingData | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);

  const currentOrgId = useCurrentOrgId();

  const loadBilling = useCallback(async () => {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/billing");
      if (res.ok) {
        const data = await res.json();
        setBilling(data);
      }
    } catch {
      // ignore
    } finally {
      setBillingLoading(false);
    }
  }, []);

  async function handleCheckout(plan: PlanType) {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, priceId: `price_${plan}` }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setStripeLoading(false);
    }
  }

  async function handlePortal() {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setStripeLoading(false);
    }
  }

  const loadOrg = useCallback(() => {
    fetch("/api/organisation")
      .then((r) => r.json())
      .then((d) => {
        if (d.organisation) {
          setOrg({
            name: d.organisation.name ?? "",
            industry: d.organisation.industry ?? "",
            size: d.organisation.size ?? "",
            website: d.organisation.website ?? "",
            description: d.organisation.description ?? "",
            location: d.organisation.location ?? "",
            founded_year: d.organisation.founded_year ?? null,
            mission: d.organisation.mission ?? "",
            products_services: d.organisation.products_services ?? "",
            tech_stack: d.organisation.tech_stack ?? "",
            logo_url: d.organisation.logo_url ?? null,
          });
        }
        setCanEditOrg(d.can_update_organisation !== false);
      })
      .catch(() => {});
  }, []);

  const loadProfile = useCallback(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setProfile({
            name: d.profile.name ?? "",
            email: d.profile.email ?? "",
            job_title: d.profile.job_title ?? "",
            bio: d.profile.bio ?? "",
            skills: d.profile.skills ?? "",
            preferences: d.profile.preferences ?? {},
          });
          setAvatarUrl(d.profile.avatar_url ?? null);
          if (d.profile.role) setUserRole(d.profile.role as UserRole);
        }
      })
      .catch(() => {});
  }, []);

  const loadTeam = useCallback(async () => {
    setTeamLoading(true);
    try {
      const res = await fetch("/api/team");
      if (!res.ok) return;
      const data = await res.json();
      setTeamMembers(data.members ?? []);
      setCallerRole(data.caller_role ?? "");
    } catch {
      // ignore
    } finally {
      setTeamLoading(false);
    }
  }, []);

  const isAdmin = ["admin", "manager", "super_admin"].includes(userRole);
  const canSeeGovernance = ["admin", "super_admin"].includes(userRole);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!isAdmin) return;
    loadOrg();
    loadTeam();
    loadBilling();
  }, [isAdmin, loadOrg, loadTeam, loadBilling]);

  useEffect(() => {
    loadOrg();
  }, [currentOrgId, loadOrg]);

  async function saveOrg() {
    setOrgSaving(true);
    setOrgSaved(false);
    try {
      const res = await fetch("/api/organisation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(org),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to save organisation");
        return;
      }
      setOrgSaved(true);
      setTimeout(() => setOrgSaved(false), 2000);
      window.dispatchEvent(new CustomEvent("organisation-updated"));
    } catch {
      toast.error("Failed to save organisation");
    } finally {
      setOrgSaving(false);
    }
  }

  async function saveProfile() {
    setProfileSaving(true);
    setProfileSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          job_title: profile.job_title,
          bio: profile.bio,
          skills: profile.skills,
          preferences: profile.preferences,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to save profile");
        return;
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setProfileSaving(false);
    }
  }

  async function uploadLogo(file: File) {
    setLogoUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload/logo", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to upload logo");
        return;
      }
      const { url } = await res.json();
      setOrg((prev) => ({ ...prev, logo_url: url }));
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setLogoUploading(false);
    }
  }

  async function uploadAvatar(file: File) {
    setAvatarUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload/avatar", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to upload avatar");
        return;
      }
      const { url } = await res.json();
      setAvatarUrl(url);
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function inviteMember() {
    if (!inviteEmail) return;
    setInviting(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, name: inviteName, role: inviteRole }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to invite");
        return;
      }
      setInviteOpen(false);
      setInviteEmail("");
      setInviteName("");
      setInviteRole("user");
      loadTeam();
    } catch {
      toast.error("Failed to invite member");
    } finally {
      setInviting(false);
    }
  }

  async function changeRole(memberId: string, newRole: string) {
    const res = await fetch(`/api/team/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) loadTeam();
    else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error || "Failed to change role");
    }
  }

  async function changePlan(memberId: string, plan: string | null) {
    const res = await fetch(`/api/team/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_override: plan }),
    });
    if (res.ok) loadTeam();
    else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error || "Failed to change plan");
    }
  }

  async function removeMember(memberId: string) {
    if (!confirm("Remove this team member? This cannot be undone.")) return;
    const res = await fetch(`/api/team/${memberId}`, { method: "DELETE" });
    if (res.ok) loadTeam();
    else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error || "Failed to remove member");
    }
  }

  const canManageTeam = ["admin", "manager", "super_admin"].includes(callerRole);

  const currentPlan = billing ? SUBSCRIPTION_PLANS[billing.plan] : null;
  const isTrialing = billing?.status === "trialing";
  const isActive = billing?.status === "active" || isTrialing;
  const paidSeats = billing?.seatCount ?? 5;
  const totalMembers = teamMembers.length;
  const trialDaysLeft = billing?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(billing.trialEndsAt).getTime() - Date.now()) / 86400000))
    : 0;

  const PLAN_ORDER: PlanType[] = ["basic", "pro", "enterprise"];
  const currentPlanIndex = billing ? PLAN_ORDER.indexOf(billing.plan) : 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">
          {isAdmin
            ? "Manage your organisation, profile, team, billing, and governance."
            : "Manage your profile and preferences."}
        </p>
      </motion.div>

      <motion.div variants={item} className="mt-8">
        <Tabs defaultValue={isAdmin ? "organisation" : "profile"} className="w-full">
          <TabsList className="mb-6 bg-muted">
            {isAdmin && (
              <TabsTrigger value="organisation" className="gap-2">
                <Building2 className="h-3.5 w-3.5" />
                Organisation
              </TabsTrigger>
            )}
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-3.5 w-3.5" />
              Profile
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="team" className="gap-2">
                <Users className="h-3.5 w-3.5" />
                Team & Billing
              </TabsTrigger>
            )}
            {canSeeGovernance && (
              <TabsTrigger value="governance" className="gap-2">
                <Shield className="h-3.5 w-3.5" />
                Governance
              </TabsTrigger>
            )}
          </TabsList>

          {/* ───── Organisation ───── */}
          {isAdmin && <TabsContent value="organisation">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Organisation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!canEditOrg && (
                  <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                    Only admins and managers can edit organisation details. Ask your admin to update your role or make changes for you.
                  </p>
                )}
                <div className={!canEditOrg ? "space-y-6 pointer-events-none opacity-90" : "space-y-6"}>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={logoUploading || !canEditOrg}
                    className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted transition-colors hover:border-brand"
                  >
                    {org.logo_url ? (
                      <Image
                        src={org.logo_url}
                        alt="Organisation logo"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      {logoUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      ) : (
                        <Camera className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadLogo(file);
                      e.target.value = "";
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">Organisation Logo</p>
                    <p className="text-xs text-muted-foreground">
                      Click to upload. Max 5 MB.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Organisation Name</Label>
                    <Input
                      value={org.name}
                      onChange={(e) => setOrg({ ...org, name: e.target.value })}
                      className="bg-surface"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select value={org.industry || undefined} onValueChange={(v) => setOrg({ ...org, industry: v })}>
                      <SelectTrigger className="w-full bg-surface"><SelectValue placeholder="Select industry" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="professional_services">Professional Services</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="media">Media & Entertainment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company Size</Label>
                    <Select value={org.size || undefined} onValueChange={(v) => setOrg({ ...org, size: v })}>
                      <SelectTrigger className="w-full bg-surface"><SelectValue placeholder="Select size" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1,000 employees</SelectItem>
                        <SelectItem value="1001-5000">1,001-5,000 employees</SelectItem>
                        <SelectItem value="5001+">5,001+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      value={org.website}
                      onChange={(e) => setOrg({ ...org, website: e.target.value })}
                      placeholder="https://example.com"
                      className="bg-surface"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Location / HQ</Label>
                    <Input
                      value={org.location}
                      onChange={(e) => setOrg({ ...org, location: e.target.value })}
                      placeholder="e.g. London, UK"
                      className="bg-surface"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Founded Year</Label>
                    <Input
                      type="number"
                      value={org.founded_year ?? ""}
                      onChange={(e) =>
                        setOrg({
                          ...org,
                          founded_year: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                      placeholder="e.g. 2015"
                      className="bg-surface"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={org.description}
                    onChange={(e) => setOrg({ ...org, description: e.target.value })}
                    placeholder="Briefly describe what your organisation does..."
                    rows={3}
                    className="bg-surface"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mission & Values</Label>
                  <Textarea
                    value={org.mission}
                    onChange={(e) => setOrg({ ...org, mission: e.target.value })}
                    placeholder="Your company mission statement and core values..."
                    rows={3}
                    className="bg-surface"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Key Products & Services</Label>
                  <Textarea
                    value={org.products_services}
                    onChange={(e) => setOrg({ ...org, products_services: e.target.value })}
                    placeholder="Describe your main products and services..."
                    rows={3}
                    className="bg-surface"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tech Stack</Label>
                  <Textarea
                    value={org.tech_stack}
                    onChange={(e) => setOrg({ ...org, tech_stack: e.target.value })}
                    placeholder="e.g. React, Node.js, AWS, PostgreSQL..."
                    rows={2}
                    className="bg-surface"
                  />
                </div>

                <Button
                  onClick={saveOrg}
                  disabled={orgSaving || !canEditOrg}
                  className="bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  {orgSaving ? "Saving..." : orgSaved ? "Saved" : "Save Changes"}
                </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>}

          {/* ───── Profile ───── */}
          <TabsContent value="profile">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-xs text-muted-foreground">
                  This information helps the AI personalise responses to you.
                </p>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted transition-colors hover:border-brand"
                  >
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Your avatar"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      {avatarUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      ) : (
                        <Camera className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadAvatar(file);
                      e.target.value = "";
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">Profile Photo</p>
                    <p className="text-xs text-muted-foreground">
                      Click to upload. Max 5 MB.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="bg-surface"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile.email} disabled className="bg-surface opacity-60" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={profile.job_title}
                    onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
                    placeholder="e.g. VP of Engineering"
                    className="bg-surface"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell the AI a bit about yourself, your background, and what you work on..."
                    rows={3}
                    className="bg-surface"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skills & Expertise</Label>
                  <Textarea
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                    placeholder="e.g. Cloud architecture, team leadership, Python, data analytics..."
                    rows={2}
                    className="bg-surface"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Communication Preference</Label>
                  <Select
                    value={profile.preferences.communication_style ?? ""}
                    onValueChange={(v) =>
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, communication_style: v },
                      })
                    }
                  >
                    <SelectTrigger className="bg-surface">
                      <SelectValue placeholder="How should AI communicate with you?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise & direct</SelectItem>
                      <SelectItem value="detailed">Detailed & thorough</SelectItem>
                      <SelectItem value="conversational">Conversational & friendly</SelectItem>
                      <SelectItem value="technical">Technical & precise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Detail Level</Label>
                  <Select
                    value={profile.preferences.detail_level ?? ""}
                    onValueChange={(v) =>
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, detail_level: v },
                      })
                    }
                  >
                    <SelectTrigger className="bg-surface">
                      <SelectValue placeholder="How much detail do you want?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief">Brief summaries</SelectItem>
                      <SelectItem value="moderate">Moderate detail</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive explanations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={saveProfile}
                  disabled={profileSaving}
                  className="bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  {profileSaving ? "Saving..." : profileSaved ? "Saved" : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───── Team & Billing ───── */}
          {isAdmin && <TabsContent value="team">
            <div className="space-y-6">

              {/* ── A. Current Plan + Seat Overview Banner ── */}
              {billingLoading || !billing ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex items-center justify-center py-10">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </CardContent>
                </Card>
              ) : (
                <>
                  {isTrialing && trialDaysLeft > 0 && (
                    <div className="flex items-center gap-3 rounded-xl border border-brand/30 bg-brand/5 p-4">
                      <Crown className="h-5 w-5 shrink-0 text-brand" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          Pro Trial &mdash; {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} remaining
                        </p>
                        <p className="text-xs text-muted-foreground">
                          You have full Pro access. Choose a plan before your trial ends to keep all features.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-brand text-brand-foreground hover:bg-brand/90"
                        onClick={() => handleCheckout("pro")}
                        disabled={stripeLoading}
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  )}

                  <Card className="border-border bg-card">
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-brand" />
                            <span className="text-xl font-bold">{currentPlan?.name ?? "Free"}</span>
                            <Badge variant={isActive ? "default" : "destructive"} className="text-[10px]">
                              {isTrialing ? "Trial" : billing.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            £{currentPlan?.monthlyPricePerSeat ?? 0}/user/month &middot; {paidSeats} paid seat{paidSeats !== 1 ? "s" : ""}
                            {currentPlan ? ` = £${currentPlan.monthlyPricePerSeat * paidSeats}/mo` : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {billing.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handlePortal}
                              disabled={stripeLoading}
                            >
                              Manage Subscription
                              <ExternalLink className="ml-1.5 h-3 w-3" />
                            </Button>
                          )}
                          {billing.plan !== "enterprise" && (
                            <Button
                              size="sm"
                              className="bg-brand text-brand-foreground hover:bg-brand/90"
                              onClick={() => handleCheckout(
                                billing.plan === "basic" ? "pro" : "enterprise"
                              )}
                              disabled={stripeLoading}
                            >
                              <Zap className="mr-1.5 h-3.5 w-3.5" />
                              Upgrade Plan
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 flex items-center gap-4 rounded-lg border border-border bg-muted/50 px-4 py-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {totalMembers} team member{totalMembers !== 1 ? "s" : ""}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Unlimited free seats for assessments &middot; {paidSeats} paid seat{paidSeats !== 1 ? "s" : ""} for premium AI features
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] shrink-0">
                          <Users className="mr-1 h-3 w-3" />
                          Unlimited
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* ── B. Team Members Section ── */}
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold">
                    Team Members ({totalMembers})
                  </CardTitle>
                  {canManageTeam && (
                    <Button
                      size="sm"
                      className="bg-brand text-brand-foreground hover:bg-brand/90"
                      onClick={() => setInviteOpen(true)}
                    >
                      <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                      Invite Member
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {teamLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : teamMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Users className="mb-3 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">No team members yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Invite your first team member to get started.
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Collaboration features unlock with Pro and Enterprise plans.
                      </p>
                      {canManageTeam && (
                        <Button
                          size="sm"
                          className="mt-4 bg-brand text-brand-foreground hover:bg-brand/90"
                          onClick={() => setInviteOpen(true)}
                        >
                          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                          Invite Your First Member
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {teamMembers.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between rounded-lg border border-border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold">
                              {m.avatar_url ? (
                                <img
                                  src={m.avatar_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                (m.name || m.email).charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {m.name || m.email}
                                {m.is_self && (
                                  <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {m.email}
                                {m.job_title && ` · ${m.job_title}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {m.department_name && (
                              <Badge variant="secondary" className="text-xs">
                                {m.department_name}
                              </Badge>
                            )}
                            <Badge
                              className={`text-xs ${
                                m.plan_override === "enterprise"
                                  ? "bg-brand/10 text-brand"
                                  : m.plan_override === "pro"
                                  ? "bg-purple-500/10 text-purple-500"
                                  : m.plan_override === "basic"
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-muted/50 text-muted-foreground"
                              }`}
                            >
                              {m.plan_override
                                ? m.plan_override.charAt(0).toUpperCase() + m.plan_override.slice(1)
                                : "Org Default"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {m.role}
                            </Badge>
                            {canManageTeam && !m.is_self && m.role !== "super_admin" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {m.role !== "admin" && (
                                    <DropdownMenuItem onClick={() => changeRole(m.id, "admin")}>
                                      Make Admin
                                    </DropdownMenuItem>
                                  )}
                                  {m.role !== "manager" && (
                                    <DropdownMenuItem onClick={() => changeRole(m.id, "manager")}>
                                      Make Manager
                                    </DropdownMenuItem>
                                  )}
                                  {m.role !== "user" && (
                                    <DropdownMenuItem onClick={() => changeRole(m.id, "user")}>
                                      Make User
                                    </DropdownMenuItem>
                                  )}
                                  {m.plan_override !== "basic" && (
                                    <DropdownMenuItem onClick={() => changePlan(m.id, "basic")}>
                                      Set Basic Plan
                                    </DropdownMenuItem>
                                  )}
                                  {m.plan_override !== "pro" && (
                                    <DropdownMenuItem onClick={() => changePlan(m.id, "pro")}>
                                      Set Pro Plan
                                    </DropdownMenuItem>
                                  )}
                                  {m.plan_override !== "enterprise" && (
                                    <DropdownMenuItem onClick={() => changePlan(m.id, "enterprise")}>
                                      Set Enterprise Plan
                                    </DropdownMenuItem>
                                  )}
                                  {m.plan_override && (
                                    <DropdownMenuItem onClick={() => changePlan(m.id, null)}>
                                      Reset to Org Default
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => removeMember(m.id)}
                                  >
                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ── C. Plan Comparison Cards ── */}
              <div>
                <h2 className="mb-1 text-base font-semibold">Choose Your Plan</h2>
                <p className="mb-4 text-xs text-muted-foreground">
                  Scale your AI adoption with the right plan for your team. All plans include core AI chat.
                </p>
                <div className="grid gap-4 lg:grid-cols-3">
                  {(["basic", "pro", "enterprise"] as const).map((planKey) => {
                    const plan = SUBSCRIPTION_PLANS[planKey];
                    const features = PLAN_FEATURES[planKey];
                    const models = PLAN_MODELS[planKey];
                    const quotas = FEATURE_QUOTAS[planKey];
                    const isCurrent = billing?.plan === planKey;
                    const planIndex = PLAN_ORDER.indexOf(planKey);
                    const isUpgrade = planIndex > currentPlanIndex;

                    return (
                      <Card
                        key={planKey}
                        className={`relative border-border bg-card flex flex-col ${
                          planKey === "enterprise"
                            ? "ring-1 ring-brand/40"
                            : planKey === "pro"
                            ? "ring-1 ring-muted-foreground/20"
                            : ""
                        }`}
                      >
                        {planKey === "pro" && (
                          <div className="absolute -top-3 left-4">
                            <Badge className="bg-foreground text-background text-[10px]">
                              Most Popular
                            </Badge>
                          </div>
                        )}
                        {planKey === "enterprise" && (
                          <div className="absolute -top-3 left-4">
                            <Badge className="bg-brand text-brand-foreground text-[10px]">
                              Best Value
                            </Badge>
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-base font-semibold">{plan.name}</span>
                            <span className="text-right">
                              <span className="text-2xl font-bold">£{plan.monthlyPricePerSeat}</span>
                              <span className="text-[11px] text-muted-foreground">/user/mo</span>
                            </span>
                          </CardTitle>
                          <p className="text-[11px] text-muted-foreground">
                            Unlimited free seats &middot; Paid from £{plan.monthlyPricePerSeat * plan.minSeats}/mo ({plan.minSeats}+ seats)
                          </p>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col">
                          <div className="mb-3 flex items-center gap-1.5">
                            <Badge variant="secondary" className="text-[10px]">
                              {models.length} AI models
                            </Badge>
                          </div>

                          <div className="flex-1 space-y-1.5">
                            {[
                              { label: "Knowledge base", on: features.knowledgeBase },
                              { label: "Custom personas", on: features.personas },
                              { label: "Team collaboration", on: features.teamCollaboration },
                              { label: "Approval workflows", on: features.approvalWorkflows },
                              { label: "Stack recommendation", on: features.stackRecommendation },
                              { label: "Roadmap generator", on: features.roadmapGenerator },
                              { label: "Advanced analytics", on: features.advancedAnalytics },
                              { label: "PDF export", on: features.pdfExport },
                              { label: "Web search", on: features.webSearch },
                              { label: "Voice chat", on: features.voiceChat },
                              { label: "Image generation", on: features.imageGeneration },
                              { label: "Deep research", on: features.deepResearch },
                            ].map((f) => (
                              <div key={f.label} className="flex items-center gap-2 text-xs">
                                {f.on ? (
                                  <Check className="h-3.5 w-3.5 shrink-0 text-brand" />
                                ) : (
                                  <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                                )}
                                <span className={f.on ? "" : "text-muted-foreground/50"}>
                                  {f.label}
                                </span>
                              </div>
                            ))}
                          </div>

                          {(quotas.voice > 0 || quotas.web_search > 0 || quotas.image_gen > 0 || quotas.deep_research > 0) && (
                            <div className="mt-4 rounded-md border border-border bg-muted/50 p-2.5">
                              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                Included Quotas / Seat / Month
                              </p>
                              <div className="grid grid-cols-2 gap-1">
                                {(["voice", "web_search", "image_gen", "deep_research"] as const).map((f) =>
                                  quotas[f] > 0 ? (
                                    <p key={f} className="text-[11px]">
                                      <span className="font-medium">{quotas[f]}</span>{" "}
                                      <span className="text-muted-foreground">{FEATURE_UNITS[f]}</span>
                                      {" "}
                                      <span className="text-muted-foreground">({FEATURE_LABELS[f]})</span>
                                    </p>
                                  ) : null
                                )}
                              </div>
                            </div>
                          )}

                          {planKey === "enterprise" && (
                            <div className="mt-3 space-y-1">
                              {["SSO & SAML", "Dedicated account manager", "Custom model fine-tuning", "Priority support SLA"].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-xs">
                                  <Sparkles className="h-3 w-3 shrink-0 text-brand" />
                                  <span className="font-medium">{item}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-5">
                            {isCurrent ? (
                              <Button variant="outline" className="w-full" disabled>
                                Current Plan
                              </Button>
                            ) : (
                              <Button
                                className={`w-full ${
                                  planKey === "enterprise"
                                    ? "bg-brand text-brand-foreground hover:bg-brand/90"
                                    : ""
                                }`}
                                variant={planKey === "enterprise" ? "default" : "outline"}
                                onClick={() => handleCheckout(planKey)}
                                disabled={stripeLoading}
                              >
                                {isUpgrade ? "Upgrade" : "Switch"} to {plan.name}
                                <ArrowUpRight className="ml-1.5 h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* ── D. Enterprise Upsell CTA ── */}
              {billing && billing.plan !== "enterprise" && (
                <Card className="relative overflow-hidden border-brand/20 bg-gradient-to-r from-brand/5 via-brand/10 to-brand/5">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-brand" />
                          <h3 className="text-lg font-bold">Ready to Scale with Enterprise?</h3>
                        </div>
                        <p className="max-w-lg text-sm text-muted-foreground">
                          Unlock the full power of AI for your organisation with enterprise-grade security,
                          unlimited premium features, and dedicated support.
                        </p>
                        <div className="grid gap-x-6 gap-y-1 pt-1 sm:grid-cols-2">
                          {[
                            "Voice chat & deep research included",
                            "SSO & SAML authentication",
                            "Dedicated customer success manager",
                            "Custom model fine-tuning",
                            "Priority support with SLA",
                            "Advanced governance & compliance",
                          ].map((perk) => (
                            <div key={perk} className="flex items-center gap-2 text-xs">
                              <Check className="h-3.5 w-3.5 shrink-0 text-brand" />
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                        <Button
                          className="bg-brand text-brand-foreground hover:bg-brand/90"
                          onClick={() => handleCheckout("enterprise")}
                          disabled={stripeLoading}
                        >
                          <Zap className="mr-1.5 h-3.5 w-3.5" />
                          Upgrade to Enterprise
                        </Button>
                        <Button variant="outline" asChild>
                          <a href="mailto:sales@aiopsos.com">Talk to Sales</a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Invite dialog */}
              <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join your organisation. All team members get free access to assessments and data gathering.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setInviteOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={inviteMember}
                      disabled={inviting || !inviteEmail}
                      className="bg-brand text-brand-foreground hover:bg-brand/90"
                    >
                      {inviting ? "Sending..." : "Send Invite"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>}

          {/* ───── Governance ───── */}
          {canSeeGovernance && <TabsContent value="governance">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Governance Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "PII Detection", description: "Scan inputs and outputs for personally identifiable information", enabled: true },
                  { label: "Prompt Injection Detection", description: "Block attempts to override system instructions", enabled: true },
                  { label: "Content Classification", description: "Classify outputs before sharing externally", enabled: false },
                  { label: "Usage Audit Logging", description: "Log all AI interactions for compliance review", enabled: true },
                  { label: "Cost Alerts", description: "Alert admins when spending exceeds thresholds", enabled: false },
                ].map((control) => (
                  <div key={control.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{control.label}</p>
                      <p className="text-xs text-muted-foreground">{control.description}</p>
                    </div>
                    <Switch defaultChecked={control.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>}
        </Tabs>

        {/* Legal links */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/40 pt-6">
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Terms of Service
          </a>
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Privacy Policy
          </a>
          <a href="/cookies" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Cookie Policy
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
