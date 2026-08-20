import type { Vehicle } from "@/types/domain";

export const vehicles: Vehicle[] = [
  { id: "VEI-001", plate: "BRA1D23", model: "Sprinter 415", brand: "Mercedes-Benz", type: "van", capacityKg: 1500, driverId: "MOT-001", status: "in_use" },
  { id: "VEI-002", plate: "BRA2E34", model: "Daily 35S14", brand: "Iveco", type: "van", capacityKg: 1800, driverId: "MOT-002", status: "in_use" },
  { id: "VEI-003", plate: "BRA3F45", model: "Accelo 815", brand: "Mercedes-Benz", type: "truck", capacityKg: 4500, driverId: "MOT-003", status: "in_use" },
  { id: "VEI-004", plate: "BRA4G56", model: "Hilux", brand: "Toyota", type: "utility", capacityKg: 900, driverId: "MOT-004", status: "available" },
  { id: "VEI-005", plate: "BRA5H67", model: "Delivery Express 6-6", brand: "Volkswagen", type: "truck", capacityKg: 6000, driverId: "MOT-005", status: "in_use" },
  { id: "VEI-006", plate: "BRA6I78", model: "Master Furgão", brand: "Renault", type: "van", capacityKg: 1400, driverId: "MOT-006", status: "available" },
  { id: "VEI-007", plate: "BRA7J89", model: "CG 160 Titan", brand: "Honda", type: "motorcycle", capacityKg: 30, driverId: "MOT-007", status: "in_use" },
  { id: "VEI-008", plate: "BRA8K90", model: "Daily 70C16", brand: "Iveco", type: "truck", capacityKg: 7000, driverId: null, status: "maintenance" },
  { id: "VEI-009", plate: "BRA9L01", model: "Strada", brand: "Fiat", type: "utility", capacityKg: 700, driverId: null, status: "inactive" },
  { id: "VEI-010", plate: "BRA0M12", model: "Sprinter 415", brand: "Mercedes-Benz", type: "van", capacityKg: 1500, driverId: null, status: "available" },
];
