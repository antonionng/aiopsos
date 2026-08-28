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
  /** Last failed background mutation, for the surface to show. */
  mutationError: string | null;
  clearMutationError: () => void;
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
  const [mutationError, setMutationError] = useState<string | null>(null);

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
      .catch(() => setMutationError("Could not load your conversations."));
  }, [loaded]);

  const loadProjects = useCallback(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []))
      .catch(() => setMutationError("Could not load your projects."));
  }, []);

  useEffect(() => {
    loadSessions();
    loadProjects();
  }, [loadSessions, loadProjects]);

  const createNewChat = useCallback((projectId?: string | null) => {
    setActiveSession(null);
    // The argument used to be accepted and discarded, so "new chat" from
    // inside a project silently landed outside it whenever the sidebar's
    // filter was not already set.
    if (projectId !== undefined) setActiveProjectFilter(projectId);
  }, []);

  const selectSession = useCallback((id: string) => {
    setActiveSession(id);
  }, []);

  const deleteSession = useCallback(
    (id: string) => {
      // Optimistic, but restored if the server refuses - it used to disappear
      // from the sidebar and quietly reappear on the next load.
      let snapshot: ChatSession[] = [];
      setSessions((prev) => {
        snapshot = prev;
        const remaining = prev.filter((s) => s.id !== id);
        if (activeSession === id) setActiveSession(remaining[0]?.id ?? null);
        return remaining;
      });

      fetch(`/api/conversations/${id}`, { method: "DELETE" })
        .then((r) => {
          if (r.ok) return;
          setSessions(snapshot);
          setMutationError("Could not delete that conversation.");
        })
        .catch(() => {
          setSessions(snapshot);
          setMutationError("Could not delete that conversation.");
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
      })
        .then((r) => {
          if (r.ok) return;
          throw new Error("pin failed");
        })
        .catch(() => {
          setSessions((cur) =>
            cur.map((s) => (s.id === id ? { ...s, pinned: !newPinned } : s))
          );
          setMutationError("Could not update that conversation.");
        });
      return prev.map((s) =>
        s.id === id ? { ...s, pinned: newPinned } : s
      );
    });
  }, []);

  const setFolder = useCallback((id: string, folder: string) => {
    let previous: string | undefined;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        previous = s.folder;
        return { ...s, folder };
      })
    );

    fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    })
      .then((r) => {
        if (r.ok) return;
        throw new Error("folder failed");
      })
      .catch(() => {
        setSessions((cur) =>
          cur.map((s) => (s.id === id ? { ...s, folder: previous } : s))
        );
        setMutationError("Could not move that conversation.");
      });
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
        mutationError,
        clearMutationError: () => setMutationError(null),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
