import type { WebSocket } from '@fastify/websocket';

// ==========================================
// CONTRATO DEL PROTOCOLO WEBSOCKET
// ==========================================
//
// Mensajes de texto JSON con la forma `{ event, room?, payload }`. El front
// (stores de zustand) ya está preparado para consumir estos eventos. El campo
// `room` identifica el destino lógico: "foro" | "dm:<peer>" | "notifications:<userId>".

export type WSEvent =
  | 'auth'
  | 'foro:join'
  | 'foro:message'
  | 'dm:join'
  | 'dm:message'
  | 'notification:new'
  | 'ping'
  | 'pong'
  | 'error';

export interface WSMessage<T = unknown> {
  event: WSEvent;
  room?: string;
  payload?: T;
}

/**
 * Cliente conectado. El socket se decora con `userId` y `connectedAt` tras una
 * autenticación correcta (ver `ws.auth.ts`). `rooms` lleva el registro de las
 * salas a las que está suscrito para poder limpiarlas al desconectar.
 */
export interface WSClient {
  socket: WebSocket;
  userId: string;
  connectedAt: number;
  rooms: Set<string>;
}

// Nombres de sala canónicos.
export const ROOM_FORO = 'foro';
export const dmRoom = (peer: string) => `dm:${peer}`;
export const notificationsRoom = (userId: string) => `notifications:${userId}`;
