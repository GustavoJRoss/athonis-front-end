import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const TONE = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
  primary: "bg-primary/10 text-primary",
  muted: "bg-surface-muted text-muted",
} as const;
export type StatusTone = keyof typeof TONE;

export type StatusBadgeProps = {
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
};

export function StatusBadge({ tone = "muted", children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium whitespace-nowrap",
        TONE[tone],
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      {children}
    </span>
  );
}
