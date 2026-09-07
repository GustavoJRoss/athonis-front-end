"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Box, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { ORDER_STATUS_META } from "@/constants/domain";
import type { Order } from "@/types/domain";

export type UnassignedOrder = { orderId: number; reason: string };

export type GenerateRouteDialogProps = {
  orders: Order[];
  loading?: boolean;
  unassigned?: UnassignedOrder[];
  onGenerate: (orderIds: string[]) => Promise<void> | void;
  onCancel: () => void;
};

/**
 * Um pedido só é roteirizável com veículo, motorista e endereço completos —
 * as mesmas regras do backend, mostradas aqui antes de enviar para evitar
 * uma otimização que já se sabe que vai excluir o pedido.
 */
function blockingReason(order: Order): string | null {
  if (!order.driverId && !order.vehicleId) return "Sem motorista e sem veículo";
  if (!order.vehicleId) return "Sem veículo";
  if (!order.driverId) return "Sem motorista";
  if (!order.street || !order.city || !order.state) return "Endereço incompleto";
  if (order.status === "delivered") return "Já entregue";
  if (order.status === "cancelled") return "Cancelado";
  return null;
}

export function GenerateRouteDialog({
  orders,
  loading = false,
  unassigned,
  onGenerate,
  onCancel,
}: GenerateRouteDialogProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders
      .map((order) => ({ order, blocked: blockingReason(order) }))
      .filter(({ order }) =>
        query
          ? order.title.toLowerCase().includes(query) ||
            order.destination.toLowerCase().includes(query) ||
            order.customerName.toLowerCase().includes(query)
          : true,
      );
  }, [orders, search]);

  const selectableIds = useMemo(
    () => rows.filter((row) => !row.blocked).map((row) => row.order.id),
    [rows],
  );

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    setSelected((current) =>
      current.size === selectableIds.length ? new Set() : new Set(selectableIds),
    );
  }

  return (
    <>
      <DialogBody>
        <Stack gap={4}>
          <Text size="body-sm" color="muted">
            Selecione os pedidos a roteirizar. Eles são agrupados por veículo e motorista —
            cada dupla gera uma rota.
          </Text>

          <SearchInput
            value={search}
            onValueChange={setSearch}
            placeholder="Buscar por título, cliente ou endereço..."
          />

          {unassigned && unassigned.length > 0 && (
            <Box surface="surface-muted" border="default" radius="md" padding={3}>
              <Stack gap={2}>
                <Inline gap={2} align="center">
                  <Icon icon={AlertTriangle} size="sm" className="text-warning" />
                  <Text size="label" weight="medium">
                    {unassigned.length} pedido(s) ficaram de fora da última geração
                  </Text>
                </Inline>
                <Stack gap={1}>
                  {unassigned.map((item) => (
                    <Text key={item.orderId} size="caption" color="muted">
                      Pedido {item.orderId}: {item.reason}
                    </Text>
                  ))}
                </Stack>
              </Stack>
            </Box>
          )}

          <Inline justify="between" align="center">
            <Text size="label" weight="medium">
              {selected.size} de {selectableIds.length} selecionado(s)
            </Text>
            <Button size="sm" variant="tertiary" onClick={toggleAll} disabled={selectableIds.length === 0}>
              {selected.size === selectableIds.length && selectableIds.length > 0
                ? "Limpar seleção"
                : "Selecionar todos"}
            </Button>
          </Inline>

          <Stack gap={2} className="max-h-80 overflow-y-auto pr-1">
            {rows.length === 0 && (
              <Text size="body-sm" color="muted">
                Nenhum pedido encontrado.
              </Text>
            )}

            {rows.map(({ order, blocked }) => (
              <Box
                key={order.id}
                surface="surface"
                border="default"
                radius="md"
                padding={3}
                className={blocked ? "opacity-60" : undefined}
              >
                <Inline justify="between" align="start" gap={3}>
                  <Inline gap={3} align="start">
                    <Checkbox
                      checked={selected.has(order.id)}
                      disabled={!!blocked}
                      onCheckedChange={() => toggle(order.id)}
                    />
                    <Stack gap={0.5}>
                      <Text weight="medium">{order.title}</Text>
                      <Text size="caption" color="muted">
                        {order.customerName || `Cliente ${order.customerId}`} · {order.destination}
                      </Text>
                      {blocked && (
                        <Text size="caption" className="text-warning">
                          Não roteirizável: {blocked}
                        </Text>
                      )}
                    </Stack>
                  </Inline>
                  <StatusBadge tone={ORDER_STATUS_META[order.status].tone}>
                    {ORDER_STATUS_META[order.status].label}
                  </StatusBadge>
                </Inline>
              </Box>
            ))}
          </Stack>
        </Stack>
      </DialogBody>

      <DialogFooter>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          loading={loading}
          disabled={selected.size === 0}
          onClick={() => onGenerate(Array.from(selected))}
        >
          <Icon icon={RouteIcon} size="sm" /> Gerar rota
        </Button>
      </DialogFooter>
    </>
  );
}
