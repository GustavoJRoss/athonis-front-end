"use client";

import { GitGraphIcon, UsersIcon } from "lucide-react";
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
      route: "/dashboard",
      icon: GitGraphIcon,
      title: "Dashboards",
      description: "Organize e controle seus dados.",
    },
  ];

  return (
    <div className="w-full h-full flex justify-center gap-6 flex-wrap items-center">
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
