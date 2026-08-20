import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/state";
import { Box } from "@/components/ui/primitives";

export type ModulePlaceholderProps = {
  title: string;
  description: string;
};

/** Placeholder de rota da Fase 5 — cada módulo troca isto por conteúdo real na Fase 7. */
export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />
      <Box surface="surface" border="default" radius="lg">
        <EmptyState title="Módulo em construção" description="O conteúdo desta tela chega na Fase 7." />
      </Box>
    </div>
  );
}
