import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// Map of assignmentId → set of connected clients
const rooms = new Map<string, Set<WebSocket>>();

let wss: WebSocketServer | null = null;

export function initWebSocket(server: http.Server): void {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url ?? '', `http://${req.headers.host}`);
    const assignmentId = url.searchParams.get('assignmentId');

    if (!assignmentId) {
      ws.close(1008, 'assignmentId required');
      return;
    }

    // Join room
    if (!rooms.has(assignmentId)) {
      rooms.set(assignmentId, new Set());
    }
    rooms.get(assignmentId)!.add(ws);

    ws.on('close', () => {
      rooms.get(assignmentId)?.delete(ws);
      if (rooms.get(assignmentId)?.size === 0) {
        rooms.delete(assignmentId);
      }
    });

    ws.on('error', console.error);
  });

  console.log('[websocket] WebSocket server initialized');
}

export function broadcastToRoom(
  assignmentId: string,
  event: { type: string; payload: unknown }
): void {
  const room = rooms.get(assignmentId);
  if (!room) return;

  const message = JSON.stringify(event);
  room.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
