import { z } from "zod";

/**
 * Metadatos de paginación que acompañan a cada listado del backend
 * (`{ data, meta }`). Coincide con `metaSchema` del back (FRONT.md §8/§10).
 */
export const metaSchema = z.object({
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
  totalPages: z.number().int(),
});

export type Meta = z.infer<typeof metaSchema>;
