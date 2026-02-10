"use client";

import { Controller, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";

import { createOrder, updateOrder } from "@/src/lib/orders/requests";
import { useToast } from "@/hooks/useToast";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import { DialogOpenRef, DialogOpenType } from "../../types/types";
import { OrderType } from "../../types/orders";
import { ListCheckIcon } from "lucide-react";
import { LookupClient } from "../../lookups/LookupClient";
import { getClientById } from "@/src/lib/clients/requests";
import { Tooltip } from "@/components/ui/tooltip";
import { LookupDriver } from "../../lookups/LookupDriver";
import { LookupVehicle } from "../../lookups/LookupVehicle";
import { Button, Input, Modal, Select, Typography } from "antd";
import { Grid } from "../../ui/Grid";
import { Fieldset } from "../../ui/Fieldset";
import { SaveOutlined } from "@ant-design/icons";

export type OrderFormData = {
  client_id: number;
  name: string;
  title: string;
  description?: string;
  invoice_number?: string;
  urgency: string;
  vehicle_id: number;
  vehicle_name: string;
  driver_name: string;
  driver_id: number;
  quantity: number;

  delivery_street: string;
  delivery_district: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zipcode: string;
  delivery_number: string;
  delivery_complement?: string;

  order_id?: number;
};

type OrderDialogProps = {
  onSubmitSuccess: () => void;
};

export const OrderDialog = forwardRef<
  DialogOpenRef<OrderType>,
  OrderDialogProps
>((props, ref) => {
  const { onSubmitSuccess } = props;

  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<DialogOpenType>("view");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState,
    clearErrors,
  } = useForm<OrderFormData>();

  const { successToast, errorToast } = useToast();

  const dialogFooterRef = useRef<any>(null);
  const lookClientRef = useRef<any>(null);
  const lookDriverRef = useRef<any>(null);
  const lookVehicleRef = useRef<any>(null);

  const onSubmit = async (data: OrderFormData) => {
    dialogFooterRef.current?.setLoading(true);

    if (dialogType === "create") {
      const res = await createOrder(data);
      dialogFooterRef.current?.setLoading(false);

      if (res?.success) {
        setShowDialog(false);
        successToast("Pedido criado com sucesso!");
        onSubmitSuccess();
        return;
      }

      errorToast(res?.message ?? "Erro ao criar pedido.");
      return;
    }

    if (dialogType === "edit") {
      const res = await updateOrder(data);
      dialogFooterRef.current?.setLoading(false);

      if (res?.success) {
        setShowDialog(false);
        successToast("Pedido atualizado com sucesso!");
        onSubmitSuccess();
        return;
      }

      errorToast(res?.message ?? "Erro ao atualizar pedido.");
    }
  };

  const setFormData = (data?: OrderType) => {
    if (!data) return;
    setValue("client_id", data.client_id);
    setValue("title", data.title);
    setValue("description", data.description);
    setValue("invoice_number", data.invoice_number);
    setValue("urgency", data.urgency);
    setValue("vehicle_name", data.vehicle?.name);
    setValue("driver_id", data.driver_id);
    setValue("driver_name", data.driver?.name);
    setValue("quantity", data.quantity);

    setValue("delivery_street", data.delivery_street);
    setValue("delivery_district", data.delivery_district);
    setValue("delivery_city", data.delivery_city);
    setValue("delivery_state", data.delivery_state);
    setValue("delivery_zipcode", data.delivery_zipcode);
    setValue("delivery_number", data.delivery_number);
    setValue("delivery_complement", data.delivery_complement);

    setValue("order_id", data.order_id);
  };

  const handleOpenDialog = (type: DialogOpenType, data?: OrderType) => {
    switch (type) {
      case "create":
        reset();
        setDialogType("create");
        setShowDialog(true);
        break;

      case "edit":
        reset();
        setDialogType("edit");
        setFormData(data);
        setShowDialog(true);
        break;

      case "view":
        reset();
        setDialogType("view");
        setFormData(data);
        setShowDialog(true);
        break;
    }
  };

  useImperativeHandle(ref, () => ({
    open: handleOpenDialog,
  }));

  const statesOptions = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const handleGetClientInfo = async (client_id: number) => {
    if (client_id !== 0 || client_id) {
      const getClientResponse: any = await getClientById({ client_id });

      if (getClientResponse.success) {
        const { data } = getClientResponse;
        setValue("delivery_city", data?.city);
        setValue("delivery_complement", data?.complement);
        setValue("delivery_district", data?.neighborhood);
        setValue("delivery_number", data?.number);
        setValue("delivery_state", data?.state);
        setValue("delivery_street", data?.street);
        setValue("delivery_zipcode", data?.zip_code);
        setValue("name", data?.name);
        return;
      }

      errorToast("Falha na hora de pegar dados do cliente.");
      console.log({ getClientResponse });
    }
  };

  return (
    <>
      <Modal
        open={showDialog}
        width={1200}
        onCancel={() => setShowDialog(false)}
        onOk={handleSubmit(onSubmit)}
        okText={dialogType === "edit" ? "Salvar" : "Criar"}
        cancelText="Cancelar"
        destroyOnHidden
        okButtonProps={{
          disabled: dialogType === "view",
          icon: <SaveOutlined />,
        }}
      >
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Typography.Title level={3}>
            {dialogType === "create"
              ? "Criar Pedido"
              : dialogType === "edit"
                ? "Editar Pedido"
                : "Visualizar Pedido"}
          </Typography.Title>

          <Grid size={12}>
            <Grid.Cell span={{ md: 12, lg: 12, xl: 8 }}>
              <Controller
                control={control}
                name="title"
                rules={{ required: "Este campo é obrigatório." }}
                render={({ field }) => (
                  <Label
                    label="Título"
                    status={formState.errors.title && "error"}
                    errorText={formState.errors.title?.message}
                  >
                    <Input
                      {...field}
                      placeholder="Entrega de mercadorias"
                      status={formState.errors.title && "error"}
                      disabled={dialogType === "view"}
                    />
                  </Label>
                )}
              />
            </Grid.Cell>

            <Grid.Cell span={{ md: 12, lg: 12, xl: 4 }}>
              <Label
                label="Urgência"
                className="w-full"
                status={formState.errors.urgency && "error"}
                errorText={formState.errors.urgency?.message}
              >
                <Controller
                  control={control}
                  name="urgency"
                  rules={{ required: "Este campo é obrigatório." }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { label: "Baixa", value: "low" },
                        { label: "Normal", value: "normal" },
                        { label: "Alta", value: "high" },
                      ]}
                      status={formState.errors.urgency && "error"}
                      disabled={dialogType === "view"}
                    />
                  )}
                />
              </Label>
            </Grid.Cell>
            <Grid.Cell span={12}>
              <Controller
                control={control}
                name="description"
                rules={{ required: "Este campo é obrigatório." }}
                render={({ field }) => (
                  <Label
                    label="Descrição"
                    className="col-span-2"
                    status={formState.errors.description && "error"}
                    errorText={formState.errors.description?.message}
                  >
                    <Input.TextArea
                      {...field}
                      placeholder="Descrição do pedido..."
                      disabled={dialogType === "view"}
                      status={formState.errors.description && "error"}
                    />
                  </Label>
                )}
              />
            </Grid.Cell>
            <Grid.Cell span={{ md: 12, lg: 12, xl: 3 }}>
              <Controller
                control={control}
                name="invoice_number"
                rules={{ required: "Este campo é obrigatório." }}
                render={({ field }) => (
                  <Label
                    label="Número NF"
                    status={formState.errors.invoice_number && "error"}
                    errorText={formState.errors.invoice_number?.message}
                  >
                    <Input
                      {...field}
                      placeholder="NF-123456"
                      disabled={dialogType === "view"}
                      status={formState.errors.invoice_number && "error"}
                    />
                  </Label>
                )}
              />
            </Grid.Cell>
            <Grid.Cell span={{ md: 12, lg: 12, xl: 3 }}>
              <Controller
                control={control}
                name="quantity"
                rules={{
                  required: "Este campo é obrigatório",
                }}
                render={({ field }) => (
                  <Label
                    label="Quantidade"
                    status={formState.errors.quantity && "error"}
                    errorText={formState.errors.quantity?.message}
                  >
                    <Input
                      type="number"
                      {...field}
                      disabled={dialogType === "view"}
                      min={1}
                      placeholder="Quantidade de items"
                      status={formState.errors.quantity && "error"}
                    />
                  </Label>
                )}
              />
            </Grid.Cell>
            <Grid.Cell span={{ md: 12, lg: 12, xl: 2 }}>
              <Controller
                control={control}
                name="client_id"
                render={({ field }) => (
                  <Label
                    label="Cliente ID"
                    status={formState.errors.client_id && "error"}
                    errorText={formState.errors.client_id?.message}
                  >
                    <Input
                      {...field}
                      onChange={async (e) => {
                        await handleGetClientInfo(Number(e.target.value));
                        field.onChange(e);
                      }}
                      disabled={dialogType === "view"}
                      min={1}
                      status={formState.errors.client_id && "error"}
                      placeholder="O id do seu cliente"
                    />
                  </Label>
                )}
              />
            </Grid.Cell>

            <Grid.Cell span={{ md: 12, lg: 12, xl: 4 }}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Label label="Name">
                    <div className="flex gap-3 items-center">
                      <Input
                        {...field}
                        disabled
                        placeholder="O nome do cliente"
                      />
                      <Tooltip text="Selecione seu cliente">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            lookClientRef.current.open();
                          }}
                          type="primary"
                          icon={
                            <div className="flex h-full w-full justify-center items-center">
                              <ListCheckIcon size={18} />
                            </div>
                          }
                        />
                      </Tooltip>
                    </div>
                  </Label>
                )}
              />
            </Grid.Cell>

            <Grid.Cell span={{ md: 12, lg: 12, xl: 6 }}>
              <Controller
                control={control}
                name="vehicle_name"
                render={({ field }) => (
                  <Label
                    label="Veículo"
                    status={formState.errors.vehicle_name && "error"}
                    errorText={formState.errors.vehicle_name?.message}
                  >
                    <div className="flex gap-3 items-center">
                      <Input
                        {...field}
                        placeholder="O nome do veículo"
                        readOnly
                        status={formState.errors.vehicle_name && "error"}
                      />

                      <Tooltip text="Selecione seu Veículo">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            lookVehicleRef.current.open();
                          }}
                          type="primary"
                          icon={
                            <div className="flex h-full w-full justify-center items-center">
                              <ListCheckIcon size={18} />
                            </div>
                          }
                        />
                      </Tooltip>
                    </div>
                  </Label>
                )}
              />
            </Grid.Cell>
            <Grid.Cell span={{ md: 12, lg: 12, xl: 6 }}>
              <Controller
                control={control}
                name="driver_name"
                render={({ field }) => (
                  <Label
                    label="Motorista"
                    status={formState.errors.driver_name && "error"}
                    errorText={formState.errors.driver_name?.message}
                  >
                    <div className="flex gap-3 items-center">
                      <Input
                        {...field}
                        placeholder="O nome do motorista"
                        readOnly
                        status={formState.errors.driver_name && "error"}
                      />

                      <Tooltip text="Selecione seu Motorista">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            lookDriverRef.current.open();
                          }}
                          type="primary"
                          icon={
                            <div className="flex h-full w-full justify-center items-center">
                              <ListCheckIcon size={18} />
                            </div>
                          }
                        />
                      </Tooltip>
                    </div>
                  </Label>
                )}
              />
            </Grid.Cell>

            <Grid.Cell span={12}>
              <Fieldset title="Endereço de Entrega">
                <Grid size={12}>
                  <Grid.Cell span={{ md: 12, lg: 12, xl: 6 }}>
                    <Controller
                      control={control}
                      name="delivery_street"
                      rules={{
                        required: "Este campo é obrigatório.",
                      }}
                      render={({ field }) => (
                        <Label
                          label="Rua"
                          status={formState.errors.delivery_street && "error"}
                          errorText={formState.errors.delivery_street?.message}
                        >
                          <Input
                            {...field}
                            disabled={dialogType === "view"}
                            placeholder="Rua das flores"
                            status={formState.errors.delivery_street && "error"}
                          />
                        </Label>
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell span={{ md: 12, lg: 12, xl: 6 }}>
                    <Controller
                      control={control}
                      name="delivery_district"
                      rules={{
                        required: "Este campo é obrigatório.",
                      }}
                      render={({ field }) => (
                        <Label
                          label="Bairro"
                          status={formState.errors.delivery_district && "error"}
                          errorText={
                            formState.errors.delivery_district?.message
                          }
                        >
                          <Input
                            {...field}
                            disabled={dialogType === "view"}
                            placeholder="Rio Branco"
                            status={
                              formState.errors.delivery_district && "error"
                            }
                          />
                        </Label>
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell span={{ md: 12, lg: 12, xl: 6 }}>
                    <Controller
                      control={control}
                      name="delivery_city"
                      rules={{
                        required: "Este campo é obrigatório.",
                      }}
                      render={({ field }) => (
                        <Label
                          label="Cidade"
                          status={formState.errors.delivery_city && "error"}
                          errorText={formState.errors.delivery_city?.message}
                        >
                          <Input
                            {...field}
                            disabled={dialogType === "view"}
                            placeholder="São Paulo"
                            status={formState.errors.delivery_city && "error"}
                          />
                        </Label>
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell span={{ md: 12, lg: 12, xl: 2 }}>
                    <Label
                      label="Estado"
                      status={formState.errors.delivery_state && "error"}
                      errorText={formState.errors.delivery_state?.message}
                    >
                      <Controller
                        control={control}
                        name="delivery_state"
                        rules={{ required: "Este campo é obrigatório" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            disabled={dialogType === "view"}
                            options={statesOptions?.map((item) => ({
                              value: item,
                              label: item,
                            }))}
                            placeholder="Selecione o estado "
                          />
                        )}
                      />
                    </Label>
                  </Grid.Cell>

                  <Grid.Cell span={{ md: 12, lg: 12, xl: 2 }}>
                    <Controller
                      control={control}
                      name="delivery_zipcode"
                      rules={{
                        required: "Este campo é obrigatório.",
                      }}
                      render={({ field }) => (
                        <Label
                          label="CEP"
                          status={formState.errors.delivery_zipcode && "error"}
                          errorText={formState.errors.delivery_zipcode?.message}
                        >
                          <Input
                            {...field}
                            disabled={dialogType === "view"}
                            placeholder="12345678"
                            status={
                              formState.errors.delivery_zipcode && "error"
                            }
                          />
                        </Label>
                      )}
                    />
                  </Grid.Cell>

                  <Grid.Cell span={{ md: 12, lg: 12, xl: 2 }}>
                    <Controller
                      control={control}
                      name="delivery_number"
                      rules={{
                        required: "Este campo é obrigatório.",
                      }}
                      render={({ field }) => (
                        <Label
                          label="Número"
                          status={formState.errors.delivery_number && "error"}
                          errorText={formState.errors.delivery_number?.message}
                        >
                          <Input
                            {...field}
                            disabled={dialogType === "view"}
                            placeholder="Número do pedido"
                            status={formState.errors.delivery_number && "error"}
                          />
                        </Label>
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell span={{ md: 12, lg: 12, xl: 12 }}>
                    <Controller
                      control={control}
                      name="delivery_complement"
                      render={({ field }) => (
                        <Label
                          label="Complemento"
                          status={
                            formState.errors.delivery_complement && "error"
                          }
                          errorText={
                            formState.errors.delivery_complement?.message
                          }
                        >
                          <Input.TextArea
                            {...field}
                            disabled={dialogType === "view"}
                            placeholder="Complemento do endereço"
                            status={
                              formState.errors.delivery_complement && "error"
                            }
                          />
                        </Label>
                      )}
                    />
                  </Grid.Cell>
                </Grid>
              </Fieldset>
            </Grid.Cell>
          </Grid>
        </form>
      </Modal>
      <LookupClient
        ref={lookClientRef}
        onSelect={(data) => {
          if (!data) return;
          setValue("name", data?.name);
          setValue("client_id", data?.client_id);
          setValue("delivery_city", data?.city);
          setValue("delivery_complement", data?.complement);
          setValue("delivery_district", data?.neighborhood);
          setValue("delivery_number", data?.number);
          setValue("delivery_state", data?.state);
          setValue("delivery_street", data?.street);
          setValue("delivery_zipcode", data?.zip_code);
          clearErrors();
        }}
      />
      <LookupDriver
        ref={lookDriverRef}
        onSelect={(data) => {
          setValue("driver_id", data?.driver_id);
          setValue("driver_name", data?.name);
          clearErrors();
        }}
      />
      <LookupVehicle
        ref={lookVehicleRef}
        onSelect={(data) => {
          setValue("vehicle_id", data?.vehicle_id);
          setValue("vehicle_name", data?.name);
          clearErrors();
        }}
      />
    </>
  );
});
