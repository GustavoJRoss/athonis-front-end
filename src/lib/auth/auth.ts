"use server";

import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "seu-secret-super-seguro-aqui"
);

export async function validateToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null };
  }
}
