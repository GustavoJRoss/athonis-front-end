"use client";

import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { createClient, updateClient } from "@/src/lib/clients/requests";
import { useToast } from "@/hooks/useToast";
import { DialogFooter } from "../../utils/dialog/DialogFooter";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { DialogOpenRef, DialogOpenType } from "../../types/types";
import { ClientType } from "../../types/clients";

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

  const { register, handleSubmit, setValue, reset, control } =
    useForm<ClientFormData>();

  const { successToast, errorToast } = useToast();

  const dialogFooterRef = useRef<any>(null);

  const onSubmit = async (data: ClientFormData) => {
    dialogFooterRef.current?.setLoading(true);
    console.log({ dialogType });
    if (dialogType === "create") {
      const createResponse = await createClient(data);
      dialogFooterRef.current?.setLoading(false);

      if (createResponse?.success) {
        dialogFooterRef.current?.close();
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
        dialogFooterRef.current?.close();
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
    console.log(data);
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
        setDialogType("view");
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
            <DialogTitle>Criar Novo Cliente</DialogTitle>
          </DialogHeader>

          {/* --- Dados Principais --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome</Label>
              <Input
                {...register("name")}
                disabled={dialogType === "view"}
                placeholder="João Silva"
              />
            </div>

            <div>
              <Label>Nome Fantasia</Label>
              <Input
                {...register("trade_name")}
                placeholder="João Silva e Cia"
                disabled={dialogType === "view"}
              />
            </div>

            <div>
              <Label>Documento</Label>
              <Input
                {...register("document")}
                placeholder="123.456.789-00"
                disabled={dialogType === "view"}
              />
            </div>

            <div>
              <Label>Inscrição Estadual</Label>
              <Input
                {...register("state_registration")}
                placeholder="Inscrição estadual"
                disabled={dialogType === "view"}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="email@exemplo.com"
                disabled={dialogType === "view"}
              />
            </div>

            <div>
              <Label>Telefone</Label>
              <Input
                {...register("phone")}
                placeholder="(11) 99999-9999"
                disabled={dialogType === "view"}
              />
            </div>

            {/* TYPE */}
            <div>
              <Label>Tipo</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    value={field.value} // valor atual controlado pelo RHF
                    onValueChange={field.onChange}
                    disabled={dialogType === "view"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="F">Pessoa Física</SelectItem>
                      <SelectItem value="J">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* --- Endereço --- */}
          <h3 className="text-lg font-medium mt-4">Endereço</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Rua</Label>
              <Input
                {...register("street")}
                disabled={dialogType === "view"}
                placeholder="Rua das Flores"
              />
            </div>

            <div>
              <Label>Bairro</Label>
              <Input
                {...register("neighborhood")}
                disabled={dialogType === "view"}
                placeholder="Centro"
              />
            </div>

            <div>
              <Label>Cidade</Label>
              <Input
                {...register("city")}
                disabled={dialogType === "view"}
                placeholder="São Paulo"
              />
            </div>

            <div>
              <Label>Estado</Label>
              <Input
                {...register("state")}
                disabled={dialogType === "view"}
                placeholder="SP"
              />
            </div>

            <div>
              <Label>CEP</Label>
              <Input
                {...register("zip_code")}
                disabled={dialogType === "view"}
                placeholder="01234-567"
              />
            </div>

            <div>
              <Label>Número</Label>
              <Input
                {...register("number")}
                disabled={dialogType === "view"}
                placeholder="123"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Complemento</Label>
              <Input
                {...register("complement")}
                disabled={dialogType === "view"}
                placeholder="Apto 45"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label>Observações</Label>
            <Textarea
              {...register("notes")}
              placeholder="Alguma observação do cliente..."
              disabled={dialogType === "view"}
            />
          </div>
          {dialogType !== "view" && <DialogFooter ref={dialogFooterRef} />}
        </form>
      </DialogContent>
    </Dialog>
  );
});
