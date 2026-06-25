import { z } from "zod";

/**
 * Contrato del buzón de entrada (conversaciones + notificaciones).
 *
 * Cubre dos transportes:
 *  - REST: el snapshot inicial (`buzonSnapshotSchema`) que se carga al abrir el
 *    buzón.
 *  - WebSocket: los eventos en tiempo real (`eventoBuzonSchema`) que el backend
 *    emitirá y que el cliente validará antes de despacharlos al store de zustand.
 *
 * Los mensajes directos se modelan como conversaciones por usuario: cada usuario
 * tiene un hilo, de modo que un mensaje entrante de alguien nuevo crea su
 * conversación (y, con la ruta dinámica `/pages/buzon/[usuario]`, su página).
 */

/** Un mensaje dentro de un hilo de conversación. */
export const mensajeChatSchema = z.object({
  id: z.string(),
  texto: z.string(),
  /** Fecha en ISO 8601 (UTC). */
  fecha: z.string(),
  /** true si lo envié yo; false si lo envió el otro usuario. */
  propio: z.boolean(),
  leido: z.boolean(),
});

export type MensajeChat = z.infer<typeof mensajeChatSchema>;

/** Conversación con otro usuario. `usuario` (handle) hace de id y de slug de ruta. */
export const conversacionSchema = z.object({
  usuario: z.string(),
  mensajes: z.array(mensajeChatSchema),
});

export type Conversacion = z.infer<typeof conversacionSchema>;

export const tipoNotificacionSchema = z.enum([
  "seguidor",
  "comentario",
  "like",
  "sistema",
]);

export type TipoNotificacion = z.infer<typeof tipoNotificacionSchema>;

export const notificacionSchema = z.object({
  id: z.string(),
  tipo: tipoNotificacionSchema,
  texto: z.string(),
  fecha: z.string(),
  leido: z.boolean(),
});

export type Notificacion = z.infer<typeof notificacionSchema>;

/** Snapshot inicial servido por REST al cargar el buzón (antes de abrir el socket). */
export const buzonSnapshotSchema = z.object({
  conversaciones: z.array(conversacionSchema),
  notificaciones: z.array(notificacionSchema),
});

export type BuzonSnapshot = z.infer<typeof buzonSnapshotSchema>;

/**
 * Frame en tiempo real del WebSocket. Unión discriminada por `tipo`:
 *  - `mensaje`: lo envía `de` (otro usuario); el store lo añade a su hilo.
 *  - `notificacion`: una notificación suelta.
 */
export const eventoBuzonSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("mensaje"),
    de: z.string(),
    mensaje: z.object({
      id: z.string(),
      texto: z.string(),
      fecha: z.string(),
    }),
  }),
  z.object({ tipo: z.literal("notificacion"), payload: notificacionSchema }),
]);

export type EventoBuzon = z.infer<typeof eventoBuzonSchema>;
