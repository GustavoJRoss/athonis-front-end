import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { DataTable } from "../datatables/Datatable";
import { AgGridReact } from "ag-grid-react";
import { getVehicles } from "@/src/lib/vehicles/requests";
import { Button, Modal } from "antd";
import { CheckOutlined } from "@ant-design/icons";

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
      <Modal
        open={showDialog}
        title="Selecione seu veículo"
        onCancel={() => setShowDialog(false)}
        width="80vw"
        footer={[
          <Button key="cancel" onClick={() => setShowDialog(false)}>
            Fechar
          </Button>,
          <Button
            key="select"
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleSelect}
          >
            Selecionar veículo
          </Button>,
        ]}
      >
        <DataTable
          ref={dataTableRef}
          gridRef={gridRef}
          rowSelection={"single"}
          className="h-[500px]"
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
      </Modal>
    );
  }
);
