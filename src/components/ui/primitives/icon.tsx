import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TEXT_COLOR, type TextColor } from "./classnames";

const SIZE_PX = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;
export type IconSize = keyof typeof SIZE_PX;

export type IconProps = {
  icon: LucideIcon;
  size?: IconSize;
  color?: TextColor;
  className?: string;
  "aria-label"?: string;
};

/** Wrapper único sobre lucide-react — nenhum componente deve importar ícones diretamente. */
export function Icon({
  icon: LucideIconComponent,
  size = "md",
  color = "inherit",
  className,
  "aria-label": ariaLabel,
}: IconProps) {
  return (
    <LucideIconComponent
      size={SIZE_PX[size]}
      strokeWidth={2}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
      className={cn(TEXT_COLOR[color], "shrink-0", className)}
    />
  );
}
