import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline" | "sale" | "best" | "pick";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-neutral-900 text-white",
  outline: "border border-neutral-900 text-neutral-900",
  sale: "bg-red-600 text-white",
  best: "bg-emerald-700 text-white",
  pick: "bg-amber-600 text-white",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
