import "server-only";
import axios from "axios";
import { getSessionToken } from "@/lib/auth/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/** Cliente axios sem autenticação — usado para login. */
export function createApiClient() {
  return axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10_000,
  });
}

/** Cliente axios autenticado com o token da sessão atual — usado em chamadas protegidas. */
export async function createAuthenticatedApiClient() {
  const token = await getSessionToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 10_000,
  });
}
