import type { Border, Radius, Spacing, Surface } from "@/types/design-system";

/**
 * Mapas de token → classe Tailwind literal. Tailwind escaneia o código-fonte
 * procurando strings de classe completas — construir a classe via template
 * string (`p-${n}`) não funciona, então cada combinação fica explícita aqui.
 */
export const PADDING: Record<Spacing, string> = {
  0: "p-0",
  0.5: "p-0.5",
  1: "p-1",
  1.5: "p-1.5",
  2: "p-2",
  3: "p-3",
  4: "p-4",
  5: "p-5",
  6: "p-6",
  8: "p-8",
  10: "p-10",
  12: "p-12",
  16: "p-16",
  20: "p-20",
  24: "p-24",
  32: "p-32",
};

export const PADDING_X: Record<Spacing, string> = {
  0: "px-0",
  0.5: "px-0.5",
  1: "px-1",
  1.5: "px-1.5",
  2: "px-2",
  3: "px-3",
  4: "px-4",
  5: "px-5",
  6: "px-6",
  8: "px-8",
  10: "px-10",
  12: "px-12",
  16: "px-16",
  20: "px-20",
  24: "px-24",
  32: "px-32",
};

export const PADDING_Y: Record<Spacing, string> = {
  0: "py-0",
  0.5: "py-0.5",
  1: "py-1",
  1.5: "py-1.5",
  2: "py-2",
  3: "py-3",
  4: "py-4",
  5: "py-5",
  6: "py-6",
  8: "py-8",
  10: "py-10",
  12: "py-12",
  16: "py-16",
  20: "py-20",
  24: "py-24",
  32: "py-32",
};

export const GAP: Record<Spacing, string> = {
  0: "gap-0",
  0.5: "gap-0.5",
  1: "gap-1",
  1.5: "gap-1.5",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
  20: "gap-20",
  24: "gap-24",
  32: "gap-32",
};

export const RADIUS: Record<Radius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const SURFACE_BG: Record<Surface, string> = {
  background: "bg-background",
  surface: "bg-surface",
  "surface-muted": "bg-surface-muted",
  "surface-hover": "bg-surface-hover",
  "surface-active": "bg-surface-active",
  transparent: "bg-transparent",
};

export const BORDER: Record<Border, string> = {
  none: "",
  default: "border border-border",
  subtle: "border border-border-subtle",
};

export const TEXT_COLOR = {
  foreground: "text-foreground",
  muted: "text-muted",
  primary: "text-primary",
  "primary-foreground": "text-primary-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  inherit: "text-inherit",
} as const;
export type TextColor = keyof typeof TEXT_COLOR;

export const ALIGN = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;
export type Align = keyof typeof ALIGN;

export const JUSTIFY = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;
export type Justify = keyof typeof JUSTIFY;

export const GRID_COLUMNS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
} as const;
export type GridColumns = keyof typeof GRID_COLUMNS;
