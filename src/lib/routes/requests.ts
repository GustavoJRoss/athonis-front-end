import { api } from "../api/axios";
import { RequestResponseData } from "../types";

export async function validateOrders({ orderIds }: { orderIds: number[] }) {
  let dataResponse: any;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.post(
      `/optimization-routes/validate-orders`,
      {
        orderIds,
      }
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

export async function generateRoute({ orderIds }: { orderIds: number[] }) {
  let dataResponse: any;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.post(
      `/optimization-routes/optimize`,
      {
        orderIds,
      }
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

export async function getRoutes({
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

    const responseData = await apiRequest.get(`/optimized-routes-history`);

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

export async function getRoutesById({ routeId }: { routeId: number | string }) {
  let dataResponse: RequestResponseData;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.get(
      `/optimized-routes-history/${routeId}`
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

export async function getStreetViewData({
  order_id,
}: {
  order_id: number | string;
}) {
  let dataResponse: RequestResponseData;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.get(`/street-view/order/${order_id}`);
    console.log({ responseData });
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
