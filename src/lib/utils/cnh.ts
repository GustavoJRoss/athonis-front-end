import type { CnhCategory, VehicleType } from "@/types/domain";

/**
 * Regras de CNH que a operação precisa respeitar.
 *
 * A categoria não é dado de arquivo: é o que diz se o motorista pode dirigir
 * aquele veículo. B a E formam uma escala — quem tem E dirige o que B dirige —
 * e A é a parte de moto, que vem sozinha ou combinada (AB..AE).
 */

/** Categoria mínima exigida por tipo de veículo. */
const MINIMA_POR_VEICULO: Record<VehicleType, CnhCategory> = {
  motorcycle: "A",
  // Van e utilitário até 3.500 kg cabem na B. Acima disso é C, e aí a
  // capacidade cadastrada no veículo é que denuncia — não o tipo.
  van: "B",
  utility: "B",
  truck: "C",
};

/** Posição na escala de carga. A fica de fora: é outra habilitação. */
const ESCALA: Record<string, number> = { B: 1, C: 2, D: 3, E: 4 };

function nivelDeCarga(category: CnhCategory): number {
  return Math.max(...category.split("").map((letra) => ESCALA[letra] ?? 0));
}

function habilitaMoto(category: CnhCategory): boolean {
  return category.includes("A");
}

/** O motorista com essa categoria pode dirigir esse tipo de veículo? */
export function podeDirigir(category: CnhCategory, vehicleType: VehicleType): boolean {
  const minima = MINIMA_POR_VEICULO[vehicleType];
  if (minima === "A") return habilitaMoto(category);
  return nivelDeCarga(category) >= nivelDeCarga(minima);
}

export function categoriaMinima(vehicleType: VehicleType): CnhCategory {
  return MINIMA_POR_VEICULO[vehicleType];
}

// -------------------------------------------------------------- Validade

export type CnhValidade =
  | { estado: "sem_data" }
  | { estado: "vencida"; dias: number }
  | { estado: "vence_em_breve"; dias: number }
  | { estado: "valida"; dias: number };

/** A partir de quantos dias antes do vencimento vale avisar. */
export const DIAS_DE_AVISO = 30;

/**
 * Compara só a data, ignorando a hora: uma CNH que vence hoje ainda vale hoje.
 */
export function validadeCnh(expiration: string | null, hoje = new Date()): CnhValidade {
  if (!expiration) return { estado: "sem_data" };

  const [ano, mes, dia] = expiration.slice(0, 10).split("-").map(Number);
  if (!ano || !mes || !dia) return { estado: "sem_data" };

  const vencimento = Date.UTC(ano, mes - 1, dia);
  const referencia = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const dias = Math.round((vencimento - referencia) / 86_400_000);

  if (dias < 0) return { estado: "vencida", dias: Math.abs(dias) };
  if (dias <= DIAS_DE_AVISO) return { estado: "vence_em_breve", dias };
  return { estado: "valida", dias };
}

/** Texto curto para badge e listagem. */
export function validadeCnhLabel(validade: CnhValidade): string | null {
  switch (validade.estado) {
    case "vencida":
      return validade.dias === 1 ? "CNH vencida ontem" : `CNH vencida há ${validade.dias} dias`;
    case "vence_em_breve":
      if (validade.dias === 0) return "CNH vence hoje";
      return validade.dias === 1 ? "CNH vence amanhã" : `CNH vence em ${validade.dias} dias`;
    default:
      return null;
  }
}
