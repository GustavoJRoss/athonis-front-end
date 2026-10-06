"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vehiclesApi } from "@/lib/api/resources";
import type { VehicleFormInput } from "@/lib/validation/vehicle";

const QUERY_KEY = ["vehicles"] as const;

export function useVehicles(search?: string) {
  const query = search?.trim().toLowerCase();
  return useQuery({
    queryKey: [...QUERY_KEY, query ?? ""],
    queryFn: () =>
      vehiclesApi.list(
        query
          ? (vehicle) =>
              // O nome e o identificador principal do veiculo: procurar por
              // ele tem de funcionar.
              vehicle.name.toLowerCase().includes(query) ||
              vehicle.plate.toLowerCase().includes(query) ||
              vehicle.model.toLowerCase().includes(query) ||
              vehicle.brand.toLowerCase().includes(query)
          : undefined,
      ),
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VehicleFormInput) => vehiclesApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: VehicleFormInput }) =>
      vehiclesApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehiclesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
