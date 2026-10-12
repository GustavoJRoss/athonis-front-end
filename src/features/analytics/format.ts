/**
 * Formatação dos indicadores de campo. Um valor nulo significa "sem dado
 * para calcular" e vira travessão — nunca zero, que afirmaria uma medição.
 */

export function dash(value: number | null | undefined): string {
  return value == null ? "—" : String(value);
}

export function formatPercent(value: number | null | undefined): string {
  return value == null ? "—" : `${String(value).replace(".", ",")}%`;
}

export function formatKm(meters: number | null | undefined): string {
  return meters == null ? "—" : `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
}

export function formatMinutes(minutes: number | null | undefined): string {
  if (minutes == null) return "—";
  const total = Math.round(minutes);
  if (Math.abs(total) < 60) return `${String(Math.round(minutes * 10) / 10).replace(".", ",")} min`;
  const rest = total % 60;
  return rest === 0 ? `${Math.floor(total / 60)} h` : `${Math.floor(total / 60)} h ${rest} min`;
}

/** Atraso com sinal: "+12 min" chegou depois do previsto, "−5 min" chegou antes. */
export function formatSignedMinutes(minutes: number | null | undefined): string {
  if (minutes == null) return "—";
  const rounded = Math.round(minutes);
  if (rounded === 0) return "No horário";
  return `${rounded > 0 ? "+" : "−"}${formatMinutes(Math.abs(rounded))}`;
}

export function formatClock(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
