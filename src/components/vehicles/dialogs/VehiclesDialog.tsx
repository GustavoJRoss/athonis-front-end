"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { DialogFooter } from "../../utils/dialog/DialogFooter";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { DialogOpenRef, DialogOpenType } from "../../types/types";
import { VehicleType } from "../../types/vehicle";
import { createVehicle, updateVehicle } from "@/src/lib/vehicles/requests";

export type VehicleFormData = {
  name: string;
  model: string;
  brand: string;
  year: number;
  vehicle_id: number;
};

type VehiclesDialogProps = {
  onSubmitSuccess: () => void;
};

export const VehiclesDialog = forwardRef<
  DialogOpenRef<VehicleType>,
  VehiclesDialogProps
>((props, ref) => {
  const { onSubmitSuccess } = props;

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogOpenType>("view");

  const { register, handleSubmit, setValue, reset, formState } =
    useForm<VehicleFormData>();

  const { successToast, errorToast } = useToast();

  const dialogFooterRef = useRef<any>(null);

  const onSubmit = async (data: VehicleFormData) => {
    dialogFooterRef.current?.setLoading(true);

    if (dialogType === "create") {
      console.log({ data });
      const createResponse = await createVehicle(data);
      dialogFooterRef.current?.setLoading(false);

      if (createResponse?.success) {
        dialogFooterRef.current?.close();
        successToast("Motorista criado com sucesso!");
        onSubmitSuccess();
        return;
      }

      errorToast(
        createResponse?.message || "Erro ao criar motorista. Tente novamente."
      );
      console.error(createResponse);
    } else if (dialogType === "edit") {
      const updateResponse = await updateVehicle(data);
      dialogFooterRef.current?.setLoading(false);

      if (updateResponse?.success) {
        dialogFooterRef.current?.close();
        successToast("Motorista editado com sucesso!");
        onSubmitSuccess();
        return;
      }

      errorToast(
        updateResponse.message || "Erro ao editar motorista. Tente novamente."
      );
      console.error(updateResponse);
    }
  };

  const setFormData = (data?: VehicleType) => {
    if (!data) return;
    setValue("name", data?.name);
    setValue("brand", data?.brand);
    setValue("year", data?.year);
    setValue("model", data?.model);
    setValue("vehicle_id", data?.vehicle_id);
  };

  const handleOpenDialog = (type: DialogOpenType, data?: VehicleType) => {
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

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Criar Novo Motorista</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label
              label="Nome"
              status={formState.errors.name && "error"}
              errorText={formState.errors.name?.message}
            >
              <Input
                {...register("name", { required: "Este campo é obrigatório" })}
                disabled={dialogType === "view"}
                placeholder="João Silva"
                status={formState.errors.name && "error"}
              />
            </Label>

            <Label
              label="Modelo"
              status={formState.errors.model && "error"}
              errorText={formState.errors.model?.message}
            >
              <Input
                {...register("model", { required: "Este campo é obrigatório" })}
                placeholder="Fiat Fiorino"
                disabled={dialogType === "view"}
                status={formState.errors.year && "error"}
              />
            </Label>

            <Label
              label="Marca"
              status={formState.errors.brand && "error"}
              errorText={formState.errors.brand?.message}
            >
              <Input
                {...register("brand", { required: "Este campo é obrigatório" })}
                placeholder="Fiat"
                disabled={dialogType === "view"}
                status={formState.errors.year && "error"}
              />
            </Label>

            <Label
              label="Ano de Fabricação"
              status={formState.errors.year && "error"}
              errorText={formState.errors.year?.message}
            >
              <Input
                {...register("year", { required: "Este campo é obrigatório" })}
                placeholder="2014"
                disabled={dialogType === "view"}
                status={formState.errors.year && "error"}
              />
            </Label>
          </div>

          {dialogType !== "view" && <DialogFooter ref={dialogFooterRef} />}
        </form>
      </DialogContent>
    </Dialog>
  );
});
