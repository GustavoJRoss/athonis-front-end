export type CustomerStatus = "active" | "inactive";

/** Pessoa Física ou Jurídica — o backend usa "F" / "J". */
export type CustomerType = "F" | "J";

export type Customer = {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  type: CustomerType;
  /** Endereço estruturado, como o backend armazena. */
  street: string;
  number: string;
  district: string;
  zipCode: string;
  complement: string;
  /** Linha única derivada de rua + número, para exibição em tabela. */
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
  /** Nome dado pela operação, ex.: "Van de Entregas 001". */
  name: string;
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

export type OrderUrgency = "low" | "normal" | "high" | "critical";

export type Order = {
  id: string;
  /** Null numa entrega avulsa, sem cliente cadastrado. */
  customerId: string | null;
  customerName: string;
  title: string;
  quantity: number;
  urgency: OrderUrgency;
  origin: string;
  /** Endereço de entrega em linha única, derivado dos campos estruturados. */
  destination: string;
  date: string;
  deliveryWindow: string;
  driverId: string | null;
  vehicleId: string | null;
  routeId: string | null;
  status: OrderStatus;
  value: number;
  /** Endereço de entrega estruturado, como o backend exige. */
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
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
  driverName: string;
  vehicleId: string | null;
  vehicleName: string;
  orderIds: string[];
  status: RouteStatus;
  stops: RouteStop[];
  startedAt: string | null;
  region: string;
  totalDistanceKm: number;
  totalDurationMin: number;
  /**
   * Verdadeiro quando a rota veio da simulação local, não da API de
   * otimização do Google. A UI precisa avisar: distâncias e tempos são
   * estimativas e não servem para despacho.
   */
  simulated: boolean;
};

/**
 * A empresa (tenant). O identificador é definido na criação, que acontece
 * direto no banco — pela aplicação só é possível ler e editar os dados.
 */
export type Company = {
  idCompany: number;
  corporateName: string;
  tradeName: string;
  document: string;
  stateRegistration: string;
  municipalRegistration: string;
  email: string;
  phone: string;
  website: string;
  depotStreet: string;
  depotNumber: string;
  depotComplement: string;
  depotDistrict: string;
  depotCity: string;
  depotState: string;
  depotZipCode: string;
  depotLatitude: number | null;
  depotLongitude: number | null;
  costPerKm: number;
  costPerHour: number;
  stopDurationMinutes: number;
  defaultVehicleCapacityKg: number;
  operationStartTime: string;
  operationEndTime: string;
  logoUrl: string;
  timezone: string;
  isActive: boolean;
  /** Falso enquanto não há coordenadas: as rotas partem de um ponto padrão. */
  hasDepotCoordinates: boolean;
};
