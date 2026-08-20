import { z } from "zod";

export const vehicleFormSchema = z.object({
  plate: z.string().min(7, "Placa inválida"),
  model: z.string().min(1, "Informe o modelo"),
  brand: z.string().min(1, "Informe a marca"),
  type: z.enum(["van", "truck", "motorcycle", "utility"]),
  capacityKg: z.coerce.number().min(1, "Informe a capacidade"),
  driverId: z.string().nullable(),
  status: z.enum(["available", "in_use", "maintenance", "inactive"]),
});

export type VehicleFormInput = z.infer<typeof vehicleFormSchema>;
