"use client";

import { useMemo, useState } from "react";
import { MapPinned, Truck } from "lucide-react";
import { TrackMap, type TrackMapVehicle } from "@/components/domain/track-map";
import { PageHeader } from "@/components/ui/page-header";
import { Select, type SelectOption } from "@/components/ui/select";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs } from "@/components/ui/tabs";
import { Box, Grid, Heading, Inline, Stack, Text } from "@/components/ui/primitives";
import { OCCURRENCE_LABEL, ORDER_STATUS_META } from "@/constants/domain";
import {
  LIVE_REFRESH_MS,
  useFieldAnalytics,
  useLiveRoutes,
  useRouteComparison,
} from "@/features/analytics/field-hooks";
import {
  formatClock,
  formatKm,
  formatMinutes,
  formatSignedMinutes,
} from "@/features/analytics/format";
import { RouteTrack } from "@/features/tracking/route-track";
import { cn } from "@/lib/utils/cn";
import { formatDateBr } from "@/lib/utils/date";
import type { LiveRoute, RouteComparison } from "@/types/domain";

/** Posição mais velha que isto é mostrada como "sem sinal": o entregador pode estar em outro lugar. */
const STALE_AFTER_MIN = 5;

function minutesAgo(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  return Number.isFinite(diff) ? Math.max(0, Math.round(diff / 60000)) : null;
}

function positionAge(route: LiveRoute): { label: string; tone: "success" | "warning" | "muted" } {
  const age = minutesAgo(route.position?.recordedAt);
  if (age == null) return { label: "Sem posição", tone: "muted" };
  if (age <= 1) return { label: "Agora", tone: "success" };
  if (age <= STALE_AFTER_MIN) return { label: `Há ${age} min`, tone: "success" };
  return { label: `Sem sinal há ${formatMinutes(age)}`, tone: "warning" };
}

export default function TrackingPage() {
  return (
    <Stack gap={6}>
      <PageHeader
        title="Acompanhamento"
        description="Onde cada entregador está e por onde passou"
        icon={MapPinned}
      />
      <Tabs
        items={[
          { value: "live", label: "Ao vivo", content: <LivePanel /> },
          { value: "history", label: "Percursos", content: <HistoryPanel /> },
        ]}
      />
    </Stack>
  );
}

// ------------------------------------------------------------------ ao vivo

