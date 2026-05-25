import type { Product } from "@/types/product";
import type { WebhookEventType, WebhookTestResult } from "@/types/webhook";

export type WebhookSimulation = {
  payload: Record<string, unknown>;
  result: WebhookTestResult;
  responseMessage: string;
  latencyMs: number;
};

function deterministicLatencyMs(productId: string, eventType: WebhookEventType): number {
  const seed = `${productId}:${eventType}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % 1000;
  }
  return 80 + (hash % 271);
}

function transactionStatus(eventType: WebhookEventType): string {
  switch (eventType) {
    case "payment.completed":
      return "completed";
    case "payment.failed":
      return "failed";
    case "purchase.refunded":
      return "refunded";
    case "item.delivered":
      return "delivered";
    case "subscription.renewed":
      return "renewed";
    default:
      return "unknown";
  }
}

/** Stable placeholder for UI preview — avoids server/client hydration mismatch. */
export const WEBHOOK_PREVIEW_TIMESTAMP =
  "Preview timestamp will be generated when test runs";

type BuildWebhookPayloadOptions = {
  /** Use fixed preview values instead of Date (for client preview UI only). */
  preview?: boolean;
};

/** Builds a realistic webhook JSON body from product + event (no network call). */
export function buildWebhookPayload(
  product: Product,
  eventType: WebhookEventType,
  options?: BuildWebhookPayloadOptions
): Record<string, unknown> {
  const isPreview = options?.preview === true;
  const timestamp = isPreview ? WEBHOOK_PREVIEW_TIMESTAMP : new Date().toISOString();
  const transactionSuffix = isPreview
    ? "preview"
    : timestamp.slice(0, 10).replace(/-/g, "");

  return {
    event: eventType,
    timestamp,
    merchant: {
      game_title: product.gameTitle,
      region: product.region,
    },
    product: {
      id: product.id,
      sku: product.sku,
      title: product.title,
      type: product.productType,
      price: product.price,
      currency: product.currency,
      status: product.status,
    },
    transaction: {
      id: `txn_${product.sku.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${transactionSuffix}`,
      status: transactionStatus(eventType),
    },
    webhook_url: product.webhookUrl || null,
  };
}

function resolveResult(
  product: Product,
  eventType: WebhookEventType
): WebhookTestResult {
  if (!product.webhookUrl?.trim()) {
    return "failed";
  }
  if (eventType === "payment.failed") {
    return "failed";
  }
  return "success";
}

function buildResponseMessage(
  result: WebhookTestResult,
  product: Product,
  eventType: WebhookEventType,
  latencyMs: number
): string {
  if (!product.webhookUrl?.trim()) {
    return "Simulated delivery failed: product has no webhook URL configured.";
  }
  if (eventType === "payment.failed") {
    return `Simulated ${eventType} rejected by merchant endpoint (${latencyMs}ms).`;
  }
  if (result === "success") {
    return `Simulated ${eventType} acknowledged with HTTP 200 (${latencyMs}ms).`;
  }
  return `Simulated ${eventType} failed with HTTP 502 (${latencyMs}ms).`;
}

/**
 * Simulates a webhook test locally — does not call external URLs.
 */
export function simulateWebhookTest(
  product: Product,
  eventType: WebhookEventType
): WebhookSimulation {
  const payload = buildWebhookPayload(product, eventType);
  const result = resolveResult(product, eventType);
  const latencyMs = deterministicLatencyMs(product.id, eventType);

  return {
    payload,
    result,
    responseMessage: buildResponseMessage(result, product, eventType, latencyMs),
    latencyMs,
  };
}
