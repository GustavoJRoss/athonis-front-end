import { DriverFormData } from "@/src/components/drivers/dialogs/DriversDialog";
import { api } from "../api/axios";
import { RequestResponseData } from "../types";

export async function getDrivers({
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
      `/drivers?page=${page}&limit=${pageSize}&name=${filter}&sort_by=name&order=ASC`
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

export async function createDriver({
  name,
  document,
  birth_date,
  gender,
}: DriverFormData) {
  let dataResponse: RequestResponseData<any>;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.post(`/drivers`, {
      name,
      document,
      gender,
      birth_date,
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

export async function updateDriver({
  name,
  document,
  birth_date,
  gender,
  driver_id,
}: DriverFormData) {
  let dataResponse: RequestResponseData<any>;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.patch(`/drivers/${driver_id}`, {
      name,
      document,
      birth_date,
      gender,
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

export async function deleteDriver({ id }: { id: number }) {
  let dataResponse: RequestResponseData<any>;

  try {
    const apiRequest = await api();
    const responseData = await apiRequest.delete(`drivers/${id}`);

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
