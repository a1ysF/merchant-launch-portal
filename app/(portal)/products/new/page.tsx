import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewProductPage() {
  return (
    <>
      <PageHeader
        title="New product"
        description="Create a catalog item for launch configuration (UI only)."
        actions={
          <Button variant="outline" asChild>
            <Link href="/products">Cancel</Link>
          </Button>
        }
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Product details</CardTitle>
          <CardDescription>
            Form fields are visual placeholders — no submit handler yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product name</Label>
            <Input id="name" placeholder="e.g. Season Pass — Q3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" placeholder="e.g. SS-Q3-2026" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Launch status</Label>
            <Select>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Internal notes for merchandising and integration teams."
              rows={4}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" disabled>
              Save product
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Back to catalog</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
