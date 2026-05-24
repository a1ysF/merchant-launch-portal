import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProductAction } from "@/app/(portal)/products/[id]/edit/actions";
import { PageHeader } from "@/components/layout/page-header";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/products";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const boundUpdateAction = updateProductAction.bind(null, id);

  return (
    <>
      <PageHeader
        title="Edit product"
        description={`${product.title} · ${product.sku}`}
        actions={
          <Button variant="outline" asChild>
            <Link href={`/products/${id}`}>Cancel</Link>
          </Button>
        }
      />

      <ProductForm
        mode="edit"
        product={product}
        action={boundUpdateAction}
        cancelHref={`/products/${id}`}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        errorTitle="Could not update product"
        description="Update catalog fields in Supabase. Readiness score is recalculated on save."
      />
    </>
  );
}
