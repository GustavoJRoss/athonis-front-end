"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Container, Heading, Stack, Text } from "@/components/ui/primitives";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, SplitText } from "@/lib/gsap/register";

export function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !headlineRef.current) return;

      const split = new SplitText(headlineRef.current, {
        type: "words",
        wordsClass: "inline-block",
      });

      gsap.from(split.words, {
        yPercent: 100,
        opacity: 0,
        duration: 0.7,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      return () => split.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={sectionRef} className="bg-primary py-24 sm:py-32">
      <Container width="content">
        <Stack gap={6} align="center" className="text-center">
          <Heading
            ref={headlineRef}
            level="display-lg"
            color="primary-foreground"
            className="tracking-tight text-balance"
          >
            Pronto para ter sua operação sob controle?
          </Heading>
          <Text size="body-lg" className="text-primary-foreground/80 max-w-xl">
            Comece agora e veja seus pedidos, rotas e entregas em um único
            painel.
          </Text>
          <Link href="/login">
            <Button variant="secondary" size="lg">
              Começar agora
            </Button>
          </Link>
        </Stack>
      </Container>
    </section>
  );
}
