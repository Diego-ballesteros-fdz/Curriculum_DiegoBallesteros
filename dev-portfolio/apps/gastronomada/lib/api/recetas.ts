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
 * API REST de recetas (`{API_PREFIX}/recetas`). Todas las rutas requieren sesión.
 * La LECTURA es pública entre usuarios autenticados: cualquiera ve todas las
 * recetas (`listarRecetas`). El perfil pide solo las suyas con `mias=true`
 * (`listarMisRecetas`). La ESCRITURA (crear/editar/eliminar) la limita el backend
 * al autor. Validamos la respuesta con zod antes de devolverla a la UI.
 */

const listaRecetasSchema = z.object({
  data: z.array(recetaSchema),
  meta: metaSchema,
});

/** Filtros del listado de recetas. El param público es `type` (contrato back). */
export interface RecetaFiltros {
  type?: TipoReceta;
  pais?: string;
}

function buildQuery(filtros?: RecetaFiltros, soloMias?: boolean): string {
  const params = new URLSearchParams();
  // El back pagina (máx. 50/página). Traemos la página completa.
  params.set("limit", "50");
  if (filtros?.type) params.set("type", filtros.type);
  if (filtros?.pais) params.set("pais", filtros.pais);
  if (soloMias) params.set("mias", "true");
  return params.toString();
}

/** Lista TODAS las recetas (lectura pública), opcionalmente filtradas. */
export async function listarRecetas(filtros?: RecetaFiltros): Promise<Receta[]> {
  const res = await api.get<unknown>(`/recetas?${buildQuery(filtros)}`);
  return listaRecetasSchema.parse(res).data;
}

/** Lista solo las recetas del usuario autenticado (gestión en el perfil). */
export async function listarMisRecetas(filtros?: RecetaFiltros): Promise<Receta[]> {
  const res = await api.get<unknown>(`/recetas?${buildQuery(filtros, true)}`);
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
