"use client";

import { forwardRef, useId } from "react";
import { useField } from "@ark-ui/react";
import { cn } from "@/lib/utils/cn";

export type TextareaProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  className?: string;
} & Omit<
  React.ComponentPropsWithoutRef<"textarea">,
  "className" | "disabled" | "required"
>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      description,
      error,
      required,
      disabled,
      id: idProp,
      containerClassName,
      className,
      rows = 4,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const field = useField({ id, disabled, invalid: !!error, required });

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
        <textarea
          ref={ref}
          rows={rows}
          {...field.getTextareaProps()}
          disabled={disabled}
          className={cn(
            "resize-y rounded-md border border-border bg-surface px-3 py-2 text-body text-foreground outline-none transition-colors placeholder:text-muted",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            disabled && "pointer-events-none bg-surface-muted opacity-50",
            className,
          )}
          {...rest}
        />
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
  },
);
