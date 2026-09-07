"use client";

import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { customerFormSchema, type CustomerFormInput } from "@/lib/validation/customer";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/input/masked-input";
import { Radio } from "@/components/ui/radio";
import { Select } from "@/components/ui/select";
import { Grid, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { DialogBody, DialogFooter, DialogForm } from "@/components/ui/dialog";
import { maskCep, maskDocument, maskPhone } from "@/lib/utils/masks";
import { useCepAutofill } from "@/features/shared/use-cep-autofill";

const UF_OPTIONS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
].map((uf) => ({ value: uf, label: uf }));

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
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormInput>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: { status: "active", type: "J", ...defaultValues },
  });

  // O tipo comanda os rótulos e a máscara do documento.
  const type = watch("type");
  const isPessoaFisica = type === "F";

  const zipCode = watch("zipCode");

  const preencherEndereco = useCallback(
    (address: { street: string; district: string; city: string; state: string }) => {
      // Rua e bairro nem sempre vêm (CEP de cidade inteira); nesse caso o
      // usuário completa à mão em vez de receber campo vazio sem explicação.
      if (address.street) setValue("street", address.street, { shouldValidate: true });
      if (address.district) setValue("district", address.district, { shouldValidate: true });
      setValue("city", address.city, { shouldValidate: true });
      setValue("state", address.state, { shouldValidate: true });
    },
    [setValue],
  );

  const { consultar, loading: buscandoCep, error: erroCep } = useCepAutofill({
    onFound: preencherEndereco,
  });

  // Busca sozinho assim que o CEP fica completo.
  useEffect(() => {
    if (zipCode) consultar(zipCode);
  }, [zipCode, consultar]);

  return (
    <DialogForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogBody>
        <Stack gap={6}>
          {/* ---------------------------------------------- Identificação */}
          <Stack gap={3}>
            <Text size="label" weight="medium">
              Identificação
            </Text>

            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Radio
                  label="Tipo de cliente"
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    // O documento muda de formato: o que estava digitado não
                    // vale mais como CPF/CNPJ do outro tipo.
                    setValue("document", "");
                  }}
                  orientation="horizontal"
                  options={[
                    { value: "J", label: "Pessoa Jurídica" },
                    { value: "F", label: "Pessoa Física" },
                  ]}
                />
              )}
            />

            <Grid columns={1} gap={4} className="[&>*]:min-w-0 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label={isPessoaFisica ? "Nome completo" : "Razão social"}
                required
                error={errors.name?.message}
                containerClassName="lg:col-span-2"
                {...register("name")}
              />

              <Controller
                control={control}
                name="document"
                render={({ field }) => (
                  <MaskedInput
                    label={isPessoaFisica ? "CPF" : "CNPJ"}
                    required
                    placeholder={isPessoaFisica ? "000.000.000-00" : "00.000.000/0000-00"}
                    error={errors.document?.message}
                    mask={(value) => maskDocument(value, type)}
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
                    required
                    placeholder="(11) 91234-5678"
                    error={errors.phone?.message}
                    mask={maskPhone}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />

              <Input
                label="Email"
                type="email"
                required
                error={errors.email?.message}
                containerClassName="lg:col-span-2"
                {...register("email")}
              />

              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Radio
                    label="Situação"
                    value={field.value}
                    onValueChange={field.onChange}
                    orientation="horizontal"
                    options={[
                      { value: "active", label: "Ativo" },
                      { value: "inactive", label: "Inativo" },
                    ]}
                  />
                )}
              />
            </Grid>
          </Stack>

          {/* --------------------------------------------------- Endereço */}
          <Stack gap={3}>
            <Inline justify="between" align="center" gap={3}>
              <Text size="label" weight="medium">
                Endereço
              </Text>
              {buscandoCep && (
                <Inline gap={2} align="center">
                  <Icon icon={Loader2} size="sm" className="animate-spin text-primary" />
                  <Text size="caption" color="muted">
                    Buscando endereço...
                  </Text>
                </Inline>
              )}
            </Inline>

            <Text size="caption" color="muted">
              Comece pelo CEP: rua, bairro, cidade e UF são preenchidos automaticamente.
              É a partir daqui que o endereço de entrega dos pedidos deste cliente vem.
            </Text>

            <Grid columns={1} gap={4} className="[&>*]:min-w-0 sm:grid-cols-2 lg:grid-cols-4">
              <Controller
                control={control}
                name="zipCode"
                render={({ field }) => (
                  <MaskedInput
                    label="CEP"
                    required
                    placeholder="00000-000"
                    error={errors.zipCode?.message ?? erroCep ?? undefined}
                    mask={maskCep}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />

              <Input
                label="Rua"
                required
                error={errors.street?.message}
                containerClassName="lg:col-span-2"
                {...register("street")}
              />

              <Input label="Número" required error={errors.number?.message} {...register("number")} />

              <Input
                label="Bairro"
                required
                error={errors.district?.message}
                containerClassName="lg:col-span-2"
                {...register("district")}
              />

              <Input label="Cidade" required error={errors.city?.message} {...register("city")} />

              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select
                    label="UF"
                    required
                    searchable
                    error={errors.state?.message}
                    options={UF_OPTIONS}
                    value={field.value ? [field.value] : []}
                    onValueChange={(value) => field.onChange(value[0] ?? "")}
                  />
                )}
              />

              <Input
                label="Complemento"
                error={errors.complement?.message}
                containerClassName="lg:col-span-2"
                {...register("complement")}
              />
            </Grid>
          </Stack>
        </Stack>
      </DialogBody>

      <DialogFooter>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </DialogForm>
  );
}
