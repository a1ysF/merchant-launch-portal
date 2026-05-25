import { createClient } from "@/lib/supabase/server";
import type { ProductIssue } from "@/types/product";

export type DashboardMetrics = {
  totalProducts: number;
  liveProducts: number;
  draftProducts: number;
  averageReadinessScore: number;
  totalOperationalIssues: number;
  webhookSuccessRate: number;
  webhookTestCount: number;
};

export type RecentOperationalIssue = {
  id: string;
  productId: string;
  productTitle: string | null;
  productSku: string | null;
  severity: ProductIssue["severity"];
  message: string;
  createdAt: string;
};

export type RecentWebhookActivity = {
  id: string;
  productId: string;
  productTitle: string | null;
  productSku: string | null;
  eventType: string;
  result: string;
  latencyMs: number;
  createdAt: string;
};

export type LaunchHealthSummary = {
  launchReady: number;
  needsAttention: number;
  blockedLaunches: number;
};

export type DashboardData = {
  metrics: DashboardMetrics;
  launchHealth: LaunchHealthSummary;
  recentIssues: RecentOperationalIssue[];
  recentWebhooks: RecentWebhookActivity[];
};

function queryError(action: string, message: string): Error {
  return new Error(`Failed to ${action}: ${message}`);
}

function assertSeverity(value: string): ProductIssue["severity"] {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  return "medium";
}

function classifyReadiness(score: number): keyof LaunchHealthSummary | null {
  if (score >= 90) return "launchReady";
  if (score >= 60) return "needsAttention";
  return "blockedLaunches";
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  const [productsResult, issuesResult, webhooksResult] = await Promise.all([
    supabase.from("products").select("status, readiness_score"),
    supabase
      .from("product_issues")
      .select("id", { count: "exact", head: true }),
    supabase.from("webhook_test_logs").select("result"),
  ]);

  if (productsResult.error) {
    throw queryError("load product metrics", productsResult.error.message);
  }
  if (issuesResult.error) {
    throw queryError("load issue metrics", issuesResult.error.message);
  }
  if (webhooksResult.error) {
    throw queryError("load webhook metrics", webhooksResult.error.message);
  }

  const products = productsResult.data ?? [];
  const totalProducts = products.length;
  const liveProducts = products.filter((p) => p.status === "live").length;
  const draftProducts = products.filter((p) => p.status === "draft").length;

  const readinessScores = products.map((p) => p.readiness_score ?? 0);
  const averageReadinessScore =
    totalProducts === 0
      ? 0
      : Math.round(
          readinessScores.reduce((sum, score) => sum + score, 0) / totalProducts
        );

  const webhookRows = webhooksResult.data ?? [];
  const webhookTestCount = webhookRows.length;
  const successCount = webhookRows.filter((row) => row.result === "success").length;
  const webhookSuccessRate =
    webhookTestCount === 0
      ? 0
      : Math.round((successCount / webhookTestCount) * 100);

  return {
    totalProducts,
    liveProducts,
    draftProducts,
    averageReadinessScore,
    totalOperationalIssues: issuesResult.count ?? 0,
    webhookSuccessRate,
    webhookTestCount,
  };
}

export async function getRecentOperationalIssues(
  limit = 5
): Promise<RecentOperationalIssue[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_issues")
    .select(
      `
      id,
      message,
      severity,
      created_at,
      product_id,
      products ( title, sku )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw queryError("load recent operational issues", error.message);
  }

  return (data ?? []).map((row) => {
    const product = Array.isArray(row.products) ? row.products[0] : row.products;

    return {
      id: row.id,
      productId: row.product_id,
      productTitle: product?.title ?? null,
      productSku: product?.sku ?? null,
      severity: assertSeverity(row.severity),
      message: row.message,
      createdAt: row.created_at,
    };
  });
}

export async function getRecentWebhookActivity(
  limit = 5
): Promise<RecentWebhookActivity[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("webhook_test_logs")
    .select(
      `
      id,
      product_id,
      event_type,
      result,
      latency_ms,
      created_at,
      products ( title, sku )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw queryError("load recent webhook activity", error.message);
  }

  return (data ?? []).map((row) => {
    const product = Array.isArray(row.products) ? row.products[0] : row.products;

    return {
      id: row.id,
      productId: row.product_id,
      productTitle: product?.title ?? null,
      productSku: product?.sku ?? null,
      eventType: row.event_type,
      result: row.result,
      latencyMs: row.latency_ms,
      createdAt: row.created_at,
    };
  });
}

export async function getLaunchHealthSummary(): Promise<LaunchHealthSummary> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("readiness_score");

  if (error) {
    throw queryError("load launch health summary", error.message);
  }

  const summary: LaunchHealthSummary = {
    launchReady: 0,
    needsAttention: 0,
    blockedLaunches: 0,
  };

  for (const row of data ?? []) {
    const bucket = classifyReadiness(row.readiness_score ?? 0);
    if (bucket) {
      summary[bucket] += 1;
    }
  }

  return summary;
}

/** Loads all dashboard analytics in parallel. */
export async function getDashboardData(): Promise<DashboardData> {
  const [metrics, launchHealth, recentIssues, recentWebhooks] = await Promise.all([
    getDashboardMetrics(),
    getLaunchHealthSummary(),
    getRecentOperationalIssues(),
    getRecentWebhookActivity(),
  ]);

  return { metrics, launchHealth, recentIssues, recentWebhooks };
}
