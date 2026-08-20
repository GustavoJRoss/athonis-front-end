/**
 * Cores para uso em SVG (recharts) — não são classes Tailwind, então
 * referenciam a variável CSS "crua" (`--primary`), não o namespace de tema
 * do Tailwind (`--color-primary`, que só existe dentro de classes utilitárias
 * por causa do `@theme inline` em tokens.css).
 */
export const CHART_COLOR = {
  primary: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  info: "var(--info)",
  muted: "var(--muted)",
  foreground: "var(--foreground)",
  border: "var(--border-subtle)",
} as const;

export const CHART_SERIES_PALETTE = [
  CHART_COLOR.primary,
  CHART_COLOR.success,
  CHART_COLOR.warning,
  CHART_COLOR.info,
  CHART_COLOR.danger,
  CHART_COLOR.muted,
];
