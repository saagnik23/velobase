import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const PORT = process.env.PORT || 4001;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', service: 'velora-realtime', connections: wss.clients.size }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  ws.send(JSON.stringify({ event: 'system.ready', payload: { mesh_region: 'iad1', p95_latency_ms: 0.8 } }));

  ws.on('message', (data: string) => {
    // Broadcast message to all connected clients
    for (const client of wss.clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`VELORA Realtime WebSocket server running on port ${PORT}`);
});
