import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { DataTable } from "../datatables/Datatable";
import { AgGridReact } from "ag-grid-react";
import { getDrivers } from "@/src/lib/drivers/requests";
import { Button, Modal } from "antd";
import { CheckOutlined } from "@ant-design/icons";

type LookupDriverProps = {
  onSelect: (data: any) => void;
};

export const LookupDriver = forwardRef<any, LookupDriverProps>(
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
      <Modal
        open={showDialog}
        title="Selecione seu motorista"
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
            Selecionar Motorista
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
            { headerName: "Nome", field: "name" },
            { headerName: "Gênero", field: "gender", maxWidth: 100 },
            { headerName: "Documento", field: "document" },
            { headerName: " Data de Nascimento", field: "birth_date" },
          ]}
          getMethod={async (getProps) => {
            const userResponse = await getDrivers({
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
