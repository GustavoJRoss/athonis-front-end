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
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
