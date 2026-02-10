import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Modal, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { AgGridReact } from "ag-grid-react";

import { DataTable } from "../datatables/Datatable";
import { getClients } from "@/src/lib/clients/requests";

type LookupClientProps = {
  onSelect: (data: any) => void;
};

export const LookupClient = forwardRef<any, LookupClientProps>(
  ({ onSelect }, ref) => {
    const [open, setOpen] = useState(false);

    const dataTableRef = useRef<any>(null);
    const gridRef = useRef<AgGridReact>(null);

    useEffect(() => {
      if (open && dataTableRef.current) {
        dataTableRef.current.fetchData();
      }
    }, [open]);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
    }));

    const handleSelect = () => {
      const selected = gridRef.current?.api.getSelectedRows()[0];
      if (!selected) return;

      onSelect(selected);
      setOpen(false);
    };

    return (
      <Modal
        open={open}
        title="Selecione seu cliente"
        onCancel={() => setOpen(false)}
        width="80vw"
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            Fechar
          </Button>,
          <Button
            key="select"
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleSelect}
          >
            Selecionar cliente
          </Button>,
        ]}
      >
        <DataTable
          ref={dataTableRef}
          gridRef={gridRef}
          rowSelection="single"
          className="h-[500px]"
          columnDefs={[
            {
              headerName: "",
              checkboxSelection: true,
              width: 50,
              pinned: "left",
            },
            { headerName: "Client Id", field: "client_id", maxWidth: 100 },
            { headerName: "Nome", field: "name" },
            { headerName: "Nome Fantasia", field: "trade_name" },
            { headerName: "Documento", field: "document" },
            { headerName: "E-mail", field: "email" },
            { headerName: "Telefone", field: "phone" },
          ]}
          getMethod={async (getProps) => {
            const response = await getClients({
              page: getProps.page,
              pageSize: getProps.pageSize,
              filter: getProps.filter,
            });

            return {
              data: response?.data?.items ?? [],
              total: response?.data?.meta?.total ?? 0,
            };
          }}
        />
      </Modal>
    );
  }
);
