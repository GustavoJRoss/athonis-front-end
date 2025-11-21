import { DriverFormData } from "@/src/components/drivers/dialogs/DriversDialog";
import { api } from "../api/axios";

export async function getDrivers({
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
    `/drivers?page=${page}&limit=${pageSize}&name=${filter}&sort_by=name&order=ASC`
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

export async function createDriver({
  name,
  document,
  birth_date,
  gender,
}: DriverFormData) {
  const apiRequest = await api();

  const responseData = await apiRequest.post(`/drivers`, {
    name,
    document,
    gender,
    birth_date,
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

export async function updateDriver({
  name,
  document,
  birth_date,
  gender,
  driver_id,
}: DriverFormData) {
  const apiRequest = await api();

  const responseData = await apiRequest.patch(`/drivers/${driver_id}`, {
    name,
    document,
    birth_date,
    gender,
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

export async function deleteDriver({ id }: { id: number }) {
  const apiRequest = await api();
  const responseData = await apiRequest.delete(`drivers/${id}`);

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
