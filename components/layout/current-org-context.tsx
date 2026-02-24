"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type CurrentOrgContextValue = {
  currentOrgId: string | null;
  setCurrentOrgId: (id: string | null) => void;
};

const CurrentOrgContext = createContext<CurrentOrgContextValue | null>(null);

export function CurrentOrgProvider({ children }: { children: ReactNode }) {
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const value: CurrentOrgContextValue = {
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
