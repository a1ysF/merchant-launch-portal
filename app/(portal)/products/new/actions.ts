"use server";

import { redirect } from "next/navigation";

import {
  createProduct,
  validateCreateProductInput,
} from "@/lib/products";

export type CreateProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createProductAction(
  _prevState: CreateProductFormState | null,
  formData: FormData
): Promise<CreateProductFormState | null> {
  const raw = {
    gameTitle: String(formData.get("gameTitle") ?? ""),
    title: String(formData.get("title") ?? ""),
    sku: String(formData.get("sku") ?? ""),
    productType: String(formData.get("productType") ?? ""),
    price: String(formData.get("price") ?? ""),
    currency: String(formData.get("currency") ?? ""),
    region: String(formData.get("region") ?? ""),
    status: String(formData.get("status") ?? ""),
    webhookUrl: String(formData.get("webhookUrl") ?? ""),
    supportEmail: String(formData.get("supportEmail") ?? ""),
  };

  const validation = validateCreateProductInput(raw);
  if (!validation.ok) {
    return {
      error: validation.error,
      fieldErrors: validation.fieldErrors,
    };
  }

  try {
    await createProduct(validation.data);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create product. Please try again.",
    };
  }

  redirect("/products");
}
