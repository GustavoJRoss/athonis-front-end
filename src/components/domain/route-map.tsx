import { cn } from "@/lib/utils/cn";
import { EmptyState } from "@/components/ui/state";
import { MapPin } from "lucide-react";

/**
 * Contrato de dados da camada de mapa — mockado com SVG hoje, mas desenhado
 * para ser trocado por uma integração real (Google Maps, Mapbox...) sem
 * alterar quem consome `RouteMap`: basta outro componente aceitando os
 * mesmos `MapPoint[]`.
 */
export type MapPoint = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  completed?: boolean;
};

export type RouteMapProps = {
  points: MapPoint[];
  className?: string;
};

const WIDTH = 640;
const HEIGHT = 420;
const PADDING = 36;

export function RouteMap({ points, className }: RouteMapProps) {
  if (points.length === 0) {
    return (
      <div className={cn("flex items-center justify-center rounded-lg bg-surface-muted", className)}>
        <EmptyState
          icon={MapPin}
          title="Sem paradas para exibir"
          description="Esta rota ainda não tem pontos de parada definidos."
        />
      </div>
    );
  }

  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  function project(lat: number, lng: number) {
    const x =
      maxLng === minLng
        ? WIDTH / 2
        : PADDING + ((lng - minLng) / (maxLng - minLng)) * (WIDTH - PADDING * 2);
    const y =
      maxLat === minLat
        ? HEIGHT / 2
        : PADDING + ((maxLat - lat) / (maxLat - minLat)) * (HEIGHT - PADDING * 2);
    return { x, y };
  }

  const projected = points.map((point) => ({ ...point, ...project(point.lat, point.lng) }));
  const pathD = projected.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Mapa da rota com pontos de parada"
      className={cn("h-full w-full rounded-lg bg-surface-muted", className)}
    >
      <path d={pathD} className="fill-none stroke-primary/40" strokeWidth={2} strokeDasharray="6 5" />
      {projected.map((point, index) => (
        <g key={point.id}>
          <circle
            cx={point.x}
            cy={point.y}
            r={9}
            className={point.completed ? "fill-success" : "fill-primary"}
          />
          <text
            x={point.x}
            y={point.y + 4}
            textAnchor="middle"
            className="fill-primary-foreground text-[10px] font-semibold"
          >
            {index + 1}
          </text>
          <text x={point.x} y={point.y - 16} textAnchor="middle" className="fill-foreground text-[11px]">
            {point.label.length > 24 ? `${point.label.slice(0, 24)}…` : point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
