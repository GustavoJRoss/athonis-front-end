import { Container, Grid, Heading, Stack, Text } from "@/components/ui/primitives";

const STATS = [
  { value: "500+", label: "rotas otimizadas por dia" },
  { value: "98%", label: "de entregas dentro do prazo" },
  { value: "2.000+", label: "pedidos gerenciados por mês" },
  { value: "40+", label: "operações logísticas ativas" },
];

export function SocialProof() {
  return (
    <section className="border-y border-border-subtle bg-surface-muted py-14">
      <Container width="default">
        <Grid columns={4} gap={6} className="grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Stack key={stat.label} gap={1} align="center" className="text-center">
              <Heading level={2}>{stat.value}</Heading>
              <Text size="body-sm" color="muted">
                {stat.label}
              </Text>
            </Stack>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
