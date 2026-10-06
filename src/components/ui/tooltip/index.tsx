"use client";

import type { ReactNode } from "react";
import {
  TooltipContent as ArkTooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
  Portal,
} from "@ark-ui/react";
import { cn } from "@/lib/utils/cn";

export { TooltipRoot, TooltipTrigger };

export function TooltipContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Portal>
      <TooltipPositioner>
        <ArkTooltipContent
          className={cn(
            "z-50 rounded-md bg-foreground px-2 py-1 text-caption text-background",
            className,
          )}
        >
          {children}
        </ArkTooltipContent>
      </TooltipPositioner>
    </Portal>
  );
}
