import { OrderFormData } from "@/src/components/orders/dialogs/OrdersDialogs";
import { api } from "../api/axios";
import { RequestResponseData } from "../types";

export async function getOrders({
  page = 1,
  pageSize = 10,
  filter = "",
}: {
  page: number;
  pageSize: number;
  filter?: string;
}) {
  let dataResponse: RequestResponseData;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.get(
      `/orders?page=${page}&limit=${pageSize}&title=${filter}&sort_by=title&order=DESC`
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

export async function createOrder({
  client_id,
  delivery_city,
  delivery_district,
  delivery_number,
  delivery_state,
  delivery_street,
  delivery_zipcode,
  driver_id,
  quantity,
  title,
  urgency,
  vehicle_id,
  delivery_complement,
  description,
  invoice_number,
}: OrderFormData) {
  let dataResponse: RequestResponseData;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.post(`/orders`, {
      client_id,
      delivery_city,
      delivery_district,
      delivery_number,
      delivery_state,
      delivery_street,
      delivery_zipcode,
      driver_id,
      quantity,
      title,
      urgency,
      vehicle_id,
      delivery_complement,
      description,
      invoice_number,
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

export async function updateOrder({
  client_id,
  delivery_city,
  delivery_district,
  delivery_number,
  delivery_state,
  delivery_street,
  delivery_zipcode,
  driver_id,
  quantity,
  title,
  urgency,
  vehicle_id,
  delivery_complement,
  description,
  invoice_number,
  order_id,
}: OrderFormData) {
  let dataResponse: RequestResponseData;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.patch(`/orders/${order_id}`, {
      client_id,
      delivery_city,
      delivery_district,
      delivery_number,
      delivery_state,
      delivery_street,
      delivery_zipcode,
      driver_id,
      quantity,
      title,
      urgency,
      vehicle_id,
      delivery_complement,
      description,
      invoice_number,
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

export async function deleteOrder({ id }: { id: number }) {
  let dataResponse: RequestResponseData;

  try {
    const apiRequest = await api();
    const responseData = await apiRequest.delete(`orders/${id}`);

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
