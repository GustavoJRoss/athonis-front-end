import Link from "next/link";
import {
  Container,
  Grid,
  Inline,
  Separator,
  Stack,
  Text,
} from "@/components/ui/primitives";

const COLUMNS = [
  {
    title: "Produto",
    links: [
      { label: "Como funciona", href: "#route-journey" },
      { label: "Funcionalidades", href: "#features" },
      { label: "Prévia do sistema", href: "#product-showcase" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "#" },
      { label: "Carreiras", href: "#" },
      { label: "Contato", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Central de ajuda", href: "#" },
      { label: "Documentação", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Fale conosco", href: "#" },
      { label: "Termos de uso", href: "#" },
      { label: "Privacidade", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-border-subtle bg-surface border-t">
      <Container width="default" className="py-14">
        <Grid columns={4} gap={8} className="grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <Stack key={column.title} gap={3}>
              <Text size="label" weight="semibold">
                {column.title}
              </Text>
              <Stack gap={2}>
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-body-sm text-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Stack>
          ))}
        </Grid>

        <Separator className="my-10" />

        <Inline justify="between" wrap gap={3}>
          <Text size="body-sm" color="muted">
            © {new Date().getFullYear()} ATHONIS. Todos os direitos reservados.
          </Text>
          <Inline gap={4}>
            <Link
              href="#"
              className="text-body-sm text-muted hover:text-foreground"
            >
              Termos
            </Link>
            <Link
              href="#"
              className="text-body-sm text-muted hover:text-foreground"
            >
              Privacidade
            </Link>
          </Inline>
        </Inline>
      </Container>
    </footer>
  );
}
