import { api } from "@/lib/api/http";

/**
 * API REST de notificaciones (`{API_PREFIX}/notifications`). El listado llega en
 * el snapshot del buzón; aquí solo persistimos el marcado de leídas (el store
 * actualiza la UI al instante y estas llamadas son best-effort).
 */

export async function marcarNotificacionLeidaApi(id: string): Promise<void> {
  await api.patch(`/notifications/${encodeURIComponent(id)}/read`, {});
}

export async function marcarTodasNotificacionesLeidasApi(): Promise<void> {
  await api.patch("/notifications/read", {});
}
