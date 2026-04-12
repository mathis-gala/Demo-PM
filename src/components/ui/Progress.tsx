import { cn } from "../../utils/cn";

type ProgressProps = {
  value: number;
  max?: number;
  className?: string;
};

export function Progress({ value, max = 100, className }: ProgressProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200", className)}>
      <div
        className="h-2 rounded-full bg-indigo-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
