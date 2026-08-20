import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { Spacing } from "@/types/design-system";
import { ALIGN, GAP, JUSTIFY, type Align, type Justify } from "./classnames";

export type InlineProps<T extends ElementType = "div"> = {
  as?: T;
  gap?: Spacing;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** Alinha filhos horizontalmente (flex row) com gap consistente. */
export function Inline<T extends ElementType = "div">({
  as,
  gap = 2,
  align = "center",
  justify,
  wrap = false,
  className,
  children,
  ...rest
}: InlineProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={cn(
        "flex flex-row",
        wrap && "flex-wrap",
        GAP[gap],
        align && ALIGN[align],
        justify && JUSTIFY[justify],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
