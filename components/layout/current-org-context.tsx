"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

import { createClient } from "@/lib/supabase/client";

type CurrentOrgContextValue = {
  error: string;
  retry: () => void;
  role: string;
  ready: boolean;
  organisations: { id: string; name: string }[];
  currentOrgId: string | null;
  setCurrentOrgId: (id: string | null) => void;
};

const CurrentOrgContext = createContext<CurrentOrgContextValue | null>(null);

export function CurrentOrgProvider({ children }: { children: ReactNode }) {
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [identity, setIdentity] = useState({ role: "user", ready: false, organisations: [] as {id: string; name: string}[] });
  useEffect(() => {
    let active = true;
    async function load() {
      const db = createClient();
      const { data: { user } } = await db.auth.getUser();
      if (!user) throw new Error("Your session could not be loaded. Refresh the page or sign in again.");
      const { data: profile, error: profileError } = await db.from("user_profiles").select("role,org_id").eq("id", user.id).maybeSingle();
      if (profileError || !profile) throw new Error("Your workspace profile could not be loaded.");
      let query = db.from("organisations").select("id,name").order("name");
      if (profile.role !== "super_admin") query = query.eq("id", profile.org_id);
      const { data, error: orgError } = await query;
      if (orgError) throw new Error("Your organisation list could not be loaded.");
      if (active) { setLoadError(""); setCurrentOrgId(profile.org_id); setIdentity({ role: profile.role, ready: true, organisations: data || [] }); }
    }
    void load().catch((error) => { if (active) { setLoadError(error instanceof Error ? error.message : "Could not load your workspace."); setIdentity({role:"user",ready:false,organisations:[]}); setCurrentOrgId(null); } });
    return () => { active = false; };
  }, [loadAttempt]);
  const value: CurrentOrgContextValue = {
    ...identity,
    error: loadError,
    retry: useCallback(() => { setLoadError(""); setLoadAttempt(value => value + 1); }, []),
    currentOrgId,
    setCurrentOrgId: useCallback((id: string | null) => setCurrentOrgId(id), []),
  };
  return (
    <CurrentOrgContext.Provider value={value}>
      {children}
    </CurrentOrgContext.Provider>
  );
}

export function useCurrentOrgId() {
  const ctx = useContext(CurrentOrgContext);
  return ctx?.currentOrgId ?? null;
}

export function useSetCurrentOrgId() {
  const ctx = useContext(CurrentOrgContext);
  return ctx?.setCurrentOrgId ?? (() => {});
}

export function useWorkspaceIdentity() { return useContext(CurrentOrgContext); }
