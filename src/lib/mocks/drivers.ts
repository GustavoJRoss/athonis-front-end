import type { Driver } from "@/types/domain";

export const drivers: Driver[] = [
  { id: "MOT-001", name: "Carlos Eduardo Silva", document: "111.222.333-44", phone: "(11) 98765-4321", cnh: "12345678900", vehicleId: "VEI-001", status: "in_route", deliveryCount: 482, performance: 94 },
  { id: "MOT-002", name: "Fernanda Souza Lima", document: "222.333.444-55", phone: "(11) 98877-6655", cnh: "23456789011", vehicleId: "VEI-002", status: "in_route", deliveryCount: 356, performance: 91 },
  { id: "MOT-003", name: "João Pedro Almeida", document: "333.444.555-66", phone: "(51) 99123-4567", cnh: "34567890122", vehicleId: "VEI-003", status: "in_route", deliveryCount: 601, performance: 96 },
  { id: "MOT-004", name: "Rafael Costa Martins", document: "444.555.666-77", phone: "(21) 98234-5678", cnh: "45678901233", vehicleId: "VEI-004", status: "available", deliveryCount: 210, performance: 88 },
  { id: "MOT-005", name: "Juliana Ribeiro Santos", document: "555.666.777-88", phone: "(19) 99345-6789", cnh: "56789012344", vehicleId: "VEI-005", status: "in_route", deliveryCount: 389, performance: 90 },
  { id: "MOT-006", name: "Marcos Vinícius Oliveira", document: "666.777.888-99", phone: "(41) 98456-7890", cnh: "67890123455", vehicleId: "VEI-006", status: "available", deliveryCount: 175, performance: 85 },
  { id: "MOT-007", name: "Patrícia Gomes Ferreira", document: "777.888.999-00", phone: "(81) 99567-8901", cnh: "78901234566", vehicleId: "VEI-007", status: "in_route", deliveryCount: 298, performance: 92 },
  { id: "MOT-008", name: "Diego Henrique Barbosa", document: "888.999.000-11", phone: "(31) 98678-9012", cnh: "89012345677", vehicleId: null, status: "unavailable", deliveryCount: 143, performance: 79 },
  { id: "MOT-009", name: "Camila Rocha Pereira", document: "999.000.111-22", phone: "(48) 99789-0123", cnh: "90123456788", vehicleId: null, status: "unavailable", deliveryCount: 267, performance: 87 },
  { id: "MOT-010", name: "Anderson Luiz Cardoso", document: "000.111.222-33", phone: "(85) 98890-1234", cnh: "01234567899", vehicleId: null, status: "available", deliveryCount: 322, performance: 93 },
];
