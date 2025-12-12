import DatatableFallback from "@/src/components/fallbacks/DatatableFallback";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { PackageIcon, UsersIcon } from "lucide-react";

export default function LoadingPage() {
  return (
    <>
      <HeaderPage title="Veículos" icon={PackageIcon} />
      <DatatableFallback />
    </>
  );
}
