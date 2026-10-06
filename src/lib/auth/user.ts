import "server-only";
import { getSession } from "./session";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

function toAuthUser(session: NonNullable<Awaited<ReturnType<typeof getSession>>>): AuthUser {
  return {
    id: String(session.sub ?? session.id ?? session.email ?? "unknown"),
    name: String(session.name ?? session.email ?? "Usuário"),
    email: String(session.email ?? ""),
    role: session.role ? String(session.role) : undefined,
  };
}

/** Usuário autenticado atual, extraído das claims do JWT. Null se não houver sessão válida. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session) return null;
  return toAuthUser(session);
}
