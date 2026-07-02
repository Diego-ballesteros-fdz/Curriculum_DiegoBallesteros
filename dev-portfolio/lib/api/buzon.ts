import { api } from "@/lib/api/http";
import {
  buzonSnapshotSchema,
  conversacionSchema,
  mensajeChatSchema,
  type BuzonSnapshot,
  type Conversacion,
  type MensajeChat,
} from "@/lib/schemas/buzon";

/**
 * API REST del buzón (`{API_PREFIX}/buzon`). Bandeja personal: el backend filtra
 * siempre por el usuario de la sesión. El tiempo real (mensajes/notificaciones
 * entrantes) llegará por WebSocket; estas llamadas cargan el snapshot inicial y
 * gestionan el envío/lectura.
 */

const usuarioPath = (usuario: string) => `/buzon/${encodeURIComponent(usuario)}`;

export async function getBuzonSnapshot(): Promise<BuzonSnapshot> {
  return buzonSnapshotSchema.parse(await api.get("/buzon"));
}

export async function getHilo(usuario: string): Promise<Conversacion> {
  return conversacionSchema.parse(await api.get(usuarioPath(usuario)));
}

export async function enviarMensajeBuzon(
  usuario: string,
  texto: string,
): Promise<MensajeChat> {
  return mensajeChatSchema.parse(await api.post(usuarioPath(usuario), { texto }));
}

export async function marcarHiloLeido(usuario: string): Promise<{ count: number }> {
  return api.patch<{ count: number }>(`${usuarioPath(usuario)}/leido`, {});
}
