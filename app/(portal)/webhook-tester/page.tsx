import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WebhookTesterPage() {
  return (
    <>
      <PageHeader
        title="Webhook Tester"
        description="Simulate merchant integration callbacks before going live."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send test event</CardTitle>
            <CardDescription>
              UI shell only — request execution will be added with the API layer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-type">Event type</Label>
              <Select>
                <SelectTrigger id="event-type" className="w-full">
                  <SelectValue placeholder="Choose event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product.created">product.created</SelectItem>
                  <SelectItem value="product.updated">product.updated</SelectItem>
                  <SelectItem value="launch.completed">launch.completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payload">JSON payload</Label>
              <Textarea
                id="payload"
                className="min-h-[200px] font-mono text-xs"
                defaultValue={`{\n  "merchant_id": "demo-001",\n  "product_id": "prod_001",\n  "status": "live"\n}`}
              />
            </div>
            <Button type="button" disabled>
              Send test webhook
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>Last response will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
              {`// Waiting for test run…\n{\n  "status": "idle"\n}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
