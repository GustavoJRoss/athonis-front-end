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
import { Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { DRIVER_STATUS_META } from "@/constants/domain";
import {
  useCreateDriver,
  useDeleteDriver,
  useDrivers,
  useUpdateDriver,
} from "@/features/drivers/hooks";
import { useVehicles } from "@/features/vehicles/hooks";
import { DriverForm } from "@/features/drivers/driver-form";
import { toaster } from "@/components/ui/toast";
import type { DriverFormInput } from "@/lib/validation/driver";
import type { Driver } from "@/types/domain";

export default function DriversPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const { data: driverList, isLoading, isError, refetch } = useDrivers(search);
  const { data: vehicles } = useVehicles();
  const createMutation = useCreateDriver();
  const updateMutation = useUpdateDriver();
  const deleteMutation = useDeleteDriver();

  const [formOpen, setFormOpen] = useState(() => searchParams.get("new") === "1");
  const [editing, setEditing] = useState<Driver | null>(null);
  const [deleting, setDeleting] = useState<Driver | null>(null);
  const [detail, setDetail] = useState<Driver | null>(null);

  const vehiclePlate = useCallback(
    (id: string | null) =>
      vehicles?.find((vehicle) => vehicle.driverId === id || vehicle.id === id)?.plate ?? "—",
    [vehicles],
  );

  const columns: DataTableColumn<Driver>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Motorista",
        sortAccessor: (driver) => driver.name,
        cell: (driver) => (
          <Stack gap={0}>
            <Text weight="medium">{driver.name}</Text>
            <Text size="caption" color="muted">
              {driver.document}
            </Text>
          </Stack>
        ),
      },
      { id: "vehicle", header: "Veículo", cell: (driver) => vehiclePlate(driver.id) },
      {
        id: "deliveryCount",
        header: "Entregas",
        align: "right",
        sortAccessor: (driver) => driver.deliveryCount,
        cell: (driver) => driver.deliveryCount,
      },
      {
        id: "performance",
        header: "Performance",
        align: "right",
        sortAccessor: (driver) => driver.performance,
        cell: (driver) => `${driver.performance}%`,
      },
      {
        id: "status",
        header: "Status",
        cell: (driver) => (
          <StatusBadge tone={DRIVER_STATUS_META[driver.status].tone}>
            {DRIVER_STATUS_META[driver.status].label}
          </StatusBadge>
        ),
      },
    ],
    [vehiclePlate],
  );

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    if (searchParams.get("new")) router.replace(pathname);
  }

  async function handleSubmit(values: DriverFormInput) {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, input: values });
        toaster.success({ title: "Motorista atualizado" });
      } else {
        await createMutation.mutateAsync(values);
        toaster.success({ title: "Motorista cadastrado" });
      }
      closeForm();
      setEditing(null);
    } catch {
      toaster.error({ title: "Não foi possível salvar o motorista", description: "Tente novamente." });
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toaster.success({ title: "Motorista removido" });
      setDeleting(null);
    } catch {
      toaster.error({ title: "Não foi possível remover o motorista", description: "Tente novamente." });
    }
  }

  return (
    <Stack gap={6}>
      <PageHeader
        title="Motoristas"
        description="Cadastro e performance dos motoristas"
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Icon icon={Plus} size="sm" /> Novo motorista
          </Button>
        }
      />

      <SearchInput
        value={search}
        onValueChange={setSearch}
        placeholder="Buscar por nome, CPF ou CNH..."
        className="max-w-sm"
      />

      <DataTable
        columns={columns}
        data={driverList ?? []}
        getRowId={(driver) => driver.id}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
        onRowClick={setDetail}
        rowActions={() => [
          { value: "view", label: "Ver detalhes" },
          { value: "edit", label: "Editar" },
          { value: "delete", label: "Excluir", danger: true, icon: Trash2 },
        ]}
        onRowActionSelect={(driver, action) => {
          if (action === "view") setDetail(driver);
          if (action === "edit") {
            setEditing(driver);
            setFormOpen(true);
          }
          if (action === "delete") setDeleting(driver);
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
            <DialogTitle>{editing ? "Editar motorista" : "Novo motorista"}</DialogTitle>
          </DialogHeader>
          <DriverForm
            key={editing?.id ?? "new"}
            defaultValues={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            loading={createMutation.isPending || updateMutation.isPending}
            submitLabel={editing ? "Salvar alterações" : "Cadastrar motorista"}
          />
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
                <DrawerTitle>{detail.name}</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <Stack gap={4}>
                  <DetailRow label="CPF" value={detail.document} />
                  <DetailRow label="CNH" value={detail.cnh} />
                  <DetailRow label="Telefone" value={detail.phone} />
                  <DetailRow label="Veículo" value={vehiclePlate(detail.id)} />
                  <DetailRow label="Entregas realizadas" value={String(detail.deliveryCount)} />
                  <DetailRow label="Performance" value={`${detail.performance}%`} />
                  <Inline gap={2}>
                    <Text size="body-sm" color="muted">
                      Status:
                    </Text>
                    <StatusBadge tone={DRIVER_STATUS_META[detail.status].tone}>
                      {DRIVER_STATUS_META[detail.status].label}
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
