import DatatableFallback from "@/src/components/fallbacks/DatatableFallback";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { UsersIcon } from "lucide-react";
import { permanentRedirect } from "next/navigation";

export default async function LoadingPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const paramsData = await params;
  console.log({ paramsData });
  permanentRedirect(`/clients/${paramsData.clientId}/details`);
}
