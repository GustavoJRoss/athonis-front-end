import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToasterProvider } from "@/components/ui/toaster";
import "antd/dist/reset.css";
import "./globals.css";
import { AntdProvider } from "../components/providers/AntdProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Athonis",
  description: "Gerenciamento de rotas e pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToasterProvider>
          <AntdProvider>{children}</AntdProvider>
        </ToasterProvider>
      </body>
    </html>
  );
}
