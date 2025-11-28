"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  CarIcon,
  List,
  PackageIcon,
  RouteIcon,
  UploadIcon,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function MenuList() {
  const router = useRouter();

  const items = [
    { label: "Pedidos", route: "/orders", icon: PackageIcon },
    { label: "Rotas", route: "/routes", icon: RouteIcon },
    { label: "Clientes", route: "/clients", icon: UsersIcon },
    { label: "Motoristas", route: "/drivers", icon: UsersIcon },
    { label: "Veículos", route: "/vehicles", icon: CarIcon },
    {
      label: "Importação de Pedidos",
      route: "/orders/import",
      icon: UploadIcon,
    },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {/* Trigger com fundo transparente e hover emerald escuro */}
          <NavigationMenuTrigger
            className="
              bg-transparent 
              text-white 
              hover:bg-emerald-700 
              data-[state=open]:bg-emerald-700
            "
          >
            <List className="h-5 w-5 text-white hover:stroke-emerald-600" />
          </NavigationMenuTrigger>

          {/* Conteúdo com fundo verde */}
          <NavigationMenuContent>
            <ul className="grid gap-1 p-2 w-48">
              {items.map((item) => {
                const Icon = item?.icon;
                return (
                  <li key={item.route} className="flex gap-1 items-center">
                    <Icon className="stroke-emerald-700" />
                    <NavigationMenuLink
                      onClick={() => router.push(item.route)}
                      className="
                      block 
                      cursor-pointer 
                    "
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </li>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
