import { redirect, RedirectType } from "next/navigation";
import { LayoutRootPage } from "@/src/components/layout/LayoutRootPage";
import { getToken, validateToken } from "@/src/lib/auth/utils";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await getToken();

  if (!isAuthenticated) {
    redirect("/login", RedirectType.replace);
  }

  return <LayoutRootPage>{children}</LayoutRootPage>;
}
