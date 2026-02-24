"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  BrainCircuit,
  LinkIcon,
  ArrowRight,
  Shield,
  Plus,
  Loader2,
  CreditCard,
  Armchair,
  Power,
  PowerOff,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Tenant {
  id: string;
  name: string;
  industry: string;
  size: string;
  created_at: string;
  user_count: number;
  assessment_count: number;
  link_count: number;
  subscription_status: string;
  subscription_plan_id: string | null;
  seat_count: number;
}

interface Stats {
  total_tenants: number;
  active_subscriptions: number;
  total_users: number;
  total_seats: number;
}

interface TenantDetail {
  org: Tenant;
  users: { id: string; name: string; email: string; role: string }[];
  links: { id: string; token: string; title: string; active: boolean; created_at: string }[];
  assessments: { id: string; title: string; status: string; created_at: string }[];
}

interface Plan {
  id: string;
  name: string;
  price_per_seat: number;
  currency: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const statusColor: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500",
  trialing: "bg-blue-500/10 text-blue-500",
  canceled: "bg-red-500/10 text-red-500",
  past_due: "bg-amber-500/10 text-amber-500",
  incomplete: "bg-gray-500/10 text-gray-400",
};

export default function PlatformAdminPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantDetail, setTenantDetail] = useState<TenantDetail | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIndustry, setNewIndustry] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newSeats, setNewSeats] = useState("5");
  const [newPlanId, setNewPlanId] = useState("");

  const [editName, setEditName] = useState("");
  const [editIndustry, setEditIndustry] = useState("");
  const [editSize, setEditSize] = useState("");
  const [editSeats, setEditSeats] = useState("");
  const [editPlanId, setEditPlanId] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTenants = useCallback(async () => {
    try {
      const res = await fetch("/api/super-admin/tenants");
      if (!res.ok) {
        setError("Access denied. Super admin role required.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTenants(data.tenants ?? []);
      setStats(data.stats ?? null);
    } catch {
      setError("Failed to load tenants.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
    fetch("/api/super-admin/plans")
      .then((r) => r.json())
      .then((d) => setPlans(d.plans ?? []))
      .catch(() => {});
  }, [fetchTenants]);

  async function viewTenantDetail(tenant: Tenant) {
    setSelectedTenant(tenant);
    setEditName(tenant.name);
    setEditIndustry(tenant.industry);
    setEditSize(tenant.size);
    setEditSeats(String(tenant.seat_count ?? 5));
    setEditPlanId(tenant.subscription_plan_id ?? "");
    try {
      const res = await fetch(`/api/super-admin/tenants/${tenant.id}`);
      const data = await res.json();
      setTenantDetail(data);
    } catch {
      setTenantDetail(null);
    }
  }

  async function createTenant() {
    if (!newName) return;
    setCreating(true);
    try {
      const res = await fetch("/api/super-admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          industry: newIndustry,
          size: newSize,
          seat_count: parseInt(newSeats) || 5,
          subscription_plan_id: newPlanId || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to create tenant");
        return;
      }
      setCreateOpen(false);
      setNewName("");
      setNewIndustry("");
      setNewSize("");
      setNewSeats("5");
      setNewPlanId("");
      fetchTenants();
    } catch {
      toast.error("Failed to create tenant");
    } finally {
      setCreating(false);
    }
  }

  async function saveTenantEdits() {
    if (!selectedTenant) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/super-admin/tenants/${selectedTenant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          industry: editIndustry,
          size: editSize,
          seat_count: parseInt(editSeats) || 5,
          subscription_plan_id: editPlanId || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to save");
        return;
      }
      fetchTenants();
      setSelectedTenant({ ...selectedTenant, name: editName, industry: editIndustry, size: editSize, seat_count: parseInt(editSeats) || 5, subscription_plan_id: editPlanId || null });
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function tenantAction(action: "suspend" | "activate") {
    if (!selectedTenant) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/super-admin/tenants/${selectedTenant.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const newStatus = action === "suspend" ? "canceled" : "active";
        setSelectedTenant({ ...selectedTenant, subscription_status: newStatus });
        fetchTenants();
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Access Denied</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  /* ───── Tenant Detail View ───── */
  if (selectedTenant && tenantDetail) {
    const currentStatus = selectedTenant.subscription_status || "trialing";
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => { setSelectedTenant(null); setTenantDetail(null); }}
          className="mb-6 text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to all tenants
        </button>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="mb-1">{selectedTenant.name}</h1>
            <p className="text-sm text-muted-foreground">
              {selectedTenant.industry} &middot; {selectedTenant.size} employees
            </p>
          </div>
          <Badge className={statusColor[currentStatus] ?? statusColor.incomplete}>
            {currentStatus}
          </Badge>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Users</p>
            <p className="mt-1 text-2xl font-bold">{selectedTenant.user_count}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Assessments</p>
            <p className="mt-1 text-2xl font-bold">{selectedTenant.assessment_count}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Links</p>
            <p className="mt-1 text-2xl font-bold">{selectedTenant.link_count}</p>
          </div>
        </div>

        {/* Edit tenant */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold">Tenant Settings</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={editIndustry} onChange={(e) => setEditIndustry(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Size</Label>
              <Input value={editSize} onChange={(e) => setEditSize(e.target.value)} placeholder="e.g. 50-100" />
            </div>
            <div className="space-y-2">
              <Label>Seats</Label>
              <Input type="number" value={editSeats} onChange={(e) => setEditSeats(e.target.value)} min="1" />
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={editPlanId || "none"} onValueChange={(v) => setEditPlanId(v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="No plan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No plan</SelectItem>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.currency} {p.price_per_seat}/seat)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={saveTenantEdits} disabled={saving} className="bg-brand text-brand-foreground hover:bg-brand/90">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            {currentStatus !== "canceled" ? (
              <Button variant="outline" onClick={() => tenantAction("suspend")} disabled={actionLoading} className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                <PowerOff className="mr-1.5 h-3.5 w-3.5" />
                Suspend
              </Button>
            ) : (
              <Button variant="outline" onClick={() => tenantAction("activate")} disabled={actionLoading} className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10">
                <Power className="mr-1.5 h-3.5 w-3.5" />
                Activate
              </Button>
            )}
          </div>
        </div>

        {/* Users */}
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold">Users ({tenantDetail.users.length})</h2>
          {tenantDetail.users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users yet.</p>
          ) : (
            <div className="space-y-2">
              {tenantDetail.users.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div>
                    <p className="text-sm font-medium">{u.name || u.email}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Badge variant="secondary" className={u.role === "admin" ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}>
                    {u.role}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold">Assessment Links ({tenantDetail.links.length})</h2>
          {tenantDetail.links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links created.</p>
          ) : (
            <div className="space-y-2">
              {tenantDetail.links.map((l) => (
                <div key={l.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div>
                    <p className="text-sm font-medium">{l.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">/assess/{l.token}</p>
                  </div>
                  <Badge variant="secondary" className={l.active ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}>
                    {l.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assessments */}
        <div>
          <h2 className="mb-4 text-sm font-semibold">Assessments ({tenantDetail.assessments.length})</h2>
          {tenantDetail.assessments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assessments.</p>
          ) : (
            <div className="space-y-2">
              {tenantDetail.assessments.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary">{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  /* ───── Tenant List View ───── */
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <h1 className="mb-1">Platform Administration</h1>
          <p className="text-sm text-muted-foreground">
            Manage all tenants across the AIOPSOS platform.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Create Tenant
        </Button>
      </motion.div>

      <motion.div variants={item} className="mt-4 mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
        <Shield className="h-3 w-3" />
        Super Admin
      </motion.div>

      {/* Stat cards */}
      {stats && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" /> Tenants
            </div>
            <p className="mt-2 text-2xl font-bold">{stats.total_tenants}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" /> Active Subs
            </div>
            <p className="mt-2 text-2xl font-bold">{stats.active_subscriptions}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> Total Users
            </div>
            <p className="mt-2 text-2xl font-bold">{stats.total_users}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Armchair className="h-3.5 w-3.5" /> Total Seats
            </div>
            <p className="mt-2 text-2xl font-bold">{stats.total_seats}</p>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {tenants.map((tenant) => {
            const tStatus = tenant.subscription_status || "trialing";
            return (
              <button
                key={tenant.id}
                onClick={() => viewTenantDetail(tenant)}
                className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-brand/20"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{tenant.name}</h3>
                      <Badge className={`text-[10px] ${statusColor[tStatus] ?? statusColor.incomplete}`}>
                        {tStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tenant.industry} &middot; {tenant.size}
                    </p>
                    <div className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />{tenant.user_count} users
                      </span>
                      <span className="flex items-center gap-1">
                        <BrainCircuit className="h-3 w-3" />{tenant.assessment_count} assessments
                      </span>
                      <span className="flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />{tenant.link_count} links
                      </span>
                      <span className="flex items-center gap-1">
                        <Armchair className="h-3 w-3" />{tenant.seat_count ?? 0} seats
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </button>
            );
          })}

          {tenants.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
              <Building2 className="mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="mb-1 text-sm font-semibold">No tenants yet</h3>
              <p className="text-sm text-muted-foreground">
                Click &quot;Create Tenant&quot; to add the first organisation.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Create Tenant Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Tenant</DialogTitle>
            <DialogDescription>Add a new organisation to the platform.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Organisation Name *</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Acme Inc." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input value={newIndustry} onChange={(e) => setNewIndustry(e.target.value)} placeholder="Technology" />
              </div>
              <div className="space-y-2">
                <Label>Size</Label>
                <Input value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="50-100" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Seats</Label>
                <Input type="number" value={newSeats} onChange={(e) => setNewSeats(e.target.value)} min="1" />
              </div>
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={newPlanId} onValueChange={setNewPlanId}>
                  <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
                  <SelectContent>
                    {plans.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.currency} {p.price_per_seat}/seat)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={createTenant} disabled={creating || !newName} className="bg-brand text-brand-foreground hover:bg-brand/90">
              {creating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
