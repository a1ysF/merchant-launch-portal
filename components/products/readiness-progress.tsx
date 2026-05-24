import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ReadinessProgressProps = {
  score: number;
  showLabel?: boolean;
  className?: string;
};

function scoreTone(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

export function ReadinessProgress({
  score,
  showLabel = true,
  className,
}: ReadinessProgressProps) {
  const clamped = Math.min(100, Math.max(0, score));

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel ? (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Readiness</span>
          <span className={cn("font-medium tabular-nums", scoreTone(clamped))}>
            {clamped}%
          </span>
        </div>
      ) : null}
      <Progress value={clamped} className="h-2" />
    </div>
  );
}
