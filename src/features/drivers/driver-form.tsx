"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverFormSchema, type DriverFormInput } from "@/lib/validation/driver";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";
import { Grid } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";

export type DriverFormProps = {
  defaultValues?: Partial<DriverFormInput>;
  onSubmit: (values: DriverFormInput) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
};

export function DriverForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  loading = false,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogBody>
        <Grid columns={2} gap={4}>
          <Input
            label="Nome completo"
            required
            error={errors.name?.message}
            containerClassName="col-span-2"
            {...register("name")}
          />
          <Input label="CPF" required error={errors.document?.message} {...register("document")} />
          <Input label="CNH" required error={errors.cnh?.message} {...register("cnh")} />
          <Input
            label="Telefone"
            required
            error={errors.phone?.message}
            containerClassName="col-span-2"
            {...register("phone")}
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
                    { value: "in_route", label: "Em rota" },
                    { value: "unavailable", label: "Indisponível" },
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
