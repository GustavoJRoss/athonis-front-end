import {
  BarChart3,
  LayoutDashboard,
  MapPinned,
  Package,
  Route as RouteIcon,
  Settings,
  Truck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Pedidos", href: "/orders", icon: Package },
  { label: "Rotas", href: "/routes", icon: RouteIcon },
  { label: "Acompanhamento", href: "/tracking", icon: MapPinned },
  { label: "Clientes", href: "/customers", icon: Users },
  { label: "Motoristas", href: "/drivers", icon: UserRound },
  { label: "Veículos", href: "/vehicles", icon: Truck },
  { label: "Indicadores", href: "/analytics", icon: BarChart3 },
  { label: "Configurações", href: "/settings", icon: Settings },
];
