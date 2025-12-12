import DatatableFallback from "@/src/components/fallbacks/DatatableFallback";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { UsersIcon } from "lucide-react";

export default function LoadingPage() {
  return (
    <>
      <HeaderPage title="Motoristas" icon={UsersIcon} />
      <DatatableFallback />
    </>
  );
}
