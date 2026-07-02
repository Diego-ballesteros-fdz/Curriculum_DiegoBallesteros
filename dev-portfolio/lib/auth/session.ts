import { cookies } from "next/headers";

import type { SessionUser } from "./types";

/**
 * URL del backend de autenticación (server-only). El front reescribe
 * `/api/auth/*` hacia aquí (ver `next.config.ts`); para leer la sesión en el
 * servidor llamamos directamente al back reenviando la cookie del usuario.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

interface BackendSession {
  user: SessionUser;
}

/**
 * Lectura de la sesión en el servidor (layouts, Server Components, guards).
 *
 * Reenvía las cookies de la petición al endpoint `get-session` de better-auth.
 * Es la comprobación AUTORITATIVA (el middleware solo hace un filtro optimista).
 * Si el backend no responde, se trata como "sin sesión" (fail-closed).
 */
export async function getSession(): Promise<{ user: SessionUser } | null> {
  const cookieHeader = (await cookies()).toString();
  if (!cookieHeader) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      // La sesión depende de la cookie del usuario: nunca cachear.
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = (await res.json()) as BackendSession | null;
    return data?.user ? { user: data.user } : null;
  } catch {
    return null;
  }
}
