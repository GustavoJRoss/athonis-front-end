import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateToken } from "./src/lib/auth/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/client") || pathname.startsWith("/home");

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { valid } = await validateToken(token);

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
  matcher: ["/client/:path*", "/home/:path*", "/login"],
};
