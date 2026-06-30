import { z } from 'zod';

// Cuerpo de creación genérico para entidades de dominio.
// `userId` identifica al propietario; si no se envía, el controlador lo toma de
// la sesión. `.loose()` deja pasar el resto de campos propios de cada entidad.
export const CreateSchema = z
  .object({
    userId: z.uuidv7().optional(),
  })
  .loose();

export const UserSchemaBase = z.object({
  name: z.string(),
  email: z.email(),
});

export const GetListQueryBase = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const ResponseListSchemaBase = z.array(
  z.object({
    id: z.uuidv7(),
    name: z.string(),
  }),
);
