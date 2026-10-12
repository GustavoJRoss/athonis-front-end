import { z } from "zod";

/**
 * Espelha CreateOrderDto no backend. O endereço de entrega é estruturado e
 * costuma vir pré-preenchido a partir do cliente selecionado.
 */
export const orderFormSchema = z.object({
  // Cliente é opcional: existe entrega avulsa, que entra na rota só pelo
  // endereço. Vazio vira null no envio.
  customerId: z.string().nullable().optional(),
  title: z.string().min(2, "Informe o título do pedido").max(100),
  quantity: z.coerce.number().int().min(1, "Informe a quantidade"),
  urgency: z.enum(["low", "normal", "high", "critical"], { error: "Selecione a urgência" }),
  status: z.enum(["pending", "planned", "in_route", "delivered", "failed", "delayed", "cancelled"], { error: "Selecione o status" }),
  // Opcional: nem toda entrega tem valor declarado, e gravar zero afirmaria
  // que a mercadoria não vale nada.
  value: z.preprocess(
    (valor) => (valor === "" || valor === null || valor === undefined ? undefined : Number(valor)),
    z.number().min(0, "O valor não pode ser negativo").optional(),
  ),
  date: z.string().min(1, "Informe a data"),
  // Vazio = dia todo. A maioria das entregas não tem hora marcada.
  deliveryWindow: z.string().optional(),
  driverId: z.string().nullable(),
  vehicleId: z.string().nullable(),
  street: z.string().min(3, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  district: z.string().min(2, "Informe o bairro"),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string({ error: "Selecione a UF" }).length(2, "Use a sigla da UF (ex: SP)"),
  zipCode: z.string().min(8, "CEP inválido").max(10, "CEP inválido"),
});

export type OrderFormInput = z.infer<typeof orderFormSchema>;
