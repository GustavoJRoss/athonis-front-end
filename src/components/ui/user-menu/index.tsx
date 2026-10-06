"use client";

import {
  MenuContent,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  Portal,
} from "@ark-ui/react";
import { cn } from "@/lib/utils/cn";
import { Inline, Text } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import {
  renderMenuItems,
  type MenuAction,
} from "@/components/ui/dropdown-menu";

export type UserMenuProps = {
  name: string;
  email?: string;
  avatarSrc?: string;
  items: MenuAction[];
  onSelect?: (value: string) => void;
  className?: string;
};

export function UserMenu({
  name,
  email,
  avatarSrc,
  items,
  onSelect,
  className,
}: UserMenuProps) {
  return (
    <MenuRoot onSelect={(details) => onSelect?.(details.value)}>
      <MenuTrigger asChild>
        <button
          type="button"
          aria-label={`Menu da conta de ${name}`}
          className={cn(
            "hover:bg-surface-hover flex items-center gap-2 rounded-md p-1 transition-colors",
            className,
          )}
        >
          <Avatar name={name} src={avatarSrc} size="sm" />
        </button>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent className="border-border bg-surface shadow-float z-50 min-w-56 rounded-lg border p-1 outline-none">
            <Inline gap={0}>
              <Avatar name={name} src={avatarSrc} size="sm" className="ml-2" />
              <div className="flex flex-col gap-0.5 px-2.5 py-2">
                <Text size="body-sm" weight="medium">
                  {name}
                </Text>
                {email && (
                  <Text size="caption" color="muted">
                    {email}
                  </Text>
                )}
              </div>
            </Inline>
            {renderMenuItems(items)}
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
}
