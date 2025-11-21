"use client";

import { DataTable, DataTableRefProps } from "../datatables/Datatable";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { DialogOpenRef } from "../types/types";
import { IconAction } from "../utils/IconAction";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { getOrders } from "@/src/lib/orders/requests";
import { OrderDialog } from "./dialogs/OrdersDialogs";
import { OrderType } from "../types/orders";
import { DeleteOrderDialog } from "./dialogs/DeleteOrderDialog";

type OrdersPageProps = {
  initialData: any[];
  totalRows: number;
};

export default function OrdersPage({
  initialData,
  totalRows,
}: OrdersPageProps) {
  const dataTableRef = useRef<DataTableRefProps>(null);
  const orderDialogRef = useRef<DialogOpenRef<OrderType>>(null);
  const deleteClientRef = useRef<any>(null);

  return (
    <>
      <DataTable
        ref={dataTableRef}
        headerActions={
          <Button onClick={() => orderDialogRef.current?.open("create")}>
            Criar Pedido
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
                    onClick={() => deleteClientRef.current.open(data.order_id)}
                  />
                  <IconAction
                    icon={PencilIcon}
                    text="Editar"
                    onClick={() => {
                      orderDialogRef.current?.open("edit", data);
                    }}
                  />
                  <IconAction
                    icon={EyeIcon}
                    text="Visualizar"
                    onClick={() => orderDialogRef.current?.open("view", data)}
                  />
                </div>
              );
            },
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
      <OrderDialog
        ref={orderDialogRef}
        onSubmitSuccess={() => dataTableRef.current?.fetchData()}
      />
      <DeleteOrderDialog
        ref={deleteClientRef}
        onSubmitSuccess={() => dataTableRef.current?.fetchData()}
      />
    </>
  );
}
