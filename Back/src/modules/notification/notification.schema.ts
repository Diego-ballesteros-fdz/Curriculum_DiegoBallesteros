import { z } from 'zod';

// ==========================================
// CONTRATO DE NOTIFICACIÓN
// ==========================================
//
// Alineado con `lib/schemas/buzon.ts` del front. `type`: mention | dm | sistema.
// `fecha` viaja como ISO 8601 (UTC). Los campos `*Id`/`from` son metadatos
// opcionales según el tipo (p. ej. una mención lleva `foroMessageId` y `from`).

export const notificationTypeSchema = z.enum(['mention', 'dm', 'sistema']);

export const notificationSchema = z.object({
  id: z.string(),
  type: notificationTypeSchema,
  texto: z.string(),
  leido: z.boolean(),
  from: z.string().nullable().optional(),
  foroMessageId: z.string().nullable().optional(),
  conversacionId: z.string().nullable().optional(),
  fecha: z.string(),
});

export const notificationParamsSchema = z.object({ id: z.string() });

export const marcarLeidoRespuestaSchema = z.object({ count: z.number().int() });

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type NotificationDTO = z.infer<typeof notificationSchema>;

// Datos para crear una notificación (uso interno de los services).
export interface CrearNotificacionInput {
  userId: string;
  type: NotificationType;
  texto: string;
  from?: string;
  foroMessageId?: string;
  conversacionId?: string;
}
