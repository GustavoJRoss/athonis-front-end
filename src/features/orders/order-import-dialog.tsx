"use client";

import { useRef, useState } from "react";
import { Download, FileSpreadsheet, Upload } from "lucide-react";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Box, Heading, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { useImportOrders } from "@/features/orders/hooks";
import { toaster } from "@/components/ui/toast";
import type { OrderImportResult } from "@/types/domain";

export type OrderImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Diálogo de importação de pedidos via planilha CSV. */
export function OrderImportDialog({ open, onOpenChange }: OrderImportDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<OrderImportResult | null>(null);
  const importMutation = useImportOrders();

  function close() {
    onOpenChange(false);
    // Some passo a passo do estado depois de fechado, para reabrir do zero.
    setTimeout(() => {
      setFile(null);
      setResult(null);
      if (inputRef.current) inputRef.current.value = "";
    }, 200);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setResult(null);
  }

  async function handleImport() {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const importResult = await importMutation.mutateAsync(formData);
      setResult(importResult);
      if (importResult.quantidadeSucessos > 0) {
        toaster.success({
          title: `${importResult.quantidadeSucessos} pedido(s) importado(s)`,
        });
      }
    } catch (error) {
      toaster.error({
        title: "Não foi possível importar a planilha",
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(details) => (details.open ? null : close())}>
      <DialogContent size="xl" loading={importMutation.isPending}>
        <DialogHeader>
          <DialogTitle>Importar pedidos via planilha</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Stack gap={4}>
            {!result && (
              <>
                <Text size="body-sm" color="muted">
                  Envie um arquivo CSV com os pedidos. As colunas obrigatórias são{" "}
                  <code className="text-caption">client_id</code>,{" "}
                  <code className="text-caption">title</code>,{" "}
                  <code className="text-caption">urgency</code>,{" "}
                  <code className="text-caption">quantity</code> e os campos de
                  endereço de entrega.
                </Text>

                <a
                  href="/modelo-importacao-pedidos.csv"
                  download
                  className="inline-flex w-fit items-center gap-1.5 text-body-sm font-medium text-primary hover:underline"
                >
                  <Icon icon={Download} size="sm" />
                  Baixar planilha modelo
                </a>

                <Box
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border p-8 text-center hover:bg-surface-hover"
                  onClick={() => inputRef.current?.click()}
                >
                  <Icon icon={file ? FileSpreadsheet : Upload} size="lg" className="text-muted" />
                  <Text size="body-sm" weight="medium">
                    {file ? file.name : "Clique para escolher um arquivo CSV"}
                  </Text>
                  <Text size="caption" color="muted">
                    Tamanho máximo de 10MB
                  </Text>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Box>
              </>
            )}

            {result && <ImportResultSummary result={result} />}
          </Stack>
        </DialogBody>

        <DialogFooter>
          {result ? (
            <>
              {result.quantidadeFalhas > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  Importar outro arquivo
                </Button>
              )}
              <Button variant="primary" onClick={close}>
                Concluir
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={close} disabled={importMutation.isPending}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleImport}
                loading={importMutation.isPending}
                disabled={!file}
              >
                Importar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

function ImportResultSummary({ result }: { result: OrderImportResult }) {
  const tone =
    result.status === "FALHA_TOTAL"
      ? "danger"
      : result.status === "SUCESSO_PARCIAL"
        ? "warning"
        : "success";

  return (
    <Stack gap={4}>
      <Inline gap={2} align="center">
        <StatusBadge tone={tone}>{result.mensagem}</StatusBadge>
      </Inline>

      <Inline gap={4}>
        <Stack gap={0}>
          <Heading level={3}>{result.quantidadeSucessos}</Heading>
          <Text size="caption" color="muted">
            importados
          </Text>
        </Stack>
        <Stack gap={0}>
          <Heading level={3}>{result.quantidadeFalhas}</Heading>
          <Text size="caption" color="muted">
            com erro
          </Text>
        </Stack>
        <Stack gap={0}>
          <Heading level={3}>{result.totalLinhas}</Heading>
          <Text size="caption" color="muted">
            linhas no arquivo
          </Text>
        </Stack>
      </Inline>

      {result.falhas.length > 0 && (
        <Stack gap={2}>
          <Text size="body-sm" weight="medium">
            Linhas com erro
          </Text>
          <Box className="max-h-64 overflow-y-auto rounded-md border border-border-subtle">
            {result.falhas.map((falha) => (
              <div
                key={falha.linha}
                className="border-b border-border-subtle p-3 last:border-b-0"
              >
                <Text size="body-sm" weight="medium">
                  Linha {falha.linha}
                </Text>
                <Text size="caption" color="danger">
                  {falha.erros.join("; ")}
                </Text>
              </div>
            ))}
          </Box>

          {result.arquivoRejeicao && (
            <a
              href={`/api/order-imports/download-rejected/${encodeURIComponent(result.arquivoRejeicao)}`}
              download
              className="inline-flex w-fit items-center gap-1.5 text-body-sm font-medium text-primary hover:underline"
            >
              <Icon icon={Download} size="sm" />
              Baixar arquivo de rejeições
            </a>
          )}
        </Stack>
      )}
    </Stack>
  );
}
