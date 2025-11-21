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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { DialogFooter } from "../../utils/dialog/DialogFooter";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { DialogOpenRef, DialogOpenType } from "../../types/types";
import { DriverType } from "../../types/drivers";
import { createDriver, updateDriver } from "@/src/lib/drivers/requests";
import { DatePicker } from "@/components/ui/date-picker";

export type DriverFormData = {
  name: string;
  document: string;
  gender: string;
  birth_date: Date | undefined;
  driver_id: number;
};

type DriversDialogProps = {
  onSubmitSuccess: () => void;
};

export const DriversDialog = forwardRef<
  DialogOpenRef<DriverType>,
  DriversDialogProps
>((props, ref) => {
  const { onSubmitSuccess } = props;

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogOpenType>("view");

  const { register, handleSubmit, setValue, reset, control, formState } =
    useForm<DriverFormData>();

  const { successToast, errorToast } = useToast();

  const dialogFooterRef = useRef<any>(null);

  const onSubmit = async (data: DriverFormData) => {
    dialogFooterRef.current?.setLoading(true);

    if (dialogType === "create") {
      const createResponse = await createDriver(data);
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
      const updateResponse = await updateDriver(data);
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

  const setFormData = (data?: DriverType) => {
    if (!data) return;
    setValue("name", data?.name);
    setValue("document", data?.document.toString());
    setValue("gender", data?.gender);
    setValue("birth_date", data?.birth_date);
    setValue("driver_id", data?.driver_id);
  };

  const handleOpenDialog = (type: DialogOpenType, data?: DriverType) => {
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

          {/* --- Dados Principais --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label
              label="Nome"
              status={formState.errors.name && "error"}
              errorText={formState.errors.name?.message}
            >
              <Input
                {...register("name", { required: "Este campo é obrigatório." })}
                disabled={dialogType === "view"}
                status={formState.errors.name && "error"}
                placeholder="João Silva"
              />
            </Label>
            <Label
              label="Documento"
              status={formState.errors.document && "error"}
              errorText={formState.errors.document?.message}
            >
              <Input
                {...register("document")}
                placeholder="123.456.789-00"
                status={formState.errors.name && "error"}
                disabled={dialogType === "view"}
              />
            </Label>
            <Label
              label="Data de Nascimento"
              status={formState.errors.birth_date && "error"}
              errorText={formState.errors.birth_date?.message}
            >
              <DatePicker onSelect={(date) => setValue("birth_date", date)} />
            </Label>
            <Label
              label="Gênero"
              status={formState.errors.gender && "error"}
              errorText={formState.errors.gender?.message}
            >
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={dialogType === "view"}
                  >
                    <SelectTrigger
                      status={formState.errors.name && "error"}
                      className="w-full"
                    >
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="M">Masculino</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Label>
          </div>
          {dialogType !== "view" && <DialogFooter ref={dialogFooterRef} />}
        </form>
      </DialogContent>
    </Dialog>
  );
});
