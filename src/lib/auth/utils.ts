"use server";

import { cookies } from "next/headers";

export async function validateToken(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString());

    if (!decoded.exp) return { valid: false };

    const isExpired = Date.now() >= decoded.exp * 1000;

    return { valid: !isExpired, payload: decoded };
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return { valid: false };
  }
}

export const getToken = async () => {
  const cookiesStorage = await cookies();
  const token = cookiesStorage.get("auth_token")?.value;
  return token;
};
