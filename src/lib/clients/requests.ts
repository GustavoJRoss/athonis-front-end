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
  notes,
}: {
  name: string;
  trade_name?: string;
  document: string;
  state_registration?: string;
  email: string;
  phone: string;
  type: "F" | "J";
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  number: string;
  complement?: string;
  notes?: string;
}) {
  const apiRequest = await api();

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
    notes,
  });

  if (responseData?.status === 200) {
    return {
      success: true,
      data: responseData?.data,
    };
  } else {
    return {
      success: false,
      message: responseData?.statusText,
    };
  }
}

export async function updateClient({
  clientId,
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
  notes,
}: {
  clientId?: number;
  name: string;
  trade_name?: string;
  document: string;
  state_registration?: string;
  email: string;
  phone: string;
  type: "F" | "J";
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  number: string;
  complement?: string;
  notes?: string;
}) {
  const apiRequest = await api();

  const responseData = await apiRequest.patch(`/clients/${clientId}`, {
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
    observations: notes,
  });
  if (responseData?.status === 200) {
    return {
      success: true,
      data: responseData?.data,
    };
  } else {
    return {
      success: false,
      message: responseData?.statusText,
    };
  }
}

export async function deleteClient({ id }: { id: number }) {
  const apiRequest = await api();
  const responseData = await apiRequest.delete(`clients/${id}`);

  if (responseData?.status === 200) {
    return {
      success: true,
      data: responseData?.data,
    };
  } else {
    return {
      success: false,
      message: responseData?.statusText,
    };
  }
}
