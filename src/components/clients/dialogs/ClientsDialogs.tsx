"use client";

import { Controller, useForm } from "react-hook-form";
import { createClient, updateClient } from "@/src/lib/clients/requests";
import { useToast } from "@/hooks/useToast";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { DialogOpenRef, DialogOpenType } from "../../types/types";
import { ClientType } from "../../types/clients";
import { Button, Input, Modal, Select } from "antd";
import { Label } from "@/components/ui/label";
import { Grid } from "../../ui/Grid";
import { SaveOutlined } from "@ant-design/icons";
import { Fieldset } from "../../ui/Fieldset";

export type ClientFormData = {
  name: string;
  trade_name?: string;
  document: string;
  state_registration?: string;
  email: string;
  phone: string;
  type: "F" | "J";
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  number: string;
  complement?: string;
  notes?: string;
  clientId?: number;
};

type ClientDialogProps = {
  onSubmitSuccess: () => void;
};

export const ClientDialog = forwardRef<
  DialogOpenRef<ClientType>,
  ClientDialogProps
>((props, ref) => {
  const { onSubmitSuccess } = props;

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogOpenType>("view");

  const { register, handleSubmit, setValue, reset, control, formState } =
    useForm<ClientFormData>();

  const { successToast, errorToast } = useToast();

  const dialogFooterRef = useRef<any>(null);

  const onSubmit = async (data: ClientFormData) => {
    dialogFooterRef.current?.setLoading(true);
    if (dialogType === "create") {
      const createResponse = await createClient(data);
      dialogFooterRef.current?.setLoading(false);

      if (createResponse?.success) {
        setShowDialog(false);
        successToast("Cliente criado com sucesso!");
        onSubmitSuccess();
        return;
      }

      errorToast(
        createResponse?.message || "Erro ao criar cliente. Tente novamente."
      );
      console.error(createResponse);
    } else if (dialogType === "edit") {
      const updateResponse = await updateClient(data);
      dialogFooterRef.current?.setLoading(false);

      if (updateResponse?.success) {
        setShowDialog(false);
        successToast("Cliente editado com sucesso!");
        onSubmitSuccess();
        return;
      }

      errorToast(
        updateResponse.message || "Erro ao editar cliente. Tente novamente."
      );
      console.error(updateResponse);
    }
  };

  const setFormData = (data?: ClientType) => {
    if (!data) return;
    setValue("name", data?.name);
    setValue("city", data?.city);
    setValue("complement", data?.complement);
    setValue("document", data?.document);
    setValue("email", data?.email);
    setValue("neighborhood", data?.neighborhood);
    setValue("number", data?.number.toString());
    setValue("notes", data?.notes);
    setValue("phone", data?.phone.toString());
    setValue("state", data?.state);
    setValue("state_registration", data?.state_registration.toString());
    setValue("street", data?.street);
    setValue("trade_name", data?.trade_name);
    setValue("type", data?.type);
    setValue("zip_code", data?.zip_code.toString());
    setValue("clientId", data?.client_id);
  };

  const handleOpenDialog = (type: DialogOpenType, data?: ClientType) => {
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
      default:
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

  return (
    <Modal
      open={showDialog}
      onCancel={() => setShowDialog(false)}
      onOk={handleSubmit(onSubmit)}
      okText={dialogType === "edit" ? "Salvar" : "Criar"}
      cancelText="Cancelar"
      destroyOnHidden
      okButtonProps={{
        disabled: dialogType === "view",
        icon: <SaveOutlined />,
      }}
      width={"60%"}
    >
      <form noValidate>
        <h2 className="mb-4 text-lg font-semibold">
          {dialogType === "create"
            ? "Criar"
            : dialogType === "edit"
              ? "Editar"
              : "Visualizar"}{" "}
          Cliente
        </h2>
        <Grid size={12}>
          <Grid.Cell span={{ md: 12, lg: 6 }}>
            <Label
              label="Nome"
              status={formState.errors.name && "error"}
              errorText={formState.errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                rules={{ required: "Este campo é obrigatório" }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    disabled={dialogType === "view"}
                    placeholder="João Silva"
                    status={fieldState.error ? "error" : undefined}
                  />
                )}
              />
            </Label>
          </Grid.Cell>

          <Grid.Cell span={{ md: 12, lg: 6 }}>
            <Label
              label="Nome Fantasia"
              status={formState.errors.trade_name && "error"}
              errorText={formState.errors.trade_name?.message}
            >
              <Controller
                name="trade_name"
                control={control}
                rules={{ required: "Este campo é obrigatório" }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="João Silva e Cia"
                    disabled={dialogType === "view"}
                    status={fieldState.error ? "error" : undefined}
                  />
                )}
              />
            </Label>
          </Grid.Cell>
          <Grid.Cell span={{ md: 12, lg: 6 }}>
            <Label
              label="Email"
              status={formState.errors.email && "error"}
              errorText={formState.errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                rules={{ required: "Este campo é obrigatório" }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="email@exemplo.com"
                    disabled={dialogType === "view"}
                    status={fieldState.error ? "error" : undefined}
                  />
                )}
              />
            </Label>
          </Grid.Cell>
          <Grid.Cell span={{ md: 12, lg: 3 }}>
            <Label
              label="Documento"
              status={formState.errors.document && "error"}
              errorText={formState.errors.document?.message}
            >
              <Controller
                name="document"
                control={control}
                rules={{ required: "Este campo é obrigatório" }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="12345678900"
                    disabled={dialogType === "view"}
                    status={fieldState.error ? "error" : undefined}
                  />
                )}
              />
            </Label>
          </Grid.Cell>
          <Grid.Cell span={{ md: 12, lg: 3 }}>
            <Label
              label="Inscrição Estadual"
              status={formState.errors.state_registration && "error"}
              errorText={formState.errors.state_registration?.message}
            >
              <Controller
                name="state_registration"
                control={control}
                rules={{ required: "Este campo é obrigatório" }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Inscrição estadual"
                    disabled={dialogType === "view"}
                    status={fieldState.error ? "error" : undefined}
                  />
                )}
              />
            </Label>
          </Grid.Cell>

          <Grid.Cell span={{ md: 12, lg: 3 }}>
            <Label
              label="Telefone"
              status={formState.errors.phone && "error"}
              errorText={formState.errors.phone?.message}
            >
              <Controller
                name="phone"
                control={control}
                rules={{ required: "Este campo é obrigatório" }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="(11) 99999-9999"
                    disabled={dialogType === "view"}
                    status={fieldState.error ? "error" : undefined}
                  />
                )}
              />
            </Label>
          </Grid.Cell>

          <Grid.Cell span={{ md: 12, lg: 3 }}>
            <Label
              label="Tipo"
              status={formState.errors.type && "error"}
              errorText={formState.errors.type?.message}
            >
              <Controller
                control={control}
                name="type"
                rules={{ required: "Este campo é obrigatório" }}
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    disabled={dialogType === "view"}
                    status={fieldState.error ? "error" : undefined}
                    options={[
                      { label: "Pessoa Física", value: "F" },
                      { label: "Pessoa Jurídica", value: "J" },
                    ]}
                  />
                )}
              />
            </Label>
          </Grid.Cell>

          <Grid.Cell span={12}>
            <Fieldset title="Endereço">
              <Grid size={12}>
                <Grid.Cell span={{ md: 12, lg: 6 }}>
                  <Label
                    label="Rua"
                    status={formState.errors.street && "error"}
                    errorText={formState.errors.street?.message}
                  >
                    <Controller
                      name="street"
                      control={control}
                      rules={{ required: "Este campo é obrigatório" }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          disabled={dialogType === "view"}
                          placeholder="Rua das Flores"
                          status={fieldState.error ? "error" : undefined}
                        />
                      )}
                    />
                  </Label>
                </Grid.Cell>
                <Grid.Cell span={{ md: 12, lg: 6 }}>
                  <Label
                    label="Bairro"
                    status={formState.errors.neighborhood && "error"}
                    errorText={formState.errors.neighborhood?.message}
                  >
                    <Controller
                      name="neighborhood"
                      control={control}
                      rules={{ required: "Este campo é obrigatório" }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          disabled={dialogType === "view"}
                          placeholder="Centro"
                          status={fieldState.error ? "error" : undefined}
                        />
                      )}
                    />
                  </Label>
                </Grid.Cell>
                <Grid.Cell span={4}>
                  <Label
                    label="Cidade"
                    status={formState.errors.city && "error"}
                    errorText={formState.errors.city?.message}
                  >
                    <Controller
                      name="city"
                      control={control}
                      rules={{ required: "Este campo é obrigatório" }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          disabled={dialogType === "view"}
                          placeholder="São Paulo"
                          status={fieldState.error ? "error" : undefined}
                        />
                      )}
                    />
                  </Label>
                </Grid.Cell>
                <Grid.Cell span={4}>
                  <Label
                    label="Estado"
                    status={formState.errors.state && "error"}
                    errorText={formState.errors.state?.message}
                  >
                    <Controller
                      control={control}
                      name="state"
                      rules={{ required: "Este campo é obrigatório" }}
                      render={({ field, fieldState }) => (
                        <Select
                          {...field}
                          disabled={dialogType === "view"}
                          status={fieldState.error ? "error" : undefined}
                          options={statesOptions.map((item) => ({
                            label: item,
                            value: item,
                          }))}
                        />
                      )}
                    />
                  </Label>
                </Grid.Cell>
                <Grid.Cell span={4}>
                  <Label
                    label="CEP"
                    status={formState.errors.zip_code && "error"}
                    errorText={formState.errors.zip_code?.message}
                  >
                    <Controller
                      name="zip_code"
                      control={control}
                      rules={{ required: "Este campo é obrigatório" }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          disabled={dialogType === "view"}
                          placeholder="01234-567"
                          status={fieldState.error ? "error" : undefined}
                        />
                      )}
                    />
                  </Label>
                </Grid.Cell>
                <Grid.Cell span={4}>
                  <Label
                    label="Número"
                    status={formState.errors.number && "error"}
                    errorText={formState.errors.number?.message}
                  >
                    <Controller
                      name="number"
                      control={control}
                      rules={{ required: "Este campo é obrigatório" }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          type="number"
                          disabled={dialogType === "view"}
                          placeholder="123"
                          status={fieldState.error ? "error" : undefined}
                        />
                      )}
                    />
                  </Label>
                </Grid.Cell>
                <Grid.Cell span={4}>
                  <Label
                    label="Complemento"
                    status={formState.errors.complement && "error"}
                    errorText={formState.errors.complement?.message}
                  >
                    <Controller
                      name="complement"
                      control={control}
                      rules={{ required: "Este campo é obrigatório" }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          disabled={dialogType === "view"}
                          placeholder="Apto 45"
                          status={fieldState.error ? "error" : undefined}
                        />
                      )}
                    />
                  </Label>
                </Grid.Cell>
              </Grid>
            </Fieldset>
          </Grid.Cell>
          <Grid.Cell span={12}>
            <Label
              label="Observações"
              status={formState.errors.notes && "error"}
              errorText={formState.errors.notes?.message}
            >
              <Controller
                name="notes"
                control={control}
                rules={{ required: "Este campo é obrigatório" }}
                render={({ field, fieldState }) => (
                  <Input.TextArea
                    {...field}
                    placeholder="Alguma observação do cliente..."
                    disabled={dialogType === "view"}
                    status={fieldState.error ? "error" : undefined}
                    rows={4}
                  />
                )}
              />
            </Label>
          </Grid.Cell>
        </Grid>
      </form>
    </Modal>
  );
});
