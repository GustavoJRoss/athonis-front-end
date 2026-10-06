"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2, UsersIcon } from "lucide-react";
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
import { CUSTOMER_STATUS_META } from "@/constants/domain";
import { maskCep, maskDocument, maskPhone } from "@/lib/utils/masks";
import {
  useCreateCustomer,
  useCustomers,
  useDeleteCustomer,
  useUpdateCustomer,
} from "@/features/customers/hooks";
import { CustomerForm } from "@/features/customers/customer-form";
import { toaster } from "@/components/ui/toast";
import type { CustomerFormInput } from "@/lib/validation/customer";
import type { Customer } from "@/types/domain";

export default function CustomersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const { data: customers, isLoading, isError, refetch } = useCustomers(search);
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const [formOpen, setFormOpen] = useState(
    () => searchParams.get("new") === "1",
  );
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const [detail, setDetail] = useState<Customer | null>(null);

  const columns: DataTableColumn<Customer>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Cliente",
        sortAccessor: (customer) => customer.name,
        cell: (customer) => (
          <Stack gap={0}>
            <Text weight="medium">{customer.name}</Text>
            <Text size="caption" color="muted">
              {maskDocument(customer.document, customer.type)}
            </Text>
          </Stack>
        ),
      },
      {
        id: "city",
        header: "Cidade",
        sortAccessor: (customer) => customer.city,
        cell: (customer) => `${customer.city}/${customer.state}`,
      },
      {
        id: "phone",
        header: "Telefone",
        cell: (customer) => maskPhone(customer.phone) || "—",
      },
      {
        id: "orderCount",
        header: "Pedidos",
        align: "right",
        sortAccessor: (customer) => customer.orderCount,
        cell: (customer) => customer.orderCount,
      },
      {
        id: "lastOrderDate",
        header: "Último pedido",
        sortAccessor: (customer) => customer.lastOrderDate ?? "",
        cell: (customer) =>
          customer.lastOrderDate
            ? new Date(customer.lastOrderDate).toLocaleDateString("pt-BR")
            : "—",
      },
      {
        id: "status",
        header: "Status",
        cell: (customer) => (
          <StatusBadge tone={CUSTOMER_STATUS_META[customer.status].tone}>
            {CUSTOMER_STATUS_META[customer.status].label}
          </StatusBadge>
        ),
      },
    ],
    [],
  );

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(customer: Customer) {
    setEditing(customer);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    if (searchParams.get("new")) router.replace(pathname);
  }

  async function handleSubmit(values: CustomerFormInput) {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, input: values });
        toaster.success({ title: "Cliente atualizado" });
      } else {
        await createMutation.mutateAsync(values);
        toaster.success({ title: "Cliente criado" });
      }
      closeForm();
      setEditing(null);
    } catch (error) {
      toaster.error({
        title: "Não foi possível salvar o cliente",
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toaster.success({ title: "Cliente removido" });
      setDeleting(null);
    } catch (error) {
      toaster.error({
        title: "Não foi possível remover o cliente",
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  return (
    <Stack gap={6}>
      <PageHeader
        title="Clientes"
        icon={UsersIcon}
        description="Cadastro e histórico de clientes"
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Icon icon={Plus} size="sm" /> Novo cliente
          </Button>
        }
      />

      <SearchInput
        value={search}
        onValueChange={setSearch}
        placeholder="Buscar por nome, documento ou cidade..."
        className="max-w-sm"
      />

      <DataTable
        emptyState={
          <ListEmpty
            search={search}
            entity="cliente"
            emptyTitle="Nenhum cliente cadastrado"
            emptyDescription="Cadastre o primeiro cliente para poder criar pedidos com endereço de entrega."
            action={
              <Button variant="primary" onClick={openCreate}>
                <Icon icon={Plus} size="sm" /> Novo cliente
              </Button>
            }
          />
        }
        columns={columns}
        data={customers ?? []}
        getRowId={(customer) => customer.id}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
        onRowClick={setDetail}
        rowActions={() => [
          { value: "view", label: "Ver detalhes" },
          { value: "edit", label: "Editar" },
          { value: "delete", label: "Excluir", danger: true, icon: Trash2 },
        ]}
        onRowActionSelect={(customer, action) => {
          if (action === "view") setDetail(customer);
          if (action === "edit") openEdit(customer);
          if (action === "delete") setDeleting(customer);
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
        <DialogContent size="2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar cliente" : "Novo cliente"}
            </DialogTitle>
          </DialogHeader>
          {/* Desmontar ao fechar: sem isso o formulario reabre com o
              que foi digitado no cadastro anterior. */}
          {formOpen && (
            <CustomerForm
              key={editing?.id ?? "new"}
              defaultValues={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              loading={createMutation.isPending || updateMutation.isPending}
              submitLabel={editing ? "Salvar alterações" : "Criar cliente"}
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
                    label={detail.type === "F" ? "CPF" : "CNPJ"}
                    value={maskDocument(detail.document, detail.type)}
                  />
                  <DetailRow
                    label="Telefone"
                    value={maskPhone(detail.phone) || "—"}
                  />
                  <DetailRow label="Email" value={detail.email} />
                  <DetailRow
                    label="Endereço"
                    value={[
                      [detail.address, detail.complement]
                        .filter(Boolean)
                        .join(" - "),
                      detail.district,
                      `${detail.city}/${detail.state}`,
                      maskCep(detail.zipCode),
                    ]
                      .filter(Boolean)
                      .join(" — ")}
                  />
                  <DetailRow
                    label="Pedidos realizados"
                    value={String(detail.orderCount)}
                  />
                  <DetailRow
                    label="Último pedido"
                    value={
                      detail.lastOrderDate
                        ? new Date(detail.lastOrderDate).toLocaleDateString(
                            "pt-BR",
                          )
                        : "—"
                    }
                  />
                  <Inline gap={2}>
                    <Text size="body-sm" color="muted">
                      Status:
                    </Text>
                    <StatusBadge
                      tone={CUSTOMER_STATUS_META[detail.status].tone}
                    >
                      {CUSTOMER_STATUS_META[detail.status].label}
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
