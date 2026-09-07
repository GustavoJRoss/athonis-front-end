import { z } from "zod";

/**
 * Espelha UpdateCompanyDto no backend.
 *
 * `idCompany` não está aqui: o identificador do tenant é definido na criação
 * (feita direto no banco) e não pode ser alterado pela aplicação.
 */
export const companyFormSchema = z.object({
  // Identificação
  corporateName: z.string().min(2, "Informe a razão social").max(150),
  tradeName: z.string().max(100).optional().or(z.literal("")),
  document: z.string().min(11, "CNPJ inválido").max(18),
  stateRegistration: z.string().max(20).optional().or(z.literal("")),
  municipalRegistration: z.string().max(20).optional().or(z.literal("")),

  // Contato
  email: z.email("Email inválido").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  website: z.string().max(150).optional().or(z.literal("")),

  // Depósito — origem e destino de toda rota
  depotStreet: z.string().max(100).optional().or(z.literal("")),
  depotNumber: z.string().max(10).optional().or(z.literal("")),
  depotComplement: z.string().max(100).optional().or(z.literal("")),
  depotDistrict: z.string().max(100).optional().or(z.literal("")),
  depotCity: z.string().max(100).optional().or(z.literal("")),
  depotState: z.string().max(2).optional().or(z.literal("")),
  depotZipCode: z.string().max(10).optional().or(z.literal("")),
  depotLatitude: z.coerce
    .number()
    .min(-90, "Latitude entre -90 e 90")
    .max(90, "Latitude entre -90 e 90")
    .nullable()
    .optional(),
  depotLongitude: z.coerce
    .number()
    .min(-180, "Longitude entre -180 e 180")
    .max(180, "Longitude entre -180 e 180")
    .nullable()
    .optional(),

  // Parâmetros que alimentam a otimização
  costPerKm: z.coerce.number().min(0, "Informe um valor válido"),
  costPerHour: z.coerce.number().min(0, "Informe um valor válido"),
  stopDurationMinutes: z.coerce.number().int().min(1, "Mínimo de 1 minuto"),
  defaultVehicleCapacityKg: z.coerce.number().int().min(1, "Mínimo de 1 kg"),
  operationStartTime: z
    .string()
    .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, "Use o formato HH:mm")
    .optional()
    .or(z.literal("")),
  operationEndTime: z
    .string()
    .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, "Use o formato HH:mm")
    .optional()
    .or(z.literal("")),

  // Interface
  logoUrl: z.string().max(300).optional().or(z.literal("")),
  timezone: z.string().max(40).optional().or(z.literal("")),
});

export type CompanyFormInput = z.infer<typeof companyFormSchema>;
