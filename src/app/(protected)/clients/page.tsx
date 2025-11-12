import ClientsPage from "@/src/components/clients/ClientsPage";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { getClients } from "@/src/lib/clients/requests";
import { UsersIcon } from "lucide-react";

export default async function ClientPage() {
  const userResponse = await getClients({
    page: 1,
    pageSize: 10,
  });

  console.log(userResponse);

  if (!userResponse.error) {
    return (
      <>
        <HeaderPage
          title="Clientes"
          icon={UsersIcon}
          backTo={{ link: "/home", title: "Voltar para página inicial." }}
        />
        <ClientsPage
          initialData={userResponse?.items ?? []}
          totalRows={userResponse.meta?.total ?? 0}
        />
      </>
    );
  }
}
