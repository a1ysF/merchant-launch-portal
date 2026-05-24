"use client";

import { Bell, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type HeaderProps = {
  onMenuClick?: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </Button>

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products, SKUs, merchants…"
          className="h-9 pl-9"
          disabled
          aria-label="Search (coming soon)"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          aria-label="Notifications (placeholder)"
          disabled
        >
          <Bell className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                ML
              </span>
              <span className="hidden sm:inline">Demo User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Profile (soon)</DropdownMenuItem>
            <DropdownMenuItem disabled>Settings (soon)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
