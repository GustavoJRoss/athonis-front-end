"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  MenuContent,
  MenuItem,
  MenuItemText,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
} from "@ark-ui/react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives";

export type MenuActionItem = {
  value: string;
  label: string;
  icon?: LucideIcon;
  danger?: boolean;
  disabled?: boolean;
};
export type MenuSeparatorItem = { separator: true };
export type MenuAction = MenuActionItem;

export function renderMenuItems(items: MenuAction[]) {
  return items.map((item) => (
    <MenuItem
      key={item.value}
      value={item.value}
      disabled={item.disabled}
      className={cn(
        "text-body-sm text-foreground flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 transition-colors",
        "data-highlighted:bg-surface-hover",
        "data-disabled:pointer-events-none data-disabled:opacity-40",
        item.danger && "text-danger data-highlighted:bg-danger/10",
      )}
    >
      {item.icon && <Icon icon={item.icon} size="sm" />}
      <MenuItemText>{item.label}</MenuItemText>
    </MenuItem>
  ));
}

export type DropdownMenuProps = {
  trigger: ReactNode;
  items: MenuAction[];
  onSelect?: (value: string) => void;
  className?: string;
};

export function DropdownMenu({
  trigger,
  items,
  onSelect,
  className,
}: DropdownMenuProps) {
  return (
    <MenuRoot onSelect={(details) => onSelect?.(details.value)}>
      <MenuTrigger asChild>{trigger}</MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent
            className={cn(
              "border-border bg-surface shadow-float z-50 min-w-48 rounded-lg border p-1 outline-none",
              className,
            )}
          >
            {renderMenuItems(items)}
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
}
