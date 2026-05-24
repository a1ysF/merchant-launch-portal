import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-12">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <p className="text-sm text-muted-foreground">
        Try a demo ID: prod_001, prod_002, or prod_003.
      </p>
      <Button asChild>
        <Link href="/products">Back to products</Link>
      </Button>
    </div>
  );
}
