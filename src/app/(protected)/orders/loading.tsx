import DatatableFallback from "@/src/components/fallbacks/DatatableFallback";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { PackageIcon } from "lucide-react";

export default function LoadingPage() {
  return (
    <>
      <HeaderPage
        title="Pedidos"
        icon={PackageIcon}
        backTo={{ link: "/home", title: "Voltar para página inicial." }}
      />
      <DatatableFallback />
    </>
  );
}
