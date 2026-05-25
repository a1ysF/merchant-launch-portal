import type { ProductIssue, ProductStatus } from "@/types/product";

/** Input used by the readiness / audit rule engine. */
export type ReadinessCheckInput = {
  sku?: string;
  price?: number;
  region?: string;
  status: ProductStatus;
  webhookUrl?: string;
  supportEmail?: string;
};

export type GeneratedProductIssue = {
  message: string;
  severity: ProductIssue["severity"];
};

const SEVERITY_PENALTY: Record<ProductIssue["severity"], number> = {
  high: 25,
  medium: 15,
  low: 10,
};

export function calculateReadinessScoreFromIssues(
  issues: GeneratedProductIssue[]
): number {
  const deducted = issues.reduce(
    (sum, issue) => sum + SEVERITY_PENALTY[issue.severity],
    0
  );
  return Math.max(0, 100 - deducted);
}

/**
 * Evaluates launch readiness rules and returns generated audit issues
 * plus a server-calculated readiness score aligned with those rules.
 */
export function evaluateProductReadiness(input: ReadinessCheckInput): {
  issues: GeneratedProductIssue[];
  readinessScore: number;
} {
  const issues: GeneratedProductIssue[] = [];

  if (!input.sku?.trim()) {
    issues.push({
      message: "SKU is required for catalog launch.",
      severity: "high",
    });
  }

  if (!input.region?.trim()) {
    issues.push({
      message: "Region is not configured.",
      severity: "medium",
    });
  }

  if (input.price === undefined || Number.isNaN(input.price) || input.price <= 0) {
    issues.push({
      message: "Price must be greater than zero.",
      severity: "high",
    });
  }

  if (!input.webhookUrl?.trim()) {
    issues.push({
      message: "Webhook URL is not configured.",
      severity: "medium",
    });
  }

  if (!input.supportEmail?.trim()) {
    issues.push({
      message: "Support email is not configured.",
      severity: "medium",
    });
  }

  if (input.status === "draft") {
    issues.push({
      message: "Product is still in draft status.",
      severity: "low",
    });
  }

  if (input.status === "live" && !input.webhookUrl?.trim()) {
    issues.push({
      message: "Live products must have a webhook URL configured.",
      severity: "high",
    });
  }

  let readinessScore = calculateReadinessScoreFromIssues(issues);

  if (input.status === "live" && readinessScore < 80) {
    issues.push({
      message: `Live launch readiness is ${readinessScore}% (minimum 80% recommended).`,
      severity: "high",
    });
    readinessScore = calculateReadinessScoreFromIssues(issues);
  }

  return { issues, readinessScore };
}
