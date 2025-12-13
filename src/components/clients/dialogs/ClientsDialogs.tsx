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

  const { register, handleSubmit, setValue, reset, control, formState } =
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
                ? "Criar"
                : dialogType === "edit"
                ? "Editar"
                : "Visualizar"}{" "}
              Cliente
            </DialogTitle>
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
              label="Nome Fantasia"
              status={formState.errors.trade_name && "error"}
              errorText={formState.errors.trade_name?.message}
            >
              <Input
                {...register("trade_name", {
                  required: "Este campo é obrigatório",
                })}
                placeholder="João Silva e Cia"
                disabled={dialogType === "view"}
                status={formState.errors.trade_name && "error"}
              />
            </Label>

            <Label
              label="Documento"
              status={formState.errors.document && "error"}
              errorText={formState.errors.document?.message}
            >
              <Input
                {...register("document", {
                  required: "Este campo é obrigatório",
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="12345678900"
                disabled={dialogType === "view"}
                status={formState.errors.document && "error"}
              />
            </Label>
            <Label
              label="Inscrição Estadual"
              status={formState.errors.state_registration && "error"}
              errorText={formState.errors.state_registration?.message}
            >
              <Input
                {...register("state_registration", {
                  required: "Este campo é obrigatório",
                })}
                placeholder="Inscrição estadual"
                disabled={dialogType === "view"}
                status={formState.errors.state_registration && "error"}
              />
            </Label>
            <Label
              label="Email"
              status={formState.errors.email && "error"}
              errorText={formState.errors.email?.message}
            >
              <Input
                {...register("email", { required: "Este campo é obrigatório" })}
                type="email"
                placeholder="email@exemplo.com"
                disabled={dialogType === "view"}
                status={formState.errors.email && "error"}
              />
            </Label>
            <Label
              label="Telefone"
              status={formState.errors.phone && "error"}
              errorText={formState.errors.phone?.message}
            >
              <Input
                {...register("phone", { required: "Este campo é obrigatório" })}
                placeholder="(11) 99999-9999"
                disabled={dialogType === "view"}
                status={formState.errors.phone && "error"}
              />
            </Label>
            <Label
              label="Tipo"
              status={formState.errors.type && "error"}
              errorText={formState.errors.type?.message}
            >
              <Controller
                control={control}
                name="type"
                rules={{ required: "Este campo é obrigatório" }}
                render={({ field }) => (
                  <Select
                    value={field.value} // valor atual controlado pelo RHF
                    onValueChange={field.onChange}
                    disabled={dialogType === "view"}
                  >
                    <SelectTrigger
                      status={formState.errors.type && "error"}
                      className="w-full"
                    >
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="F">Pessoa Física</SelectItem>
                      <SelectItem value="J">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Label>

            <Label
              label="Rua"
              status={formState.errors.street && "error"}
              errorText={formState.errors.street?.message}
            >
              <Input
                {...register("street", {
                  required: "Este campo é obrigatório",
                })}
                disabled={dialogType === "view"}
                placeholder="Rua das Flores"
                status={formState.errors.street && "error"}
              />
            </Label>

            <Label
              label="Bairro"
              status={formState.errors.neighborhood && "error"}
              errorText={formState.errors.neighborhood?.message}
            >
              <Input
                {...register("neighborhood", {
                  required: "Este campo é obrigatório",
                })}
                disabled={dialogType === "view"}
                placeholder="Centro"
                status={formState.errors.neighborhood && "error"}
              />
            </Label>

            <Label
              label="Cidade"
              status={formState.errors.city && "error"}
              errorText={formState.errors.city?.message}
            >
              <Input
                {...register("city", { required: "Este campo é obrigatório" })}
                disabled={dialogType === "view"}
                placeholder="São Paulo"
                status={formState.errors.city && "error"}
              />
            </Label>
            <Label
              label="Estado"
              status={formState.errors.state && "error"}
              errorText={formState.errors.state?.message}
            >
              <Controller
                control={control}
                name="state"
                rules={{ required: "Este campo é obrigatório" }}
                render={({ field }) => (
                  <Select
                    value={field.value} // valor atual controlado pelo RHF
                    onValueChange={field.onChange}
                    disabled={dialogType === "view"}
                  >
                    <SelectTrigger
                      status={formState.errors.state && "error"}
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
              status={formState.errors.zip_code && "error"}
              errorText={formState.errors.zip_code?.message}
            >
              <Input
                {...register("zip_code", {
                  required: "Este campo é obrigatório",
                })}
                disabled={dialogType === "view"}
                placeholder="01234-567"
                status={formState.errors.zip_code && "error"}
              />
            </Label>
            <Label
              label="Número"
              status={formState.errors.number && "error"}
              errorText={formState.errors.number?.message}
            >
              <Input
                {...register("number", {
                  required: "Este campo é obrigatório",
                  valueAsNumber: true,
                })}
                type="number"
                disabled={dialogType === "view"}
                placeholder="123"
                status={formState.errors.number && "error"}
              />
            </Label>

            <Label
              label="Complemento"
              status={formState.errors.complement && "error"}
              errorText={formState.errors.complement?.message}
            >
              <Input
                {...register("complement", {
                  required: "Este campo é obrigatório",
                })}
                disabled={dialogType === "view"}
                placeholder="Apto 45"
                status={formState.errors.complement && "error"}
              />
            </Label>
          </div>

          <Label
            label="Observações"
            status={formState.errors.notes && "error"}
            errorText={formState.errors.notes?.message}
          >
            <Textarea
              {...register("notes", { required: "Este campo é obrigatório" })}
              placeholder="Alguma observação do cliente..."
              disabled={dialogType === "view"}
              status={formState.errors.notes && "error"}
            />
          </Label>

          {dialogType !== "view" && <DialogFooter ref={dialogFooterRef} />}
        </form>
      </DialogContent>
    </Dialog>
  );
});
