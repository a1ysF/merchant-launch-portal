import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/demo-products";

export default function ProductNotFound() {
  const sampleIds = getAllProducts()
    .slice(0, 3)
    .map((product) => product.id)
    .join(", ");

  return (
    <div className="flex flex-col items-start gap-4 py-12">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <p className="text-sm text-muted-foreground">
        No product exists for this ID in Supabase. Sample demo IDs (reference): {sampleIds}. Browse the catalog for live rows.
      </p>
      <Button asChild>
        <Link href="/products">Back to products</Link>
      </Button>
    </div>
  );
}
