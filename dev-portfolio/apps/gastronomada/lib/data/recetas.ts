import type { Receta } from "@/lib/schemas/receta";

/**
 * Datos simulados del backend para las páginas públicas de recetas.
 *
 * El backend REST (`{API_PREFIX}/recetas`) sirve SOLO las recetas del usuario
 * autenticado (scope OWN), por lo que las páginas de navegación pública
 * (España, tradicional, moderna) siguen mostrando este catálogo de muestra. La
 * forma coincide con `recetaSchema` (incluidos `tipo` y `pais`), de modo que el
 * día que exista un feed público bastará con sustituir estas funciones por la
 * llamada REST sin tocar las páginas. Devuelven promesas para que la firma sea
 * ya la definitiva.
 */

// Ficha completa de la tortilla, compartida por la cocina española y la tradicional.
const TORTILLA_DE_PATATAS: Receta = {
  id: "tortilla-de-patatas",
  nombre: "Tortilla de patatas",
  tipo: "tradicional",
  pais: "España",
  imagen: {
    src: "/imagenes/Recetas/tortilla de patatas.jpg",
    alt: "Tortilla de patatas",
  },
  detalle: {
    descripcion:
      "La tortilla de patatas es un clásico de la cocina española, simple y deliciosa. Con tan solo patatas, huevos y un toque de cebolla si te gusta, se crea un plato que es pura tradición y sabor. Perfecta para compartir, ya sea en un picnic, en casa con amigos o como tapa en un bar. ¡Siempre es un acierto!",
    raciones: "4 personas",
    ingredientes: [
      "6 huevos (mejor de corral o criados en suelo)",
      "2 kg de patatas",
      "500 ml de aceite de oliva",
      "1/2 cebolla (opcional)",
    ],
    pasos: [
      "Pelamos las patatas y las cortamos en rodajas; cuanto más finas, mejor.",
      "Cortamos la cebolla en juliana (opcional).",
      "En una sartén con todo el aceite, pochamos la patata y la cebolla durante 40 minutos.",
      "Colamos la patata, batimos los huevos con sal y mezclamos.",
      "Calentamos una sartén antiadherente con un poco de aceite y volcamos la mezcla.",
      "Cuando el borde empiece a cuajar, damos la vuelta con un plato húmedo.",
      "Dejamos al gusto de cuajado y servimos.",
    ],
  },
};

const RECETAS_ESPANA: Receta[] = [
  TORTILLA_DE_PATATAS,
  {
    id: "bravas-tradicionales",
    nombre: "Bravas tradicionales",
    tipo: "tradicional",
    pais: "España",
    imagen: { src: "/imagenes/Recetas/Bravas_Tra.jpg", alt: "Bravas tradicionales" },
  },
  {
    id: "bravas-contemporaneas",
    nombre: "Bravas contemporáneas",
    tipo: "moderna",
    pais: "España",
    imagen: { src: "/imagenes/Recetas/Bravas_Mod.webp", alt: "Bravas contemporáneas" },
  },
  {
    id: "callos",
    nombre: "Callos",
    tipo: "tradicional",
    pais: "España",
    imagen: { src: "/imagenes/Recetas/callos.jpg", alt: "Callos" },
  },
  {
    id: "paella-valenciana",
    nombre: "Paella valenciana",
    tipo: "tradicional",
    pais: "España",
    imagen: { src: "/imagenes/Recetas/paella.webp", alt: "Paella valenciana" },
  },
  {
    id: "tortilla-de-adria",
    nombre: "Tortilla de patatas de Adrià",
    tipo: "moderna",
    pais: "España",
    imagen: {
      src: "/imagenes/Recetas/tortilla de patata Mod.jpg",
      alt: "Tortilla de patatas de Adrià",
    },
  },
];

