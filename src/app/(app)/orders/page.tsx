"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { DataTable, ListEmpty, type DataTableColumn } from "@/components/tables";
import { StatusBadge } from "@/components/ui/status-badge";
import { DialogContent, DialogHeader, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import {
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  getDrawerSwipeDirection,
} from "@/components/ui/drawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { ORDER_STATUS_META } from "@/constants/domain";
import { useCreateOrder, useDeleteOrder, useOrders, useUpdateOrder } from "@/features/orders/hooks";
import { useCustomers } from "@/features/customers/hooks";
import { useDrivers } from "@/features/drivers/hooks";
import { useVehicles } from "@/features/vehicles/hooks";
import { deliveryWindowLabel } from "@/lib/utils/delivery-window";
import { OrderForm } from "@/features/orders/order-form";
import { toaster } from "@/components/ui/toast";
import type { OrderFormInput } from "@/lib/validation/order";
import type { Order } from "@/types/domain";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function OrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const { data: orders, isLoading, isError, refetch } = useOrders(search);
  const { data: customers } = useCustomers();
  const { data: drivers } = useDrivers();
  const { data: vehicles } = useVehicles();
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const deleteMutation = useDeleteOrder();

  const [formOpen, setFormOpen] = useState(() => searchParams.get("new") === "1");
  const [editing, setEditing] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState<Order | null>(null);
  const [explicitDetail, setExplicitDetail] = useState<Order | null | undefined>(undefined);

  const highlightId = searchParams.get("highlight");
  const detail =
    explicitDetail !== undefined
      ? explicitDetail
      : highlightId
        ? (orders?.find((order) => order.id === highlightId) ?? null)
        : null;

  function setDetail(value: Order | null) {
    setExplicitDetail(value);
    if (highlightId) router.replace(pathname);
  }

  // Entrega avulsa não tem cliente: mostramos o título do pedido.
  const customerName = useCallback(
    (id: string | null) =>
      id ? (customers?.find((customer) => customer.id === id)?.name ?? "—") : "Entrega avulsa",
    [customers],
  );
  const driverName = useCallback(
    (id: string | null) => (id ? (drivers?.find((driver) => driver.id === id)?.name ?? "—") : "—"),
    [drivers],
  );

  const columns: DataTableColumn<Order>[] = useMemo(
    () => [
      {
        id: "id",
        header: "Pedido",
        sortAccessor: (order) => order.id,
        cell: (order) => (
          <Stack gap={0}>
            <Text weight="medium">{order.id}</Text>
            <Text size="caption" color="muted">
              {customerName(order.customerId)}
            </Text>
          </Stack>
        ),
      },
      { id: "destination", header: "Destino", sortAccessor: (order) => order.destination, cell: (order) => order.destination },
      {
        id: "date",
        header: "Data",
        sortAccessor: (order) => order.date,
        cell: (order) =>
          `${new Date(`${order.date}T00:00:00`).toLocaleDateString("pt-BR")} · ${deliveryWindowLabel(order.deliveryWindow)}`,
      },
      { id: "driver", header: "Motorista", cell: (order) => driverName(order.driverId) },
      {
        id: "value",
        header: "Valor",
        align: "right",
        sortAccessor: (order) => order.value ?? 0,
        cell: (order) => valueLabel(order.value),
      },
      {
        id: "status",
        header: "Status",
        cell: (order) => (
          <StatusBadge tone={ORDER_STATUS_META[order.status].tone}>
            {ORDER_STATUS_META[order.status].label}
          </StatusBadge>
        ),
      },
    ],
    [customerName, driverName],
  );

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    if (searchParams.get("new")) router.replace(pathname);
  }

  async function handleSubmit(values: OrderFormInput) {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, input: values });
        toaster.success({ title: "Pedido atualizado" });
      } else {
        await createMutation.mutateAsync(values);
        toaster.success({ title: "Pedido criado" });
      }
      closeForm();
      setEditing(null);
    } catch (error) {
      toaster.error({
        title: "Não foi possível salvar o pedido",
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toaster.success({ title: "Pedido removido" });
      setDeleting(null);
    } catch {
      toaster.error({ title: "Não foi possível remover o pedido", description: "Tente novamente." });
    }
  }

  return (
    <Stack gap={6}>
      <PageHeader
        title="Pedidos"
        description="Gerencie os pedidos em andamento"
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Icon icon={Plus} size="sm" /> Novo pedido
          </Button>
        }
      />

      <SearchInput value={search} onValueChange={setSearch} placeholder="Buscar por número ou destino..." className="max-w-sm" />

      <DataTable
        emptyState={
          <ListEmpty
            search={search}
            entity="pedido"
            emptyTitle="Nenhum pedido cadastrado"
            emptyDescription="Crie um pedido para começar a planejar as entregas."
            action={
              <Button variant="primary" onClick={openCreate}>
                <Icon icon={Plus} size="sm" /> Novo pedido
              </Button>
            }
          />
        }
        columns={columns}
        data={orders ?? []}
        getRowId={(order) => order.id}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
        onRowClick={setDetail}
        rowActions={() => [
          { value: "view", label: "Ver detalhes" },
          { value: "edit", label: "Editar" },
          { value: "delete", label: "Excluir", danger: true, icon: Trash2 },
        ]}
        onRowActionSelect={(order, action) => {
          if (action === "view") setDetail(order);
          if (action === "edit") {
            setEditing(order);
            setFormOpen(true);
          }
          if (action === "delete") setDeleting(order);
        }}
      />

      <DialogRoot
        open={formOpen}
        onOpenChange={(details) => {
          setFormOpen(details.open);
          if (!details.open && searchParams.get("new")) router.replace(pathname);
        }}
      >
        <DialogContent size="3xl">
          <DialogHeader>
            <DialogTitle>{editing ? `Editar pedido ${editing.id}` : "Novo pedido"}</DialogTitle>
          </DialogHeader>
          {/* Desmontar ao fechar: sem isso o formulario reabre com o
              que foi digitado no cadastro anterior. */}
          {formOpen && (
            <OrderForm
              key={editing?.id ?? "new"}
              defaultValues={editing ? toFormValues(editing) : undefined}
              isEditing={!!editing}
              customers={customers ?? []}
              drivers={drivers ?? []}
              vehicles={vehicles ?? []}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              loading={createMutation.isPending || updateMutation.isPending}
              submitLabel={editing ? "Salvar alterações" : "Criar pedido"}
            />
          )}
        </DialogContent>
      </DialogRoot>

      <DrawerRoot
        open={!!detail}
        onOpenChange={(details) => !details.open && setDetail(null)}
        swipeDirection={getDrawerSwipeDirection("right")}
      >
        <DrawerContent side="right">
          {detail && (
            <>
              <DrawerHeader>
                <DrawerTitle>{detail.id}</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <Stack gap={4}>
                  <DetailRow label="Cliente" value={customerName(detail.customerId)} />
                  <DetailRow label="Origem" value={detail.origin} />
                  <DetailRow label="Destino" value={detail.destination} />
                  <DetailRow
                    label="Data / Janela"
                    value={`${new Date(`${detail.date}T00:00:00`).toLocaleDateString("pt-BR")} · ${deliveryWindowLabel(detail.deliveryWindow)}`}
                  />
                  <DetailRow label="Motorista" value={driverName(detail.driverId)} />
                  <DetailRow label="Rota" value={detail.routeId ?? "—"} />
                  <DetailRow label="Valor" value={valueLabel(detail.value)} />
                  <Inline gap={2}>
                    <Text size="body-sm" color="muted">
                      Status:
                    </Text>
                    <StatusBadge tone={ORDER_STATUS_META[detail.status].tone}>
                      {ORDER_STATUS_META[detail.status].label}
                    </StatusBadge>
                  </Inline>
                </Stack>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </DrawerRoot>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={deleting ? `Excluir o pedido #${deleting.id}?` : ""}
        description={
          deleting
            ? `${customerName(deleting.customerId)} — ${deleting.destination}. Esta ação não pode ser desfeita.`
            : "Esta ação não pode ser desfeita."
        }
        tone="danger"
        confirmLabel="Excluir"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}

/** O cadastro guarda nulo onde o formulário espera ausente. */
function toFormValues(order: Order): Partial<OrderFormInput> {
  return { ...order, value: order.value ?? undefined };
}

/** Valor nao informado nao vira "R$ 0,00": zero afirma outra coisa. */
function valueLabel(value: number | null): string {
  return value === null ? "—" : currency.format(value);
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={0.5}>
      <Text size="caption" color="muted">
        {label}
      </Text>
      <Text size="body-sm">{value}</Text>
    </Stack>
  );
}
