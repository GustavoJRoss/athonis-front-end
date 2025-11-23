"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
  Ref,
} from "react";
import { AgGridReact } from "ag-grid-react";
import type { AgGridReactProps } from "ag-grid-react";
import type { ColDef, GridOptions } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

type GetMethodParams = {
  page: number;
  pageSize: number;
  filter?: string;
};

type DataTableProps = {
  columnDefs: ColDef[];
  getMethod: (
    params: GetMethodParams
  ) => Promise<{ data: any[]; total: number }>;
  gridOptions?: GridOptions;
  headerActions?: React.ReactNode;
  height?: string | number;
  width?: string | number;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  initialData?: any[];
  initialTotal?: number;
  gridRef?: Ref<AgGridReact>;
} & Omit<AgGridReactProps, "rowData" | "columnDefs">;

export type DataTableRefProps = {
  fetchData: () => void;
};

export const DataTable = forwardRef<any, DataTableProps>((props, ref) => {
  const {
    columnDefs,
    getMethod,
    gridOptions,
    height = 500,
    width = "100%",
    defaultPageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
    initialData,
    initialTotal,
    headerActions,
    gridRef,
    ...rest
  } = props;

  const [rowData, setRowData] = useState<any[]>(initialData ?? []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [total, setTotal] = useState(initialTotal ?? 0);
  const [filter, setFilter] = useState("");
  const totalPages = Math.ceil(total / pageSize);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMethod({ page, pageSize, filter });
      setRowData(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filter, getMethod]);

  const hasMounted = useRef<boolean>(false);

  useEffect(() => {
    if (!hasMounted.current && initialData && page === 1 && !filter) {
      hasMounted.current = true;
      return;
    }

    hasMounted.current = true;
    fetchData();
  }, [fetchData]);

  useImperativeHandle(ref, () => ({
    fetchData: () => fetchData(),
  }));

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top bar com busca */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-8"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                setFilter((e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
        {headerActions && <div>{headerActions}</div>}
      </div>

      {/* Grid */}
      <div
        className="ag-theme-alpine border rounded-lg shadow-sm"
        style={{ height, width }}
      >
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full gap-2">
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-2/3 h-6" />
            <Skeleton className="w-1/2 h-6" />
          </div>
        ) : (
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            rowData={rowData}
            gridOptions={gridOptions}
            pagination={false}
            suppressPaginationPanel
            {...rest}
          />
        )}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Itens por página:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val: string) => {
              setPage(1);
              setPageSize(Number(val));
            }}
          >
            <SelectTrigger className="w-20 h-8 text-sm">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Total:</span>
            <span className="font-medium">{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => {
                setPage((p) => (p > 1 ? p - 1 : 1));
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              Página <strong onClick={() => fetchData()}>{page}</strong> de{" "}
              {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
