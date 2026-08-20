import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { decodeJwtPayload, isJwtExpired } from "@/lib/auth/jwt";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/orders",
  "/routes",
  "/customers",
  "/drivers",
  "/vehicles",
  "/analytics",
  "/settings",
];

const PUBLIC_ONLY_PATHS = ["/login"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** Checagem otimista via cookie (claims não verificadas) — a verificação real é do backend. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const hasValidSession = !!token && !isJwtExpired(payload as { exp?: number } | null);

  if (isProtectedPath(pathname) && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/login") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (PUBLIC_ONLY_PATHS.includes(pathname) && hasValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
