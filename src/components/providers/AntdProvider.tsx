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
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
