"use client";

import { Label } from "@/components/ui/label";
import { Button, Card, Flex, Input, Tooltip } from "antd";
import { Grid } from "../ui/Grid";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ClientDialog } from "./dialogs/ClientsDialogs";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { DeleteClientDialog } from "./dialogs/DeleteClientDialog";

export type ClientType = {
  client_id: number;
  name: string;
  trade_name: string;
  document: string;
  state_registration: string;
  email: string;
  phone: string;
  type: string;
  birth_date: string | null;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  number: string;
  complement: string;
  notes: string;
  created_at: string;
  created_by: number | null;
  updated_at: string;
  updated_by: number | null;
};

export const ClientDetails = ({ client }: { client: ClientType }) => {
  const router = useRouter();

  const editClientDialogRef = useRef<any>(null);
  const deleteClientRef = useRef<any>(null);

  return (
    <Card className="h-[calc(100vh-250px)] shadow-sm overflow-y-auto">
      <ClientDialog
        ref={editClientDialogRef}
        onSubmitSuccess={() => router.refresh()}
      />
      <DeleteClientDialog
        ref={deleteClientRef}
        onSubmitSuccess={() => router.push("/clients")}
      />
      <Grid size={12}>
        <Grid.Cell span={{ lg: 6, md: 12 }}>
          <Label label="Nome do Cliente">
            <Input type="text" value={client?.name} />
          </Label>
        </Grid.Cell>
        <Grid.Cell span={{ lg: 5, md: 12 }}>
          <Label label="Nome Fantasia">
            <Input type="text" value={client?.trade_name} />
          </Label>
        </Grid.Cell>
        <Grid.Cell span={{ xl: 1 }}>
          <Flex justify="end" align="end" className="h-full" gap={8}>
            <Tooltip title="Editar Cliente">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => editClientDialogRef.current.open("edit", client)}
              />
            </Tooltip>
            <Tooltip title="Deletar Cliente">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteClientRef.current.open(client?.client_id)}
              />
            </Tooltip>
          </Flex>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 3, md: 6 }}>
          <Label label="Documento (CPF/CNPJ)">
            <Input type="text" value={client?.document} />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 3, md: 6 }}>
          <Label label="Inscrição Estadual">
            <Input type="text" value={client?.state_registration} />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 4, md: 12 }}>
          <Label label="Email">
            <Input type="email" value={client?.email} />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 2, md: 12 }}>
          <Label label="Telefone">
            <Input type="text" value={client?.phone} />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 6, md: 12 }}>
          <Label label="Endereço">
            <Input type="text" value={client?.street} />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 2, md: 12 }}>
          <Label label="Número">
            <Input type="text" value={client?.number} />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 4, md: 12 }}>
          <Label label="Bairro">
            <Input type="text" value={client?.neighborhood} />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 4, md: 12 }}>
          <Label label="Cidade">
            <Input type="text" value={client?.city} />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 2, md: 6 }}>
          <Label label="Estado">
            <Input type="text" value={client?.state} />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 2, md: 6 }}>
          <Label label="CEP">
            <Input type="text" value={client?.zip_code} />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 4, md: 12 }}>
          <Label label="Complemento">
            <Input type="text" value={client?.complement} />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={12}>
          <Label label="Observações">
            <Input.TextArea value={client?.notes} />
          </Label>
        </Grid.Cell>
      </Grid>
    </Card>
  );
};
