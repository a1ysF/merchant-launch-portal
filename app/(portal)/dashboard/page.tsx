import { AlertCircle, CheckCircle2, Package, Webhook } from "lucide-react";

import { DashboardCard } from "@/components/layout/dashboard-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of product launches, integrations, and recent activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Active products"
          value="12"
          description="In catalog"
          icon={Package}
          trend="+2 this week (demo)"
        />
        <DashboardCard
          title="Pending launches"
          value="3"
          description="Awaiting approval"
          icon={AlertCircle}
          trend="1 blocked on pricing"
        />
        <DashboardCard
          title="Live integrations"
          value="8"
          description="Webhooks configured"
          icon={Webhook}
          trend="All healthy (mock)"
        />
        <DashboardCard
          title="Completed launches"
          value="24"
          description="Last 90 days"
          icon={CheckCircle2}
          trend="94% success rate (demo)"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Launch pipeline</CardTitle>
            <CardDescription>
              Placeholder snapshot of products moving through stages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Season Pass — Q3", stage: "Review", status: "outline" as const },
              { name: "Starter Pack DLC", stage: "Staging", status: "default" as const },
              { name: "Founder Bundle", stage: "Live", status: "secondary" as const },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
              >
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.stage}</span>
                  <Badge variant={item.status}>{item.stage}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Audit events will appear here once the backend is connected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Product &quot;Starter Pack DLC&quot; moved to Staging.</p>
            <p>Webhook test succeeded for merchant demo-001.</p>
            <p>Pricing rules updated for &quot;Season Pass — Q3&quot;.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
