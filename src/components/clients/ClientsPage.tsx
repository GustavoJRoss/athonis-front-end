"use client";

import { getClients } from "@/src/lib/clients/requests";
import NewClientDialog from "./dialogs/NewClientsDialogs";
import { DataTable, DataTableRefProps } from "../datatables/Datatable";
import { useRef } from "react";

type ClientsPageProps = {
  initialData: any[];
  totalRows: number;
};

export default function ClientsPage({
  initialData,
  totalRows,
}: ClientsPageProps) {
  const dataTableRef = useRef<DataTableRefProps>(null);

  return (
    <DataTable
      ref={dataTableRef}
      headerActions={
        <NewClientDialog
          onSubmitSuccess={() => dataTableRef?.current?.fetchData()}
        />
      }
      columnDefs={[
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
          data: userResponse?.items || [],
          total: userResponse?.meta?.total || 0,
        };
      }}
      initialData={initialData}
      initialTotal={totalRows}
    />
  );
}
