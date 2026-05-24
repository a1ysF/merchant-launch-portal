import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { ProductIssuesList } from "@/components/products/product-issues-list";
import { ProductsLoadError } from "@/components/products/products-load-error";
import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { ProductTypeBadge } from "@/components/products/product-type-badge";
import { ReadinessProgress } from "@/components/products/readiness-progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductById, getProductIssues } from "@/lib/products";
import { formatProductPrice } from "@/types/product";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  let product;
  let loadError: string | null = null;

  try {
    product = await getProductById(id);

    if (product) {
      const issues = await getProductIssues(id);
      product = { ...product, issues };
    }
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    product = null;
  }

  if (loadError) {
    return (
      <>
        <PageHeader
          title="Product"
          description="Unable to load product details."
          actions={
            <Button variant="outline" asChild>
              <Link href="/products">Back to catalog</Link>
            </Button>
          }
        />
        <ProductsLoadError message={loadError} />
      </>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={product.title}
        description={`${product.gameTitle} · ${product.sku}`}
        actions={
          <Button variant="outline" asChild>
            <Link href="/products">Back to catalog</Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <ProductStatusBadge status={product.status} />
        <ProductTypeBadge productType={product.productType} />
        <span className="text-sm text-muted-foreground">
          Created {formatDate(product.createdAt)}
        </span>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Launch readiness</CardTitle>
            <CardDescription>
              Score reflects setup completeness before go-live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReadinessProgress score={product.readinessScore} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold tabular-nums">
              {formatProductPrice(product.price, product.currency)}
            </p>
            <p className="text-sm text-muted-foreground">Region: {product.region}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="issues">
            Issues
            {product.issues.length > 0 ? ` (${product.issues.length})` : ""}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product overview</CardTitle>
                <CardDescription>Core catalog identifiers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Game</span>
                  <span className="text-right font-medium">{product.gameTitle}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Product name</span>
                  <span className="text-right font-medium">{product.title}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-mono text-right text-xs">{product.sku}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Type</span>
                  <ProductTypeBadge productType={product.productType} />
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Product ID</span>
                  <span className="font-mono text-right text-xs">{product.id}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SKU and pricing</CardTitle>
                <CardDescription>Storefront-facing commercial details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">List price</span>
                  <span className="font-medium tabular-nums">
                    {formatProductPrice(product.price, product.currency)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Currency</span>
                  <span>{product.currency}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Region</span>
                  <span>{product.region}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Status</span>
                  <ProductStatusBadge status={product.status} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Integration setup</CardTitle>
              <CardDescription>
                Webhook and support contacts for merchant launch workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Webhook URL</p>
                {product.webhookUrl ? (
                  <p className="break-all font-mono text-xs">{product.webhookUrl}</p>
                ) : (
                  <p className="text-amber-400">Not configured</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Support email</p>
                <p>{product.supportEmail}</p>
              </div>
              <p className="text-muted-foreground">
                Test callbacks in the{" "}
                <Link
                  href="/webhook-tester"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Webhook Tester
                </Link>{" "}
                (simulation only — no live requests).
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>Setup issues</CardTitle>
              <CardDescription>
                Blockers and warnings to resolve before launch approval.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductIssuesList issues={product.issues} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
