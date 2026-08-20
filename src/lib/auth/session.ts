import "server-only";
import { cookies } from "next/headers";
import { decodeJwtPayload, isJwtExpired } from "./jwt";

export const SESSION_COOKIE = "auth_token";

export type SessionPayload = {
  sub?: string;
  email?: string;
  name?: string;
  role?: string;
  exp?: number;
  [key: string]: unknown;
};

export async function createSession(token: string, expiresInSeconds = 60 * 60) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresInSeconds,
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

/** Retorna o payload decodificado da sessão, ou null se ausente/expirada. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = await getSessionToken();
  if (!token) return null;

  const payload = decodeJwtPayload<SessionPayload>(token);
  if (!payload || isJwtExpired(payload)) return null;

  return payload;
}
