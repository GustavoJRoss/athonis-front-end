/**
 * Tradução entre o formato do backend (snake_case, IDs numéricos) e os tipos
 * de domínio da UI (camelCase, IDs string). Fica isolado aqui para que as
 * telas não conheçam o formato da API.
 */
import type {
  Company,
  Customer,
  Driver,
  Order,
  Route,
  RouteStop,
  Vehicle,
  OrderStatus,
  RouteStatus,
} from "@/types/domain";
import type { CustomerFormInput } from "@/lib/validation/customer";
import type { DriverFormInput } from "@/lib/validation/driver";
import type { OrderFormInput } from "@/lib/validation/order";
import type { VehicleFormInput } from "@/lib/validation/vehicle";
import type { CompanyFormInput } from "@/lib/validation/company";

/** Origem exibida enquanto o endereço do depósito não é cadastrado por empresa. */
export const DEPOT_LABEL = "Depósito";

const toStringId = (value: number | string | null | undefined): string =>
  value === null || value === undefined ? "" : String(value);

const toNullableId = (value: number | string | null | undefined): string | null =>
  value === null || value === undefined || value === 0 ? null : String(value);

const toIsoDate = (value: string | null | undefined): string => {
  if (!value) return "";
  // O backend devolve "YYYY-MM-DD HH:mm:ss" (SQLite) ou ISO.
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};


// ----------------------------------------------------------------- Empresa

export type ApiCompany = {
  id_company: number;
  corporate_name: string;
  trade_name?: string | null;
  document: string;
  state_registration?: string | null;
  municipal_registration?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  depot_street?: string | null;
  depot_number?: string | null;
  depot_complement?: string | null;
  depot_district?: string | null;
  depot_city?: string | null;
  depot_state?: string | null;
  depot_zip_code?: string | null;
  depot_latitude?: number | string | null;
  depot_longitude?: number | string | null;
  cost_per_km?: number | string | null;
  cost_per_hour?: number | string | null;
  stop_duration_minutes?: number | null;
  default_vehicle_capacity_kg?: number | null;
  operation_start_time?: string | null;
  operation_end_time?: string | null;
  logo_url?: string | null;
  timezone?: string | null;
  is_active?: boolean;
};

const text = (value: string | null | undefined): string => value ?? "";

const numberOrNull = (value: number | string | null | undefined): number | null =>
  value === null || value === undefined || value === "" ? null : Number(value);

export function mapCompany(company: ApiCompany): Company {
  const latitude = numberOrNull(company.depot_latitude);
  const longitude = numberOrNull(company.depot_longitude);

  return {
    idCompany: company.id_company,
    corporateName: company.corporate_name,
    tradeName: text(company.trade_name),
    document: company.document ?? "",
    stateRegistration: text(company.state_registration),
    municipalRegistration: text(company.municipal_registration),
    email: text(company.email),
    phone: text(company.phone),
    website: text(company.website),
    depotStreet: text(company.depot_street),
    depotNumber: text(company.depot_number),
    depotComplement: text(company.depot_complement),
    depotDistrict: text(company.depot_district),
    depotCity: text(company.depot_city),
    depotState: text(company.depot_state),
    depotZipCode: text(company.depot_zip_code),
    depotLatitude: latitude,
    depotLongitude: longitude,
    costPerKm: Number(company.cost_per_km ?? 1),
    costPerHour: Number(company.cost_per_hour ?? 50),
    stopDurationMinutes: Number(company.stop_duration_minutes ?? 30),
    defaultVehicleCapacityKg: Number(company.default_vehicle_capacity_kg ?? 1000),
    operationStartTime: text(company.operation_start_time),
    operationEndTime: text(company.operation_end_time),
    logoUrl: text(company.logo_url),
    timezone: company.timezone ?? "America/Sao_Paulo",
    isActive: company.is_active ?? true,
    hasDepotCoordinates: latitude !== null && longitude !== null,
  };
}

/** Campo vazio vira `null` para limpar o valor no banco, em vez de gravar "". */
const orNull = (value: string | undefined) => (value && value.trim() !== "" ? value.trim() : null);

