export const PRODUCT_STATUSES = [
  "draft",
  "review",
  "staging",
  "live",
  "blocked",
] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PRODUCT_TYPES = [
  "Virtual Currency",
  "Battle Pass",
  "DLC Bundle",
  "Cosmetic Item",
  "Subscription",
  "Game Key",
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export type ProductIssue = {
  id: string;
  message: string;
  severity: "low" | "medium" | "high";
};

export type Product = {
  id: string;
  title: string;
  gameTitle: string;
  sku: string;
  productType: ProductType;
  price: number;
  currency: string;
  status: ProductStatus;
  region: string;
  webhookUrl: string;
  supportEmail: string;
  readinessScore: number;
  issues: ProductIssue[];
  createdAt: string;
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  draft: "Draft",
  review: "Review",
  staging: "Staging",
  live: "Live",
  blocked: "Blocked",
};

export function formatProductPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}
