"use client";

import { DataTable, DataTableRefProps } from "../datatables/Datatable";
import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { MapIcon } from "lucide-react";
import { getRoutes, getStreetViewData } from "@/src/lib/routes/requests";
import { IconAction } from "../utils/IconAction";
import { Card } from "antd";
import { useRouter } from "next/navigation";
import RouteValidation from "./RouteValidation";
import { OrderType } from "../types/orders";

type RoutesHistoryPageProps = {
  initialData: any[];
  totalRows: number;
};

export default function RoutesHistoryPage({
  initialData,
  totalRows,
}: RoutesHistoryPageProps) {
  const router = useRouter();

  const [routes, setRoutes] = useState<any[]>([]);
  const [streetViewMap, setStreetViewMap] = useState<Record<number, any>>({});

  const dataTableRef = useRef<DataTableRefProps>(null);
  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    if (!routes || routes.length === 0) return;

    async function loadStreetViews() {
      const newData: Record<number, any> = {};

      for (const route of routes) {
        for (const stop of route.stops) {
          try {
            const { data } = await getStreetViewData({
              order_id: stop.orderId,
            });
            console.log({ data });
            newData[stop.orderId] = data;
          } catch (err) {
            console.error("Erro ao carregar Street View", err);
            newData[stop.orderId] = null;
          }
        }
      }

      setStreetViewMap((prev) => ({ ...prev, ...newData }));
    }

    loadStreetViews();
  }, [routes]);

  return (
    <>
      <DataTable
        className="h-[calc(100vh-437px)]"
        ref={dataTableRef}
        gridRef={gridRef}
        rowSelection={{ mode: "multiRow", checkboxes: true }}
        columnDefs={[
          {
            headerName: "Código",
            field: "id",
            maxWidth: 100,
          },
          {
            headerName: "Notes",
            field: "notes",
            minWidth: 320,
          },
          {
            headerName: "Status",
            field: "status",
            maxWidth: 100,
          },
          {
            headerName: "Total de Pedidos",
            field: "total_orders",
            maxWidth: 150,
          },
          {
            headerName: "Total de Rotas",
            maxWidth: 150,
            field: "total_routes",
          },
          {
            headerName: "Criado Em",
            field: "created_at",
          },
          {
            headerName: "Atualizado Em",
            field: "updated_at",
          },
          {
            headerName: "Ações",
            field: "actions",
            maxWidth: 80,
            resizable: false,
            cellRenderer: ({ data }: any) => (
              <div className="h-full flex gap-4 items-center justify-center">
                <IconAction
                  icon={MapIcon}
                  text="Visualizar Rota"
                  onClick={() => {
                    router.push(`/routes/${data.id}`);
                  }}
                />
              </div>
            ),
          },
        ]}
        getMethod={async (getProps) => {
          const routesResponse: any = await getRoutes({
            page: getProps.page,
            pageSize: getProps.pageSize,
            filter: getProps.filter,
          });
          return {
            data: routesResponse?.data,
            total: routesResponse?.data.length || 0,
          };
        }}
        initialData={initialData}
        initialTotal={totalRows}
      />
      <RouteValidation
        getSelectedRows={() =>
          gridRef.current?.api.getSelectedRows() as OrderType[]
        }
      />
    </>
  );
}
