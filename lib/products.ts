import { createClient } from "@/lib/supabase/server";
import {
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
  type Product,
  type ProductIssue,
  type ProductStatus,
  type ProductType,
} from "@/types/product";

/** Row shape from the `products` table (snake_case). */
export type DbProduct = {
  id: string;
  title: string;
  game_title: string;
  sku: string;
  product_type: string;
  price: number | string;
  currency: string;
  status: string;
  region: string;
  webhook_url: string | null;
  support_email: string;
  readiness_score: number | null;
  created_at: string;
};

/** Row shape from the `product_issues` table (snake_case). */
export type DbProductIssue = {
  id: string;
  product_id: string;
  message: string;
  severity: string;
};

function assertProductStatus(value: string): ProductStatus {
  if (PRODUCT_STATUSES.includes(value as ProductStatus)) {
    return value as ProductStatus;
  }
  throw new Error(`Invalid product status from database: "${value}"`);
}

function assertProductType(value: string): ProductType {
  if (PRODUCT_TYPES.includes(value as ProductType)) {
    return value as ProductType;
  }
  throw new Error(`Invalid product type from database: "${value}"`);
}

function assertIssueSeverity(value: string): ProductIssue["severity"] {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  throw new Error(`Invalid issue severity from database: "${value}"`);
}

export function mapProductRow(
  row: DbProduct,
  issues: ProductIssue[] = []
): Product {
  return {
    id: row.id,
    title: row.title,
    gameTitle: row.game_title,
    sku: row.sku,
    productType: assertProductType(row.product_type),
    price: typeof row.price === "string" ? parseFloat(row.price) : row.price,
    currency: row.currency,
    status: assertProductStatus(row.status),
    region: row.region,
    webhookUrl: row.webhook_url ?? "",
    supportEmail: row.support_email,
    readinessScore: row.readiness_score ?? 0,
    issues,
    createdAt: row.created_at,
  };
}

export function mapProductIssueRow(row: DbProductIssue): ProductIssue {
  return {
    id: row.id,
    message: row.message,
    severity: assertIssueSeverity(row.severity),
  };
}

function queryError(action: string, message: string): Error {
  return new Error(`Failed to ${action}: ${message}`);
}

function formatPolicyError(message: string, operation: "insert" | "update"): string {
  const lower = message.toLowerCase();
  if (
    lower.includes("row-level security") ||
    lower.includes("policy") ||
    lower.includes("permission denied") ||
    lower.includes("42501")
  ) {
    const policy =
      operation === "insert"
        ? "INSERT policy on the products table for anon"
        : "UPDATE policy on the products table for anon";
    return `${message} You may need a temporary ${policy} until authentication is added.`;
  }
  return message;
}

/** Shared product form input (camelCase, frontend shape). */
export type ProductFormInput = {
  gameTitle: string;
  title: string;
  sku: string;
  productType: ProductType;
  price: number;
  currency: string;
  region: string;
  status: ProductStatus;
  webhookUrl?: string;
  supportEmail?: string;
};

/** @alias ProductFormInput */
export type CreateProductInput = ProductFormInput;

/** @alias ProductFormInput */
export type UpdateProductInput = ProductFormInput;

export type ProductFormValidationResult =
  | { ok: true; data: ProductFormInput }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

/** @alias ProductFormValidationResult */
export type CreateProductValidationResult = ProductFormValidationResult;

export function parseProductFormData(formData: FormData): Record<string, string> {
  return {
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
}

export function calculateReadinessScore(input: {
  webhookUrl?: string;
  supportEmail?: string;
  status: ProductStatus;
}): number {
  let score = 100;
  if (!input.webhookUrl?.trim()) score -= 25;
  if (!input.supportEmail?.trim()) score -= 25;
  if (input.status === "draft") score -= 20;
  return Math.max(0, score);
}

export function validateProductInput(
  raw: Record<string, string>
): ProductFormValidationResult {
  const fieldErrors: Record<string, string> = {};

  const gameTitle = raw.gameTitle?.trim() ?? "";
  const title = raw.title?.trim() ?? "";
  const sku = raw.sku?.trim() ?? "";
  const productType = raw.productType?.trim() ?? "";
  const currency = raw.currency?.trim() ?? "";
  const region = raw.region?.trim() ?? "";
  const status = raw.status?.trim() ?? "";
  const webhookUrl = raw.webhookUrl?.trim() ?? "";
  const supportEmail = raw.supportEmail?.trim() ?? "";

  if (!gameTitle) fieldErrors.gameTitle = "Game title is required.";
  if (!title) fieldErrors.title = "Product name is required.";
  if (!sku) fieldErrors.sku = "SKU is required.";
  if (!productType) fieldErrors.productType = "Product type is required.";
  if (!currency) fieldErrors.currency = "Currency is required.";
  if (!region) fieldErrors.region = "Region is required.";
  if (!status) fieldErrors.status = "Status is required.";

  if (productType && !PRODUCT_TYPES.includes(productType as ProductType)) {
    fieldErrors.productType = "Invalid product type.";
  }
  if (status && !PRODUCT_STATUSES.includes(status as ProductStatus)) {
    fieldErrors.status = "Invalid status.";
  }

  const priceRaw = raw.price?.trim() ?? "";
  if (!priceRaw) {
    fieldErrors.price = "Price is required.";
  }

  const price = priceRaw ? Number(priceRaw) : NaN;
  if (priceRaw && (Number.isNaN(price) || price <= 0)) {
    fieldErrors.price = "Price must be greater than 0.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: "Please fix the errors below.",
      fieldErrors,
    };
  }

  return {
    ok: true,
    data: {
      gameTitle,
      title,
      sku,
      productType: productType as ProductType,
      price,
      currency,
      region,
      status: status as ProductStatus,
      webhookUrl: webhookUrl || undefined,
      supportEmail: supportEmail || undefined,
    },
  };
}

/** @alias validateProductInput */
export const validateCreateProductInput = validateProductInput;

function mapProductInputToDb(input: ProductFormInput) {
  const readinessScore = calculateReadinessScore(input);

  return {
    title: input.title,
    game_title: input.gameTitle,
    sku: input.sku,
    product_type: input.productType,
    price: input.price,
    currency: input.currency,
    status: input.status,
    region: input.region,
    webhook_url: input.webhookUrl?.trim() || null,
    support_email: input.supportEmail?.trim() || null,
    readiness_score: readinessScore,
  };
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const supabase = await createClient();
  const row = mapProductInputToDb(input);

  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw queryError("create product", formatPolicyError(error.message, "insert"));
  }

  return mapProductRow(data as DbProduct);
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<Product> {
  const supabase = await createClient();
  const row = mapProductInputToDb(input);

  const { data, error } = await supabase
    .from("products")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw queryError("update product", formatPolicyError(error.message, "update"));
  }

  return mapProductRow(data as DbProduct);
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw queryError("load products", error.message);
  }

  return (data as DbProduct[]).map((row) => mapProductRow(row));
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw queryError("load product", error.message);
  }

  if (!data) {
    return null;
  }

  return mapProductRow(data as DbProduct);
}

export async function getProductIssues(productId: string): Promise<ProductIssue[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_issues")
    .select("id, product_id, message, severity")
    .eq("product_id", productId)
    .order("id", { ascending: true });

  if (error) {
    throw queryError("load product issues", error.message);
  }

  return (data as DbProductIssue[]).map(mapProductIssueRow);
}
