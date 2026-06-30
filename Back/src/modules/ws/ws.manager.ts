import type { WebSocket } from '@fastify/websocket';
import type { FastifyBaseLogger } from 'fastify';

import type { WSClient, WSMessage } from './ws.types.js';

// ==========================================
// WS MANAGER (singleton de sockets/rooms)
// ==========================================
//
// Gestiona EXCLUSIVAMENTE sockets en memoria: salas (`rooms`) e índice de
// clientes por usuario (`userClients`) para entrega directa. Es stateless
// respecto a Prisma (restricción del CLAUDE.md): no conoce ni toca la BD; los
// services siguen siendo los dueños de la persistencia y le piden difundir.
//
// Estructuras:
//  - rooms:       Map<roomId, Set<WSClient>>  → difusión por sala (p. ej. "foro")
//  - userClients: Map<userId, Set<WSClient>>  → difusión directa a un usuario
//                                               (todas sus pestañas/dispositivos)

export class WSManager {
  private readonly rooms = new Map<string, Set<WSClient>>();
  private readonly userClients = new Map<string, Set<WSClient>>();

  constructor(private readonly log?: FastifyBaseLogger) {}

  /** Registra un cliente recién autenticado (índice por usuario). */
  register(client: WSClient): void {
    this.addTo(this.userClients, client.userId, client);
    this.log?.debug({ userId: client.userId }, 'WS cliente registrado');
  }

  /** Elimina un cliente de todas las salas y del índice por usuario (al cerrar). */
  unregister(client: WSClient): void {
    for (const room of client.rooms) {
      this.removeFrom(this.rooms, room, client);
    }
    client.rooms.clear();
    this.removeFrom(this.userClients, client.userId, client);
    this.log?.debug({ userId: client.userId }, 'WS cliente eliminado');
  }

  /** Suscribe un cliente a una sala. */
  join(client: WSClient, room: string): void {
    this.addTo(this.rooms, room, client);
    client.rooms.add(room);
  }

  /** Desuscribe un cliente de una sala. */
  leave(client: WSClient, room: string): void {
    this.removeFrom(this.rooms, room, client);
    client.rooms.delete(room);
  }

  /** Envía un mensaje a todos los clientes de una sala. */
  broadcast(room: string, message: WSMessage): void {
    const clients = this.rooms.get(room);
    if (!clients) return;
    const data = JSON.stringify(message);
    for (const client of clients) this.rawSend(client.socket, data);
  }

  /** Envía un mensaje a todos los sockets de un usuario (entrega directa). */
  broadcastToUser(userId: string, message: WSMessage): void {
    const clients = this.userClients.get(userId);
    if (!clients) return;
    const data = JSON.stringify(message);
    for (const client of clients) this.rawSend(client.socket, data);
  }

  /** Envía un mensaje a un único cliente. */
  send(client: WSClient, message: WSMessage): void {
    this.rawSend(client.socket, JSON.stringify(message));
  }

  /** Nº de conexiones activas (útil para health/diagnóstico). */
  get conexiones(): number {
    let total = 0;
    for (const set of this.userClients.values()) total += set.size;
    return total;
  }

  // ── Helpers privados ───────────────────────────────────────────────────────

  private rawSend(socket: WebSocket, data: string): void {
    // 1 === WebSocket.OPEN; evitamos importar el enum para no acoplar.
    if (socket.readyState === 1) socket.send(data);
  }

  private addTo(map: Map<string, Set<WSClient>>, key: string, client: WSClient): void {
    let set = map.get(key);
    if (!set) {
      set = new Set();
      map.set(key, set);
    }
    set.add(client);
  }

  private removeFrom(map: Map<string, Set<WSClient>>, key: string, client: WSClient): void {
    const set = map.get(key);
    if (!set) return;
    set.delete(client);
    if (set.size === 0) map.delete(key);
  }
}
