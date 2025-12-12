import { Skeleton } from "@/components/ui/skeleton";
import { SheetIcon } from "lucide-react";

export default function DatatableFallback() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full justify-between">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <div
        className="ag-theme-alpine border rounded-lg shadow-sm w-full flex justify-center items-center"
        style={{ height: 500 }}
      >
        <div className="flex flex-col gap-4 items-center">
          <SheetIcon className="stroke-gray-400" size={100} strokeWidth={1} />
          <p className="text-lg font-semibold text-gray-400">
            Carregando Dados...
          </p>
        </div>
      </div>
      <div className="flex w-full justify-between">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[300px]" />
      </div>
    </div>
  );
}
