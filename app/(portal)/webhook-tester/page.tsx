import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { ProductsLoadError } from "@/components/products/products-load-error";
import { WebhookTestHistory } from "@/components/webhook/webhook-test-history";
import { WebhookTesterPanel } from "@/components/webhook/webhook-tester-panel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProducts } from "@/lib/products";
import { getWebhookTestLogs } from "@/lib/webhook-tests";
import type { Product } from "@/types/product";
import type { WebhookTestLog } from "@/types/webhook";

type WebhookTesterPageProps = {
  searchParams: Promise<{ productId?: string }>;
};

export default async function WebhookTesterPage({
  searchParams,
}: WebhookTesterPageProps) {
  const { productId: queryProductId } = await searchParams;
  let products: Product[] = [];
  let logs: WebhookTestLog[] = [];
  let loadError: string | null = null;

  try {
    [products, logs] = await Promise.all([getProducts(), getWebhookTestLogs()]);
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "An unexpected error occurred.";
  }

  const initialProductId =
    queryProductId && products.some((product) => product.id === queryProductId)
      ? queryProductId
      : products[0]?.id;

  return (
    <>
      <PageHeader
        title="Webhook Tester"
        description="Simulate merchant integration callbacks before going live."
      />

      {loadError ? (
        <ProductsLoadError title="Could not load webhook tester" message={loadError} />
      ) : null}

      {!loadError && products.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No products available</CardTitle>
            <CardDescription>
              Create a product in the catalog before running webhook simulations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/products/new">Create product</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!loadError && products.length > 0 ? (
        <>
          <WebhookTesterPanel
            products={products}
            initialProductId={initialProductId}
          />
          <WebhookTestHistory logs={logs} />
        </>
      ) : null}
    </>
  );
}
