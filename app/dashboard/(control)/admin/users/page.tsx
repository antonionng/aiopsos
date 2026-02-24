"use client";

import { Component, useCallback, useEffect, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserX,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

class UserListErrorBoundary extends Component<
  { children: ReactNode; onRetry: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onRetry: () => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[UserDirectory] render error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <AlertTriangle className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">Something went wrong</p>
          <button
            className="mt-3 text-xs text-brand underline underline-offset-4"
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onRetry();
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  org_id: string | null;
  org_name: string | null;
  job_title?: string | null;
  avatar_url?: string | null;
  plan_override?: string | null;
}

interface Org {
  id: string;
  name: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const roleBadge: Record<string, string> = {
  super_admin: "bg-purple-500/10 text-purple-500",
  admin: "bg-brand/10 text-brand",
  manager: "bg-blue-500/10 text-blue-500",
  user: "bg-muted text-muted-foreground",
};

export default function UserDirectoryPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorIs403, setErrorIs403] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [orgFilter, setOrgFilter] = useState("");
  const limit = 50;

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    setErrorIs403(false);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      if (orgFilter) params.set("org_id", orgFilter);

      const res = await fetch(`/api/super-admin/users?${params}`);
      if (!res.ok) {
        setErrorIs403(res.status === 403);
        if (res.status === 403) {
          setError("You need the platform owner role to view this page.");
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Failed to load users. Try again later.");
        }
        return;
      }
      const data = await res.json();
      setUsers(data.users ?? []);
      setOrgs(data.organisations ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setErrorIs403(false);
      setError("Failed to load users. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, orgFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function changeRole(userId: string, newRole: string) {
    const res = await fetch(`/api/super-admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) loadUsers();
    else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error || "Failed");
    }
  }

  async function changePlan(userId: string, plan: string | null) {
    const res = await fetch(`/api/super-admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_override: plan }),
    });
    if (res.ok) loadUsers();
    else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error || "Failed");
    }
  }

  async function deactivateUser(userId: string) {
    if (!confirm("Deactivate this user? They will lose org access.")) return;
    const res = await fetch(`/api/super-admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deactivate: true }),
    });
    if (res.ok) loadUsers();
    else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error || "Failed");
    }
  }

  const totalPages = Math.ceil(total / limit);
  const animationKey = `${page}-${search}-${roleFilter}-${orgFilter}`;

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">
            {errorIs403 ? "Access Denied" : "Something went wrong"}
          </h2>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div key={animationKey} variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="mb-1">User Directory</h1>
        <p className="text-sm text-muted-foreground">
          {orgFilter
            ? `Users in ${orgs.find((o) => o.id === orgFilter)?.name ?? "selected tenant"} (${total})`
            : `All users across all tenants (${total} total)`}
        </p>
      </motion.div>

      <motion.div variants={item} className="mt-4 mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
        <Shield className="h-3 w-3" />
        Super Admin
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="pl-9"
          />
        </div>
        <Select value={orgFilter || "all"} onValueChange={(v) => { setOrgFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <Building2 className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="All tenants" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tenants</SelectItem>
            {orgs.map((o) => (
              <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleFilter || "all"} onValueChange={(v) => { setRoleFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <UserListErrorBoundary onRetry={loadUsers}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <Users className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">No users found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        (u.name || u.email || "?").charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{u.name || u.email || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {u.org_name && (
                      <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                        {u.org_name}
                      </Badge>
                    )}
                    <Badge
                      className={`text-xs ${
                        u.plan_override === "enterprise"
                          ? "bg-brand/10 text-brand"
                          : u.plan_override === "pro"
                          ? "bg-purple-500/10 text-purple-500"
                          : u.plan_override === "basic"
                          ? "bg-muted text-muted-foreground"
                          : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {u.plan_override
                        ? u.plan_override.charAt(0).toUpperCase() + u.plan_override.slice(1)
                        : "Org Default"}
                    </Badge>
                    <Badge className={`text-xs ${roleBadge[u.role] ?? roleBadge.user}`}>
                      {u.role}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {u.role !== "admin" && (
                          <DropdownMenuItem onClick={() => changeRole(u.id, "admin")}>Make Admin</DropdownMenuItem>
                        )}
                        {u.role !== "manager" && (
                          <DropdownMenuItem onClick={() => changeRole(u.id, "manager")}>Make Manager</DropdownMenuItem>
                        )}
                        {u.role !== "user" && u.role !== "super_admin" && (
                          <DropdownMenuItem onClick={() => changeRole(u.id, "user")}>Make User</DropdownMenuItem>
                        )}
                        {u.plan_override !== "basic" && (
                          <DropdownMenuItem onClick={() => changePlan(u.id, "basic")}>Set Basic Plan</DropdownMenuItem>
                        )}
                        {u.plan_override !== "pro" && (
                          <DropdownMenuItem onClick={() => changePlan(u.id, "pro")}>Set Pro Plan</DropdownMenuItem>
                        )}
                        {u.plan_override !== "enterprise" && (
                          <DropdownMenuItem onClick={() => changePlan(u.id, "enterprise")}>Set Enterprise Plan</DropdownMenuItem>
                        )}
                        {u.plan_override && (
                          <DropdownMenuItem onClick={() => changePlan(u.id, null)}>Reset to Org Default</DropdownMenuItem>
                        )}
                        {u.role !== "super_admin" && (
                          <DropdownMenuItem className="text-destructive" onClick={() => deactivateUser(u.id)}>
                            <UserX className="mr-1.5 h-3.5 w-3.5" /> Deactivate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </UserListErrorBoundary>
    </motion.div>
  );
}
