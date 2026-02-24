"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Trash2,
  Pin,
  PinOff,
  FolderPlus,
  X,
  FolderKanban,
  ChevronRight,
  Settings2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  useChatContext,
  type ChatSession,
} from "@/components/chat/chat-context";
import type { Project } from "@/lib/types";

export type { ChatSession };

interface SearchResult {
  conversation_id: string;
  title: string;
  snippet: string;
  role: string;
}

interface ConversationSidebarProps {
  open: boolean;
  onClose: () => void;
  onOpenProjectDialog?: (project?: Project) => void;
}

export function ConversationSidebar({
  open,
  onClose,
  onOpenProjectDialog,
}: ConversationSidebarProps) {
  const {
    sessions,
    activeSession,
    projects,
    activeProjectFilter,
    setActiveProjectFilter,
    selectSession: onSelectSession,
    createNewChat,
    deleteSession: onDeleteSession,
    togglePin: onTogglePin,
    setFolder: onSetFolder,
  } = useChatContext();

  const [newFolder, setNewFolder] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback((q: string) => {
    if (q.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    fetch(`/api/conversations/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => setSearchResults(d.results ?? []))
      .catch(() => setSearchResults([]))
      .finally(() => setIsSearching(false));
  }, []);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    searchTimerRef.current = setTimeout(() => doSearch(searchQuery), 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery, doSearch]);

  const showingSearch = searchQuery.trim().length >= 2;

  const filteredSessions = activeProjectFilter
    ? sessions.filter((s) => s.project_id === activeProjectFilter)
    : sessions;

  const pinnedSessions = filteredSessions.filter((s) => s.pinned);
  const folders = [
    ...new Set(
      filteredSessions.filter((s) => s.folder).map((s) => s.folder!)
    ),
  ];
  const unfolderedSessions = filteredSessions.filter(
    (s) => !s.pinned && !s.folder
  );

  function toggleProjectExpand(id: string) {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleNewChat() {
    createNewChat(activeProjectFilter);
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-border bg-sidebar md:relative md:z-auto"
          >
            <div className="flex items-center justify-between border-b border-border p-3">
              <span className="text-xs font-medium text-muted-foreground">
                Conversations
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShowFolderInput(!showFolderInput)}
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleNewChat}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 md:hidden"
                  onClick={onClose}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Search input */}
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="h-7 pl-7 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {showFolderInput && (
              <div className="border-b border-border p-2">
                <Input
                  placeholder="Folder name"
                  className="h-7 text-xs"
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newFolder && activeSession) {
                      onSetFolder(activeSession, newFolder);
                      setNewFolder("");
                      setShowFolderInput(false);
                    }
                  }}
                />
              </div>
            )}

            <ScrollArea className="flex-1">
              <div className="p-2">
                {/* Search results mode */}
                {showingSearch ? (
                  <div>
                    <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {isSearching
                        ? "Searching..."
                        : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`}
                    </p>
                    {searchResults.length === 0 && !isSearching && (
                      <p className="px-2 py-4 text-xs text-muted-foreground text-center">
                        No conversations found
                      </p>
                    )}
                    <div className="space-y-0.5">
                      {searchResults.map((r) => (
                        <button
                          key={r.conversation_id}
                          onClick={() => {
                            onSelectSession(r.conversation_id);
                            setSearchQuery("");
                          }}
                          className={`flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors ${
                            activeSession === r.conversation_id
                              ? "bg-accent text-foreground"
                              : "text-muted-foreground hover:bg-accent/50"
                          }`}
                        >
                          <span className="text-sm font-medium truncate">
                            {r.title}
                          </span>
                          <span className="text-[11px] text-muted-foreground line-clamp-2">
                            {r.snippet}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Projects section */}
                    {projects.length > 0 && (
                      <div className="mb-3">
                        <div className="mb-1 flex items-center justify-between px-2">
                          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Projects
                          </p>
                          {onOpenProjectDialog && (
                            <button
                              onClick={() => onOpenProjectDialog()}
                              className="flex h-4 w-4 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        {/* All conversations filter */}
                        <button
                          onClick={() => setActiveProjectFilter(null)}
                          className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs transition-colors ${
                            !activeProjectFilter
                              ? "bg-accent text-foreground"
                              : "text-muted-foreground hover:bg-accent/50"
                          }`}
                        >
                          <MessageSquare className="h-3 w-3 shrink-0" />
                          All conversations
                        </button>

                        {projects.map((project) => {
                          const isExpanded = expandedProjects.has(project.id);
                          const isActive = activeProjectFilter === project.id;
                          const projectConvs = sessions.filter(
                            (s) => s.project_id === project.id
                          );

                          return (
                            <div key={project.id}>
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                  setActiveProjectFilter(project.id);
                                  toggleProjectExpand(project.id);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setActiveProjectFilter(project.id);
                                    toggleProjectExpand(project.id);
                                  }
                                }}
                                className={`group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs transition-colors ${
                                  isActive
                                    ? "bg-accent text-foreground"
                                    : "text-muted-foreground hover:bg-accent/50"
                                }`}
                              >
                                <span
                                  className="h-2 w-2 shrink-0 rounded-full"
                                  style={{ backgroundColor: project.color }}
                                />
                                <FolderKanban className="h-3 w-3 shrink-0" />
                                <span className="flex-1 truncate">
                                  {project.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {projectConvs.length}
                                </span>
                                <ChevronRight
                                  className={`h-3 w-3 shrink-0 transition-transform ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                />
                                {onOpenProjectDialog && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenProjectDialog(project);
                                    }}
                                    className="hidden h-4 w-4 items-center justify-center rounded text-muted-foreground hover:text-foreground group-hover:flex"
                                  >
                                    <Settings2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>

                              {isExpanded && projectConvs.length > 0 && (
                                <div className="ml-4 space-y-0.5 border-l border-border pl-2">
                                  {projectConvs.map((s) => (
                                    <SessionItem
                                      key={s.id}
                                      session={s}
                                      active={activeSession === s.id}
                                      onSelect={() => onSelectSession(s.id)}
                                      onDelete={() => onDeleteSession(s.id)}
                                      onTogglePin={() => onTogglePin(s.id)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* New project button when no projects exist */}
                    {projects.length === 0 && onOpenProjectDialog && (
                      <button
                        onClick={() => onOpenProjectDialog()}
                        className="mb-3 flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-brand/30 hover:text-foreground"
                      >
                        <FolderKanban className="h-3.5 w-3.5" />
                        Create a project
                      </button>
                    )}

                    {/* Pinned conversations */}
                    {pinnedSessions.length > 0 && (
                      <div className="mb-3">
                        <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Pinned
                        </p>
                        <div className="space-y-0.5">
                          {pinnedSessions.map((s) => (
                            <SessionItem
                              key={s.id}
                              session={s}
                              active={activeSession === s.id}
                              onSelect={() => onSelectSession(s.id)}
                              onDelete={() => onDeleteSession(s.id)}
                              onTogglePin={() => onTogglePin(s.id)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Folder groups */}
                    {folders.map((folder) => {
                      const folderSessions = filteredSessions.filter(
                        (s) => s.folder === folder && !s.pinned
                      );
                      if (folderSessions.length === 0) return null;
                      return (
                        <div key={folder} className="mb-3">
                          <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {folder}
                          </p>
                          <div className="space-y-0.5">
                            {folderSessions.map((s) => (
                              <SessionItem
                                key={s.id}
                                session={s}
                                active={activeSession === s.id}
                                onSelect={() => onSelectSession(s.id)}
                                onDelete={() => onDeleteSession(s.id)}
                                onTogglePin={() => onTogglePin(s.id)}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Unfoldered conversations */}
                    <div className="space-y-0.5">
                      {unfolderedSessions.map((s) => (
                        <SessionItem
                          key={s.id}
                          session={s}
                          active={activeSession === s.id}
                          onSelect={() => onSelectSession(s.id)}
                          onDelete={() => onDeleteSession(s.id)}
                          onTogglePin={() => onTogglePin(s.id)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SessionItem({
  session,
  active,
  onSelect,
  onDelete,
  onTogglePin,
}: {
  session: ChatSession;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/50"
      }`}
    >
      {session.pinned ? (
        <Pin className="h-3 w-3 shrink-0 text-amber-500" />
      ) : (
        <MessageSquare className="h-3.5 w-3.5 shrink-0" />
      )}
      <span className="flex-1 truncate">{session.title}</span>
      <div className="hidden items-center gap-0.5 group-hover:flex">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-amber-500"
        >
          {session.pinned ? (
            <PinOff className="h-3 w-3" />
          ) : (
            <Pin className="h-3 w-3" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
