"use client";

import { forwardRef, useId, type ReactNode } from "react";
import { useField } from "@ark-ui/react";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives/icon";

export type InputProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  containerClassName?: string;
  className?: string;
} & Omit<
  React.ComponentPropsWithoutRef<"input">,
  "className" | "disabled" | "required" | "prefix"
>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    description,
    error,
    required,
    disabled,
    loading,
    prefix,
    suffix,
    clearable,
    onClear,
    id: idProp,
    containerClassName,
    className,
    value,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const field = useField({ id, disabled, invalid: !!error, required });

  const showClear = clearable && !!value && !disabled && !loading;

  return (
    <div
      {...field.getRootProps()}
      className={cn("flex flex-col gap-1.5", containerClassName)}
    >
      {label && (
        <label
          {...field.getLabelProps()}
          className="text-label font-medium text-foreground"
        >
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      <div
        className={cn(
          "flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 transition-colors",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          error &&
            "border-danger focus-within:border-danger focus-within:ring-danger/20",
          disabled && "pointer-events-none bg-surface-muted opacity-50",
        )}
      >
        {prefix && (
          <span className="flex shrink-0 items-center text-muted">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          {...field.getInputProps()}
          value={value}
          disabled={disabled}
          className={cn(
            "h-full flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-muted",
            className,
          )}
          {...rest}
        />
        {loading && (
          <Icon icon={Loader2} size="sm" className="shrink-0 animate-spin text-muted" />
        )}
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpar"
            className="flex shrink-0 items-center text-muted hover:text-foreground"
          >
            <Icon icon={X} size="sm" />
          </button>
        )}
        {suffix && (
          <span className="flex shrink-0 items-center text-muted">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <span {...field.getErrorTextProps()} className="text-caption text-danger">
          {error}
        </span>
      ) : description ? (
        <span {...field.getHelperTextProps()} className="text-caption text-muted">
          {description}
        </span>
      ) : null}
    </div>
  );
});
