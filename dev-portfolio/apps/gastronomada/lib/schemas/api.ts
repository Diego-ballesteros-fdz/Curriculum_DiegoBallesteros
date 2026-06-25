import { z } from "zod";

/**
 * Contrato genérico de respuesta de la API REST.
 *
 * Toda respuesta del futuro backend seguirá esta forma: o bien `data` con el
 * payload válido, o bien `error` con un código estable + mensaje legible. Esto
 * permite que el cliente trate los errores de forma uniforme sin acoplarse a
 * los detalles de cada endpoint.
 */
export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  /** Errores de validación por campo, alineados con los `path` de zod. */
  fields: z.record(z.string(), z.string()).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

/** Envuelve cualquier esquema de datos en el sobre de respuesta estándar. */
export function apiResponseSchema<T extends z.ZodTypeAny>(data: T) {
  return z.discriminatedUnion("ok", [
    z.object({ ok: z.literal(true), data }),
    z.object({ ok: z.literal(false), error: apiErrorSchema }),
  ]);
}

/** Contrato de paginación reutilizable para los feeds (recetas, seguidos, etc.). */
export const paginacionSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export type Paginacion = z.infer<typeof paginacionSchema>;
