import OrderDetails from "@/src/components/orders/OrderDetails";
import { getOrdersById } from "@/src/lib/orders/requests";

export default async function PageOrderDeatils({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const orderResponse = await getOrdersById({ orderId });
  console.log({ orderResponse, orderId });
  if (orderResponse?.success && orderResponse?.data) {
    return <OrderDetails order={orderResponse?.data} />;
  }
}
