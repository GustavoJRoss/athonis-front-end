"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { vehicleFormSchema, type VehicleFormInput } from "@/lib/validation/vehicle";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/input/masked-input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Radio } from "@/components/ui/radio";
import { Grid, Inline, Stack, Text } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DialogBody, DialogFooter, DialogForm } from "@/components/ui/dialog";
import { VEHICLE_STATUS_META, VEHICLE_TYPE_LABEL } from "@/constants/domain";
import { CnhWarning } from "@/features/shared/cnh-warning";
import { podeDirigir } from "@/lib/utils/cnh";
import { maskPlate } from "@/lib/utils/masks";
import type { Driver } from "@/types/domain";

/** Cada tipo diz que categoria de CNH o motorista precisa ter. */
const TYPE_OPTIONS: SelectOption[] = [
  { value: "van", label: VEHICLE_TYPE_LABEL.van, description: "Exige CNH categoria B" },
  { value: "truck", label: VEHICLE_TYPE_LABEL.truck, description: "Exige CNH categoria C" },
  { value: "motorcycle", label: VEHICLE_TYPE_LABEL.motorcycle, description: "Exige CNH categoria A" },
  { value: "utility", label: VEHICLE_TYPE_LABEL.utility, description: "Exige CNH categoria B" },
];

export type VehicleFormProps = {
  defaultValues?: Partial<VehicleFormInput>;
  drivers: Driver[];
  onSubmit: (values: VehicleFormInput) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
  /** Explícito: no cadastro não há situação a definir ainda. */
  isEditing?: boolean;
};

export function VehicleForm({
  defaultValues,
  drivers,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  loading = false,
  isEditing = false,
}: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof vehicleFormSchema>, unknown, VehicleFormInput>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: { status: "available", type: "van", driverId: null, ...defaultValues },
  });

  const type = watch("type");
  const driverId = watch("driverId");
  const selectedDriver = drivers.find((driver) => driver.id === driverId) ?? null;

  // "Em uso" é consequência de estar numa rota, não uma escolha. Quem está
  // rodando não vira "disponível" porque alguém abriu o cadastro e salvou.
  const emUso = defaultValues?.status === "in_use";

  // A opção continua selecionável: o rótulo diz o problema em vez de esconder
  // o motorista, para não parecer que o cadastro sumiu.
  const driverOptions: SelectOption[] = useMemo(
    () =>
      drivers.map((driver) => ({
        value: driver.id,
        label: driver.name,
        description:
          driver.cnhCategory && type && !podeDirigir(driver.cnhCategory, type)
            ? `CNH ${driver.cnhCategory} — não habilita este veículo`
            : undefined,
      })),
    [drivers, type],
  );

  return (
    <DialogForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogBody>
        <Stack gap={6}>
          {/* ----------------------------------------------- Identificação */}
          <Stack gap={3}>
            <Text size="label" weight="medium">
              Identificação
            </Text>

            <Grid columns={1} gap={4} className="[&>*]:min-w-0 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Nome"
                required
                description="Como o veículo é chamado na operação"
                placeholder="Van de Entregas 001"
                error={errors.name?.message}
                containerClassName="sm:col-span-2"
                {...register("name")}
              />

              <Controller
                control={control}
                name="plate"
                render={({ field }) => (
                  <MaskedInput
                    label="Placa"
                    placeholder="ABC1D23"
                    error={errors.plate?.message}
                    mask={maskPlate}
                    inputMode="text"
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />

              <Input
                label="Ano"
                type="number"
                placeholder="2024"
                error={errors.year?.message}
                {...register("year")}
              />

              <Input label="Marca" error={errors.brand?.message} {...register("brand")} />
              <Input label="Modelo" error={errors.model?.message} {...register("model")} />
            </Grid>
          </Stack>

          {/* ------------------------------------------------------ Operação */}
          <Stack gap={3}>
            <Text size="label" weight="medium">
              Operação
            </Text>

            <Grid columns={1} gap={4} className="[&>*]:min-w-0 sm:grid-cols-2 lg:grid-cols-3">
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    label="Tipo"
                    required
                    error={errors.type?.message}
                    options={TYPE_OPTIONS}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                )}
              />

              <Input
                label="Capacidade (kg)"
                type="number"
                description="Usada para distribuir a carga nas rotas"
                error={errors.capacityKg?.message}
                {...register("capacityKg")}
              />

              <Controller
                control={control}
                name="driverId"
                render={({ field }) => (
                  <Select
                    label="Motorista habitual"
                    placeholder="Sem motorista"
                    emptyMessage="Nenhum motorista cadastrado"
                    options={driverOptions}
                    value={field.value ? [field.value] : []}
                    onValueChange={(value) => field.onChange(value[0] ?? null)}
                  />
                )}
              />
            </Grid>

            <CnhWarning driver={selectedDriver} vehicleType={type} />
          </Stack>

          {/* ------------------------------------------------------ Situação */}
          {isEditing &&
            (emUso ? (
              <Stack gap={2}>
                <Text size="label" weight="medium">
                  Situação
                </Text>
                <Inline gap={3} align="center">
                  <StatusBadge tone={VEHICLE_STATUS_META.in_use.tone}>
                    {VEHICLE_STATUS_META.in_use.label}
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
                    label="Situação"
                    orientation="horizontal"
                    options={[
                      { value: "available", label: "Disponível" },
                      { value: "maintenance", label: "Manutenção" },
                      { value: "inactive", label: "Inativo" },
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
