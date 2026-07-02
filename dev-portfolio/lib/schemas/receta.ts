import { z } from "zod";

/**
 * Contrato de receta.
 *
 * Es la única fuente de verdad para los datos de receta que viajan entre el
 * cliente y el backend REST (`{API_PREFIX}/recetas`). Los listados de las
 * páginas, el diálogo de detalle y el formulario de subida del perfil se
 * renderizan/validan a partir de estos tipos, de modo que el backend devuelve
 * datos con esta forma (validables con `recetaSchema`) sin tocar la capa de
 * presentación.
 */

/** Tipo de cocina de una receta: permite filtrar tradicional vs. moderna. */
export const tipoRecetaSchema = z.enum(["tradicional", "moderna"]);
export type TipoReceta = z.infer<typeof tipoRecetaSchema>;

/** Etiqueta legible para cada tipo (selectores y cabeceras). */
export const TIPO_RECETA_LABEL: Record<TipoReceta, string> = {
  tradicional: "Tradicional",
  moderna: "Moderna",
};

/**
 * Países disponibles para clasificar una receta. Es la lista canónica que usan
 * el selector del formulario y el filtro del perfil. El campo `pais` se valida
 * como texto (no enum) para no romper datos antiguos, pero la UI ofrece esta
 * lista. Coincide con las gastronomías del menú "Gastronomía del mundo".
 */
export const PAISES_RECETA = [
  "España",
  "Francia",
  "Italia",
  "Alemania",
  "Japón",
  "China",
  "Marruecos",
  "Sudáfrica",
  "EEUU",
  "Mexico",
  "Colombia",
  "Perú",
  "Ecuador",
] as const;

/** Imagen de una receta (`src` es una URL pública o un data URL en base64). */
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
  tipo: tipoRecetaSchema,
  pais: z.string(),
  imagen: recetaImagenSchema,
  detalle: recetaDetalleSchema.optional(),
});

export type RecetaImagen = z.infer<typeof recetaImagenSchema>;
export type RecetaDetalle = z.infer<typeof recetaDetalleSchema>;
export type Receta = z.infer<typeof recetaSchema>;

// ── Creación / edición (formulario del perfil) ──────────────────────────────

export const NOMBRE_MAX = 80;
export const DESCRIPCION_MAX = 1000;

/**
 * Cuerpo de creación de una receta (`POST /api/recetas`). El `detalle` es
 * obligatorio al subir: el perfil exige descripción, ingredientes y pasos.
 */
export const nuevaRecetaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Indica el nombre de la receta")
    .max(NOMBRE_MAX, `El nombre no puede superar los ${NOMBRE_MAX} caracteres`),
  tipo: tipoRecetaSchema,
  pais: z.string().trim().min(1, "Selecciona el país de la receta"),
  imagen: recetaImagenSchema,
  detalle: z.object({
    descripcion: z
      .string()
      .trim()
      .min(1, "Añade una descripción")
      .max(DESCRIPCION_MAX, `La descripción no puede superar los ${DESCRIPCION_MAX} caracteres`),
    raciones: z.string().trim().optional(),
    ingredientes: z.array(z.string().trim().min(1)).min(1, "Indica al menos un ingrediente"),
    pasos: z.array(z.string().trim().min(1)).min(1, "Indica al menos un paso"),
  }),
});

export type NuevaRecetaInput = z.infer<typeof nuevaRecetaSchema>;

/** Actualización parcial (`PUT /api/recetas/:id`); exige al menos un campo. */
export const actualizarRecetaSchema = nuevaRecetaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes modificar al menos un campo",
  });

export type ActualizarRecetaInput = z.infer<typeof actualizarRecetaSchema>;
