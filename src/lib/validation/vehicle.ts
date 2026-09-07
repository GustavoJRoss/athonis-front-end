import { z } from "zod";

export const vehicleFormSchema = z.object({
  // Nome usado para reconhecer o veículo nas telas (ex.: "Van de Entregas 001").
  name: z.string().max(100).optional().or(z.literal("")),
  plate: z.string().min(7, "Placa inválida"),
  model: z.string().min(1, "Informe o modelo"),
  brand: z.string().min(1, "Informe a marca"),
  type: z.enum(["van", "truck", "motorcycle", "utility"], { error: "Selecione o tipo" }),
  capacityKg: z.coerce.number().min(1, "Informe a capacidade"),
  driverId: z.string().nullable(),
  status: z.enum(["available", "in_use", "maintenance", "inactive"], { error: "Selecione a situação" }),
});

export type VehicleFormInput = z.infer<typeof vehicleFormSchema>;
