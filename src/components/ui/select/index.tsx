"use client";

import { useMemo, useState } from "react";
import {
  Portal,
  SelectContent,
  SelectControl,
  SelectHiddenSelect,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  createListCollection,
} from "@ark-ui/react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives/icon";

export type SelectOption = {
  value: string;
  label: string;
  /**
   * Segunda linha da opção, para quando o rótulo sozinho não basta — uma
   * categoria de CNH, por exemplo, é uma letra que ninguém decora.
   * Não aparece no gatilho: lá fica só o rótulo.
   */
  description?: string;
  disabled?: boolean;
};

export type SelectProps = {
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  emptyMessage?: string;
  className?: string;
};

export function Select({
  label,
  description,
  error,
  placeholder = "Selecione",
  options,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  searchable = false,
  loading = false,
  disabled = false,
  required = false,
  emptyMessage = "Nenhum resultado encontrado",
  className,
}: SelectProps) {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchable || !search.trim()) return options;
    const query = search.trim().toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        (option.description?.toLowerCase().includes(query) ?? false),
    );
  }, [options, search, searchable]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: filteredOptions,
        itemToValue: (item) => item.value,
        itemToString: (item) => item.label,
        isItemDisabled: (item) => !!item.disabled,
      }),
    [filteredOptions],
  );

  return (
    <SelectRoot
      collection={collection}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(details) => onValueChange?.(details.value)}
      multiple={multiple}
      disabled={disabled || loading}
      invalid={!!error}
      required={required}
      onOpenChange={(details) => {
        if (!details.open) setSearch("");
      }}
      className={cn("flex flex-col gap-1.5", className)}
    >
      {label && (
        <SelectLabel className="text-label font-medium text-foreground">
          {label}
          {required && <span className="text-danger"> *</span>}
        </SelectLabel>
      )}
      <SelectControl>
        <SelectTrigger
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-body text-foreground transition-colors",
            "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/20",
            "data-[disabled]:pointer-events-none data-[disabled]:bg-surface-muted data-[disabled]:opacity-50",
            error && "border-danger",
          )}
        >
          <SelectValueText placeholder={placeholder} className="truncate text-left" />
          {loading ? (
            <Icon icon={Loader2} size="sm" className="shrink-0 animate-spin text-muted" />
          ) : (
            <Icon icon={ChevronsUpDown} size="sm" className="shrink-0 text-muted" />
          )}
        </SelectTrigger>
      </SelectControl>
      <Portal>
        <SelectPositioner>
          {/* Nunca menor que o gatilho, mas livre para crescer ate o conteudo
              caber — descricao espremida em coluna estreita nao se le. */}
          <SelectContent className="z-50 max-h-72 w-max min-w-[var(--reference-width)] max-w-[min(30rem,calc(100vw-2rem))] overflow-auto rounded-lg border border-border bg-surface p-1 shadow-float">
            {searchable && (
              <div className="sticky top-0 z-10 bg-surface p-1">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => event.stopPropagation()}
                  placeholder="Buscar..."
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-body-sm text-foreground outline-none focus:border-primary"
                />
              </div>
            )}
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-body-sm text-muted">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  item={option}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-body-sm text-foreground",
                    option.description && "py-2.5",
                    "data-[highlighted]:bg-surface-hover",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  )}
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <SelectItemText>{option.label}</SelectItemText>
                    {option.description && (
                      <span className="text-caption text-muted">{option.description}</span>
                    )}
                  </span>
                  <SelectItemIndicator>
                    <Icon icon={Check} size="xs" className="shrink-0 text-primary" />
                  </SelectItemIndicator>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </SelectPositioner>
      </Portal>
      <SelectHiddenSelect />
      {error ? (
        <span className="text-caption text-danger">{error}</span>
      ) : description ? (
        <span className="text-caption text-muted">{description}</span>
      ) : null}
    </SelectRoot>
  );
}
