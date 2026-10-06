import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { TEXT_COLOR, type TextColor } from "./classnames";

const SIZE = {
  "body-lg": "text-body-lg",
  body: "text-body",
  "body-sm": "text-body-sm",
  caption: "text-caption",
  label: "text-label",
} as const;
export type TextSize = keyof typeof SIZE;

export type { TextColor };

const WEIGHT = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;
export type TextWeight = keyof typeof WEIGHT;

export type TextProps<T extends ElementType = "p"> = {
  as?: T;
  size?: TextSize;
  color?: TextColor;
  weight?: TextWeight;
  className?: string;
  children?: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Text<T extends ElementType = "p">({
  as,
  size = "body",
  color = "foreground",
  weight,
  className,
  children,
  ...rest
}: TextProps<T>) {
  const Component = as || "p";

  return (
    <Component
      className={cn(SIZE[size], TEXT_COLOR[color], weight && WEIGHT[weight], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
