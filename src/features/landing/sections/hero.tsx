import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Heading, Stack, Text } from "@/components/ui/primitives";

export function Hero() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <Container width="content">
        <Stack gap={6} align="center" className="text-center">
          <Text
            as="span"
            size="label"
            weight="medium"
            className="rounded-full border border-border bg-surface px-4 py-1.5 text-primary"
          >
            Plataforma de gestão logística
          </Text>
          <Heading level="display" className="max-w-3xl">
            Logística sem adivinhação. Pedidos, rotas e entregas sob controle total.
          </Heading>
          <Text size="body-lg" color="muted" className="max-w-2xl">
            O ATHONIS centraliza pedidos, motoristas, veículos e rotas em um único painel —
            do agendamento à entrega, com visibilidade em tempo real e indicadores que importam.
          </Text>
          <Stack gap={3} className="w-full sm:w-auto sm:flex-row">
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" fullWidth>
                Começar agora
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button variant="tertiary" size="lg" fullWidth>
                Conhecer a plataforma
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </section>
  );
}
