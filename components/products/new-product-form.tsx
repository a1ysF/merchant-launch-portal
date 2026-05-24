"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  createProductAction,
  type CreateProductFormState,
} from "@/app/(portal)/products/new/actions";
import { ProductsLoadError } from "@/components/products/products-load-error";
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
import { cn } from "@/lib/utils";

const currencies = ["USD", "EUR", "GBP"] as const;
const regions = ["Global", "NA", "EU", "APAC", "LATAM", "UK", "NA / EU"] as const;

const initialState: CreateProductFormState | null = null;

function fieldError(
  fieldErrors: Record<string, string> | undefined,
  name: string
): string | undefined {
  return fieldErrors?.[name];
}

export function NewProductForm() {
  const [state, formAction, isPending] = useActionState(
    createProductAction,
    initialState
  );
  const [productType, setProductType] = useState("");
  const [status, setStatus] = useState("draft");
  const [currency, setCurrency] = useState("USD");
  const [region, setRegion] = useState("");

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Product details</CardTitle>
        <CardDescription>
          Create a new SKU in Supabase. Readiness score is calculated automatically.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          {state?.error ? (
            <ProductsLoadError title="Could not create product" message={state.error} />
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="gameTitle">Game title</Label>
              <Input
                id="gameTitle"
                name="gameTitle"
                placeholder="e.g. Shadow Realm Online"
                required
                aria-invalid={Boolean(fieldError(state?.fieldErrors, "gameTitle"))}
              />
              <FieldMessage message={fieldError(state?.fieldErrors, "gameTitle")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Product name</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Starter Crystal Pack"
                required
                aria-invalid={Boolean(fieldError(state?.fieldErrors, "title"))}
              />
              <FieldMessage message={fieldError(state?.fieldErrors, "title")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                placeholder="e.g. SRO-CRY-ST01"
                required
                aria-invalid={Boolean(fieldError(state?.fieldErrors, "sku"))}
              />
              <FieldMessage message={fieldError(state?.fieldErrors, "sku")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType">Product type</Label>
              <input type="hidden" name="productType" value={productType} />
              <Select
                value={productType || undefined}
                onValueChange={setProductType}
              >
                <SelectTrigger
                  id="productType"
                  className="w-full"
                  aria-invalid={Boolean(fieldError(state?.fieldErrors, "productType"))}
                >
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
              <FieldMessage message={fieldError(state?.fieldErrors, "productType")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <input type="hidden" name="status" value={status} />
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger
                  id="status"
                  className="w-full"
                  aria-invalid={Boolean(fieldError(state?.fieldErrors, "status"))}
                >
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
              <FieldMessage message={fieldError(state?.fieldErrors, "status")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="9.99"
                required
                aria-invalid={Boolean(fieldError(state?.fieldErrors, "price"))}
              />
              <FieldMessage message={fieldError(state?.fieldErrors, "price")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <input type="hidden" name="currency" value={currency} />
              <Select value={currency} onValueChange={setCurrency} required>
                <SelectTrigger
                  id="currency"
                  className="w-full"
                  aria-invalid={Boolean(fieldError(state?.fieldErrors, "currency"))}
                >
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
              <FieldMessage message={fieldError(state?.fieldErrors, "currency")} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="region">Region</Label>
              <input type="hidden" name="region" value={region} />
              <Select value={region || undefined} onValueChange={setRegion}>
                <SelectTrigger
                  id="region"
                  className="w-full"
                  aria-invalid={Boolean(fieldError(state?.fieldErrors, "region"))}
                >
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
              <FieldMessage message={fieldError(state?.fieldErrors, "region")} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="webhookUrl">Webhook URL (optional)</Label>
              <Input
                id="webhookUrl"
                name="webhookUrl"
                type="url"
                placeholder="https://hooks.demo.merchant/your-game/events"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="supportEmail">Support email (optional)</Label>
              <Input
                id="supportEmail"
                name="supportEmail"
                type="email"
                placeholder="commerce@yourgame-demo.io"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create product"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Cancel</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function FieldMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={cn("text-xs text-destructive")}>{message}</p>;
}
