import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface RoutePolylineProps {
  path: google.maps.LatLngLiteral[];
}

export function RoutePolyline({ path }: RoutePolylineProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || path.length === 0) return;

    const polyline = new google.maps.Polyline({
      path,
      strokeColor: "#1677ff",
      strokeOpacity: 0.9,
      strokeWeight: 4,
      geodesic: true,
    });

    polyline.setMap(map);

    return () => {
      polyline.setMap(null);
    };
  }, [map, path]);

  return null;
}