function LivePanel() {
  const { data: routes, isLoading, isError, refetch, dataUpdatedAt } = useLiveRoutes();
  const [selected, setSelected] = useState<string | null>(null);

  // Sem escolha do usuário, mostra a primeira rota em andamento.
  const selectedId =
    selected && routes?.some((route) => route.routeId === selected)
      ? selected
      : (routes?.[0]?.routeId ?? null);
  const { data: detail } = useRouteComparison(selectedId, LIVE_REFRESH_MS);

  const vehicles: TrackMapVehicle[] = useMemo(
    () =>
      (routes ?? [])
        .filter((route) => route.position)
        .map((route) => ({
          id: route.routeId,
          lat: route.position!.lat,
          lng: route.position!.lng,
          label: route.driverName?.split(" ")[0] ?? `Rota #${route.routeId}`,
          detail: `Rota #${route.routeId} · ${positionAge(route).label}`,
          selected: route.routeId === selectedId,
        })),
    [routes, selectedId],
  );

  if (isLoading) {
    return (
      <Box surface="surface" border="default" radius="lg">
        <LoadingState title="Buscando as rotas em andamento..." />
      </Box>
    );
  }

  if (isError || !routes) {
    return (
      <Box surface="surface" border="default" radius="lg">
        <ErrorState
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="text-body-sm text-primary font-medium hover:underline"
            >
              Tentar novamente
            </button>
          }
        />
      </Box>
    );
  }

  if (routes.length === 0) {
    return (
      <Box surface="surface" border="default" radius="lg">
        <EmptyState
          icon={Truck}
          title="Nenhuma rota em andamento"
          description="Quando um entregador iniciar uma rota no aplicativo, ela aparece aqui com a posição dele."
        />
      </Box>
    );
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedId) ?? null;
  const others = vehicles.filter((vehicle) => vehicle.id !== selectedId);

  return (
    <Stack gap={4}>
      <Text size="body-sm" color="muted">
        Atualiza sozinho a cada {LIVE_REFRESH_MS / 1000} segundos · última atualização às{" "}
        {formatClock(new Date(dataUpdatedAt).toISOString())}. A posição chega com até um minuto de
        atraso, porque o aplicativo envia o trajeto em lotes.
      </Text>

      <Grid columns={3} gap={4} className="grid-cols-1 lg:grid-cols-3">
        <Stack gap={2}>
          {routes.map((route) => {
            const age = positionAge(route);
            const active = route.routeId === selectedId;
            return (
              <button
                key={route.routeId}
                type="button"
                onClick={() => setSelected(route.routeId)}
                aria-pressed={active}
                className={cn(
                  "bg-surface hover:bg-surface-hover rounded-lg border p-4 text-left transition-colors",
                  active ? "border-primary" : "border-border",
                )}
              >
                <Stack gap={1.5}>
                  <Inline justify="between" align="center" gap={2}>
                    <Text weight="medium">{route.driverName ?? "Sem motorista"}</Text>
                    <StatusBadge tone={age.tone}>{age.label}</StatusBadge>
                  </Inline>
                  <Text size="caption" color="muted">
                    Rota #{route.routeId}
                    {route.vehicleName ? ` · ${route.vehicleName}` : ""} · saída{" "}
                    {formatClock(route.startedAt)}
                  </Text>
                  <Text size="body-sm">
                    {route.stopsDelivered + route.stopsFailed} de {route.stopsTotal} paradas
                    {route.stopsFailed > 0 ? ` · ${route.stopsFailed} não entregue(s)` : ""}
                  </Text>
                  <Text size="caption" color="muted">
                    {route.nextStop
                      ? `Próxima: ${route.nextStop.sequence ?? ""}. ${route.nextStop.label} — ${route.nextStop.address}`
                      : "Todas as paradas baixadas; falta encerrar a rota."}
                  </Text>
                </Stack>
              </button>
            );
          })}
        </Stack>

        <div className="lg:col-span-2">
          {detail ? (
            <Stack gap={3}>
              <RouteTrack data={detail} vehicle={selectedVehicle} className="h-[480px]" />
              {others.length > 0 && (
                <Text size="caption" color="muted">
                  Outros entregadores em rota: {others.map((vehicle) => vehicle.label).join(", ")}.
                  Selecione na lista para ver o percurso de cada um.
                </Text>
              )}
            </Stack>
          ) : (
            <div className="h-[480px]">
              <TrackMap vehicles={vehicles} fitKey="live-overview" onVehicleClick={setSelected} />
            </div>
          )}
        </div>
      </Grid>
    </Stack>
  );
}

// ---------------------------------------------------------------- percursos

const PERIOD_DAYS = 30;

function HistoryPanel() {
  const { data, isLoading, isError } = useFieldAnalytics(PERIOD_DAYS);
  const [selected, setSelected] = useState<string | null>(null);

  const options: SelectOption[] = useMemo(
    () =>
      (data?.routes ?? []).map((route) => ({
        value: route.routeId,
        label: `Rota #${route.routeId} · ${formatDateBr(route.plannedDate)} · ${route.driverName ?? "Sem motorista"}${route.hasTracking ? "" : " · sem GPS"}`,
      })),
    [data],
  );

  // Abre na rota mais recente que tem trajeto: é a que tem o que mostrar.
  const selectedId =
    selected ??
    data?.routes.find((route) => route.hasTracking)?.routeId ??
    data?.routes[0]?.routeId ??
    null;
  const comparison = useRouteComparison(selectedId);

  if (isLoading) {
    return (
      <Box surface="surface" border="default" radius="lg">
        <LoadingState title="Buscando as rotas executadas..." />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box surface="surface" border="default" radius="lg">
        <ErrorState />
      </Box>
    );
  }

  if (data.routes.length === 0) {
    return (
      <Box surface="surface" border="default" radius="lg">
        <EmptyState
          icon={Truck}
          title={`Nenhuma rota executada nos últimos ${PERIOD_DAYS} dias`}
          description="O percurso de uma rota fica disponível depois que ela é iniciada."
        />
      </Box>
    );
  }

  return (
    <Stack gap={4}>
      <Select
        options={options}
        value={selectedId ? [selectedId] : []}
        onValueChange={(value) => setSelected(value[0] ?? null)}
        searchable
        className="w-full lg:w-[32rem]"
      />

      {comparison.isLoading ? (
        <Box surface="surface" border="default" radius="lg">
          <LoadingState title="Montando o percurso..." />
        </Box>
      ) : comparison.isError || !comparison.data ? (
        <Box surface="surface" border="default" radius="lg">
          <ErrorState />
        </Box>
      ) : (
        <Percurso data={comparison.data} />
      )}
    </Stack>
  );
}

