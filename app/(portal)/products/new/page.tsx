import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { NewProductForm } from "@/components/products/new-product-form";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  return (
    <>
      <PageHeader
        title="New product"
        description="Define a new SKU for catalog and launch configuration."
        actions={
          <Button variant="outline" asChild>
            <Link href="/products">Back to catalog</Link>
          </Button>
        }
      />

      <NewProductForm />
    </>
  );
}
