import type { Vehicle } from "@/types/domain";

/**
 * Como um veículo é identificado nas telas: nome primeiro, placa depois.
 *
 * A placa sozinha é um código difícil de reconhecer na hora de escolher; o
 * nome dado pela operação ("Van de Entregas 001") é o que a pessoa lembra.
 * Fica num só lugar para as telas não divergirem entre si.
 */
export function vehicleLabel(vehicle: Pick<Vehicle, "name" | "plate" | "brand" | "model">): string {
  const nome = vehicle.name?.trim() || [vehicle.brand, vehicle.model].filter(Boolean).join(" ").trim();
  const placa = vehicle.plate?.trim();

  if (nome && placa) return `${nome} — ${placa}`;
  return nome || placa || "Veículo sem identificação";
}
