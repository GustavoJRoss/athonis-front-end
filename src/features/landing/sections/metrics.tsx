"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import {
  Container,
  Grid,
  Heading,
  Stack,
  Text,
} from "@/components/ui/primitives";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap } from "@/lib/gsap/register";

// TODO(copy): números ilustrativos — substituir por métricas reais de cliente antes de publicar.
const METRICS = [
  { value: 98, suffix: "%", label: "de entregas dentro do prazo" },
  { value: 500, suffix: "+", label: "rotas otimizadas por dia" },
  { value: 40, suffix: "%", label: "menos tempo gasto planejando rotas" },
  { value: 2000, suffix: "+", label: "pedidos gerenciados por mês" },
];

export function Metrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const values = valueRefs.current.filter(
        (el): el is HTMLSpanElement => el !== null,
      );
      if (values.length === 0) return;

      if (reducedMotion) {
        values.forEach((el, index) => {
          el.textContent = `${METRICS[index].value}${METRICS[index].suffix}`;
        });
        return;
      }

      values.forEach((el, index) => {
        const metric = METRICS[index];
        const counter = { value: 0 };
        gsap.to(counter, {
          value: metric.value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.value)}${metric.suffix}`;
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="border-border-subtle bg-surface-muted border-y py-16"
    >
      <Container width="default">
        <Grid columns={4} gap={6} className="grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric, index) => (
            <Stack
              key={metric.label}
              gap={1}
              align="center"
              className="text-center"
            >
              <Heading level={2}>
                <span
                  ref={(node) => {
                    valueRefs.current[index] = node;
                  }}
                >
                  0{metric.suffix}
                </span>
              </Heading>
              <Text size="body-sm" color="muted">
                {metric.label}
              </Text>
            </Stack>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
