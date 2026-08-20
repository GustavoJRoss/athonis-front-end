"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { routesApi } from "@/lib/mocks/api";
import type { RouteFormInput } from "@/lib/validation/route";
import type { RouteStop } from "@/types/domain";

const QUERY_KEY = ["routes"] as const;

export function useRoutes(search?: string) {
  const query = search?.trim().toLowerCase();
  return useQuery({
    queryKey: [...QUERY_KEY, query ?? ""],
    queryFn: () =>
      routesApi.list(
        query
          ? (route) =>
              route.name.toLowerCase().includes(query) || route.region.toLowerCase().includes(query)
          : undefined,
      ),
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RouteFormInput) => {
      const stops: RouteStop[] = [];
      return routesApi.create({ ...input, stops, startedAt: null });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<RouteFormInput> }) =>
      routesApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => routesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
