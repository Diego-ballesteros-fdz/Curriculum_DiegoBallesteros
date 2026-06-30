import { z } from 'zod';

// Contrato del buscador de usuarios. Solo datos públicos (sin email).

export const buscarUsuariosQuerySchema = z.object({
  search: z.string().trim().min(1, 'Indica un término de búsqueda').max(50),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

export const publicUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
});

export const listaUsuariosSchema = z.object({
  data: z.array(publicUserSchema),
});

export type BuscarUsuariosQuery = z.infer<typeof buscarUsuariosQuerySchema>;
export type PublicUserDTO = z.infer<typeof publicUserSchema>;
