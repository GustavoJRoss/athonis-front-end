import { CircleAlert } from "lucide-react";
import { Box, Container, Grid, Heading, Icon, Stack, Text } from "@/components/ui/primitives";

const PAIN_POINTS = [
  {
    title: "Informação espalhada",
    description: "Pedidos em planilhas, status em grupos de WhatsApp e nenhuma visão única da operação.",
  },
  {
    title: "Atraso descoberto tarde",
    description: "Sem rastreamento em tempo real, o problema só aparece quando o cliente liga reclamando.",
  },
  {
    title: "Rotas ineficientes",
    description: "Planejamento manual de rotas desperdiça tempo, combustível e capacidade da frota.",
  },
  {
    title: "Decisões sem dados",
    description: "Sem indicadores confiáveis, ajustar a operação vira tentativa e erro.",
  },
];

export function Problem() {
  return (
    <section className="py-20">
      <Container width="default">
        <Stack gap={10}>
          <Stack gap={2} align="center" className="text-center">
            <Heading level={2}>Gerenciar entregas não devia ser tão difícil</Heading>
            <Text size="body-lg" color="muted" className="max-w-2xl">
              A maioria das operações logísticas ainda depende de processos manuais e desconectados.
            </Text>
          </Stack>
          <Grid columns={2} gap={4} className="grid-cols-1 sm:grid-cols-2">
            {PAIN_POINTS.map((point) => (
              <Box key={point.title} surface="surface" border="default" radius="lg" padding={5}>
                <Stack gap={2}>
                  <Icon icon={CircleAlert} size="md" color="danger" />
                  <Text weight="semibold">{point.title}</Text>
                  <Text size="body-sm" color="muted">
                    {point.description}
                  </Text>
                </Stack>
              </Box>
            ))}
          </Grid>
        </Stack>
      </Container>
    </section>
  );
}
