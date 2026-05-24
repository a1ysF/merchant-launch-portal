"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { ProductTypeBadge } from "@/components/products/product-type-badge";
import { ReadinessProgress } from "@/components/products/readiness-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABELS,
  formatProductPrice,
  type Product,
  type ProductStatus,
} from "@/types/product";

type ProductsCatalogProps = {
  products: Product[];
};

export function ProductsCatalog({ products }: ProductsCatalogProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      const matchesSearch =
        query.length === 0 ||
        product.title.toLowerCase().includes(query) ||
        product.gameTitle.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [products, search, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          placeholder="Search by product, game, or SKU…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
          aria-label="Search products"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as ProductStatus | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by status">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {PRODUCT_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {PRODUCT_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} of {products.length} products
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="min-w-[120px]">Readiness</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No products match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-muted-foreground">
                    {product.gameTitle}
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                  <TableCell>
                    <ProductTypeBadge productType={product.productType} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">
                    {formatProductPrice(product.price, product.currency)}
                  </TableCell>
                  <TableCell>{product.region}</TableCell>
                  <TableCell>
                    <ProductStatusBadge status={product.status} />
                  </TableCell>
                  <TableCell>
                    <ReadinessProgress score={product.readinessScore} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/products/${product.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
