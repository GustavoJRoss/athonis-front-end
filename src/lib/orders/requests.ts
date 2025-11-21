import { OrderFormData } from "@/src/components/orders/dialogs/OrdersDialogs";
import { api } from "../api/axios";

export async function getOrders({
  page = 1,
  pageSize = 10,
  filter = "",
}: {
  page: number;
  pageSize: number;
  filter?: string;
}) {
  const apiRequest = await api();

  const responseData = await apiRequest.get(
    `/orders?page=${page}&limit=${pageSize}&title=${filter}&sort_by=title&order=DESC`
  );

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

  if (responseData?.status === 200 || responseData?.status === 201) {
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

export async function deleteOrder({ id }: { id: number }) {
  const apiRequest = await api();
  const responseData = await apiRequest.delete(`orders/${id}`);

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
