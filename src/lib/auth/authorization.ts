import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser, type AuthUser } from "./user";

/** Garante sessão válida em Server Components/layouts; redireciona para /login se ausente. */
export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export function hasRole(user: AuthUser | null, role: string) {
  return user?.role === role;
}
