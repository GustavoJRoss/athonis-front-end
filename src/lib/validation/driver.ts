import { z } from "zod";
import { isValidCnh, isValidCpf, isValidPhone, onlyDigits } from "@/lib/utils/masks";

/**
 * Só o nome é obrigatório — é o que o backend exige e o que basta para o
 * motorista existir. Documento, telefone e CNH são complementos do cadastro:
 * ficam livres, mas quando preenchidos precisam estar corretos, senão o dado
 * entra errado e ninguém percebe.
 *
 * O status não vem do formulário: motorista novo nasce disponível, e "em rota"
 * é consequência da operação, não uma escolha de cadastro.
 */
export const driverFormSchema = z
  .object({
    name: z.string().min(2, "Informe o nome"),
    document: z.string().optional(),
    phone: z.string().optional(),
    cnh: z.string().optional(),
    cnhCategory: z
      .enum(["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"])
      .nullable()
      .optional(),
    /** AAAA-MM-DD. */
    cnhExpiration: z.string().nullable().optional(),
    status: z.enum(["available", "in_route", "unavailable"]).optional(),
  })
  .superRefine((values, ctx) => {
    if (onlyDigits(values.document ?? "") && !isValidCpf(values.document ?? "")) {
      ctx.addIssue({ code: "custom", path: ["document"], message: "CPF inválido" });
    }

    if (onlyDigits(values.phone ?? "") && !isValidPhone(values.phone ?? "")) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Telefone deve ter DDD e 8 ou 9 dígitos",
      });
    }

    if (onlyDigits(values.cnh ?? "") && !isValidCnh(values.cnh ?? "")) {
      ctx.addIssue({ code: "custom", path: ["cnh"], message: "A CNH tem 11 dígitos" });
    }

    // Categoria e validade só valem juntas: categoria sem validade não diz se
    // a habilitação ainda vale, e validade sem categoria não diz o que ele
    // pode dirigir.
    if (values.cnhCategory && !values.cnhExpiration) {
      ctx.addIssue({
        code: "custom",
        path: ["cnhExpiration"],
        message: "Informe a validade da CNH",
      });
    }

    if (values.cnhExpiration && !values.cnhCategory) {
      ctx.addIssue({
        code: "custom",
        path: ["cnhCategory"],
        message: "Informe a categoria da CNH",
      });
    }
  });

export type DriverFormInput = z.infer<typeof driverFormSchema>;
