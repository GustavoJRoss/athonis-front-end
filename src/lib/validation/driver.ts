import { z } from "zod";

export const driverFormSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  document: z.string().min(11, "Documento inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  cnh: z.string().min(5, "CNH inválida"),
  status: z.enum(["available", "in_route", "unavailable"]),
});

export type DriverFormInput = z.infer<typeof driverFormSchema>;
