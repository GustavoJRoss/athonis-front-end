import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { Border, Radius, Spacing, Surface } from "@/types/design-system";
import { BORDER, PADDING, PADDING_X, PADDING_Y, RADIUS, SURFACE_BG } from "./classnames";

export type BoxProps<T extends ElementType = "div"> = {
  as?: T;
  padding?: Spacing;
  paddingX?: Spacing;
  paddingY?: Spacing;
  surface?: Surface;
  radius?: Radius;
  border?: Border;
  className?: string;
  children?: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Box<T extends ElementType = "div">({
  as,
  padding,
  paddingX,
  paddingY,
  surface,
  radius,
  border,
  className,
  children,
  ...rest
}: BoxProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={cn(
        padding !== undefined && PADDING[padding],
        paddingX !== undefined && PADDING_X[paddingX],
        paddingY !== undefined && PADDING_Y[paddingY],
        surface && SURFACE_BG[surface],
        radius && RADIUS[radius],
        border && BORDER[border],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
