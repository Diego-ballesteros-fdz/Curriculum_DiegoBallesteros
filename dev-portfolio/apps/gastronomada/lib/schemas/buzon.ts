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

/** Hilo completo con otro usuario (detalle bajo demanda). `usuario` (handle) hace
 *  de id y de slug de ruta. */
export const conversacionSchema = z.object({
  usuario: z.string(),
  mensajes: z.array(mensajeChatSchema),
});

export type Conversacion = z.infer<typeof conversacionSchema>;

/** Resumen de un hilo para la LISTA del buzón: último mensaje (vista previa) y
 *  nº de mensajes recibidos sin leer. El historial completo se carga al abrir la
 *  conversación (`conversacionSchema`), no aquí. */
export const conversacionResumenSchema = z.object({
  usuario: z.string(),
  ultimoMensaje: mensajeChatSchema.nullable(),
  noLeidos: z.number().int(),
});

export type ConversacionResumen = z.infer<typeof conversacionResumenSchema>;

/** Tipo de notificación: `mention` (foro), `dm` (mensaje directo), `sistema`. */
export const tipoNotificacionSchema = z.enum(["mention", "dm", "sistema"]);

export type TipoNotificacion = z.infer<typeof tipoNotificacionSchema>;

export const notificacionSchema = z.object({
  id: z.string(),
  type: tipoNotificacionSchema,
  texto: z.string(),
  leido: z.boolean(),
  /** Origen (nombre del usuario) y enlaces opcionales según el tipo. */
  from: z.string().nullish(),
  foroMessageId: z.string().nullish(),
  conversacionId: z.string().nullish(),
  fecha: z.string(),
});

export type Notificacion = z.infer<typeof notificacionSchema>;

/** Snapshot inicial servido por REST al cargar el buzón: SOLO la lista de
 *  conversaciones (resúmenes) + notificaciones. El historial es bajo demanda. */
export const buzonSnapshotSchema = z.object({
  conversaciones: z.array(conversacionResumenSchema),
  notificaciones: z.array(notificacionSchema),
});

export type BuzonSnapshot = z.infer<typeof buzonSnapshotSchema>;
