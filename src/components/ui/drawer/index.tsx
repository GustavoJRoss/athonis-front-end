"use client";

import type { ReactNode } from "react";
import {
  DrawerBackdrop,
  DrawerCloseTrigger,
  DrawerContent as ArkDrawerContent,
  DrawerDescription as ArkDrawerDescription,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle as ArkDrawerTitle,
  DrawerTrigger,
  Portal,
} from "@ark-ui/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives/icon";

export { DrawerRoot, DrawerTrigger };

const SIDE_POSITIONER = {
  right: "justify-end",
  left: "justify-start",
  bottom: "items-end",
  top: "items-start",
} as const;
export type DrawerSide = keyof typeof SIDE_POSITIONER;

const SWIPE_DIRECTION: Record<DrawerSide, "end" | "start" | "down" | "up"> = {
  right: "end",
  left: "start",
  bottom: "down",
  top: "up",
};

const SIDE_CONTENT = {
  right: "h-full w-full max-w-sm data-[state=closed]:translate-x-full",
  left: "h-full w-full max-w-sm data-[state=closed]:-translate-x-full",
  bottom: "w-full max-h-[85vh] rounded-t-lg data-[state=closed]:translate-y-full",
  top: "w-full max-h-[85vh] rounded-b-lg data-[state=closed]:-translate-y-full",
} as const;

export function getDrawerSwipeDirection(side: DrawerSide) {
  return SWIPE_DIRECTION[side];
}

export type DrawerContentProps = {
  side?: DrawerSide;
  children: ReactNode;
  className?: string;
};

export function DrawerContent({ side = "right", children, className }: DrawerContentProps) {
  return (
    <Portal>
      <DrawerBackdrop className="fixed inset-0 z-40 bg-foreground/40" />
      <DrawerPositioner
        className={cn("fixed inset-0 z-50 flex", SIDE_POSITIONER[side])}
      >
        <ArkDrawerContent
          className={cn(
            "flex flex-col border-border bg-surface shadow-overlay transition-transform",
            SIDE_CONTENT[side],
            className,
          )}
        >
          {children}
        </ArkDrawerContent>
      </DrawerPositioner>
    </Portal>
  );
}

export function DrawerHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-border-subtle px-6 py-4",
        className,
      )}
    >
      <div className="flex flex-col gap-1">{children}</div>
      <DrawerCloseTrigger
        aria-label="Fechar"
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground"
      >
        <Icon icon={X} size="sm" />
      </DrawerCloseTrigger>
    </div>
  );
}

export function DrawerTitle({ children }: { children: ReactNode }) {
  return <ArkDrawerTitle className="text-heading-4 text-foreground">{children}</ArkDrawerTitle>;
}

export function DrawerDescription({ children }: { children: ReactNode }) {
  return <ArkDrawerDescription className="text-body-sm text-muted">{children}</ArkDrawerDescription>;
}

export function DrawerBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)}>{children}</div>;
}

export function DrawerFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-border-subtle px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
