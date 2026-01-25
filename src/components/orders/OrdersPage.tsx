"use client";

import { DataTable, DataTableRefProps } from "../datatables/Datatable";
import { useRef } from "react";
import { DialogOpenRef } from "../types/types";
import { IconAction } from "../utils/IconAction";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { getOrders } from "@/src/lib/orders/requests";
import { OrderDialog } from "./dialogs/OrdersDialogs";
import { OrderType } from "../types/orders";
import { DeleteOrderDialog } from "./dialogs/DeleteOrderDialog";
import { Button, Typography } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  return (
    <>
      <DataTable
        ref={dataTableRef}
        className="h-[calc(100vh-300px)]"
        headerActions={
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => orderDialogRef.current?.open("create")}
          >
            Criar Pedido
          </Button>
        }
        onRowClicked={(e) =>
          router.push(`/orders/${e?.data?.order_id}/details`)
        }
        columnDefs={[
          {
            headerName: "Código",
            field: "order_id",
            filter: "agNumberColumnFilter",
            cellClass: "text-center",
            maxWidth: 120,
          },
          {
            headerName: "Título",
            field: "title",
            filter: "agTextColumnFilter",
          },

          {
            headerName: "Cliente",
            field: "client.name",
            filter: "agNumberColumnFilter",
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
            field: "vehicle.name",
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "Motorista",
            field: "driver.name",
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
