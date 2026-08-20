import type { StatusTone } from "@/components/ui/status-badge";
import type {
  CustomerStatus,
  DriverStatus,
  OrderStatus,
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

export const VEHICLE_TYPE_LABEL: Record<VehicleType, string> = {
  van: "Van",
  truck: "Caminhão",
  motorcycle: "Moto",
  utility: "Utilitário",
};
