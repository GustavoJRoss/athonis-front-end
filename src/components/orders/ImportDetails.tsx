"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { importOrders } from "@/src/lib/orders/requests";
import { InfoIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { IconAction } from "../utils/IconAction";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

export default function ImportDetails() {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [uploadResponse, setUploadResponse] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);

  const { errorToast } = useToast();

  const router = useRouter();

  function handleFileChange(e: any) {
    const selected = e.target.files[0];
    if (selected && selected.type === "text/csv") {
      setFile(selected);
    } else {
      errorToast("Selecione um arquivo CSV válido.");
    }
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);

    try {
      const uploadResponse = await importOrders({ file });
      console.log({ uploadResponse });

      if (uploadResponse.success) {
        setUploadResponse(uploadResponse.data);
      } else {
        errorToast("Erro com a api de importação de dados.");
        setUploadResponse(undefined);
        return;
      }
    } catch (err) {
      setUploadResponse(undefined);
      errorToast("Erro ao enviar arquivo.");
    }
    setLoading(false);
  }

  const resetImportInfo = () => {
    setLoading(true);
    setFile(null);
    setStep(1);
    setUploadResponse(undefined);
    setLoading(false);
  };

  return (
    <Card className="flex flex-col gap-6 h-full p-4">
      <h1 className="font-bold text-xl text-emerald-700">
        Importar Novos Pedidos
      </h1>
      <div className="h-full">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Label label="Selecione um arquivo CSV" className="w-fit">
              <Input type="file" accept=".csv" onChange={handleFileChange} />
            </Label>
            {file && (
              <span className="text-lg font-bold text-emerald-500">
                Arquivo selecionado com sucesso, pode avançar para o próximo
                passo.
              </span>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <p>
                Arquivo selecionado: <b>{file?.name}</b>
              </p>
              {!uploadResponse && (
                <div>
                  <Button onClick={handleUpload} loading={loading}>
                    Importar Pedidos!
                  </Button>
                </div>
              )}
              {uploadResponse && (
                <h1>
                  Status da importação:{" "}
                  <strong>{uploadResponse?.status}</strong>
                </h1>
              )}
            </div>

            {uploadResponse && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-nowrap gap-14">
                  <div className="w-full flex flex-col gap-6">
                    <div className="overflow-y-auto max-h-[230px] rounded-sm border border-emerald-800">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-emerald-50 border-b-2 border-emerald-700">
                            <th className="text-left p-2 font-semibold text-emerald-900">
                              Título do Pedido
                            </th>
                            <th className="text-left p-2 font-semibold text-emerald-900">
                              Linha
                            </th>
                            <th className="text-left p-2 font-semibold text-emerald-900">
                              ID do Pedido
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadResponse?.sucessos?.map(
                            (sucesso: any, index: number) => (
                              <tr
                                key={index}
                                className="border-b border-emerald-200 hover:bg-emerald-50/50 transition-colors"
                              >
                                <td className="p-2 text-gray-700">
                                  {sucesso?.title}
                                </td>
                                <td className="p-2 text-gray-700">
                                  {sucesso?.linha}
                                </td>
                                <td className="p-2 text-gray-700">
                                  {sucesso?.order_id}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-3">
                    <div className="overflow-y-auto max-h-[230px] rounded-sm border border-red-600">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-red-50 border-b-2 border-red-600">
                            <th className="text-left p-2 font-semibold text-emerald-900">
                              Linha
                            </th>
                            <th className="text-left p-2 font-semibold text-emerald-900">
                              Dados do Pedido
                            </th>
                            <th className="text-left p-2 font-semibold text-emerald-900">
                              Erros do pedido
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadResponse?.falhas?.map(
                            (falha: any, index: number) => (
                              <tr
                                key={index}
                                className="border-b border-emerald-200 hover:bg-emerald-50/50 transition-colors"
                              >
                                <td className="p-2 text-gray-700">
                                  {falha?.linha}
                                </td>
                                <td className="p-2 text-gray-700">
                                  <div className="flex gap-4">
                                    <p>Dados do pedido</p>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <IconAction
                                          className="stroke-red-300"
                                          icon={InfoIcon}
                                          text="Dados do pedido"
                                        />
                                      </PopoverTrigger>
                                      <PopoverContent>
                                        <pre className="text-xs text-zinc-200 bg-zinc-800 p-3 rounded-lg overflow-auto max-h-96">
                                          <code>
                                            {JSON.stringify(
                                              falha?.dados,
                                              null,
                                              2
                                            )}
                                          </code>
                                        </pre>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </td>
                                <td className="p-2 text-gray-700">
                                  <div className="flex gap-4">
                                    <p>Error do pedido</p>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <IconAction
                                          className="stroke-red-300"
                                          icon={XCircleIcon}
                                          text=" Error do pedido"
                                        />
                                      </PopoverTrigger>
                                      <PopoverContent>
                                        <pre className="text-xs text-zinc-200 bg-zinc-800 p-3 rounded-lg overflow-auto max-h-96">
                                          <code>
                                            {JSON.stringify(
                                              falha?.erros,
                                              null,
                                              2
                                            )}
                                          </code>
                                        </pre>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            {uploadResponse?.falhas && uploadResponse?.falhas.length > 0 ? (
              <p className="text-red-600 font-semibold">
                O arquivo contém inconsistências. Por favor baixe o arquivo de
                erros através da lista de arquivos no início da página e corrija
                os mesmos, para poder importá-los novamente!
              </p>
            ) : (
              <p className="text-emerald-600 font-semibold">
                O arquivo não contém inconsistências. Sinta-se a vontade para
                visualizar suas importações na tela de pedidos.{" "}
                <a onClick={() => router.push("/orders")}>
                  Acessar tela de pedidos.
                </a>
              </p>
            )}
            <div>
              <Button loading={loading} onClick={resetImportInfo}>
                Resetar Informações sobre a importação.
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={step <= 1}
          onClick={() => setStep((prev) => prev - 1)}
        >
          Voltar
        </Button>
        <Button
          variant="outline"
          disabled={step >= 3}
          onClick={() => setStep((prev) => prev + 1)}
        >
          Avançar
        </Button>
      </div>
    </Card>
  );
}
