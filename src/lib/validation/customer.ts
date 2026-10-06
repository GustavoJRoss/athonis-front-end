import { z } from "zod";
import { isValidDocument, isValidPhone, onlyDigits } from "@/lib/utils/masks";

/**
 * Espelha o que o backend exige em CreateClientDto: endereço estruturado e
 * tipo F/J. Manter os dois lados alinhados evita o 400 genérico que aparecia
 * quando o formulário mandava um endereço em linha única.
 *
 * O documento é validado conforme o tipo — CPF para pessoa física, CNPJ para
 * jurídica — incluindo o dígito verificador, para não entrar número inventado.
 */
export const customerFormSchema = z
  .object({
    type: z.enum(["F", "J"], { error: "Selecione o tipo" }),
    name: z.string().min(2, "Informe o nome"),
    document: z.string().min(1, "Informe o documento"),
    phone: z.string().min(1, "Informe o telefone"),
    email: z.email("Email inválido"),
    zipCode: z.string().min(8, "CEP inválido").max(10, "CEP inválido"),
    street: z.string().min(3, "Informe a rua"),
    number: z.string().min(1, "Informe o número"),
    district: z.string().min(2, "Informe o bairro"),
    city: z.string().min(2, "Informe a cidade"),
    state: z.string({ error: "Selecione a UF" }).length(2, "Use a sigla da UF (ex: SP)"),
    complement: z.string().optional(),
    status: z.enum(["active", "inactive"], { error: "Selecione a situação" }),
  })
  .superRefine((values, ctx) => {
    if (!isValidDocument(values.document, values.type)) {
      ctx.addIssue({
        code: "custom",
        path: ["document"],
        message: values.type === "F" ? "CPF inválido" : "CNPJ inválido",
      });
    }

    if (!isValidPhone(values.phone)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Telefone deve ter DDD e 8 ou 9 dígitos",
      });
    }

    if (onlyDigits(values.zipCode).length !== 8) {
      ctx.addIssue({ code: "custom", path: ["zipCode"], message: "CEP deve ter 8 dígitos" });
    }
  });

export type CustomerFormInput = z.infer<typeof customerFormSchema>;
