"use client";

import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
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

export type OrderFormData = {
  client_id: number;
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

  const { register, handleSubmit, setValue, reset, control, formState } =
    useForm<OrderFormData>();

  const { successToast, errorToast } = useToast();
  const dialogFooterRef = useRef<any>(null);

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

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
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
                disabled={dialogType === "view"}
                min={1}
                status={formState.errors.client_id && "error"}
                placeholder="O id do seu cliente"
              />
            </Label>

            <Label
              label="Título"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
            >
              <Input
                {...register("title", {
                  required: "Este campo é obrigatório.",
                })}
                placeholder="Entrega de mercadorias"
                status={formState.errors.client_id && "error"}
                disabled={dialogType === "view"}
              />
            </Label>

            <Label
              label="Urgência"
              className="w-full"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
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
                      status={formState.errors.client_id && "error"}
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
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
            >
              <Input
                {...register("invoice_number", {
                  required: "Este campo é obrigatório.",
                })}
                placeholder="NF-123456"
                disabled={dialogType === "view"}
                status={formState.errors.client_id && "error"}
              />
            </Label>
            <Label
              label="Descrição"
              className="col-span-2"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
            >
              <Textarea
                {...register("description", {
                  required: "Este campo é obrigatório.",
                })}
                placeholder="Descrição do pedido..."
                disabled={dialogType === "view"}
                status={formState.errors.client_id && "error"}
              />
            </Label>
            <Label
              label="Veículo ID"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
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
                status={formState.errors.client_id && "error"}
              />
            </Label>
            <Label
              label="Motorista ID"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
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
                status={formState.errors.client_id && "error"}
              />
            </Label>
            <Label
              label="Quantidade"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
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
                status={formState.errors.client_id && "error"}
              />
            </Label>
            <Label
              label="Rua"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
            >
              <Input
                {...register("delivery_street", {
                  required: "Este campo é obrigatório.",
                })}
                disabled={dialogType === "view"}
                placeholder="Rua das flores"
                status={formState.errors.client_id && "error"}
              />
            </Label>
            <Label
              label="Bairro"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
            >
              <Input
                {...register("delivery_district", {
                  required: "Este campo é obrigatório.",
                })}
                disabled={dialogType === "view"}
                placeholder="Rio Branco"
                status={formState.errors.client_id && "error"}
              />
            </Label>
            <Label
              label="Cidade"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
            >
              <Input
                {...register("delivery_city", {
                  required: "Este campo é obrigatório.",
                })}
                disabled={dialogType === "view"}
                placeholder="São Paulo"
                status={formState.errors.client_id && "error"}
              />
            </Label>
            <Label
              label="Estado"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
            >
              <Input
                {...register("delivery_state", {
                  required: "Este campo é obrigatório.",
                })}
                disabled={dialogType === "view"}
                placeholder="SP"
                status={formState.errors.client_id && "error"}
              />
            </Label>

            <Label
              label="CEP"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
            >
              <Input
                {...register("delivery_zipcode", {
                  required: "Este campo é obrigatório.",
                })}
                disabled={dialogType === "view"}
                placeholder="12345678"
                status={formState.errors.client_id && "error"}
              />
            </Label>
            <Label
              label="Número"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
            >
              <Input
                {...register("delivery_number", {
                  required: "Este campo é obrigatório.",
                })}
                disabled={dialogType === "view"}
                placeholder="Número do pedido"
                status={formState.errors.client_id && "error"}
              />
            </Label>
            <Label
              label="Complemento"
              status={formState.errors.client_id && "error"}
              errorText={formState.errors.client_id?.message}
            >
              <Input
                {...register("delivery_complement")}
                disabled={dialogType === "view"}
                placeholder="Complemento do endereço"
                status={formState.errors.client_id && "error"}
              />
            </Label>
          </div>

          {dialogType !== "view" && <DialogFooter ref={dialogFooterRef} />}
        </form>
      </DialogContent>
    </Dialog>
  );
});
