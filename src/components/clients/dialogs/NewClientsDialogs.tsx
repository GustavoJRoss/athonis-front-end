"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
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
import { createClient } from "@/src/lib/clients/requests";
import { useToast } from "@/hooks/useToast";
import { DialogFooter } from "../../utils/dialog/DialogFooter";
import { useRef } from "react";

export type ClientFormData = {
  name: string;
  trade_name?: string | null;
  document: string;
  state_registration?: string | null;
  email: string;
  phone: string;
  type: "F" | "J";
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  number: string;
  complement?: string | null;
  observations?: string | null;
};

export default function NewClientDialog({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) {
  const { register, handleSubmit, setValue } = useForm<ClientFormData>();

  const { successToast, errorToast } = useToast();

  const dialogFooterRef = useRef<any>(null);

  const onSubmit = async (data: any) => {
    dialogFooterRef.current?.setLoading(true);
    const createResponse = await createClient(data);
    dialogFooterRef.current?.setLoading(false);

    if (createResponse?.success) {
      dialogFooterRef.current?.close();
      successToast("Cliente criado com sucesso!");
      onSubmitSuccess();
      return;
    }

    errorToast("Erro ao criar cliente. Tente novamente.");
    console.error(createResponse);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Criar Cliente</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Criar Novo Cliente</DialogTitle>
          </DialogHeader>

          {/* --- Dados Principais --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome</Label>
              <Input {...register("name")} placeholder="João Silva" />
            </div>

            <div>
              <Label>Nome Fantasia</Label>
              <Input
                {...register("trade_name")}
                placeholder="João Silva e Cia"
              />
            </div>

            <div>
              <Label>Documento</Label>
              <Input {...register("document")} placeholder="123.456.789-00" />
            </div>

            <div>
              <Label>Inscrição Estadual</Label>
              <Input
                {...register("state_registration")}
                placeholder="Inscrição estadual"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <Label>Telefone</Label>
              <Input {...register("phone")} placeholder="(11) 99999-9999" />
            </div>

            {/* TYPE */}
            <div>
              <Label>Tipo</Label>
              <Select
                onValueChange={(value) => setValue("type", value as "F" | "J")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="F">Pessoa Física</SelectItem>
                  <SelectItem value="J">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* --- Endereço --- */}
          <h3 className="text-lg font-medium mt-4">Endereço</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Rua</Label>
              <Input {...register("street")} placeholder="Rua das Flores" />
            </div>

            <div>
              <Label>Bairro</Label>
              <Input {...register("neighborhood")} placeholder="Centro" />
            </div>

            <div>
              <Label>Cidade</Label>
              <Input {...register("city")} placeholder="São Paulo" />
            </div>

            <div>
              <Label>Estado</Label>
              <Input {...register("state")} placeholder="SP" />
            </div>

            <div>
              <Label>CEP</Label>
              <Input {...register("zip_code")} placeholder="01234-567" />
            </div>

            <div>
              <Label>Número</Label>
              <Input {...register("number")} placeholder="123" />
            </div>

            <div className="md:col-span-2">
              <Label>Complemento</Label>
              <Input {...register("complement")} placeholder="Apto 45" />
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label>Observações</Label>
            <Textarea
              {...register("observations")}
              placeholder="Alguma observação do cliente..."
            />
          </div>

          <DialogFooter ref={dialogFooterRef} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
