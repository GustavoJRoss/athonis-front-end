import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";
import { RoutePolyline } from "./RoutePolyline";

export interface Stop {
  orderId: number;
  clientName: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  estimatedArrivalTime: string;
  estimatedDuration: number;
}

export interface RouteData {
  vehicleId: number;
  vehicleName: string;
  driverId: number;
  driverName: string;
  totalDistance: number;
  totalDuration: number;
  stops: Stop[];
  startLocation: {
    latitude: number;
    longitude: number;
  };
  endLocation: {
    latitude: number;
    longitude: number;
  };
}

function FitBounds({ path }: { path: google.maps.LatLngLiteral[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || path.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds);
  }, [map, path]);

  return null;
}

interface Props {
  route: RouteData;
  height?: number | string;
}

export function RouteMap({ route, height = 450 }: Props) {
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  const start = {
    lat: route.startLocation.latitude,
    lng: route.startLocation.longitude,
  };

  const end = {
    lat: route.endLocation.latitude,
    lng: route.endLocation.longitude,
  };

  const stops = route.stops.map((stop) => ({
    lat: stop.coordinates.latitude,
    lng: stop.coordinates.longitude,
  }));

  const path = useMemo(() => [start, ...stops, end], [route]);

  return (
    <APIProvider apiKey={process.env.GOOGLE_GEOCODING_API_KEY || ""}>
      <div style={{ width: "100%", height }}>
        <Map
          defaultCenter={start}
          defaultZoom={12}
          style={{ width: "100%", height: "100%" }}
          disableDefaultUI
          gestureHandling="greedy"
        >
          <FitBounds path={path} />

          {/* ROTA */}
          <RoutePolyline path={path} />

          {/* ORIGEM */}
          <Marker position={start} title="Origem" />

          {/* PARADAS */}
          {route.stops.map((stop) => (
            <Marker
              key={stop.orderId}
              position={{
                lat: stop.coordinates.latitude,
                lng: stop.coordinates.longitude,
              }}
              onClick={() => setSelectedStop(stop)}
            />
          ))}

          {/* DESTINO */}
          <Marker position={end} title="Destino" />

          {selectedStop && (
            <InfoWindow
              position={{
                lat: selectedStop.coordinates.latitude,
                lng: selectedStop.coordinates.longitude,
              }}
              onCloseClick={() => setSelectedStop(null)}
            >
              <div>
                <strong>{selectedStop.clientName}</strong>
                <p>{selectedStop.address}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