function Percurso({ data }: { data: RouteComparison }) {
  const { summary, route } = data;
  const foraDeOrdem = data.stops.filter(
    (stop) =>
      stop.actualSequence != null &&
      stop.plannedSequence != null &&
      stop.actualSequence !== stop.plannedSequence,
  );

  return (
    <Grid columns={3} gap={4} className="grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <RouteTrack data={data} className="h-[520px]" />
      </div>

      <Stack gap={4}>
        <Box surface="surface" border="default" radius="lg" padding={4}>
          <Stack gap={2}>
            <Heading level={4}>Rota #{route.routeId}</Heading>
            <Text size="body-sm" color="muted">
              {[formatDateBr(route.plannedDate), route.driverName, route.vehicleName]
                .filter(Boolean)
                .join(" · ")}
            </Text>
            <Text size="body-sm">
              Saída {formatClock(route.startedAt)} · encerramento {formatClock(route.finishedAt)}
            </Text>
            {summary && (
              <>
                <Text size="body-sm">
                  Distância: {formatKm(summary.actualDistanceM)} percorridos, contra{" "}
                  {formatKm(summary.plannedDistanceM)} planejados
                </Text>
                <Text size="body-sm">
                  Duração: {formatMinutes(summary.actualDurationMin)}, contra{" "}
                  {formatMinutes(summary.plannedDurationMin)} planejados
                </Text>
              </>
            )}
          </Stack>
        </Box>

        <Box surface="surface" border="default" radius="lg" padding={4}>
          <Stack gap={2}>
            <Heading level={4}>O que fugiu do plano</Heading>
            {foraDeOrdem.length === 0 && data.idleStops.length === 0 && (
              <Text size="body-sm" color="muted">
                {data.path.length < 2
                  ? "Sem rastro de GPS, não é possível dizer onde o veículo parou. As paradas foram visitadas na ordem planejada."
                  : "Nada a apontar: paradas na ordem planejada e nenhuma parada fora de entrega."}
              </Text>
            )}
            {foraDeOrdem.map((stop) => (
              <Text key={stop.orderId} size="body-sm">
                <StatusBadge tone="warning" className="mr-2">
                  Fora de ordem
                </StatusBadge>
                {stop.clientName ?? stop.title}: planejada em {stop.plannedSequence}º, visitada em{" "}
                {stop.actualSequence}º
              </Text>
            ))}
            {data.idleStops.map((stop, index) => (
              <Text key={`${stop.startedAt}-${index}`} size="body-sm">
                <StatusBadge tone="warning" className="mr-2">
                  Parado {stop.durationMin} min
                </StatusBadge>
                das {formatClock(stop.startedAt)} às {formatClock(stop.endedAt)}, fora de uma parada
                de entrega
              </Text>
            ))}
          </Stack>
        </Box>

        <Box surface="surface" border="default" radius="lg" padding={4}>
          <Stack gap={3}>
            <Heading level={4}>Paradas</Heading>
            {data.stops.map((stop) => (
              <Stack key={stop.orderId} gap={0.5}>
                <Inline justify="between" align="start" gap={2}>
                  <Text size="body-sm" weight="medium">
                    {stop.plannedSequence}. {stop.clientName ?? stop.title}
                  </Text>
                  <StatusBadge tone={ORDER_STATUS_META[stop.status]?.tone ?? "muted"}>
                    {stop.occurrenceType
                      ? OCCURRENCE_LABEL[stop.occurrenceType]
                      : (ORDER_STATUS_META[stop.status]?.label ?? stop.status)}
                  </StatusBadge>
                </Inline>
                <Text size="caption" color="muted">
                  {stop.address}
                </Text>
                <Text size="caption" color="muted">
                  Chegada {formatClock(stop.actualArrival)}
                  {stop.delayMin != null ? ` (${formatSignedMinutes(stop.delayMin)})` : ""} ·
                  atendimento {formatMinutes(stop.serviceMin)}
                </Text>
                {stop.notes && <Text size="caption">{stop.notes}</Text>}
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Grid>
  );
}
