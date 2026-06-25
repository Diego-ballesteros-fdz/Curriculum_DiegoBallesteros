import { create } from "zustand";

import { BUZON_SEED } from "@/lib/data/buzon";
import type {
  BuzonSnapshot,
  Conversacion,
  MensajeChat,
  Notificacion,
} from "@/lib/schemas/buzon";

/**
 * Store de zustand del buzón (conversaciones + notificaciones).
 *
 * Aquí zustand es la opción correcta: es estado de dominio en tiempo real
 * (no estado visual) que se comparte entre el badge del nav, la lista del buzón
 * y cada página de conversación, y que en el futuro alimentará un WebSocket.
 * `recibirMensaje` es el punto de entrada que disparará el socket; `hidratar`
 * carga el snapshot REST. El estado visual (pestaña activa, etc.) vive fuera,
 * en `useState`.
 */
interface BuzonState {
  conversaciones: Conversacion[];
  notificaciones: Notificacion[];
  conectado: boolean;

  // Mensaje entrante de otro usuario (lo disparará el WebSocket). Crea el hilo
  // si el usuario aún no tiene conversación.
  recibirMensaje: (
    de: string,
    mensaje: { id: string; texto: string; fecha: string },
  ) => void;
  // Mensaje que envío yo en un hilo.
  enviarMensaje: (usuario: string, texto: string) => void;

  recibirNotificacion: (notificacion: Notificacion) => void;

  marcarConversacionLeida: (usuario: string) => void;
  marcarNotificacionLeida: (id: string) => void;
  marcarTodoLeido: () => void;

  setConectado: (conectado: boolean) => void;
  hidratar: (snapshot: BuzonSnapshot) => void;
}

/** Añade un mensaje al hilo del usuario (creándolo si no existe) y lo mueve arriba. */
function anadirMensaje(
  conversaciones: Conversacion[],
  usuario: string,
  mensaje: MensajeChat,
): Conversacion[] {
  const idx = conversaciones.findIndex((c) => c.usuario === usuario);
  if (idx === -1) {
    return [{ usuario, mensajes: [mensaje] }, ...conversaciones];
  }
  const actualizada: Conversacion = {
    ...conversaciones[idx],
    mensajes: [...conversaciones[idx].mensajes, mensaje],
  };
  return [
    actualizada,
    ...conversaciones.slice(0, idx),
    ...conversaciones.slice(idx + 1),
  ];
}

export const useBuzonStore = create<BuzonState>((set) => ({
  // Semilla temporal hasta que exista el backend (ver lib/data/buzon.ts).
  conversaciones: BUZON_SEED.conversaciones,
  notificaciones: BUZON_SEED.notificaciones,
  conectado: false,

  recibirMensaje: (de, mensaje) =>
    set((s) => ({
      conversaciones: anadirMensaje(s.conversaciones, de, {
        ...mensaje,
        propio: false,
        leido: false,
      }),
    })),

  enviarMensaje: (usuario, texto) =>
    set((s) => ({
      conversaciones: anadirMensaje(s.conversaciones, usuario, {
        id: crypto.randomUUID(),
        texto,
        fecha: new Date().toISOString(),
        propio: true,
        leido: true,
      }),
    })),

  recibirNotificacion: (notificacion) =>
    set((s) => ({ notificaciones: [notificacion, ...s.notificaciones] })),

  marcarConversacionLeida: (usuario) =>
    set((s) => ({
      conversaciones: s.conversaciones.map((c) =>
        c.usuario === usuario
          ? { ...c, mensajes: c.mensajes.map((m) => ({ ...m, leido: true })) }
          : c,
      ),
    })),
  marcarNotificacionLeida: (id) =>
    set((s) => ({
      notificaciones: s.notificaciones.map((n) =>
        n.id === id ? { ...n, leido: true } : n,
      ),
    })),
  marcarTodoLeido: () =>
    set((s) => ({
      conversaciones: s.conversaciones.map((c) => ({
        ...c,
        mensajes: c.mensajes.map((m) => ({ ...m, leido: true })),
      })),
      notificaciones: s.notificaciones.map((n) => ({ ...n, leido: true })),
    })),

  setConectado: (conectado) => set({ conectado }),
  hidratar: (snapshot) =>
    set({
      conversaciones: snapshot.conversaciones,
      notificaciones: snapshot.notificaciones,
    }),
}));

// ── Selectores derivados reutilizables ──────────────────────────────────────
export const selectMensajesNoLeidos = (s: BuzonState) =>
  s.conversaciones.reduce(
    (acc, c) => acc + c.mensajes.filter((m) => !m.leido).length,
    0,
  );

export const selectNotificacionesNoLeidas = (s: BuzonState) =>
  s.notificaciones.filter((n) => !n.leido).length;

export const selectTotalNoLeidos = (s: BuzonState) =>
  selectMensajesNoLeidos(s) + selectNotificacionesNoLeidas(s);

/** Selector parametrizado para la página de conversación. */
export const selectConversacion = (usuario: string) => (s: BuzonState) =>
  s.conversaciones.find((c) => c.usuario === usuario);
