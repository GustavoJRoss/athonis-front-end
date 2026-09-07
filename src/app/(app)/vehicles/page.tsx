"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/tables";
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
import { Icon, Stack, Text } from "@/components/ui/primitives";
import { VEHICLE_STATUS_META, VEHICLE_TYPE_LABEL } from "@/constants/domain";
import {
  useCreateVehicle,
  useDeleteVehicle,
  useUpdateVehicle,
  useVehicles,
} from "@/features/vehicles/hooks";
import { useDrivers } from "@/features/drivers/hooks";
import { VehicleForm } from "@/features/vehicles/vehicle-form";
import { toaster } from "@/components/ui/toast";
import type { VehicleFormInput } from "@/lib/validation/vehicle";
import type { Vehicle } from "@/types/domain";

export default function VehiclesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const { data: vehicles, isLoading, isError, refetch } = useVehicles(search);
  const { data: drivers } = useDrivers();
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useDeleteVehicle();

  const [formOpen, setFormOpen] = useState(() => searchParams.get("new") === "1");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState<Vehicle | null>(null);
  const [detail, setDetail] = useState<Vehicle | null>(null);

  const driverName = useCallback(
    (id: string | null) => drivers?.find((driver) => driver.id === id)?.name ?? "—",
    [drivers],
  );

  const columns: DataTableColumn<Vehicle>[] = useMemo(
    () => [
      {
        id: "plate",
        header: "Veículo",
        sortAccessor: (vehicle) => vehicle.name || vehicle.plate,
        cell: (vehicle) => (
          <Stack gap={0}>
            <Text weight="medium">{vehicle.name || vehicle.plate}</Text>
            <Text size="caption" color="muted">
              {[vehicle.plate, [vehicle.brand, vehicle.model].filter(Boolean).join(" ")]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          </Stack>
        ),
      },
      { id: "type", header: "Tipo", cell: (vehicle) => VEHICLE_TYPE_LABEL[vehicle.type] },
      {
        id: "capacityKg",
        header: "Capacidade",
        align: "right",
        sortAccessor: (vehicle) => vehicle.capacityKg ?? 0,
        cell: (vehicle) => capacityLabel(vehicle.capacityKg),
      },
      { id: "driver", header: "Motorista", cell: (vehicle) => driverName(vehicle.driverId) },
      {
        id: "status",
        header: "Status",
        cell: (vehicle) => (
          <StatusBadge tone={VEHICLE_STATUS_META[vehicle.status].tone}>
            {VEHICLE_STATUS_META[vehicle.status].label}
          </StatusBadge>
        ),
      },
    ],
    [driverName],
  );

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    if (searchParams.get("new")) router.replace(pathname);
  }

  async function handleSubmit(values: VehicleFormInput) {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, input: values });
        toaster.success({ title: "Veículo atualizado" });
      } else {
        await createMutation.mutateAsync(values);
        toaster.success({ title: "Veículo criado" });
      }
      closeForm();
      setEditing(null);
    } catch (error) {
      toaster.error({
        title: "Não foi possível salvar o veículo",
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toaster.success({ title: "Veículo removido" });
      setDeleting(null);
    } catch (error) {
      toaster.error({
        title: "Não foi possível remover o veículo",
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  return (
    <Stack gap={6}>
      <PageHeader
        title="Veículos"
        description="Frota e disponibilidade de veículos"
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Icon icon={Plus} size="sm" /> Novo veículo
          </Button>
        }
      />

      <SearchInput
        value={search}
        onValueChange={setSearch}
        placeholder="Buscar por placa, modelo ou marca..."
        className="max-w-sm"
      />

      <DataTable
        columns={columns}
        data={vehicles ?? []}
        getRowId={(vehicle) => vehicle.id}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
        onRowClick={setDetail}
        rowActions={() => [
          { value: "view", label: "Ver detalhes" },
          { value: "edit", label: "Editar" },
          { value: "delete", label: "Excluir", danger: true, icon: Trash2 },
        ]}
        onRowActionSelect={(vehicle, action) => {
          if (action === "view") setDetail(vehicle);
          if (action === "edit") {
            setEditing(vehicle);
            setFormOpen(true);
          }
          if (action === "delete") setDeleting(vehicle);
        }}
      />

      <DialogRoot
        open={formOpen}
        onOpenChange={(details) => {
          setFormOpen(details.open);
          if (!details.open && searchParams.get("new")) router.replace(pathname);
        }}
      >
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar veículo" : "Novo veículo"}</DialogTitle>
          </DialogHeader>
          {/* Desmontar ao fechar: sem isso o formulario reabre com o
              que foi digitado no cadastro anterior. */}
          {formOpen && (
            <VehicleForm
              key={editing?.id ?? "new"}
              defaultValues={editing ? toFormValues(editing) : undefined}
              isEditing={!!editing}
              drivers={drivers ?? []}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              loading={createMutation.isPending || updateMutation.isPending}
              submitLabel={editing ? "Salvar alterações" : "Criar veículo"}
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
                <DrawerTitle>{detail.name || detail.plate}</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <Stack gap={4}>
                  <DetailRow label="Placa" value={detail.plate || "—"} />
                  <DetailRow
                    label="Modelo"
                    value={
                      [detail.brand, detail.model, detail.year].filter(Boolean).join(" ") || "—"
                    }
                  />
                  <DetailRow label="Tipo" value={VEHICLE_TYPE_LABEL[detail.type]} />
                  <DetailRow label="Capacidade" value={capacityLabel(detail.capacityKg)} />
                  <DetailRow label="Motorista" value={driverName(detail.driverId)} />
                  <StatusBadge tone={VEHICLE_STATUS_META[detail.status].tone}>
                    {VEHICLE_STATUS_META[detail.status].label}
                  </StatusBadge>
                </Stack>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </DrawerRoot>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Excluir veículo ${deleting?.name || deleting?.plate}?`}
        description="Esta ação não pode ser desfeita."
        tone="danger"
        confirmLabel="Excluir"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}

/** Capacidade nao informada nao vira "0 kg": zero significa outra coisa. */
function capacityLabel(capacityKg: number | null): string {
  return capacityKg === null ? "—" : `${capacityKg.toLocaleString("pt-BR")} kg`;
}

/** O cadastro guarda nulo onde o formulario espera ausente. */
function toFormValues(vehicle: Vehicle): Partial<VehicleFormInput> {
  return {
    name: vehicle.name,
    plate: vehicle.plate,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year ?? undefined,
    type: vehicle.type,
    capacityKg: vehicle.capacityKg ?? undefined,
    driverId: vehicle.driverId,
    status: vehicle.status,
  };
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
