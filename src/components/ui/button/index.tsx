"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives/icon";

const VARIANT = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active",
  tertiary:
    "bg-transparent text-foreground border border-border hover:bg-surface-hover active:bg-surface-active",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-hover active:bg-surface-active",
  destructive:
    "bg-danger text-danger-foreground hover:bg-danger/90 active:bg-danger/80",
} as const;
export type ButtonVariant = keyof typeof VARIANT;

const SIZE = {
  sm: "h-8 px-3 text-body-sm gap-1.5",
  md: "h-10 px-4 text-body gap-2",
  lg: "h-12 px-5 text-body-lg gap-2",
} as const;
export type ButtonSize = keyof typeof SIZE;

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<"button">, "className">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          VARIANT[variant],
          SIZE[size],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {loading && <Icon icon={Loader2} size="sm" className="animate-spin" />}
        {children}
      </button>
    );
  },
);
