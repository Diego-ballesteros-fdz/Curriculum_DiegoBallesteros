import { NextResponse, type NextRequest } from "next/server";

import { AUTH_SESSION_COOKIE, esRutaAuth, esRutaPublica } from "@/lib/auth/config";

/**
 * Primer filtro de acceso (modelo de ruta protegida) — OPTIMISTA.
 *
 * Comprueba solo la PRESENCIA de la cookie de sesión de better-auth (es httpOnly
 * y la firma la valida el backend, no el Edge). Combinado con la verificación
 * autoritativa de `getSession()` en el servidor es defensa en profundidad:
 *  - saca de las páginas de auth a quien ya parece tener sesión,
 *  - redirige a `/gastronomada/login` cualquier ruta no pública sin cookie de sesión.
 *
 * Una cookie falseada supera este filtro pero la rechazará el backend en el SSR.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const tieneSesion =
    req.cookies.has(AUTH_SESSION_COOKIE) ||
    req.cookies.has(`__Secure-${AUTH_SESSION_COOKIE}`);

  if (tieneSesion && esRutaAuth(pathname)) {
    return NextResponse.redirect(new URL("/gastronomada", req.url));
  }

  if (!tieneSesion && !esRutaPublica(pathname)) {
    const url = new URL("/gastronomada/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Solo protege la app Gastronómada; el portfolio (raíz) es público. La API,
  // los assets de Next y las imágenes viven fuera de `/gastronomada`, así que
  // este prefijo ya los excluye.
  matcher: ["/gastronomada/:path*"],
};
