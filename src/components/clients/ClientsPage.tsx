"use client";

import { getClients } from "@/src/lib/clients/requests";
import DataTable from "../datatables/Datatable";

type ClientsPageProps = {
  initialData: any[];
  totalRows: number;
};

export default function ClientsPage({
  initialData,
  totalRows,
}: ClientsPageProps) {
  return (
    <>
      <button>etete</button>
      <DataTable
        columnDefs={[{ headerName: "Name", field: "name" }]}
        getMethod={async (getProps) => {
          const userResponse = await getClients({
            page: getProps.page,
            pageSize: getProps.pageSize,
            filter: getProps.filter,
          });
          console.log({ userResponse });

          return {
            data: userResponse?.items ?? [],
            total: userResponse.meta?.total ?? 0,
          };
        }}
        initialData={initialData}
        initialTotal={totalRows}
      />
    </>
  );
}
