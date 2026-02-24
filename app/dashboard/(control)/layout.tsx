"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { CurrentOrgProvider } from "@/components/layout/current-org-context";
import { Sidebar } from "@/components/layout/sidebar";
import { UserAvatarMenu } from "@/components/layout/user-avatar-menu";
import { TrialBanner } from "@/components/trial-banner";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <CurrentOrgProvider>
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 md:pl-[260px] transition-[padding] duration-200">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 sm:px-8 lg:px-16">
            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="md:hidden" />
            <UserAvatarMenu />
          </header>
          <div className="mx-auto max-w-[1200px] px-4 pb-8 sm:px-8 lg:px-16 lg:pb-10">
            <TrialBanner />
            {children}
          </div>
        </main>
      </div>
    </CurrentOrgProvider>
  );
}
