"use client";

import { Bell, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon, Text } from "@/components/ui/primitives";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "@/components/ui/popover";
import { UserMenu } from "@/components/ui/user-menu";
import type { MenuAction } from "@/components/ui/dropdown-menu";

export type TopbarProps = {
  breadcrumb?: BreadcrumbItem[];
  onOpenMobileSidebar: () => void;
  onOpenCommandMenu: () => void;
  userName: string;
  userEmail?: string;
  userMenuItems?: MenuAction[];
  onUserMenuSelect?: (value: string) => void;
  className?: string;
};

const DEFAULT_USER_MENU_ITEMS: MenuAction[] = [
  { value: "settings", label: "Configurações" },
  { separator: true },
  { value: "logout", label: "Sair" },
];

export function Topbar({
  breadcrumb,
  onOpenMobileSidebar,
  onOpenCommandMenu,
  userName,
  userEmail,
  userMenuItems = DEFAULT_USER_MENU_ITEMS,
  onUserMenuSelect,
  className,
}: TopbarProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-4 border-b border-border-subtle bg-surface px-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Abrir menu"
          className="flex size-9 items-center justify-center rounded-md text-muted hover:bg-surface-hover lg:hidden"
        >
          <Icon icon={Menu} size="sm" />
        </button>
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb items={breadcrumb} className="hidden md:flex" />
        )}
      </div>

      <button
        type="button"
        onClick={onOpenCommandMenu}
        className="flex max-w-sm flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-body-sm text-muted transition-colors hover:border-primary/50"
      >
        <Icon icon={Search} size="sm" />
        <span className="flex-1 text-left">Buscar...</span>
        <span className="text-caption">⌘K</span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <PopoverRoot positioning={{ placement: "bottom-end" }}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Notificações"
              className="relative flex size-9 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground"
            >
              <Icon icon={Bell} size="sm" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-danger" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <Text size="body-sm" weight="medium">
              Notificações
            </Text>
            <Text size="body-sm" color="muted" className="mt-2">
              Nenhuma notificação nova.
            </Text>
          </PopoverContent>
        </PopoverRoot>

        <UserMenu
          name={userName}
          email={userEmail}
          items={userMenuItems}
          onSelect={onUserMenuSelect}
        />
      </div>
    </header>
  );
}
