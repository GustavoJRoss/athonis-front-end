import HomePage from "@/src/components/home/HomePage";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { LayoutGridIcon } from "lucide-react";

export default function HomePageLayout() {
  return (
    <>
      <HeaderPage title="Página Inicial" icon={LayoutGridIcon} />
      <HomePage />
    </>
  );
}
