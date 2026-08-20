"use client";

import type { ReactNode } from "react";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from "@ark-ui/react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives/icon";

export type CheckboxProps = {
  label?: ReactNode;
  description?: string;
  error?: string;
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
  className?: string;
};

export function Checkbox({
  label,
  description,
  error,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  required,
  name,
  value,
  id,
  className,
}: CheckboxProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <CheckboxRoot
        id={id}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(details) => onCheckedChange?.(details.checked)}
        disabled={disabled}
        required={required}
        invalid={!!error}
        name={name}
        value={value}
        className="inline-flex cursor-pointer items-start gap-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
      >
        <CheckboxControl
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border border-border bg-surface transition-colors",
            "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
            "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
            "peer-focus-visible:ring-2",
            error && "border-danger",
          )}
        >
          <CheckboxIndicator>
            <Icon icon={Check} size="xs" className="text-primary-foreground" />
          </CheckboxIndicator>
          <CheckboxIndicator indeterminate>
            <Icon icon={Minus} size="xs" className="text-primary-foreground" />
          </CheckboxIndicator>
        </CheckboxControl>
        {label && (
          <CheckboxLabel className="text-body text-foreground select-none">
            {label}
            {required && <span className="text-danger"> *</span>}
          </CheckboxLabel>
        )}
        <CheckboxHiddenInput />
      </CheckboxRoot>
      {error ? (
        <span className="ml-6 text-caption text-danger">{error}</span>
      ) : description ? (
        <span className="ml-6 text-caption text-muted">{description}</span>
      ) : null}
    </div>
  );
}
