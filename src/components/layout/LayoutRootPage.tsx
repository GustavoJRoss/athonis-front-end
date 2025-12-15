"use client";

import { Button, Layout, Menu, theme, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import {
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
        className="!bg-emerald-600 pt-2"
      >
        <div className="flex flex-col gap-4">
          {/* <Image
            height={50}
            width={50}
            alt="Forte logo"
            src={"/FORTE.png"}
            className="rounded border-2 border-emerald-800"
            onClick={() => router.push("/home")}
          /> */}
          <div className="flex flex-nowrap items-center gap-4 justify-center">
            <Image
              height={50}
              width={50}
              alt="Forte logo"
              src={"/FORTE.png"}
              className="rounded border-2 border-emerald-800"
              onClick={() => router.push("/home")}
            />
            {!collapsed && (
              <Typography style={{ color: "white" }}>Athonis</Typography>
            )}
          </div>
          <Menu
            className="!bg-emerald-600 *:!text-white "
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "nav 1",
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: "nav 2",
              },
              {
                key: "3",
                icon: <UploadOutlined />,
                label: "nav 3",
              },
            ]}
          />
        </div>
      </Sider>
      <Layout>
        <Header className="!p-2 !m-0 flex flex-nowrap h-full items-center text-emerald-800 !bg-white shadow-md">
          <Button
            type="text"
            className="!text-emerald-700 !text-xl"
            size="large"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Header>
        <Content className="h-[calc(100vh-64px)] flex flex-col p-4">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
