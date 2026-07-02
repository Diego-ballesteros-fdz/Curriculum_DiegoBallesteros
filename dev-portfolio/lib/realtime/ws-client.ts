import { mensajeChatSchema, notificacionSchema } from "@/lib/schemas/buzon";
import { mensajeForoSchema, type MensajeForo } from "@/lib/schemas/foro";
import { useBuzonStore } from "@/lib/stores/buzon-store";

/**
 * Cliente WebSocket del dominio (foro + mensajes directos + notificaciones).
 *
 * Habla el protocolo del backend (`Back/src/modules/ws`): mensajes JSON
 * `{ event, room?, payload }`. Es un singleton con una única conexión por
 * pestaña, que:
 *  - se autentica enviando `{ event: "auth", payload: { sessionToken } }`,
 *  - mantiene heartbeat (`ping`/`pong`),
 *  - reintenta la conexión si se cae,
 *  - reenvía los `join` registrados tras (re)autenticar,
 *  - despacha los eventos entrantes al store del buzón (DM/notificaciones) y a
 *    los suscriptores locales (el foro, que es estado de página).
 *
 * El `sessionToken` es el `session.token` de Better Auth (lo da `getSession`):
 * no es la cookie httpOnly, así que el front puede leerlo y enviarlo.
 */

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000/api/ws";
const RECONNECT_MS = 3000;
const HEARTBEAT_MS = 25_000;

type WSEvent =
  | "auth"
  | "foro:join"
  | "foro:message"
  | "dm:join"
  | "dm:message"
  | "notification:new"
  | "ping"
  | "pong"
  | "error";

interface WSMessage<T = unknown> {
  event: WSEvent;
  room?: string;
  payload?: T;
}

type Handler = (payload: unknown, room?: string) => void;

class WSClient {
  private socket: WebSocket | null = null;
  private token: string | null = null;
  private autenticado = false;
  private cerradoAdrede = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  // `join` registrados (foro, hilos dm) que se reenvían al (re)autenticar.
  private readonly joins = new Map<string, WSMessage>();
  // Suscriptores locales por evento (p. ej. el foro escucha `foro:message`).
  private readonly subs = new Map<WSEvent, Set<Handler>>();

  /** Abre la conexión y autentica con el token de sesión. Idempotente. */
  connect(token: string): void {
    this.token = token;
    this.cerradoAdrede = false;
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }
    this.abrir();
  }

  /** Cierra la conexión de forma intencionada (no reintenta). */
  disconnect(): void {
    this.cerradoAdrede = true;
    this.limpiarTimers();
    this.autenticado = false;
    this.socket?.close();
    this.socket = null;
    useBuzonStore.getState().setConectado(false);
  }

  /** Registra un `join` y lo envía si ya estamos autenticados. */
  addJoin(key: string, message: WSMessage): void {
    this.joins.set(key, message);
    if (this.autenticado) this.enviar(message);
  }

  /** Olvida un `join` (al desmontar la vista que lo necesitaba). */
  removeJoin(key: string): void {
    this.joins.delete(key);
  }

  /** Suscribe un handler a un evento entrante. Devuelve la baja. */
  on(event: WSEvent, handler: Handler): () => void {
    let set = this.subs.get(event);
    if (!set) {
      set = new Set();
      this.subs.set(event, set);
    }
    set.add(handler);
    return () => set!.delete(handler);
  }

  /** Envía un mensaje al servidor (si la conexión está abierta). */
  enviar(message: WSMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  // ── Interno ─────────────────────────────────────────────────────────────

  private abrir(): void {
    try {
      this.socket = new WebSocket(WS_URL);
    } catch {
      this.programarReconexion();
      return;
    }

    this.socket.addEventListener("open", () => {
      if (this.token) this.enviar({ event: "auth", payload: { sessionToken: this.token } });
    });

    this.socket.addEventListener("message", (e) => this.onMensaje(e));

    this.socket.addEventListener("close", () => {
      this.autenticado = false;
      this.limpiarTimers();
      useBuzonStore.getState().setConectado(false);
      if (!this.cerradoAdrede) this.programarReconexion();
    });

    this.socket.addEventListener("error", () => this.socket?.close());
  }

  private onMensaje(event: MessageEvent): void {
    let frame: WSMessage;
    try {
      frame = JSON.parse(event.data as string) as WSMessage;
    } catch {
      return;
    }
    if (!frame || typeof frame.event !== "string") return;

    switch (frame.event) {
      case "auth":
        // Ack de autenticación correcta: marcamos conectado y reenviamos joins.
        this.autenticado = true;
        useBuzonStore.getState().setConectado(true);
        this.iniciarHeartbeat();
        for (const join of this.joins.values()) this.enviar(join);
        break;
      case "pong":
        break;
      case "dm:message":
        this.onDm(frame);
        break;
      case "notification:new":
        this.onNotificacion(frame);
        break;
      default:
        // foro:message y demás: a los suscriptores locales.
        break;
    }

    // Despacho a suscriptores locales (p. ej. el foro).
    const set = this.subs.get(frame.event);
    if (set) for (const handler of set) handler(frame.payload, frame.room);
  }

  private onDm(frame: WSMessage): void {
    const parsed = mensajeChatSchema.safeParse(frame.payload);
    if (!parsed.success) return;
    // El `room` es "dm:<peer>"; de ahí sacamos el hilo destino.
    const peer = frame.room?.startsWith("dm:") ? frame.room.slice(3) : null;
    if (!peer) return;
    useBuzonStore.getState().agregarMensaje(peer, parsed.data);
  }

  private onNotificacion(frame: WSMessage): void {
    const parsed = notificacionSchema.safeParse(frame.payload);
    if (!parsed.success) return;
    useBuzonStore.getState().recibirNotificacion(parsed.data);
  }

  private iniciarHeartbeat(): void {
    this.limpiarHeartbeat();
    this.heartbeatTimer = setInterval(() => this.enviar({ event: "ping" }), HEARTBEAT_MS);
  }

  private programarReconexion(): void {
    if (this.reconnectTimer || this.cerradoAdrede) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.cerradoAdrede) this.abrir();
    }, RECONNECT_MS);
  }

  private limpiarHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private limpiarTimers(): void {
    this.limpiarHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

/** Singleton compartido por toda la app (una conexión por pestaña). */
export const wsClient = new WSClient();

// ── Helpers de alto nivel para las vistas ───────────────────────────────────

/** Únete a la sala global del foro y escucha mensajes nuevos. Devuelve la baja. */
export function suscribirseAlForo(onMensaje: (mensaje: MensajeForo) => void): () => void {
  wsClient.addJoin("foro", { event: "foro:join" });
  const baja = wsClient.on("foro:message", (payload) => {
    const parsed = mensajeForoSchema.safeParse(payload);
    if (parsed.success) onMensaje(parsed.data);
  });
  return () => {
    baja();
    wsClient.removeJoin("foro");
  };
}

/** Únete al hilo de conversación con `peer` (para el envío por WS opcional). */
export function unirseAlHilo(peer: string): () => void {
  const key = `dm:${peer}`;
  wsClient.addJoin(key, { event: "dm:join", payload: { peer } });
  return () => wsClient.removeJoin(key);
}
