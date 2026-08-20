"use server";

import { isAxiosError } from "axios";
import { redirect } from "next/navigation";
import { createApiClient } from "@/lib/api/client";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { createSession, deleteSession } from "./session";

export type LoginResult =
  { success: true } | { success: false; message: string };

export async function login(input: LoginInput): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Credenciais inválidas" };
  }

  let token: string | undefined;
  let expiresIn: number | undefined;

  try {
    const api = createApiClient();
    const { data } = await api.post("/auth/login", {
      email: parsed.data.email,
      password: parsed.data.password,
    });
    console.log({ data });
    token = data?.access_token;
    expiresIn = data?.expires_in;
  } catch (error) {
    console.log({ error });
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        return { success: false, message: "Email ou senha incorretos" };
      }
      if (error.code === "ECONNABORTED" || !error.response) {
        return {
          success: false,
          message: "Não foi possível conectar ao servidor. Tente novamente.",
        };
      }
    }
    return { success: false, message: "Erro ao autenticar. Tente novamente." };
  }

  if (!token) {
    return {
      success: false,
      message: "Resposta inválida do servidor de autenticação",
    };
  }

  await createSession(token, expiresIn);
  return { success: true };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
