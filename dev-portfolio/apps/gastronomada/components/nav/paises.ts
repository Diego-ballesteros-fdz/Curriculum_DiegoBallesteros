/** Países disponibles en el menú "Gastronomía del mundo".
 *  Fuente de verdad única para el nav (banderas) y la página única
 *  `/pages/gastronomia-mundo?pais=<slug>`. Añadir un país = añadir una entrada.
 *
 *  - `slug`   → valor del query param `?pais=` (URL-safe, sin acentos).
 *  - `nombre` → texto mostrado Y valor con el que se filtran las recetas: debe
 *               coincidir con el campo `pais` guardado en cada receta
 *               (`PAISES_RECETA` en `lib/schemas/receta.ts`).
 *  - `src`    → imagen de la bandera. */
export interface Pais {
  slug: string;
  nombre: string;
  src: string;
}

export const PAISES: Pais[] = [
  { slug: "espana", nombre: "España", src: "/imagenes/banderas/españa.png" },
  { slug: "francia", nombre: "Francia", src: "/imagenes/banderas/francia.png" },
  { slug: "italia", nombre: "Italia", src: "/imagenes/banderas/italia.png" },
  { slug: "alemania", nombre: "Alemania", src: "/imagenes/banderas/alemania.png" },
  { slug: "japon", nombre: "Japón", src: "/imagenes/banderas/japon.png" },
  { slug: "china", nombre: "China", src: "/imagenes/banderas/china.png" },
  { slug: "marruecos", nombre: "Marruecos", src: "/imagenes/banderas/marruecos.png" },
  { slug: "sudafrica", nombre: "Sudáfrica", src: "/imagenes/banderas/sudáfrica.png" },
  { slug: "eeuu", nombre: "EEUU", src: "/imagenes/banderas/EEUU.png" },
  { slug: "mexico", nombre: "Mexico", src: "/imagenes/banderas/mexico.png" },
  { slug: "colombia", nombre: "Colombia", src: "/imagenes/banderas/colombia.png" },
  { slug: "peru", nombre: "Perú", src: "/imagenes/banderas/peru.png" },
  { slug: "ecuador", nombre: "Ecuador", src: "/imagenes/banderas/ecuador.png" },
];

/** Enlace canónico a la página de país con el país preseleccionado. */
export const hrefPais = (slug: string) => `/pages/gastronomia-mundo?pais=${slug}`;

/** Busca un país por su slug (`?pais=`). `undefined` si no existe. */
export const paisPorSlug = (slug: string): Pais | undefined =>
  PAISES.find((p) => p.slug === slug);
