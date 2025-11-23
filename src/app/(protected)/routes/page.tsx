import RoutesPage from "@/src/components/routes/RoutesPage";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { getOrders } from "@/src/lib/orders/requests";
import { MapPinnedIcon } from "lucide-react";

export default async function PageRoutes() {
  const ordersResponse = await getOrders({
    page: 1,
    pageSize: 10,
  });

  return (
    <>
      <HeaderPage
        title="Rotas"
        icon={MapPinnedIcon}
        backTo={{ link: "/home", title: "Voltar para página inicial." }}
      />
      <RoutesPage
        initialData={ordersResponse?.data?.items || []}
        totalRows={ordersResponse?.data?.meta?.total || 0}
      />
    </>
  );
}
