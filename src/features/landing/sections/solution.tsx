import { CheckCircle2 } from "lucide-react";
import { Container, Grid, Heading, Icon, Inline, Stack, Text } from "@/components/ui/primitives";

const POINTS = [
  "Um painel único para pedidos, rotas, motoristas e veículos",
  "Visibilidade em tempo real do status de cada entrega",
  "Rotas otimizadas automaticamente por região e capacidade",
  "Indicadores prontos para decisão, sem planilha manual",
];

export function Solution() {
  return (
    <section id="solution" className="bg-surface-muted py-20">
      <Container width="default">
        <Grid columns={2} gap={10} className="grid-cols-1 items-center lg:grid-cols-2">
          <Stack gap={4}>
            <Heading level={2}>Um sistema, toda a operação sob controle</Heading>
            <Text size="body-lg" color="muted">
              O ATHONIS substitui planilhas e mensagens soltas por um painel único — do momento em
              que o pedido é criado até a confirmação da entrega.
            </Text>
          </Stack>
          <Stack gap={3}>
            {POINTS.map((point) => (
              <Inline key={point} gap={3} align="start">
                <Icon icon={CheckCircle2} size="md" color="success" className="mt-0.5 shrink-0" />
                <Text>{point}</Text>
              </Inline>
            ))}
          </Stack>
        </Grid>
      </Container>
    </section>
  );
}
