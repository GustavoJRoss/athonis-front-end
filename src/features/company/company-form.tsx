"use client";

import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AlertTriangle, Save } from "lucide-react";
import { companyFormSchema, type CompanyFormInput } from "@/lib/validation/company";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/input/masked-input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Box, Grid, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import type { Company } from "@/types/domain";
import { maskCep, maskCnpj, maskPhone } from "@/lib/utils/masks";
import { useCepAutofill } from "@/features/shared/use-cep-autofill";

const UF_OPTIONS: SelectOption[] = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
].map((uf) => ({ value: uf, label: uf }));

const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: "America/Sao_Paulo", label: "Brasília (America/Sao_Paulo)" },
  { value: "America/Manaus", label: "Manaus (America/Manaus)" },
  { value: "America/Belem", label: "Belém (America/Belem)" },
  { value: "America/Cuiaba", label: "Cuiabá (America/Cuiaba)" },
  { value: "America/Rio_Branco", label: "Rio Branco (America/Rio_Branco)" },
  { value: "America/Noronha", label: "Fernando de Noronha (America/Noronha)" },
];

function toFormValues(company: Company): z.input<typeof companyFormSchema> {
  return {
    corporateName: company.corporateName,
    tradeName: company.tradeName,
    document: company.document,
    stateRegistration: company.stateRegistration,
    municipalRegistration: company.municipalRegistration,
    email: company.email,
    phone: company.phone,
    website: company.website,
    depotStreet: company.depotStreet,
    depotNumber: company.depotNumber,
    depotComplement: company.depotComplement,
    depotDistrict: company.depotDistrict,
    depotCity: company.depotCity,
    depotState: company.depotState,
    depotZipCode: company.depotZipCode,
    depotLatitude: company.depotLatitude,
    depotLongitude: company.depotLongitude,
    costPerKm: company.costPerKm,
    costPerHour: company.costPerHour,
    stopDurationMinutes: company.stopDurationMinutes,
    defaultVehicleCapacityKg: company.defaultVehicleCapacityKg,
    operationStartTime: company.operationStartTime,
    operationEndTime: company.operationEndTime,
    logoUrl: company.logoUrl,
    timezone: company.timezone,
  };
}

export type CompanyFormProps = {
  company: Company;
  onSubmit: (values: CompanyFormInput) => Promise<void> | void;
  loading?: boolean;
  canEdit?: boolean;
};

