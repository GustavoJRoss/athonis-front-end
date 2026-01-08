import { ClientOrders } from "@/src/components/clients/ClientOrders";
import { getOrders, getOrdersByClientId } from "@/src/lib/orders/requests";

export default async function ClientOrdersPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const paramsData = await params;

  const ordersResponse = await getOrdersByClientId({
    page: 1,
    pageSize: 10,
    client_id: paramsData.clientId,
  });

  return (
    <ClientOrders
      initialData={ordersResponse?.data?.items || []}
      totalRows={ordersResponse?.data?.meta?.total || 0}
      clientId={paramsData.clientId}
    />
  );
}
