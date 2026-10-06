"use client";

import { useGSAP } from "@gsap/react";
import {
  BarChart3,
  Package,
  Radar,
  Route as RouteIcon,
  Truck,
  UserRound,
} from "lucide-react";
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

const FEATURES = [
  {
    icon: Package,
    title: "Pedidos",
    description:
      "Cadastre, acompanhe e atualize pedidos com status claro do início ao fim.",
  },
  {
    icon: RouteIcon,
    title: "Rotas inteligentes",
    description:
      "Agrupe pedidos por região e otimize a sequência de entregas de cada rota.",
  },
  {
    icon: Radar,
    title: "Monitoramento",
    description:
      "Acompanhe entregas em andamento e identifique atrasos antes que virem problema.",
  },
  {
    icon: BarChart3,
    title: "Indicadores",
    description:
      "Taxa de entrega, tempo médio e performance por motorista em um só lugar.",
  },
  {
    icon: UserRound,
    title: "Motoristas",
    description:
      "Gerencie cadastro, disponibilidade e performance de toda a equipe de entrega.",
  },
  {
    icon: Truck,
    title: "Veículos",
    description:
      "Controle a frota — capacidade, status e manutenção de cada veículo.",
  },
];

export function Features() {
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
        stagger: 0.08,
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
    <section ref={sectionRef} id="features" className="py-20">
      <Container width="default">
        <Stack gap={10}>
          <Stack gap={2} align="center" className="text-center">
            <Heading level={2}>
              Tudo que a operação precisa, em um só lugar
            </Heading>
            <Text size="body-lg" color="muted" className="max-w-2xl">
              Módulos que conversam entre si — sem retrabalho, sem planilha
              duplicada.
            </Text>
          </Stack>
          <Grid
            columns={3}
            gap={4}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                ref={(node) => {
                  cardsRef.current[index] = node;
                }}
              >
                <Box surface="surface" border="default" radius="lg" padding={5}>
                  <Stack gap={3}>
                    <Box
                      surface="surface-muted"
                      radius="md"
                      padding={3}
                      className="w-fit"
                    >
                      <Icon icon={feature.icon} size="md" color="primary" />
                    </Box>
                    <Text weight="semibold">{feature.title}</Text>
                    <Text size="body-sm" color="muted">
                      {feature.description}
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
