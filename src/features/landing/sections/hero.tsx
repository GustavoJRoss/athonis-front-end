"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Container, Heading, Stack, Text } from "@/components/ui/primitives";
import { DashboardMockup, MacbookFrame } from "@/features/landing/components";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap/register";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !headlineRef.current) return;

      const split = new SplitText(headlineRef.current, {
        type: "words",
        wordsClass: "inline-block will-change-transform",
      });

      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: "power3.out",
      });

      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          gsap.to(frameRef.current, {
            yPercent: -8,
            scale: 0.97,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        },
      });

      return () => split.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="bg-background relative overflow-hidden py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-144"
        style={{
          background:
            "radial-gradient(ellipse at top, color-mix(in oklab, var(--color-primary) 14%, transparent), transparent 65%)",
        }}
      />
      <Container width="default">
        <Stack gap={12} align="center">
          <Stack gap={6} align="center" className="max-w-3xl text-center">
            <Text
              as="span"
              size="label"
              weight="medium"
              className="border-border bg-surface text-primary rounded-full border px-4 py-1.5"
            >
              Plataforma de gestão logística
            </Text>
            <Heading
              ref={headlineRef}
              level="display-lg"
              className="tracking-tight text-balance"
            >
              Rotas certas. Entregas no prazo. Zero adivinhação.
            </Heading>
            <Text size="body-lg" color="muted" className="max-w-2xl">
              O ATHONIS centraliza pedidos, motoristas, veículos e rotas em um
              único painel — do agendamento à entrega, com visibilidade em tempo
              real e indicadores que importam.
            </Text>
            <Stack gap={3} className="w-full sm:w-auto sm:flex-row">
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" fullWidth>
                  Começar agora
                </Button>
              </Link>
              <Link href="#route-journey" className="w-full sm:w-auto">
                <Button variant="tertiary" size="lg" fullWidth>
                  Ver como funciona
                </Button>
              </Link>
            </Stack>
          </Stack>

          <div ref={frameRef} className="w-full max-w-4xl">
            <MacbookFrame tilt>
              <DashboardMockup />
            </MacbookFrame>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
