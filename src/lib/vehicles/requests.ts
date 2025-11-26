import { VehicleFormData } from "@/src/components/vehicles/dialogs/VehiclesDialog";
import { api } from "../api/axios";
import { RequestResponseData } from "../types";

export async function getVehicles({
  page = 1,
  pageSize = 10,
  filter = "",
}: {
  page: number;
  pageSize: number;
  filter?: string;
}) {
  let dataResponse: RequestResponseData;
  console.log({ page, pageSize });
  try {
    const apiRequest = await api();

    const responseData = await apiRequest.get(
      `/vehicles?page=${page}&limit=${pageSize}&name=${filter}`
    );
    console.log({responseData})
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

export async function createVehicle({
  brand,
  model,
  name,
  year,
}: VehicleFormData) {
  const apiRequest = await api();

  let dataResponse: RequestResponseData;

  try {
    const responseData = await apiRequest.post(`/vehicles`, {
      brand,
      model,
      name,
      year,
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

export async function updateVehicle({
  brand,
  model,
  name,
  vehicle_id,
  year,
}: VehicleFormData) {
  let dataResponse: RequestResponseData;

  try {
    const apiRequest = await api();

    const responseData = await apiRequest.patch(`/vehicles/${vehicle_id}`, {
      brand,
      model,
      name,
      year,
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

export async function deleteVehicle({ id }: { id: number }) {
  let dataResponse: RequestResponseData;

  try {
    const apiRequest = await api();
    const responseData = await apiRequest.delete(`vehicles/${id}`);

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
