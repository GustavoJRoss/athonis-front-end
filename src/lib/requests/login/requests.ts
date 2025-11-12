"use server";

import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
  if (username === "admin" && password === "admin") {
    const token = await new SignJWT({
      username,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET_KEY);

    // Setar cookie
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return { success: true, message: "Login realizado com sucesso" };
  }

  return { error: "Credenciais inválidas" };
}

export async function logout() {
  const response = NextResponse.json(
    { success: true, message: "Logout realizado" },
    { status: 200 }
  );

  response.cookies.delete("auth_token");
  return response;
}