export function CompanyForm({ company, onSubmit, loading = false, canEdit = true }: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
    // z.coerce faz o tipo de entrada (string do input) diferir do de saída
    // (number), então o formulário declara os dois.
  } = useForm<z.input<typeof companyFormSchema>, unknown, CompanyFormInput>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: toFormValues(company),
  });

  const depotZipCode = watch("depotZipCode");

  const preencherDeposito = useCallback(
    (address: { street: string; district: string; city: string; state: string }) => {
      if (address.street) setValue("depotStreet", address.street, { shouldDirty: true });
      if (address.district) setValue("depotDistrict", address.district, { shouldDirty: true });
      setValue("depotCity", address.city, { shouldDirty: true });
      setValue("depotState", address.state, { shouldDirty: true });
    },
    [setValue],
  );

  const { consultar: consultarCep, error: erroCep } = useCepAutofill({ onFound: preencherDeposito });

  useEffect(() => {
    if (canEdit && depotZipCode) consultarCep(depotZipCode);
  }, [canEdit, depotZipCode, consultarCep]);

  const identification = (
    <Grid columns={2} gap={4}>
      <Input
        label="Razão social"
        required
        disabled={!canEdit}
        error={errors.corporateName?.message}
        containerClassName="col-span-2"
        {...register("corporateName")}
      />
      <Input label="Nome fantasia" disabled={!canEdit} error={errors.tradeName?.message} {...register("tradeName")} />
      <Controller
        control={control}
        name="document"
        render={({ field }) => (
          <MaskedInput
            label="CNPJ"
            required
            placeholder="00.000.000/0000-00"
            disabled={!canEdit}
            error={errors.document?.message}
            mask={maskCnpj}
            value={field.value ?? ""}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      <Input
        label="Inscrição estadual"
        disabled={!canEdit}
        error={errors.stateRegistration?.message}
        {...register("stateRegistration")}
      />
      <Input
        label="Inscrição municipal"
        disabled={!canEdit}
        error={errors.municipalRegistration?.message}
        {...register("municipalRegistration")}
      />
      <Input label="Email" type="email" disabled={!canEdit} error={errors.email?.message} {...register("email")} />
      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <MaskedInput
            label="Telefone"
            placeholder="(11) 3456-7890"
            disabled={!canEdit}
            error={errors.phone?.message}
            mask={maskPhone}
            value={field.value ?? ""}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      <Input
        label="Site"
        disabled={!canEdit}
        error={errors.website?.message}
        containerClassName="col-span-2"
        {...register("website")}
      />
    </Grid>
  );

  const depot = (
    <Stack gap={4}>
      {!company.hasDepotCoordinates && (
        <Box surface="surface-muted" border="default" radius="md" padding={3}>
          <Inline gap={2} align="start">
            <Icon icon={AlertTriangle} size="sm" className="text-warning" />
            <Text size="body-sm">
              Sem as coordenadas do depósito, toda rota parte de um ponto padrão em São Paulo.
              Preencha latitude e longitude para que a otimização use o seu endereço real.
            </Text>
          </Inline>
        </Box>
      )}

      <Grid columns={2} gap={4}>
        <Controller
          control={control}
          name="depotZipCode"
          render={({ field }) => (
            <MaskedInput
              label="CEP"
              placeholder="00000-000"
              description="Preenche rua, bairro, cidade e UF"
              disabled={!canEdit}
              error={errors.depotZipCode?.message ?? erroCep ?? undefined}
              mask={maskCep}
              value={field.value ?? ""}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <Input
          label="Rua"
          disabled={!canEdit}
          error={errors.depotStreet?.message}
          {...register("depotStreet")}
        />
        <Input label="Número" disabled={!canEdit} error={errors.depotNumber?.message} {...register("depotNumber")} />
        <Input
          label="Complemento"
          disabled={!canEdit}
          error={errors.depotComplement?.message}
          {...register("depotComplement")}
        />
        <Input label="Bairro" disabled={!canEdit} error={errors.depotDistrict?.message} {...register("depotDistrict")} />
        <Input label="Cidade" disabled={!canEdit} error={errors.depotCity?.message} {...register("depotCity")} />
        <Controller
          control={control}
          name="depotState"
          render={({ field }) => (
            <Select
              label="UF"
              searchable
              disabled={!canEdit}
              error={errors.depotState?.message}
              options={UF_OPTIONS}
              value={field.value ? [field.value] : []}
              onValueChange={(value) => field.onChange(value[0] ?? "")}
            />
          )}
        />
        <Input
          label="Latitude"
          type="number"
          step="0.0000001"
          disabled={!canEdit}
          description="Ponto de partida das rotas"
          error={errors.depotLatitude?.message}
          {...register("depotLatitude")}
        />
        <Input
          label="Longitude"
          type="number"
          step="0.0000001"
          disabled={!canEdit}
          description="Ponto de partida das rotas"
          error={errors.depotLongitude?.message}
          {...register("depotLongitude")}
        />
      </Grid>
    </Stack>
  );

  const operation = (
    <Stack gap={4}>
      <Text size="body-sm" color="muted">
        Estes valores alimentam a otimização de rotas. Antes eram constantes no código, iguais
        para todas as empresas.
      </Text>

      <Grid columns={2} gap={4}>
        <Input
          label="Custo por km (R$)"
          type="number"
          step="0.01"
          disabled={!canEdit}
          error={errors.costPerKm?.message}
          {...register("costPerKm")}
        />
        <Input
          label="Custo por hora (R$)"
          type="number"
          step="0.01"
          disabled={!canEdit}
          error={errors.costPerHour?.message}
          {...register("costPerHour")}
        />
        <Input
          label="Tempo por parada (min)"
          type="number"
          disabled={!canEdit}
          description="Tempo médio parado em cada entrega"
          error={errors.stopDurationMinutes?.message}
          {...register("stopDurationMinutes")}
        />
        <Input
          label="Capacidade padrão (kg)"
          type="number"
          disabled={!canEdit}
          description="Usada quando o veículo não tem capacidade cadastrada"
          error={errors.defaultVehicleCapacityKg?.message}
          {...register("defaultVehicleCapacityKg")}
        />
        <Input
          label="Início da operação"
          placeholder="08:00"
          disabled={!canEdit}
          error={errors.operationStartTime?.message}
          {...register("operationStartTime")}
        />
        <Input
          label="Fim da operação"
          placeholder="18:00"
          disabled={!canEdit}
          error={errors.operationEndTime?.message}
          {...register("operationEndTime")}
        />
        <Controller
          control={control}
          name="timezone"
          render={({ field }) => (
            <Select
              label="Fuso horário"
              disabled={!canEdit}
              error={errors.timezone?.message}
              options={TIMEZONE_OPTIONS}
              value={field.value ? [field.value] : []}
              onValueChange={(value) => field.onChange(value[0] ?? "")}
            />
          )}
        />
        <Input
          label="URL do logotipo"
          disabled={!canEdit}
          description="Exibido no topo da aplicação"
          error={errors.logoUrl?.message}
          {...register("logoUrl")}
        />
      </Grid>
    </Stack>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={5}>
        <Tabs
          items={[
            { value: "identificacao", label: "Identificação", content: identification },
            { value: "deposito", label: "Depósito", content: depot },
            { value: "operacao", label: "Operação", content: operation },
          ]}
        />

        {canEdit && (
          <Inline justify="end" gap={3}>
            <Button type="submit" variant="primary" loading={loading} disabled={!isDirty}>
              <Icon icon={Save} size="sm" /> Salvar alterações
            </Button>
          </Inline>
        )}
      </Stack>
    </form>
  );
}
