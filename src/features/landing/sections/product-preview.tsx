import { LayoutDashboard, Package, Route as RouteIcon, Truck, Users } from "lucide-react";
import { Box, Container, Heading, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/ui/status-badge";

const MINI_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Pedidos", icon: Package, active: false },
  { label: "Rotas", icon: RouteIcon, active: false },
  { label: "Motoristas", icon: Users, active: false },
  { label: "Veículos", icon: Truck, active: false },
];

const MINI_METRICS = [
  { label: "Pedidos hoje", value: "128" },
  { label: "Entregas no prazo", value: "94%" },
  { label: "Rotas ativas", value: "12" },
];

const BAR_HEIGHTS = [40, 65, 50, 80, 60, 90, 70];

export function ProductPreview() {
  return (
    <section id="product-preview" className="py-20">
      <Container width="default">
        <Stack gap={10}>
          <Stack gap={2} align="center" className="text-center">
            <Heading level={2}>Uma visão clara da sua operação</Heading>
            <Text size="body-lg" color="muted" className="max-w-2xl">
              O mesmo painel que sua equipe usa todos os dias — sem curva de aprendizado.
            </Text>
          </Stack>

          <Box
            surface="surface"
            border="default"
            radius="xl"
            className="mx-auto w-full max-w-4xl overflow-hidden shadow-overlay"
          >
            <Inline gap={1.5} className="border-b border-border-subtle bg-surface-muted px-4 py-3">
              <span className="size-2.5 rounded-full bg-danger/60" />
              <span className="size-2.5 rounded-full bg-warning/60" />
              <span className="size-2.5 rounded-full bg-success/60" />
              <Text size="caption" color="muted" className="ml-3">
                athonis.app/dashboard
              </Text>
            </Inline>

            <div className="flex">
              <Stack gap={1} className="hidden w-40 shrink-0 border-r border-border-subtle p-3 sm:flex">
                {MINI_NAV.map((item) => (
                  <Inline
                    key={item.label}
                    gap={2}
                    className={
                      item.active
                        ? "rounded-md bg-primary/10 px-2 py-1.5 text-primary"
                        : "rounded-md px-2 py-1.5 text-muted"
                    }
                  >
                    <Icon icon={item.icon} size="sm" />
                    <Text size="body-sm" color="inherit">
                      {item.label}
                    </Text>
                  </Inline>
                ))}
              </Stack>

              <Stack gap={4} className="flex-1 p-5">
                <Inline gap={3} wrap>
                  {MINI_METRICS.map((metric) => (
                    <Box key={metric.label} surface="surface-muted" radius="md" padding={3} className="min-w-32 flex-1">
                      <Stack gap={1}>
                        <Text size="caption" color="muted">
                          {metric.label}
                        </Text>
                        <Text weight="semibold" className="text-heading-4">
                          {metric.value}
                        </Text>
                      </Stack>
                    </Box>
                  ))}
                </Inline>

                <Box surface="surface-muted" radius="md" padding={4}>
                  <Stack gap={3}>
                    <Inline justify="between">
                      <Text size="body-sm" weight="medium">
                        Evolução de pedidos
                      </Text>
                      <StatusBadge tone="success">No prazo</StatusBadge>
                    </Inline>
                    <Inline gap={2} align="end" className="h-24">
                      {BAR_HEIGHTS.map((height, index) => (
                        <div
                          key={index}
                          style={{ height: `${height}%` }}
                          className="w-full rounded-t-sm bg-primary/70"
                        />
                      ))}
                    </Inline>
                  </Stack>
                </Box>
              </Stack>
            </div>
          </Box>
        </Stack>
      </Container>
    </section>
  );
}
