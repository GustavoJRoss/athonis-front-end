import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export type LatLng = {
  lat: number;
  lng: number;
};

export interface GoogleMapProps {
  center: LatLng;
  zoom?: number;
  markers?: LatLng[];
  height?: number | string;
}

export function GoogleMap({
  center,
  zoom = 13,
  markers = [],
  height = 400,
}: GoogleMapProps) {
  return (
    <APIProvider apiKey={process.env.GOOGLE_GEOCODING_API_KEY || ""}>
      <div style={{ width: "100%", height }}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          style={{ width: "100%", height: "100%" }}
          gestureHandling="greedy"
          disableDefaultUI
        >
          {markers.map((position, index) => (
            <Marker key={index} position={position} />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
