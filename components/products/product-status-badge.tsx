import {
  Ban,
  CheckCircle2,
  Eye,
  FilePenLine,
  Rocket,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  PRODUCT_STATUS_LABELS,
  type ProductStatus,
} from "@/types/product";

const statusConfig: Record<
  ProductStatus,
  { icon: LucideIcon; className: string }
> = {
  live: {
    icon: CheckCircle2,
    className: "border-emerald-500/35 bg-emerald-500/12 text-emerald-400",
  },
  draft: {
    icon: FilePenLine,
    className: "border-border/80 bg-muted/50 text-muted-foreground",
  },
  review: {
    icon: Eye,
    className: "border-amber-500/35 bg-amber-500/12 text-amber-400",
  },
  staging: {
    icon: Rocket,
    className: "border-violet-500/35 bg-violet-500/12 text-violet-400",
  },
  blocked: {
    icon: Ban,
    className: "border-red-500/35 bg-red-500/12 text-red-400",
  },
};

type ProductStatusBadgeProps = {
  status: ProductStatus;
  className?: string;
};

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium", config.className, className)}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {PRODUCT_STATUS_LABELS[status]}
    </Badge>
  );
}
