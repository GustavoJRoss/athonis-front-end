import { useEffect, useState } from "react";

export function useStreetView(stops: any[], getStreetViewData: any) {
  const [streetViewInfo, setStreetViewInfo] = useState<Record<number, any>>({});

  useEffect(() => {
    async function fetchAll() {
      const result: Record<number, any> = {};

      for (const stop of stops) {
        try {
          const data = await getStreetViewData(stop.orderId);
          result[stop.orderId] = data;
        } catch (err) {
          console.error("Erro ao buscar street view", err);
          result[stop.orderId] = null;
        }
      }

      setStreetViewInfo(result);
    }

    fetchAll();
  }, [stops, getStreetViewData]);

  return streetViewInfo;
}
