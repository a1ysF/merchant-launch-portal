import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const demoProducts = [
  { id: "prod_001", name: "Starter Pack DLC", sku: "SP-DLC-01", status: "Live" },
  { id: "prod_002", name: "Season Pass — Q3", sku: "SS-Q3-2026", status: "Review" },
  { id: "prod_003", name: "Founder Bundle", sku: "FB-FOUNDER", status: "Staging" },
];

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Products"
        description="Manage catalog items and track launch readiness."
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
            Demo data only — connect Supabase later for persistence.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/products/${product.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
