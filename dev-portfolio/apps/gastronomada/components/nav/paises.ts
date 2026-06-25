/** Países disponibles en el menú "Gastronomía del mundo".
 *  Añadir un país = añadir una entrada aquí. */
export interface Pais {
  href: string;
  src: string;
  title: string;
}

export const PAISES: Pais[] = [
  { href: "/pages/gastronomia-mundo/espana", src: "/imagenes/banderas/españa.png", title: "España" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/francia.png", title: "Francia" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/italia.png", title: "Italia" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/alemania.png", title: "Alemania" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/japon.png", title: "Japón" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/china.png", title: "China" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/marruecos.png", title: "Marruecos" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/sudáfrica.png", title: "Sudáfrica" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/EEUU.png", title: "EEUU" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/mexico.png", title: "Mexico" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/colombia.png", title: "Colombia" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/peru.png", title: "Perú" },
  { href: "/pages/en-construccion", src: "/imagenes/banderas/ecuador.png", title: "Ecuador" },
];
