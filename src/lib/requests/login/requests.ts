"use server";

import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "seu-secret-super-seguro-aqui"
);

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const { data, status } = await axios.post(
    "http://localhost:8080/auth/login",
    {
      email: username,
      password,
    }
  );
  console.log({ data, status });
  if (status === 200 && data.access_token) {
    const token = data.access_token;

    // Setar cookie com o token da API
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.expires_in || 60 * 60, // usa o expires_in da API ou 1h como fallback
      path: "/",
    });

    // Opcional: salvar informações do usuário em outro cookie se precisar
    (await cookies()).set("user_info", JSON.stringify(data.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.expires_in || 60 * 60,
      path: "/",
    });

    return {
      success: true,
      message: "Login realizado com sucesso",
      user: data.user,
    };
  }

  return {
    success: false,
    message: "Credenciais inválidas",
  };
}

export async function logout() {
  const response = NextResponse.json(
    { success: true, message: "Logout realizado" },
    { status: 200 }
  );

  response.cookies.delete("auth_token");
  return response;
}
