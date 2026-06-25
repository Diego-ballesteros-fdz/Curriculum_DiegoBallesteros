import type { MensajeForo } from "@/lib/schemas/foro";

/**
 * Datos simulados del backend para el foro.
 *
 * La forma coincide con `mensajeForoSchema`, así que cuando exista el backend
 * REST esta función se sustituirá por `await api.get("/foro")` sin tocar la
 * página ni los componentes. Devuelve una promesa para que la firma sea ya la
 * definitiva.
 */
const MENSAJES_FORO: MensajeForo[] = [
  {
    id: "msg-1",
    autor: "chefs_games",
    texto: "¿Alguien sabe dónde puedo encontrar achiote en Madrid?",
    fecha: "2026-06-10T09:30:00Z",
  },
  {
    id: "msg-2",
    autor: "chefs_Country",
    texto:
      "Yo lo compro en una tienda de productos latinos que está en la calle La Oca.",
    fecha: "2026-06-10T11:05:00Z",
  },
  {
    id: "msg-3",
    autor: "chefs_Country",
    texto:
      "Tengo problemas con mi sifón, no consigo que salga la espuma fluida. ¿Qué puede causarlo?",
    fecha: "2026-06-12T17:42:00Z",
  },
  {
    id: "msg-4",
    autor: "chefs_Silver",
    texto:
      "Puede ser por la suciedad incrustada en la boquilla o por la mezcla de grasa de la espuma. Recuerda que necesita un mínimo de 30% de grasa o, en su defecto, gelatina o agar-agar.",
    fecha: "2026-06-12T18:10:00Z",
  },
  {
    id: "msg-5",
    autor: "chefs_games",
    texto:
      "Yo, aunque tenga el % de grasa necesario, siempre añado una o dos colas para asegurar una buena consistencia en la espuma.",
    fecha: "2026-06-13T08:20:00Z",
  },
];

export async function getMensajesForo(): Promise<MensajeForo[]> {
  return MENSAJES_FORO;
}
