import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PrivateHeader from "@/src/components/header/PrivateHeader";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <header>
        <PrivateHeader />
      </header>
      <main className="p-6 flex flex-col gap-6 h-[calc(100vh-68px)] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
