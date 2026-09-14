"use client";

import { useGSAP } from "@gsap/react";
import { CircleAlert } from "lucide-react";
import { useRef } from "react";
import {
  Box,
  Container,
  Grid,
  Heading,
  Icon,
  Stack,
  Text,
} from "@/components/ui/primitives";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap } from "@/lib/gsap/register";

const PAIN_POINTS = [
  {
    title: "Informação espalhada",
    description:
      "Pedidos em planilhas, status em grupos de WhatsApp e nenhuma visão única da operação.",
  },
  {
    title: "Atraso descoberto tarde",
    description:
      "Sem rastreamento em tempo real, o problema só aparece quando o cliente liga reclamando.",
  },
  {
    title: "Rotas ineficientes",
    description:
      "Planejamento manual de rotas desperdiça tempo, combustível e capacidade da frota.",
  },
  {
    title: "Decisões sem dados",
    description:
      "Sem indicadores confiáveis, ajustar a operação vira tentativa e erro.",
  },
];

export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const cards = cardsRef.current.filter(
        (el): el is HTMLDivElement => el !== null,
      );
      if (reducedMotion || cards.length === 0) return;

      gsap.from(cards, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={sectionRef} className="py-20">
      <Container width="default">
        <Stack gap={10}>
          <Stack gap={2} align="center" className="text-center">
            <Heading level={2}>
              Gerenciar entregas não devia ser tão difícil
            </Heading>
            <Text size="body-lg" color="muted" className="max-w-2xl">
              A maioria das operações logísticas ainda depende de processos
              manuais e desconectados.
            </Text>
          </Stack>
          <Grid columns={2} gap={4} className="grid-cols-1 sm:grid-cols-2">
            {PAIN_POINTS.map((point, index) => (
              <div
                key={point.title}
                ref={(node) => {
                  cardsRef.current[index] = node;
                }}
              >
                <Box surface="surface" border="default" radius="lg" padding={5}>
                  <Stack gap={2}>
                    <Icon icon={CircleAlert} size="md" color="danger" />
                    <Text weight="semibold">{point.title}</Text>
                    <Text size="body-sm" color="muted">
                      {point.description}
                    </Text>
                  </Stack>
                </Box>
              </div>
            ))}
          </Grid>
        </Stack>
      </Container>
    </section>
  );
}
