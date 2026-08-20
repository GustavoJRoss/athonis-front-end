"use client";

import type { ReactNode } from "react";
import {
  PopoverAnchor,
  PopoverCloseTrigger,
  PopoverContent as ArkPopoverContent,
  PopoverDescription as ArkPopoverDescription,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle as ArkPopoverTitle,
  PopoverTrigger,
  Portal,
} from "@ark-ui/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives/icon";

export { PopoverRoot, PopoverTrigger, PopoverAnchor };

export function PopoverContent({
  children,
  className,
  showClose = false,
}: {
  children: ReactNode;
  className?: string;
  showClose?: boolean;
}) {
  return (
    <Portal>
      <PopoverPositioner>
        <ArkPopoverContent
          className={cn(
            "relative z-50 min-w-48 rounded-lg border border-border bg-surface p-3 shadow-float outline-none",
            className,
          )}
        >
          {showClose && (
            <PopoverCloseTrigger
              aria-label="Fechar"
              className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground"
            >
              <Icon icon={X} size="xs" />
            </PopoverCloseTrigger>
          )}
          {children}
        </ArkPopoverContent>
      </PopoverPositioner>
    </Portal>
  );
}

export function PopoverTitle({ children }: { children: ReactNode }) {
  return <ArkPopoverTitle className="text-label font-semibold text-foreground">{children}</ArkPopoverTitle>;
}

export function PopoverDescription({ children }: { children: ReactNode }) {
  return <ArkPopoverDescription className="text-body-sm text-muted">{children}</ArkPopoverDescription>;
}
