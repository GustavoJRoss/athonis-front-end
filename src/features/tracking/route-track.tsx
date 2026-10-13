"use client";

import { useMemo } from "react";
import { TrackMap, type TrackMapStop, type TrackMapVehicle } from "@/components/domain/track-map";
import { Inline, Stack, Text } from "@/components/ui/primitives";
import { OCCURRENCE_LABEL } from "@/constants/domain";
import { formatClock } from "@/features/analytics/format";
import type { RouteComparison } from "@/types/domain";

/**
 * O percurso de uma rota no mapa: a rota planejada (tracejada), o trajeto
 * percorrido (linha cheia), cada parada com sua situação e os pontos em que
 * o veículo ficou parado fora de uma entrega.
 */
export function RouteTrack({
  data,
  vehicle,
  className,
}: {
  data: RouteComparison;
  /** Posição atual do entregador, quando a rota está em andamento. */
  vehicle?: TrackMapVehicle | null;
  className?: string;
}) {
  const stops: TrackMapStop[] = useMemo(
    () =>
      data.stops
        .filter((stop) => stop.lat != null && stop.lng != null)
        .map((stop) => ({
          id: stop.orderId,
          lat: stop.lat as number,
          lng: stop.lng as number,
          sequence: stop.plannedSequence,
          label: stop.clientName ?? stop.title,
          state: stop.status === "delivered" ? "delivered" : stop.status === "failed" ? "failed" : "open",
          detail: [
            stop.actualArrival ? `chegada ${formatClock(stop.actualArrival)}` : null,
            stop.completedAt ? `baixa ${formatClock(stop.completedAt)}` : null,
            stop.actualSequence != null &&
            stop.plannedSequence != null &&
            stop.actualSequence !== stop.plannedSequence
              ? `visitada em ${stop.actualSequence}º (planejada em ${stop.plannedSequence}º)`
              : null,
            stop.occurrenceType ? OCCURRENCE_LABEL[stop.occurrenceType] : null,
            stop.notes,
          ]
            .filter(Boolean)
            .join(" · "),
        })),
    [data.stops],
  );

  const idleStops = useMemo(
    () =>
      data.idleStops.map((stop) => ({
        lat: stop.lat,
        lng: stop.lng,
        durationMin: stop.durationMin,
        detail: `das ${formatClock(stop.startedAt)} às ${formatClock(stop.endedAt)}, fora de uma parada de entrega`,
      })),
    [data.idleStops],
  );

  const vehicles = useMemo(() => (vehicle ? [vehicle] : []), [vehicle]);

  return (
    <Stack gap={3}>
      <div className={className ?? "h-[420px]"}>
        <TrackMap
          stops={stops}
          path={data.path}
          idleStops={idleStops}
          vehicles={vehicles}
          depot={data.depot}
          fitKey={data.route.routeId}
        />
      </div>

      <Inline gap={4} wrap>
        <Legend swatch={<Line className="border-primary border-t-4" />} label="Trajeto percorrido" />
        <Legend
          swatch={<Line className="border-muted border-t-2 border-dashed" />}
          label="Rota planejada"
        />
        <Legend swatch={<Dot className="bg-success" text="1" />} label="Entregue" />
        <Legend swatch={<Dot className="bg-danger" text="×" />} label="Não entregue" />
        <Legend swatch={<Dot className="bg-primary" text="1" />} label="Em aberto" />
        <Legend swatch={<Dot className="bg-warning" text="!" dark />} label="Parado fora de entrega" />
      </Inline>

      {data.path.length < 2 && (
        <Text size="body-sm" color="muted">
          Esta rota não tem rastro de GPS: o mapa mostra só as paradas e a rota planejada. O
          trajeto aparece quando o entregador usa o aplicativo com a localização permitida.
        </Text>
      )}
    </Stack>
  );
}

function Legend({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <Inline gap={2} align="center">
      {swatch}
      <Text size="caption" color="muted">
        {label}
      </Text>
    </Inline>
  );
}

function Line({ className }: { className: string }) {
  return <span aria-hidden className={`inline-block w-6 ${className}`} />;
}

function Dot({ className, text, dark }: { className: string; text: string; dark?: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-flex size-5 items-center justify-center rounded-full text-[11px] font-bold ${dark ? "text-warning-foreground" : "text-white"} ${className}`}
    >
      {text}
    </span>
  );
}
