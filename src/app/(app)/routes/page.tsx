"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Play,
  RouteIcon,
  Route as RouteIconLucide,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import {
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Box,
  Grid,
  Icon,
  Inline,
  Stack,
  Text,
} from "@/components/ui/primitives";
import { ORDER_STATUS_META, ROUTE_STATUS_META } from "@/constants/domain";
import {
  useCompleteRoute,
  useDeleteRoute,
  useOptimizeRoutes,
  useRoutes,
  useStartRoute,
} from "@/features/routes/hooks";
import { useDrivers } from "@/features/drivers/hooks";
import { useVehicles } from "@/features/vehicles/hooks";
import { useOrders } from "@/features/orders/hooks";
import {
  GenerateRouteDialog,
  type UnassignedOrder,
} from "@/features/routes/generate-route-dialog";
import { RouteMap } from "@/components/domain/route-map";
import { toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import { vehicleLabel } from "@/lib/utils/vehicle-label";
import { deliveryWindowLabel } from "@/lib/utils/delivery-window";
import type { Route } from "@/types/domain";

export default function RoutesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const { data: routes, isLoading, isError, refetch } = useRoutes(search);
  const { data: drivers } = useDrivers();
  const { data: vehicles } = useVehicles();
  const { data: orders } = useOrders();
  const optimizeMutation = useOptimizeRoutes();
  const deleteMutation = useDeleteRoute();
  const startMutation = useStartRoute();
  const completeMutation = useCompleteRoute();
  const [unassigned, setUnassigned] = useState<UnassignedOrder[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(
    () => searchParams.get("new") === "1",
  );
  const [deleting, setDeleting] = useState<Route | null>(null);

  const effectiveSelectedId = selectedId ?? routes?.[0]?.id ?? null;
  const selectedRoute =
    routes?.find((route) => route.id === effectiveSelectedId) ?? null;

  function driverName(route: Route) {
    if (route.driverName) return route.driverName;
    const found = drivers?.find((driver) => driver.id === route.driverId);
    return found?.name ?? "—";
  }

  function vehiclePlate(route: Route) {
    const found = vehicles?.find((vehicle) => vehicle.id === route.vehicleId);
    return found ? vehicleLabel(found) : route.vehicleName || "—";
  }

  function closeForm() {
    setFormOpen(false);
    if (searchParams.get("new")) router.replace(pathname);
  }

  async function handleGenerate(orderIds: string[]) {
    try {
      const result = await optimizeMutation.mutateAsync(orderIds);
      setUnassigned(result.unassignedOrders ?? []);

      if (result.simulated) {
        // Rota simulada nao vale para despacho: o usuario precisa saber disso.
        toaster.warning({
          title: "Rota gerada em modo simulado",
          description:
            "A API de otimização do Google não está configurada. Distâncias e tempos são estimativas.",
        });
      } else {
        toaster.success({
          title: `${result.totalRoutes} rota(s) gerada(s)`,
          description: result.message,
        });
      }

      if (result.unassignedOrders?.length) {
        toaster.warning({
          title: `${result.unassignedOrders.length} pedido(s) ficaram de fora`,
          description: result.unassignedOrders
            .map((item) => `Pedido ${item.orderId}: ${item.reason}`)
            .join(" | "),
        });
      }

      closeForm();
      setSelectedId(null);
    } catch (error) {
      toaster.error({
        title: "Não foi possível gerar a rota",
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  async function handleStart(route: Route) {
    try {
      await startMutation.mutateAsync(route.id);
      toaster.success({
        title: "Rota iniciada",
        description: "Pedidos, motorista e veículo passaram para em trânsito.",
      });
    } catch (error) {
      toaster.error({
        title: "Não foi possível iniciar a rota",
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  async function handleComplete(route: Route) {
    try {
      await completeMutation.mutateAsync(route.id);
      toaster.success({
        title: "Rota concluída",
        description:
          "As entregas em aberto foram baixadas e a equipe está livre.",
      });
    } catch (error) {
      toaster.error({
        title: "Não foi possível concluir a rota",
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toaster.success({ title: "Rota removida" });
      if (selectedId === deleting.id) setSelectedId(null);
      setDeleting(null);
    } catch (error) {
      toaster.error({
        title: "Não foi possível remover a rota",
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  return (
    <Stack gap={6} className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Rotas"
        icon={RouteIcon}
        description="Planejamento e acompanhamento de rotas"
        actions={
          <Button variant="primary" onClick={() => setFormOpen(true)}>
            <Icon icon={RouteIconLucide} size="sm" /> Gerar rota
          </Button>
        }
      />

      {isLoading ? (
        <Box surface="surface" border="default" radius="lg">
          <LoadingState title="Carregando rotas..." />
        </Box>
      ) : isError ? (
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
      ) : !routes || routes.length === 0 ? (
        <Box surface="surface" border="default" radius="lg">
          <EmptyState
            title="Nenhuma rota gerada"
            description="Selecione pedidos com veículo e motorista para gerar a primeira rota."
          />
        </Box>
      ) : (
        <Grid
          columns={1}
          gap={4}
          className="min-h-0 flex-1 lg:grid-cols-[360px_1fr]"
        >
          <Stack gap={3} className="min-h-0">
            <SearchInput
              value={search}
              onValueChange={setSearch}
              placeholder="Buscar rota ou região..."
            />
            <Stack gap={2} className="max-h-[560px] overflow-y-auto pr-1">
              {routes.map((route) => (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => setSelectedId(route.id)}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors",
                    route.id === effectiveSelectedId
                      ? "border-primary bg-primary/5"
                      : "border-border bg-surface hover:bg-surface-hover",
                  )}
                >
                  <Inline justify="between" align="start">
                    <Stack gap={0.5}>
                      <Text weight="medium">{route.name}</Text>
                      <Text size="caption" color="muted">
                        {route.region} · {driverName(route)}
                      </Text>
                    </Stack>
                    <StatusBadge tone={ROUTE_STATUS_META[route.status].tone}>
                      {ROUTE_STATUS_META[route.status].label}
                    </StatusBadge>
                  </Inline>
                </button>
              ))}
            </Stack>
          </Stack>

          <Stack gap={4} className="min-h-0">
            <Box
              surface="surface"
              border="default"
              radius="lg"
              className="h-72 overflow-hidden lg:h-80"
            >
              {selectedRoute && (
                <RouteMap points={selectedRoute.stops} className="h-full" />
              )}
            </Box>

            {selectedRoute && (
              <Box surface="surface" border="default" radius="lg" padding={5}>
                <Stack gap={4}>
                  <Inline justify="between" align="start">
                    <Stack gap={0.5}>
                      <Text weight="semibold" className="text-heading-4">
                        {selectedRoute.name}
                      </Text>
                      <Text size="body-sm" color="muted">
                        {selectedRoute.region}
                      </Text>
                    </Stack>
                    <Inline gap={2} align="center">
                      <StatusBadge
                        tone={ROUTE_STATUS_META[selectedRoute.status].tone}
                      >
                        {ROUTE_STATUS_META[selectedRoute.status].label}
                      </StatusBadge>

                      {selectedRoute.status === "planned" && (
                        <Button
                          size="sm"
                          variant="primary"
                          loading={startMutation.isPending}
                          onClick={() => handleStart(selectedRoute)}
                        >
                          <Icon icon={Play} size="sm" /> Iniciar
                        </Button>
                      )}

                      {selectedRoute.status === "active" && (
                        <Button
                          size="sm"
                          variant="primary"
                          loading={completeMutation.isPending}
                          onClick={() => handleComplete(selectedRoute)}
                        >
                          <Icon icon={CheckCircle2} size="sm" /> Concluir
                        </Button>
                      )}

                      {/* Rota em andamento ou já concluída não se apaga: os
                          pedidos dela têm entrega registrada. */}
                      {selectedRoute.status === "planned" && (
                        <Button
                          size="sm"
                          variant="tertiary"
                          aria-label="Excluir rota"
                          onClick={() => setDeleting(selectedRoute)}
                        >
                          <Icon icon={Trash2} size="sm" />
                        </Button>
                      )}
                    </Inline>
                  </Inline>

                  {selectedRoute.simulated && (
                    <Box
                      surface="surface-muted"
                      border="default"
                      radius="md"
                      padding={3}
                    >
                      <Inline gap={2} align="center">
                        <Icon
                          icon={AlertTriangle}
                          size="sm"
                          className="text-warning"
                        />
                        <Text size="body-sm">
                          Rota <strong>simulada</strong>: gerada sem a API de
                          otimização do Google. Distâncias e horários são
                          estimativas e não devem ser usados para despacho.
                        </Text>
                      </Inline>
                    </Box>
                  )}

                  <Grid columns={3} gap={4}>
                    <DetailStat
                      label="Motorista"
                      value={driverName(selectedRoute)}
                    />
                    <DetailStat
                      label="Veículo"
                      value={vehiclePlate(selectedRoute)}
                    />
                    <DetailStat
                      label="Paradas"
                      value={String(selectedRoute.stops.length)}
                    />
                    <DetailStat
                      label="Distância"
                      value={`${selectedRoute.totalDistanceKm.toFixed(1)} km`}
                    />
                    <DetailStat
                      label="Duração"
                      value={`${selectedRoute.totalDurationMin} min`}
                    />
                    <DetailStat
                      label="Pedidos"
                      value={String(selectedRoute.orderIds.length)}
                    />
                  </Grid>

                  <Stack gap={2}>
                    <Text size="label" weight="medium">
                      Paradas ({selectedRoute.stops.length})
                    </Text>
                    <Stack gap={1.5}>
                      {/* Na ordem de entrega, com o estado de cada parada: é o
                          que o app do entregador vai baixar uma a uma. */}
                      {selectedRoute.stops.map((stop) => {
                        const order = orders?.find(
                          (item) => item.id === stop.id,
                        );
                        return (
                          <Inline
                            key={stop.id}
                            justify="between"
                            gap={3}
                            className="border-border-subtle rounded-md border px-3 py-2"
                          >
                            <Inline gap={2} align="center" className="min-w-0">
                              <Text size="body-sm" color="muted">
                                {stop.sequence}.
                              </Text>
                              <Text size="body-sm" className="truncate">
                                {order?.destination ?? stop.label}
                              </Text>
                            </Inline>
                            <Inline gap={2} align="center" className="shrink-0">
                              {order && (
                                <Text size="caption" color="muted">
                                  {deliveryWindowLabel(order.deliveryWindow)}
                                </Text>
                              )}
                              <StatusBadge
                                tone={
                                  stop.completed
                                    ? "success"
                                    : ORDER_STATUS_META[
                                        order?.status ?? "pending"
                                      ].tone
                                }
                              >
                                {stop.completed
                                  ? "Entregue"
                                  : ORDER_STATUS_META[
                                      order?.status ?? "pending"
                                    ].label}
                              </StatusBadge>
                            </Inline>
                          </Inline>
                        );
                      })}
                      {selectedRoute.stops.length === 0 && (
                        <Text size="body-sm" color="muted">
                          Nenhum pedido associado a esta rota.
                        </Text>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            )}
          </Stack>
        </Grid>
      )}

      <DialogRoot
        open={formOpen}
        onOpenChange={(details) => {
          setFormOpen(details.open);
          if (!details.open && searchParams.get("new"))
            router.replace(pathname);
        }}
      >
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Gerar rota</DialogTitle>
          </DialogHeader>
          <GenerateRouteDialog
            orders={orders ?? []}
            unassigned={unassigned}
            onGenerate={handleGenerate}
            onCancel={closeForm}
            loading={optimizeMutation.isPending}
          />
        </DialogContent>
      </DialogRoot>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Excluir ${deleting?.name}?`}
        description="Remove o registro de otimização inteiro, incluindo as demais rotas geradas na mesma execução. Esta ação não pode ser desfeita."
        tone="danger"
        confirmLabel="Excluir"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={0.5}>
      <Text size="caption" color="muted">
        {label}
      </Text>
      <Text weight="medium">{value}</Text>
    </Stack>
  );
}
