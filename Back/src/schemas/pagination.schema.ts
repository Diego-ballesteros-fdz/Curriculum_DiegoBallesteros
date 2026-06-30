import { z } from 'zod';

// Query de paginación compartida por los feeds de dominio (recetas, foro, …).
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// Metadatos de paginación que acompañan a cada listado.
export const metaSchema = z.object({
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
  totalPages: z.number().int(),
});

// Envuelve un esquema de item en la forma de listado `{ data, meta }`.
// (El back no implementa el sobre `{ ok, data|error }` del front; ver FRONT.md §8.)
export function listResponseSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    data: z.array(item),
    meta: metaSchema,
  });
}
