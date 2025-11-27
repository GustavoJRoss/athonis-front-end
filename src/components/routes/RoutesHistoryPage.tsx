"use client";

import { DataTable, DataTableRefProps } from "../datatables/Datatable";
import { useRef, useState } from "react";
import { getOrders } from "@/src/lib/orders/requests";
import { AgGridReact } from "ag-grid-react";
import RouteValidation from "./RouteValidation";
import { OrderType } from "../types/orders";
import { Button } from "@/components/ui/button";
import { HistoryIcon, MapIcon, TextSelectIcon, TvIcon } from "lucide-react";
import { getRoutes } from "@/src/lib/routes/requests";
import { Card } from "@/components/ui/card";
import { IconAction } from "../utils/IconAction";

type RoutesHistoryPageProps = {
  initialData: any[];
  totalRows: number;
};

export default function RoutesHistoryPage({
  initialData,
  totalRows,
}: RoutesHistoryPageProps) {
  const [routes, setRoutes] = useState<any[]>();

  const dataTableRef = useRef<DataTableRefProps>(null);
  const gridRef = useRef<AgGridReact>(null);

  return (
    <>
      <DataTable
        height={300}
        ref={dataTableRef}
        gridRef={gridRef}
        rowSelection="multiple"
        columnDefs={[
          {
            headerName: "Ações",
            pinned: true,
            cellRenderer: ({ data }: any) => (
              <div className="h-full flex gap-4 items-center justify-center">
                <IconAction
                  icon={MapIcon}
                  text="Visualizar Rota"
                  onClick={() => setRoutes(data?.optimization_result?.routes)}
                />
                <IconAction
                  icon={TvIcon}
                  text="Visualizar Rota"
                  onClick={() => console.log(data)}
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

      {routes?.map((route) => (
        <Card key={route.vehicleId} className="shadow-sm p-4 space-y-4">
          <h1 className="text-xl font-semibold">
            {route.vehicleName} — Motorista: {route.driverName}
          </h1>

          {route.stops.map((stop: any) => (
            <div key={stop.orderId} className="border-t pt-4 space-y-2">
              <p>
                <b>Cliente:</b> {stop.clientName}
              </p>
              <p>
                <b>Endereço:</b> {stop.address}
              </p>

              {/* Link simples */}
              <div className="flex gap-5">
                <a
                  className="text-blue-600 underline"
                  href={`https://www.google.com/maps/search/?api=1&query=${stop.coordinates.latitude},${stop.coordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir no Google Maps
                </a>
                <a
                  className="text-blue-600 underline"
                  href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${stop.coordinates.latitude},${stop.coordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir Street View
                </a>
              </div>

              {/* MAPA EMBED */}
              <div className="flex">
                <iframe
                  width="100%"
                  height="250"
                  className="rounded-md"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${stop.coordinates.latitude},${stop.coordinates.longitude}&z=15&output=embed`}
                ></iframe>

                {/* STREET VIEW */}
                <iframe
                  width="100%"
                  height="250"
                  className="rounded-md"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed?pb=!4v0!6m8!1m7!1s!2m2!1d${stop.coordinates.latitude}!2d${stop.coordinates.longitude}!3f0!4f0!5f0.7820865974627469`}
                ></iframe>
              </div>
            </div>
          ))}
        </Card>
      ))}
    </>
  );
}
