import { z } from "zod";

export const routeFormSchema = z.object({
  name: z.string().min(2, "Informe o nome da rota"),
  region: z.string().min(2, "Informe a região"),
  driverId: z.string().nullable(),
  vehicleId: z.string().nullable(),
  status: z.enum(["planned", "active", "completed", "delayed", "cancelled"]),
  orderIds: z.array(z.string()),
});

export type RouteFormInput = z.infer<typeof routeFormSchema>;
