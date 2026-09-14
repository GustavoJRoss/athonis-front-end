"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";

/**
 * Sincroniza o raf do Lenis com o ticker do GSAP — sem isso, ScrollTrigger
 * fica um frame atrasado em relação ao scroll suavizado (dessincronia
 * clássica dessa integração). `autoRaf: false` no Lenis evita um segundo
 * loop de rAF rodando em paralelo ao do GSAP.
 */
function GsapLenisSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const activeLenis = lenis;
    activeLenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      activeLenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      activeLenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return children;
  }

  return (
    <ReactLenis
      root
      options={{ autoRaf: false, smoothWheel: true, syncTouch: false }}
    >
      <GsapLenisSync />
      {children}
    </ReactLenis>
  );
}
