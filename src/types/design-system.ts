/** Escala de spacing suportada pelas primitives de layout — mesma escala do Tailwind. */
export const SPACING_SCALE = [
  0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32,
] as const;
export type Spacing = (typeof SPACING_SCALE)[number];

export const RADIUS_SCALE = ["none", "sm", "md", "lg", "xl", "full"] as const;
export type Radius = (typeof RADIUS_SCALE)[number];

export const SURFACE_SCALE = [
  "background",
  "surface",
  "surface-muted",
  "surface-hover",
  "surface-active",
  "transparent",
] as const;
export type Surface = (typeof SURFACE_SCALE)[number];

export const BORDER_SCALE = ["none", "default", "subtle"] as const;
export type Border = (typeof BORDER_SCALE)[number];
