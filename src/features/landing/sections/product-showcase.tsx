"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { Container, Heading, Stack, Text } from "@/components/ui/primitives";
import {
  DashboardMockup,
  DriverMockup,
  IphoneFrame,
  MacbookFrame,
} from "@/features/landing/components";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";

export function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const macbookRef = useRef<HTMLDivElement>(null);
  const iphoneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.fromTo(
            macbookRef.current,
            { yPercent: 6, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                end: "top 30%",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            iphoneRef.current,
            { yPercent: 14, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                end: "top 20%",
                scrub: true,
              },
            },
          );
        },
        "(max-width: 767px)": () => {
          gsap.from([macbookRef.current, iphoneRef.current], {
            opacity: 0,
            y: 24,
            duration: 0.6,
            stagger: 0.15,
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
      id="product-showcase"
      className="overflow-hidden py-20"
    >
      <Container width="default">
        <Stack gap={10}>
          <Stack gap={2} align="center" className="text-center">
            <Heading level={2}>Uma visão clara da sua operação</Heading>
            <Text size="body-lg" color="muted" className="max-w-2xl">
              O mesmo painel que sua equipe usa todos os dias — e o app que o
              motorista leva pra rua, sem curva de aprendizado.
            </Text>
          </Stack>
          <div className="mx-auto w-full max-w-5xl">
            <div className="flex flex-col items-center gap-8 md:relative md:block md:gap-0">
              <div ref={macbookRef} className="w-full">
                <MacbookFrame>
                  <DashboardMockup animateMetrics />
                </MacbookFrame>
              </div>
              <div
                ref={iphoneRef}
                className="w-48 md:absolute md:right-0 md:-bottom-10 lg:-bottom-14 lg:w-56"
              >
                <IphoneFrame>
                  <DriverMockup />
                </IphoneFrame>
              </div>
            </div>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
