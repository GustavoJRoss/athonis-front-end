"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routeFormSchema, type RouteFormInput } from "@/lib/validation/route";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Grid } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";
import { ROUTE_STATUS_META } from "@/constants/domain";

const STATUS_OPTIONS: SelectOption[] = Object.entries(ROUTE_STATUS_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

export type RouteFormProps = {
  defaultValues?: Partial<RouteFormInput>;
  driverOptions: SelectOption[];
  vehicleOptions: SelectOption[];
  orderOptions: SelectOption[];
  onSubmit: (values: RouteFormInput) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
};

export function RouteForm({
  defaultValues,
  driverOptions,
  vehicleOptions,
  orderOptions,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  loading = false,
}: RouteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RouteFormInput>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      status: "planned",
      driverId: null,
      vehicleId: null,
      orderIds: [],
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogBody>
        <Grid columns={2} gap={4}>
          <Input
            label="Nome da rota"
            required
            error={errors.name?.message}
            containerClassName="col-span-2"
            {...register("name")}
          />
          <Input label="Região" required error={errors.region?.message} {...register("region")} />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label="Status"
                options={STATUS_OPTIONS}
                value={field.value ? [field.value] : []}
                onValueChange={(value) => field.onChange(value[0] ?? "planned")}
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
          <Controller
            control={control}
            name="vehicleId"
            render={({ field }) => (
              <Select
                label="Veículo"
                placeholder="Sem veículo"
                options={vehicleOptions}
                value={field.value ? [field.value] : []}
                onValueChange={(value) => field.onChange(value[0] ?? null)}
              />
            )}
          />
          <Controller
            control={control}
            name="orderIds"
            render={({ field }) => (
              <Select
                label="Pedidos associados"
                placeholder="Selecione os pedidos"
                multiple
                searchable
                options={orderOptions}
                value={field.value}
                onValueChange={field.onChange}
                className="col-span-2"
              />
            )}
          />
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
