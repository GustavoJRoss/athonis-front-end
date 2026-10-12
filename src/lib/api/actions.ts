"use server";

/**
 * Server Actions que substituem os mocks: falam com a API real usando o token
 * da sessão (cookie httpOnly), que nunca chega ao navegador.
 *
 * A UI continua consumindo a mesma interface list/get/create/update/remove.
 */

import { createAuthenticatedApiClient } from "./client";
import { toApiErrorMessage } from "./errors";
import { getSessionToken } from "@/lib/auth/session";
import {
  mapCompany,
  mapCustomer,
  mapDriver,
  mapOrder,
  mapRoute,
  mapVehicle,
  toApiClient,
  toApiCompany,
  toApiDriver,
  toApiOrder,
  toApiVehicle,
  type ApiClient,
  type ApiCompany,
  type ApiDriver,
  type ApiOrder,
  type ApiRoute,
  type ApiVehicle,
} from "./mappers";
import type {
  Company,
  Customer,
  Driver,
  DriverAccess,
  FieldDriverStats,
  FieldOccurrences,
  FieldOverview,
  FieldRegionStats,
  FieldRouteSummary,
  Order,
  RouteComparison,
  OrderImportResult,
  Route,
  Vehicle,
} from "@/types/domain";
import type { CustomerFormInput } from "@/lib/validation/customer";
import type { DriverFormInput } from "@/lib/validation/driver";
import type { OrderFormInput } from "@/lib/validation/order";
import type { VehicleFormInput } from "@/lib/validation/vehicle";
import type { CompanyFormInput } from "@/lib/validation/company";

/**
 * As telas paginam no cliente (DataTable), então buscamos uma página ampla.
 * Quando o volume crescer, o caminho é paginação server-side no DataTable.
 */
const PAGE_SIZE = 200;

type Paginated<T> = { items?: T[]; meta?: { total: number } };

async function request<T>(fn: (api: Awaited<ReturnType<typeof createAuthenticatedApiClient>>) => Promise<T>): Promise<T> {
  const api = await createAuthenticatedApiClient();
  try {
    return await fn(api);
  } catch (error) {
    // A mensagem real do backend (inclusive erros por campo) é preservada;
    // Error é o que atravessa a fronteira de Server Action sem perder texto.
    throw new Error(toApiErrorMessage(error));
  }
}


// ----------------------------------------------------------------- Empresa

/**
 * Dados da empresa do usuário logado.
 *
 * Não existe ação de criar empresa: um tenant novo é criado no banco
 * (scripts/create-company.js), por quem administra o sistema.
 */
export async function getCompany(): Promise<Company> {
  return request(async (api) => {
    const { data } = await api.get<ApiCompany>("/company");
    return mapCompany(data);
  });
}

export async function updateCompany(input: CompanyFormInput): Promise<Company> {
  return request(async (api) => {
    const { data } = await api.patch<ApiCompany>("/company", toApiCompany(input));
    return mapCompany(data);
  });
}

// ------------------------------------------------------------- Clientes

export async function listCustomers(): Promise<Customer[]> {
  return request(async (api) => {
    const { data } = await api.get<Paginated<ApiClient>>("/clients", {
      params: { page: 1, limit: PAGE_SIZE, sort_by: "name", order: "ASC" },
    });
    return (data.items ?? []).map(mapCustomer);
  });
}

export async function createCustomer(input: CustomerFormInput): Promise<Customer> {
  return request(async (api) => {
    const { data } = await api.post<ApiClient>("/clients", toApiClient(input));
    return mapCustomer(data);
  });
}

export async function updateCustomer(id: string, input: CustomerFormInput): Promise<Customer> {
  return request(async (api) => {
    const { data } = await api.patch<ApiClient>(`/clients/${id}`, toApiClient(input));
    return mapCustomer(data);
  });
}

export async function deleteCustomer(id: string): Promise<void> {
  await request(async (api) => api.delete(`/clients/${id}`));
}

// ------------------------------------------------------------ Motoristas

export async function listDrivers(): Promise<Driver[]> {
  return request(async (api) => {
    const { data } = await api.get<Paginated<ApiDriver>>("/drivers", {
      params: { page: 1, limit: PAGE_SIZE, sort_by: "name", order: "ASC" },
    });
    return (data.items ?? []).map(mapDriver);
  });
}

export async function createDriver(input: DriverFormInput): Promise<Driver> {
  return request(async (api) => {
    const { data } = await api.post<ApiDriver>("/drivers", toApiDriver(input));
    return mapDriver(data);
  });
}

