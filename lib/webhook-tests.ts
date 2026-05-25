import { createClient } from "@/lib/supabase/server";
import type {
  WebhookEventType,
  WebhookTestLog,
  WebhookTestResult,
} from "@/types/webhook";
import { WEBHOOK_EVENT_TYPES, WEBHOOK_TEST_RESULTS } from "@/types/webhook";

type DbWebhookTestLog = {
  id: string;
  product_id: string;
  event_type: string;
  result: string;
  payload: Record<string, unknown>;
  response_message: string;
  latency_ms: number;
  created_at: string;
  products: { title: string; sku: string } | { title: string; sku: string }[] | null;
};

export type CreateWebhookTestLogInput = {
  productId: string;
  eventType: WebhookEventType;
  result: WebhookTestResult;
  payload: Record<string, unknown>;
  responseMessage: string;
  latencyMs: number;
};

function queryError(action: string, message: string): string {
  const lower = message.toLowerCase();
  if (
    lower.includes("row-level security") ||
    lower.includes("policy") ||
    lower.includes("permission denied") ||
    lower.includes("42501")
  ) {
    return `${message} You may need a temporary INSERT policy on webhook_test_logs for anon until authentication is added.`;
  }
  return message;
}

function assertEventType(value: string): WebhookEventType {
  if (WEBHOOK_EVENT_TYPES.includes(value as WebhookEventType)) {
    return value as WebhookEventType;
  }
  throw new Error(`Invalid webhook event type: "${value}"`);
}

function assertResult(value: string): WebhookTestResult {
  if (WEBHOOK_TEST_RESULTS.includes(value as WebhookTestResult)) {
    return value as WebhookTestResult;
  }
  throw new Error(`Invalid webhook test result: "${value}"`);
}

function mapWebhookTestLogRow(row: DbWebhookTestLog): WebhookTestLog {
  const product = Array.isArray(row.products) ? row.products[0] : row.products;

  return {
    id: row.id,
    productId: row.product_id,
    productTitle: product?.title ?? null,
    productSku: product?.sku ?? null,
    eventType: assertEventType(row.event_type),
    result: assertResult(row.result),
    payload: row.payload ?? {},
    responseMessage: row.response_message,
    latencyMs: row.latency_ms,
    createdAt: row.created_at,
  };
}

export async function createWebhookTestLog(
  input: CreateWebhookTestLogInput
): Promise<WebhookTestLog> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("webhook_test_logs")
    .insert({
      product_id: input.productId,
      event_type: input.eventType,
      result: input.result,
      payload: input.payload,
      response_message: input.responseMessage,
      latency_ms: input.latencyMs,
    })
    .select(
      `
      id,
      product_id,
      event_type,
      result,
      payload,
      response_message,
      latency_ms,
      created_at,
      products ( title, sku )
    `
    )
    .single();

  if (error) {
    throw new Error(queryError("save webhook test log", error.message));
  }

  return mapWebhookTestLogRow(data as DbWebhookTestLog);
}

export async function getWebhookTestLogs(limit = 25): Promise<WebhookTestLog[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("webhook_test_logs")
    .select(
      `
      id,
      product_id,
      event_type,
      result,
      payload,
      response_message,
      latency_ms,
      created_at,
      products ( title, sku )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(queryError("load webhook test logs", error.message));
  }

  return (data as DbWebhookTestLog[]).map(mapWebhookTestLogRow);
}