export function toApiCompany(input: CompanyFormInput) {
  return {
    corporate_name: input.corporateName,
    trade_name: orNull(input.tradeName),
    document: input.document.replace(/[^0-9]/g, ""),
    state_registration: orNull(input.stateRegistration),
    municipal_registration: orNull(input.municipalRegistration),
    email: orNull(input.email),
    phone: orNull(input.phone),
    website: orNull(input.website),
    depot_street: orNull(input.depotStreet),
    depot_number: orNull(input.depotNumber),
    depot_complement: orNull(input.depotComplement),
    depot_district: orNull(input.depotDistrict),
    depot_city: orNull(input.depotCity),
    depot_state: input.depotState ? input.depotState.toUpperCase() : null,
    depot_zip_code: orNull(input.depotZipCode),
    depot_latitude: input.depotLatitude ?? null,
    depot_longitude: input.depotLongitude ?? null,
    cost_per_km: input.costPerKm,
    cost_per_hour: input.costPerHour,
    stop_duration_minutes: input.stopDurationMinutes,
    default_vehicle_capacity_kg: input.defaultVehicleCapacityKg,
    operation_start_time: orNull(input.operationStartTime),
    operation_end_time: orNull(input.operationEndTime),
    logo_url: orNull(input.logoUrl),
    timezone: orNull(input.timezone),
  };
}

// ---------------------------------------------------------------- Cliente

export type ApiClient = {
  client_id: number;
  name: string;
  trade_name?: string | null;
  document: string;
  state_registration?: string | null;
  email?: string | null;
  phone?: string | null;
  type: "F" | "J";
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  number: string;
  complement?: string | null;
  notes?: string | null;
  status?: "active" | "inactive";
  order_count?: number;
  last_order_date?: string | null;
};

export function mapCustomer(client: ApiClient): Customer {
  return {
    id: toStringId(client.client_id),
    name: client.name,
    document: client.document ?? "",
    phone: client.phone ?? "",
    email: client.email ?? "",
    type: client.type ?? "J",
    street: client.street ?? "",
    number: client.number ?? "",
    district: client.neighborhood ?? "",
    zipCode: client.zip_code ?? "",
    complement: client.complement ?? "",
    address: [client.street, client.number].filter(Boolean).join(", "),
    city: client.city ?? "",
    state: client.state ?? "",
    orderCount: Number(client.order_count ?? 0),
    lastOrderDate: client.last_order_date ? toIsoDate(client.last_order_date) : null,
    status: client.status ?? "active",
  };
}

export function toApiClient(input: CustomerFormInput) {
  return {
    name: input.name,
    document: input.document,
    type: input.type,
    email: input.email || undefined,
    phone: input.phone || undefined,
    street: input.street,
    number: input.number,
    neighborhood: input.district,
    city: input.city,
    state: input.state.toUpperCase(),
    zip_code: input.zipCode,
    complement: input.complement || undefined,
    status: input.status,
  };
}

// --------------------------------------------------------------- Motorista

export type ApiDriver = {
  driver_id: number;
  name: string;
  gender?: string | null;
  birth_date?: string | null;
  document?: string | null;
  phone?: string | null;
  cnh?: string | null;
  cnh_category?: string | null;
  cnh_expiration?: string | null;
  status?: "available" | "in_route" | "unavailable";
  delivery_count?: number;
  performance?: number;
  vehicle_id?: number | null;
};

export function mapDriver(driver: ApiDriver): Driver {
  return {
    id: toStringId(driver.driver_id),
    name: driver.name,
    document: driver.document ?? "",
    phone: driver.phone ?? "",
    cnh: driver.cnh ?? "",
    cnhCategory: (driver.cnh_category as Driver["cnhCategory"]) ?? null,
    cnhExpiration: toIsoDate(driver.cnh_expiration) || null,
    vehicleId: toNullableId(driver.vehicle_id),
    status: driver.status ?? "available",
    deliveryCount: Number(driver.delivery_count ?? 0),
    performance: Number(driver.performance ?? 0),
  };
}

