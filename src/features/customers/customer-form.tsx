"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerFormSchema, type CustomerFormInput } from "@/lib/validation/customer";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";
import { Grid } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";

export type CustomerFormProps = {
  defaultValues?: Partial<CustomerFormInput>;
  onSubmit: (values: CustomerFormInput) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
};

export function CustomerForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  loading = false,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CustomerFormInput>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: { status: "active", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogBody>
        <Grid columns={2} gap={4}>
          <Input
            label="Nome / Razão social"
            required
            error={errors.name?.message}
            containerClassName="col-span-2"
            {...register("name")}
          />
          <Input label="Documento (CNPJ/CPF)" required error={errors.document?.message} {...register("document")} />
          <Input label="Telefone" required error={errors.phone?.message} {...register("phone")} />
          <Input
            label="Email"
            type="email"
            required
            error={errors.email?.message}
            containerClassName="col-span-2"
            {...register("email")}
          />
          <Input
            label="Endereço"
            required
            error={errors.address?.message}
            containerClassName="col-span-2"
            {...register("address")}
          />
          <Input label="Cidade" required error={errors.city?.message} {...register("city")} />
          <Input label="UF" required maxLength={2} error={errors.state?.message} {...register("state")} />
          <div className="col-span-2">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Radio
                  label="Status"
                  orientation="horizontal"
                  options={[
                    { value: "active", label: "Ativo" },
                    { value: "inactive", label: "Inativo" },
                  ]}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "active")}
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
