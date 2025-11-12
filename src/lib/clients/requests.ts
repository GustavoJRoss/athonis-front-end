import { apiClient } from "../utils";

export async function getClients({
  page = 1,
  pageSize = 10,
  filter = "",
}: {
  page: number;
  pageSize: number;
  filter?: string;
}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(pageSize),
    ...(filter ? { filter } : {}),
  });
  const data = await apiClient.get<ClientResponse[]>(
    `/api/clients?${params.toString()}`
  );

  return data;
}
