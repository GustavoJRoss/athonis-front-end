"use client";

import type { ReactNode } from "react";
import {
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
} from "@ark-ui/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives/icon";

export type SwitchProps = {
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  name?: string;
  value?: string;
  id?: string;
  className?: string;
};

export function Switch({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  loading,
  name,
  value,
  id,
  className,
}: SwitchProps) {
  return (
    <SwitchRoot
      id={id}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(details) => onCheckedChange?.(details.checked)}
      disabled={disabled || loading}
      name={name}
      value={value}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className,
      )}
    >
      <SwitchControl
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-surface-active transition-colors",
          "data-[state=checked]:bg-primary",
        )}
      >
        <SwitchThumb
          className={cn(
            "flex size-4 translate-x-0.5 items-center justify-center rounded-full bg-surface shadow-none transition-transform",
            "data-[state=checked]:translate-x-[18px]",
          )}
        >
          {loading && (
            <Icon icon={Loader2} size="xs" className="animate-spin text-muted" />
          )}
        </SwitchThumb>
      </SwitchControl>
      {label && (
        <SwitchLabel className="text-body text-foreground select-none">
          {label}
        </SwitchLabel>
      )}
      <SwitchHiddenInput />
    </SwitchRoot>
  );
}