export function toApiDriver(input: DriverFormInput) {
  return {
    name: input.name,
    // Campo deixado em branco não é dado: vai como ausente, não como "".
    document: input.document || undefined,
    phone: input.phone || undefined,
    cnh: input.cnh || undefined,
    cnh_category: input.cnhCategory || undefined,
    cnh_expiration: input.cnhExpiration || undefined,
    status: input.status,
  };
}

// ---------------------------------------------------------------- Veículo

export type ApiVehicle = {
  vehicle_id: number;
  name: string;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  plate?: string | null;
  type?: "van" | "truck" | "motorcycle" | "utility";
  capacity_kg?: number | null;
  status?: "available" | "in_use" | "maintenance" | "inactive";
  driver_id?: number | null;
};

export function mapVehicle(vehicle: ApiVehicle): Vehicle {
  return {
    id: toStringId(vehicle.vehicle_id),
    name: vehicle.name ?? "",
    plate: vehicle.plate ?? "",
    model: vehicle.model ?? "",
    brand: vehicle.brand ?? "",
    year: vehicle.year ?? null,
    type: vehicle.type ?? "van",
    capacityKg: vehicle.capacity_kg ?? null,
    driverId: toNullableId(vehicle.driver_id),
    status: vehicle.status ?? "available",
  };
}

export function toApiVehicle(input: VehicleFormInput) {
  return {
    name: input.name.trim(),
    // Campo em branco vai como ausente, não como "".
    brand: input.brand || undefined,
    model: input.model || undefined,
    plate: input.plate || undefined,
    year: input.year,
    type: input.type,
    capacity_kg: input.capacityKg,
    status: input.status,
    driver_id: input.driverId ? Number(input.driverId) : undefined,
  };
}

// ----------------------------------------------------------------- Pedido

export type ApiOrder = {
  order_id: number;
  client_id?: number | null;
  client?: { name?: string } | null;
  title: string;
  description?: string | null;
  invoice_number?: string | null;
  urgency: "low" | "normal" | "high" | "critical";
  status?: OrderStatus;
  vehicle_id?: number | null;
  driver_id?: number | null;
  quantity: number;
  value?: number | string | null;
  delivery_window?: string | null;
  delivery_date?: string | null;
  route_id?: number | null;
  delivery_street: string;
  delivery_district: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zipcode: string;
  delivery_number: string;
  delivery_complement?: string | null;
  created_at?: string;
};

export function formatDeliveryAddress(order: ApiOrder): string {
  return [
    order.delivery_street,
    order.delivery_number,
    order.delivery_district,
    order.delivery_city,
    order.delivery_state,
  ]
    .filter(Boolean)
    .join(", ");
}

export function mapOrder(order: ApiOrder): Order {
  return {
    id: toStringId(order.order_id),
    customerId: toNullableId(order.client_id),
    customerName: order.client?.name ?? "",
    title: order.title,
    quantity: Number(order.quantity ?? 0),
    urgency: order.urgency ?? "normal",
    origin: DEPOT_LABEL,
    destination: formatDeliveryAddress(order),
    date: toIsoDate(order.delivery_date ?? order.created_at ?? null),
    deliveryWindow: order.delivery_window ?? "",
    driverId: toNullableId(order.driver_id),
    vehicleId: toNullableId(order.vehicle_id),
    routeId: toNullableId(order.route_id),
    status: order.status ?? "pending",
    value: Number(order.value ?? 0),
    street: order.delivery_street ?? "",
    number: order.delivery_number ?? "",
    district: order.delivery_district ?? "",
    city: order.delivery_city ?? "",
    state: order.delivery_state ?? "",
    zipCode: order.delivery_zipcode ?? "",
  };
}

