"use client";

import { Card } from "antd";
import { DataTable } from "../datatables/Datatable";
import { getOrders, getOrdersByClientId } from "@/src/lib/orders/requests";

type ClientOrdersProps = {
  initialData: any[];
  totalRows: number;
  clientId: number | string;
};

export const ClientOrders = ({
  initialData,
  totalRows,
  clientId,
}: ClientOrdersProps) => {
  return (
    <Card className="h-[calc(100vh-250px)] shadow-sm overflow-y-auto">
      <DataTable
        className="h-[calc(100vh-400px)]"
        columnDefs={[
          {
            headerName: "ID",
            field: "order_id",
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "Cliente",
            field: "client_id",
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "Título",
            field: "title",
            filter: "agTextColumnFilter",
          },
          {
            headerName: "Descrição",
            field: "description",
            filter: "agTextColumnFilter",
          },
          {
            headerName: "NF",
            field: "invoice_number",
            filter: "agTextColumnFilter",
          },
          {
            headerName: "Urgência",
            field: "urgency",
            filter: "agTextColumnFilter",
          },

          {
            headerName: "Veículo",
            field: "vehicle_id",
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "Motorista",
            field: "driver_id",
            filter: "agNumberColumnFilter",
          },

          {
            headerName: "Quantidade",
            field: "quantity",
            filter: "agNumberColumnFilter",
          },

          {
            headerName: "Rua de Entrega",
            field: "delivery_street",
            filter: "agTextColumnFilter",
          },
          {
            headerName: "Bairro de Entrega",
            field: "delivery_district",
            filter: "agTextColumnFilter",
          },
          {
            headerName: "Cidade de Entrega",
            field: "delivery_city",
            filter: "agTextColumnFilter",
          },
          {
            headerName: "Estado de Entrega",
            field: "delivery_state",
            filter: "agTextColumnFilter",
          },
          {
            headerName: "CEP de Entrega",
            field: "delivery_zipcode",
            filter: "agTextColumnFilter",
          },
          {
            headerName: "Número",
            field: "delivery_number",
            filter: "agTextColumnFilter",
          },
          {
            headerName: "Complemento",
            field: "delivery_complement",
            filter: "agTextColumnFilter",
          },
        ]}
        getMethod={async (getProps) => {
          const userResponse = await getOrdersByClientId({
            page: getProps.page,
            pageSize: getProps.pageSize,
            filter: getProps.filter,
            client_id: clientId,
          });
          return {
            data: userResponse?.data?.items || [],
            total: userResponse?.data?.meta?.total || 0,
          };
        }}
        initialData={initialData}
        initialTotal={totalRows}
      />
    </Card>
  );
};
