"use client";

import { Button, Layout, Menu, theme, Tooltip, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  HomeFilled,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const LayoutRootPage = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  return (
    <Layout className="m-0 p-0">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        color="emerald-600"
        className="!bg-emerald-800 pt-2"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-nowrap items-center gap-4 justify-center">
            <Image
              height={50}
              width={50}
              alt="Forte logo"
              src={"/FORTE.png"}
              className="rounded border-2 border-emerald-800"
              onClick={() => router.push("/home")}
            />
          </div>
          <Menu
            className="!bg-emerald-800 *:!text-white "
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <HomeOutlined />,
                label: "Clientes",
              },
              {
                key: "2",
                icon: <UserOutlined />,
                label: "Clientes",
              },
              {
                key: "3",
                icon: <UploadOutlined />,
                label: "Importação Pedidos",
              },
            ]}
          />
        </div>
      </Sider>
      <Layout>
        <Header className="!p-2 !m-0 flex flex-nowrap justify-between h-full items-center text-emerald-800 !bg-white shadow-md">
          <Tooltip title={collapsed ? "Expandir menu" : "Recolher menu"}>
            <Button
              type="text"
              className="!text-emerald-700 !text-xl"
              size="large"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </Tooltip>
          <div className="flex flex-nowrap gap-5 items-center">
            <Typography className="!text-emerald-700 font-semibold !text-lg">
              Forte Acessórios para Móveis
            </Typography>
            <Tooltip title="Perfil">
              <Button
                type="text"
                className="!text-emerald-700 !text-xl"
                size="large"
                icon={<UserOutlined />}
              />
            </Tooltip>
          </div>
        </Header>
        <Content className="h-[calc(100vh-64px)] flex flex-col flex-nowrap p-4 gap-8">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
