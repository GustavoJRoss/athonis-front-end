import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { Spacing } from "@/types/design-system";
import { GAP, GRID_COLUMNS, type GridColumns } from "./classnames";

export type GridProps<T extends ElementType = "div"> = {
  as?: T;
  columns?: GridColumns;
  gap?: Spacing;
  className?: string;
  children?: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Grid<T extends ElementType = "div">({
  as,
  columns = 1,
  gap = 4,
  className,
  children,
  ...rest
}: GridProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={cn("grid", GRID_COLUMNS[columns], GAP[gap], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
