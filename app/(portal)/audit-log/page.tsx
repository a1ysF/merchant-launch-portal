import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const demoEvents = [
  {
    id: "evt_001",
    action: "product.updated",
    actor: "demo.user@merchant.io",
    resource: "prod_001",
    time: "2026-05-24 09:12 UTC",
  },
  {
    id: "evt_002",
    action: "webhook.test",
    actor: "system",
    resource: "merchant demo-001",
    time: "2026-05-24 08:45 UTC",
  },
  {
    id: "evt_003",
    action: "launch.approved",
    actor: "ops.reviewer@merchant.io",
    resource: "prod_003",
    time: "2026-05-23 16:30 UTC",
  },
];

export default function AuditLogPage() {
  return (
    <>
      <PageHeader
        title="Audit Log"
        description="Immutable trail of configuration and launch changes."
      />

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>
            Sample events for layout — real log streaming comes with Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Resource</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {event.time}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.action}</Badge>
                  </TableCell>
                  <TableCell>{event.actor}</TableCell>
                  <TableCell className="font-mono text-xs">{event.resource}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
