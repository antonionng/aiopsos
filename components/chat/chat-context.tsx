"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Project } from "@/lib/types";

export interface ChatSession {
  id: string;
  title: string;
  model: string;
  timestamp: Date;
  folder?: string;
  pinned: boolean;
  project_id?: string | null;
}

interface ChatContextValue {
  sessions: ChatSession[];
  activeSession: string | null;
  projects: Project[];
  activeProjectFilter: string | null;
  setActiveProjectFilter: (id: string | null) => void;
  selectSession: (id: string) => void;
  createNewChat: (projectId?: string | null) => void;
  deleteSession: (id: string) => void;
  togglePin: (id: string) => void;
  setFolder: (id: string, folder: string) => void;
  updateSessionTitle: (id: string, title: string) => void;
  onConversationCreated: (session: ChatSession) => void;
  refreshSessions: () => void;
  refreshProjects: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectFilter, setActiveProjectFilter] = useState<
    string | null
  >(null);
  const [loaded, setLoaded] = useState(false);

  const loadSessions = useCallback(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((d) => {
        const convs: ChatSession[] = (d.conversations ?? []).map(
          (c: Record<string, unknown>) => ({
            id: c.id as string,
            title: c.title as string,
            model: c.model as string,
            timestamp: new Date(c.created_at as string),
            folder: (c.folder as string) || undefined,
            pinned: (c.pinned as boolean) ?? false,
            project_id: (c.project_id as string) || null,
          })
        );
        setSessions(convs);
        if (!loaded) {
          setLoaded(true);
        }
      })
      .catch(() => {});
  }, [loaded]);

  const loadProjects = useCallback(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadSessions();
    loadProjects();
  }, [loadSessions, loadProjects]);

  const createNewChat = useCallback(
    (projectId?: string | null) => {
      setActiveSession(null);
    },
    []
  );

  const selectSession = useCallback((id: string) => {
    setActiveSession(id);
  }, []);

  const deleteSession = useCallback(
    (id: string) => {
      fetch(`/api/conversations/${id}`, { method: "DELETE" }).catch(() => {});
      setSessions((prev) => {
        const remaining = prev.filter((s) => s.id !== id);
        if (activeSession === id) {
          setActiveSession(remaining[0]?.id ?? null);
        }
        return remaining;
      });
    },
    [activeSession]
  );

  const togglePin = useCallback((id: string) => {
    setSessions((prev) => {
      const session = prev.find((s) => s.id === id);
      if (!session) return prev;
      const newPinned = !session.pinned;
      fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: newPinned }),
      }).catch(() => {});
      return prev.map((s) =>
        s.id === id ? { ...s, pinned: newPinned } : s
      );
    });
  }, []);

  const setFolder = useCallback((id: string, folder: string) => {
    fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    }).catch(() => {});
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, folder } : s))
    );
  }, []);

  const updateSessionTitle = useCallback((id: string, title: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s))
    );
  }, []);

  const onConversationCreated = useCallback((session: ChatSession) => {
    setSessions((prev) => [session, ...prev]);
    setActiveSession(session.id);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSession,
        projects,
        activeProjectFilter,
        setActiveProjectFilter,
        selectSession,
        createNewChat,
        deleteSession,
        togglePin,
        setFolder,
        updateSessionTitle,
        onConversationCreated,
        refreshSessions: loadSessions,
        refreshProjects: loadProjects,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
