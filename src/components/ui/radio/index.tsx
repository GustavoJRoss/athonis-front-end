"use client";

import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
} from "@ark-ui/react";
import { cn } from "@/lib/utils/cn";

export type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type RadioProps = {
  label?: string;
  description?: string;
  error?: string;
  options: RadioOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export function Radio({
  label,
  description,
  error,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  name,
  orientation = "vertical",
  className,
}: RadioProps) {
  return (
    <RadioGroupRoot
      value={value}
      defaultValue={defaultValue}
      onValueChange={(details) => onValueChange?.(details.value)}
      disabled={disabled}
      required={required}
      invalid={!!error}
      name={name}
      orientation={orientation}
      className={cn("flex flex-col gap-2", className)}
    >
      {label && (
        <RadioGroupLabel className="text-label font-medium text-foreground">
          {label}
          {required && <span className="text-danger"> *</span>}
        </RadioGroupLabel>
      )}
      <div
        className={cn(
          "flex gap-3",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        )}
      >
        {options.map((option) => (
          <RadioGroupItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="inline-flex cursor-pointer items-center gap-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
          >
            <RadioGroupItemControl
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-surface transition-colors",
                "data-[state=checked]:border-primary",
                "after:size-2 after:scale-0 after:rounded-full after:bg-primary after:transition-transform",
                "data-[state=checked]:after:scale-100",
                error && "border-danger",
              )}
            />
            <RadioGroupItemText className="text-body text-foreground select-none">
              {option.label}
            </RadioGroupItemText>
            <RadioGroupItemHiddenInput />
          </RadioGroupItem>
        ))}
      </div>
      {error ? (
        <span className="text-caption text-danger">{error}</span>
      ) : description ? (
        <span className="text-caption text-muted">{description}</span>
      ) : null}
    </RadioGroupRoot>
  );
}
