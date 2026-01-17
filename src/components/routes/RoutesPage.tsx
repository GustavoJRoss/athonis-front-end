// "use client";

// import { DataTable, DataTableRefProps } from "../datatables/Datatable";
// import { useRef } from "react";
// import { getOrders } from "@/src/lib/orders/requests";
// import { AgGridReact } from "ag-grid-react";
// import RouteValidation from "./RouteValidation";
// import { OrderType } from "../types/orders";
// import { HistoryIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Button } from "antd";
// import { HistoryOutlined } from "@ant-design/icons";

// type RoutesPageProps = {
//   initialData: any[];
//   totalRows: number;
// };

// export default function RoutesPage({
//   initialData,
//   totalRows,
// }: RoutesPageProps) {
//   const dataTableRef = useRef<DataTableRefProps>(null);
//   const gridRef = useRef<AgGridReact>(null);
//   const router = useRouter();
//   return (
//     <>
//       <DataTable
//         ref={dataTableRef}
//         gridRef={gridRef}
//         className="h-[calc(100vh-400px)]"
//         rowSelection="multiple"
//         headerActions={
//           <Button
//             icon={<HistoryOutlined />}
//             type="primary"
//             onClick={() => router.push("/routes/history")}
//           >
//             Visualizar Histórico de Rotas
//           </Button>
//         }
//         columnDefs={[
//           {
//             headerName: "",
//             checkboxSelection: true,
//             headerCheckboxSelection: true,
//             width: 50,
//             pinned: true,
//           },
//           {
//             headerName: "Código",
//             field: "order_id",
//             maxWidth: 100,
//             sortable: false,
//           },
//           {
//             headerName: "Cliente",
//             field: "client_id",
//             filter: "agNumberColumnFilter",
//           },
//           {
//             headerName: "Título",
//             field: "title",
//             filter: "agTextColumnFilter",
//           },
//           {
//             headerName: "Descrição",
//             field: "description",
//             filter: "agTextColumnFilter",
//           },
//           {
//             headerName: "NF",
//             field: "invoice_number",
//             filter: "agTextColumnFilter",
//           },
//           {
//             headerName: "Urgência",
//             field: "urgency",
//             filter: "agTextColumnFilter",
//           },

//           {
//             headerName: "Veículo",
//             field: "vehicle_id",
//             filter: "agNumberColumnFilter",
//           },
//           {
//             headerName: "Motorista",
//             field: "driver_id",
//             filter: "agNumberColumnFilter",
//           },

//           {
//             headerName: "Quantidade",
//             field: "quantity",
//             filter: "agNumberColumnFilter",
//           },

//           {
//             headerName: "Rua de Entrega",
//             field: "delivery_street",
//             filter: "agTextColumnFilter",
//           },
//           {
//             headerName: "Bairro de Entrega",
//             field: "delivery_district",
//             filter: "agTextColumnFilter",
//           },
//           {
//             headerName: "Cidade de Entrega",
//             field: "delivery_city",
//             filter: "agTextColumnFilter",
//           },
//           {
//             headerName: "Estado de Entrega",
//             field: "delivery_state",
//             filter: "agTextColumnFilter",
//           },
//           {
//             headerName: "CEP de Entrega",
//             field: "delivery_zipcode",
//             filter: "agTextColumnFilter",
//           },
//           {
//             headerName: "Número",
//             field: "delivery_number",
//             filter: "agTextColumnFilter",
//           },
//           {
//             headerName: "Complemento",
//             field: "delivery_complement",
//             filter: "agTextColumnFilter",
//           },
//         ]}
//         getMethod={async (getProps) => {
//           const userResponse = await getOrders({
//             page: getProps.page,
//             pageSize: getProps.pageSize,
//             filter: getProps.filter,
//           });
//           return {
//             data: userResponse?.data?.items || [],
//             total: userResponse?.data?.meta?.total || 0,
//           };
//         }}
//         initialData={initialData}
//         initialTotal={totalRows}
//       />
//       <RouteValidation
//         getSelectedRows={() => {
//           if (gridRef.current) {
//             return gridRef.current?.api?.getSelectedRows() as OrderType[];
//           }
//           return [];
//         }}
//       />
//     </>
//   );
// }

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
