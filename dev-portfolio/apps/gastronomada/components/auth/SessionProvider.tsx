"use client";

import { createContext, useContext } from "react";

import type { SessionUser } from "@/lib/auth/types";

/**
 * Contexto de sesión para el cliente.
 *
 * El valor lo resuelve el layout (server) con `getSession()` y se inyecta aquí,
 * de modo que componentes cliente como el Nav saben si hay sesión sin volver a
 * pedirla. No guarda datos sensibles, solo el `SessionUser` público.
 */
const SessionContext = createContext<SessionUser | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: SessionUser | null;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}

/** Usuario de la sesión actual, o `null` si no hay sesión. */
export function useUsuario(): SessionUser | null {
  return useContext(SessionContext);
}
