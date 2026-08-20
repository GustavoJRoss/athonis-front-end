import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Heading, Stack, Text } from "@/components/ui/primitives";

export function FinalCta() {
  return (
    <section className="bg-primary py-20">
      <Container width="content">
        <Stack gap={6} align="center" className="text-center">
          <Heading level={2} color="primary-foreground">
            Pronto para ter sua operação sob controle?
          </Heading>
          <Text size="body-lg" className="max-w-xl text-primary-foreground/80">
            Comece agora e veja seus pedidos, rotas e entregas em um único painel.
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
