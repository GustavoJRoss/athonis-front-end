import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateToken } from "@/src/lib/auth/auth";
import PrivateHeader from "@/src/components/header/PrivateHeader";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    return null;
  }

  const { valid, payload } = await validateToken(token.value);

  if (!valid) {
    return null;
  }

  return payload;
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkAuth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col">
      <header>
        <PrivateHeader />
      </header>
      <main className="p-6 flex flex-col gap-6 h-[calc(100vh-68px)]">
        {children}
      </main>
    </div>
  );
}
