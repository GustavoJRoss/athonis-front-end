import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Inline, Text } from "@/components/ui/primitives";

const NAV_LINKS = [
  { label: "Plataforma", href: "#features" },
  { label: "Como funciona", href: "#solution" },
  { label: "Indicadores", href: "#product-preview" },
];

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface/90 backdrop-blur">
      <Container width="default">
        <Inline justify="between" className="h-16">
          <Text weight="semibold" className="text-heading-4 text-foreground">
            ATHONIS
          </Text>
          <Inline gap={6} className="hidden md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-body-sm text-muted hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </Inline>
          <Inline gap={3}>
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
