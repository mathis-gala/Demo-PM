import { type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "soft" | "outline";
};

const badgeClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "rounded-full border px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ring-slate-200 bg-white text-slate-700",
  soft: "rounded-full px-2 py-0.5 text-[11px] font-medium bg-slate-50 text-slate-800",
  outline:
    "rounded-full border px-2 py-0.5 text-[11px] font-medium border-slate-200 bg-white text-slate-700",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <span className={cn(badgeClasses[variant], className)} {...props} />;
}
