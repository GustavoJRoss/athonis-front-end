"use client";

import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { createOrder, updateOrder } from "@/src/lib/orders/requests";
import { useToast } from "@/hooks/useToast";
import { DialogFooter } from "../../utils/dialog/DialogFooter";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import { DialogOpenRef, DialogOpenType } from "../../types/types";
import { OrderType } from "../../types/orders";
import { IconAction } from "../../utils/IconAction";
import { ListCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LookupClient } from "../../lookups/LookupClient";
import { getClientById } from "@/src/lib/clients/requests";
import { Tooltip } from "@/components/ui/tooltip";

export type OrderFormData = {
  client_id: number;
  name: string;
  title: string;
  description?: string;
  invoice_number?: string;
  urgency: string;
  vehicle_id: number;
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

  const onSubmit = async (data: OrderFormData) => {
    dialogFooterRef.current?.setLoading(true);

    if (dialogType === "create") {
      const res = await createOrder(data);
      dialogFooterRef.current?.setLoading(false);

      if (res?.success) {
        dialogFooterRef.current?.close();
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
        dialogFooterRef.current?.close();
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
    setValue("vehicle_id", data.vehicle_id);
    setValue("driver_id", data.driver_id);
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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto ">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>
                {dialogType === "create"
                  ? "Criar Pedido"
                  : dialogType === "edit"
                  ? "Editar Pedido"
                  : "Visualizar Pedido"}
              </DialogTitle>
            </DialogHeader>

            <DialogBody className="p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Label
                  label="Cliente ID"
                  status={formState.errors.client_id && "error"}
                  errorText={formState.errors.client_id?.message}
                >
                  <Input
                    type="number"
                    {...register("client_id", {
                      valueAsNumber: true,
                      required: "Este campo é obrigatório.",
                    })}
                    onChange={async (e) => {
                      await handleGetClientInfo(Number(e.target.value));
                      register("client_id").onChange(e);
                    }}
                    disabled={dialogType === "view"}
                    min={1}
                    status={formState.errors.client_id && "error"}
                    placeholder="O id do seu cliente"
                  />
                </Label>
                <Label label="Name">
                  <div className="flex gap-3 items-center">
                    <Input
                      disabled
                      {...register("name")}
                      min={1}
                      placeholder="O nome do cliente"
                    />

                    <Tooltip text="Selecione seu cliente">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          lookClientRef.current.open();
                        }}
                        icon={ListCheckIcon}
                      />
                    </Tooltip>
                  </div>
                </Label>
                <Label
                  label="Título"
                  status={formState.errors.title && "error"}
                  errorText={formState.errors.title?.message}
                >
                  <Input
                    {...register("title", {
                      required: "Este campo é obrigatório.",
                    })}
                    placeholder="Entrega de mercadorias"
                    status={formState.errors.title && "error"}
                    disabled={dialogType === "view"}
                  />
                </Label>

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
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={dialogType === "view"}
                      >
                        <SelectTrigger
                          className="w-full"
                          status={formState.errors.urgency && "error"}
                        >
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Label>
                <Label
                  label="Número NF"
                  status={formState.errors.invoice_number && "error"}
                  errorText={formState.errors.invoice_number?.message}
                >
                  <Input
                    {...register("invoice_number", {
                      required: "Este campo é obrigatório.",
                    })}
                    placeholder="NF-123456"
                    disabled={dialogType === "view"}
                    status={formState.errors.invoice_number && "error"}
                  />
                </Label>
                <Label
                  label="Descrição"
                  className="col-span-2"
                  status={formState.errors.description && "error"}
                  errorText={formState.errors.description?.message}
                >
                  <Textarea
                    {...register("description", {
                      required: "Este campo é obrigatório.",
                    })}
                    placeholder="Descrição do pedido..."
                    disabled={dialogType === "view"}
                    status={formState.errors.description && "error"}
                  />
                </Label>
                <Label
                  label="Veículo ID"
                  status={formState.errors.vehicle_id && "error"}
                  errorText={formState.errors.vehicle_id?.message}
                >
                  <Input
                    type="number"
                    {...register("vehicle_id", {
                      valueAsNumber: true,
                      required: "Este campo é obrigatório",
                    })}
                    disabled={dialogType === "view"}
                    min={1}
                    placeholder="Id do veículo"
                    status={formState.errors.vehicle_id && "error"}
                  />
                </Label>
                <Label
                  label="Motorista ID"
                  status={formState.errors.driver_id && "error"}
                  errorText={formState.errors.driver_id?.message}
                >
                  <Input
                    type="number"
                    {...register("driver_id", {
                      valueAsNumber: true,
                      required: "Este campo é obrigatório",
                    })}
                    disabled={dialogType === "view"}
                    min={1}
                    placeholder="Id do motorista"
                    status={formState.errors.driver_id && "error"}
                  />
                </Label>
                <Label
                  label="Quantidade"
                  status={formState.errors.quantity && "error"}
                  errorText={formState.errors.quantity?.message}
                >
                  <Input
                    type="number"
                    {...register("quantity", {
                      valueAsNumber: true,
                      required: "Este campo é obrigatório",
                    })}
                    disabled={dialogType === "view"}
                    min={1}
                    placeholder="Quantidade de items"
                    status={formState.errors.quantity && "error"}
                  />
                </Label>
                <Label
                  label="Rua"
                  status={formState.errors.delivery_street && "error"}
                  errorText={formState.errors.delivery_street?.message}
                >
                  <Input
                    {...register("delivery_street", {
                      required: "Este campo é obrigatório.",
                    })}
                    disabled={dialogType === "view"}
                    placeholder="Rua das flores"
                    status={formState.errors.delivery_street && "error"}
                  />
                </Label>
                <Label
                  label="Bairro"
                  status={formState.errors.delivery_district && "error"}
                  errorText={formState.errors.delivery_district?.message}
                >
                  <Input
                    {...register("delivery_district", {
                      required: "Este campo é obrigatório.",
                    })}
                    disabled={dialogType === "view"}
                    placeholder="Rio Branco"
                    status={formState.errors.delivery_district && "error"}
                  />
                </Label>
                <Label
                  label="Cidade"
                  status={formState.errors.delivery_city && "error"}
                  errorText={formState.errors.delivery_city?.message}
                >
                  <Input
                    {...register("delivery_city", {
                      required: "Este campo é obrigatório.",
                    })}
                    disabled={dialogType === "view"}
                    placeholder="São Paulo"
                    status={formState.errors.delivery_city && "error"}
                  />
                </Label>
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
                        value={field.value} // valor atual controlado pelo RHF
                        onValueChange={field.onChange}
                        disabled={dialogType === "view"}
                      >
                        <SelectTrigger
                          status={formState.errors.delivery_state && "error"}
                          className="w-full"
                        >
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>

                        <SelectContent
                          tw="h-[200px] overflow-y-auto"
                          className="h-[200px] overflow-y-auto"
                        >
                          {statesOptions.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Label>

                <Label
                  label="CEP"
                  status={formState.errors.delivery_zipcode && "error"}
                  errorText={formState.errors.delivery_zipcode?.message}
                >
                  <Input
                    {...register("delivery_zipcode", {
                      required: "Este campo é obrigatório.",
                    })}
                    disabled={dialogType === "view"}
                    placeholder="12345678"
                    status={formState.errors.delivery_zipcode && "error"}
                  />
                </Label>
                <Label
                  label="Número"
                  status={formState.errors.delivery_number && "error"}
                  errorText={formState.errors.delivery_number?.message}
                >
                  <Input
                    {...register("delivery_number", {
                      required: "Este campo é obrigatório.",
                    })}
                    disabled={dialogType === "view"}
                    placeholder="Número do pedido"
                    status={formState.errors.delivery_number && "error"}
                  />
                </Label>
                <Label
                  label="Complemento"
                  status={formState.errors.delivery_complement && "error"}
                  errorText={formState.errors.delivery_complement?.message}
                >
                  <Input
                    {...register("delivery_complement")}
                    disabled={dialogType === "view"}
                    placeholder="Complemento do endereço"
                    status={formState.errors.delivery_complement && "error"}
                  />
                </Label>
              </div>
            </DialogBody>

            {dialogType !== "view" && <DialogFooter ref={dialogFooterRef} />}
          </form>
        </DialogContent>
      </Dialog>
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
    </>
  );
});
