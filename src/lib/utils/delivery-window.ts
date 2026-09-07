import type { SelectOption } from "@/components/ui/select";

/**
 * Janela de entrega.
 *
 * Não é obrigatória: a maioria das entregas pode acontecer em qualquer horário
 * do expediente. Vazio significa exatamente isso — "dia todo" — e não a
 * ausência de informação.
 */
export const ANY_TIME = "";

export const DELIVERY_WINDOW_OPTIONS: SelectOption[] = [
  { value: ANY_TIME, label: "Dia todo" },
  { value: "08:00 - 12:00", label: "08:00 - 12:00 (manhã)" },
  { value: "13:00 - 17:00", label: "13:00 - 17:00 (tarde)" },
  { value: "18:00 - 22:00", label: "18:00 - 22:00 (noite)" },
];

/** Como a janela aparece nas listagens e detalhes. */
export function deliveryWindowLabel(value: string | null | undefined): string {
  return value?.trim() ? value : "Dia todo";
}

/**
 * Duração da janela em horas, calculada a partir do próprio texto
 * ("08:00 - 12:00" → 4). Antes havia uma tabela fixa com travessão (–)
 * enquanto o formulário gravava hífen (-), então a busca nunca casava e o
 * indicador ficava sempre no valor padrão.
 *
 * Sem janela, vale o expediente da empresa.
 */
export function deliveryWindowHours(
  value: string | null | undefined,
  fullDayHours: number,
): number {
  const texto = value?.trim();
  if (!texto) return fullDayHours;

  const partes = texto.match(/(\d{1,2}):(\d{2})\s*[-–—a]\s*(\d{1,2}):(\d{2})/);
  if (!partes) return fullDayHours;

  const inicio = Number(partes[1]) * 60 + Number(partes[2]);
  const fim = Number(partes[3]) * 60 + Number(partes[4]);
  const minutos = fim - inicio;

  return minutos > 0 ? minutos / 60 : fullDayHours;
}

/** Horas de expediente da empresa; 8h quando ela não cadastrou os horários. */
export function fullDayHours(start?: string | null, end?: string | null): number {
  if (!start || !end) return 8;
  const horas = deliveryWindowHours(`${start} - ${end}`, 8);
  return horas;
}
