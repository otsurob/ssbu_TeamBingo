import { WS_URL } from '../config/env';
import type { wsEventType } from '../types/websocketEvent';

type RoomWebSocketHandlers = {
  onEvent?: (event: wsEventType) => void;
  onOpen?: (ev: Event) => void;
  onError?: (ev: Event) => void;
  onClose?: (ev: CloseEvent) => void;
};

/**
 * Open a WebSocket for a room and wire up basic lifecycle handlers.
 * Returns a cleanup function that closes the socket.
 */
export const connectRoomWebSocket = (room: string, handlers: RoomWebSocketHandlers) => {
  const ws = new WebSocket(`${WS_URL}/ws?room=${room}`);

  if (handlers.onOpen) {
    ws.onopen = handlers.onOpen;
  }

  if (handlers.onEvent) {
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as wsEventType;
        handlers.onEvent?.(msg);
      } catch (e) {
        console.error('ws message parse error', e);
      }
    };
  }

  if (handlers.onError) {
    ws.onerror = handlers.onError;
  }

  if (handlers.onClose) {
    ws.onclose = handlers.onClose;
  }

  return () => ws.close();
};

/**
 * Simple connectivity check for a room WebSocket.
 * Resolves when the connection opens, rejects on error/timeout.
 */
export const testRoomWebSocketConnection = (room: string) => {
  return new Promise<void>((resolve, reject) => {
    const ws = new WebSocket(`${WS_URL}/ws?room=${room}`);
    const timeoutId = window.setTimeout(() => {
      ws.close();
      reject(new Error('WebSocket connection timeout'));
    }, 3000);

    ws.onopen = () => {
      window.clearTimeout(timeoutId);
      ws.close();
      resolve();
    };

    ws.onerror = () => {
      window.clearTimeout(timeoutId);
      ws.close();
      reject(new Error('WebSocket connection failed'));
    };
  });
};
