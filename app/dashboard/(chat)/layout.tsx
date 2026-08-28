"use client";

import { useState, useEffect, useCallback } from "react";
import { Wordmark } from "@/components/wordmark";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatarMenu } from "@/components/layout/user-avatar-menu";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { ChatProvider, useChatContext } from "@/components/chat/chat-context";
import { ProjectDialog } from "@/components/chat/project-dialog";
import type { Project } from "@/lib/types";

// Chat is open to every signed-in member: the companions themselves are
// role-gated server-side (lib/companions.ts), so there is nothing here for
// a role check to protect. The old super_admin gate predates companions.
function ChatLayoutInner({ children }: { children: React.ReactNode }) {
  // Starts closed and opens on desktop after mount. Defaulting to open at
  // every width meant mobile loaded with the sidebar covering the chat.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) setSidebarOpen(true);
  }, []);
  const { createNewChat, refreshProjects } = useChatContext();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleOpenProjectDialog = useCallback((project?: Project) => {
    setEditingProject(project ?? null);
    setProjectDialogOpen(true);
  }, []);

  const handleProjectSaved = useCallback(() => {
    refreshProjects();
  }, [refreshProjects]);

  return (
    <div className="flex h-screen overflow-hidden">
      <ConversationSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenProjectDialog={handleOpenProjectDialog}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => createNewChat()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            {sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSidebarOpen(false)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <Wordmark size="sm" />
          </div>

          <UserAvatarMenu />
        </header>

        <main className="flex flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>

      <ProjectDialog
        open={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        project={editingProject}
        onSaved={handleProjectSaved}
      />
    </div>
  );
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <ChatLayoutInner>{children}</ChatLayoutInner>
    </ChatProvider>
  );
}
