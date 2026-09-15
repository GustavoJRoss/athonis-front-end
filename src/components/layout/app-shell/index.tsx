"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Package, Route as RouteIcon, Search, UserPlus } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandMenu, type CommandItem } from "@/components/ui/command-menu";
import {
  DrawerContent,
  DrawerRoot,
  getDrawerSwipeDirection,
} from "@/components/ui/drawer";
import type { MenuAction } from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/constants/navigation";
import { logout } from "@/lib/auth/authentication";
import { useOrders } from "@/features/orders/hooks";

export type AppShellProps = {
  children: ReactNode;
  userName: string;
  userEmail?: string;
  /** Nome fantasia da empresa; cai no padrão quando ainda não há cadastro. */
  companyName?: string;
  userMenuItems?: MenuAction[];
  onUserMenuSelect?: (value: string) => void;
};

export function AppShell({
  children,
  userName,
  userEmail,
  companyName = "ATHONIS",
  userMenuItems,
  onUserMenuSelect,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { data: orders } = useOrders();
  const activeNavItem = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`),
  );
  const breadcrumb = activeNavItem
    ? [
        { label: companyName, href: "/dashboard" },
        { label: activeNavItem.label },
      ]
    : undefined;

  async function handleUserMenuSelect(value: string) {
    if (value === "logout") {
      await logout();
      return;
    }
    if (value === "settings") {
      router.push("/settings");
      return;
    }
    onUserMenuSelect?.(value);
  }

  const commandItems = useMemo<CommandItem[]>(() => {
    const quickActions: CommandItem[] = [
      {
        id: "action-new-order",
        label: "Criar pedido",
        group: "Ações rápidas",
        icon: Package,
        onSelect: () => router.push("/orders?new=1"),
      },
      {
        id: "action-new-route",
        label: "Criar rota",
        group: "Ações rápidas",
        icon: RouteIcon,
        onSelect: () => router.push("/routes?new=1"),
      },
      {
        id: "action-new-customer",
        label: "Adicionar cliente",
        group: "Ações rápidas",
        icon: UserPlus,
        onSelect: () => router.push("/customers?new=1"),
      },
      {
        id: "action-new-driver",
        label: "Adicionar motorista",
        group: "Ações rápidas",
        icon: UserPlus,
        onSelect: () => router.push("/drivers?new=1"),
      },
      {
        id: "action-new-vehicle",
        label: "Adicionar veículo",
        group: "Ações rápidas",
        icon: UserPlus,
        onSelect: () => router.push("/vehicles?new=1"),
      },
    ];

    const navItems: CommandItem[] = NAV_ITEMS.map((item) => ({
      id: item.href,
      label: `Ir para ${item.label}`,
      group: "Navegação",
      icon: item.icon,
      onSelect: () => router.push(item.href),
    }));

    const orderItems: CommandItem[] = (orders ?? [])
      .slice(0, 30)
      .map((order) => ({
        id: `order-${order.id}`,
        label: `${order.id} — ${order.destination}`,
        group: "Pesquisar pedido",
        icon: Search,
        onSelect: () => router.push(`/orders?highlight=${order.id}`),
      }));

    return [...quickActions, ...navItems, ...orderItems];
  }, [orders, router]);

  return (
    <div className="bg-background flex h-dvh overflow-hidden">
      <Sidebar
        brandName={companyName}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((current) => !current)}
        className="hidden lg:flex"
      />

      <DrawerRoot
        open={mobileOpen}
        onOpenChange={(details) => setMobileOpen(details.open)}
        swipeDirection={getDrawerSwipeDirection("left")}
      >
        <DrawerContent side="left" className="max-w-72 p-0">
          <Sidebar
            brandName={companyName}
            showToggle={false}
            onNavigate={() => setMobileOpen(false)}
          />
        </DrawerContent>
      </DrawerRoot>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          breadcrumb={breadcrumb}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          onOpenCommandMenu={() => setCommandOpen(true)}
          userName={userName}
          userEmail={userEmail}
          userMenuItems={userMenuItems}
          onUserMenuSelect={handleUserMenuSelect}
        />
        {/* Sem padding aqui de propósito — é nele que o CommandMenu é portado
            (`inset-0` precisa colar nas bordas, sem a folga do p-6 do main). */}
        <div ref={contentRef} className="relative flex-1 overflow-hidden">
          <main className="h-full overflow-y-auto p-6">{children}</main>

          <CommandMenu
            open={commandOpen}
            onOpenChange={setCommandOpen}
            items={commandItems}
            portalContainer={contentRef}
          />
        </div>
      </div>
    </div>
  );
}
