"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { driversApi } from "@/lib/api/resources";
import type { DriverFormInput } from "@/lib/validation/driver";

const QUERY_KEY = ["drivers"] as const;

export function useDrivers(search?: string) {
  const query = search?.trim().toLowerCase();
  return useQuery({
    queryKey: [...QUERY_KEY, query ?? ""],
    queryFn: () =>
      driversApi.list(
        query
          ? (driver) =>
              driver.name.toLowerCase().includes(query) ||
              driver.document.includes(query) ||
              driver.cnh.includes(query)
          : undefined,
      ),
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DriverFormInput) =>
      driversApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DriverFormInput }) =>
      driversApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => driversApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
