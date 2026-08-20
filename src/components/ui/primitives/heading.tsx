import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { TEXT_COLOR, type TextColor } from "./classnames";

const LEVEL = {
  display: { className: "text-display", element: "h1" },
  1: { className: "text-heading-1", element: "h1" },
  2: { className: "text-heading-2", element: "h2" },
  3: { className: "text-heading-3", element: "h3" },
  4: { className: "text-heading-4", element: "h4" },
} as const;
export type HeadingLevel = keyof typeof LEVEL;

export type HeadingColor = TextColor;

export type HeadingProps = {
  level?: HeadingLevel;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: HeadingColor;
  className?: string;
  children?: ReactNode;
  id?: string;
};

export function Heading({
  level = 1,
  as,
  color = "foreground",
  className,
  children,
  id,
}: HeadingProps) {
  const { className: sizeClass, element } = LEVEL[level];
  const Component = as || element;

  return (
    <Component id={id} className={cn(sizeClass, TEXT_COLOR[color], className)}>
      {children}
    </Component>
  );
}
