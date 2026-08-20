"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { orderFormSchema, type OrderFormInput } from "@/lib/validation/order";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Grid } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";
import { ORDER_STATUS_META } from "@/constants/domain";

const STATUS_OPTIONS: SelectOption[] = Object.entries(ORDER_STATUS_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

const DELIVERY_WINDOW_OPTIONS: SelectOption[] = [
  { value: "08:00–12:00", label: "08:00–12:00" },
  { value: "13:00–17:00", label: "13:00–17:00" },
  { value: "18:00–22:00", label: "18:00–22:00" },
];

function toDate(value: string | undefined) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toDateString(date: Date | null) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export type OrderFormProps = {
  defaultValues?: Partial<OrderFormInput>;
  customerOptions: SelectOption[];
  driverOptions: SelectOption[];
  onSubmit: (values: OrderFormInput) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
};

export function OrderForm({
  defaultValues,
  customerOptions,
  driverOptions,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  loading = false,
}: OrderFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.input<typeof orderFormSchema>, unknown, OrderFormInput>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { status: "pending", driverId: null, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogBody>
        <Grid columns={2} gap={4}>
          <Controller
            control={control}
            name="customerId"
            render={({ field }) => (
              <Select
                label="Cliente"
                required
                searchable
                error={errors.customerId?.message}
                options={customerOptions}
                value={field.value ? [field.value] : []}
                onValueChange={(value) => field.onChange(value[0] ?? "")}
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
          <Input label="Origem" required error={errors.origin?.message} {...register("origin")} />
          <Input label="Destino" required error={errors.destination?.message} {...register("destination")} />
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker
                label="Data"
                required
                error={errors.date?.message}
                value={toDate(field.value)}
                onValueChange={(date) => field.onChange(toDateString(date))}
              />
            )}
          />
          <Controller
            control={control}
            name="deliveryWindow"
            render={({ field }) => (
              <Select
                label="Janela de entrega"
                required
                error={errors.deliveryWindow?.message}
                options={DELIVERY_WINDOW_OPTIONS}
                value={field.value ? [field.value] : []}
                onValueChange={(value) => field.onChange(value[0] ?? "")}
              />
            )}
          />
          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            required
            error={errors.value?.message}
            {...register("value")}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label="Status"
                options={STATUS_OPTIONS}
                value={field.value ? [field.value] : []}
                onValueChange={(value) => field.onChange(value[0] ?? "pending")}
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
