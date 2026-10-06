"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container, Inline } from "@/components/ui/primitives";
import { ThemeMenu } from "@/components/ui/theme-menu";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { label: "Como funciona", href: "#route-journey" },
  { label: "Plataforma", href: "#features" },
  { label: "Prévia", href: "#product-showcase" },
];

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b transition-colors duration-300",
        scrolled
          ? "border-border-subtle bg-surface/85 backdrop-blur"
          : "border-transparent bg-transparent",
      )}
    >
      <Container width="default">
        <Inline justify="between" className="h-16">
          <Link
            href="#top"
            className="text-heading-4 text-foreground font-semibold"
          >
            ATHONIS
          </Link>
          <Inline gap={6} className="hidden md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-sm text-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </Inline>
          <Inline gap={3} align="center">
            <ThemeMenu />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="primary" size="sm">
                Começar agora
              </Button>
            </Link>
          </Inline>
        </Inline>
      </Container>
    </header>
  );
}
