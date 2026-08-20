import type { Order } from "@/types/domain";

export const orders: Order[] = [
  { id: "PED-1001", customerId: "CLI-002", origin: "CD Athonis - Guarulhos/SP", destination: "São Paulo/SP", date: "2026-08-18", deliveryWindow: "08:00–12:00", driverId: "MOT-001", routeId: "ROT-001", status: "in_route", value: 2840.5 },
  { id: "PED-1002", customerId: "CLI-006", origin: "CD Athonis - Guarulhos/SP", destination: "São Paulo/SP", date: "2026-08-18", deliveryWindow: "08:00–12:00", driverId: "MOT-001", routeId: "ROT-001", status: "in_route", value: 1120.0 },
  { id: "PED-1003", customerId: "CLI-017", origin: "CD Athonis - Guarulhos/SP", destination: "São Paulo/SP", date: "2026-08-18", deliveryWindow: "13:00–17:00", driverId: "MOT-001", routeId: "ROT-001", status: "in_route", value: 640.9 },
  { id: "PED-1004", customerId: "CLI-010", origin: "CD Athonis - Guarulhos/SP", destination: "São Paulo/SP", date: "2026-08-18", deliveryWindow: "13:00–17:00", driverId: "MOT-001", routeId: "ROT-001", status: "planned", value: 5230.0 },

  { id: "PED-1005", customerId: "CLI-001", origin: "CD Athonis - Guarulhos/SP", destination: "Guarulhos/SP", date: "2026-08-18", deliveryWindow: "08:00–12:00", driverId: "MOT-002", routeId: "ROT-002", status: "in_route", value: 3240.0 },
  { id: "PED-1006", customerId: "CLI-012", origin: "CD Athonis - Guarulhos/SP", destination: "Guarulhos/SP", date: "2026-08-18", deliveryWindow: "08:00–12:00", driverId: "MOT-002", routeId: "ROT-002", status: "in_route", value: 4890.5 },
  { id: "PED-1007", customerId: "CLI-002", origin: "CD Athonis - Guarulhos/SP", destination: "São Paulo/SP", date: "2026-08-18", deliveryWindow: "18:00–22:00", driverId: "MOT-002", routeId: "ROT-002", status: "planned", value: 890.5 },

  { id: "PED-1008", customerId: "CLI-003", origin: "CD Athonis - Guarulhos/SP", destination: "Porto Alegre/RS", date: "2026-08-17", deliveryWindow: "08:00–12:00", driverId: "MOT-003", routeId: "ROT-003", status: "delivered", value: 1520.0 },
  { id: "PED-1009", customerId: "CLI-007", origin: "CD Athonis - Guarulhos/SP", destination: "Curitiba/PR", date: "2026-08-17", deliveryWindow: "13:00–17:00", driverId: "MOT-003", routeId: "ROT-003", status: "delivered", value: 2100.0 },
  { id: "PED-1010", customerId: "CLI-011", origin: "CD Athonis - Guarulhos/SP", destination: "Florianópolis/SC", date: "2026-08-17", deliveryWindow: "13:00–17:00", driverId: "MOT-003", routeId: "ROT-003", status: "delivered", value: 780.0 },
  { id: "PED-1011", customerId: "CLI-003", origin: "CD Athonis - Guarulhos/SP", destination: "Porto Alegre/RS", date: "2026-08-16", deliveryWindow: "08:00–12:00", driverId: "MOT-003", routeId: "ROT-003", status: "delivered", value: 1980.0 },

  { id: "PED-1012", customerId: "CLI-005", origin: "CD Athonis - Guarulhos/SP", destination: "Campinas/SP", date: "2026-08-18", deliveryWindow: "08:00–12:00", driverId: "MOT-005", routeId: "ROT-004", status: "in_route", value: 6420.0 },
  { id: "PED-1013", customerId: "CLI-010", origin: "CD Athonis - Guarulhos/SP", destination: "São Paulo/SP", date: "2026-08-18", deliveryWindow: "13:00–17:00", driverId: "MOT-005", routeId: "ROT-004", status: "in_route", value: 3100.0 },
  { id: "PED-1014", customerId: "CLI-005", origin: "CD Athonis - Guarulhos/SP", destination: "Campinas/SP", date: "2026-08-18", deliveryWindow: "18:00–22:00", driverId: "MOT-005", routeId: "ROT-004", status: "delayed", value: 990.0 },

  { id: "PED-1015", customerId: "CLI-008", origin: "CD Athonis - Recife/PE", destination: "Recife/PE", date: "2026-08-18", deliveryWindow: "08:00–12:00", driverId: "MOT-007", routeId: "ROT-005", status: "in_route", value: 2340.0 },
  { id: "PED-1016", customerId: "CLI-016", origin: "CD Athonis - Recife/PE", destination: "Fortaleza/CE", date: "2026-08-18", deliveryWindow: "13:00–17:00", driverId: "MOT-007", routeId: "ROT-005", status: "planned", value: 4100.0 },

  { id: "PED-1017", customerId: "CLI-007", origin: "CD Athonis - Guarulhos/SP", destination: "Curitiba/PR", date: "2026-08-19", deliveryWindow: "08:00–12:00", driverId: "MOT-004", routeId: "ROT-006", status: "planned", value: 1560.0 },
  { id: "PED-1018", customerId: "CLI-007", origin: "CD Athonis - Guarulhos/SP", destination: "Curitiba/PR", date: "2026-08-19", deliveryWindow: "08:00–12:00", driverId: "MOT-004", routeId: "ROT-006", status: "planned", value: 720.0 },
  { id: "PED-1019", customerId: "CLI-011", origin: "CD Athonis - Guarulhos/SP", destination: "Florianópolis/SC", date: "2026-08-19", deliveryWindow: "13:00–17:00", driverId: "MOT-004", routeId: "ROT-006", status: "planned", value: 1340.0 },

  { id: "PED-1020", customerId: "CLI-016", origin: "CD Athonis - Recife/PE", destination: "Fortaleza/CE", date: "2026-08-19", deliveryWindow: "08:00–12:00", driverId: "MOT-010", routeId: "ROT-007", status: "planned", value: 2870.0 },
  { id: "PED-1021", customerId: "CLI-016", origin: "CD Athonis - Recife/PE", destination: "Fortaleza/CE", date: "2026-08-19", deliveryWindow: "13:00–17:00", driverId: "MOT-010", routeId: "ROT-007", status: "planned", value: 1150.0 },

  { id: "PED-1022", customerId: "CLI-015", origin: "CD Athonis - Contagem/MG", destination: "Ipatinga/MG", date: "2026-08-17", deliveryWindow: "08:00–12:00", driverId: "MOT-006", routeId: "ROT-008", status: "delayed", value: 3320.0 },
  { id: "PED-1023", customerId: "CLI-009", origin: "CD Athonis - Contagem/MG", destination: "Belo Horizonte/MG", date: "2026-08-17", deliveryWindow: "13:00–17:00", driverId: "MOT-006", routeId: "ROT-008", status: "delayed", value: 560.0 },
  { id: "PED-1024", customerId: "CLI-015", origin: "CD Athonis - Contagem/MG", destination: "Ipatinga/MG", date: "2026-08-17", deliveryWindow: "13:00–17:00", driverId: "MOT-006", routeId: "ROT-008", status: "delayed", value: 1780.0 },
  { id: "PED-1025", customerId: "CLI-014", origin: "CD Athonis - Contagem/MG", destination: "Rio Verde/GO", date: "2026-08-17", deliveryWindow: "18:00–22:00", driverId: "MOT-006", routeId: "ROT-008", status: "delayed", value: 2450.0 },

  { id: "PED-1026", customerId: "CLI-018", origin: "CD Athonis - Manaus/AM", destination: "Manaus/AM", date: "2026-08-14", deliveryWindow: "08:00–12:00", driverId: null, routeId: "ROT-009", status: "cancelled", value: 990.0 },
  { id: "PED-1027", customerId: "CLI-018", origin: "CD Athonis - Manaus/AM", destination: "Manaus/AM", date: "2026-08-14", deliveryWindow: "13:00–17:00", driverId: null, routeId: "ROT-009", status: "cancelled", value: 1480.0 },

  { id: "PED-1028", customerId: "CLI-004", origin: "CD Athonis - Guarulhos/SP", destination: "Rio de Janeiro/RJ", date: "2026-08-20", deliveryWindow: "08:00–12:00", driverId: null, routeId: null, status: "pending", value: 3670.0 },
  { id: "PED-1029", customerId: "CLI-013", origin: "CD Athonis - Contagem/MG", destination: "Goiânia/GO", date: "2026-08-20", deliveryWindow: "13:00–17:00", driverId: null, routeId: null, status: "pending", value: 430.0 },
  { id: "PED-1030", customerId: "CLI-002", origin: "CD Athonis - Guarulhos/SP", destination: "São Paulo/SP", date: "2026-08-20", deliveryWindow: "08:00–12:00", driverId: null, routeId: null, status: "pending", value: 2210.0 },
  { id: "PED-1031", customerId: "CLI-006", origin: "CD Athonis - Guarulhos/SP", destination: "São Paulo/SP", date: "2026-08-20", deliveryWindow: "18:00–22:00", driverId: null, routeId: null, status: "pending", value: 1890.0 },
  { id: "PED-1032", customerId: "CLI-012", origin: "CD Athonis - Guarulhos/SP", destination: "Guarulhos/SP", date: "2026-08-16", deliveryWindow: "08:00–12:00", driverId: "MOT-001", routeId: null, status: "delivered", value: 5120.0 },
  { id: "PED-1033", customerId: "CLI-001", origin: "CD Athonis - Guarulhos/SP", destination: "Guarulhos/SP", date: "2026-08-16", deliveryWindow: "13:00–17:00", driverId: "MOT-002", routeId: null, status: "delivered", value: 2340.0 },
  { id: "PED-1034", customerId: "CLI-004", origin: "CD Athonis - Guarulhos/SP", destination: "Rio de Janeiro/RJ", date: "2026-08-15", deliveryWindow: "08:00–12:00", driverId: "MOT-005", routeId: null, status: "delivered", value: 1670.0 },
  { id: "PED-1035", customerId: "CLI-010", origin: "CD Athonis - Guarulhos/SP", destination: "São Paulo/SP", date: "2026-08-15", deliveryWindow: "13:00–17:00", driverId: "MOT-003", routeId: null, status: "delivered", value: 4780.0 },
  { id: "PED-1036", customerId: "CLI-008", origin: "CD Athonis - Recife/PE", destination: "Recife/PE", date: "2026-08-14", deliveryWindow: "08:00–12:00", driverId: "MOT-007", routeId: null, status: "delivered", value: 990.0 },
];
