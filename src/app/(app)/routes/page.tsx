"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { DialogContent, DialogHeader, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Box, Grid, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { ROUTE_STATUS_META } from "@/constants/domain";
import { useCreateRoute, useDeleteRoute, useRoutes } from "@/features/routes/hooks";
import { useDrivers } from "@/features/drivers/hooks";
import { useVehicles } from "@/features/vehicles/hooks";
import { useOrders } from "@/features/orders/hooks";
import { RouteForm } from "@/features/routes/route-form";
import { RouteMap } from "@/components/domain/route-map";
import { toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import type { RouteFormInput } from "@/lib/validation/route";
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
  const createMutation = useCreateRoute();
  const deleteMutation = useDeleteRoute();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(() => searchParams.get("new") === "1");
  const [deleting, setDeleting] = useState<Route | null>(null);

  const effectiveSelectedId = selectedId ?? routes?.[0]?.id ?? null;
  const selectedRoute = routes?.find((route) => route.id === effectiveSelectedId) ?? null;

  const driverOptions = useMemo(
    () => (drivers ?? []).map((driver) => ({ value: driver.id, label: driver.name })),
    [drivers],
  );
  const vehicleOptions = useMemo(
    () => (vehicles ?? []).map((vehicle) => ({ value: vehicle.id, label: vehicle.plate })),
    [vehicles],
  );
  const orderOptions = useMemo(
    () => (orders ?? []).map((order) => ({ value: order.id, label: `${order.id} — ${order.destination}` })),
    [orders],
  );

  function driverName(id: string | null) {
    return id ? (drivers?.find((driver) => driver.id === id)?.name ?? "—") : "—";
  }
  function vehiclePlate(id: string | null) {
    return id ? (vehicles?.find((vehicle) => vehicle.id === id)?.plate ?? "—") : "—";
  }

  function closeForm() {
    setFormOpen(false);
    if (searchParams.get("new")) router.replace(pathname);
  }

  async function handleSubmit(values: RouteFormInput) {
    try {
      const created = await createMutation.mutateAsync(values);
      toaster.success({ title: "Rota criada" });
      closeForm();
      setSelectedId(created.id);
    } catch {
      toaster.error({ title: "Não foi possível criar a rota", description: "Tente novamente." });
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toaster.success({ title: "Rota removida" });
      if (selectedId === deleting.id) setSelectedId(null);
      setDeleting(null);
    } catch {
      toaster.error({ title: "Não foi possível remover a rota", description: "Tente novamente." });
    }
  }

  return (
    <Stack gap={6} className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Rotas"
        description="Planejamento e acompanhamento de rotas"
        actions={
          <Button variant="primary" onClick={() => setFormOpen(true)}>
            <Icon icon={Plus} size="sm" /> Nova rota
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
              <button type="button" onClick={() => refetch()} className="text-body-sm font-medium text-primary hover:underline">
                Tentar novamente
              </button>
            }
          />
        </Box>
      ) : !routes || routes.length === 0 ? (
        <Box surface="surface" border="default" radius="lg">
          <EmptyState title="Nenhuma rota cadastrada" description="Crie a primeira rota para começar." />
        </Box>
      ) : (
        <Grid columns={1} gap={4} className="min-h-0 flex-1 lg:grid-cols-[360px_1fr]">
          <Stack gap={3} className="min-h-0">
            <SearchInput value={search} onValueChange={setSearch} placeholder="Buscar rota ou região..." />
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
                        {route.region} · {driverName(route.driverId)}
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
            <Box surface="surface" border="default" radius="lg" className="h-72 overflow-hidden lg:h-80">
              {selectedRoute && <RouteMap points={selectedRoute.stops} className="h-full" />}
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
                    <Inline gap={2}>
                      <StatusBadge tone={ROUTE_STATUS_META[selectedRoute.status].tone}>
                        {ROUTE_STATUS_META[selectedRoute.status].label}
                      </StatusBadge>
                      <Button
                        size="sm"
                        variant="tertiary"
                        aria-label="Excluir rota"
                        onClick={() => setDeleting(selectedRoute)}
                      >
                        <Icon icon={Trash2} size="sm" />
                      </Button>
                    </Inline>
                  </Inline>

                  <Grid columns={3} gap={4}>
                    <DetailStat label="Motorista" value={driverName(selectedRoute.driverId)} />
                    <DetailStat label="Veículo" value={vehiclePlate(selectedRoute.vehicleId)} />
                    <DetailStat label="Paradas" value={String(selectedRoute.stops.length)} />
                  </Grid>

                  <Stack gap={2}>
                    <Text size="label" weight="medium">
                      Pedidos associados ({selectedRoute.orderIds.length})
                    </Text>
                    <Stack gap={1.5}>
                      {selectedRoute.orderIds.map((orderId) => {
                        const order = orders?.find((item) => item.id === orderId);
                        if (!order) return null;
                        return (
                          <Inline key={orderId} justify="between" className="rounded-md border border-border-subtle px-3 py-2">
                            <Text size="body-sm">{order.id} — {order.destination}</Text>
                            <StatusBadge tone={ROUTE_STATUS_META[selectedRoute.status].tone}>
                              {order.deliveryWindow}
                            </StatusBadge>
                          </Inline>
                        );
                      })}
                      {selectedRoute.orderIds.length === 0 && (
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
          if (!details.open && searchParams.get("new")) router.replace(pathname);
        }}
      >
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Nova rota</DialogTitle>
          </DialogHeader>
          <RouteForm
            driverOptions={driverOptions}
            vehicleOptions={vehicleOptions}
            orderOptions={orderOptions}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            loading={createMutation.isPending}
            submitLabel="Criar rota"
          />
        </DialogContent>
      </DialogRoot>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Excluir ${deleting?.name}?`}
        description="Esta ação não pode ser desfeita."
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
