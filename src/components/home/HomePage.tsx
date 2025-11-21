"use client";

import {
  CarIcon,
  GitGraphIcon,
  PackageIcon,
  RouteIcon,
  UploadIcon,
  UsersIcon,
} from "lucide-react";
import HomePageCards from "./HomePageCards";

export default function HomePage() {
  const cardContent = [
    {
      route: "/clients",
      icon: UsersIcon,
      title: "Clientes",
      description: "Organize e controle seus clientes.",
    },
    {
      route: "/orders",
      icon: PackageIcon,
      title: "Pedidos",
      description: "Gerencie e acompanhe seus pedidos.",
    },
    {
      route: "/vehicles",
      icon: CarIcon,
      title: "Veículos",
      description: "Controle e organize sua frota.",
    },
    {
      route: "/drivers",
      icon: UsersIcon,
      title: "Motoristas",
      description: "Gerencie os motoristas e suas atividades.",
    },
    {
      route: "/orders/import",
      icon: UploadIcon,
      title: "Importação de Pedidos",
      description: "Impor­te pedidos via planilha.",
    },
    {
      route: "/routes",
      icon: RouteIcon,
      title: "Rotas",
      description: "Gere, visualize e controle suas rotas.",
    },
  ];

  return (
    <div className="w-full grid grid-cols-4 justify-center gap-6 ">
      {cardContent.map((card, index) => (
        <HomePageCards
          key={index}
          description={card.description}
          icon={card.icon}
          route={card.route}
          title={card.title}
        />
      ))}
    </div>
  );
}
