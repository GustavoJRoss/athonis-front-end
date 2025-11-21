import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import VehiclesPage from "@/src/components/vehicles/VehiclesPage";
import { getVehicles } from "@/src/lib/vehicles/requests";
import { PackageIcon } from "lucide-react";

export default async function PageVehicles() {
  const vehiclesResponse = await getVehicles({
    page: 1,
    pageSize: 10,
  });

  return (
    <>
      <HeaderPage
        title="Veículos"
        icon={PackageIcon}
        backTo={{ link: "/home", title: "Voltar para página inicial." }}
      />
      <VehiclesPage
        initialData={vehiclesResponse?.data?.items || []}
        totalRows={vehiclesResponse?.data?.meta?.total || 0}
      />
    </>
  );
}
