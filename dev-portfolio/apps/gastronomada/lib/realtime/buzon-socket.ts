import { eventoBuzonSchema } from "@/lib/schemas/buzon";
import { useBuzonStore } from "@/lib/stores/buzon-store";

/**
 * Punto de integración del WebSocket del buzón (pendiente de backend).
 *
 * Cuando el backend exponga el endpoint WS, basta con llamar a `conectarBuzon`
 * (p. ej. en un `useEffect` del layout autenticado). Cada frame entrante se
 * valida con `eventoBuzonSchema` y se despacha al store; la UI no cambia porque
 * ya consume el store. Devuelve una función para cerrar la conexión.
 *
 * Hasta entonces queda como contrato listo para implementar: hoy nadie lo llama.
 */
export function conectarBuzon(url: string): () => void {
  const { setConectado, recibirMensaje, recibirNotificacion } =
    useBuzonStore.getState();

  const socket = new WebSocket(url);

  socket.addEventListener("open", () => setConectado(true));
  socket.addEventListener("close", () => setConectado(false));
  socket.addEventListener("error", () => setConectado(false));

  socket.addEventListener("message", (event) => {
    let frame: unknown;
    try {
      frame = JSON.parse(event.data);
    } catch {
      return; // frame no-JSON: lo ignoramos
    }

    const parsed = eventoBuzonSchema.safeParse(frame);
    if (!parsed.success) return; // frame que no cumple el contrato: lo ignoramos

    const evento = parsed.data;
    if (evento.tipo === "mensaje") {
      recibirMensaje(evento.de, evento.mensaje);
    } else {
      recibirNotificacion(evento.payload);
    }
  });

  return () => socket.close();
}