const RECETAS_TRADICIONAL: Receta[] = [
  TORTILLA_DE_PATATAS,
  { id: "pad-thai", nombre: "Pad thai", tipo: "tradicional", pais: "China", imagen: { src: "/imagenes/Recetas/pad thai.jpg", alt: "Pad thai" } },
  { id: "butter-chicken", nombre: "Butter chicken", tipo: "tradicional", pais: "Marruecos", imagen: { src: "/imagenes/Recetas/butter chicken.jpg", alt: "Butter chicken" } },
  { id: "carbonara", nombre: "Carbonara", tipo: "tradicional", pais: "Italia", imagen: { src: "/imagenes/Recetas/carbonara.png", alt: "Carbonara" } },
  { id: "bravas-tradicionales", nombre: "Bravas tradicionales", tipo: "tradicional", pais: "España", imagen: { src: "/imagenes/Recetas/Bravas_Tra.jpg", alt: "Bravas tradicionales" } },
  { id: "callos", nombre: "Callos", tipo: "tradicional", pais: "España", imagen: { src: "/imagenes/Recetas/callos.jpg", alt: "Callos" } },
  { id: "costillas-bbq", nombre: "Costillas BBQ", tipo: "tradicional", pais: "EEUU", imagen: { src: "/imagenes/Recetas/costillas.jpg", alt: "Costillas BBQ" } },
  { id: "cochinita-pibil", nombre: "Cochinita pibil", tipo: "tradicional", pais: "Mexico", imagen: { src: "/imagenes/Recetas/tacos cochinita.jpg", alt: "Cochinita pibil" } },
  { id: "codillo", nombre: "Codillo", tipo: "tradicional", pais: "Alemania", imagen: { src: "/imagenes/Recetas/codillo.jpg", alt: "Codillo" } },
  { id: "paella-valenciana", nombre: "Paella valenciana", tipo: "tradicional", pais: "España", imagen: { src: "/imagenes/Recetas/paella.webp", alt: "Paella valenciana" } },
];

const RECETAS_MODERNA: Receta[] = [
  { id: "bravas-modernas", nombre: "Bravas modernas", tipo: "moderna", pais: "España", imagen: { src: "/imagenes/Recetas/Bravas_Mod.webp", alt: "Bravas modernas" } },
  { id: "tortilla-de-adria", nombre: "Tortilla de patatas de Adrià", tipo: "moderna", pais: "España", imagen: { src: "/imagenes/Recetas/tortilla de patata Mod.jpg", alt: "Tortilla de patatas de Adrià" } },
  { id: "socarrat", nombre: "Socarrat", tipo: "moderna", pais: "España", imagen: { src: "/imagenes/Recetas/socarrat.png", alt: "Socarrat" } },
  { id: "bao-de-cangrejo", nombre: "Bao de cangrejo", tipo: "moderna", pais: "China", imagen: { src: "/imagenes/Recetas/bao crab.jpg", alt: "Bao de cangrejo" } },
  { id: "esferificacion-de-oliva", nombre: "Esferificación de oliva", tipo: "moderna", pais: "España", imagen: { src: "/imagenes/Recetas/oliva.png", alt: "Esferificación de oliva" } },
  { id: "puro-de-los-roca", nombre: "Puro de los Roca", tipo: "moderna", pais: "España", imagen: { src: "/imagenes/Recetas/puro.png", alt: "Puro de los Roca" } },
  { id: "bombon-de-salmon", nombre: "Bombón de salmón", tipo: "moderna", pais: "Japón", imagen: { src: "/imagenes/Recetas/bombon salmon.jpg", alt: "Bombón de salmón" } },
  { id: "trampantojo-cherry", nombre: "Trampantojo cherry", tipo: "moderna", pais: "España", imagen: { src: "/imagenes/Recetas/cherry.jpg", alt: "Trampantojo cherry" } },
  { id: "brownie-de-carrillera", nombre: "Brownie de carrillera", tipo: "moderna", pais: "España", imagen: { src: "/imagenes/Recetas/brownie carrillera.jpg", alt: "Brownie de carrillera" } },
  { id: "sushi-flame", nombre: "Sushi flame", tipo: "moderna", pais: "Japón", imagen: { src: "/imagenes/Recetas/sushi flame.jpg", alt: "Sushi flame" } },
];

export async function getRecetasEspana(): Promise<Receta[]> {
  return RECETAS_ESPANA;
}

export async function getRecetasTradicionales(): Promise<Receta[]> {
  return RECETAS_TRADICIONAL;
}

export async function getRecetasModernas(): Promise<Receta[]> {
  return RECETAS_MODERNA;
}
