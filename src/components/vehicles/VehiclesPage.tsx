"use client";

import { DataTable, DataTableRefProps } from "../datatables/Datatable";
import { useRef } from "react";
import { DialogOpenRef } from "../types/types";
import { IconAction } from "../utils/IconAction";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { getVehicles } from "@/src/lib/vehicles/requests";
import { DeleteVehicleDialog } from "./dialogs/DeleteVehicleDialogs";
import { VehicleType } from "../types/vehicle";
import { VehiclesDialog } from "./dialogs/VehiclesDialog";
import { Button } from "antd";

type VehiclesPageProps = {
  initialData: any[];
  totalRows: number;
};

export default function VehiclesPage({
  initialData,
  totalRows,
}: VehiclesPageProps) {
  const dataTableRef = useRef<DataTableRefProps>(null);
  const vehicleDialogRef = useRef<DialogOpenRef<VehicleType>>(null);
  const deleteVehicleRef = useRef<any>(null);

  return (
    <>
      <DataTable
        ref={dataTableRef}
        headerActions={
          <Button
            type="primary"
            onClick={() => vehicleDialogRef.current?.open("create")}
          >
            Adicionar Veículo
          </Button>
        }
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
                    onClick={() =>
                      deleteVehicleRef.current.open(data.vehicle_id)
                    }
                  />
                  <IconAction
                    icon={PencilIcon}
                    text="Editar"
                    onClick={() => {
                      vehicleDialogRef.current?.open("edit", data);
                    }}
                  />
                  <IconAction
                    icon={EyeIcon}
                    text="Visualizar"
                    onClick={() => vehicleDialogRef.current?.open("view", data)}
                  />
                </div>
              );
            },
          },
          {
            headerName: "Name",
            field: "name",
          },
          {
            headerName: "Marca",
            field: "brand",
          },
          {
            headerName: "Modelo",
            field: "model",
          },
          {
            headerName: "Ano",
            field: "year",
          },
        ]}
        className="h-[calc(100vh-427px)]"
        getMethod={async (getProps) => {
          const userResponse = await getVehicles({
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
      <VehiclesDialog
        ref={vehicleDialogRef}
        onSubmitSuccess={() => dataTableRef.current?.fetchData()}
      />
      <DeleteVehicleDialog
        ref={deleteVehicleRef}
        onSubmitSuccess={() => dataTableRef.current?.fetchData()}
      />
    </>
  );
}
