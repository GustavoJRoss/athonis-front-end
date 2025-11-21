import { VehicleFormData } from "@/src/components/vehicles/dialogs/VehiclesDialog";
import { api } from "../api/axios";

export async function getVehicles({
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
    `/vehicles?page=${page}&limit=${pageSize}&name=${filter}`
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

export async function createVehicle({
  brand,
  model,
  name,
  year,
}: VehicleFormData) {
  const apiRequest = await api();

  const responseData = await apiRequest.post(`/vehicles`, {
    brand,
    model,
    name,
    year,
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

export async function updateVehicle({
  brand,
  model,
  name,
  vehicle_id,
  year,
}: VehicleFormData) {
  const apiRequest = await api();

  const responseData = await apiRequest.patch(`/vehicles/${vehicle_id}`, {
    brand,
    model,
    name,
    year,
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

export async function deleteVehicle({ id }: { id: number }) {
  const apiRequest = await api();
  const responseData = await apiRequest.delete(`vehicles/${id}`);

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
