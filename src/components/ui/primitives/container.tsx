import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const MAX_WIDTH = {
  content: "max-w-3xl",
  default: "max-w-7xl",
  full: "max-w-none",
} as const;
export type ContainerWidth = keyof typeof MAX_WIDTH;

export type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  width?: ContainerWidth;
  className?: string;
  children?: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** Centraliza e limita a largura do conteúdo, com padding horizontal responsivo. */
export function Container<T extends ElementType = "div">({
  as,
  width = "default",
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        MAX_WIDTH[width],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
