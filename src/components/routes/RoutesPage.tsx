"use client";

import { DataTable, DataTableRefProps } from "../datatables/Datatable";
import { useRef } from "react";
import { getOrders } from "@/src/lib/orders/requests";
import { AgGridReact } from "ag-grid-react";
import RouteValidation from "./RouteValidation";
import { OrderType } from "../types/orders";

type RoutesPageProps = {
  initialData: any[];
  totalRows: number;
};

export default function RoutesPage({
  initialData,
  totalRows,
}: RoutesPageProps) {
  const dataTableRef = useRef<DataTableRefProps>(null);
  const gridRef = useRef<AgGridReact>(null);

  return (
    <>
      <DataTable
        ref={dataTableRef}
        gridRef={gridRef}
        rowSelection="multiple"
        columnDefs={[
          {
            headerName: "",
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            pinned: true,
          },
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
          const userResponse = await getOrders({
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
      <RouteValidation
        getSelectedRows={() => {
          if (gridRef.current) {
            return gridRef.current?.api?.getSelectedRows() as OrderType[];
          }
          return [];
        }}
      />
    </>
  );
}
