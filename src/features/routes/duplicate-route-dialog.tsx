"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Stack, Text } from "@/components/ui/primitives";
import { toaster } from "@/components/ui/toast";
import { useDrivers } from "@/features/drivers/hooks";
import { useVehicles } from "@/features/vehicles/hooks";
import { formatDateString } from "@/lib/utils/date";
import type { Route } from "@/types/domain";
import { useDuplicateRoute } from "./hooks";

/**
 * Leva para uma rota nova as paradas que a rota cancelada ainda devia, na
 * mesma ordem. Motorista, veículo e dia vêm preenchidos com os da rota
 * original e com hoje; dá para trocar antes de criar.
 */
export function DuplicateRouteDialog({
  route,
  onClose,
  onCreated,
}: {
  route: Route | null;
  onClose: () => void;
  onCreated?: (created: Route) => void;
}) {
  return (
    <DialogRoot open={!!route} onOpenChange={(details) => !details.open && onClose()}>
      <DialogContent size="md">
        {route && <DuplicateForm key={route.id} route={route} onClose={onClose} onCreated={onCreated} />}
      </DialogContent>
    </DialogRoot>
  );
}

function DuplicateForm({
  route,
  onClose,
  onCreated,
}: {
  route: Route;
  onClose: () => void;
  onCreated?: (created: Route) => void;
}) {
  const { data: drivers } = useDrivers();
  const { data: vehicles } = useVehicles();
  const mutation = useDuplicateRoute();

  const [plannedDate, setPlannedDate] = useState(() => formatDateString(new Date()));
  const [driverId, setDriverId] = useState(route.driverId ?? "");
  const [vehicleId, setVehicleId] = useState(route.vehicleId ?? "");

  const driverOptions: SelectOption[] = (drivers ?? []).map((driver) => ({
    value: driver.id,
    label: driver.name,
  }));
  const vehicleOptions: SelectOption[] = (vehicles ?? []).map((vehicle) => ({
    value: vehicle.id,
    label: [vehicle.name, vehicle.plate].filter(Boolean).join(" — "),
  }));

  const submit = () =>
    mutation.mutate(
      {
        id: route.id,
        input: {
          plannedDate,
          driverId: driverId || undefined,
          vehicleId: vehicleId || undefined,
        },
      },
      {
        onSuccess: (created) => {
          toaster.success({
            title: `${created.name} criada`,
            description: `${created.stops.length} parada(s) da ${route.name}, planejada para ${new Date(`${plannedDate}T00:00:00`).toLocaleDateString("pt-BR")}.`,
          });
          onCreated?.(created);
          onClose();
        },
        onError: (error) =>
          toaster.error({ title: "Não foi possível duplicar a rota", description: error.message }),
      },
    );

  return (
    <DialogForm
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <DialogHeader>
        <DialogTitle>Duplicar {route.name}</DialogTitle>
        <DialogDescription>
          {route.returnedStopCount} parada(s) que ficaram em aberto entram numa rota nova, na mesma
          ordem.
        </DialogDescription>
      </DialogHeader>

      <DialogBody>
        <Stack gap={4}>
          <Input
            label="Dia da entrega"
            type="date"
            required
            value={plannedDate}
            onChange={(event) => setPlannedDate(event.target.value)}
            disabled={mutation.isPending}
          />
          <FormField label="Motorista">
            <Select
              options={driverOptions}
              value={driverId ? [driverId] : []}
              onValueChange={(value) => setDriverId(value[0] ?? "")}
              searchable
              placeholder="Mesmo da rota cancelada"
            />
          </FormField>
          <FormField label="Veículo">
            <Select
              options={vehicleOptions}
              value={vehicleId ? [vehicleId] : []}
              onValueChange={(value) => setVehicleId(value[0] ?? "")}
              placeholder="Mesmo da rota cancelada"
            />
          </FormField>
          <Text size="body-sm" color="muted">
            A rota nova não traz a previsão de chegada da otimização original, que era para outro
            dia. Se quiser horários previstos, gere a rota de novo pela otimização a partir dos
            pedidos.
          </Text>
        </Stack>
      </DialogBody>

      <DialogFooter>
        <Button type="button" variant="tertiary" onClick={onClose} disabled={mutation.isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={mutation.isPending} disabled={!plannedDate}>
          Criar rota
        </Button>
      </DialogFooter>
    </DialogForm>
  );
}
