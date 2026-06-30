import { create } from "zustand";

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
 * y cada página de conversación. El snapshot inicial llega por REST
 * (`hidratar`/`hidratarHilo`); las novedades, por WebSocket (`recibirMensaje`,
 * `recibirNotificacion`). El estado visual (pestaña activa, etc.) vive fuera,
 * en `useState`.
 */
interface BuzonState {
  conversaciones: Conversacion[];
  notificaciones: Notificacion[];
  conectado: boolean;

  // Mensaje entrante de otro usuario (lo dispara el WebSocket). Crea el hilo
  // si el usuario aún no tiene conversación.
  recibirMensaje: (
    de: string,
    mensaje: { id: string; texto: string; fecha: string },
  ) => void;
  // Añade un mensaje ya formado a un hilo (tras enviarlo por REST). Crea el hilo
  // si no existe.
  agregarMensaje: (usuario: string, mensaje: MensajeChat) => void;

  recibirNotificacion: (notificacion: Notificacion) => void;

  marcarConversacionLeida: (usuario: string) => void;
  marcarNotificacionLeida: (id: string) => void;
  marcarTodoLeido: () => void;

  setConectado: (conectado: boolean) => void;
  hidratar: (snapshot: BuzonSnapshot) => void;
  // Reemplaza los mensajes de un hilo concreto con los del backend.
  hidratarHilo: (usuario: string, mensajes: MensajeChat[]) => void;
}

/** ¿El hilo de `usuario` ya contiene un mensaje con ese id? (evita duplicados
 *  cuando el eco del WebSocket llega tras el añadido optimista del REST). */
function existeMensaje(
  conversaciones: Conversacion[],
  usuario: string,
  id: string,
): boolean {
  const conv = conversaciones.find((c) => c.usuario === usuario);
  return conv?.mensajes.some((m) => m.id === id) ?? false;
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
  // Vacío hasta hidratar desde el backend (`hidratar` con el snapshot REST).
  conversaciones: [],
  notificaciones: [],
  conectado: false,

  recibirMensaje: (de, mensaje) =>
    set((s) =>
      existeMensaje(s.conversaciones, de, mensaje.id)
        ? s
        : {
            conversaciones: anadirMensaje(s.conversaciones, de, {
              ...mensaje,
              propio: false,
              leido: false,
            }),
          },
    ),

  agregarMensaje: (usuario, mensaje) =>
    set((s) =>
      existeMensaje(s.conversaciones, usuario, mensaje.id)
        ? s
        : { conversaciones: anadirMensaje(s.conversaciones, usuario, mensaje) },
    ),

  recibirNotificacion: (notificacion) =>
    set((s) =>
      s.notificaciones.some((n) => n.id === notificacion.id)
        ? s
        : { notificaciones: [notificacion, ...s.notificaciones] },
    ),

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
  hidratarHilo: (usuario, mensajes) =>
    set((s) => {
      const existe = s.conversaciones.some((c) => c.usuario === usuario);
      return {
        conversaciones: existe
          ? s.conversaciones.map((c) =>
              c.usuario === usuario ? { ...c, mensajes } : c,
            )
          : [{ usuario, mensajes }, ...s.conversaciones],
      };
    }),
}));

// ── Selectores derivados reutilizables ──────────────────────────────────────
export const selectMensajesNoLeidos = (s: BuzonState) =>
  s.conversaciones.reduce(
    (acc, c) => acc + c.mensajes.filter((m) => !m.leido && !m.propio).length,
    0,
  );

export const selectNotificacionesNoLeidas = (s: BuzonState) =>
  s.notificaciones.filter((n) => !n.leido).length;

export const selectTotalNoLeidos = (s: BuzonState) =>
  selectMensajesNoLeidos(s) + selectNotificacionesNoLeidas(s);

/** Selector parametrizado para la página de conversación. */
export const selectConversacion = (usuario: string) => (s: BuzonState) =>
  s.conversaciones.find((c) => c.usuario === usuario);
