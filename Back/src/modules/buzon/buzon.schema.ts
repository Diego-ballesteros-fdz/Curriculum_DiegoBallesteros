import { z } from 'zod';

import { notificationSchema } from '@/modules/notification/notification.schema.js';

// ==========================================
// CONTRATO DEL BUZÓN (CONVERSACION)
// ==========================================
//
// Alineado con `lib/schemas/buzon.ts` del front. Los mensajes directos se
// modelan como conversaciones por usuario: cada `usuario` (handle) es id/slug
// del hilo. `fecha` viaja como ISO 8601 (UTC). Las notificaciones del snapshot
// usan el contrato del módulo `notification`.

export const TEXTO_MAX = 1000;

export const mensajeChatSchema = z.object({
  id: z.string(),
  texto: z.string(),
  fecha: z.string(),
  propio: z.boolean(),
  leido: z.boolean(),
});

// Hilo completo de una conversación (detalle bajo demanda: `GET /:usuario`).
export const conversacionSchema = z.object({
  usuario: z.string(),
  mensajes: z.array(mensajeChatSchema),
});

// Resumen de un hilo para la LISTA del buzón: último mensaje (vista previa) y
// nº de mensajes recibidos sin leer. NO incluye el historial completo: este se
// carga al abrir la conversación. El backend devuelve la lista ya ordenada por
// último mensaje (más reciente primero).
export const conversacionResumenSchema = z.object({
  usuario: z.string(),
  ultimoMensaje: mensajeChatSchema.nullable(),
  noLeidos: z.number().int(),
});

// Snapshot inicial servido por REST al cargar el buzón: SOLO la lista de
// conversaciones (resúmenes) + notificaciones. El historial es bajo demanda.
export const buzonSnapshotSchema = z.object({
  conversaciones: z.array(conversacionResumenSchema),
  notificaciones: z.array(notificationSchema),
});

export const buzonParamsSchema = z.object({ usuario: z.string().min(1) });

export const enviarMensajeSchema = z.object({
  texto: z
    .string()
    .trim()
    .min(1, 'El mensaje no puede estar vacío')
    .max(TEXTO_MAX, `El mensaje no puede superar los ${TEXTO_MAX} caracteres`),
});

export const marcarLeidoRespuestaSchema = z.object({ count: z.number().int() });

export type MensajeChatDTO = z.infer<typeof mensajeChatSchema>;
export type ConversacionDTO = z.infer<typeof conversacionSchema>;
export type ConversacionResumenDTO = z.infer<typeof conversacionResumenSchema>;
export type BuzonSnapshotDTO = z.infer<typeof buzonSnapshotSchema>;
export type EnviarMensajeInput = z.infer<typeof enviarMensajeSchema>;
