"use client";

import { useState } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex">
        <Sidebar className="fixed inset-y-0 left-0 z-40" />
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <Sidebar
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        onNavigate={() => setMobileOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
