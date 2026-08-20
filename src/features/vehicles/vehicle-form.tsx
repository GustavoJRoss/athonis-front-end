"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { vehicleFormSchema, type VehicleFormInput } from "@/lib/validation/vehicle";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Radio } from "@/components/ui/radio";
import { Grid } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";
import { VEHICLE_TYPE_LABEL } from "@/constants/domain";

const TYPE_OPTIONS: SelectOption[] = Object.entries(VEHICLE_TYPE_LABEL).map(([value, label]) => ({
  value,
  label,
}));

export type VehicleFormProps = {
  defaultValues?: Partial<VehicleFormInput>;
  driverOptions: SelectOption[];
  onSubmit: (values: VehicleFormInput) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
};

export function VehicleForm({
  defaultValues,
  driverOptions,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  loading = false,
}: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.input<typeof vehicleFormSchema>, unknown, VehicleFormInput>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: { status: "available", type: "van", driverId: null, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogBody>
        <Grid columns={2} gap={4}>
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
    </form>
  );
}
