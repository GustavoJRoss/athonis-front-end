"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon, Text } from "@/components/ui/primitives";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAV_ITEMS } from "@/constants/navigation";

export type SidebarProps = {
  /** Nome exibido na marca do menu lateral. */
  brandName?: string;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  showToggle?: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function Sidebar({
  brandName = "ATHONIS",
  collapsed = false,
  onToggleCollapsed,
  showToggle = true,
  onNavigate,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "border-border-subtle text-background flex h-full flex-col border-r bg-blue-950 transition-[width] duration-150",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div
        className={cn(
          "border-border-subtle flex h-14 shrink-0 items-center border-b px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <Text weight="semibold" className="text-heading-4 text-background">
          {collapsed ? (brandName.trim()[0] ?? "A").toUpperCase() : brandName}
        </Text>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const link = (
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "text-body-sm flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors",
                collapsed && "justify-center px-0",
                active
                  ? "bg-primary/20 text-background"
                  : "text-background hover:bg-background/5",
              )}
            >
              <Icon icon={item.icon} size="sm" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <TooltipRoot key={item.href} positioning={{ placement: "right" }}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent>{item.label}</TooltipContent>
              </TooltipRoot>
            );
          }

          return <div key={item.href}>{link}</div>;
        })}
      </nav>

      {showToggle && (
        <div className="border-border-subtle shrink-0 border-t p-2">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            className="text-background hover:bg-background/15 flex w-full items-center justify-center rounded-md p-2 transition-colors"
          >
            <Icon icon={collapsed ? ChevronsRight : ChevronsLeft} size="sm" />
          </button>
        </div>
      )}
    </aside>
  );
}
