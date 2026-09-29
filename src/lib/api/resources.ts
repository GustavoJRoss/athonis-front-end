"use client";

/**
 * Mesma interface que `lib/mocks/api` expunha (list/create/update/remove),
 * agora servida pela API real através das Server Actions.
 *
 * O `predicate` de busca continua sendo aplicado no cliente, como antes — a
 * paginação e a ordenação seguem a cargo do DataTable.
 */

import * as actions from "./actions";
import type {
  Company,
  Customer,
  Driver,
  Order,
  OrderImportResult,
  Route,
  Vehicle,
} from "@/types/domain";
import type { CustomerFormInput } from "@/lib/validation/customer";
import type { DriverFormInput } from "@/lib/validation/driver";
import type { OrderFormInput } from "@/lib/validation/order";
import type { VehicleFormInput } from "@/lib/validation/vehicle";
import type { CompanyFormInput } from "@/lib/validation/company";

function filtered<T>(items: T[], predicate?: (item: T) => boolean): T[] {
  return predicate ? items.filter(predicate) : items;
}

export const customersApi = {
  list: async (predicate?: (item: Customer) => boolean) =>
    filtered(await actions.listCustomers(), predicate),
  create: (input: CustomerFormInput) => actions.createCustomer(input),
  update: (id: string, input: CustomerFormInput) => actions.updateCustomer(id, input),
  remove: (id: string) => actions.deleteCustomer(id),
};

export const driversApi = {
  list: async (predicate?: (item: Driver) => boolean) =>
    filtered(await actions.listDrivers(), predicate),
  create: (input: DriverFormInput) => actions.createDriver(input),
  update: (id: string, input: DriverFormInput) => actions.updateDriver(id, input),
  remove: (id: string) => actions.deleteDriver(id),
};

export const vehiclesApi = {
  list: async (predicate?: (item: Vehicle) => boolean) =>
    filtered(await actions.listVehicles(), predicate),
  create: (input: VehicleFormInput) => actions.createVehicle(input),
  update: (id: string, input: VehicleFormInput) => actions.updateVehicle(id, input),
  remove: (id: string) => actions.deleteVehicle(id),
};

export const ordersApi = {
  list: async (predicate?: (item: Order) => boolean) =>
    filtered(await actions.listOrders(), predicate),
  create: (input: OrderFormInput) => actions.createOrder(input),
  update: (id: string, input: OrderFormInput) => actions.updateOrder(id, input),
  remove: (id: string) => actions.deleteOrder(id),
  import: (formData: FormData): Promise<OrderImportResult> => actions.importOrders(formData),
};

export const routesApi = {
  list: async (predicate?: (item: Route) => boolean) =>
    filtered(await actions.listRoutes(), predicate),
  remove: (id: string) => actions.deleteRoute(id),
  start: (id: string) => actions.startRoute(id),
  complete: (id: string) => actions.completeRoute(id),
  cancel: (id: string) => actions.cancelRoute(id),
  deliverStop: (routeId: string, orderId: string) => actions.deliverRouteStop(routeId, orderId),
  optimize: (orderIds: string[]) => actions.optimizeRoutes(orderIds),
  validate: (orderIds: string[]) => actions.validateOrdersForRoute(orderIds),
};

/** Empresa: só leitura e edição — a criação é feita no banco. */
export const companyApi = {
  get: (): Promise<Company> => actions.getCompany(),
  update: (input: CompanyFormInput): Promise<Company> => actions.updateCompany(input),
};
