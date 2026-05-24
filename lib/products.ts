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