export async function updateDriver(id: string, input: DriverFormInput): Promise<Driver> {
  return request(async (api) => {
    const { data } = await api.patch<ApiDriver>(`/drivers/${id}`, toApiDriver(input));
    return mapDriver(data);
  });
}

export async function deleteDriver(id: string): Promise<void> {
  await request(async (api) => api.delete(`/drivers/${id}`));
}

// -------------------------------------------------------------- Veículos

export async function listVehicles(): Promise<Vehicle[]> {
  return request(async (api) => {
    const { data } = await api.get<Paginated<ApiVehicle>>("/vehicles", {
      params: { page: 1, limit: PAGE_SIZE, sort_by: "name", order: "ASC" },
    });
    return (data.items ?? []).map(mapVehicle);
  });
}

export async function createVehicle(input: VehicleFormInput): Promise<Vehicle> {
  return request(async (api) => {
    const { data } = await api.post<ApiVehicle>("/vehicles", toApiVehicle(input));
    return mapVehicle(data);
  });
}

export async function updateVehicle(id: string, input: VehicleFormInput): Promise<Vehicle> {
  return request(async (api) => {
    const { data } = await api.patch<ApiVehicle>(`/vehicles/${id}`, toApiVehicle(input));
    return mapVehicle(data);
  });
}

export async function deleteVehicle(id: string): Promise<void> {
  await request(async (api) => api.delete(`/vehicles/${id}`));
}

// --------------------------------------------------------------- Pedidos

export async function listOrders(): Promise<Order[]> {
  return request(async (api) => {
    const { data } = await api.get<Paginated<ApiOrder>>("/orders", {
      params: { page: 1, limit: PAGE_SIZE, sort_by: "order_id", order: "DESC" },
    });
    return (data.items ?? []).map(mapOrder);
  });
}

export async function createOrder(input: OrderFormInput): Promise<Order> {
  return request(async (api) => {
    const { data } = await api.post<ApiOrder>("/orders", toApiOrder(input));
    return mapOrder(data);
  });
}

export async function updateOrder(id: string, input: OrderFormInput): Promise<Order> {
  return request(async (api) => {
    const { data } = await api.patch<ApiOrder>(`/orders/${id}`, toApiOrder(input));
    return mapOrder(data);
  });
}

export async function deleteOrder(id: string): Promise<void> {
  await request(async (api) => api.delete(`/orders/${id}`));
}

/**
 * Importação em massa via CSV. O arquivo chega como `FormData` (montado no
 * cliente com `new FormData()`), que o Server Action aceita nativamente.
 *
 * Vai por `fetch` nativo, não pelo axios: o adapter Node do axios não está
 * serializando corretamente o multipart dentro do runtime do `next dev`
 * (o backend recebia a requisição sem o arquivo), enquanto `fetch` com
 * `FormData` funciona normalmente.
 */
