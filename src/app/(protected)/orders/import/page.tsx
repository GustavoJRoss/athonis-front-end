import ImportsPage from "@/src/components/orders/ImportsPage";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { FolderUpIcon } from "lucide-react";

export default async function PageImports() {
  return (
    <>
      <HeaderPage
        title="Importar Pedidos"
        icon={FolderUpIcon}
        backTo={{ link: "/orders", title: "Voltar para a tela de pedidos" }}
      />
      <ImportsPage />
    </>
  );
}
