"use client";

import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorState, LoadingState } from "@/components/ui/state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Grid, Stack, Text } from "@/components/ui/primitives";
import { OCCURRENCE_LABEL, ORDER_STATUS_META } from "@/constants/domain";
import { formatDateBr } from "@/lib/utils/date";
import type { RouteComparison } from "@/types/domain";
import { useRouteComparison } from "./field-hooks";
import { formatClock, formatKm, formatMinutes, formatSignedMinutes } from "./format";

/** Planejado × executado de uma rota, parada a parada. */
export function RouteComparisonDialog({
  routeId,
  onClose,
}: {
  routeId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useRouteComparison(routeId);

  return (
    <DialogRoot open={!!routeId} onOpenChange={(details) => !details.open && onClose()}>
      <DialogContent size="3xl">
        <DialogHeader>
          <DialogTitle>Rota #{routeId} — planejado × executado</DialogTitle>
          {data && (
            <DialogDescription>
              {[
                formatDateBr(data.route.plannedDate),
                data.route.driverName,
                data.route.vehicleName,
                data.route.startedAt
                  ? `saída ${formatClock(data.route.startedAt)}`
                  : null,
                data.route.finishedAt
                  ? `encerramento ${formatClock(data.route.finishedAt)}`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogBody>
          {isLoading ? (
            <LoadingState title="Calculando a comparação..." />
          ) : isError || !data ? (
            <ErrorState />
          ) : (
            <Comparison data={data} />
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

function Comparison({ data }: { data: RouteComparison }) {
  const { summary, route } = data;

  return (
    <Stack gap={5}>
      {route.simulated && (
        <Text size="body-sm" color="muted">
          Rota estimada, sem a otimização do Google: a distância e a duração planejadas são
          aproximadas, e o atraso por parada não é calculado.
        </Text>
      )}

      {summary && (
        <Grid columns={4} gap={4} className="grid-cols-2 lg:grid-cols-4">
          <Pair
            label="Distância"
            planned={formatKm(summary.plannedDistanceM)}
            actual={formatKm(summary.actualDistanceM)}
            note={
              summary.pingCount > 1
                ? `${summary.pingCount} pontos de GPS`
                : "Sem rastro de GPS"
            }
          />
          <Pair
            label="Duração"
            planned={formatMinutes(summary.plannedDurationMin)}
            actual={formatMinutes(summary.actualDurationMin)}
          />
          <Pair
            label="Atendimento médio"
            planned="—"
            actual={formatMinutes(summary.avgServiceMin)}
            note={
              summary.idleTimeMin != null
                ? `${formatMinutes(summary.idleTimeMin)} parado fora de entrega`
                : undefined
            }
          />
          <Pair
            label="Paradas fora da ordem"
            planned="0"
            actual={String(summary.stopsOutOfOrder)}
            note={`${summary.stopsDelivered} entregue(s) · ${summary.stopsFailed} não entregue(s)`}
          />
        </Grid>
      )}

      <div className="border-border overflow-x-auto rounded-lg border">
        <table className="text-body-sm w-full border-collapse">
          <thead>
            <tr className="bg-surface-muted text-muted text-left">
              <th className="px-3 py-2 font-medium">Ordem (plan. → real)</th>
              <th className="px-3 py-2 font-medium">Parada</th>
              <th className="px-3 py-2 text-right font-medium">Previsto</th>
              <th className="px-3 py-2 text-right font-medium">Chegada</th>
              <th className="px-3 py-2 text-right font-medium">Atraso</th>
              <th className="px-3 py-2 text-right font-medium">Atendimento</th>
              <th className="px-3 py-2 font-medium">Situação</th>
            </tr>
          </thead>
          <tbody>
            {data.stops.map((stop) => {
              const foraDeOrdem =
                stop.actualSequence != null &&
                stop.plannedSequence != null &&
                stop.actualSequence !== stop.plannedSequence;
              return (
                <tr key={stop.orderId} className="border-border-subtle border-t align-top">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {stop.plannedSequence ?? "—"} → {stop.actualSequence ?? "—"}
                    {foraDeOrdem && (
                      <StatusBadge tone="warning" className="ml-2">
                        Fora de ordem
                      </StatusBadge>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <Text size="body-sm" weight="medium">
                      {stop.clientName ?? stop.title}
                    </Text>
                    <Text size="caption" color="muted">
                      {stop.address}
                    </Text>
                    {stop.notes && <Text size="caption">{stop.notes}</Text>}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {route.simulated ? "—" : formatClock(stop.plannedArrival)}
                  </td>
                  <td className="px-3 py-2 text-right">{formatClock(stop.actualArrival)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {formatSignedMinutes(stop.delayMin)}
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {formatMinutes(stop.serviceMin)}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge tone={ORDER_STATUS_META[stop.status]?.tone ?? "muted"}>
                      {stop.occurrenceType
                        ? (OCCURRENCE_LABEL[stop.occurrenceType] ?? stop.occurrenceType)
                        : (ORDER_STATUS_META[stop.status]?.label ?? stop.status)}
                    </StatusBadge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Stack>
  );
}

function Pair({
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
    <Stack gap={0.5}>
      <Text size="caption" color="muted">
        {label}
      </Text>
      <Text size="body-lg" weight="semibold">
        {actual}
      </Text>
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
