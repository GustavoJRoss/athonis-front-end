// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateToken } from "./src/lib/auth/utils";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/client") ||
    pathname.startsWith("/home") ||
    pathname.startsWith("/orders");
  // 🔒 Bloqueia se rota for protegida e não houver token
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { valid } = await validateToken(token);

    if (!valid) {
      // token expirado ou inválido
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // 🔁 Se tentar acessar /login mas já estiver logado, redireciona pra /home
  if (pathname === "/login" && token) {
    const { valid } = await validateToken(token);
    if (valid) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  // ✅ prossegue normalmente
  return NextResponse.next();
}

export const config = {
  matcher: ["/client/:path*", "/home/:path*", "/login"],
};
