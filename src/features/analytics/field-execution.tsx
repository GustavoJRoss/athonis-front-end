"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Route as RouteIcon, Timer, Truck } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard, ChartTooltip, CHART_COLOR } from "@/components/charts";
import { DataTable, type DataTableColumn } from "@/components/tables";
import { MetricCard } from "@/components/ui/metric-card";
import { Select, type SelectOption } from "@/components/ui/select";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Box, Grid, Heading, Inline, Stack, Text } from "@/components/ui/primitives";
import { DAY_PERIOD_LABEL, OCCURRENCE_LABEL, ROUTE_STATUS_META } from "@/constants/domain";
import { formatDateBr } from "@/lib/utils/date";
import type { FieldRegionStats, FieldRouteSummary } from "@/types/domain";
import { useFieldAnalytics } from "./field-hooks";
import { RouteComparisonDialog } from "./route-comparison-dialog";
import { dash, formatKm, formatMinutes, formatPercent, formatSignedMinutes } from "./format";

const PERIOD_OPTIONS: SelectOption[] = [
  { value: "7", label: "Últimos 7 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 90 dias" },
];

const AXIS_TICK = { fill: CHART_COLOR.muted, fontSize: 12 };

/**
 * O que aconteceu em campo, e como isso se compara ao que a otimização
 * planejou. Os números vêm prontos de `/analytics/*`: são calculados no
 * backend a partir das baixas e do rastro de GPS enviados pelo aplicativo.
 */
