"use server";

import { redirect } from "next/navigation";

import type { ProductFormState } from "@/components/products/product-form";
import {
  parseProductFormData,
  updateProduct,
  validateProductInput,
} from "@/lib/products";

export type UpdateProductFormState = ProductFormState;

export async function updateProductAction(
  productId: string,
  _prevState: UpdateProductFormState | null,
  formData: FormData
): Promise<UpdateProductFormState | null> {
  const validation = validateProductInput(parseProductFormData(formData));
  if (!validation.ok) {
    return {
      error: validation.error,
      fieldErrors: validation.fieldErrors,
    };
  }

  try {
    await updateProduct(productId, validation.data);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update product. Please try again.",
    };
  }

  redirect(`/products/${productId}`);
}
