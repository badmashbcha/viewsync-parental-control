import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

interface ClientInfo {
  id: string;
  ws: WebSocket;
  roomId?: string;
  role?: 'host' | 'viewer';
  name?: string;
  isAlive: boolean;
}

interface Room {
  id: string;
  hostId?: string;
  createdAt: number;
  clients: Set<string>;
  lastActivity: number;
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json());

  // Room registry
  const clients = new Map<string, ClientInfo>();
  const rooms = new Map<string, Room>();

  // Heartbeat to prevent stale connections
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = Array.from(clients.values()).find((c) => c.ws === ws);
      if (client) {
        if (!client.isAlive) {
          ws.terminate();
          return;
        }
        client.isAlive = false;
        ws.ping();
      }
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  function broadcastToRoom(roomId: string, message: any, excludeClientId?: string) {
    const room = rooms.get(roomId);
    if (!room) return;
    const data = JSON.stringify(message);
    room.clients.forEach((clientId) => {
      if (clientId !== excludeClientId) {
        const client = clients.get(clientId);
        if (client && client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(data);
        }
      }
    });
  }

  function getRoomInfo(roomId: string) {
    const room = rooms.get(roomId);
    if (!room) return null;
    const participants = Array.from(room.clients).map((cid) => {
      const c = clients.get(cid);
      return {
        id: cid,
        role: c?.role || 'viewer',
        name: c?.name || 'Anonymous',
      };
    });
    return {
      roomId,
      hostId: room.hostId,
      hasHost: !!room.hostId && clients.has(room.hostId),
      participants,
      viewerCount: participants.filter((p) => p.role === 'viewer').length,
    };
  }

  wss.on('connection', (ws) => {
    const clientId = Math.random().toString(36).substring(2, 10);
    const clientInfo: ClientInfo = {
      id: clientId,
      ws,
      isAlive: true,
    };
    clients.set(clientId, clientInfo);

    ws.on('pong', () => {
      clientInfo.isAlive = true;
    });

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        const { type } = msg;

        if (type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        if (type === 'join-room') {
          const { roomId, role, name } = msg;
          if (!roomId) return;

          // Clean up previous room if any
          if (clientInfo.roomId && rooms.has(clientInfo.roomId)) {
            const oldRoom = rooms.get(clientInfo.roomId)!;
            oldRoom.clients.delete(clientId);
            if (oldRoom.hostId === clientId) {
              oldRoom.hostId = undefined;
              broadcastToRoom(clientInfo.roomId, {
                type: 'host-disconnected',
                clientId,
              });
            }
          }

          clientInfo.roomId = roomId;
          clientInfo.role = role || 'viewer';
          clientInfo.name = name || (role === 'host' ? 'Target Device' : 'Supervisor / Parent');

          let room = rooms.get(roomId);
          if (!room) {
            room = {
              id: roomId,
              createdAt: Date.now(),
              clients: new Set(),
              lastActivity: Date.now(),
            };
            rooms.set(roomId, room);
          }

          room.clients.add(clientId);
          room.lastActivity = Date.now();

          if (role === 'host') {
            room.hostId = clientId;
          }

          // Acknowledge join
          ws.send(
            JSON.stringify({
              type: 'joined-room',
              clientId,
              roomId,
              role: clientInfo.role,
              roomInfo: getRoomInfo(roomId),
            })
          );

          // Notify others in room
          broadcastToRoom(
            roomId,
            {
              type: 'peer-joined',
              clientId,
              role: clientInfo.role,
              name: clientInfo.name,
              roomInfo: getRoomInfo(roomId),
            },
            clientId
          );
          return;
        }

        // Must be in a room for subsequent events
        const roomId = clientInfo.roomId;
        if (!roomId || !rooms.has(roomId)) {
          return;
        }

        const room = rooms.get(roomId)!;
        room.lastActivity = Date.now();

        // WebRTC Signaling: offer, answer, ice-candidate
        if (type === 'signal') {
          const { targetId, signalData } = msg;
          if (targetId) {
            const target = clients.get(targetId);
            if (target && target.ws.readyState === WebSocket.OPEN) {
              target.ws.send(
                JSON.stringify({
                  type: 'signal',
                  fromId: clientId,
                  fromRole: clientInfo.role,
                  signalData,
                })
              );
            }
          } else {
            // Broadcast signal to everyone else in room
            broadcastToRoom(
              roomId,
              {
                type: 'signal',
                fromId: clientId,
                fromRole: clientInfo.role,
                signalData,
              },
              clientId
            );
          }
          return;
        }

        // Remote laser pointer / cursor movement
        if (type === 'remote-pointer') {
          broadcastToRoom(
            roomId,
            {
              type: 'remote-pointer',
              fromId: clientId,
              senderName: clientInfo.name,
              x: msg.x,
              y: msg.y,
              active: msg.active,
            },
            clientId
          );
          return;
        }

        // Remote highlight / ping on screen
        if (type === 'remote-ping') {
          broadcastToRoom(
            roomId,
            {
              type: 'remote-ping',
              fromId: clientId,
              senderName: clientInfo.name,
              x: msg.x,
              y: msg.y,
              label: msg.label,
              id: msg.id || Math.random().toString(36).substring(2, 7),
            },
            clientId
          );
          return;
        }

        // Screen annotations drawing strokes
        if (type === 'remote-draw') {
          broadcastToRoom(
            roomId,
            {
              type: 'remote-draw',
              fromId: clientId,
              action: msg.action, // 'draw' | 'clear' | 'stroke'
              stroke: msg.stroke,
            },
            clientId
          );
          return;
        }

        // Remote camera request / toggle from supervisor
        if (type === 'request-camera') {
          broadcastToRoom(
            roomId,
            {
              type: 'request-camera',
              fromId: clientId,
              senderName: clientInfo.name,
              enable: msg.enable,
              facingMode: msg.facingMode,
            },
            clientId
          );
          return;
        }

        // Remote screen request from supervisor
        if (type === 'request-screen') {
          broadcastToRoom(
            roomId,
            {
              type: 'request-screen',
              fromId: clientId,
              senderName: clientInfo.name,
            },
            clientId
          );
          return;
        }

        // Remote microphone / ambient room audio request from supervisor
        if (type === 'request-mic') {
          broadcastToRoom(
            roomId,
            {
              type: 'request-mic',
              fromId: clientId,
              senderName: clientInfo.name,
              enable: msg.enable,
              highSensitivity: msg.highSensitivity,
            },
            clientId
          );
          return;
        }

        // Remote GPS Location request from supervisor (with consent)
        if (type === 'request-location') {
          broadcastToRoom(
            roomId,
            {
              type: 'request-location',
              fromId: clientId,
              senderName: clientInfo.name,
            },
            clientId
          );
          return;
        }

        // Remote audio alert / chime
        if (type === 'remote-alert') {
          broadcastToRoom(
            roomId,
            {
              type: 'remote-alert',
              fromId: clientId,
              senderName: clientInfo.name,
              soundType: msg.soundType || 'chime',
              message: msg.message || 'Supervisor Attention Call',
            },
            clientId
          );
          return;
        }

        // Guidance banner / alert message to host
        if (type === 'guidance-message') {
          broadcastToRoom(
            roomId,
            {
              type: 'guidance-message',
              fromId: clientId,
              senderName: clientInfo.name,
              text: msg.text,
              severity: msg.severity || 'info', // 'info' | 'warning' | 'urgent'
            },
            clientId
          );
          return;
        }

        // Device telemetry from host (battery, screen size, stream status)
        if (type === 'device-telemetry') {
          broadcastToRoom(
            roomId,
            {
              type: 'device-telemetry',
              fromId: clientId,
              telemetry: msg.telemetry,
            },
            clientId
          );
          return;
        }

        // Chat message
        if (type === 'chat-message') {
          broadcastToRoom(roomId, {
            type: 'chat-message',
            id: Math.random().toString(36).substring(2, 9),
            fromId: clientId,
            senderName: clientInfo.name,
            role: clientInfo.role,
            text: msg.text,
            timestamp: Date.now(),
          });
          return;
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      const roomId = clientInfo.roomId;
      if (roomId && rooms.has(roomId)) {
        const room = rooms.get(roomId)!;
        room.clients.delete(clientId);

        const isHost = room.hostId === clientId;
        if (isHost) {
          room.hostId = undefined;
        }

        broadcastToRoom(roomId, {
          type: 'peer-left',
          clientId,
          role: clientInfo.role,
          name: clientInfo.name,
          wasHost: isHost,
          roomInfo: getRoomInfo(roomId),
        });

        // Clean up empty rooms after 1 hour
        if (room.clients.size === 0) {
          setTimeout(() => {
            const current = rooms.get(roomId);
            if (current && current.clients.size === 0) {
              rooms.delete(roomId);
            }
          }, 3600000);
        }
      }
      clients.delete(clientId);
    });
  });

  // REST API Endpoints
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      activeRooms: rooms.size,
      activeClients: clients.size,
      uptime: process.uptime(),
    });
  });

  app.get('/api/room/:roomId', (req, res) => {
    const { roomId } = req.params;
    const info = getRoomInfo(roomId);
    if (!info) {
      res.json({ exists: false, roomId });
    } else {
      res.json({ exists: true, ...info });
    }
  });

  // Serve Vite app in dev, or dist in prod
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`LiveCast Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
