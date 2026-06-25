import { z } from "zod";

/**
 * Contrato de receta.
 *
 * Es la única fuente de verdad para los datos de receta que viajarán entre el
 * cliente y el (futuro) backend REST. Los listados de las páginas y el diálogo
 * de detalle se renderizan a partir de estos tipos, de modo que cuando el
 * backend exista solo tendrá que devolver datos con esta forma (validables con
 * `recetaSchema`) sin tocar la capa de presentación.
 */

/** Imagen de una receta (en el futuro, una URL servida por el backend/CDN). */
export const recetaImagenSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

/** Detalle ampliado que se muestra en el diálogo al abrir una receta. */
export const recetaDetalleSchema = z.object({
  descripcion: z.string(),
  /** Texto orientativo de raciones, p. ej. "4 personas". */
  raciones: z.string().optional(),
  ingredientes: z.array(z.string().min(1)).min(1),
  pasos: z.array(z.string().min(1)).min(1),
});

/** Receta tal y como llega del feed. El `detalle` es opcional: las recetas aún
 *  sin ficha completa se muestran solo como tarjeta. */
export const recetaSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1),
  imagen: recetaImagenSchema,
  detalle: recetaDetalleSchema.optional(),
});

export type RecetaImagen = z.infer<typeof recetaImagenSchema>;
export type RecetaDetalle = z.infer<typeof recetaDetalleSchema>;
export type Receta = z.infer<typeof recetaSchema>;
