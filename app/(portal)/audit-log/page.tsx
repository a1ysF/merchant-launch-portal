import Link from "next/link";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAuditLogEntries, type AuditLogEntry } from "@/lib/products";
import type { ProductIssue } from "@/types/product";

function formatAuditTime(iso: string): string {
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

export default async function AuditLogPage() {
  let entries: AuditLogEntry[] = [];
  let loadError: string | null = null;

  try {
    entries = await getAuditLogEntries();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "An unexpected error occurred.";
  }

  return (
    <>
      <PageHeader
        title="Audit Log"
        description="Launch readiness findings generated from product setup rules."
      />

      <Card>
        <CardHeader>
          <CardTitle>Readiness audit events</CardTitle>
          <CardDescription>
            Live data from product_issues in Supabase, newest first.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 overflow-x-auto">
          {loadError ? (
            <ProductsLoadError title="Could not load audit log" message={loadError} />
          ) : null}

          {!loadError && entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No audit issues yet. Create or update a product to generate readiness findings.
            </p>
          ) : null}

          {!loadError && entries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatAuditTime(entry.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <Link
                          href={`/products/${entry.productId}`}
                          className="font-medium hover:underline"
                        >
                          {entry.productTitle ?? "Unknown product"}
                        </Link>
                        {entry.productSku ? (
                          <p className="font-mono text-xs text-muted-foreground">
                            {entry.productSku}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={severityVariant(entry.severity)}>
                        {entry.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md text-sm">{entry.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
