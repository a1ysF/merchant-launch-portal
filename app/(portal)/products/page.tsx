import Link from "next/link";
import { Plus } from "lucide-react";

import { ProductsCatalog } from "@/components/products/products-catalog";
import { ProductsLoadError } from "@/components/products/products-load-error";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProducts } from "@/lib/products";
import type { Product } from "@/types/product";

export default async function ProductsPage() {
  let products: Product[] = [];
  let loadError: string | null = null;

  try {
    products = await getProducts();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "An unexpected error occurred.";
  }

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage catalog SKUs and track launch readiness across games."
        actions={
          <Button asChild>
            <Link href="/products/new">
              <Plus data-icon="inline-start" />
              New product
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Catalog</CardTitle>
          <CardDescription>
            Product data loaded from Supabase. Writes will be added in a later phase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadError ? <ProductsLoadError message={loadError} /> : null}
          {!loadError ? <ProductsCatalog products={products} /> : null}
        </CardContent>
      </Card>
    </>
  );
}
