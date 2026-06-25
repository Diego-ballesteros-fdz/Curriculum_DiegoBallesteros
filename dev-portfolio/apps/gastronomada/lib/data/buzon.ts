import type { BuzonSnapshot } from "@/lib/schemas/buzon";

/**
 * Semilla simulada del backend para el buzón.
 *
 * Sirve para que el badge del nav y el buzón muestren datos desde el primer
 * render. Cuando exista el backend, se sustituirá por el snapshot REST
 * (`GET /buzon`) que se cargará con `hidratar`, y las novedades llegarán por
 * WebSocket. Las fechas e ids son estáticos a propósito: así el render del
 * servidor y el del cliente coinciden (sin errores de hidratación).
 */
export const BUZON_SEED: BuzonSnapshot = {
  conversaciones: [
    {
      usuario: "chefs_Silver",
      mensajes: [
        {
          id: "m-silver-1",
          texto: "¡Me encantó tu receta de socarrat! ¿Compartes el truco del fondo?",
          fecha: "2026-06-18T19:12:00Z",
          propio: false,
          leido: false,
        },
      ],
    },
    {
      usuario: "paula_cocina",
      mensajes: [
        {
          id: "m-paula-1",
          texto: "Hola, ¿harías un taller de esferificaciones?",
          fecha: "2026-06-17T10:40:00Z",
          propio: false,
          leido: false,
        },
      ],
    },
    {
      usuario: "chefs_games",
      mensajes: [
        {
          id: "m-games-1",
          texto: "Gracias por el consejo del sifón, funcionó perfecto.",
          fecha: "2026-06-15T08:05:00Z",
          propio: false,
          leido: true,
        },
        {
          id: "m-games-2",
          texto: "¡De nada! Cuéntame cómo te queda la próxima espuma.",
          fecha: "2026-06-15T08:20:00Z",
          propio: true,
          leido: true,
        },
      ],
    },
  ],
  notificaciones: [
    {
      id: "nt-1",
      tipo: "seguidor",
      texto: "paula_cocina ha empezado a seguirte.",
      fecha: "2026-06-18T20:01:00Z",
      leido: false,
    },
    {
      id: "nt-2",
      tipo: "like",
      texto: "A chefs_Silver le gusta tu receta «Bao de cangrejo».",
      fecha: "2026-06-18T12:30:00Z",
      leido: false,
    },
    {
      id: "nt-3",
      tipo: "comentario",
      texto: "chefs_games comentó tu receta «Tortilla de patatas».",
      fecha: "2026-06-16T09:15:00Z",
      leido: true,
    },
  ],
};

export async function getBuzon(): Promise<BuzonSnapshot> {
  return BUZON_SEED;
}
