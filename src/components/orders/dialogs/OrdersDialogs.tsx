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

  const { register, handleSubmit, setValue, reset, control } =
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

          {/* --- Infos Principais --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div>
              <Label>Cliente ID</Label>
              <Input
                type="number"
                {...register("client_id", { valueAsNumber: true })}
                disabled={dialogType === "view"}
              />
            </div>

            {/* Título */}
            <div>
              <Label>Título</Label>
              <Input
                {...register("title")}
                placeholder="Entrega de mercadorias"
                disabled={dialogType === "view"}
              />
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <Label>Descrição</Label>
              <Textarea
                {...register("description")}
                placeholder="Descrição do pedido..."
                disabled={dialogType === "view"}
              />
            </div>

            {/* Nota Fiscal */}
            <div>
              <Label>Número NF</Label>
              <Input
                {...register("invoice_number")}
                placeholder="NF-123456"
                disabled={dialogType === "view"}
              />
            </div>

            {/* Urgência */}
            <div>
              <Label>Urgência</Label>

              <Controller
                control={control}
                name="urgency"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={dialogType === "view"}
                  >
                    <SelectTrigger>
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
            </div>

            {/* Veículo */}
            <div>
              <Label>Veículo ID</Label>
              <Input
                type="number"
                {...register("vehicle_id", { valueAsNumber: true })}
                disabled={dialogType === "view"}
              />
            </div>

            {/* Motorista */}
            <div>
              <Label>Motorista ID</Label>
              <Input
                type="number"
                {...register("driver_id", { valueAsNumber: true })}
                disabled={dialogType === "view"}
              />
            </div>

            {/* Quantidade */}
            <div>
              <Label>Quantidade</Label>
              <Input
                type="number"
                {...register("quantity", { valueAsNumber: true })}
                disabled={dialogType === "view"}
              />
            </div>
          </div>

          {/* --- Endereço de Entrega --- */}
          <h3 className="text-lg font-medium mt-4">Endereço de Entrega</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Rua</Label>
              <Input
                {...register("delivery_street")}
                disabled={dialogType === "view"}
              />
            </div>

            <div>
              <Label>Bairro</Label>
              <Input
                {...register("delivery_district")}
                disabled={dialogType === "view"}
              />
            </div>

            <div>
              <Label>Cidade</Label>
              <Input
                {...register("delivery_city")}
                disabled={dialogType === "view"}
              />
            </div>

            <div>
              <Label>Estado</Label>
              <Input
                {...register("delivery_state")}
                disabled={dialogType === "view"}
              />
            </div>

            <div>
              <Label>CEP</Label>
              <Input
                {...register("delivery_zipcode")}
                disabled={dialogType === "view"}
              />
            </div>

            <div>
              <Label>Número</Label>
              <Input
                {...register("delivery_number")}
                disabled={dialogType === "view"}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Complemento</Label>
              <Input
                {...register("delivery_complement")}
                disabled={dialogType === "view"}
              />
            </div>
          </div>

          {dialogType !== "view" && <DialogFooter ref={dialogFooterRef} />}
        </form>
      </DialogContent>
    </Dialog>
  );
});
