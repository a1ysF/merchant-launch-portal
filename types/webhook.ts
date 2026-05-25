export const WEBHOOK_EVENT_TYPES = [
  "payment.completed",
  "payment.failed",
  "purchase.refunded",
  "item.delivered",
  "subscription.renewed",
] as const;

export type WebhookEventType = (typeof WEBHOOK_EVENT_TYPES)[number];

export const WEBHOOK_TEST_RESULTS = ["success", "failed"] as const;

export type WebhookTestResult = (typeof WEBHOOK_TEST_RESULTS)[number];

export type WebhookTestLog = {
  id: string;
  productId: string;
  productTitle: string | null;
  productSku: string | null;
  eventType: WebhookEventType;
  result: WebhookTestResult;
  payload: Record<string, unknown>;
  responseMessage: string;
  latencyMs: number;
  createdAt: string;
};

export const WEBHOOK_EVENT_LABELS: Record<WebhookEventType, string> = {
  "payment.completed": "Payment completed",
  "payment.failed": "Payment failed",
  "purchase.refunded": "Purchase refunded",
  "item.delivered": "Item delivered",
  "subscription.renewed": "Subscription renewed",
};
