import {
  LayoutDashboard,
  Package,
  ScrollText,
  Webhook,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Launch overview and metrics",
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
    description: "Catalog and launch pipeline",
  },
  {
    title: "Webhook Tester",
    href: "/webhook-tester",
    icon: Webhook,
    description: "Simulate integration callbacks",
  },
  {
    title: "Audit Log",
    href: "/audit-log",
    icon: ScrollText,
    description: "Activity and change history",
  },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
