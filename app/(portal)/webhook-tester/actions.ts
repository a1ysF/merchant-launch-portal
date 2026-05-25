"use server";

import { revalidatePath } from "next/cache";

import { getProductById } from "@/lib/products";
import { simulateWebhookTest } from "@/lib/webhook-simulator";
import { createWebhookTestLog } from "@/lib/webhook-tests";
import { WEBHOOK_EVENT_TYPES, type WebhookEventType } from "@/types/webhook";

export type WebhookTestFormState = {
  error?: string;
};

export async function simulateWebhookAction(
  _prevState: WebhookTestFormState | null,
  formData: FormData
): Promise<WebhookTestFormState | null> {
  const productId = String(formData.get("productId") ?? "").trim();
  const eventType = String(formData.get("eventType") ?? "").trim();

  if (!productId) {
    return { error: "Select a product to run a webhook test." };
  }

  if (!WEBHOOK_EVENT_TYPES.includes(eventType as WebhookEventType)) {
    return { error: "Select a valid event type." };
  }

  const product = await getProductById(productId);
  if (!product) {
    return { error: "Product not found. Refresh and try again." };
  }

  const simulation = simulateWebhookTest(product, eventType as WebhookEventType);

  try {
    await createWebhookTestLog({
      productId: product.id,
      eventType: eventType as WebhookEventType,
      result: simulation.result,
      payload: simulation.payload,
      responseMessage: simulation.responseMessage,
      latencyMs: simulation.latencyMs,
    });
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to save webhook test log.",
    };
  }

  revalidatePath("/webhook-tester");
  return null;
}
