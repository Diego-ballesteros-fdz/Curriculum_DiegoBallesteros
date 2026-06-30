import { z } from 'zod';

import { listResponseSchema } from '@/schemas/pagination.schema.js';

// ==========================================
// CONTRATO DEL FORO (MENSAJE)
// ==========================================
//
// Alineado con `lib/schemas/foro.ts` del front. `autor` es el nombre mostrado
// (denormalizado para el feed público); `fecha` viaja como ISO 8601 (UTC).

export const TEXTO_MAX = 1000;

export const mensajeForoSchema = z.object({
  id: z.string(),
  autor: z.string(),
  texto: z.string(),
  fecha: z.string(),
});

export const crearMensajeForoSchema = z.object({
  autor: z
    .string()
    .trim()
    .min(3, 'Indica un nombre de usuario (mínimo 3 caracteres)')
    .max(30, 'El nombre de usuario no puede superar los 30 caracteres'),
  texto: z
    .string()
    .trim()
    .min(1, 'El comentario no puede estar vacío')
    .max(TEXTO_MAX, `El comentario no puede superar los ${TEXTO_MAX} caracteres`),
});

export const mensajeForoParamsSchema = z.object({ id: z.string() });

export const listaForoSchema = listResponseSchema(mensajeForoSchema);

export type MensajeForoDTO = z.infer<typeof mensajeForoSchema>;
export type CrearMensajeForoInput = z.infer<typeof crearMensajeForoSchema>;
