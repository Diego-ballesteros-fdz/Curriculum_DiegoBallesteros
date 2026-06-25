import { cookies } from "next/headers";

import { SESSION_COOKIE, SESSION_MAX_AGE } from "./config";
import { signToken, verifyToken } from "./token";
import { buscarPorId } from "./users";
import type { SessionUser } from "./types";

/**
 * Lectura de la sesión en el servidor (Server Components, layouts, actions).
 *
 * Verifica el token firmado de la cookie y resuelve el usuario. Es la
 * comprobación de seguridad real (el middleware solo hace un primer filtro).
 */
export async function getSession(): Promise<{ user: SessionUser } | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = buscarPorId(payload.sub);
  return user ? { user } : null;
}

export async function crearSesion(userId: string): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const token = await signToken({ sub: userId, exp });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destruirSesion(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
