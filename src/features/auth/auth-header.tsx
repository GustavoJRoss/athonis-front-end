"use client";

import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Container, Icon, Inline, Text } from "@/components/ui/primitives";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap } from "@/lib/gsap/register";

export function AuthHeader() {
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -12,
        duration: 0.5,
        ease: "power3.out",
      });
    },
    { scope: headerRef, dependencies: [reducedMotion] },
  );

  return (
    <header
      ref={headerRef}
      className="border-border-subtle bg-surface shrink-0 border-b"
    >
      <Container width="default">
        <Inline justify="between" align="center" className="h-16">
          <Text weight="semibold" className="text-heading-4 text-foreground">
            ATHONIS
          </Text>
          <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
            <Icon icon={ArrowLeft} size="sm" />
            Voltar
          </Button>
        </Inline>
      </Container>
    </header>
  );
}
