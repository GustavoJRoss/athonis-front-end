"use client";

import { Building2, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorState, LoadingState } from "@/components/ui/state";
import { Box, Grid, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/ui/status-badge";
import { maskCnpj } from "@/lib/utils/masks";
import { toaster } from "@/components/ui/toast";
import { CompanyForm } from "@/features/company/company-form";
import { useCompany, useUpdateCompany } from "@/features/company/hooks";
import type { CompanyFormInput } from "@/lib/validation/company";

export default function SettingsPage() {
  const { data: company, isLoading, isError, error, refetch } = useCompany();
  const updateMutation = useUpdateCompany();

  async function handleSubmit(values: CompanyFormInput) {
    try {
      await updateMutation.mutateAsync(values);
      toaster.success({
        title: "Empresa atualizada",
        description: "As novas configurações valem a partir da próxima roteirização.",
      });
    } catch (submitError) {
      toaster.error({
        title: "Não foi possível salvar",
        description: submitError instanceof Error ? submitError.message : "Tente novamente.",
      });
    }
  }

  return (
    <Stack gap={6}>
      <PageHeader
        title="Configurações"
        description="Dados da empresa, depósito e parâmetros de operação"
      />

      {isLoading ? (
        <Box surface="surface" border="default" radius="lg">
          <LoadingState title="Carregando dados da empresa..." />
        </Box>
      ) : isError ? (
        <Box surface="surface" border="default" radius="lg">
          <ErrorState
            title="Não foi possível carregar a empresa"
            description={error instanceof Error ? error.message : undefined}
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className="text-body-sm font-medium text-primary hover:underline"
              >
                Tentar novamente
              </button>
            }
          />
        </Box>
      ) : company ? (
        <Stack gap={4}>
          <Box surface="surface" border="default" radius="lg" padding={5}>
            <Inline justify="between" align="start" gap={4}>
              <Inline gap={3} align="start">
                <Icon icon={Building2} size="md" className="text-primary" />
                <Stack gap={0.5}>
                  <Text weight="semibold" className="text-heading-4">
                    {company.tradeName || company.corporateName}
                  </Text>
                  <Text size="body-sm" color="muted">
                    CNPJ {maskCnpj(company.document) || "não informado"} · identificador do
                    tenant: {company.idCompany}
                  </Text>
                </Stack>
              </Inline>
              <StatusBadge tone={company.isActive ? "success" : "muted"}>
                {company.isActive ? "Ativa" : "Inativa"}
              </StatusBadge>
            </Inline>
          </Box>

          <Box surface="surface-muted" border="default" radius="md" padding={3}>
            <Inline gap={2} align="start">
              <Icon icon={Info} size="sm" className="text-muted" />
              <Text size="body-sm" color="muted">
                Você edita os dados da sua empresa por aqui. Criar uma empresa nova, com outro
                identificador, é feito no banco de dados por quem administra o sistema
                (<code>scripts/create-company.js</code>) — assim um administrador não cria
                tenants pela aplicação.
              </Text>
            </Inline>
          </Box>

          <Box surface="surface" border="default" radius="lg" padding={5}>
            <CompanyForm
              company={company}
              onSubmit={handleSubmit}
              loading={updateMutation.isPending}
            />
          </Box>

          <Grid columns={3} gap={4}>
            <SummaryStat
              label="Depósito"
              value={
                company.hasDepotCoordinates
                  ? `${company.depotCity || "—"}/${company.depotState || "—"}`
                  : "Não cadastrado"
              }
              hint={
                company.hasDepotCoordinates
                  ? `${company.depotLatitude}, ${company.depotLongitude}`
                  : "As rotas partem do ponto padrão"
              }
            />
            <SummaryStat
              label="Custo operacional"
              value={`R$ ${company.costPerKm.toFixed(2)}/km`}
              hint={`R$ ${company.costPerHour.toFixed(2)} por hora`}
            />
            <SummaryStat
              label="Tempo por parada"
              value={`${company.stopDurationMinutes} min`}
              hint={`Capacidade padrão: ${company.defaultVehicleCapacityKg} kg`}
            />
          </Grid>
        </Stack>
      ) : null}
    </Stack>
  );
}

function SummaryStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Box surface="surface" border="default" radius="lg" padding={4}>
      <Stack gap={1}>
        <Text size="caption" color="muted">
          {label}
        </Text>
        <Text weight="semibold">{value}</Text>
        <Text size="caption" color="muted">
          {hint}
        </Text>
      </Stack>
    </Box>
  );
}
