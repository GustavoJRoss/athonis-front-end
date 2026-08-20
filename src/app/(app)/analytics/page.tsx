"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Clock3, Package, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/ui/metric-card";
import { Select, type SelectOption } from "@/components/ui/select";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { Box, Grid, Icon, Inline, Stack } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import {
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  getDrawerSwipeDirection,
} from "@/components/ui/drawer";
import { ChartCard, ChartTooltip, CHART_COLOR, CHART_SERIES_PALETTE } from "@/components/charts";
import { ORDER_STATUS_META } from "@/constants/domain";
import { useAnalyticsData } from "@/features/analytics/hooks";
import type { Order } from "@/types/domain";

const TODAY = new Date("2026-08-18T00:00:00");

const PERIOD_OPTIONS: SelectOption[] = [
  { value: "7", label: "Últimos 7 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "all", label: "Todo o período" },
];

const WINDOW_HOURS: Record<string, number> = {
  "08:00–12:00": 4,
  "13:00–17:00": 4,
  "18:00–22:00": 4,
};

function withinPeriod(date: string, days: string) {
  if (days === "all") return true;
  const orderDate = new Date(`${date}T00:00:00`);
  const diffDays = Math.abs((TODAY.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= Number(days);
}

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAnalyticsData();

  const [period, setPeriod] = useState("30");
  const [driverId, setDriverId] = useState("all");
  const [vehicleId, setVehicleId] = useState("all");
  const [state, setState] = useState("all");
  const [status, setStatus] = useState<Order["status"] | "all">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const driverOptions: SelectOption[] = useMemo(
    () => [{ value: "all", label: "Todos os motoristas" }, ...(data?.drivers ?? []).map((d) => ({ value: d.id, label: d.name }))],
    [data],
  );
  const vehicleOptions: SelectOption[] = useMemo(
    () => [{ value: "all", label: "Todos os veículos" }, ...(data?.vehicles ?? []).map((v) => ({ value: v.id, label: v.plate }))],
    [data],
  );
  const stateOptions: SelectOption[] = useMemo(() => {
    const states = new Set((data?.orders ?? []).map((order) => order.destination.split("/")[1]).filter(Boolean));
    return [{ value: "all", label: "Todas as regiões" }, ...Array.from(states).sort().map((uf) => ({ value: uf!, label: uf! }))];
  }, [data]);
  const statusOptions: SelectOption[] = useMemo(
    () => [
      { value: "all", label: "Todos os status" },
      ...Object.entries(ORDER_STATUS_META).map(([value, meta]) => ({ value, label: meta.label })),
    ],
    [],
  );

  const filteredOrders = useMemo(() => {
    if (!data) return [];
    const vehicleDriverId = vehicleId !== "all" ? data.vehicles.find((v) => v.id === vehicleId)?.driverId : undefined;

    return data.orders.filter((order) => {
      if (!withinPeriod(order.date, period)) return false;
      if (driverId !== "all" && order.driverId !== driverId) return false;
      if (vehicleId !== "all" && order.driverId !== vehicleDriverId) return false;
      if (state !== "all" && order.destination.split("/")[1] !== state) return false;
      if (status !== "all" && order.status !== status) return false;
      return true;
    });
  }, [data, period, driverId, vehicleId, state, status]);

  const metrics = useMemo(() => {
    const total = filteredOrders.length;
    const delivered = filteredOrders.filter((order) => order.status === "delivered").length;
    const delayed = filteredOrders.filter((order) => order.status === "delayed").length;
    const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0;
    const avgWindowHours =
      total > 0
        ? Math.round(
            (filteredOrders.reduce((sum, order) => sum + (WINDOW_HOURS[order.deliveryWindow] ?? 4), 0) / total) * 10,
          ) / 10
        : 0;

    return { total, delivered, delayed, deliveryRate, avgWindowHours };
  }, [filteredOrders]);

  const ordersByPeriod = useMemo(() => {
    const counts = new Map<string, number>();
    for (const order of filteredOrders) {
      counts.set(order.date, (counts.get(order.date) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date: new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        pedidos: count,
      }));
  }, [filteredOrders]);

  const deliveriesByDriver = useMemo(() => {
    if (!data) return [];
    return data.drivers
      .map((driver) => ({
        name: driver.name.split(" ")[0],
        entregas: filteredOrders.filter((order) => order.driverId === driver.id && order.status === "delivered").length,
      }))
      .filter((entry) => entry.entregas > 0)
      .sort((a, b) => b.entregas - a.entregas);
  }, [data, filteredOrders]);

  const routePerformance = useMemo(() => {
    if (!data) return [];
    return data.routes
      .map((route) => {
        const routeOrders = filteredOrders.filter((order) => order.routeId === route.id);
        if (routeOrders.length === 0) return null;
        const delayed = routeOrders.filter((order) => order.status === "delayed").length;
        const performance = Math.round(((routeOrders.length - delayed) / routeOrders.length) * 100);
        return { name: route.name.split(" ")[0], performance };
      })
      .filter((entry): entry is { name: string; performance: number } => entry !== null);
  }, [data, filteredOrders]);

  const statusDistribution = useMemo(
    () =>
      (Object.keys(ORDER_STATUS_META) as Array<keyof typeof ORDER_STATUS_META>)
        .map((key) => ({ name: ORDER_STATUS_META[key].label, value: filteredOrders.filter((o) => o.status === key).length }))
        .filter((entry) => entry.value > 0),
    [filteredOrders],
  );

  const filterControls = (
    <>
      <Select options={PERIOD_OPTIONS} value={[period]} onValueChange={(v) => setPeriod(v[0] ?? "30")} className="w-full lg:w-48" />
      <Select options={driverOptions} value={[driverId]} onValueChange={(v) => setDriverId(v[0] ?? "all")} searchable className="w-full lg:w-52" />
      <Select options={vehicleOptions} value={[vehicleId]} onValueChange={(v) => setVehicleId(v[0] ?? "all")} className="w-full lg:w-44" />
      <Select options={stateOptions} value={[state]} onValueChange={(v) => setState(v[0] ?? "all")} className="w-full lg:w-40" />
      <Select
        options={statusOptions}
        value={[status]}
        onValueChange={(v) => setStatus((v[0] as Order["status"]) ?? "all")}
        className="w-full lg:w-44"
      />
    </>
  );

  if (isLoading) {
    return (
      <Stack gap={6}>
        <PageHeader title="Indicadores" description="Analytics e performance operacional" />
        <Box surface="surface" border="default" radius="lg">
          <LoadingState title="Carregando indicadores..." />
        </Box>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack gap={6}>
        <PageHeader title="Indicadores" description="Analytics e performance operacional" />
        <Box surface="surface" border="default" radius="lg">
          <ErrorState
            action={
              <button type="button" onClick={() => refetch()} className="text-body-sm font-medium text-primary hover:underline">
                Tentar novamente
              </button>
            }
          />
        </Box>
      </Stack>
    );
  }

  return (
    <Stack gap={6}>
      <PageHeader title="Indicadores" description="Analytics e performance operacional" />

      <Box surface="surface" border="default" radius="lg" padding={4} className="hidden lg:block">
        <Inline gap={3} wrap>{filterControls}</Inline>
      </Box>

      <Button variant="tertiary" onClick={() => setFiltersOpen(true)} className="w-fit lg:hidden">
        <Icon icon={SlidersHorizontal} size="sm" /> Filtros
      </Button>

      <DrawerRoot
        open={filtersOpen}
        onOpenChange={(details) => setFiltersOpen(details.open)}
        swipeDirection={getDrawerSwipeDirection("bottom")}
      >
        <DrawerContent side="bottom">
          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Stack gap={4}>{filterControls}</Stack>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      {filteredOrders.length === 0 ? (
        <Box surface="surface" border="default" radius="lg">
          <EmptyState
            icon={Package}
            title="Nenhum dado para os filtros selecionados"
            description="Ajuste os filtros para ver indicadores."
          />
        </Box>
      ) : (
        <>
          <Grid columns={4} gap={4} className="grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Taxa de entrega" value={`${metrics.deliveryRate}%`} icon={TrendingUp} />
            <MetricCard label="Tempo médio de entrega" value={`${metrics.avgWindowHours}h`} icon={Clock3} />
            <MetricCard label="Volume de pedidos" value={String(metrics.total)} icon={Package} />
            <MetricCard label="Atrasos" value={String(metrics.delayed)} icon={AlertTriangle} />
          </Grid>

          <Grid columns={2} gap={4} className="grid-cols-1 lg:grid-cols-2">
            <ChartCard title="Pedidos por período" description="Volume de pedidos no intervalo filtrado">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersByPeriod}>
                  <CartesianGrid vertical={false} stroke={CHART_COLOR.border} />
                  <XAxis dataKey="date" tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={{ stroke: CHART_COLOR.border }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="pedidos" fill={CHART_COLOR.primary} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Entregas por motorista" description="Entregas concluídas no período">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveriesByDriver} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid horizontal={false} stroke={CHART_COLOR.border} />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={64} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="entregas" fill={CHART_COLOR.success} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Performance por rota" description="% de pedidos sem atraso">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={routePerformance}>
                  <CartesianGrid vertical={false} stroke={CHART_COLOR.border} />
                  <XAxis dataKey="name" tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={{ stroke: CHART_COLOR.border }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="performance" fill={CHART_COLOR.info} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Volume por status" description="Distribuição dos pedidos filtrados">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend verticalAlign="bottom" height={32} wrapperStyle={{ fontSize: 12, color: CHART_COLOR.muted }} />
                  <Pie data={statusDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {statusDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={CHART_SERIES_PALETTE[index % CHART_SERIES_PALETTE.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </>
      )}
    </Stack>
  );
}
