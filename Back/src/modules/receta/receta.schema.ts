import { z } from 'zod';

import { listResponseSchema, paginationQuerySchema } from '@/schemas/pagination.schema.js';

// ==========================================
// CONTRATO DE RECETA
// ==========================================
//
// Alineado con `lib/schemas/receta.ts` del front (fuente de verdad). El back
// guarda `imagen` como base64 plano y aplana el detalle en columnas; aquí se
// reconstruye la forma anidada que espera el front: `imagen:{src,alt}` y
// `detalle:{descripcion,raciones?,ingredientes[],pasos[]}`. `tipo` y `pais`
// permiten filtrar el listado.

// Tipo de cocina: coincide con el enum `TipoReceta` de Prisma y del front.
export const tipoRecetaSchema = z.enum(['tradicional', 'moderna']);

export const recetaImagenSchema = z.object({
  src: z.string().min(1, 'La imagen es obligatoria'), // base64 (data URL)
  alt: z.string().default(''),
});

export const recetaDetalleSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  raciones: z.string().optional(),
  ingredientes: z.array(z.string().min(1)).min(1, 'Indica al menos un ingrediente'),
  pasos: z.array(z.string().min(1)).min(1, 'Indica al menos un paso'),
});

// Receta tal y como la devuelve la API (forma del front).
export const recetaSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1),
  tipo: tipoRecetaSchema,
  pais: z.string(),
  imagen: recetaImagenSchema,
  detalle: recetaDetalleSchema.optional(),
});

// Cuerpo de creación: forma anidada del front.
export const crearRecetaSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  tipo: tipoRecetaSchema,
  pais: z.string().trim().min(1, 'El país es obligatorio'),
  imagen: recetaImagenSchema,
  detalle: recetaDetalleSchema,
});

// Actualización parcial; exige al menos un campo.
export const actualizarRecetaSchema = crearRecetaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes actualizar al menos un campo',
  });

export const recetaParamsSchema = z.object({ id: z.string() });

// Query del listado: paginación + filtros opcionales por tipo y país.
export const listarRecetasQuerySchema = paginationQuerySchema.extend({
  tipo: tipoRecetaSchema.optional(),
  pais: z.string().trim().min(1).optional(),
});

export const listaRecetasSchema = listResponseSchema(recetaSchema);

export type RecetaDTO = z.infer<typeof recetaSchema>;
export type CrearRecetaInput = z.infer<typeof crearRecetaSchema>;
export type ActualizarRecetaInput = z.infer<typeof actualizarRecetaSchema>;
export type ListarRecetasQuery = z.infer<typeof listarRecetasQuerySchema>;
