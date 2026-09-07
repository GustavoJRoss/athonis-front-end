"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverFormSchema, type DriverFormInput } from "@/lib/validation/driver";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/input/masked-input";
import { Radio } from "@/components/ui/radio";
import { Grid, Inline, Stack, Text } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DialogBody, DialogFooter, DialogForm } from "@/components/ui/dialog";
import { maskCnh, maskCpf, maskPhone } from "@/lib/utils/masks";
import { DRIVER_STATUS_META } from "@/constants/domain";

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
    formState: { errors },
  } = useForm<DriverFormInput>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: { status: "available", ...defaultValues },
  });

  // "Em rota" é consequência de uma rota ativa, não uma escolha. Quem está
  // rodando não vira "disponível" porque alguém abriu o cadastro e salvou.
  const emRota = defaultValues?.status === "in_route";

  return (
    <DialogForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogBody>
        <Stack gap={6}>
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

            <Controller
              control={control}
              name="cnh"
              render={({ field }) => (
                <MaskedInput
                  label="CNH"
                  placeholder="11 dígitos"
                  error={errors.cnh?.message}
                  mask={maskCnh}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </Grid>

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
