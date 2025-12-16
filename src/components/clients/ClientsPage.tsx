"use client";

import { getClients } from "@/src/lib/clients/requests";
import { DataTable, DataTableRefProps } from "../datatables/Datatable";
import { useRef } from "react";
import { ClientDialog } from "./dialogs/ClientsDialogs";
import { DialogOpenRef } from "../types/types";
import { IconAction } from "../utils/IconAction";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { ClientType } from "../types/clients";
import { DeleteClientDialog } from "./dialogs/DeleteClientDialog";
import { Button } from "antd";

type ClientsPageProps = {
  initialData: any[];
  totalRows: number;
};

export default function ClientsPage({
  initialData,
  totalRows,
}: ClientsPageProps) {
  const dataTableRef = useRef<DataTableRefProps>(null);
  const clientDialogRef = useRef<DialogOpenRef<ClientType>>(null);
  const deleteClientRef = useRef<any>(null);

  return (
    <>
      <DataTable
        ref={dataTableRef}
        headerActions={
          <Button
            type="primary"
            onClick={() => clientDialogRef.current?.open("create")}
          >
            Criar Cliente
          </Button>
        }
        columnDefs={[
          {
            headerName: "Ações",
            pinned: true,
            maxWidth: 130,
            headerClass: "*:*:*:justify-center",
            cellRenderer: ({ data }: any) => {
              return (
                <div className="flex gap-4 h-full items-center justify-center">
                  <IconAction
                    icon={TrashIcon}
                    text="Deletar"
                    onClick={() => deleteClientRef.current.open(data.client_id)}
                  />
                  <IconAction
                    icon={PencilIcon}
                    text="Editar"
                    onClick={() => {
                      clientDialogRef.current?.open("edit", data);
                    }}
                  />
                  <IconAction
                    icon={EyeIcon}
                    text="Visualizar"
                    onClick={() => clientDialogRef.current?.open("view", data)}
                  />
                </div>
              );
            },
          },
          { headerName: "Código", field: "client_id", maxWidth: 80 },
          { headerName: "Nome", field: "name" },
          { headerName: "Nome Fantasia", field: "trade_name" },
          { headerName: "Documento", field: "document" },
          { headerName: "Inscrição Estadual", field: "state_registration" },
          { headerName: "E-mail", field: "email" },
          { headerName: "Telefone", field: "phone" },
          { headerName: "Tipo", field: "type" },
          { headerName: "Data de Nascimento", field: "birth_date" },
          { headerName: "Rua", field: "street" },
          { headerName: "Bairro", field: "neighborhood" },
          { headerName: "Cidade", field: "city" },
          { headerName: "Estado", field: "state" },
          { headerName: "CEP", field: "zip_code" },
          { headerName: "Número", field: "number" },
          { headerName: "Complemento", field: "complement" },
          { headerName: "Observações", field: "notes" },
          { headerName: "Criado em", field: "created_at" },
          { headerName: "Criado por", field: "created_by" },
          { headerName: "Atualizado em", field: "updated_at" },
          { headerName: "Atualizado por", field: "updated_by" },
        ]}
        getMethod={async (getProps) => {
          const userResponse = await getClients({
            page: getProps.page,
            pageSize: getProps.pageSize,
            filter: getProps.filter,
          });
          return {
            data: userResponse?.data?.items || [],
            total: userResponse?.data?.meta?.total || 0,
          };
        }}
        initialData={initialData}
        initialTotal={totalRows}
      />
      <ClientDialog
        ref={clientDialogRef}
        onSubmitSuccess={() => dataTableRef.current?.fetchData()}
      />
      <DeleteClientDialog
        ref={deleteClientRef}
        onSubmitSuccess={() => dataTableRef.current?.fetchData()}
      />
    </>
  );
}
