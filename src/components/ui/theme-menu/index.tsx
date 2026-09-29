"use client";

import { Check, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icon } from "@/components/ui/primitives";
import { useTheme, type Theme } from "@/hooks/use-theme";

const OPTIONS: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
];

const TRIGGER_ICON: Record<Theme, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function ThemeMenu() {
  const { theme, setTheme } = useTheme();

  return (
    <PopoverRoot positioning={{ placement: "bottom-end" }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Alternar tema"
          className="text-muted hover:bg-surface-hover hover:text-foreground flex size-9 items-center justify-center rounded-md"
        >
          <Icon icon={TRIGGER_ICON[theme]} size="sm" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className="hover:bg-surface-hover text-body-sm text-foreground flex w-full items-center gap-2 rounded-md px-3 py-2"
          >
            <Icon icon={option.icon} size="sm" className="text-muted" />
            <span className="flex-1 text-left">{option.label}</span>
            {theme === option.value && (
              <Icon icon={Check} size="xs" className="text-primary" />
            )}
          </button>
        ))}
      </PopoverContent>
    </PopoverRoot>
  );
}
