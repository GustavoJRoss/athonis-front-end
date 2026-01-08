"use client";

import { DataTable, DataTableRefProps } from "../datatables/Datatable";
import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { MapIcon } from "lucide-react";
import { getRoutes, getStreetViewData } from "@/src/lib/routes/requests";
import { IconAction } from "../utils/IconAction";
import { Card } from "antd";

type RoutesHistoryPageProps = {
  initialData: any[];
  totalRows: number;
};

export default function RoutesHistoryPage({
  initialData,
  totalRows,
}: RoutesHistoryPageProps) {
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
        className="h-[calc(100vh-472px)]"
        ref={dataTableRef}
        gridRef={gridRef}
        rowSelection="multiple"
        columnDefs={[
          {
            headerName: "Ações",
            pinned: true,
            maxWidth: 80,
            resizable: false,
            cellRenderer: ({ data }: any) => (
              <div className="h-full flex gap-4 items-center justify-center">
                <IconAction
                  icon={MapIcon}
                  text="Visualizar Rota"
                  onClick={() => {
                    setRoutes(data?.optimization_result?.routes);
                  }}
                />
              </div>
            ),
          },
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

      {routes?.map((route: any) => (
        <Card key={route.vehicleId} className="shadow-sm p-4 space-y-4">
          <h1 className="text-xl font-semibold">
            {route.vehicleName} — Motorista: {route.driverName}
          </h1>

          {route.stops.map((stop: any) => {
            const sv = streetViewMap[stop.orderId];

            return (
              <div key={stop.orderId} className="border-t pt-4 space-y-2">
                <p>
                  <b>Cliente:</b> {stop.clientName}
                </p>
                <p>
                  <b>Endereço:</b> {stop.address}
                </p>

                <div className="flex gap-5">
                  <a
                    className="text-blue-600 underline"
                    href={`https://www.google.com/maps/search/?api=1&query=${stop.coordinates.latitude},${stop.coordinates.longitude}`}
                    target="_blank"
                  >
                    Abrir no Google Maps
                  </a>

                  <a
                    className="text-blue-600 underline"
                    href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${stop.coordinates.latitude},${stop.coordinates.longitude}`}
                    target="_blank"
                  >
                    Abrir Street View
                  </a>
                </div>

                <div className="flex">
                  <Card className="shadow-md *:!p-2">
                    <iframe
                      width="100%"
                      height="250"
                      className="rounded-md"
                      style={{ border: 0, borderRadius: "8px" }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${stop.coordinates.latitude},${stop.coordinates.longitude}&z=15&output=embed`}
                    />
                  </Card>

                  {sv ? (
                    <Card className="shadow-md *:!p-2">
                      <iframe
                        width="100%"
                        height="250"
                        className="rounded-md"
                        style={{ border: 0, borderRadius: "8px" }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://www.google.com/maps/embed?pb=!4v0!6m8!1m7!1s${sv.panoId}!2m2!1d${sv.coordinates.latitude}!2d${sv.coordinates.longitude}!3f0!4f0!5f0.7820865974627469`}
                      />
                    </Card>
                  ) : (
                    <div className="w-full h-[250px] flex items-center justify-center rounded-md bg-gray-100">
                      Carregando Street View...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      ))}
    </>
  );
}
