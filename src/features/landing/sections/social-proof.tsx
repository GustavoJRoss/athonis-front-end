"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { Container, Text } from "@/components/ui/primitives";
import { PlaceholderImage } from "@/features/landing/components";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap } from "@/lib/gsap/register";

// TODO(asset): logos reais de clientes/operações — hoje só placeholders.
const LOGOS = [
  "Logo cliente A",
  "Logo cliente B",
  "Logo cliente C",
  "Logo cliente D",
  "Logo cliente E",
  "Logo cliente F",
];

export function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  const track = [...LOGOS, ...LOGOS];

  return (
    <section
      ref={sectionRef}
      className="border-border-subtle bg-surface-muted overflow-hidden border-y py-10"
    >
      <Container width="default">
        <Text size="label" color="muted" className="mb-6 text-center uppercase">
          Operações que já confiam no ATHONIS
        </Text>
      </Container>
      <div className="relative w-full overflow-hidden">
        <div
          className={
            reducedMotion
              ? "flex gap-8 px-4"
              : "animate-marquee flex w-max gap-8 px-4"
          }
        >
          {track.map((logo, index) => (
            <PlaceholderImage
              key={`${logo}-${index}`}
              label={logo}
              className="h-12 w-36 shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
