"use client";

import { useMemo, useState, type RefObject } from "react";
import type { LucideIcon } from "lucide-react";
import {
  DialogBackdrop,
  DialogContent as ArkDialogContent,
  DialogPositioner,
  DialogRoot,
  Portal,
} from "@ark-ui/react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/primitives";

export type CommandItem = {
  id: string;
  label: string;
  group?: string;
  icon?: LucideIcon;
  shortcut?: string;
  onSelect: () => void;
};

export type CommandMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  /**
   * Elemento (com `position: relative`) ao qual o portal fica restrito — o
   * backdrop e o diálogo passam a cobrir só essa área em vez da viewport
   * inteira. Sem isso, cai no padrão do Ark UI (portal pro `document.body`,
   * cobrindo a tela toda).
   */
  portalContainer?: RefObject<HTMLElement | null>;
};

export function CommandMenu({
  open,
  onOpenChange,
  items,
  placeholder = "Digite um comando ou pesquise...",
  portalContainer,
}: CommandMenuProps) {
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const group = item.group ?? "Ações";
      map.set(group, [...(map.get(group) ?? []), item]);
    }
    return Array.from(map.entries());
  }, [filtered]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setHighlighted(0);
  }

  function runSelected() {
    const item = filtered[highlighted];
    if (!item) return;
    item.onSelect();
    onOpenChange(false);
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={(details) => {
        onOpenChange(details.open);
        setHighlighted(0);
        if (!details.open) setQuery("");
      }}
    >
      <Portal container={portalContainer}>
        <DialogBackdrop
          className={cn(
            "bg-foreground/40 inset-0 z-40",
            portalContainer ? "absolute" : "fixed",
          )}
        />
        <DialogPositioner
          className={cn(
            "inset-0 z-50 flex items-start justify-center p-4 pt-24",
            portalContainer ? "absolute" : "fixed",
          )}
        >
          <ArkDialogContent
            className="border-border bg-surface shadow-overlay flex w-full max-w-lg flex-col overflow-hidden rounded-lg border"
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setHighlighted((current) =>
                  Math.min(current + 1, filtered.length - 1),
                );
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setHighlighted((current) => Math.max(current - 1, 0));
              } else if (event.key === "Enter") {
                event.preventDefault();
                runSelected();
              }
            }}
          >
            <div className="border-border-subtle flex items-center gap-2 border-b px-4">
              <Icon icon={Search} size="sm" className="text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                placeholder={placeholder}
                className="text-body text-foreground placeholder:text-muted h-12 min-w-0 flex-1 bg-transparent outline-none"
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="text-body-sm text-muted px-3 py-8 text-center">
                  Nenhum resultado encontrado
                </div>
              ) : (
                groups.map(([group, groupItems]) => (
                  <div key={group} className="mb-2 last:mb-0">
                    <div className="text-caption text-muted px-2.5 py-1.5 font-medium">
                      {group}
                    </div>
                    {groupItems.map((item) => {
                      const index = filtered.indexOf(item);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onMouseEnter={() => setHighlighted(index)}
                          onClick={() => {
                            item.onSelect();
                            onOpenChange(false);
                          }}
                          className={cn(
                            "text-body-sm text-foreground flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left",
                            index === highlighted && "bg-surface-hover",
                          )}
                        >
                          {item.icon && (
                            <Icon
                              icon={item.icon}
                              size="sm"
                              className="text-muted"
                            />
                          )}
                          <span className="flex-1">{item.label}</span>
                          {item.shortcut && (
                            <span className="text-caption text-muted">
                              {item.shortcut}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </ArkDialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}
