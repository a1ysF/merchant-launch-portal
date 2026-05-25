"use client";

import { useActionState, useMemo, useState } from "react";

import { simulateWebhookAction } from "@/app/(portal)/webhook-tester/actions";
import { ProductsLoadError } from "@/components/products/products-load-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildWebhookPayload } from "@/lib/webhook-simulator";
import type { Product } from "@/types/product";
import {
  WEBHOOK_EVENT_LABELS,
  WEBHOOK_EVENT_TYPES,
  type WebhookEventType,
} from "@/types/webhook";

type WebhookTesterPanelProps = {
  products: Product[];
};

export function WebhookTesterPanel({ products }: WebhookTesterPanelProps) {
  const [state, formAction, isPending] = useActionState(simulateWebhookAction, null);
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [eventType, setEventType] = useState<WebhookEventType>("payment.completed");

  const selectedProduct = products.find((product) => product.id === productId);

  const payloadPreview = useMemo(() => {
    if (!selectedProduct) {
      return null;
    }
    return buildWebhookPayload(selectedProduct, eventType, { preview: true });
  }, [selectedProduct, eventType]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Run webhook test</CardTitle>
          <CardDescription>
            Simulates delivery locally — no external HTTP requests are sent.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state?.error ? (
              <ProductsLoadError title="Webhook test failed" message={state.error} />
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="productId">Product</Label>
              <input type="hidden" name="productId" value={productId} />
              <Select value={productId || undefined} onValueChange={setProductId}>
                <SelectTrigger id="productId" className="w-full">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType">Event type</Label>
              <input type="hidden" name="eventType" value={eventType} />
              <Select
                value={eventType}
                onValueChange={(value) => setEventType(value as WebhookEventType)}
              >
                <SelectTrigger id="eventType" className="w-full">
                  <SelectValue placeholder="Choose event" />
                </SelectTrigger>
                <SelectContent>
                  {WEBHOOK_EVENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {WEBHOOK_EVENT_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isPending || !productId}>
              {isPending ? "Running test…" : "Run webhook test"}
            </Button>
          </CardContent>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated payload</CardTitle>
          <CardDescription>
            Preview of the JSON body that would be sent to the merchant webhook.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedProduct && !selectedProduct.webhookUrl ? (
            <p className="mb-3 text-sm text-amber-400">
              This product has no webhook URL — test will simulate a failed delivery.
            </p>
          ) : null}
          <pre className="max-h-[320px] overflow-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs text-muted-foreground">
            {payloadPreview
              ? JSON.stringify(payloadPreview, null, 2)
              : "// Select a product to preview payload"}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
