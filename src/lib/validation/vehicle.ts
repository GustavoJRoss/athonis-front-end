import { z } from "zod";
import { isValidPlate } from "@/lib/utils/masks";

const ANO_MINIMO = 1950;
const ANO_MAXIMO = new Date().getFullYear() + 1;

/** Campo numérico vazio chega como "" — vira ausente, não zero. */
const numeroOpcional = (schema: z.ZodNumber) =>
  z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : Number(value)),
    schema.optional(),
  );

/**
 * Só o nome é obrigatório, como o backend exige — é por ele que o veículo é
 * chamado na operação. Placa, marca, modelo, ano e capacidade completam o
 * cadastro e são validados quando preenchidos.
 *
 * O status não vem do formulário: veículo novo nasce disponível, e "em uso" é
 * consequência de estar numa rota.
 */
export const vehicleFormSchema = z
  .object({
    name: z.string().min(2, "Informe o nome do veículo").max(100),
    plate: z.string().optional(),
    brand: z.string().max(50).optional(),
    model: z.string().max(50).optional(),
    year: numeroOpcional(
      z
        .number()
        .int("Use o ano com 4 dígitos")
        .min(ANO_MINIMO, `Ano deve ser a partir de ${ANO_MINIMO}`)
        .max(ANO_MAXIMO, `Ano não pode passar de ${ANO_MAXIMO}`),
    ),
    type: z.enum(["van", "truck", "motorcycle", "utility"], { error: "Selecione o tipo" }),
    capacityKg: numeroOpcional(
      z.number().int("Use um número inteiro").min(1, "A capacidade deve ser maior que zero"),
    ),
    driverId: z.string().nullable().optional(),
    status: z.enum(["available", "in_use", "maintenance", "inactive"]).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.plate && !isValidPlate(values.plate)) {
      ctx.addIssue({
        code: "custom",
        path: ["plate"],
        message: "Use ABC1D23 (Mercosul) ou ABC1234",
      });
    }
  });

export type VehicleFormInput = z.infer<typeof vehicleFormSchema>;
