import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateToken } from "./lib/auth/utils";

// Remova o 'default' aqui
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/client") ||
    pathname.startsWith("/home") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/drivers") ||
    pathname.startsWith("/vehicles") ||
    pathname.startsWith("/routes");

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { valid } = await validateToken(token);
    console.log({ valid });
    if (!valid) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  if (pathname === "/login" && token) {
    const { valid } = await validateToken(token);
    if (valid) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/client/:path*",
    "/home/:path*",
    "/login",
    "/drivers/:path*",
    "/vehicles/:path*",
    "/orders/:path*",
    "/routes/:path*",
  ],
};
