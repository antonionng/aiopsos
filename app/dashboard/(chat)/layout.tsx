"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatarMenu } from "@/components/layout/user-avatar-menu";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { ChatProvider, useChatContext } from "@/components/chat/chat-context";
import { ProjectDialog } from "@/components/chat/project-dialog";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";

function ChatLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { createNewChat, refreshProjects } = useChatContext();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkRole() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsSuperAdmin(false); return; }
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      setIsSuperAdmin(profile?.role === "super_admin");
    }
    checkRole();
  }, []);

  const handleOpenProjectDialog = useCallback((project?: Project) => {
    setEditingProject(project ?? null);
    setProjectDialogOpen(true);
  }, []);

  const handleProjectSaved = useCallback(() => {
    refreshProjects();
  }, [refreshProjects]);

  if (isSuperAdmin === false) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
            <Image src="/logo.png" alt="AIOPSOS" width={80} height={32} className="h-7 w-auto" unoptimized />
            <UserAvatarMenu />
          </header>
          <main className="flex flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {isSuperAdmin && (
        <ConversationSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenProjectDialog={handleOpenProjectDialog}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            {isSuperAdmin && !sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            {isSuperAdmin && !sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => createNewChat()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            {isSuperAdmin && sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSidebarOpen(false)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <Image src="/logo.png" alt="AIOPSOS" width={80} height={32} className="h-7 w-auto" unoptimized />
          </div>

          <UserAvatarMenu />
        </header>

        <main className="flex flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>

      {isSuperAdmin && (
        <ProjectDialog
          open={projectDialogOpen}
          onClose={() => setProjectDialogOpen(false)}
          project={editingProject}
          onSaved={handleProjectSaved}
        />
      )}
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
