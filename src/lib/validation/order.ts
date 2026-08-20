import { z } from "zod";

export const orderFormSchema = z.object({
  customerId: z.string().min(1, "Selecione um cliente"),
  origin: z.string().min(2, "Informe a origem"),
  destination: z.string().min(2, "Informe o destino"),
  date: z.string().min(1, "Informe a data"),
  deliveryWindow: z.string().min(1, "Selecione a janela de entrega"),
  driverId: z.string().nullable(),
  status: z.enum(["pending", "planned", "in_route", "delivered", "delayed", "cancelled"]),
  value: z.coerce.number().min(0, "Informe o valor"),
});

export type OrderFormInput = z.infer<typeof orderFormSchema>;
