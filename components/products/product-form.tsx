"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

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
import { cn } from "@/lib/utils";
import {
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABELS,
  PRODUCT_TYPES,
  type Product,
  type ProductStatus,
  type ProductType,
} from "@/types/product";

const currencies = ["USD", "EUR", "GBP"] as const;
const regions = ["Global", "NA", "EU", "APAC", "LATAM", "UK", "NA / EU"] as const;

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

type ProductFormProps = {
  mode: "create" | "edit";
  product?: Product;
  action: (
    prevState: ProductFormState | null,
    formData: FormData
  ) => Promise<ProductFormState | null>;
  cancelHref: string;
  submitLabel: string;
  pendingLabel: string;
  errorTitle: string;
  description: string;
};

function fieldError(
  fieldErrors: Record<string, string> | undefined,
  name: string
): string | undefined {
  return fieldErrors?.[name];
}

export function ProductForm({
  mode,
  product,
  action,
  cancelHref,
  submitLabel,
  pendingLabel,
  errorTitle,
  description,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [productType, setProductType] = useState<ProductType | "">(
    product?.productType ?? ""
  );
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "draft");
  const [currency, setCurrency] = useState(product?.currency ?? "USD");
  const [region, setRegion] = useState(product?.region ?? "");

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Product details</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          {state?.error ? (
            <ProductsLoadError title={errorTitle} message={state.error} />
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="gameTitle">Game title</Label>
              <Input
                id="gameTitle"
                name="gameTitle"
                defaultValue={product?.gameTitle}
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
                defaultValue={product?.title}
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
                defaultValue={product?.sku}
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
                onValueChange={(value) => setProductType(value as ProductType)}
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
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as ProductStatus)}
              >
                <SelectTrigger
                  id="status"
                  className="w-full"
                  aria-invalid={Boolean(fieldError(state?.fieldErrors, "status"))}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_STATUSES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {PRODUCT_STATUS_LABELS[item]}
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
                defaultValue={product?.price}
                placeholder="9.99"
                required
                aria-invalid={Boolean(fieldError(state?.fieldErrors, "price"))}
              />
              <FieldMessage message={fieldError(state?.fieldErrors, "price")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <input type="hidden" name="currency" value={currency} />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger
                  id="currency"
                  className="w-full"
                  aria-invalid={Boolean(fieldError(state?.fieldErrors, "currency"))}
                >
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
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
                  {regions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
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
                defaultValue={product?.webhookUrl}
                placeholder="https://hooks.demo.merchant/your-game/events"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="supportEmail">Support email (optional)</Label>
              <Input
                id="supportEmail"
                name="supportEmail"
                type="email"
                defaultValue={product?.supportEmail}
                placeholder="commerce@yourgame-demo.io"
              />
            </div>
          </div>

          {mode === "edit" ? (
            <p className="text-sm text-muted-foreground">
              Readiness score is recalculated automatically when you save.
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending ? pendingLabel : submitLabel}
          </Button>
          <Button variant="outline" asChild>
            <Link href={cancelHref}>Cancel</Link>
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
