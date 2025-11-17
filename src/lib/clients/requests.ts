import { api } from "../api/axios";

export async function getClients({
  page = 1,
  pageSize = 10,
  filter = "",
}: {
  page: number;
  pageSize: number;
  filter?: string;
}) {
  const apiRequest = await api();

  const { data } = await apiRequest.get(
    `/clients?page=${page}&limit=${pageSize}&name=${filter}&sort_by=created_at&order=DESC`
  );

  return data;
}

export async function createClient({
  name,
  trade_name,
  document,
  state_registration,
  email,
  phone,
  type,
  street,
  neighborhood,
  city,
  state,
  zip_code,
  number,
  complement,
  observations,
}: {
  name: string;
  trade_name: string;
  document: string;
  state_registration: string;
  email: string;
  phone: string;
  type: "F" | "J";
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  number: string;
  complement: string;
  observations: string;
}) {
  const apiRequest = await api();

  try {
    const responseData = await apiRequest.post(`/clients`, {
      name,
      trade_name,
      document,
      state_registration,
      email,
      phone,
      type,
      street,
      neighborhood,
      city,
      state,
      zip_code,
      number,
      complement,
      observations,
    });

    return responseData?.data as { success: boolean; data: any };
  } catch (error) {
    console.error(error);
  }
}
