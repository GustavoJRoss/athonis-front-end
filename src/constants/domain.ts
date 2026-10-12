import type { StatusTone } from "@/components/ui/status-badge";
import type {
  CnhCategory,
  DayPeriod,
  OccurrenceType,
  CustomerStatus,
  DriverStatus,
  OrderStatus,
  OrderUrgency,
  RouteStatus,
  VehicleStatus,
  VehicleType,
} from "@/types/domain";

type StatusMeta<T extends string> = Record<T, { label: string; tone: StatusTone }>;

export const ORDER_STATUS_META: StatusMeta<OrderStatus> = {
  pending: { label: "Pendente", tone: "muted" },
  planned: { label: "Planejado", tone: "info" },
  in_route: { label: "Em rota", tone: "primary" },
  delivered: { label: "Entregue", tone: "success" },
  failed: { label: "Não entregue", tone: "danger" },
  delayed: { label: "Atrasado", tone: "danger" },
  cancelled: { label: "Cancelado", tone: "muted" },
};

export const ORDER_URGENCY_META: StatusMeta<OrderUrgency> = {
  low: { label: "Baixa", tone: "muted" },
  normal: { label: "Normal", tone: "info" },
  high: { label: "Alta", tone: "warning" },
  critical: { label: "Crítica", tone: "danger" },
};

export const DRIVER_STATUS_META: StatusMeta<DriverStatus> = {
  available: { label: "Disponível", tone: "success" },
  in_route: { label: "Em rota", tone: "primary" },
  unavailable: { label: "Indisponível", tone: "muted" },
};

export const VEHICLE_STATUS_META: StatusMeta<VehicleStatus> = {
  available: { label: "Disponível", tone: "success" },
  in_use: { label: "Em uso", tone: "primary" },
  maintenance: { label: "Manutenção", tone: "warning" },
  inactive: { label: "Inativo", tone: "muted" },
};

export const ROUTE_STATUS_META: StatusMeta<RouteStatus> = {
  planned: { label: "Planejada", tone: "info" },
  active: { label: "Ativa", tone: "primary" },
  completed: { label: "Concluída", tone: "success" },
  delayed: { label: "Atrasada", tone: "danger" },
  cancelled: { label: "Cancelada", tone: "muted" },
};

export const CUSTOMER_STATUS_META: StatusMeta<CustomerStatus> = {
  active: { label: "Ativo", tone: "success" },
  inactive: { label: "Inativo", tone: "muted" },
};

/**
 * Categorias de CNH. A descrição existe porque quem preenche o cadastro nem
 * sempre sabe de cor o que cada letra habilita.
 */
export const CNH_CATEGORY_OPTIONS: {
  value: CnhCategory;
  label: string;
  description: string;
}[] = [
  { value: "A", label: "A", description: "Moto" },
  { value: "B", label: "B", description: "Carro e utilitário até 3.500 kg" },
  { value: "C", label: "C", description: "Carga acima de 3.500 kg" },
  { value: "D", label: "D", description: "Transporte de passageiros" },
  { value: "E", label: "E", description: "Carreta e combinações" },
  { value: "AB", label: "AB", description: "Moto + carro" },
  { value: "AC", label: "AC", description: "Moto + carga" },
  { value: "AD", label: "AD", description: "Moto + passageiros" },
  { value: "AE", label: "AE", description: "Moto + carreta" },
];

/** Descrição da categoria, para exibir fora da lista. */
export function cnhCategoryDescription(
  category: CnhCategory | null | undefined,
): string | undefined {
  return CNH_CATEGORY_OPTIONS.find((option) => option.value === category)?.description;
}

export const VEHICLE_TYPE_LABEL: Record<VehicleType, string> = {
  van: "Van",
  truck: "Caminhão",
  motorcycle: "Moto",
  utility: "Utilitário",
};

/** Motivos de não entrega registrados pelo entregador no aplicativo. */
export const OCCURRENCE_LABEL: Record<OccurrenceType, string> = {
  customer_absent: "Cliente ausente",
  address_not_found: "Endereço não encontrado",
  refused: "Recusado pelo cliente",
  damaged_goods: "Mercadoria avariada",
  closed_establishment: "Estabelecimento fechado",
  access_restricted: "Acesso restrito",
  traffic: "Trânsito ou via bloqueada",
  other: "Outro motivo",
};

export const DAY_PERIOD_LABEL: Record<DayPeriod, string> = {
  morning: "Manhã",
  afternoon: "Tarde",
  evening: "Noite",
};
