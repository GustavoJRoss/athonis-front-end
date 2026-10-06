"use client";

import { useGSAP } from "@gsap/react";
import {
  LayoutDashboard,
  Package,
  Route as RouteIcon,
  Truck,
  Users,
} from "lucide-react";
import { useRef } from "react";
import { Box, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap } from "@/lib/gsap/register";

const MINI_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Pedidos", icon: Package, active: false },
  { label: "Rotas", icon: RouteIcon, active: false },
  { label: "Motoristas", icon: Users, active: false },
  { label: "Veículos", icon: Truck, active: false },
];

// TODO(copy): números ilustrativos — substituir por dados reais de cliente antes de publicar.
const MINI_METRICS = [
  { label: "Pedidos hoje", value: 128, suffix: "" },
  { label: "Entregas no prazo", value: 94, suffix: "%" },
  { label: "Rotas ativas", value: 12, suffix: "" },
];

const BAR_HEIGHTS = [40, 65, 50, 80, 60, 90, 70];

export type DashboardMockupProps = {
  /** Anima os números do mini-dashboard subindo de 0 quando a seção entra na tela. */
  animateMetrics?: boolean;
};

/** Prévia do dashboard em JSX/CSS — mesmo padrão do antigo `product-preview.tsx`, sem screenshot real. */
export function DashboardMockup({
  animateMetrics = false,
}: DashboardMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!animateMetrics || reducedMotion) return;

      const values = valueRefs.current.filter(
        (el): el is HTMLSpanElement => el !== null,
      );
      if (values.length === 0) return;

      values.forEach((el, index) => {
        const metric = MINI_METRICS[index];
        const counter = { value: 0 };
        gsap.to(counter, {
          value: metric.value,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.value)}${metric.suffix}`;
          },
        });
      });
    },
    { scope: containerRef, dependencies: [animateMetrics, reducedMotion] },
  );

  return (
    <div
      ref={containerRef}
      className="bg-surface flex h-full w-full flex-col text-left"
    >
      <Inline
        gap={1.5}
        className="border-border-subtle bg-surface-muted shrink-0 border-b px-4 py-2.5"
      >
        <span className="bg-danger/60 size-2 rounded-full" />
        <span className="bg-warning/60 size-2 rounded-full" />
        <span className="bg-success/60 size-2 rounded-full" />
        <Text size="caption" color="muted" className="ml-3">
          athonis.app/dashboard
        </Text>
      </Inline>
      <div className="flex flex-1 overflow-hidden">
        <Stack
          gap={1}
          className="border-border-subtle hidden w-36 shrink-0 border-r p-3 sm:flex"
        >
          {MINI_NAV.map((item) => (
            <Inline
              key={item.label}
              gap={2}
              className={
                item.active
                  ? "bg-primary/10 text-primary rounded-md px-2 py-1.5"
                  : "text-muted rounded-md px-2 py-1.5"
              }
            >
              <Icon icon={item.icon} size="sm" />
              <Text size="caption" color="inherit">
                {item.label}
              </Text>
            </Inline>
          ))}
        </Stack>
        <Stack gap={3} className="flex-1 overflow-hidden p-4">
          <Inline gap={2} wrap>
            {MINI_METRICS.map((metric, index) => (
              <Box
                key={metric.label}
                surface="surface-muted"
                radius="md"
                padding={3}
                className="min-w-28 flex-1"
              >
                <Stack gap={1}>
                  <Text size="caption" color="muted">
                    {metric.label}
                  </Text>
                  <Text weight="semibold" className="text-heading-4">
                    <span
                      ref={(node) => {
                        valueRefs.current[index] = node;
                      }}
                    >
                      {animateMetrics && !reducedMotion
                        ? `0${metric.suffix}`
                        : `${metric.value}${metric.suffix}`}
                    </span>
                  </Text>
                </Stack>
              </Box>
            ))}
          </Inline>
          <Box
            surface="surface-muted"
            radius="md"
            padding={3}
            className="flex-1"
          >
            <Stack gap={2}>
              <Inline justify="between">
                <Text size="body-sm" weight="medium">
                  Evolução de pedidos
                </Text>
                <StatusBadge tone="success">No prazo</StatusBadge>
              </Inline>
              <Inline gap={2} align="end" className="h-16">
                {BAR_HEIGHTS.map((height, index) => (
                  <div
                    key={index}
                    style={{ height: `${height}%` }}
                    className="bg-primary/70 w-full rounded-t-sm"
                  />
                ))}
              </Inline>
            </Stack>
          </Box>
        </Stack>
      </div>
    </div>
  );
}
