"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { Box, Heading, Stack, Text } from "@/components/ui/primitives";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, SplitText } from "@/lib/gsap/register";

export function LoginScreen({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      let split: SplitText | undefined;
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (illustrationRef.current) {
        timeline.from(
          illustrationRef.current,
          { opacity: 0, scale: 0.96, duration: 0.9 },
          0,
        );
      }

      if (headlineRef.current) {
        split = new SplitText(headlineRef.current, {
          type: "words",
          wordsClass: "inline-block",
        });
        timeline.from(
          split.words,
          { yPercent: 100, opacity: 0, duration: 0.6, stagger: 0.05 },
          0.15,
        );
      }

      if (cardRef.current) {
        timeline.from(
          cardRef.current,
          { opacity: 0, y: 20, duration: 0.6 },
          0.35,
        );
      }

      return () => split?.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={sectionRef} className="relative flex flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at top left, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 60%)",
        }}
      />

      <div
        ref={illustrationRef}
        className="hidden flex-col gap-12 px-12 py-10 lg:flex lg:w-3/5"
      >
        <div className="relative aspect-4/3 w-full max-w-280">
          <Image
            src="/login-illustration.png"
            alt="Ilustração da plataforma ATHONIS"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-12 sm:px-6 lg:w-2/5">
        <Stack gap={8} className="w-full max-w-md">
          <Stack gap={3}>
            <Text
              as="span"
              size="label"
              weight="medium"
              className="border-border bg-surface text-primary w-fit rounded-full border px-4 py-1.5"
            >
              Área do cliente
            </Text>
            <Heading ref={headlineRef} level="display">
              Bem-vindo de volta
            </Heading>
            <Text size="body-lg" color="muted">
              Acesse sua conta com email e senha para continuar acompanhando
              pedidos, rotas e entregas.
            </Text>
          </Stack>

          <div ref={cardRef}>
            <Box
              surface="surface"
              border="default"
              radius="lg"
              padding={6}
              className="sm:p-8"
            >
              {children}
            </Box>
          </div>
        </Stack>
      </div>
    </div>
  );
}
