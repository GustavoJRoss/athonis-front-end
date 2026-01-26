"use client";

import { getClients } from "@/src/lib/clients/requests";
import { DataTable, DataTableRefProps } from "../datatables/Datatable";
import { useRef } from "react";
import { DialogOpenRef } from "../types/types";
import { IconAction } from "../utils/IconAction";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { getDrivers } from "@/src/lib/drivers/requests";
import { DriversDialog } from "./dialogs/DriversDialog";
import { DeleteDriverDialog } from "./dialogs/DeleteDriverDialog";
import { DriverType } from "../types/drivers";
import { Button } from "antd";

type DriversPageProps = {
  initialData: any[];
  totalRows: number;
};

export default function DriversPage({
  initialData,
  totalRows,
}: DriversPageProps) {
  const dataTableRef = useRef<DataTableRefProps>(null);
  const driverDialogRef = useRef<DialogOpenRef<DriverType>>(null);
  const deleteDriverRef = useRef<any>(null);

  return (
    <>
      <DataTable
        ref={dataTableRef}
        headerActions={
          <Button
            type="primary"
            onClick={() => driverDialogRef.current?.open("create")}
          >
            Adicionar Motorista
          </Button>
        }
        className="h-[calc(100vh-427px)]"
        columnDefs={[
          {
            headerName: "Ações",
            pinned: true,
            maxWidth: 130,
            cellRenderer: ({ data }: any) => {
              return (
                <div className="flex gap-4 h-full items-center justify-center">
                  <IconAction
                    icon={TrashIcon}
                    text="Deletar"
                    onClick={() => deleteDriverRef.current.open(data.driver_id)}
                  />
                  <IconAction
                    icon={PencilIcon}
                    text="Editar"
                    onClick={() => {
                      driverDialogRef.current?.open("edit", data);
                    }}
                  />
                  <IconAction
                    icon={EyeIcon}
                    text="Visualizar"
                    onClick={() => driverDialogRef.current?.open("view", data)}
                  />
                </div>
              );
            },
          },
          { headerName: "Nome", field: "name" },
          { headerName: "Gênero", field: "gender" },
          { headerName: "Documento", field: "document" },
          { headerName: " Data de Nascimento", field: "birth_date" },
        ]}
        getMethod={async (getProps) => {
          const userResponse = await getDrivers({
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
      <DriversDialog
        ref={driverDialogRef}
        onSubmitSuccess={() => dataTableRef.current?.fetchData()}
      />
      <DeleteDriverDialog
        ref={deleteDriverRef}
        onSubmitSuccess={() => dataTableRef.current?.fetchData()}
      />
    </>
  );
}
