import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon, Inline } from "@/components/ui/primitives";

export type FilterChipProps = {
  label: string;
  onRemove?: () => void;
  className?: string;
};

export function FilterChip({ label, onRemove, className }: FilterChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-body-sm text-foreground",
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover filtro ${label}`}
          className="text-muted hover:text-foreground"
        >
          <Icon icon={X} size="xs" />
        </button>
      )}
    </span>
  );
}

export type FilterBarProps = {
  children: ReactNode;
  onClear?: () => void;
  className?: string;
};

export function FilterBar({ children, onClear, className }: FilterBarProps) {
  return (
    <Inline gap={2} wrap className={className}>
      {children}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-body-sm font-medium text-primary hover:underline"
        >
          Limpar filtros
        </button>
      )}
    </Inline>
  );
}
