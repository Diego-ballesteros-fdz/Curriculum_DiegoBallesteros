import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, esRutaAuth, esRutaPublica } from "@/lib/auth/config";
import { verifyToken } from "@/lib/auth/token";

/**
 * Primer filtro de acceso (modelo de ruta protegida).
 *
 * Verifica el token de sesión (HMAC, Web Crypto compatible con Edge) y:
 *  - redirige a `/pages/login` cualquier ruta no pública sin sesión válida,
 *  - saca de las páginas de auth a quien ya tiene sesión.
 *
 * Es defensa en profundidad junto a `getSession()` en el servidor: aunque
 * alguien falsee la cookie, el token no validará y la página/acción también lo
 * rechazará.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const autenticado = token ? (await verifyToken(token)) !== null : false;

  if (autenticado && esRutaAuth(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!autenticado && !esRutaPublica(pathname)) {
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
