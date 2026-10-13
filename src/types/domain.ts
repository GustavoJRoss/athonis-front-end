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

/** Categorias de CNH usadas na operação. A habilita moto; B a E, carga. */
export type CnhCategory = "A" | "B" | "C" | "D" | "E" | "AB" | "AC" | "AD" | "AE";

export type Driver = {
  id: string;
  name: string;
  document: string;
  phone: string;
  cnh: string;
  cnhCategory: CnhCategory | null;
  /** Validade da CNH em AAAA-MM-DD. */
  cnhExpiration: string | null;
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
  year: number | null;
  type: VehicleType;
  /** Nulo quando não foi informada — zero seria "carrega nada". */
  capacityKg: number | null;
  driverId: string | null;
  status: VehicleStatus;
};

export type OrderStatus =
  | "pending"
  | "planned"
  | "in_route"
  | "delivered"
  /** Parada visitada pelo entregador e não entregue; o motivo fica na ocorrência. */
  | "failed"
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
  /** Nulo quando não foi informado — zero afirmaria que não vale nada. */
  value: number | null;
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
  /** Parada visitada e não entregue. */
  failed: boolean;
  /** Motivo informado pelo entregador no aplicativo; null se foi entregue ou está em aberto. */
  occurrenceType: OccurrenceType | null;
  /** Observação escrita pelo entregador na entrega ou na ocorrência. */
  driverNotes: string | null;
  /** Hora em que o entregador encerrou a parada. */
  closedAt: string | null;
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

// -------------------------------------------------------- Importação de pedidos

export type OrderImportSuccess = {
  linha: number;
  order_id: number;
  title: string;
};

export type OrderImportFailure = {
  linha: number;
  dados: Record<string, unknown>;
  erros: string[];
};

export type OrderImportStatus = "SUCESSO_TOTAL" | "SUCESSO_PARCIAL" | "FALHA_TOTAL";

/** Espelha o `ImportResultDto` do backend — nomes em português mantidos de propósito. */
export type OrderImportResult = {
  totalLinhas: number;
  quantidadeSucessos: number;
  quantidadeFalhas: number;
  sucessos: OrderImportSuccess[];
  falhas: OrderImportFailure[];
  arquivoOriginal: string;
  arquivoRejeicao?: string;
  tempoProcessamento: number;
  status: OrderImportStatus;
  mensagem: string;
};

// ------------------------------------------------- Aplicativo do entregador

/** Situação do login do motorista no aplicativo. */
export type DriverAccess = {
  driverId: string;
  hasAccess: boolean;
  email: string | null;
  isActive: boolean;
  lastLogin: string | null;
};

export type OccurrenceType =
  | "customer_absent"
  | "address_not_found"
  | "refused"
  | "damaged_goods"
  | "closed_establishment"
  | "access_restricted"
  | "traffic"
  | "other";

// ------------------------------------------------------ Execução em campo

/**
 * Indicadores do que aconteceu em campo, vindos de `/analytics/*`. Os campos
 * nulos significam "sem dado para calcular" (ex.: nenhuma rota com rastro de
 * GPS no período) — a tela mostra travessão, nunca zero.
 */
export type FieldOverview = {
  period: { from: string; to: string };
  routesTotal: number;
  routesCompleted: number;
  routesWithTracking: number;
  stopsTotal: number;
  stopsDelivered: number;
  stopsFailed: number;
  stopsPending: number;
  completionRate: number | null;
  onTimeRate: number | null;
  avgDelayMin: number | null;
  avgServiceMin: number | null;
  plannedDistanceKm: number;
  actualDistanceKm: number;
  plannedDurationMin: number;
  actualDurationMin: number;
  idleTimeMin: number;
  stopsOutOfOrder: number;
  occurrencesTotal: number;
};

export type FieldDriverStats = {
  driverId: string;
  name: string;
  routes: number;
  stopsTotal: number;
  stopsDelivered: number;
  stopsFailed: number;
  completionRate: number | null;
  avgServiceMin: number | null;
  avgDelayMin: number | null;
  actualDistanceKm: number;
  stopsOutOfOrder: number;
};

export type DayPeriod = "morning" | "afternoon" | "evening";

export type FieldRegionStats = {
  region: string;
  period: DayPeriod;
  stops: number;
  stopsFailed: number;
  avgServiceMin: number | null;
  avgDelayMin: number | null;
};

export type FieldOccurrence = {
  routeId: string;
  orderId: string | null;
  orderTitle: string | null;
  clientName: string | null;
  driverName: string | null;
  occurrenceType: OccurrenceType;
  notes: string | null;
  occurredAt: string | null;
};

export type FieldOccurrences = {
  total: number;
  byType: Array<{ type: OccurrenceType; count: number; share: number | null }>;
  recent: FieldOccurrence[];
};

export type FieldRouteSummary = {
  routeId: string;
  status: RouteStatus;
  plannedDate: string | null;
  region: string | null;
  driverName: string | null;
  simulated: boolean;
  stopsTotal: number;
  stopsDelivered: number;
  stopsFailed: number;
  plannedDistanceM: number | null;
  actualDistanceM: number | null;
  plannedDurationMin: number | null;
  actualDurationMin: number | null;
  stopsOutOfOrder: number | null;
  hasTracking: boolean;
};

export type RouteComparisonStop = {
  orderId: string;
  title: string;
  clientName: string | null;
  address: string;
  status: OrderStatus;
  plannedSequence: number | null;
  actualSequence: number | null;
  plannedArrival: string | null;
  actualArrival: string | null;
  completedAt: string | null;
  delayMin: number | null;
  serviceMin: number | null;
  occurrenceType: OccurrenceType | null;
  notes: string | null;
};

/** Planejado × executado de uma rota, parada a parada. */
export type RouteComparison = {
  route: {
    routeId: string;
    status: RouteStatus;
    plannedDate: string | null;
    region: string | null;
    simulated: boolean;
    driverName: string | null;
    vehicleName: string | null;
    startedAt: string | null;
    finishedAt: string | null;
  };
  summary: {
    plannedDistanceM: number | null;
    actualDistanceM: number | null;
    plannedDurationMin: number | null;
    actualDurationMin: number | null;
    stopsTotal: number;
    stopsDelivered: number;
    stopsFailed: number;
    stopsOutOfOrder: number;
    idleTimeMin: number | null;
    avgServiceMin: number | null;
    avgDelayMin: number | null;
    pingCount: number;
  } | null;
  stops: RouteComparisonStop[];
  pathPoints: number;
};
