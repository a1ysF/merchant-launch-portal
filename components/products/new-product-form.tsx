import { createProductAction } from "@/app/(portal)/products/new/actions";
import { ProductForm } from "@/components/products/product-form";

export function NewProductForm() {
  return (
    <ProductForm
      mode="create"
      action={createProductAction}
      cancelHref="/products"
      submitLabel="Create product"
      pendingLabel="Creating…"
      errorTitle="Could not create product"
      description="Create a new SKU in Supabase. Readiness score is calculated automatically."
    />
  );
}
