"use client";

import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { Tabs, TabsProps } from "antd";
import { UsersIcon } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function ClientsDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { clientId } = useParams();
  const pathname = usePathname();

  const getTabKeyFromPath = () => {
    if (pathname?.endsWith("/details")) {
      return "details";
    } else if (pathname?.endsWith("/orders")) {
      return "orders";
    } else if (pathname?.endsWith("/routes")) {
      return "routes";
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "details",
      label: "Detalhes",
      children: children,
    },
    {
      key: "orders",
      label: "Pedidos",
      children: children,
    },
    {
      key: "routes",
      label: "Rotas",
      children: children,
    },
  ];
  return (
    <>
      <HeaderPage
        title="Clientes"
        icon={UsersIcon}
        backTo={{ link: "/clients", title: "Voltar para página de clientes." }}
      />
      <Tabs
        activeKey={getTabKeyFromPath()}
        items={items}
        onChange={(key) => router.push(`/clients/${clientId}/${key}`)}
      />
    </>
  );
}