export function FieldExecutionPanel() {
  const [days, setDays] = useState("30");
  const [comparing, setComparing] = useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useFieldAnalytics(Number(days));

  const driverChart = useMemo(
    () =>
      (data?.drivers ?? []).map((driver) => ({
        name: driver.name.split(" ")[0],
        Entregues: driver.stopsDelivered,
        "Não entregues": driver.stopsFailed,
      })),
    [data],
  );

  const occurrenceChart = useMemo(
    () =>
      (data?.occurrences.byType ?? [])
        .filter((item) => item.count > 0)
        .map((item) => ({ name: OCCURRENCE_LABEL[item.type] ?? item.type, Ocorrências: item.count })),
    [data],
  );

  const routeColumns: DataTableColumn<FieldRouteSummary>[] = useMemo(
    () => [
      {
        id: "route",
        header: "Rota",
        sortAccessor: (route) => route.plannedDate ?? "",
        cell: (route) => (
          <Stack gap={0}>
            <Text weight="medium">Rota #{route.routeId}</Text>
            <Text size="caption" color="muted">
              {formatDateBr(route.plannedDate)} · {route.driverName ?? "Sem motorista"}
            </Text>
          </Stack>
        ),
      },
      {
        id: "stops",
        header: "Paradas",
        align: "right",
        cell: (route) => (
          <Text size="body-sm">
            {route.stopsDelivered}/{route.stopsTotal}
            {route.stopsFailed > 0 ? ` · ${route.stopsFailed} não entregue(s)` : ""}
          </Text>
        ),
      },
      {
        id: "distance",
        header: "Distância (plan. → exec.)",
        align: "right",
        cell: (route) => (
          <Text size="body-sm">
            {formatKm(route.plannedDistanceM)} → {formatKm(route.actualDistanceM)}
          </Text>
        ),
      },
      {
        id: "duration",
        header: "Duração (plan. → exec.)",
        align: "right",
        cell: (route) => (
          <Text size="body-sm">
            {formatMinutes(route.plannedDurationMin)} → {formatMinutes(route.actualDurationMin)}
          </Text>
        ),
      },
      {
        id: "order",
        header: "Fora de ordem",
        align: "right",
        sortAccessor: (route) => route.stopsOutOfOrder ?? -1,
        cell: (route) => dash(route.stopsOutOfOrder),
      },
      {
        id: "status",
        header: "Situação",
        cell: (route) => (
          <Inline gap={2}>
            <StatusBadge tone={ROUTE_STATUS_META[route.status].tone}>
              {ROUTE_STATUS_META[route.status].label}
            </StatusBadge>
            {!route.hasTracking && <StatusBadge tone="muted">Sem GPS</StatusBadge>}
          </Inline>
        ),
      },
    ],
    [],
  );

  const regionColumns: DataTableColumn<FieldRegionStats>[] = useMemo(
    () => [
      {
        id: "region",
        header: "Região",
        sortAccessor: (item) => item.region,
        cell: (item) => <Text weight="medium">{item.region}</Text>,
      },
      { id: "period", header: "Faixa do dia", cell: (item) => DAY_PERIOD_LABEL[item.period] },
      {
        id: "stops",
        header: "Paradas",
        align: "right",
        sortAccessor: (item) => item.stops,
        cell: (item) => item.stops,
      },
      {
        id: "failed",
        header: "Não entregues",
        align: "right",
        sortAccessor: (item) => item.stopsFailed,
        cell: (item) => item.stopsFailed,
      },
      {
        id: "service",
        header: "Atendimento médio",
        align: "right",
        sortAccessor: (item) => item.avgServiceMin ?? -1,
        cell: (item) => formatMinutes(item.avgServiceMin),
      },
      {
        id: "delay",
        header: "Atraso médio",
        align: "right",
        sortAccessor: (item) => item.avgDelayMin ?? -9999,
        cell: (item) => formatSignedMinutes(item.avgDelayMin),
      },
    ],
    [],
  );

  const filter = (
    <Select
      options={PERIOD_OPTIONS}
      value={[days]}
      onValueChange={(value) => setDays(value[0] ?? "30")}
      className="w-full sm:w-52"
    />
  );

  if (isLoading) {
    return (
      <Stack gap={4}>
        {filter}
        <Box surface="surface" border="default" radius="lg">
          <LoadingState title="Carregando a execução em campo..." />
        </Box>
      </Stack>
    );
  }

  if (isError || !data) {
    return (
      <Stack gap={4}>
        {filter}
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
      </Stack>
    );
  }

  const { overview } = data;

  if (overview.routesTotal === 0) {
    return (
      <Stack gap={4}>
        {filter}
        <Box surface="surface" border="default" radius="lg">
          <EmptyState
            icon={Truck}
            title="Nenhuma rota executada no período"
            description="Os indicadores aparecem quando uma rota é iniciada, pelo aplicativo do entregador ou pela tela de rotas."
          />
        </Box>
      </Stack>
    );
  }

  return (
    <Stack gap={6}>
      {filter}

      <Grid columns={4} gap={4} className="grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Índice de conclusão"
          value={formatPercent(overview.completionRate)}
          icon={CheckCircle2}
        />
        <MetricCard label="Pontualidade" value={formatPercent(overview.onTimeRate)} icon={Clock3} />
        <MetricCard
          label="Atendimento médio por parada"
          value={formatMinutes(overview.avgServiceMin)}
          icon={Timer}
        />
        <MetricCard label="Ocorrências" value={String(overview.occurrencesTotal)} icon={AlertTriangle} />
      </Grid>

      <Box surface="surface" border="default" radius="lg" padding={5}>
        <Stack gap={4}>
          <Stack gap={0.5}>
            <Heading level={4}>Planejado × executado</Heading>
            <Text size="body-sm" color="muted">
              {overview.routesWithTracking > 0
                ? `Distância medida em ${overview.routesWithTracking} de ${overview.routesTotal} rota(s), as que têm rastro de GPS.`
                : "Nenhuma rota do período tem rastro de GPS; a distância executada ainda não pode ser medida."}
            </Text>
          </Stack>
          <Grid columns={4} gap={4} className="grid-cols-2 lg:grid-cols-4">
            <Compare
              label="Distância"
              planned={overview.routesWithTracking > 0 ? formatKm(overview.plannedDistanceKm * 1000) : "—"}
              actual={overview.routesWithTracking > 0 ? formatKm(overview.actualDistanceKm * 1000) : "—"}
            />
            <Compare
              label="Duração das rotas"
              planned={formatMinutes(overview.plannedDurationMin || null)}
              actual={formatMinutes(overview.actualDurationMin || null)}
            />
            <Compare
              label="Atraso médio na chegada"
              planned="0 min"
              actual={formatSignedMinutes(overview.avgDelayMin)}
            />
            <Compare
              label="Paradas fora da ordem"
              planned="0"
              actual={String(overview.stopsOutOfOrder)}
              note={overview.idleTimeMin > 0 ? `${formatMinutes(overview.idleTimeMin)} parado fora de entrega` : undefined}
            />
          </Grid>
        </Stack>
      </Box>

      <Grid columns={2} gap={4} className="grid-cols-1 lg:grid-cols-2">
        <ChartCard
          title="Paradas por motorista"
          description="Entregues e não entregues no período"
          empty={driverChart.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={driverChart} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid horizontal={false} stroke={CHART_COLOR.border} />
              <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} width={72} />
              <Tooltip content={<ChartTooltip />} />
              <Legend verticalAlign="bottom" height={28} wrapperStyle={{ fontSize: 12, color: CHART_COLOR.muted }} />
              {/* Verde e vermelho aqui são estado (entregue / não entregue), não série:
                  a legenda e o rótulo do tooltip dizem o mesmo que a cor. */}
              <Bar dataKey="Entregues" stackId="stops" fill={CHART_COLOR.success} stroke="var(--surface)" strokeWidth={2} />
              <Bar
                dataKey="Não entregues"
                stackId="stops"
                fill={CHART_COLOR.danger}
                stroke="var(--surface)"
                strokeWidth={2}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Ocorrências por motivo"
          description="Paradas visitadas e não entregues"
          empty={occurrenceChart.length === 0}
          emptyMessage="Nenhuma ocorrência no período"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={occurrenceChart} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid horizontal={false} stroke={CHART_COLOR.border} />
              <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} width={150} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="Ocorrências" fill={CHART_COLOR.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Stack gap={3}>
        <Stack gap={0.5}>
          <Heading level={4}>Rotas executadas</Heading>
          <Text size="body-sm" color="muted">
            Clique numa rota para ver a comparação parada a parada.
          </Text>
        </Stack>
        <DataTable
          columns={routeColumns}
          data={data.routes}
          getRowId={(route) => route.routeId}
          onRowClick={(route) => setComparing(route.routeId)}
          pageSize={8}
        />
      </Stack>

      <Stack gap={3}>
        <Stack gap={0.5}>
          <Heading level={4}>Por região e faixa do dia</Heading>
          <Text size="body-sm" color="muted">
            Atraso positivo significa chegada depois do previsto pela otimização.
          </Text>
        </Stack>
        <DataTable
          columns={regionColumns}
          data={data.regions}
          getRowId={(item) => `${item.region}|${item.period}`}
          pageSize={8}
        />
      </Stack>

      {data.occurrences.recent.length > 0 && (
        <Stack gap={3}>
          <Heading level={4}>Ocorrências recentes</Heading>
          <Stack gap={2}>
            {data.occurrences.recent.slice(0, 8).map((item) => (
              <Box
                key={`${item.routeId}-${item.orderId}-${item.occurredAt}`}
                surface="surface"
                border="default"
                radius="lg"
                padding={4}
              >
                <Inline justify="between" align="start" gap={3} wrap>
                  <Stack gap={0.5} className="min-w-0">
                    <Text weight="medium">{item.clientName ?? item.orderTitle ?? "Parada"}</Text>
                    <Text size="body-sm" color="muted">
                      Rota #{item.routeId} · {item.driverName ?? "Sem motorista"} ·{" "}
                      {item.occurredAt ? new Date(item.occurredAt).toLocaleString("pt-BR") : "—"}
                    </Text>
                    {item.notes && <Text size="body-sm">{item.notes}</Text>}
                  </Stack>
                  <StatusBadge tone="danger">
                    {OCCURRENCE_LABEL[item.occurrenceType] ?? item.occurrenceType}
                  </StatusBadge>
                </Inline>
              </Box>
            ))}
          </Stack>
        </Stack>
      )}

      <RouteComparisonDialog routeId={comparing} onClose={() => setComparing(null)} />
    </Stack>
  );
}

/** Um par planejado/executado. São números de escalas diferentes, então ficam lado a lado, não num gráfico. */
function Compare({
  label,
  planned,
  actual,
  note,
}: {
  label: string;
  planned: string;
  actual: string;
  note?: string;
}) {
  return (
    <Stack gap={1}>
      <Inline gap={2} align="center">
        <RouteIcon className="text-muted size-4" aria-hidden />
        <Text size="body-sm" color="muted">
          {label}
        </Text>
      </Inline>
      <Heading level={3}>{actual}</Heading>
      <Text size="caption" color="muted">
        Planejado: {planned}
      </Text>
      {note && (
        <Text size="caption" color="muted">
          {note}
        </Text>
      )}
    </Stack>
  );
}
