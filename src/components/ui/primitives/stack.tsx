import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { Spacing } from "@/types/design-system";
import { ALIGN, GAP, JUSTIFY, type Align, type Justify } from "./classnames";

export type StackProps<T extends ElementType = "div"> = {
  as?: T;
  gap?: Spacing;
  align?: Align;
  justify?: Justify;
  className?: string;
  children?: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** Empilha filhos verticalmente (flex column) com gap consistente. */
export function Stack<T extends ElementType = "div">({
  as,
  gap = 4,
  align,
  justify,
  className,
  children,
  ...rest
}: StackProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={cn(
        "flex flex-col",
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
