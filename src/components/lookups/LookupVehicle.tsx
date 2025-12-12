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
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { getVehicles } from "@/src/lib/vehicles/requests";

type LookupVehicleProps = {
  onSelect: (data: any) => void;
};

export const LookupVehicle = forwardRef<any, LookupVehicleProps>(
  ({ onSelect }, ref) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const dataTableRef = useRef<any>(null);
    const gridRef = useRef<AgGridReact>(null);
    1;
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
    [&]:w-[40vw]
    [&]:max-h-none
  "
        >
          <DialogHeader>
            <DialogTitle>Selecione seu veículo</DialogTitle>
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
                {
                  headerName: "Name",
                  field: "name",
                },
                {
                  headerName: "Marca",
                  field: "brand",
                },
                {
                  headerName: "Modelo",
                  field: "model",
                },
                {
                  headerName: "Ano",
                  field: "year",
                },
              ]}
              getMethod={async (getProps) => {
                const userResponse = await getVehicles({
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
              Selecionar Veículo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
