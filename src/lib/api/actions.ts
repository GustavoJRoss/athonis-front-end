"use server";

/**
 * Server Actions que substituem os mocks: falam com a API real usando o token
 * da sessão (cookie httpOnly), que nunca chega ao navegador.
 *
 * A UI continua consumindo a mesma interface list/get/create/update/remove.
 */

import { createAuthenticatedApiClient } from "./client";
import { toApiErrorMessage } from "./errors";
import {
  mapCompany,
  mapCustomer,
  mapDriver,
  mapOrder,
  mapRoutes,
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
  type ApiRouteHistory,
  type ApiVehicle,
} from "./mappers";
import type { Company, Customer, Driver, Order, Route, Vehicle } from "@/types/domain";
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

// ----------------------------------------------------------------- Rotas

export async function listRoutes(): Promise<Route[]> {
  return request(async (api) => {
    const { data } = await api.get<ApiRouteHistory[]>("/optimized-routes-history");
    return (Array.isArray(data) ? data : []).flatMap(mapRoutes);
  });
}

export async function deleteRoute(id: string): Promise<void> {
  // Uma execução com várias rotas gera ids como "12.1" e "12.2"; o registro
  // no histórico é o número antes do ponto.
  const historyId = id.split(".")[0];
  await request(async (api) => api.delete(`/optimized-routes-history/${historyId}`));
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
