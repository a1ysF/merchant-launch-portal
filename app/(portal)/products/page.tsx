import Link from "next/link";
import { Plus } from "lucide-react";

import { ProductsCatalog } from "@/components/products/products-catalog";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllProducts } from "@/lib/demo-products";

export default function ProductsPage() {
  const products = getAllProducts();

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
            Demo data in-memory — Supabase persistence will be added in a later phase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsCatalog products={products} />
        </CardContent>
      </Card>
    </>
  );
}
