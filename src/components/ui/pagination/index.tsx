"use client";

import {
  PaginationContext,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@ark-ui/react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives";

export type PaginationProps = {
  count: number;
  pageSize?: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
};

const triggerClass =
  "flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

export function Pagination({
  count,
  pageSize = 10,
  page,
  defaultPage = 1,
  onPageChange,
  className,
}: PaginationProps) {
  if (count <= pageSize) return null;

  return (
    <PaginationRoot
      count={count}
      pageSize={pageSize}
      page={page}
      defaultPage={defaultPage}
      onPageChange={(details) => onPageChange?.(details.page)}
      className={cn("flex items-center gap-1", className)}
    >
      <PaginationPrevTrigger className={triggerClass}>
        <Icon icon={ChevronLeft} size="sm" />
      </PaginationPrevTrigger>
      <PaginationContext>
        {(api) =>
          api.pages.map((pageItem, index) =>
            pageItem.type === "page" ? (
              <PaginationItem
                key={index}
                type="page"
                value={pageItem.value}
                className="flex size-8 items-center justify-center rounded-md text-body-sm text-foreground transition-colors hover:bg-surface-hover data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary-hover"
              >
                {pageItem.value}
              </PaginationItem>
            ) : (
              <PaginationEllipsis key={index} index={index} className="flex size-8 items-center justify-center text-muted">
                <Icon icon={MoreHorizontal} size="sm" />
              </PaginationEllipsis>
            ),
          )
        }
      </PaginationContext>
      <PaginationNextTrigger className={triggerClass}>
        <Icon icon={ChevronRight} size="sm" />
      </PaginationNextTrigger>
    </PaginationRoot>
  );
}
