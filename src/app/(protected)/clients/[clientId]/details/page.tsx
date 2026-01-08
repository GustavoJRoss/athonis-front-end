import { ClientDetails } from "@/src/components/clients/ClientDetails";
import { getClientById } from "@/src/lib/clients/requests";

export default async function ClientDetailsPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const paramsData = await params;

  console.log("Client ID:", paramsData.clientId);

  const clientResponse = await getClientById({
    client_id: paramsData.clientId,
  });

  if (clientResponse.success && clientResponse.data) {
    return <ClientDetails client={clientResponse?.data} />;
  }
}
