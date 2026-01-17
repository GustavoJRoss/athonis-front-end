import DatatableFallback from "@/src/components/fallbacks/DatatableFallback";
import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { permanentRedirect } from "next/navigation";

export default async function LoadingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const paramsData = await params;
  permanentRedirect(`/orders/${paramsData?.orderId}/details`);
}
