"use client";

import { useQuery } from "@tanstack/react-query";
import { customersApi, driversApi, ordersApi, routesApi, vehiclesApi } from "@/lib/api/resources";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [orders, routes, drivers, vehicles, customers] = await Promise.all([
        ordersApi.list(),
        routesApi.list(),
        driversApi.list(),
        vehiclesApi.list(),
        customersApi.list(),
      ]);
      return { orders, routes, drivers, vehicles, customers };
    },
  });
}
