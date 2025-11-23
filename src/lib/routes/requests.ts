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
