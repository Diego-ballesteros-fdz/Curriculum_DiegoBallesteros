import { NextResponse, type NextRequest } from "next/server";

import { AUTH_SESSION_COOKIE, esRutaAuth, esRutaPublica } from "@/lib/auth/config";

/**
 * Primer filtro de acceso (modelo de ruta protegida) — OPTIMISTA.
 *
 * Comprueba solo la PRESENCIA de la cookie de sesión de better-auth (es httpOnly
 * y la firma la valida el backend, no el Edge). Combinado con la verificación
 * autoritativa de `getSession()` en el servidor es defensa en profundidad:
 *  - saca de las páginas de auth a quien ya parece tener sesión,
 *  - redirige a `/pages/login` cualquier ruta no pública sin cookie de sesión.
 *
 * Una cookie falseada supera este filtro pero la rechazará el backend en el SSR.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const tieneSesion =
    req.cookies.has(AUTH_SESSION_COOKIE) ||
    req.cookies.has(`__Secure-${AUTH_SESSION_COOKIE}`);

  if (tieneSesion && esRutaAuth(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!tieneSesion && !esRutaPublica(pathname)) {
    const url = new URL("/pages/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Aplica a todo salvo API, assets de Next, imágenes y ficheros con extensión.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|imagenes|.*\\.).*)"],
};
