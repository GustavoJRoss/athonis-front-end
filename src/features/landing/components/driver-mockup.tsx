import { MapPin } from "lucide-react";
import { Box, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";

type StopStatus = "completed" | "active" | "planned";

// TODO(copy): endereços ilustrativos — substituir por exemplo real de cliente antes de publicar.
const STOPS: { label: string; status: StopStatus }[] = [
  { label: "Rua das Flores, 120", status: "completed" },
  { label: "Av. Brasil, 480", status: "active" },
  { label: "Rua Sete de Setembro, 55", status: "planned" },
  { label: "Rua Getúlio Vargas, 900", status: "planned" },
];

const STATUS_LABEL: Record<StopStatus, string> = {
  completed: "Concluída",
  active: "Ativa",
  planned: "Planejada",
};

const STATUS_TONE: Record<StopStatus, StatusTone> = {
  completed: "success",
  active: "primary",
  planned: "muted",
};

/** Prévia mobile (app do motorista) em JSX/CSS — mesma convenção de status do domínio de rotas. */
export function DriverMockup() {
  return (
    <Stack gap={3} className="bg-surface h-full w-full p-4 text-left">
      <Stack gap={0.5}>
        <Text size="caption" color="muted">
          Rota #128
        </Text>
        <Text weight="semibold" className="text-heading-4">
          {STOPS.length} paradas hoje
        </Text>
      </Stack>
      <Stack gap={2}>
        {STOPS.map((stop) => (
          <Box key={stop.label} surface="surface-muted" radius="md" padding={3}>
            <Inline gap={2} justify="between">
              <Inline gap={2}>
                <Icon icon={MapPin} size="sm" color="muted" />
                <Text size="body-sm">{stop.label}</Text>
              </Inline>
              <StatusBadge tone={STATUS_TONE[stop.status]}>
                {STATUS_LABEL[stop.status]}
              </StatusBadge>
            </Inline>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
