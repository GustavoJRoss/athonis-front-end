export type CustomerStatus = "active" | "inactive";

export type Customer = {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  orderCount: number;
  lastOrderDate: string | null;
  status: CustomerStatus;
};

export type DriverStatus = "available" | "in_route" | "unavailable";

export type Driver = {
  id: string;
  name: string;
  document: string;
  phone: string;
  cnh: string;
  vehicleId: string | null;
  status: DriverStatus;
  deliveryCount: number;
  performance: number;
};

export type VehicleType = "van" | "truck" | "motorcycle" | "utility";
export type VehicleStatus = "available" | "in_use" | "maintenance" | "inactive";

export type Vehicle = {
  id: string;
  plate: string;
  model: string;
  brand: string;
  type: VehicleType;
  capacityKg: number;
  driverId: string | null;
  status: VehicleStatus;
};

export type OrderStatus =
  | "pending"
  | "planned"
  | "in_route"
  | "delivered"
  | "delayed"
  | "cancelled";

export type Order = {
  id: string;
  customerId: string;
  origin: string;
  destination: string;
  date: string;
  deliveryWindow: string;
  driverId: string | null;
  routeId: string | null;
  status: OrderStatus;
  value: number;
};

export type RouteStatus = "planned" | "active" | "completed" | "delayed" | "cancelled";

export type RouteStop = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  sequence: number;
  completed: boolean;
};

export type Route = {
  id: string;
  name: string;
  driverId: string | null;
  vehicleId: string | null;
  orderIds: string[];
  status: RouteStatus;
  stops: RouteStop[];
  startedAt: string | null;
  region: string;
};
