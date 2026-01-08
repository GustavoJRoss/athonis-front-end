"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#10b981",
            colorError: "#ef4444", // Cor vermelha para danger
            colorWarning: "#f59e0b", // Cor amarela para warning
            colorInfo: "#3b82f6", // Cor azul para info
            borderRadius: 8,
          },
          components: {
            Menu: {
              itemBg: "#059669",
              itemHoverBg: "#047857",
              itemSelectedBg: "#047857",
              itemColor: "#ffffff",
              itemHoverColor: "#ffffff",
              itemSelectedColor: "#022c22",
              iconSize: 18,
            },
            Button: {
              colorErrorHover: "#dc2626",
              colorErrorActive: "#b91c1c",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
