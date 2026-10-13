"use client";

import { useQuery } from "@tanstack/react-query";
import { fieldAnalyticsApi } from "@/lib/api/resources";
import { formatDateString } from "@/lib/utils/date";

/** Período de `days` dias terminando hoje, no formato que `/analytics/*` espera. */
export function rangeForDays(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - (days - 1));
  return { from: formatDateString(from), to: formatDateString(to) };
}

/**
 * Tudo o que o painel de execução em campo mostra, numa consulta só: as
 * cinco chamadas dependem do mesmo período e não faz sentido a tela exibir
 * metade delas.
 */
export function useFieldAnalytics(days: number) {
  return useQuery({
    queryKey: ["field-analytics", days],
    queryFn: async () => {
      const range = rangeForDays(days);
      const [overview, drivers, regions, occurrences, routes] = await Promise.all([
        fieldAnalyticsApi.overview(range),
        fieldAnalyticsApi.drivers(range),
        fieldAnalyticsApi.regions(range),
        fieldAnalyticsApi.occurrences(range),
        fieldAnalyticsApi.routes(range),
      ]);
      return { overview, drivers, regions, occurrences, routes };
    },
  });
}

/**
 * `refetchMs` serve à rota em andamento: o trajeto cresce enquanto a tela
 * está aberta. Uma rota encerrada não muda, e não precisa.
 */
export function useRouteComparison(routeId: string | null, refetchMs?: number) {
  return useQuery({
    queryKey: ["route-comparison", routeId],
    queryFn: () => fieldAnalyticsApi.comparison(routeId as string),
    enabled: !!routeId,
    refetchInterval: refetchMs,
  });
}

/** Intervalo de atualização da tela ao vivo. O aplicativo envia o rastro em lotes de até um minuto. */
export const LIVE_REFRESH_MS = 30_000;

export function useLiveRoutes() {
  return useQuery({
    queryKey: ["live-routes"],
    queryFn: () => fieldAnalyticsApi.live(),
    refetchInterval: LIVE_REFRESH_MS,
  });
}