export function toApiOrder(input: OrderFormInput) {
  return {
    client_id: input.customerId ? Number(input.customerId) : undefined,
    title: input.title,
    quantity: input.quantity,
    urgency: input.urgency,
    status: input.status,
    value: input.value,
    // Vazio significa "dia todo": grava nulo em vez de string vazia.
    delivery_window: input.deliveryWindow?.trim() || undefined,
    delivery_date: input.date || undefined,
    driver_id: input.driverId ? Number(input.driverId) : undefined,
    vehicle_id: input.vehicleId ? Number(input.vehicleId) : undefined,
    delivery_street: input.street,
    delivery_number: input.number,
    delivery_district: input.district,
    delivery_city: input.city,
    delivery_state: input.state.toUpperCase(),
    delivery_zipcode: input.zipCode,
  };
}

// ------------------------------------------------------------------- Rota

export type ApiRouteHistory = {
  id: number;
  created_at: string;
  order_ids: number[] | string;
  total_routes: number;
  total_orders: number;
  status: string;
  notes?: string | null;
  optimization_result?: {
    mode?: "google" | "simulated";
    simulated?: boolean;
    routes?: Array<{
      vehicleId?: number;
      vehicleName?: string;
      driverId?: number;
      driverName?: string;
      totalDistance?: number;
      totalDuration?: number;
      mode?: "google" | "simulated";
      stops?: Array<{
        orderId: number;
        clientName?: string;
        address?: string;
        coordinates?: { latitude: number; longitude: number };
      }>;
    }>;
  } | string;
};

/** O histórico guarda o estado da otimização; a UI fala em ciclo da rota. */
function mapRouteStatus(status: string): RouteStatus {
  switch (status) {
    case "success":
    case "simulated":
      return "planned";
    case "failed":
      return "cancelled";
    default:
      return "planned";
  }
}

type RawStop = {
  orderId: number;
  clientName?: string;
  address?: string;
  coordinates?: { latitude: number; longitude: number };
};

type RawRoute = {
  vehicleId?: number;
  vehicleName?: string;
  driverId?: number;
  driverName?: string;
  totalDistance?: number;
  totalDuration?: number;
  mode?: "google" | "simulated";
  stops?: RawStop[];
};

/**
 * Uma execução de otimização produz uma rota por dupla veículo+motorista.
 * Cada uma vira um item próprio na lista, com suas paradas e seus pedidos —
 * caso contrário a tela mostrava as paradas da primeira rota ao lado dos
 * pedidos de todas elas.
 */
export function mapRoutes(history: ApiRouteHistory): Route[] {
  const result =
    typeof history.optimization_result === "string"
      ? safeParse(history.optimization_result)
      : history.optimization_result;

  const rawRoutes: RawRoute[] = result?.routes ?? [];

  // Execução que não gerou rota nenhuma não é uma rota: não entra na lista.
  if (rawRoutes.length === 0) {
    return [];
  }

  const resultSimulated = result?.simulated === true;

  return rawRoutes.map((rawRoute, routeIndex) => {
    const rawStops = rawRoute.stops ?? [];

    const stops: RouteStop[] = rawStops.map((stop, index) => ({
      id: String(stop.orderId),
      label: stop.clientName || stop.address || `Parada ${index + 1}`,
      lat: stop.coordinates?.latitude ?? 0,
      lng: stop.coordinates?.longitude ?? 0,
      sequence: index + 1,
      completed: false,
    }));

    const suffix = rawRoutes.length > 1 ? `.${routeIndex + 1}` : "";

    return {
      id: `${history.id}${suffix}`,
      name: `Rota #${history.id}${suffix}`,
      driverId: toNullableId(rawRoute.driverId),
      driverName: rawRoute.driverName ?? "",
      vehicleId: toNullableId(rawRoute.vehicleId),
      vehicleName: rawRoute.vehicleName ?? "",
      // Só os pedidos desta rota, não os de toda a execução.
      orderIds: rawStops.map((stop) => String(stop.orderId)),
      status: mapRouteStatus(history.status),
      stops,
      startedAt: history.created_at ?? null,
      region: rawStops[0]?.address?.split(", ").slice(-2)[0] ?? "—",
      totalDistanceKm: rawRoute.totalDistance ? rawRoute.totalDistance / 1000 : 0,
      totalDurationMin: rawRoute.totalDuration ?? 0,
      simulated: resultSimulated || rawRoute.mode === "simulated",
    };
  });
}

function safeParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}
