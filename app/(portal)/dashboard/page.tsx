import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Package,
  ShieldAlert,
  Webhook,
} from "lucide-react";

import { DashboardCard } from "@/components/layout/dashboard-card";
import { PageHeader } from "@/components/layout/page-header";
import { ProductsLoadError } from "@/components/products/products-load-error";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData } from "@/lib/dashboard-analytics";
import type { ProductIssue } from "@/types/product";

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function severityVariant(
  severity: ProductIssue["severity"]
): "destructive" | "outline" | "secondary" {
  if (severity === "high") return "destructive";
  if (severity === "medium") return "outline";
  return "secondary";
}

export default async function DashboardPage() {
  let data;
  let loadError: string | null = null;

  try {
    data = await getDashboardData();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "An unexpected error occurred.";
  }

  const metrics = data?.metrics;
  const launchHealth = data?.launchHealth;
  const recentIssues = data?.recentIssues ?? [];
  const recentWebhooks = data?.recentWebhooks ?? [];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Operational overview of catalog launches, readiness, and integrations."
      />

      {loadError ? (
        <ProductsLoadError title="Could not load dashboard" message={loadError} />
      ) : null}

      {!loadError && metrics ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Total products"
              value={String(metrics.totalProducts)}
              description="In catalog"
              icon={Package}
              trend={`${metrics.liveProducts} live · ${metrics.draftProducts} draft`}
            />
            <DashboardCard
              title="Live products"
              value={String(metrics.liveProducts)}
              description="Published SKUs"
              icon={CheckCircle2}
              trend={`${metrics.totalProducts > 0 ? Math.round((metrics.liveProducts / metrics.totalProducts) * 100) : 0}% of catalog`}
            />
            <DashboardCard
              title="Draft products"
              value={String(metrics.draftProducts)}
              description="Not yet launched"
              icon={AlertCircle}
            />
            <DashboardCard
              title="Avg readiness"
              value={`${metrics.averageReadinessScore}%`}
              description="Catalog-wide score"
              icon={ShieldAlert}
              trend={
                launchHealth
                  ? `${launchHealth.launchReady} launch-ready`
                  : undefined
              }
            />
            <DashboardCard
              title="Operational issues"
              value={String(metrics.totalOperationalIssues)}
              description="Open readiness findings"
              icon={AlertTriangle}
              trend={
                metrics.totalOperationalIssues === 0
                  ? "No open issues"
                  : "From product_issues"
              }
            />
            <DashboardCard
              title="Webhook success rate"
              value={
                metrics.webhookTestCount === 0
                  ? "—"
                  : `${metrics.webhookSuccessRate}%`
              }
              description="Simulated test runs"
              icon={Webhook}
              trend={
                metrics.webhookTestCount === 0
                  ? "No tests yet"
                  : `${metrics.webhookTestCount} total tests`
              }
            />
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Launch health summary</CardTitle>
                <CardDescription>
                  Products grouped by readiness score thresholds.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                  <p className="text-sm text-muted-foreground">Launch-ready</p>
                  <p className="text-2xl font-semibold text-emerald-400">
                    {launchHealth?.launchReady ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Score ≥ 90%</p>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                  <p className="text-sm text-muted-foreground">Needs attention</p>
                  <p className="text-2xl font-semibold text-amber-400">
                    {launchHealth?.needsAttention ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Score 60–89%</p>
                </div>
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                  <p className="text-sm text-muted-foreground">Blocked / high risk</p>
                  <p className="text-2xl font-semibold text-red-400">
                    {launchHealth?.blockedLaunches ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Score &lt; 60%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent operational issues</CardTitle>
                <CardDescription>
                  Latest readiness findings from product_issues.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentIssues.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No operational issues recorded. Create or update products to
                    generate readiness checks.
                  </p>
                ) : (
                  recentIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0 space-y-1">
                        <Link
                          href={`/products/${issue.productId}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {issue.productTitle ?? issue.productSku ?? "Unknown product"}
                        </Link>
                        <p className="text-sm text-muted-foreground">{issue.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(issue.createdAt)}
                        </p>
                      </div>
                      <Badge variant={severityVariant(issue.severity)}>
                        {issue.severity}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent webhook activity</CardTitle>
                <CardDescription>
                  Latest simulated webhook test runs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentWebhooks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No webhook tests yet.{" "}
                    <Link href="/webhook-tester" className="text-primary hover:underline">
                      Run a test
                    </Link>{" "}
                    to see activity here.
                  </p>
                ) : (
                  recentWebhooks.map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <Link
                          href={`/products/${log.productId}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {log.productTitle ?? log.productSku ?? "Unknown product"}
                        </Link>
                        <p className="font-mono text-xs text-muted-foreground">
                          {log.eventType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(log.createdAt)} · {log.latencyMs} ms
                        </p>
                      </div>
                      <Badge
                        variant={log.result === "success" ? "secondary" : "destructive"}
                        className={
                          log.result === "success"
                            ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                            : undefined
                        }
                      >
                        {log.result}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </>
  );
}
