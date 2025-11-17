"use server";

import { api } from "./axios";
import { cookies } from "next/headers";

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const apiRequest = await api();
  const { data, status } = await apiRequest.post("/auth/login", {
    email: username,
    password,
  });

  if (status === 200 && data.access_token) {
    const cookieStore = await cookies();

    cookieStore.set("auth_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.expires_in || 60 * 60,
      path: "/",
    });

    return { success: true, user: data.user };
  }

  return { success: false, message: "Credenciais inválidas" };
}
