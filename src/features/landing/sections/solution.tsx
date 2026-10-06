"use client";

import { useGSAP } from "@gsap/react";
import { CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import {
  Container,
  Grid,
  Heading,
  Icon,
  Inline,
  Stack,
  Text,
} from "@/components/ui/primitives";
import { DriverMockup, IphoneFrame } from "@/features/landing/components";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";

const STEPS = [
  {
    title: "Pedidos entram automaticamente",
    description:
      "Cada novo pedido já nasce com endereço, janela de entrega e prioridade certos.",
  },
  {
    title: "Rotas otimizadas em segundos",
    description:
      "O sistema agrupa pedidos por região e monta a sequência mais eficiente de paradas.",
  },
  {
    title: "Motoristas seguem o trajeto certo",
    description:
      "Cada motorista recebe sua rota pronta, com status atualizado a cada parada concluída.",
  },
];

export function Solution() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const steps = stepRefs.current.filter(
        (el): el is HTMLDivElement => el !== null,
      );
      if (reducedMotion || steps.length === 0) return;

      ScrollTrigger.matchMedia({
        "(min-width: 1024px) and (pointer: fine)": () => {
          gsap.set(steps, {
            opacity: 0.45,
            scale: 0.96,
            transformOrigin: "left center",
          });
          gsap.set(steps[0], { opacity: 1, scale: 1.06 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=100%",
              scrub: 1,
              pin: pinRef.current,
            },
          });

          steps.forEach((step, index) => {
            if (index === 0) return;
            const position = index / steps.length;
            const others = steps.filter((candidate) => candidate !== step);
            timeline.to(
              others,
              { opacity: 0.45, scale: 0.96, duration: 0.3 },
              position,
            );
            timeline.to(
              step,
              { opacity: 1, scale: 1.06, duration: 0.3 },
              position,
            );
          });
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={sectionRef} id="solution" className="bg-surface-muted">
      <div
        ref={pinRef}
        className="py-20 lg:flex lg:min-h-screen lg:items-center lg:py-0"
      >
        <Container width="default">
          <Grid
            columns={2}
            gap={10}
            className="grid-cols-1 items-center lg:grid-cols-2"
          >
            <Stack gap={6}>
              <Stack gap={3}>
                <Heading level={2}>
                  Um sistema, toda a operação sob controle
                </Heading>
                <Text size="body-lg" color="muted">
                  O ATHONIS substitui planilhas e mensagens soltas por um painel
                  único — do momento em que o pedido é criado até a confirmação
                  da entrega.
                </Text>
              </Stack>
              <Stack gap={4}>
                {STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    ref={(node) => {
                      stepRefs.current[index] = node;
                    }}
                  >
                    <Inline gap={3} align="start">
                      <Icon
                        icon={CheckCircle2}
                        size="md"
                        color="success"
                        className="mt-0.5 shrink-0"
                      />
                      <Stack gap={1}>
                        <Text weight="semibold">{step.title}</Text>
                        <Text size="body-sm" color="muted">
                          {step.description}
                        </Text>
                      </Stack>
                    </Inline>
                  </div>
                ))}
              </Stack>
            </Stack>
            <div className="mx-auto w-full max-w-64">
              <IphoneFrame tilt>
                <DriverMockup />
              </IphoneFrame>
            </div>
          </Grid>
        </Container>
      </div>
    </section>
  );
}
