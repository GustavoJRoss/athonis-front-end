"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { routesApi } from "@/lib/api/resources";

const QUERY_KEY = ["routes"] as const;

export function useRoutes(search?: string) {
  const query = search?.trim().toLowerCase();
  return useQuery({
    queryKey: [...QUERY_KEY, query ?? ""],
    queryFn: () =>
      routesApi.list(
        query
          ? (route) =>
              route.name.toLowerCase().includes(query) ||
              route.region.toLowerCase().includes(query) ||
              route.driverName.toLowerCase().includes(query)
          : undefined,
      ),
  });
}

/**
 * Rotas não são cadastradas à mão: elas nascem da otimização de um conjunto
 * de pedidos. O retorno traz os pedidos que ficaram de fora, com o motivo,
 * e avisa quando o resultado é simulado (sem a API do Google).
 */
export function useOptimizeRoutes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderIds: string[]) => routesApi.optimize(orderIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

/** Checa a elegibilidade dos pedidos antes de gastar chamada de otimização. */
export function useValidateOrdersForRoute() {
  return useMutation({
    mutationFn: (orderIds: string[]) => routesApi.validate(orderIds),
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => routesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
