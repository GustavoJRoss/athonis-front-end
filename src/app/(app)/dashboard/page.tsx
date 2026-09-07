"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  Route as RouteIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
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
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/ui/metric-card";
import { ErrorState, LoadingState } from "@/components/ui/state";
import { Box, Grid, Stack } from "@/components/ui/primitives";
import { ChartCard, ChartTooltip, CHART_COLOR, CHART_SERIES_PALETTE } from "@/components/charts";
import { ORDER_STATUS_META } from "@/constants/domain";
import { useDashboardData } from "@/features/dashboard/hooks";

/** Data de hoje no fuso local, em YYYY-MM-DD. */
function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardData();

  const metrics = useMemo(() => {
    if (!data) return null;
    const { orders, routes, drivers } = data;

    const ordersToday = orders.filter((order) => order.date === todayIso()).length;
    const delivered = orders.filter((order) => order.status === "delivered").length;
    const pending = orders.filter((order) => order.status === "pending").length;
    const delayed = orders.filter((order) => order.status === "delayed").length;
    const activeRoutes = routes.filter((route) => route.status === "active").length;
    const activeDrivers = drivers.filter((driver) => driver.status !== "unavailable").length;
    const deliveryRate = orders.length > 0 ? Math.round((delivered / orders.length) * 100) : 0;

    return { ordersToday, delivered, pending, delayed, activeRoutes, activeDrivers, deliveryRate };
  }, [data]);

  const ordersTrend = useMemo(() => {
    if (!data) return [];
    // Últimos 7 dias terminando hoje, em vez de um intervalo fixo.
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${date.getFullYear()}-${month}-${day}`;
    });
    return days.map((day) => ({
      day: new Date(`${day}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      pedidos: data.orders.filter((order) => order.date === day).length,
    }));
  }, [data]);

  const statusDistribution = useMemo(() => {
    if (!data) return [];
    return (Object.keys(ORDER_STATUS_META) as Array<keyof typeof ORDER_STATUS_META>)
      .map((status) => ({
        name: ORDER_STATUS_META[status].label,
        value: data.orders.filter((order) => order.status === status).length,
      }))
      .filter((entry) => entry.value > 0);
  }, [data]);

  const driverPerformance = useMemo(() => {
    if (!data) return [];
    return [...data.drivers]
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 6)
      .map((driver) => ({
        name: driver.name.split(" ")[0],
        performance: driver.performance,
      }));
  }, [data]);

  const deliveriesByState = useMemo(() => {
    if (!data) return [];
    const counts = new Map<string, number>();
    for (const order of data.orders) {
      const state = order.destination.split("/")[1] ?? order.destination;
      counts.set(state, (counts.get(state) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([state, count]) => ({ state, pedidos: count }))
      .sort((a, b) => b.pedidos - a.pedidos);
  }, [data]);

  if (isLoading) {
    return (
      <Stack gap={6}>
        <PageHeader title="Dashboard" description="Indicadores e visão geral da operação" />
        <Box surface="surface" border="default" radius="lg">
          <LoadingState title="Carregando indicadores..." />
        </Box>
      </Stack>
    );
  }

  if (isError || !metrics) {
    return (
      <Stack gap={6}>
        <PageHeader title="Dashboard" description="Indicadores e visão geral da operação" />
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
      <PageHeader title="Dashboard" description="Indicadores e visão geral da operação" />

      <Grid columns={4} gap={4} className="grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Pedidos hoje" value={String(metrics.ordersToday)} icon={Package} />
        <MetricCard label="Entregas concluídas" value={String(metrics.delivered)} icon={CheckCircle2} />
        <MetricCard label="Entregas pendentes" value={String(metrics.pending)} icon={Clock} />
        <MetricCard label="Entregas atrasadas" value={String(metrics.delayed)} icon={AlertTriangle} />
        <MetricCard label="Rotas ativas" value={String(metrics.activeRoutes)} icon={RouteIcon} />
        <MetricCard label="Motoristas ativos" value={String(metrics.activeDrivers)} icon={Users} />
        <MetricCard
          label="Taxa de entrega"
          value={`${metrics.deliveryRate}%`}
          icon={TrendingUp}
          trend={{ direction: metrics.deliveryRate >= 70 ? "up" : "down", label: "no período" }}
        />
      </Grid>

      <Grid columns={2} gap={4} className="grid-cols-1 lg:grid-cols-2">
        <ChartCard title="Evolução de pedidos" description="Últimos 7 dias">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ordersTrend}>
              <CartesianGrid vertical={false} stroke={CHART_COLOR.border} />
              <XAxis dataKey="day" tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={{ stroke: CHART_COLOR.border }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="pedidos" stroke={CHART_COLOR.primary} fill={CHART_COLOR.primary} fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Status das entregas" description="Distribuição por status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={32}
                wrapperStyle={{ fontSize: 12, color: CHART_COLOR.muted }}
              />
              <Pie data={statusDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {statusDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={CHART_SERIES_PALETTE[index % CHART_SERIES_PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Performance das rotas" description="Top motoristas por performance">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={driverPerformance}>
              <CartesianGrid vertical={false} stroke={CHART_COLOR.border} />
              <XAxis dataKey="name" tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={{ stroke: CHART_COLOR.border }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="performance" fill={CHART_COLOR.success} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribuição de entregas" description="Pedidos por estado (UF)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deliveriesByState} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid horizontal={false} stroke={CHART_COLOR.border} />
              <XAxis type="number" allowDecimals={false} tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="state" tick={{ fill: CHART_COLOR.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="pedidos" fill={CHART_COLOR.info} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>
    </Stack>
  );
}
