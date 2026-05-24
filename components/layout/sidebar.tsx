import { Rocket } from "lucide-react";
import Link from "next/link";

import { NavItems } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ className, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Rocket className="size-4" aria-hidden />
          </span>
          <span className="text-sm leading-tight">
            Merchant Launch
            <span className="block text-xs font-normal text-sidebar-foreground/70">
              Integration Portal
            </span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
          Navigation
        </p>
        <NavItems onNavigate={onNavigate} />
      </div>

      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/60">
          Portfolio demo — no auth or backend wired yet.
        </p>
      </div>
    </aside>
  );
}
