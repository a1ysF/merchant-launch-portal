import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const demoProducts: Record<
  string,
  { name: string; sku: string; status: string; description: string }
> = {
  prod_001: {
    name: "Starter Pack DLC",
    sku: "SP-DLC-01",
    status: "Live",
    description: "Entry-level DLC package for new players.",
  },
  prod_002: {
    name: "Season Pass — Q3",
    sku: "SS-Q3-2026",
    status: "Review",
    description: "Quarterly battle pass with tiered rewards.",
  },
  prod_003: {
    name: "Founder Bundle",
    sku: "FB-FOUNDER",
    status: "Staging",
    description: "Limited founder edition with exclusive cosmetics.",
  },
};

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = demoProducts[id];

  if (!product) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={product.name}
        description={`Product ID: ${id}`}
        actions={
          <Button variant="outline" asChild>
            <Link href="/products">Back to catalog</Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{product.status}</Badge>
        <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Core product metadata (mock).</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {product.description}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Regional price points will live here.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Connect backend to manage currencies and price tiers.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Webhooks and platform mappings.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Use the{" "}
              <Link href="/webhook-tester" className="text-primary underline-offset-4 hover:underline">
                Webhook Tester
              </Link>{" "}
              to simulate callbacks during development.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
