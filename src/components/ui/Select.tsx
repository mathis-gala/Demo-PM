import { type SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/60",
        className,
      )}
      {...props}
    />
  );
}
