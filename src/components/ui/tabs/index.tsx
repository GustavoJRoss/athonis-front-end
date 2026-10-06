"use client";

import type { ReactNode } from "react";
import { Tabs as ArkTabs } from "@ark-ui/react";
import { cn } from "@/lib/utils/cn";

export type TabItem = {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function Tabs({ items, value, defaultValue, onValueChange, className }: TabsProps) {
  return (
    <ArkTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={(details) => onValueChange?.(details.value ?? "")}
      className={cn("flex flex-col gap-4", className)}
    >
      <ArkTabs.List className="relative flex items-center gap-1 border-b border-border-subtle">
        {items.map((item) => (
          <ArkTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className="px-3 py-2 text-body-sm font-medium text-muted transition-colors hover:text-foreground data-[selected]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
          >
            {item.label}
          </ArkTabs.Trigger>
        ))}
        <ArkTabs.Indicator className="h-0.5 rounded-full bg-primary" />
      </ArkTabs.List>
      {items.map((item) => (
        <ArkTabs.Content key={item.value} value={item.value}>
          {item.content}
        </ArkTabs.Content>
      ))}
    </ArkTabs.Root>
  );
}