export async function importOrders(formData: FormData): Promise<OrderImportResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Nenhum arquivo foi enviado");
  }

  const token = await getSessionToken();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const uploadForm = new FormData();
  uploadForm.append("file", file, file.name);

  const response = await fetch(`${apiUrl}/order-imports/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: uploadForm,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(toApiErrorMessage({ response: { status: response.status, data } }));
  }

  return data as OrderImportResult;
}

// ----------------------------------------------------------------- Rotas

export async function listRoutes(): Promise<Route[]> {
  return request(async (api) => {
    const { data } = await api.get<ApiRoute[]>("/routes");
    return (Array.isArray(data) ? data : []).map(mapRoute);
  });
}

export async function deleteRoute(id: string): Promise<void> {
  await request(async (api) => api.delete(`/routes/${id}`));
}

/** Rota sai para a rua: pedidos, motorista e veículo entram em trânsito. */
export async function startRoute(id: string): Promise<Route> {
  return request(async (api) => {
    const { data } = await api.post<ApiRoute>(`/routes/${id}/start`);
    return mapRoute(data);
  });
}

/** Encerra a rota, dando como entregues as paradas ainda em aberto. */
export async function completeRoute(id: string): Promise<Route> {
  return request(async (api) => {
    const { data } = await api.post<ApiRoute>(`/routes/${id}/complete`);
    return mapRoute(data);
  });
}

/** Devolve os pedidos para a fila, mantendo o registro da rota. */
export async function cancelRoute(id: string): Promise<Route> {
  return request(async (api) => {
    const { data } = await api.post<ApiRoute>(`/routes/${id}/cancel`);
    return mapRoute(data);
  });
}

/**
 * Baixa de uma parada. É o que o aplicativo do entregador vai chamar a cada
 * entrega; quando é a última, a rota se encerra sozinha.
 */
export async function deliverRouteStop(routeId: string, orderId: string): Promise<Route> {
  return request(async (api) => {
    const { data } = await api.post<ApiRoute>(`/routes/${routeId}/orders/${orderId}/deliver`);
    return mapRoute(data);
  });
}

/** Verifica quais pedidos podem ser roteirizados, com o motivo de cada exclusão. */
export async function validateOrdersForRoute(orderIds: string[]): Promise<{
  validOrders: number[];
  unassigned: Array<{ orderId: number; reason: string }>;
}> {
  return request(async (api) => {
    const { data } = await api.post("/optimization-routes/validate-orders", {
      orderIds: orderIds.map(Number),
    });
    return {
      validOrders: data?.validOrders ?? [],
      unassigned: data?.unassigned ?? [],
    };
  });
}

/** Gera as rotas otimizadas para os pedidos selecionados. */
export async function optimizeRoutes(orderIds: string[]): Promise<{
  totalRoutes: number;
  simulated: boolean;
  message: string;
  unassignedOrders: Array<{ orderId: number; reason: string }>;
}> {
  return request(async (api) => {
    const { data } = await api.post("/optimization-routes/optimize", {
      orderIds: orderIds.map(Number),
    });
    return {
      totalRoutes: data?.totalRoutes ?? 0,
      simulated: data?.simulated ?? false,
      message: data?.message ?? "",
      unassignedOrders: data?.unassignedOrders ?? [],
    };
  });
}

// ------------------------------------------------ Acesso ao aplicativo

type ApiDriverAccess = {
  driver_id: number;
  has_access: boolean;
  email: string | null;
  is_active: boolean;
  last_login: string | null;
};

function mapDriverAccess(data: ApiDriverAccess): DriverAccess {
  return {
    driverId: String(data.driver_id),
    hasAccess: data.has_access,
    email: data.email,
    isActive: data.is_active,
    lastLogin: data.last_login,
  };
}

export async function getDriverAccess(driverId: string): Promise<DriverAccess> {
  return request(async (api) => {
    const { data } = await api.get<ApiDriverAccess>(`/drivers/${driverId}/access`);
    return mapDriverAccess(data);
  });
}

/** Cria o login do motorista ou, se já existir, troca e-mail e senha. */
export async function grantDriverAccess(
  driverId: string,
  input: { email: string; password: string },
): Promise<DriverAccess> {
  return request(async (api) => {
    const { data } = await api.put<ApiDriverAccess>(`/drivers/${driverId}/access`, input);
    return mapDriverAccess(data);
  });
}

export async function revokeDriverAccess(driverId: string): Promise<void> {
  await request(async (api) => api.delete(`/drivers/${driverId}/access`));
}

// ---------------------------------------------------- Execução em campo

/** Período em dias (AAAA-MM-DD). Sem valores, o backend usa os últimos 30 dias. */
export type AnalyticsRange = { from?: string; to?: string };

/* eslint-disable @typescript-eslint/no-explicit-any -- respostas de leitura,
   convertidas campo a campo logo abaixo */

export async function getFieldOverview(range: AnalyticsRange): Promise<FieldOverview> {
  return request(async (api) => {
    const { data } = await api.get<any>("/analytics/overview", { params: range });
    return {
      period: data.period,
      routesTotal: data.routes_total,
      routesCompleted: data.routes_completed,
      routesWithTracking: data.routes_with_tracking,
      stopsTotal: data.stops_total,
      stopsDelivered: data.stops_delivered,
      stopsFailed: data.stops_failed,
      stopsPending: data.stops_pending,
      completionRate: data.completion_rate,
      onTimeRate: data.on_time_rate,
      avgDelayMin: data.avg_delay_min,
      avgServiceMin: data.avg_service_min,
      plannedDistanceKm: data.planned_distance_km,
      actualDistanceKm: data.actual_distance_km,
      plannedDurationMin: data.planned_duration_min,
      actualDurationMin: data.actual_duration_min,
      idleTimeMin: data.idle_time_min,
      stopsOutOfOrder: data.stops_out_of_order,
      occurrencesTotal: data.occurrences_total,
    };
  });
}

export async function getFieldDrivers(range: AnalyticsRange): Promise<FieldDriverStats[]> {
  return request(async (api) => {
    const { data } = await api.get<any[]>("/analytics/drivers", { params: range });
    return (data ?? []).map((item) => ({
      driverId: String(item.driver_id),
      name: item.name,
      routes: item.routes,
      stopsTotal: item.stops_total,
      stopsDelivered: item.stops_delivered,
      stopsFailed: item.stops_failed,
      completionRate: item.completion_rate,
      avgServiceMin: item.avg_service_min,
      avgDelayMin: item.avg_delay_min,
      actualDistanceKm: item.actual_distance_km,
      stopsOutOfOrder: item.stops_out_of_order,
    }));
  });
}

export async function getFieldRegions(range: AnalyticsRange): Promise<FieldRegionStats[]> {
  return request(async (api) => {
    const { data } = await api.get<any[]>("/analytics/regions", { params: range });
    return (data ?? []).map((item) => ({
      region: item.region,
      period: item.period,
      stops: item.stops,
      stopsFailed: item.stops_failed,
      avgServiceMin: item.avg_service_min,
      avgDelayMin: item.avg_delay_min,
    }));
  });
}

export async function getFieldOccurrences(range: AnalyticsRange): Promise<FieldOccurrences> {
  return request(async (api) => {
    const { data } = await api.get<any>("/analytics/occurrences", { params: range });
    return {
      total: data.total,
      byType: data.by_type,
      recent: (data.recent ?? []).map((item: any) => ({
        routeId: String(item.route_id),
        orderId: item.order_id != null ? String(item.order_id) : null,
        orderTitle: item.order_title,
        clientName: item.client_name,
        driverName: item.driver_name,
        occurrenceType: item.occurrence_type,
        notes: item.notes,
        occurredAt: item.occurred_at,
      })),
    };
  });
}

export async function getFieldRoutes(range: AnalyticsRange): Promise<FieldRouteSummary[]> {
  return request(async (api) => {
    const { data } = await api.get<any[]>("/analytics/routes", { params: range });
    return (data ?? []).map((item) => ({
      routeId: String(item.route_id),
      status: item.status,
      plannedDate: item.planned_date,
      region: item.region,
      driverName: item.driver_name,
      simulated: item.simulated,
      stopsTotal: item.stops_total,
      stopsDelivered: item.stops_delivered,
      stopsFailed: item.stops_failed,
      plannedDistanceM: item.planned_distance_m,
      actualDistanceM: item.actual_distance_m,
      plannedDurationMin: item.planned_duration_min,
      actualDurationMin: item.actual_duration_min,
      stopsOutOfOrder: item.stops_out_of_order,
      hasTracking: item.has_tracking,
    }));
  });
}

export async function getRouteComparison(routeId: string): Promise<RouteComparison> {
  return request(async (api) => {
    const { data } = await api.get<any>(`/analytics/routes/${routeId}/comparison`);
    const summary = data.summary;
    return {
      route: {
        routeId: String(data.route.route_id),
        status: data.route.status,
        plannedDate: data.route.planned_date,
        region: data.route.region,
        simulated: data.route.simulated,
        driverName: data.route.driver_name,
        vehicleName: data.route.vehicle_name,
        startedAt: data.route.started_at,
        finishedAt: data.route.finished_at,
      },
      summary: summary
        ? {
            plannedDistanceM: summary.planned_distance_m,
            actualDistanceM: summary.actual_distance_m,
            plannedDurationMin: summary.planned_duration_min,
            actualDurationMin: summary.actual_duration_min,
            stopsTotal: summary.stops_total,
            stopsDelivered: summary.stops_delivered,
            stopsFailed: summary.stops_failed,
            stopsOutOfOrder: summary.stops_out_of_order,
            idleTimeMin: summary.idle_time_min,
            avgServiceMin: summary.avg_service_min,
            avgDelayMin: summary.avg_delay_min,
            pingCount: summary.ping_count,
          }
        : null,
      stops: (data.stops ?? []).map((item: any) => ({
        orderId: String(item.order_id),
        title: item.title,
        clientName: item.client_name,
        address: item.address,
        status: item.status,
        plannedSequence: item.planned_sequence,
        actualSequence: item.actual_sequence,
        plannedArrival: item.planned_arrival,
        actualArrival: item.actual_arrival,
        completedAt: item.completed_at,
        delayMin: item.delay_min,
        serviceMin: item.service_min,
        occurrenceType: item.occurrence_type,
        notes: item.notes,
      })),
      pathPoints: (data.path ?? []).length,
    };
  });
}

/* eslint-enable @typescript-eslint/no-explicit-any */
