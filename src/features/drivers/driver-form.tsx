"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { driverFormSchema, type DriverFormInput } from "@/lib/validation/driver";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/input/masked-input";
import { Radio } from "@/components/ui/radio";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Box, Grid, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DialogBody, DialogFooter, DialogForm } from "@/components/ui/dialog";
import { maskCnh, maskCpf, maskPhone } from "@/lib/utils/masks";
import { formatDateString, parseDateString } from "@/lib/utils/date";
import { validadeCnh, validadeCnhLabel } from "@/lib/utils/cnh";
import {
  CNH_CATEGORY_OPTIONS,
  cnhCategoryDescription,
  DRIVER_STATUS_META,
} from "@/constants/domain";

export type DriverFormProps = {
  defaultValues?: Partial<DriverFormInput>;
  onSubmit: (values: DriverFormInput) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
  /** Explícito: no cadastro não há disponibilidade a definir ainda. */
  isEditing?: boolean;
};

export function DriverForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  loading = false,
  isEditing = false,
}: DriverFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<DriverFormInput>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      status: "available",
      cnhCategory: null,
      cnhExpiration: null,
      ...defaultValues,
    },
  });

  // "Em rota" é consequência de uma rota ativa, não uma escolha. Quem está
  // rodando não vira "disponível" porque alguém abriu o cadastro e salvou.
  const emRota = defaultValues?.status === "in_route";

  // O aviso aparece enquanto se preenche, não só depois de salvar: cadastrar
  // uma CNH já vencida sem perceber é o erro que este campo existe para evitar.
  const validade = validadeCnh(watch("cnhExpiration") ?? null);
  const avisoValidade = validadeCnhLabel(validade);

  return (
    <DialogForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogBody>
        <Stack gap={6}>
          {/* -------------------------------------------------- Identificação */}
          <Stack gap={3}>
            <Text size="label" weight="medium">
              Identificação
            </Text>

            <Grid columns={1} gap={4} className="[&>*]:min-w-0 sm:grid-cols-2">
              <Input
                label="Nome completo"
                required
                error={errors.name?.message}
                containerClassName="sm:col-span-2"
                {...register("name")}
              />

              <Controller
                control={control}
                name="document"
                render={({ field }) => (
                  <MaskedInput
                    label="CPF"
                    placeholder="000.000.000-00"
                    error={errors.document?.message}
                    mask={maskCpf}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <MaskedInput
                    label="Telefone"
                    placeholder="(11) 91234-5678"
                    error={errors.phone?.message}
                    mask={maskPhone}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Grid>
          </Stack>

          {/* ------------------------------------------------------------ CNH */}
          <Stack gap={3}>
            <Text size="label" weight="medium">
              Habilitação
            </Text>

            <Text size="caption" color="muted">
              A categoria define que veículo o motorista pode dirigir, e a validade
              impede escalar quem está com a CNH vencida.
            </Text>

            <Grid columns={1} gap={4} className="[&>*]:min-w-0 sm:grid-cols-2 lg:grid-cols-3">
              <Controller
                control={control}
                name="cnh"
                render={({ field }) => (
                  <MaskedInput
                    label="Número da CNH"
                    placeholder="11 dígitos"
                    error={errors.cnh?.message}
                    mask={maskCnh}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />

              <Controller
                control={control}
                name="cnhCategory"
                render={({ field }) => (
                  <Select
                    label="Categoria"
                    placeholder="Selecione"
                    error={errors.cnhCategory?.message}
                    description={cnhCategoryDescription(field.value)}
                    options={CNH_CATEGORY_OPTIONS}
                    value={field.value ? [field.value] : []}
                    onValueChange={(value) => field.onChange(value[0] ?? null)}
                  />
                )}
              />

              <Controller
                control={control}
                name="cnhExpiration"
                render={({ field }) => (
                  <DatePicker
                    label="Validade"
                    clearable
                    error={errors.cnhExpiration?.message}
                    value={parseDateString(field.value)}
                    onValueChange={(date) => field.onChange(formatDateString(date) || null)}
                  />
                )}
              />
            </Grid>

            {avisoValidade && (
              <Box
                className={
                  validade.estado === "vencida"
                    ? "rounded-md border border-danger/40 bg-danger/10 p-3"
                    : "rounded-md border border-warning/40 bg-warning/10 p-3"
                }
              >
                <Inline gap={2} align="center">
                  <Icon
                    icon={AlertTriangle}
                    size="sm"
                    className={validade.estado === "vencida" ? "text-danger" : "text-warning"}
                  />
                  <Text size="caption">
                    {avisoValidade}
                    {validade.estado === "vencida" && " — o motorista não pode rodar."}
                  </Text>
                </Inline>
              </Box>
            )}
          </Stack>

          {/* ------------------------------------------------- Disponibilidade */}
          {isEditing &&
            (emRota ? (
              <Stack gap={2}>
                <Text size="label" weight="medium">
                  Disponibilidade
                </Text>
                <Inline gap={3} align="center">
                  <StatusBadge tone={DRIVER_STATUS_META.in_route.tone}>
                    {DRIVER_STATUS_META.in_route.label}
                  </StatusBadge>
                  <Text size="caption" color="muted">
                    Volta a ficar disponível quando a rota terminar.
                  </Text>
                </Inline>
              </Stack>
            ) : (
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Radio
                    label="Disponibilidade"
                    orientation="horizontal"
                    options={[
                      { value: "available", label: "Disponível" },
                      { value: "unavailable", label: "Indisponível" },
                    ]}
                    value={field.value ?? "available"}
                    onValueChange={(value) => field.onChange(value ?? "available")}
                  />
                )}
              />
            ))}
        </Stack>
      </DialogBody>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </DialogForm>
  );
}
