"use client";

import "@/components/lms/workspace.css";
import "./learning-app.css";
import { useState } from "react";
import {
  AssistantProvider,
  AssistantButton,
  ActivityButton,
} from "@/components/lms/assistant";
import { Menu } from "lucide-react";
import { CurrentOrgProvider } from "@/components/layout/current-org-context";
import { Sidebar } from "@/components/layout/sidebar";
import { UserAvatarMenu } from "@/components/layout/user-avatar-menu";
import { TrialBanner } from "@/components/trial-banner";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function ControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <CurrentOrgProvider>
      <AssistantProvider>
        <div className="learning-app flex min-h-screen">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          <main className="min-w-0 flex-1 lg:pl-[240px]">
            <header className="learning-app-toolbar sticky top-0 z-30 flex h-14 items-center justify-between px-4 sm:px-8 lg:px-16">
              {/* Mobile hamburger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    aria-label="Open navigation"
                    className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Sidebar onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>
              <div className="flex-1" />
              <div className="mr-4 flex items-center gap-3">
                <ActivityButton />
                <AssistantButton />
              </div>
              <UserAvatarMenu />
            </header>
            <div className="mx-auto max-w-[1600px] px-2 pb-8 sm:px-4 lg:px-6 lg:pb-10">
              <TrialBanner />
              {children}
            </div>
          </main>
        </div>
      </AssistantProvider>
    </CurrentOrgProvider>
  );
}
