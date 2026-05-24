"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { isNavItemActive, mainNavItems } from "@/lib/navigation";

type NavItemsProps = {
  onNavigate?: () => void;
  className?: string;
};

export function NavItems({ onNavigate, className }: NavItemsProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)} aria-label="Main">
      {mainNavItems.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
