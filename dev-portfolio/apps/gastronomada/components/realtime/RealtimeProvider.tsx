"use client";

import { useEffect } from "react";

import { useUsuario } from "@/components/auth/SessionProvider";
import { authClient } from "@/lib/auth-client";
import { wsClient } from "@/lib/realtime/ws-client";

/**
 * Abre (y mantiene) la conexión WebSocket mientras haya sesión.
 *
 * Se monta una sola vez en el layout: obtiene el `session.token` de Better Auth
 * (que sí es legible por el cliente, a diferencia de la cookie httpOnly) y lo
 * pasa al `wsClient`. El propio cliente gestiona reconexión y heartbeat. Al
 * cerrar sesión (deja de haber usuario) se desconecta. No renderiza nada.
 */
export default function RealtimeProvider() {
  const usuario = useUsuario();

  useEffect(() => {
    if (!usuario) return;

    let cancelado = false;
    (async () => {
      const { data } = await authClient.getSession();
      const token = data?.session?.token;
      if (token && !cancelado) wsClient.connect(token);
    })();

    return () => {
      cancelado = true;
      wsClient.disconnect();
    };
  }, [usuario]);

  return null;
}
