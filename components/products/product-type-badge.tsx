import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProductType } from "@/types/product";

type ProductTypeBadgeProps = {
  productType: ProductType;
  className?: string;
};

export function ProductTypeBadge({ productType, className }: ProductTypeBadgeProps) {
  return (
    <Badge variant="outline" className={cn("font-normal", className)}>
      {productType}
    </Badge>
  );
}
