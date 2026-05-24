import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  PRODUCT_STATUS_LABELS,
  type ProductStatus,
} from "@/types/product";

const statusVariant: Record<
  ProductStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "secondary",
  review: "outline",
  staging: "default",
  live: "secondary",
  blocked: "destructive",
};

type ProductStatusBadgeProps = {
  status: ProductStatus;
  className?: string;
};

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  return (
    <Badge
      variant={statusVariant[status]}
      className={cn(
        status === "live" && "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
        className
      )}
    >
      {PRODUCT_STATUS_LABELS[status]}
    </Badge>
  );
}
