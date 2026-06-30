import { z } from 'zod';

// ==========================================
// CONTRATO DEL BUZÓN (CONVERSACION)
// ==========================================
//
// Alineado con `lib/schemas/buzon.ts` del front. Los mensajes directos se
// modelan como conversaciones por usuario: cada `usuario` (handle) es id/slug
// del hilo. `fecha` viaja como ISO 8601 (UTC).

export const TEXTO_MAX = 1000;

export const mensajeChatSchema = z.object({
  id: z.string(),
  texto: z.string(),
  fecha: z.string(),
  propio: z.boolean(),
  leido: z.boolean(),
});

export const conversacionSchema = z.object({
  usuario: z.string(),
  mensajes: z.array(mensajeChatSchema),
});

export const tipoNotificacionSchema = z.enum(['seguidor', 'comentario', 'like', 'sistema']);

export const notificacionSchema = z.object({
  id: z.string(),
  tipo: tipoNotificacionSchema,
  texto: z.string(),
  fecha: z.string(),
  leido: z.boolean(),
});

// Snapshot inicial servido por REST al cargar el buzón.
export const buzonSnapshotSchema = z.object({
  conversaciones: z.array(conversacionSchema),
  notificaciones: z.array(notificacionSchema),
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
export type BuzonSnapshotDTO = z.infer<typeof buzonSnapshotSchema>;
export type EnviarMensajeInput = z.infer<typeof enviarMensajeSchema>;
