"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Box, Icon, Inline, Text } from "@/components/ui/primitives";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { Pagination } from "@/components/ui/pagination";
import { DropdownMenu, type MenuAction } from "@/components/ui/dropdown-menu";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortAccessor?: (row: T) => string | number | Date;
  hideByDefault?: boolean;
  align?: "left" | "right" | "center";
  className?: string;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  emptyState?: ReactNode;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  bulkActions?: (selectedIds: string[]) => ReactNode;
  rowActions?: (row: T) => MenuAction[];
  onRowActionSelect?: (row: T, action: string) => void;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  className?: string;
};

const ALIGN = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function DataTable<T>({
  columns,
  data,
  getRowId,
  loading = false,
  error = false,
  onRetry,
  emptyState,
  selectable = false,
  selectedIds,
  onSelectedIdsChange,
  bulkActions,
  rowActions,
  onRowActionSelect,
  onRowClick,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<{ id: string; direction: "asc" | "desc" } | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const selected = selectedIds ?? internalSelected;
  const setSelected = onSelectedIdsChange ?? setInternalSelected;

  const visibleColumns = useMemo(
    () => columns.filter((column) => !hiddenColumns.has(column.id)),
    [columns, hiddenColumns],
  );

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const column = columns.find((c) => c.id === sort.id);
    if (!column?.sortAccessor) return data;
    const accessor = column.sortAccessor;
    const copy = [...data];
    copy.sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av < bv) return sort.direction === "asc" ? -1 : 1;
      if (av > bv) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = useMemo(
    () => sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sortedData, currentPage, pageSize],
  );

  const allSelected = paginatedData.length > 0 && paginatedData.every((row) => selected.includes(getRowId(row)));
  const someSelected = paginatedData.some((row) => selected.includes(getRowId(row)));

  function toggleSort(columnId: string) {
    setSort((current) => {
      if (current?.id !== columnId) return { id: columnId, direction: "asc" };
      if (current.direction === "asc") return { id: columnId, direction: "desc" };
      return null;
    });
  }

  function toggleSelectAll() {
    const pageIds = paginatedData.map(getRowId);
    if (allSelected) {
      setSelected(selected.filter((id) => !pageIds.includes(id)));
    } else {
      setSelected(Array.from(new Set([...selected, ...pageIds])));
    }
  }

  function toggleSelectRow(id: string) {
    setSelected(
      selected.includes(id) ? selected.filter((selectedId) => selectedId !== id) : [...selected, id],
    );
  }

  if (loading) {
    return (
      <Box surface="surface" border="default" radius="lg">
        <LoadingState title="Carregando dados..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Box surface="surface" border="default" radius="lg">
        <ErrorState
          action={
            onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="text-body-sm font-medium text-primary hover:underline"
              >
                Tentar novamente
              </button>
            ) : undefined
          }
        />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box surface="surface" border="default" radius="lg">
        {emptyState ?? <EmptyState />}
      </Box>
    );
  }

  return (
    <Box surface="surface" border="default" radius="lg" className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-2.5">
        <div>
          {selected.length > 0 && bulkActions && (
            <Inline gap={2}>
              <Text size="body-sm" color="muted">
                {selected.length} selecionado(s)
              </Text>
              {bulkActions(selected)}
            </Inline>
          )}
        </div>
        <PopoverRoot positioning={{ placement: "bottom-end" }}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-body-sm text-muted hover:bg-surface-hover hover:text-foreground"
            >
              <Icon icon={SlidersHorizontal} size="sm" />
              Colunas
            </button>
          </PopoverTrigger>
          <PopoverContent className="min-w-52">
            <div className="flex flex-col gap-2">
              {columns.map((column) => (
                <Checkbox
                  key={column.id}
                  label={column.header}
                  checked={!hiddenColumns.has(column.id)}
                  onCheckedChange={(checked) =>
                    setHiddenColumns((current) => {
                      const next = new Set(current);
                      if (checked) next.delete(column.id);
                      else next.add(column.id);
                      return next;
                    })
                  }
                />
              ))}
            </div>
          </PopoverContent>
        </PopoverRoot>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-subtle">
              {selectable && (
                <th className="w-10 px-4 py-2.5">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
              )}
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    "px-4 py-2.5 text-label font-medium text-muted",
                    ALIGN[column.align ?? "left"],
                    column.className,
                  )}
                >
                  {column.sortAccessor ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.id)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {column.header}
                      <Icon
                        icon={
                          sort?.id === column.id
                            ? sort.direction === "asc"
                              ? ArrowUp
                              : ArrowDown
                            : ArrowUpDown
                        }
                        size="xs"
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              {rowActions && <th className="w-10 px-4 py-2.5" />}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => {
              const id = getRowId(row);
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-border-subtle last:border-b-0",
                    onRowClick && "cursor-pointer hover:bg-surface-hover",
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                      <Checkbox
                        checked={selected.includes(id)}
                        onCheckedChange={() => toggleSelectRow(id)}
                      />
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "px-4 py-3 text-body-sm text-foreground",
                        ALIGN[column.align ?? "left"],
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>
                      <DropdownMenu
                        trigger={
                          <button
                            type="button"
                            aria-label="Ações"
                            className="flex size-8 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground"
                          >
                            <Icon icon={MoreHorizontal} size="sm" />
                          </button>
                        }
                        items={rowActions(row)}
                        onSelect={(action) => onRowActionSelect?.(row, action)}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end border-t border-border-subtle px-4 py-3">
          <Pagination count={sortedData.length} pageSize={pageSize} page={currentPage} onPageChange={setPage} />
        </div>
      )}
    </Box>
  );
}
