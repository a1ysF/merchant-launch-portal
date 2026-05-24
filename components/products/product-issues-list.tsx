import { AlertCircle, AlertTriangle, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProductIssue } from "@/types/product";

const severityConfig = {
  low: {
    icon: Info,
    className: "text-muted-foreground",
    label: "Low",
  },
  medium: {
    icon: AlertTriangle,
    className: "text-amber-400",
    label: "Medium",
  },
  high: {
    icon: AlertCircle,
    className: "text-red-400",
    label: "High",
  },
} as const;

type ProductIssuesListProps = {
  issues: ProductIssue[];
  className?: string;
};

export function ProductIssuesList({ issues, className }: ProductIssuesListProps) {
  if (issues.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        No open issues — product is clear for launch checks.
      </p>
    );
  }

  return (
    <ul className={cn("space-y-3", className)}>
      {issues.map((issue) => {
        const config = severityConfig[issue.severity];
        const Icon = config.icon;

        return (
          <li
            key={issue.id}
            className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5"
          >
            <Icon className={cn("mt-0.5 size-4 shrink-0", config.className)} aria-hidden />
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm">{issue.message}</p>
              <p className="text-xs text-muted-foreground">{config.label} priority</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
