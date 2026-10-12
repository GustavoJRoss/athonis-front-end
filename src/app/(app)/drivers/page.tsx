"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Smartphone, Trash2, UserRoundIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  ListEmpty,
  type DataTableColumn,
} from "@/components/tables";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { cnhCategoryDescription, DRIVER_STATUS_META } from "@/constants/domain";
import { maskCnh, maskCpf, maskPhone } from "@/lib/utils/masks";
import { validadeCnh, validadeCnhLabel } from "@/lib/utils/cnh";
import { formatDateBr } from "@/lib/utils/date";
import {
  useCreateDriver,
  useDeleteDriver,
  useDrivers,
  useUpdateDriver,
} from "@/features/drivers/hooks";
import { useVehicles } from "@/features/vehicles/hooks";
import { DriverForm } from "@/features/drivers/driver-form";
import { DriverAccessDialog } from "@/features/drivers/driver-access-dialog";
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

  const [formOpen, setFormOpen] = useState(
    () => searchParams.get("new") === "1",
  );
  const [editing, setEditing] = useState<Driver | null>(null);
  const [deleting, setDeleting] = useState<Driver | null>(null);
  const [detail, setDetail] = useState<Driver | null>(null);
  const [accessOf, setAccessOf] = useState<Driver | null>(null);

  // O vínculo é o veículo apontar para o motorista. Comparar vehicle.id com
  // driverId casaria dois identificadores sem relação (motorista 1 x veículo 1).
  const vehiclePlate = useCallback(
    (driverId: string | null) =>
      vehicles?.find(
        (vehicle) => vehicle.driverId !== null && vehicle.driverId === driverId,
      )?.plate ?? "—",
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
              {maskCpf(driver.document) || "—"}
            </Text>
          </Stack>
        ),
      },
      {
        id: "cnh",
        header: "Habilitação",
        cell: (driver) => <CnhCell driver={driver} />,
      },
      {
        id: "vehicle",
        header: "Veículo",
        cell: (driver) => vehiclePlate(driver.id),
      },
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
    } catch (error) {
      toaster.error({
        title: "Não foi possível salvar o motorista",
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toaster.success({ title: "Motorista removido" });
      setDeleting(null);
    } catch (error) {
      toaster.error({
        title: "Não foi possível remover o motorista",
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  return (
    <Stack gap={6}>
      <PageHeader
        title="Motoristas"
        icon={UserRoundIcon}
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
        emptyState={
          <ListEmpty
            search={search}
            entity="motorista"
            emptyTitle="Nenhum motorista cadastrado"
            emptyDescription="Cadastre um motorista para poder montar rotas."
            action={
              <Button variant="primary" onClick={openCreate}>
                <Icon icon={Plus} size="sm" /> Novo motorista
              </Button>
            }
          />
        }
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
          { value: "access", label: "Acesso ao aplicativo", icon: Smartphone },
          { value: "delete", label: "Excluir", danger: true, icon: Trash2 },
        ]}
        onRowActionSelect={(driver, action) => {
          if (action === "view") setDetail(driver);
          if (action === "edit") {
            setEditing(driver);
            setFormOpen(true);
          }
          if (action === "access") setAccessOf(driver);
          if (action === "delete") setDeleting(driver);
        }}
      />

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
            <DialogTitle>
              {editing ? "Editar motorista" : "Novo motorista"}
            </DialogTitle>
          </DialogHeader>
          {/* Desmontar ao fechar: sem isso o formulario reabre com o
              que foi digitado no cadastro anterior. */}
          {formOpen && (
            <DriverForm
              key={editing?.id ?? "new"}
              defaultValues={editing ?? undefined}
              isEditing={!!editing}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              loading={createMutation.isPending || updateMutation.isPending}
              submitLabel={
                editing ? "Salvar alterações" : "Cadastrar motorista"
              }
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
                <DrawerTitle>{detail.name}</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <Stack gap={4}>
                  <DetailRow
                    label="CPF"
                    value={maskCpf(detail.document) || "—"}
                  />
                  <DetailRow label="CNH" value={maskCnh(detail.cnh) || "—"} />
                  <DetailRow
                    label="Categoria"
                    value={
                      detail.cnhCategory
                        ? `${detail.cnhCategory} — ${cnhCategoryDescription(detail.cnhCategory)}`
                        : "—"
                    }
                  />
                  <Stack gap={0.5}>
                    <Text size="caption" color="muted">
                      Validade da CNH
                    </Text>
                    <Inline gap={2} align="center">
                      <Text size="body-sm">
                        {formatDateBr(detail.cnhExpiration)}
                      </Text>
                      <CnhValidadeBadge expiration={detail.cnhExpiration} />
                    </Inline>
                  </Stack>
                  <DetailRow
                    label="Telefone"
                    value={maskPhone(detail.phone) || "—"}
                  />
                  <DetailRow label="Veículo" value={vehiclePlate(detail.id)} />
                  <DetailRow
                    label="Entregas realizadas"
                    value={String(detail.deliveryCount)}
                  />
                  <DetailRow
                    label="Performance"
                    value={`${detail.performance}%`}
                  />
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

      <DriverAccessDialog driver={accessOf} onClose={() => setAccessOf(null)} />

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

/**
 * Categoria e validade juntas: uma sem a outra nao responde se o motorista
 * pode assumir a rota de amanha.
 */
function CnhCell({ driver }: { driver: Driver }) {
  if (!driver.cnhCategory && !driver.cnhExpiration) {
    return (
      <Text size="body-sm" color="muted">
        —
      </Text>
    );
  }

  return (
    <Stack gap={0.5}>
      <Text size="body-sm" weight="medium">
        {driver.cnhCategory ?? "—"}
      </Text>
      <Inline gap={2} align="center">
        <Text size="caption" color="muted">
          {formatDateBr(driver.cnhExpiration)}
        </Text>
        <CnhValidadeBadge expiration={driver.cnhExpiration} />
      </Inline>
    </Stack>
  );
}

function CnhValidadeBadge({ expiration }: { expiration: string | null }) {
  const validade = validadeCnh(expiration);
  const label = validadeCnhLabel(validade);
  if (!label) return null;

  return (
    <StatusBadge tone={validade.estado === "vencida" ? "danger" : "warning"}>
      {label}
    </StatusBadge>
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
