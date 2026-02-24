import { api } from "../api/axios";
import { RequestResponseClientData, RequestResponseData } from "../types";

export async function getClients({
  page = 1,
  pageSize = 10,
  filter = "",
}: {
  page: number;
  pageSize: number;
  filter?: string;
}) {
  let dataResponse: RequestResponseData<any>;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.get(
      `/clients?page=${page}&limit=${pageSize}&name=${filter}&sort_by=created_at&order=DESC`
    );

    dataResponse = {
      success: true,
      data: responseData?.data,
    };
  } catch (error: any) {
    dataResponse = {
      success: false,
      message: error?.message,
    };
  }

  return dataResponse;
}

export async function getClientById({
  client_id,
}: {
  client_id: number | string;
}) {
  let dataResponse: RequestResponseClientData;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.get(`/clients/${client_id}`);

    dataResponse = {
      success: true,
      data: responseData?.data,
    };
  } catch (error: any) {
    dataResponse = {
      success: false,
      message: error?.message,
    };
  }

  return dataResponse;
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
  let dataResponse: RequestResponseData<any>;

  try {
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

    dataResponse = {
      success: true,
      data: responseData?.data,
    };
  } catch (error: any) {
    dataResponse = {
      success: false,
      message: error?.message,
    };
  }

  return dataResponse;
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
  let dataResponse: RequestResponseData<any>;

  try {
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
      notes,
    });
    dataResponse = {
      success: true,
      data: responseData?.data,
    };
  } catch (error: any) {
    dataResponse = {
      success: false,
      message: error?.message,
    };
  }

  return dataResponse;
}

export async function deleteClient({ id }: { id: number }) {
  let dataResponse: RequestResponseData<any>;

  try {
    const apiRequest = await api();
    const responseData = await apiRequest.delete(`clients/${id}`);

    dataResponse = {
      success: true,
      data: responseData?.data,
    };
  } catch (error: any) {
    dataResponse = {
      success: false,
      message: error?.message,
    };
  }

  return dataResponse;
}
