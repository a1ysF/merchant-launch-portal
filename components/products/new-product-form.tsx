import Link from "next/link";

import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABELS,
  PRODUCT_TYPES,
} from "@/types/product";

const currencies = ["USD", "EUR", "GBP"] as const;
const regions = ["Global", "NA", "EU", "APAC", "LATAM", "UK", "NA / EU"] as const;

export function NewProductForm() {
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Product details</CardTitle>
        <CardDescription>
          Fill in launch metadata for a new SKU. Saving is disabled until the backend is connected.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="gameTitle">Game title</Label>
            <Input id="gameTitle" placeholder="e.g. Shadow Realm Online" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Product name</Label>
            <Input id="title" placeholder="e.g. Starter Crystal Pack" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" placeholder="e.g. SRO-CRY-ST01" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productType">Product type</Label>
            <Select>
              <SelectTrigger id="productType" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue="draft">
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {PRODUCT_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" min="0" step="0.01" placeholder="9.99" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select defaultValue="USD">
              <SelectTrigger id="currency" className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="region">Region</Label>
            <Select>
              <SelectTrigger id="region" className="w-full">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              type="url"
              placeholder="https://hooks.demo.merchant/your-game/events"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="supportEmail">Support email</Label>
            <Input
              id="supportEmail"
              type="email"
              placeholder="commerce@yourgame-demo.io"
            />
          </div>
        </div>

        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          Backend connection coming later — this form is for layout and field planning only.
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t">
        <Button type="button" disabled title="Requires Supabase in a future phase">
          Create product
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Cancel</Link>
        </Button>
        <div className="flex w-full items-center gap-2 pt-2 sm:w-auto sm:pt-0 sm:pl-2">
          <span className="text-xs text-muted-foreground">Preview status:</span>
          <ProductStatusBadge status="draft" />
        </div>
      </CardFooter>
    </Card>
  );
}
