"use client";

import { useGSAP } from "@gsap/react";
import { Truck } from "lucide-react";
import { useRef } from "react";
import {
  Box,
  Container,
  Heading,
  Icon,
  Stack,
  Text,
} from "@/components/ui/primitives";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";
import { cn } from "@/lib/utils/cn";

type RouteStep = {
  id: string;
  title: string;
  description: string;
};

const STEPS: RouteStep[] = [
  {
    id: "received",
    title: "Pedido recebido",
    description:
      "Cada pedido chega com endereço, janela de entrega e prioridade já validados, pronto pra entrar na rota.",
  },
  {
    id: "planned",
    title: "Rota otimizada",
    description:
      "O sistema agrupa por região e monta a sequência de paradas mais eficiente em segundos.",
  },
  {
    id: "active",
    title: "Em rota",
    description:
      "O motorista segue o trajeto certo, com o status de cada parada atualizado em tempo real.",
  },
  {
    id: "completed",
    title: "Entrega concluída",
    description:
      "Cliente e operação recebem a confirmação assim que o pacote chega ao destino.",
  },
];

const TRUCK_LEFT_OFFSET = 24;
const TRUCK_RIGHT_MARGIN = 88;
const REVEAL_END_FRACTION = 0.1;
// Estica a quantidade de scroll necessária sem mudar a distância percorrida pela
// trilha/caminhão — só deixa a animação "mais devagar" por pixel de scroll.
const SCROLL_LENGTH_MULTIPLIER = 4;

export function RouteJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastDirectionRef = useRef(1);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const panels = panelRefs.current.filter(
        (el): el is HTMLDivElement => el !== null,
      );
      if (
        reducedMotion ||
        !trackRef.current ||
        !truckRef.current ||
        panels.length === 0
      )
        return;

      ScrollTrigger.matchMedia({
        "(min-width: 1024px) and (pointer: fine)": () => {
          const track = trackRef.current;
          const viewport = viewportRef.current;
          const truck = truckRef.current;
          const spacer = spacerRef.current;
          if (!track || !viewport || !truck || !spacer) return;

          // A distância "natural" (scrollWidth - viewport) só garante que a borda
          // direita do último painel encoste na borda direita da viewport — não é
          // suficiente pra arrastá-lo até o mesmo ponto de destaque (REVEAL_END_FRACTION)
          // que os painéis anteriores alcançam. Um spacer no fim da trilha completa
          // essa distância, calculado antes de qualquer transform ser aplicado.
          spacer.style.width = "0px";
          const lastPanel = panels[panels.length - 1];
          const lastPanelLeft = lastPanel.getBoundingClientRect().left;
          const naturalDistance = track.scrollWidth - viewport.clientWidth;
          const targetX = REVEAL_END_FRACTION * viewport.clientWidth;
          const extraNeeded = Math.max(
            0,
            lastPanelLeft - targetX - naturalDistance,
          );
          spacer.style.width = `${extraNeeded}px`;

          const getDistance = () => track.scrollWidth - viewport.clientWidth;

          lastDirectionRef.current = 1;
          gsap.set(truck, { x: 0, scaleX: 1, transformOrigin: "center" });
          gsap.set(panels, {
            opacity: 0.45,
            scale: 0.94,
            transformOrigin: "center",
          });

          const scrollConfig = {
            trigger: sectionRef.current,
            start: "top top",
            end: () => "+=" + getDistance() * SCROLL_LENGTH_MULTIPLIER,
            scrub: 1,
          };

          const trackTween = gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              ...scrollConfig,
              pin: pinTargetRef.current,
              onUpdate: (self) => {
                if (self.direction !== lastDirectionRef.current) {
                  lastDirectionRef.current = self.direction;
                  gsap.set(truck, { scaleX: self.direction === -1 ? -1 : 1 });
                }
              },
            },
          });

          gsap.to(truck, {
            x: () =>
              viewport.clientWidth - TRUCK_RIGHT_MARGIN - TRUCK_LEFT_OFFSET,
            ease: "none",
            scrollTrigger: scrollConfig,
          });

          panels.forEach((panel) => {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: trackTween,
                  start: "left 75%",
                  end: `left ${REVEAL_END_FRACTION * 100}%`,
                  scrub: true,
                },
              })
              .to(panel, { opacity: 1, scale: 1, ease: "none" });
          });
        },
        "(max-width: 1023px), (pointer: coarse)": () => {
          gsap.from(sectionRef.current, {
            opacity: 0,
            y: 24,
            duration: 0.6,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="route-journey"
      className="bg-surface-muted overflow-hidden py-20 lg:py-0"
    >
      <Container width="default">
        <Stack gap={2} align="center" className="text-center">
          <Text
            as="span"
            size="label"
            weight="medium"
            className="border-border bg-surface text-primary rounded-full border px-4 py-1.5"
          >
            Como funciona
          </Text>
          <Heading level={2}>Do pedido à entrega, sem perder o rastro</Heading>
          <Text size="body-lg" color="muted" className="max-w-2xl">
            Cada pedido vira uma parada na rota certa — e sua equipe acompanha o
            trajeto do início ao fim, em tempo real.
          </Text>
        </Stack>
      </Container>

      <div
        ref={pinTargetRef}
        className="relative mt-12 w-full lg:mt-16 lg:flex lg:h-screen lg:items-center"
      >
        <div
          ref={viewportRef}
          className={cn(
            "relative w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-4",
            !reducedMotion && "lg:snap-none lg:overflow-hidden lg:pb-0",
          )}
        >
          <div
            ref={trackRef}
            className="relative flex w-max flex-row items-start gap-10 px-[8vw] py-10 sm:gap-16 sm:px-[10vw] lg:gap-24 lg:py-16"
          >
            <div
              aria-hidden
              className="border-primary/40 absolute top-28 right-[10vw] left-[10vw] hidden h-px border-t-2 border-dashed motion-reduce:hidden lg:block"
            />
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                ref={(node) => {
                  panelRefs.current[index] = node;
                }}
                className="w-72 shrink-0 snap-center sm:w-80"
              >
                <Box surface="surface" border="default" radius="lg" padding={6}>
                  <Stack gap={4} align="center" className="text-center">
                    <div className="bg-primary text-heading-4 text-primary-foreground relative z-10 flex size-12 items-center justify-center rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <Stack gap={2}>
                      <Text weight="semibold" className="text-heading-4">
                        {step.title}
                      </Text>
                      <Text size="body-sm" color="muted">
                        {step.description}
                      </Text>
                    </Stack>
                  </Stack>
                </Box>
              </div>
            ))}
            <div
              ref={spacerRef}
              aria-hidden
              className="hidden shrink-0 lg:block"
            />
          </div>

          <div
            ref={truckRef}
            className="bg-primary shadow-overlay pointer-events-none absolute top-20 left-6 hidden size-16 items-center justify-center rounded-full motion-reduce:hidden lg:flex"
          >
            <Icon icon={Truck} size="2xl" color="primary-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}
