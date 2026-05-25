import Link from "next/link";

import { Badge } from "@/components/ui/badge";
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
import type { WebhookTestLog, WebhookTestResult } from "@/types/webhook";

type WebhookTestHistoryProps = {
  logs: WebhookTestLog[];
};

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function resultBadgeVariant(
  result: WebhookTestResult
): "default" | "destructive" | "secondary" {
  if (result === "success") return "default";
  return "destructive";
}

export function WebhookTestHistory({ logs }: WebhookTestHistoryProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent test history</CardTitle>
        <CardDescription>
          Saved runs from webhook_test_logs in Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No webhook tests yet. Run a test above to record simulated delivery results.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>Response</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatTime(log.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <Link
                        href={`/products/${log.productId}`}
                        className="font-medium hover:underline"
                      >
                        {log.productTitle ?? "Unknown product"}
                      </Link>
                      {log.productSku ? (
                        <p className="font-mono text-xs text-muted-foreground">
                          {log.productSku}
                        </p>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.eventType}</TableCell>
                  <TableCell>
                    <Badge
                      variant={resultBadgeVariant(log.result)}
                      className={
                        log.result === "success"
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                          : undefined
                      }
                    >
                      {log.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">{log.latencyMs} ms</TableCell>
                  <TableCell className="max-w-xs text-sm text-muted-foreground">
                    {log.responseMessage}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
