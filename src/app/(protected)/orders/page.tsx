import OrdersPage from "@/src/components/orders/OrdersPage";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { getOrders } from "@/src/lib/orders/requests";
import { PackageIcon } from "lucide-react";

export default async function PageOrders() {
  const ordersResponse = await getOrders({
    page: 1,
    pageSize: 10,
  });

  return (
    <>
      <HeaderPage
        title="Pedidos"
        icon={PackageIcon}
        backTo={{ link: "/home", title: "Voltar para página inicial." }}
      />
      <OrdersPage
        initialData={ordersResponse?.data?.items || []}
        totalRows={ordersResponse?.data?.meta?.total || 0}
      />
    </>
  );
}
