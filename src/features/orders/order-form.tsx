"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2, MapPin, Pencil, RotateCcw } from "lucide-react";
import { orderFormSchema, type OrderFormInput } from "@/lib/validation/order";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/input/masked-input";
import { Select, type SelectOption } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Box, Grid, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { DialogBody, DialogFooter, DialogForm } from "@/components/ui/dialog";
import { ORDER_STATUS_META, ORDER_URGENCY_META } from "@/constants/domain";
import type { Customer, Driver, Vehicle } from "@/types/domain";
import { ANY_TIME, DELIVERY_WINDOW_OPTIONS } from "@/lib/utils/delivery-window";
import { maskCep } from "@/lib/utils/masks";
import { useCepAutofill } from "@/features/shared/use-cep-autofill";
import { CnhWarning } from "@/features/shared/cnh-warning";
import { podeDirigir } from "@/lib/utils/cnh";
import { vehicleLabel } from "@/lib/utils/vehicle-label";
import { formatDateString, parseDateString } from "@/lib/utils/date";

/** Valor do item "Sem cliente" — o Select trabalha com strings. */
const NO_CUSTOMER = "__none__";

const STATUS_OPTIONS: SelectOption[] = Object.entries(ORDER_STATUS_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

const URGENCY_OPTIONS: SelectOption[] = Object.entries(ORDER_URGENCY_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

const UF_OPTIONS: SelectOption[] = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
].map((uf) => ({ value: uf, label: uf }));

function formatAddress(parts: {
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}) {
  const line = [parts.street, parts.number, parts.district, parts.city, parts.state]
    .filter(Boolean)
    .join(", ");
  return parts.zipCode ? `${line} — CEP ${parts.zipCode}` : line;
}

export type OrderFormProps = {
  defaultValues?: Partial<OrderFormInput>;
  /**
   * Edição de um pedido existente. É explícito porque não dá para deduzir de
   * um campo: um pedido pode existir sem cliente (entrega avulsa).
   */
  isEditing?: boolean;
  customers: Customer[];
  drivers: Driver[];
  vehicles: Vehicle[];
  onSubmit: (values: OrderFormInput) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
};

export function OrderForm({
  defaultValues,
  isEditing = false,
  customers,
  drivers,
  vehicles,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  loading = false,
}: OrderFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof orderFormSchema>, unknown, OrderFormInput>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      status: "pending",
      urgency: "normal",
      driverId: null,
      vehicleId: null,
      quantity: 1,
      // Sem padrao: o campo comeca vazio, e zero passa a significar
      // "entrega sem valor declarado" so quando alguem digitar.
      value: undefined,
      deliveryWindow: ANY_TIME,
      ...defaultValues,
    },
  });

  // Motorista e veículo escolhidos, para conferir se a CNH cobre o veículo.
  const selectedDriver = drivers.find((driver) => driver.id === watch("driverId")) ?? null;
  const selectedVehicleType =
    vehicles.find((vehicle) => vehicle.id === watch("vehicleId"))?.type ?? null;

  const driverOptions: SelectOption[] = useMemo(
    () =>
      drivers.map((driver) => ({
        value: driver.id,
        label:
          driver.cnhCategory && selectedVehicleType && !podeDirigir(driver.cnhCategory, selectedVehicleType)
            ? `${driver.name} (CNH ${driver.cnhCategory})`
            : driver.name,
      })),
    [drivers, selectedVehicleType],
  );

  const vehicleOptions: SelectOption[] = useMemo(
    () => vehicles.map((vehicle) => ({ value: vehicle.id, label: vehicleLabel(vehicle) })),
    [vehicles],
  );

  const customerOptions: SelectOption[] = useMemo(
    () => [
      { value: NO_CUSTOMER, label: "Sem cliente (entrega avulsa)" },
      ...customers.map((customer) => ({ value: customer.id, label: customer.name })),
    ],
    [customers],
  );

  const customerId = watch("customerId");
  const selectedCustomer = customers.find((item) => item.id === customerId);

  // No cadastro, o endereço do cliente é usado como está; só é editado se o
  // usuário escolher entregar em outro lugar.
  const [editingAddress, setEditingAddress] = useState(isEditing);

  /**
   * Quando existe uma única opção, ela já vem escolhida — não faz sentido
   * obrigar o usuário a abrir uma lista de um item só.
   */
  useEffect(() => {
    if (isEditing) return;

    // Só conta cliente de verdade — a opção "Sem cliente" não é um cadastro.
    if (customers.length === 1 && !watch("customerId")) {
      setValue("customerId", customers[0].id, { shouldValidate: true });
    }
    if (driverOptions.length === 1 && !watch("driverId")) {
      setValue("driverId", driverOptions[0].value, { shouldValidate: true });
    }
    if (vehicleOptions.length === 1 && !watch("vehicleId")) {
      setValue("vehicleId", vehicleOptions[0].value, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers, driverOptions, vehicleOptions, isEditing]);

  // Ao escolher o cliente, o endereço de entrega vem do cadastro dele.
  // Numa entrega avulsa não há de onde puxar: os campos abrem para digitação.
  useEffect(() => {
    if (isEditing) return;

    if (!customerId) {
      setEditingAddress(true);
      return;
    }

    const customer = customers.find((item) => item.id === customerId);
    if (!customer) return;

    setValue("street", customer.street);
    setValue("number", customer.number);
    setValue("district", customer.district);
    setValue("city", customer.city);
    setValue("state", customer.state);
    setValue("zipCode", customer.zipCode);
    setEditingAddress(false);
  }, [customerId, customers, isEditing, setValue]);

  const zipCode = watch("zipCode");

  const preencherEndereco = useCallback(
    (address: { street: string; district: string; city: string; state: string }) => {
      if (address.street) setValue("street", address.street, { shouldValidate: true });
      if (address.district) setValue("district", address.district, { shouldValidate: true });
      setValue("city", address.city, { shouldValidate: true });
      setValue("state", address.state, { shouldValidate: true });
    },
    [setValue],
  );

  const {
    consultar: consultarCep,
    reset: resetCep,
    loading: buscandoCep,
    error: erroCep,
  } = useCepAutofill({ onFound: preencherEndereco });

  // Só busca quando o endereço está sendo digitado — ao usar o endereço do
  // cliente, o CEP já veio do cadastro e não há o que consultar.
  useEffect(() => {
    if (editingAddress && zipCode) consultarCep(zipCode);
  }, [editingAddress, zipCode, consultarCep]);

  function restoreCustomerAddress() {
    resetCep();
    if (!selectedCustomer) return;
    setValue("street", selectedCustomer.street);
    setValue("number", selectedCustomer.number);
    setValue("district", selectedCustomer.district);
    setValue("city", selectedCustomer.city);
    setValue("state", selectedCustomer.state);
    setValue("zipCode", selectedCustomer.zipCode);
    setEditingAddress(false);
  }

  const addressFields = (
    <Stack gap={3}>
      {buscandoCep && (
        <Inline gap={2} align="center">
          <Icon icon={Loader2} size="sm" className="animate-spin text-primary" />
          <Text size="caption" color="muted">
            Buscando endereço...
          </Text>
        </Inline>
      )}

      <Grid columns={1} gap={4} className="[&>*]:min-w-0 sm:grid-cols-2 lg:grid-cols-6">
        {/* O CEP vem primeiro e preenche rua, bairro, cidade e UF. */}
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
          containerClassName="lg:col-span-3"
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
        <Input
          label="Cidade"
          required
          error={errors.city?.message}
          containerClassName="lg:col-span-3"
          {...register("city")}
        />
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
      </Grid>
    </Stack>
  );

  return (
    <DialogForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogBody>
        <Stack gap={6}>
          {/* ---------------------------------------------------- Pedido */}
          <Stack gap={3}>
            <Text size="label" weight="medium">
              Dados do pedido
            </Text>

            <Grid columns={1} gap={4} className="[&>*]:min-w-0 sm:grid-cols-2 lg:grid-cols-4">
              <Controller
                control={control}
                name="customerId"
                render={({ field }) => (
                  <Select
                    label="Cliente"
                    placeholder="Sem cliente (entrega avulsa)"
                    searchable
                    error={errors.customerId?.message}
                    emptyMessage="Nenhum cliente cadastrado"
                    options={customerOptions}
                    value={field.value ? [field.value] : [NO_CUSTOMER]}
                    onValueChange={(value) =>
                      field.onChange(value[0] === NO_CUSTOMER ? null : (value[0] ?? null))
                    }
                  />
                )}
              />

              <Input
                label="Título"
                required
                error={errors.title?.message}
                placeholder="Entrega de mercadorias"
                containerClassName="lg:col-span-2"
                {...register("title")}
              />

              <Controller
                control={control}
                name="urgency"
                render={({ field }) => (
                  <Select
                    label="Urgência"
                    required
                    error={errors.urgency?.message}
                    options={URGENCY_OPTIONS}
                    value={field.value ? [field.value] : []}
                    onValueChange={(value) => field.onChange(value[0] ?? "normal")}
                  />
                )}
              />

              <Input
                label="Quantidade"
                type="number"
                required
                error={errors.quantity?.message}
                {...register("quantity")}
              />

              <Input
                label="Valor (R$)"
                type="number"
                step="0.01"
                description="Opcional"
                error={errors.value?.message}
                {...register("value")}
              />

              {/*
                O status só aparece na edição. Um pedido novo é, por definição,
                "Pendente" — oferecer a lista inteira na criação permite cadastrar
                um pedido já "Entregue", o que distorce a taxa de entrega e a
                performance do motorista, que são calculadas a partir dele.
              */}
              {isEditing && (
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      label="Status"
                      required
                      error={errors.status?.message}
                      options={STATUS_OPTIONS}
                      value={field.value ? [field.value] : []}
                      onValueChange={(value) => field.onChange(value[0] ?? "pending")}
                    />
                  )}
                />
              )}

              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    label="Data de entrega"
                    required
                    error={errors.date?.message}
                    value={parseDateString(field.value)}
                    onValueChange={(date) => field.onChange(formatDateString(date))}
                  />
                )}
              />
            </Grid>
          </Stack>

          {/* ------------------------------------------------- Atribuição */}
          <Stack gap={3}>
            <Text size="label" weight="medium">
              Atribuição
            </Text>
            <Text size="caption" color="muted">
              Motorista e veículo são obrigatórios para que o pedido entre numa rota.
            </Text>

            <Grid columns={1} gap={4} className="[&>*]:min-w-0 sm:grid-cols-3">
              <Controller
                control={control}
                name="driverId"
                render={({ field }) => (
                  <Select
                    label="Motorista"
                    placeholder="Sem motorista"
                    emptyMessage="Nenhum motorista cadastrado"
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
                    emptyMessage="Nenhum veículo cadastrado"
                    options={vehicleOptions}
                    value={field.value ? [field.value] : []}
                    onValueChange={(value) => field.onChange(value[0] ?? null)}
                  />
                )}
              />

              <Controller
                control={control}
                name="deliveryWindow"
                render={({ field }) => (
                  <Select
                    label="Janela de entrega"
                    description="Deixe em Dia todo se não há hora marcada"
                    error={errors.deliveryWindow?.message}
                    options={DELIVERY_WINDOW_OPTIONS}
                    value={[field.value ?? ANY_TIME]}
                    onValueChange={(value) => field.onChange(value[0] ?? ANY_TIME)}
                  />
                )}
              />
            </Grid>

            <CnhWarning driver={selectedDriver} vehicleType={selectedVehicleType} />
          </Stack>

          {/* ---------------------------------------------- Endereço */}
          <Stack gap={3}>
            <Inline justify="between" align="center" gap={3}>
              <Text size="label" weight="medium">
                Endereço de entrega
              </Text>

              {selectedCustomer && !editingAddress && (
                <Button type="button" size="sm" variant="tertiary" onClick={() => setEditingAddress(true)}>
                  <Icon icon={Pencil} size="sm" /> Entregar em outro endereço
                </Button>
              )}

              {selectedCustomer && editingAddress && (
                <Button type="button" size="sm" variant="tertiary" onClick={restoreCustomerAddress}>
                  <Icon icon={RotateCcw} size="sm" /> Usar o endereço do cliente
                </Button>
              )}
            </Inline>

            {selectedCustomer && !editingAddress ? (
              // Endereço do cadastro do cliente, visível e confirmável antes
              // de sair para a rota.
              <Box surface="surface-muted" border="default" radius="md" padding={4}>
                <Inline gap={3} align="start">
                  <Icon icon={MapPin} size="sm" className="text-primary" />
                  <Stack gap={0.5}>
                    <Text size="body-sm" weight="medium">
                      {selectedCustomer.name}
                    </Text>
                    <Text size="body-sm" color="muted">
                      {formatAddress({
                        street: watch("street"),
                        number: watch("number"),
                        district: watch("district"),
                        city: watch("city"),
                        state: watch("state"),
                        zipCode: watch("zipCode"),
                      }) || "Cliente sem endereço cadastrado"}
                    </Text>
                  </Stack>
                </Inline>
              </Box>
            ) : (
              addressFields
            )}

            {!selectedCustomer && (
              <Text size="caption" color="muted">
                Entrega avulsa: informe o endereço abaixo. Escolher um cliente preenche
                estes campos automaticamente.
              </Text>
            )}
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
