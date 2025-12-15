import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PrivateHeader from "@/src/components/header/PrivateHeader";
import { LayoutRootPage } from "@/src/components/layout/LayoutRootPage";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutRootPage>{children}</LayoutRootPage>;
}
