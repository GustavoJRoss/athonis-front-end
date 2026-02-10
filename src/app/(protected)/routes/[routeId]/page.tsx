import RouteDetails from "@/src/components/routes/RouteDetails";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { getRoutesById } from "@/src/lib/routes/requests";
import { MapPinnedIcon } from "lucide-react";

export default async function PageRouteDetail({
  params,
}: {
  params: Promise<{ routeId: string }>;
}) {
  const { routeId } = await params;

  const routeResponse = await getRoutesById({ routeId });
  console.log({ routeResponse });
  if (routeResponse.success) {
    return (
      <>
        <HeaderPage
          title="Detalhes da Rota"
          icon={MapPinnedIcon}
          backTo={{ link: "/routes", title: "Voltar para página de rotas." }}
        />
        <RouteDetails routeInfo={routeResponse?.data} />
      </>
    );
  }

  throw new Error("Rota não encontrada");
}
