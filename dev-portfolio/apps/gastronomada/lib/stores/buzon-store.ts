import { create } from "zustand";

import type { BuzonSnapshot, MensajeChat, Notificacion } from "@/lib/schemas/buzon";

/**
 * Store de zustand del buzón (conversaciones + notificaciones).
 *
 * Aquí zustand es la opción correcta: es estado de dominio en tiempo real
 * (no estado visual) que se comparte entre el badge del nav, la lista del buzón
 * y cada página de conversación. NO persiste en `localStorage`: vive solo en
 * memoria y se rehidrata desde el backend en cada montaje del buzón.
 *
 * Flujo de datos:
 *  - La LISTA llega por REST como resúmenes (`hidratar`): cada hilo trae su
 *    último mensaje (vista previa) y su nº de no leídos, NO el historial.
 *  - El HISTORIAL de un hilo se carga bajo demanda al abrirlo (`hidratarHilo`).
 *  - Las novedades en vivo llegan por WebSocket (`agregarMensaje`,
 *    `recibirNotificacion`), con dedup por id para absorber el eco del WS sobre
 *    el añadido optimista del REST.
 * El estado visual (pestaña activa, etc.) vive fuera, en `useState`.
 */

/** Hilo en el store: `mensajes` contiene solo el último mensaje tras el snapshot,
 *  y el historial completo una vez se abre la conversación. `noLeidos` es el
 *  contador de la lista (lo da el backend y lo mantiene el WS). */
export interface HiloBuzon {
  usuario: string;
  mensajes: MensajeChat[];
  noLeidos: number;
}

interface BuzonState {
  conversaciones: HiloBuzon[];
  notificaciones: Notificacion[];
  conectado: boolean;

  // Añade un mensaje a un hilo (lo dispara tanto el envío por REST como el
  // WebSocket). Crea el hilo si no existe, lo mueve arriba e incrementa el
  // contador de no leídos cuando el mensaje es entrante y aún no está leído.
  agregarMensaje: (usuario: string, mensaje: MensajeChat) => void;

  recibirNotificacion: (notificacion: Notificacion) => void;

  marcarConversacionLeida: (usuario: string) => void;
  marcarNotificacionLeida: (id: string) => void;
  marcarTodoLeido: () => void;

  setConectado: (conectado: boolean) => void;
  hidratar: (snapshot: BuzonSnapshot) => void;
  // Reemplaza los mensajes de un hilo concreto con el historial del backend.
  hidratarHilo: (usuario: string, mensajes: MensajeChat[]) => void;
}

/** ¿El hilo de `usuario` ya contiene un mensaje con ese id? (evita duplicados
 *  cuando el eco del WebSocket llega tras el añadido optimista del REST). */
function existeMensaje(
  conversaciones: HiloBuzon[],
  usuario: string,
  id: string,
): boolean {
  const conv = conversaciones.find((c) => c.usuario === usuario);
  return conv?.mensajes.some((m) => m.id === id) ?? false;
}

export const useBuzonStore = create<BuzonState>((set) => ({
  // Vacío hasta hidratar desde el backend (`hidratar` con el snapshot REST).
  conversaciones: [],
  notificaciones: [],
  conectado: false,

  agregarMensaje: (usuario, mensaje) =>
    set((s) => {
      if (existeMensaje(s.conversaciones, usuario, mensaje.id)) return s;
      // Un mensaje entrante sin leer suma al contador; los propios, no.
      const incremento = !mensaje.propio && !mensaje.leido ? 1 : 0;
      const idx = s.conversaciones.findIndex((c) => c.usuario === usuario);
      if (idx === -1) {
        return {
          conversaciones: [
            { usuario, mensajes: [mensaje], noLeidos: incremento },
            ...s.conversaciones,
          ],
        };
      }
      const previa = s.conversaciones[idx];
      const actualizada: HiloBuzon = {
        ...previa,
        mensajes: [...previa.mensajes, mensaje],
        noLeidos: previa.noLeidos + incremento,
      };
      return {
        conversaciones: [
          actualizada,
          ...s.conversaciones.slice(0, idx),
          ...s.conversaciones.slice(idx + 1),
        ],
      };
    }),

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
          ? { ...c, noLeidos: 0, mensajes: c.mensajes.map((m) => ({ ...m, leido: true })) }
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
        noLeidos: 0,
        mensajes: c.mensajes.map((m) => ({ ...m, leido: true })),
      })),
      notificaciones: s.notificaciones.map((n) => ({ ...n, leido: true })),
    })),

  setConectado: (conectado) => set({ conectado }),
  hidratar: (snapshot) =>
    set({
      conversaciones: snapshot.conversaciones.map((c) => ({
        usuario: c.usuario,
        mensajes: c.ultimoMensaje ? [c.ultimoMensaje] : [],
        noLeidos: c.noLeidos,
      })),
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
          : [{ usuario, mensajes, noLeidos: 0 }, ...s.conversaciones],
      };
    }),
}));

// ── Selectores derivados reutilizables ──────────────────────────────────────
export const selectMensajesNoLeidos = (s: BuzonState) =>
  s.conversaciones.reduce((acc, c) => acc + c.noLeidos, 0);

export const selectNotificacionesNoLeidas = (s: BuzonState) =>
  s.notificaciones.filter((n) => !n.leido).length;

export const selectTotalNoLeidos = (s: BuzonState) =>
  selectMensajesNoLeidos(s) + selectNotificacionesNoLeidas(s);

/** Selector parametrizado para la página de conversación. */
export const selectConversacion = (usuario: string) => (s: BuzonState) =>
  s.conversaciones.find((c) => c.usuario === usuario);
