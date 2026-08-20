"use client";

import { useQuery } from "@tanstack/react-query";
import { driversApi, ordersApi, routesApi, vehiclesApi } from "@/lib/mocks/api";

export function useAnalyticsData() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const [orders, routes, drivers, vehicles] = await Promise.all([
        ordersApi.list(),
        routesApi.list(),
        driversApi.list(),
        vehiclesApi.list(),
      ]);
      return { orders, routes, drivers, vehicles };
    },
  });
}
