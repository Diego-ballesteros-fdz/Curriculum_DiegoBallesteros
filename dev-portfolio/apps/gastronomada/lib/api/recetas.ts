import { z } from "zod";

import { api } from "@/lib/api/http";
import { metaSchema } from "@/lib/schemas/pagination";
import {
  recetaSchema,
  type ActualizarRecetaInput,
  type NuevaRecetaInput,
  type Receta,
  type TipoReceta,
} from "@/lib/schemas/receta";

/**
 * API REST de recetas (`{API_PREFIX}/recetas`). Todas las rutas requieren sesión
 * y el backend filtra por propietario (scope OWN): un usuario solo ve/gestiona
 * sus recetas. Validamos la respuesta con zod antes de devolverla a la UI.
 */

const listaRecetasSchema = z.object({
  data: z.array(recetaSchema),
  meta: metaSchema,
});

/** Filtros del listado de recetas del usuario. */
export interface RecetaFiltros {
  tipo?: TipoReceta;
  pais?: string;
}

function buildQuery(filtros?: RecetaFiltros): string {
  const params = new URLSearchParams();
  // El back pagina (máx. 50/página). En el perfil traemos la página completa.
  params.set("limit", "50");
  if (filtros?.tipo) params.set("tipo", filtros.tipo);
  if (filtros?.pais) params.set("pais", filtros.pais);
  return params.toString();
}

/** Lista las recetas del usuario autenticado, opcionalmente filtradas. */
export async function listarMisRecetas(filtros?: RecetaFiltros): Promise<Receta[]> {
  const res = await api.get<unknown>(`/recetas?${buildQuery(filtros)}`);
  return listaRecetasSchema.parse(res).data;
}

export async function crearReceta(input: NuevaRecetaInput): Promise<Receta> {
  return recetaSchema.parse(await api.post("/recetas", input));
}

export async function actualizarReceta(
  id: string,
  input: ActualizarRecetaInput,
): Promise<Receta> {
  return recetaSchema.parse(await api.put(`/recetas/${id}`, input));
}

export async function eliminarReceta(id: string): Promise<void> {
  await api.del(`/recetas/${id}`);
}
