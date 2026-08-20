import { z } from "zod";

export const customerFormSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  document: z.string().min(11, "Documento inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  email: z.email("Email inválido"),
  address: z.string().min(3, "Informe o endereço"),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string().length(2, "Use a sigla da UF (ex: SP)"),
  status: z.enum(["active", "inactive"]),
});

export type CustomerFormInput = z.infer<typeof customerFormSchema>;
