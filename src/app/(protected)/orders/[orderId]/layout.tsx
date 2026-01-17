"use client";

import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
import { Tabs, TabsProps } from "antd";
import { UsersIcon } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function OrdersDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { orderId } = useParams();
  const pathname = usePathname();

  const getTabKeyFromPath = () => {
    if (pathname?.endsWith("/details")) {
      return "details";
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "details",
      label: "Detalhes",
      children: children,
    },
  ];
  return (
    <>
      <HeaderPage
        title="Pedido"
        icon={UsersIcon}
        backTo={{ link: "/orders", title: "Voltar para página de clientes." }}
      />
      <Tabs
        activeKey={getTabKeyFromPath()}
        items={items}
        onChange={(key) => router.push(`/orders/${orderId}/${key}`)}
      />
    </>
  );
}
