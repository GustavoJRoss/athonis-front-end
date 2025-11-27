import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { DataTable } from "../datatables/Datatable";
import { getClients } from "@/src/lib/clients/requests";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { AgGridReact } from "ag-grid-react";

type LookupClientProps = {
  onSelect: (data: any) => void;
};

export const LookupClient = forwardRef<any, LookupClientProps>(
  ({ onSelect }, ref) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const dataTableRef = useRef<any>(null);
    const gridRef = useRef<AgGridReact>(null);

    useEffect(() => {
      if (showDialog && dataTableRef.current) {
        dataTableRef.current.fetchData();
      }
    }, [showDialog, dataTableRef]);

    const handleSelect = async () => {
      onSelect(gridRef.current?.api.getSelectedRows()[0]);
      setShowDialog(false);
    };

    useImperativeHandle(ref, () => ({
      open: () => setShowDialog(true),
    }));

    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className="
    [&]:max-w-none
    [&]:w-[80vw]
    [&]:max-h-none
  "
        >
          <DialogHeader>
            <DialogTitle>Selecione seu cliente</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DataTable
              ref={dataTableRef}
              gridRef={gridRef}
              rowSelection={"single"}
              columnDefs={[
                {
                  headerName: "",
                  checkboxSelection: true,
                  headerCheckboxSelection: true,
                  width: 50,
                  pinned: true,
                },
                { headerName: "Código", field: "client_id", maxWidth: 80 },
                { headerName: "Nome", field: "name" },
                { headerName: "Nome Fantasia", field: "trade_name" },
                { headerName: "Documento", field: "document" },
                { headerName: "E-mail", field: "email" },
                { headerName: "Telefone", field: "phone" },
                // { headerName: "Tipo", field: "type" },
                // { headerName: "Data de Nascimento", field: "birth_date" },
                // { headerName: "Rua", field: "street" },
                // { headerName: "Bairro", field: "neighborhood" },
                // { headerName: "Cidade", field: "city" },
                // { headerName: "Estado", field: "state" },
                // { headerName: "CEP", field: "zip_code" },
                // { headerName: "Número", field: "number" },
                // { headerName: "Complemento", field: "complement" },
                // { headerName: "Observações", field: "notes" },
                // { headerName: "Criado em", field: "created_at" },
                // { headerName: "Criado por", field: "created_by" },
                // { headerName: "Atualizado em", field: "updated_at" },
                // { headerName: "Atualizado por", field: "updated_by" },
              ]}
              getMethod={async (getProps) => {
                const userResponse = await getClients({
                  page: getProps.page,
                  pageSize: getProps.pageSize,
                  filter: getProps.filter,
                });
                return {
                  data: userResponse?.data?.items || [],
                  total: userResponse?.data?.meta?.total || 0,
                };
              }}
            />
          </DialogBody>
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"}>Fechar</Button>
            </DialogClose>
            <Button icon={CheckIcon} onClick={handleSelect}>
              Selecionar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
