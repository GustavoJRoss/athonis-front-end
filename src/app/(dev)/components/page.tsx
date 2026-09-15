"use client";

import { useState } from "react";
import {
  Info,
  Package,
  PackageSearch,
  Plus,
  Settings,
  Trash2,
  TriangleAlert,
  UserPlus,
} from "lucide-react";
import {
  Box,
  Container,
  Grid,
  Heading,
  Icon,
  Inline,
  Separator,
  Stack,
  Text,
} from "@/components/ui/primitives";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  getDrawerSwipeDirection,
} from "@/components/ui/drawer";
import {
  PopoverContent,
  PopoverDescription,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchInput } from "@/components/ui/search-input";
import { FilterBar, FilterChip } from "@/components/ui/filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/ui/metric-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { Pagination } from "@/components/ui/pagination";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Tabs } from "@/components/ui/tabs";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { CommandMenu } from "@/components/ui/command-menu";
import { toaster } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { UserMenu } from "@/components/ui/user-menu";
import { PageHeader, SectionHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormField, FormSection } from "@/components/ui/form-field";
import { DataTable, type DataTableColumn } from "@/components/tables";

type DemoOrder = {
  id: string;
  customer: string;
  status: "pending" | "delivered";
  total: string;
};
const DEMO_ORDERS: DemoOrder[] = [
  {
    id: "PED-1001",
    customer: "Distribuidora Aurora Ltda",
    status: "delivered",
    total: "R$ 3.240,00",
  },
  {
    id: "PED-1002",
    customer: "Mercado Bom Preço",
    status: "pending",
    total: "R$ 890,50",
  },
  {
    id: "PED-1003",
    customer: "Comércio Vitória Sul",
    status: "pending",
    total: "R$ 1.520,00",
  },
];
const DEMO_COLUMNS: DataTableColumn<DemoOrder>[] = [
  {
    id: "id",
    header: "Pedido",
    cell: (row) => row.id,
    sortAccessor: (row) => row.id,
  },
  {
    id: "customer",
    header: "Cliente",
    cell: (row) => row.customer,
    sortAccessor: (row) => row.customer,
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <StatusBadge tone={row.status === "delivered" ? "success" : "warning"}>
        {row.status === "delivered" ? "Entregue" : "Pendente"}
      </StatusBadge>
    ),
  },
  { id: "total", header: "Total", align: "right", cell: (row) => row.total },
];

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "tertiary",
  "ghost",
  "destructive",
];

function DemoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Stack gap={3} as="section">
      <Heading level={3}>{title}</Heading>
      <Separator />
      {children}
    </Stack>
  );
}

