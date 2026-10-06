"use client";

import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/state";

export type ListEmptyProps = {
  /** Termo digitado na busca, se houver. */
  search?: string;
  /** Texto de quando não existe nenhum registro ainda. Ex.: "Nenhum cliente cadastrado". */
  emptyTitle: string;
  emptyDescription?: string;
  /** Botão para criar o primeiro registro. */
  action?: ReactNode;
  /** Como chamar o registro na mensagem de busca. Ex.: "cliente". */
  entity: string;
};

/**
 * Lista vazia por falta de cadastro e lista vazia por causa do filtro são
 * situações diferentes: uma pede um botão para começar, a outra pede para
 * limpar a busca. Um "Nenhum resultado encontrado" único não diz qual é.
 */
export function ListEmpty({
  search,
  emptyTitle,
  emptyDescription,
  action,
  entity,
}: ListEmptyProps) {
  const termo = search?.trim();

  if (termo) {
    return (
      <EmptyState
        title={`Nenhum ${entity} encontrado`}
        description={`Nada corresponde a "${termo}". Verifique o termo ou limpe a busca.`}
      />
    );
  }

  return <EmptyState title={emptyTitle} description={emptyDescription} action={action} />;
}
