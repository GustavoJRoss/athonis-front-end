"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { vehicleFormSchema, type VehicleFormInput } from "@/lib/validation/vehicle";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Radio } from "@/components/ui/radio";
import { Grid } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { DialogBody, DialogFooter, DialogForm } from "@/components/ui/dialog";
import { VEHICLE_TYPE_LABEL } from "@/constants/domain";
import { CnhWarning } from "@/features/shared/cnh-warning";
import { podeDirigir } from "@/lib/utils/cnh";
import type { Driver } from "@/types/domain";

const TYPE_OPTIONS: SelectOption[] = Object.entries(VEHICLE_TYPE_LABEL).map(([value, label]) => ({
  value,
  label,
}));

export type VehicleFormProps = {
  defaultValues?: Partial<VehicleFormInput>;
  drivers: Driver[];
  onSubmit: (values: VehicleFormInput) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
};

export function VehicleForm({
  defaultValues,
  drivers,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  loading = false,
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

  // A opcao continua selecionavel: o rotulo diz o problema em vez de esconder
  // o motorista, para nao parecer que o cadastro sumiu.
  const driverOptions: SelectOption[] = useMemo(
    () =>
      drivers.map((driver) => ({
        value: driver.id,
        label:
          driver.cnhCategory && type && !podeDirigir(driver.cnhCategory, type)
            ? `${driver.name} (CNH ${driver.cnhCategory})`
            : driver.name,
      })),
    [drivers, type],
  );

  return (
    <DialogForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogBody>
        <Grid columns={1} gap={4} className="[&>*]:min-w-0 sm:grid-cols-2">
          <Input
            label="Nome"
            description="Como o veículo é chamado na operação"
            placeholder="Van de Entregas 001"
            error={errors.name?.message}
            containerClassName="sm:col-span-2"
            {...register("name")}
          />
          <Input label="Placa" required error={errors.plate?.message} {...register("plate")} />
          <Input label="Modelo" required error={errors.model?.message} {...register("model")} />
          <Input label="Marca" required error={errors.brand?.message} {...register("brand")} />
          <Input
            label="Capacidade (kg)"
            type="number"
            required
            error={errors.capacityKg?.message}
            {...register("capacityKg")}
          />
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                label="Tipo"
                options={TYPE_OPTIONS}
                value={[field.value]}
                onValueChange={(value) => field.onChange(value[0])}
              />
            )}
          />
          <Controller
            control={control}
            name="driverId"
            render={({ field }) => (
              <Select
                label="Motorista"
                placeholder="Sem motorista"
                options={driverOptions}
                value={field.value ? [field.value] : []}
                onValueChange={(value) => field.onChange(value[0] ?? null)}
              />
            )}
          />
          <div className="sm:col-span-2">
            <CnhWarning driver={selectedDriver} vehicleType={type} />
          </div>
          <div className="col-span-2">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Radio
                  label="Status"
                  orientation="horizontal"
                  options={[
                    { value: "available", label: "Disponível" },
                    { value: "in_use", label: "Em uso" },
                    { value: "maintenance", label: "Manutenção" },
                    { value: "inactive", label: "Inativo" },
                  ]}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "available")}
                />
              )}
            />
          </div>
        </Grid>
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
