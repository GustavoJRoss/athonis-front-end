"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/resources";
import type { OrderFormInput } from "@/lib/validation/order";

const QUERY_KEY = ["orders"] as const;

export function useOrders(search?: string) {
  const query = search?.trim().toLowerCase();
  return useQuery({
    queryKey: [...QUERY_KEY, query ?? ""],
    queryFn: () =>
      ordersApi.list(
        query
          ? (order) =>
              order.id.toLowerCase().includes(query) ||
              order.destination.toLowerCase().includes(query)
          : undefined,
      ),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: OrderFormInput) => ordersApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: OrderFormInput }) =>
      ordersApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useImportOrders() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => ordersApi.import(formData),
    onSuccess: (result) => {
      // Só há pedidos novos para mostrar se algo foi de fato importado.
      if (result.quantidadeSucessos > 0) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      }
    },
  });
}
