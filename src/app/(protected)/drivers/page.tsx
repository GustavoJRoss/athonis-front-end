import DriversPage from "@/src/components/drivers/DriversPage";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { getDrivers } from "@/src/lib/drivers/requests";
import { UsersIcon } from "lucide-react";

export default async function ClientPage() {
  const userResponse = await getDrivers({
    page: 1,
    pageSize: 10,
  });
  console.log(userResponse.data);
  return (
    <>
      <HeaderPage
        title="Motoristas"
        icon={UsersIcon}
        backTo={{ link: "/home", title: "Voltar para página inicial." }}
      />
      <DriversPage
        initialData={userResponse?.data?.items || []}
        totalRows={userResponse?.data?.meta?.total || 0}
      />
    </>
  );
}
