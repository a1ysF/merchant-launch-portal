import { AlertCircle } from "lucide-react";

type ProductsLoadErrorProps = {
  message: string;
};

export function ProductsLoadError({ message }: ProductsLoadErrorProps) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
      <div>
        <p className="font-medium text-destructive">Could not load products</p>
        <p className="mt-1 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
