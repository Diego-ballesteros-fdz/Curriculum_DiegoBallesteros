import { z } from "zod";

import { api } from "@/lib/api/http";

/**
 * API REST de usuarios (`{API_PREFIX}/users`). Solo lectura pública (id, name,
 * image) y requiere sesión. La usa el buscador de "Nueva conversación".
 */

export const publicUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
});

const listaUsuariosSchema = z.object({ data: z.array(publicUserSchema) });

export type PublicUser = z.infer<typeof publicUserSchema>;

export async function buscarUsuarios(search: string): Promise<PublicUser[]> {
  const res = await api.get<unknown>(`/users?search=${encodeURIComponent(search)}`);
  return listaUsuariosSchema.parse(res).data;
}
