"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { importOrders } from "@/src/lib/orders/requests";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CheckCircle2Icon,
  HelpCircleIcon,
  InfoIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { IconAction } from "../utils/IconAction";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@radix-ui/react-select";

function Step({
  number,
  label,
  active,
}: {
  number: number;
  label: string;
  active: boolean;
}) {
  return (
    <div className="text-center ">
      <div
        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white ${
          active ? "bg-emerald-600" : "bg-gray-300"
        }`}
      >
        {number}
      </div>
      <p className="text-sm mt-1">{label}</p>
    </div>
  );
}

export default function ImportsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [uploadResponse, setUploadResponse] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any[]>([]);

  const { errorToast, successToast } = useToast();

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

  function downloadErrorsCSV() {
    const csvContent =
      "linha,erro\n" + errors.map((e) => `${e.line},${e.message}`).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "erros_importacao.csv";
    a.click();
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <Card className="flex flex-row justify-between px-10">
        <Step number={1} active={step >= 1} label="Selecionar arquivo" />
        <Step number={2} active={step >= 2} label="Validar" />
        <Step number={3} active={step >= 3} label="Erros" />
        <Step number={4} active={step >= 4} label="Finalizado" />
      </Card>

      <Card className="h-full">
        <CardContent className="space-y-4 py-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <Label label="Selecione um arquivo CSV">
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
                <div className="flex flex-col gap-8">
                  <h1>
                    Status da importação:{" "}
                    <strong>{uploadResponse?.status}</strong>
                  </h1>

                  <div className="flex flex-nowrap gap-24">
                    <div className="w-full flex flex-col gap-6">
                      <div className="flex gap-4 items-center">
                        <CheckCircle2Icon
                          className="stroke-green-500"
                          size={28}
                          strokeWidth={2}
                        />
                        <h2>Listagem de Sucessos de importação:</h2>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {uploadResponse?.sucessos?.map((sucesso: any) => {
                          return (
                            <Card className="p-4 flex flex-col gap-4 bg-emerald-50 border-emerald-700">
                              <p className="text-start">
                                Título do Pedido:{" "}
                                <strong>{sucesso?.title}</strong>
                              </p>
                              <div className="flex gap-4">
                                <p>
                                  Linha: <strong>{sucesso?.linha}</strong>
                                </p>
                                <p>
                                  Id do Pedido:{" "}
                                  <strong>{sucesso?.order_id}</strong>
                                </p>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <div className="flex gap-4 items-center">
                        <XCircleIcon
                          className="stroke-red-500"
                          size={28}
                          strokeWidth={2}
                        />
                        <h2>Listagem de Erros de importação:</h2>
                      </div>
                      <div className="grid gap-4 grid-cols-2">
                        {uploadResponse?.falhas?.map((falha: any) => {
                          return (
                            <Card className="p-4 flex flex-col gap-4 bg-red-50 border-red-600">
                              <p className="font-semibold text-start">
                                Linha do arquivo: {falha?.linha}
                              </p>
                              <div className="flex flex-col gap-2">
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
                                      <h3 className="text-lg font-semibold mb-3">
                                        JSON do Pedido
                                      </h3>

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
                                <div className="flex gap-4">
                                  <p> Error do pedido</p>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <IconAction
                                        className="stroke-red-300"
                                        icon={XCircleIcon}
                                        text=" Error do pedido"
                                      />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                      <h3 className="text-lg font-semibold mb-3">
                                        Erros
                                      </h3>

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
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-red-600 font-semibold">
                O arquivo contém inconsistências.
              </p>

              <div className="max-h-60 overflow-auto border rounded p-3 bg-gray-50">
                {errors.map((err, index) => (
                  <p key={index}>
                    <b>Linha {err.line}:</b> {err.message}
                  </p>
                ))}
              </div>

              <Button onClick={downloadErrorsCSV} variant="destructive">
                Baixar erros em CSV
              </Button>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-3 text-green-600 font-semibold">
              <p>Importação concluída com sucesso!</p>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Button
          variant="outline"
          icon={ArrowLeftCircleIcon}
          disabled={step <= 1}
          onClick={() => setStep((prev) => prev - 1)}
        >
          Voltar
        </Button>
        <Button
          variant="outline"
          icon={ArrowRightCircleIcon}
          disabled={step >= 4}
          onClick={() => setStep((prev) => prev + 1)}
        >
          Avançar
        </Button>
      </div>
    </div>
  );
}
