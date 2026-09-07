/**
 * Conversão entre a data em texto (AAAA-MM-DD, como o backend guarda) e o
 * `Date` que o DatePicker usa.
 *
 * Montamos a data componente a componente de propósito: `new Date("2026-03-01")`
 * é interpretado como UTC e, em fuso negativo, exibe o dia anterior.
 */

export function parseDateString(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function formatDateString(date: Date | null): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Data em DD/MM/AAAA para leitura em tela. */
export function formatDateBr(value: string | null | undefined): string {
  const date = parseDateString(value);
  if (!date) return "—";
  return date.toLocaleDateString("pt-BR");
}