export default function ComponentsDemoPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checked, setChecked] = useState<boolean | "indeterminate">(true);
  const [radioValue, setRadioValue] = useState<string | null>("standard");
  const [switchOn, setSwitchOn] = useState(true);
  const [selectValue, setSelectValue] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("overview");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [paginationPage, setPaginationPage] = useState(1);

  return (
    <Container as="main" width="default">
      <Stack gap={12} className="py-12">
        <Stack gap={2}>
          <Heading level={1}>Design System — ATHONIS</Heading>
          <Text color="muted">
            Página de revisão visual dos componentes. Não é uma tela de produto.
          </Text>
        </Stack>

        <Stack gap={4} as="section">
          <Heading level={2}>Primitives</Heading>
          <Separator />

          <Stack gap={2}>
            <Heading level={4}>Heading</Heading>
            <Stack gap={1}>
              <Heading level="display">Display</Heading>
              <Heading level={1}>Heading 1</Heading>
              <Heading level={2}>Heading 2</Heading>
              <Heading level={3}>Heading 3</Heading>
              <Heading level={4}>Heading 4</Heading>
            </Stack>
          </Stack>

          <Stack gap={2}>
            <Heading level={4}>Text</Heading>
            <Stack gap={1}>
              <Text size="body-lg">Body Large — texto de introdução.</Text>
              <Text size="body">Body — texto padrão de conteúdo.</Text>
              <Text size="body-sm">Body Small — texto denso de tabela.</Text>
              <Text size="caption" color="muted">
                Caption — metadado ou timestamp.
              </Text>
              <Text size="label" weight="medium">
                Label — rótulo de campo
              </Text>
            </Stack>
          </Stack>

          <Stack gap={2}>
            <Heading level={4}>Box / Stack / Inline / Grid</Heading>
            <Box surface="surface" border="default" radius="lg" padding={4}>
              <Stack gap={3}>
                <Text weight="semibold">Box com surface + border + radius</Text>
                <Inline gap={2}>
                  <Box surface="surface-muted" radius="md" padding={3}>
                    <Text size="body-sm">Inline item 1</Text>
                  </Box>
                  <Box surface="surface-muted" radius="md" padding={3}>
                    <Text size="body-sm">Inline item 2</Text>
                  </Box>
                </Inline>
                <Grid columns={3} gap={3}>
                  <Box
                    surface="background"
                    border="subtle"
                    radius="md"
                    padding={3}
                  >
                    <Text size="body-sm">Grid 1</Text>
                  </Box>
                  <Box
                    surface="background"
                    border="subtle"
                    radius="md"
                    padding={3}
                  >
                    <Text size="body-sm">Grid 2</Text>
                  </Box>
                  <Box
                    surface="background"
                    border="subtle"
                    radius="md"
                    padding={3}
                  >
                    <Text size="body-sm">Grid 3</Text>
                  </Box>
                </Grid>
              </Stack>
            </Box>
          </Stack>

          <Stack gap={2}>
            <Heading level={4}>Icon</Heading>
            <Inline gap={4}>
              <Icon icon={PackageSearch} size="sm" />
              <Icon icon={PackageSearch} size="md" />
              <Icon icon={PackageSearch} size="lg" color="primary" />
              <Icon icon={PackageSearch} size="xl" color="muted" />
            </Inline>
          </Stack>
        </Stack>

        <Stack gap={8} as="section">
          <Heading level={2}>Primary</Heading>

          <DemoSection title="Button">
            <Stack gap={4}>
              {VARIANTS.map((variant) => (
                <Inline key={variant} gap={3} wrap>
                  <Text
                    size="body-sm"
                    color="muted"
                    className="w-20 capitalize"
                  >
                    {variant}
                  </Text>
                  <Button variant={variant} size="sm">
                    Small
                  </Button>
                  <Button variant={variant} size="md">
                    Medium
                  </Button>
                  <Button variant={variant} size="lg">
                    Large
                  </Button>
                  <Button variant={variant} disabled>
                    Disabled
                  </Button>
                  <Button variant={variant} loading>
                    Loading
                  </Button>
                </Inline>
              ))}
            </Stack>
          </DemoSection>

          <DemoSection title="Input">
            <Grid columns={2} gap={4}>
              <Input label="Nome" placeholder="Digite seu nome" />
              <Input
                label="Email"
                description="Usamos para contato sobre o pedido"
                placeholder="voce@empresa.com"
              />
              <Input
                label="Busca"
                placeholder="Buscar pedidos..."
                prefix={<Icon icon={PackageSearch} size="sm" />}
              />
              <Input
                label="Com erro"
                defaultValue="valor inválido"
                error="Este campo é obrigatório"
              />
              <Input label="Desabilitado" placeholder="Não editável" disabled />
              <Input label="Carregando" placeholder="Validando..." loading />
            </Grid>
          </DemoSection>

          <DemoSection title="Textarea">
            <Textarea
              label="Observações"
              description="Detalhes adicionais do pedido"
              placeholder="Escreva aqui..."
            />
          </DemoSection>

          <DemoSection title="Select">
            <Grid columns={2} gap={4}>
              <Select
                label="Status"
                placeholder="Selecione o status"
                options={[
                  { value: "pending", label: "Pendente" },
                  { value: "in_route", label: "Em rota" },
                  { value: "delivered", label: "Entregue" },
                ]}
              />
              <Select
                label="Motoristas (múltiplo + busca)"
                placeholder="Selecione motoristas"
                searchable
                multiple
                value={selectValue}
                onValueChange={setSelectValue}
                options={[
                  { value: "1", label: "Carlos Eduardo Silva" },
                  { value: "2", label: "Fernanda Souza Lima" },
                  { value: "3", label: "João Pedro Almeida" },
                ]}
              />
              <Select
                label="Carregando"
                placeholder="Buscando..."
                loading
                options={[]}
              />
              <Select
                label="Desabilitado"
                placeholder="Indisponível"
                disabled
                options={[]}
              />
            </Grid>
          </DemoSection>

          <DemoSection title="Checkbox / Radio / Switch">
            <Stack gap={4}>
              <Inline gap={6} wrap>
                <Checkbox
                  label="Aceito os termos"
                  checked={checked}
                  onCheckedChange={setChecked}
                />
                <Checkbox label="Indeterminado" checked="indeterminate" />
                <Checkbox label="Desabilitado" disabled />
              </Inline>
              <Radio
                label="Tipo de frete"
                value={radioValue}
                onValueChange={setRadioValue}
                orientation="horizontal"
                options={[
                  { value: "standard", label: "Padrão" },
                  { value: "express", label: "Expresso" },
                  { value: "scheduled", label: "Agendado" },
                ]}
              />
              <Inline gap={6}>
                <Switch
                  label="Notificações ativas"
                  checked={switchOn}
                  onCheckedChange={setSwitchOn}
                />
                <Switch label="Carregando" loading defaultChecked />
                <Switch label="Desabilitado" disabled />
              </Inline>
            </Stack>
          </DemoSection>

          <DemoSection title="DatePicker">
            <Grid columns={2} gap={4}>
              <DatePicker
                label="Data de entrega"
                value={date}
                onValueChange={setDate}
              />
              <DatePicker label="Desabilitado" disabled />
            </Grid>
          </DemoSection>

          <DemoSection title="Dialog">
            <Inline gap={3}>
              <DialogRoot
                open={dialogOpen}
                onOpenChange={(d) => setDialogOpen(d.open)}
              >
                <DialogTrigger asChild>
                  <Button variant="secondary">Abrir dialog</Button>
                </DialogTrigger>
                <DialogContent loading={dialogLoading}>
                  <DialogHeader>
                    <DialogTitle>Confirmar pedido</DialogTitle>
                    <DialogDescription>
                      Revise os dados antes de confirmar a criação do pedido.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogBody>
                    <Text size="body-sm" color="muted">
                      Conteúdo do dialog vai aqui — formulário, detalhes, etc.
                    </Text>
                  </DialogBody>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      loading={dialogLoading}
                      onClick={() => {
                        setDialogLoading(true);
                        setTimeout(() => {
                          setDialogLoading(false);
                          setDialogOpen(false);
                        }, 1200);
                      }}
                    >
                      Confirmar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </DialogRoot>
            </Inline>
          </DemoSection>

          <DemoSection title="Drawer">
            <Inline gap={3}>
              <DrawerRoot
                open={drawerOpen}
                onOpenChange={(d) => setDrawerOpen(d.open)}
                swipeDirection={getDrawerSwipeDirection("right")}
              >
                <DrawerTrigger asChild>
                  <Button variant="secondary">Abrir drawer</Button>
                </DrawerTrigger>
                <DrawerContent side="right">
                  <DrawerHeader>
                    <DrawerTitle>Filtros</DrawerTitle>
                    <DrawerDescription>
                      Refine a listagem por status e período.
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerBody>
                    <Text size="body-sm" color="muted">
                      Conteúdo do drawer — filtros, detalhes, formulário.
                    </Text>
                  </DrawerBody>
                  <DrawerFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Limpar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Aplicar
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </DrawerRoot>
            </Inline>
          </DemoSection>

          <DemoSection title="Popover / Tooltip">
            <Inline gap={6}>
              <PopoverRoot>
                <PopoverTrigger asChild>
                  <Button variant="tertiary">
                    <Icon icon={Settings} size="sm" /> Opções
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverTitle>Configurações rápidas</PopoverTitle>
                  <PopoverDescription>
                    Ajustes desta visualização.
                  </PopoverDescription>
                </PopoverContent>
              </PopoverRoot>

              <TooltipRoot>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Informação"
                    className="border-border text-muted hover:bg-surface-hover flex size-8 items-center justify-center rounded-full border"
                  >
                    <Icon icon={Info} size="sm" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Tooltip com informação adicional
                </TooltipContent>
              </TooltipRoot>
            </Inline>
          </DemoSection>
        </Stack>

        <Stack gap={8} as="section">
          <Heading level={2}>Secondary</Heading>

          <DemoSection title="PageHeader / SectionHeader">
            <Stack gap={4}>
              <PageHeader
                title="Pedidos"
                description="Gerencie os pedidos em andamento"
                breadcrumb={
                  <Breadcrumb
                    items={[
                      { label: "Dashboard", href: "#" },
                      { label: "Pedidos" },
                    ]}
                  />
                }
                actions={
                  <Button variant="primary" size="sm">
                    <Icon icon={Plus} size="sm" /> Novo pedido
                  </Button>
                }
              />
              <SectionHeader
                title="Itens recentes"
                description="Últimas atualizações"
              />
            </Stack>
          </DemoSection>

          <DemoSection title="StatusBadge">
            <Inline gap={2} wrap>
              <StatusBadge tone="success">Entregue</StatusBadge>
              <StatusBadge tone="warning">Pendente</StatusBadge>
              <StatusBadge tone="danger">Atrasado</StatusBadge>
              <StatusBadge tone="info">Em rota</StatusBadge>
              <StatusBadge tone="primary">Planejado</StatusBadge>
              <StatusBadge tone="muted">Cancelado</StatusBadge>
            </Inline>
          </DemoSection>

          <DemoSection title="MetricCard">
            <Grid columns={3} gap={4}>
              <MetricCard
                label="Pedidos hoje"
                value="128"
                icon={Package}
                trend={{ direction: "up", label: "+12% vs ontem" }}
              />
              <MetricCard
                label="Entregas atrasadas"
                value="4"
                trend={{ direction: "down", label: "-2 vs ontem" }}
              />
              <MetricCard label="Rotas ativas" value="—" loading />
            </Grid>
          </DemoSection>

          <DemoSection title="SearchInput / FilterBar">
            <Stack gap={3}>
              <SearchInput
                value={search}
                onValueChange={setSearch}
                placeholder="Buscar pedidos..."
              />
              <FilterBar onClear={() => {}}>
                <FilterChip label="Status: Pendente" onRemove={() => {}} />
                <FilterChip label="Motorista: Carlos" onRemove={() => {}} />
              </FilterBar>
            </Stack>
          </DemoSection>

          <DemoSection title="Empty / Error / Loading State">
            <Grid columns={3} gap={4}>
              <Box surface="surface-muted" radius="lg">
                <EmptyState
                  title="Nenhum pedido"
                  description="Crie o primeiro pedido para começar."
                />
              </Box>
              <Box surface="surface-muted" radius="lg">
                <ErrorState />
              </Box>
              <Box surface="surface-muted" radius="lg">
                <LoadingState />
              </Box>
            </Grid>
          </DemoSection>

          <DemoSection title="Pagination">
            <Pagination
              count={95}
              pageSize={10}
              page={paginationPage}
              onPageChange={setPaginationPage}
            />
          </DemoSection>

          <DemoSection title="Tabs">
            <Tabs
              value={tab}
              onValueChange={setTab}
              items={[
                {
                  value: "overview",
                  label: "Visão geral",
                  content: (
                    <Text size="body-sm" color="muted">
                      Conteúdo da aba Visão geral
                    </Text>
                  ),
                },
                {
                  value: "history",
                  label: "Histórico",
                  content: (
                    <Text size="body-sm" color="muted">
                      Conteúdo da aba Histórico
                    </Text>
                  ),
                },
                {
                  value: "settings",
                  label: "Configurações",
                  content: (
                    <Text size="body-sm" color="muted">
                      Conteúdo da aba Configurações
                    </Text>
                  ),
                },
              ]}
            />
          </DemoSection>

          <DemoSection title="DropdownMenu / Avatar / UserMenu">
            <Inline gap={6}>
              <DropdownMenu
                trigger={<Button variant="tertiary">Ações</Button>}
                items={[
                  { value: "edit", label: "Editar" },
                  { value: "duplicate", label: "Duplicar" },
                  {
                    value: "delete",
                    label: "Excluir",
                    danger: true,
                    icon: Trash2,
                  },
                ]}
              />
              <Avatar name="Fernanda Souza" size="md" />
              <UserMenu
                name="Fernanda Souza"
                email="fernanda@athonis.com"
                items={[
                  { value: "profile", label: "Meu perfil" },
                  { value: "settings", label: "Configurações" },
                  { value: "logout", label: "Sair" },
                ]}
              />
            </Inline>
          </DemoSection>

          <DemoSection title="Toast">
            <Inline gap={3} wrap>
              <Button
                variant="secondary"
                onClick={() =>
                  toaster.success({
                    title: "Pedido criado",
                    description: "PED-1042 foi criado com sucesso.",
                  })
                }
              >
                Success
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  toaster.error({
                    title: "Falha ao salvar",
                    description: "Tente novamente em instantes.",
                  })
                }
              >
                Error
              </Button>
              <Button
                variant="secondary"
                onClick={() => toaster.warning({ title: "Estoque baixo" })}
              >
                Warning
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  toaster.info({ title: "Nova versão disponível" })
                }
              >
                Info
              </Button>
            </Inline>
          </DemoSection>

          <DemoSection title="ConfirmDialog">
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Icon icon={TriangleAlert} size="sm" /> Excluir pedido
            </Button>
            <ConfirmDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              title="Excluir pedido PED-1002?"
              description="Esta ação não pode ser desfeita."
              tone="danger"
              confirmLabel="Excluir"
              onConfirm={() => setConfirmOpen(false)}
            />
          </DemoSection>

          <DemoSection title="CommandMenu">
            <Button variant="secondary" onClick={() => setCommandOpen(true)}>
              Abrir command menu (⌘K)
            </Button>
            <CommandMenu
              open={commandOpen}
              onOpenChange={setCommandOpen}
              items={[
                {
                  id: "new-order",
                  label: "Criar pedido",
                  group: "Ações rápidas",
                  icon: Plus,
                  onSelect: () => {},
                },
                {
                  id: "new-driver",
                  label: "Adicionar motorista",
                  group: "Ações rápidas",
                  icon: UserPlus,
                  onSelect: () => {},
                },
                {
                  id: "orders",
                  label: "Ir para Pedidos",
                  group: "Navegação",
                  onSelect: () => {},
                },
                {
                  id: "routes",
                  label: "Ir para Rotas",
                  group: "Navegação",
                  onSelect: () => {},
                },
              ]}
            />
          </DemoSection>

          <DemoSection title="FormField / FormSection">
            <FormSection
              title="Dados do cliente"
              description="Informações usadas na entrega"
            >
              <FormField label="Nome fantasia" required>
                <Input placeholder="Ex: Distribuidora Aurora" />
              </FormField>
              <FormField label="Documento" description="CPF ou CNPJ">
                <Input placeholder="00.000.000/0000-00" />
              </FormField>
            </FormSection>
          </DemoSection>

          <DemoSection title="DataTable">
            <DataTable
              columns={DEMO_COLUMNS}
              data={DEMO_ORDERS}
              getRowId={(row) => row.id}
              selectable
              bulkActions={(ids) => (
                <Button size="sm" variant="destructive">
                  Excluir ({ids.length})
                </Button>
              )}
              rowActions={() => [
                { value: "view", label: "Ver detalhes" },
                {
                  value: "delete",
                  label: "Excluir",
                  danger: true,
                  icon: Trash2,
                },
              ]}
            />
          </DemoSection>
        </Stack>
      </Stack>
    </Container>
  );
}
