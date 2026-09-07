"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customersApi } from "@/lib/api/resources";
import type { Customer } from "@/types/domain";
import type { CustomerFormInput } from "@/lib/validation/customer";
import { digitsInclude } from "@/lib/utils/masks";

const QUERY_KEY = ["customers"] as const;

export function useCustomers(search?: string) {
  const query = search?.trim().toLowerCase();
  return useQuery({
    queryKey: [...QUERY_KEY, query ?? ""],
    queryFn: () =>
      customersApi.list(
        query
          ? (customer) =>
              customer.name.toLowerCase().includes(query) ||
              customer.city.toLowerCase().includes(query) ||
              digitsInclude(customer.document, query) ||
              digitsInclude(customer.phone, query)
          : undefined,
      ),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CustomerFormInput) =>
      customersApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CustomerFormInput }) =>
      customersApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export type { Customer };
