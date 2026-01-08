"use client";

import { useToast } from "@/hooks/useToast";
import {
  downloadRejectedFile,
  getRejectedFiles,
} from "@/src/lib/orders/requests";
import {
  CaptionsOffIcon,
  DownloadIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IconAction } from "../utils/IconAction";
import ImportDetails from "./ImportDetails";
import { Button, Card, Input } from "antd";
import { Label } from "@/components/ui/label";
import { SearchOutlined } from "@ant-design/icons";

type ImportsPageSearchForm = {
  dataInicio: string;
  dataFim: string;
};

export default function ImportsPage() {
  const { errorToast } = useToast();

  const { register, formState, handleSubmit } =
    useForm<ImportsPageSearchForm>();

  const [rejectedFiles, setRejectedFiles] = useState<any[]>([]);

  const handleOnSearch = async (data: ImportsPageSearchForm) => {
    const rejectedResponse: any = await getRejectedFiles({ ...data });

    if (!rejectedResponse.success) {
      errorToast("erro na hora de buscar arquivos de erro de importação.");
    }

    setRejectedFiles(rejectedResponse?.data?.files);
    console.log({ rejectedResponse });
  };

  const handleDownloadFile = async (filename: string) => {
    const downloadResponse: any = await downloadRejectedFile({ filename });

    if (downloadResponse?.success) {
      const blob = new Blob([downloadResponse?.data], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      return;
    }

    errorToast(`Erro na hora de fazer o download do arquivo ${filename}`);
  };

  return (
    <>
      <Card>
        <form
          noValidate
          className="flex gap-6 items-end"
          onSubmit={handleSubmit(handleOnSearch)}
        >
          <Label
            label="Data Inicio"
            status={formState.errors.dataInicio && "error"}
            errorText={formState.errors.dataInicio?.message}
          >
            <Input
              type="date"
              status={formState.errors.dataInicio && "error"}
              {...register("dataInicio", { required: "Campo obrigatório." })}
            />
          </Label>
          <Label
            label="Data Inicio"
            status={formState.errors.dataFim && "error"}
            errorText={formState.errors.dataFim?.message}
          >
            <Input
              type="date"
              status={formState.errors.dataFim && "error"}
              {...register("dataFim", { required: "Campo obrigatório." })}
            />
          </Label>
          <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
            Pesquisar
          </Button>
        </form>
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-xl">
            Arquivos com erros: {rejectedFiles?.length}
          </h1>
          <div className="flex flex-col gap-2 h-[150px] overflow-y-auto p-4 border shadow-inner rounded-sm">
            {rejectedFiles && rejectedFiles.length > 0 ? (
              rejectedFiles?.map((item, index) => (
                <Card
                  key={index}
                  className="p-2 px-8 flex flex-row gap-2 justify-between"
                >
                  <div className="flex flex-row gap-4">
                    <p>
                      Nome do Arquivo:{" "}
                      <span className="font-semibold">{item?.filename}</span>
                    </p>
                    <p>
                      Data:{" "}
                      <span className="font-semibold">
                        {item?.createdAt?.split("T")[0]}{" "}
                        {item?.createdAt?.split("T")[1]?.split(".")[0]}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-nowrap gap-4">
                    <IconAction
                      icon={DownloadIcon}
                      text="Baixar Arquivo"
                      onClick={() => handleDownloadFile(item?.filename)}
                    />
                    <IconAction icon={TrashIcon} text="Deletar Arquivo" />
                  </div>
                </Card>
              ))
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <span>Nenhum Dado Encontrado</span>
                  <CaptionsOffIcon />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      <ImportDetails />
    </>
  );
}
