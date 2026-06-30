import { z } from "zod";

import { api } from "@/lib/api/http";
import { metaSchema } from "@/lib/schemas/pagination";
import {
  mensajeForoSchema,
  type MensajeForo,
  type NuevoMensajeForoInput,
} from "@/lib/schemas/foro";

/**
 * API REST del foro (`{API_PREFIX}/foro`).
 *
 * El feed (`GET`) es público; publicar (`POST`) requiere sesión y el backend
 * sólo permite borrar mensajes propios. El backend devuelve los mensajes por
 * fecha descendente; aquí los ordenamos ascendente para leerlos en orden
 * cronológico (los nuevos se añaden al final, como en un hilo).
 */

const listaForoSchema = z.object({
  data: z.array(mensajeForoSchema),
  meta: metaSchema,
});

export async function listarForo(): Promise<MensajeForo[]> {
  const res = await api.get<unknown>("/foro?limit=50");
  const { data } = listaForoSchema.parse(res);
  return [...data].sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export async function publicarMensajeForo(
  input: NuevoMensajeForoInput,
): Promise<MensajeForo> {
  return mensajeForoSchema.parse(await api.post("/foro", input));
}
