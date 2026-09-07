"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "@/lib/api/resources";
import type { CompanyFormInput } from "@/lib/validation/company";

const QUERY_KEY = ["company"] as const;

export function useCompany() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => companyApi.get(),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CompanyFormInput) => companyApi.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      // O depósito e os custos entram na próxima otimização.
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}
