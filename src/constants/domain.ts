import type { StatusTone } from "@/components/ui/status-badge";
import type {
  CnhCategory,
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
export const CNH_CATEGORY_OPTIONS: { value: CnhCategory; label: string }[] = [
  { value: "A", label: "A — moto" },
  { value: "B", label: "B — carro e utilitário até 3.500 kg" },
  { value: "C", label: "C — carga acima de 3.500 kg" },
  { value: "D", label: "D — transporte de passageiros" },
  { value: "E", label: "E — carreta e combinações" },
  { value: "AB", label: "AB — moto + carro" },
  { value: "AC", label: "AC — moto + carga" },
  { value: "AD", label: "AD — moto + passageiros" },
  { value: "AE", label: "AE — moto + carreta" },
];

export const VEHICLE_TYPE_LABEL: Record<VehicleType, string> = {
  van: "Van",
  truck: "Caminhão",
  motorcycle: "Moto",
  utility: "Utilitário",
};
