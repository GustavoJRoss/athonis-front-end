import RouteDetails from "@/src/components/routes/RouteDetails";
import { getRoutesById } from "@/src/lib/routes/requests";

export default async function PageRouteDetail({
  params,
}: {
  params: Promise<{ routeId: string }>;
}) {
  const { routeId } = await params;

  const routeResponse = await getRoutesById({ routeId });
  console.log({ routeResponse });
  if (routeResponse.success) {
    return <RouteDetails routeInfo={routeResponse.data} />;
  }

  throw new Error("Rota não encontrada");
}
