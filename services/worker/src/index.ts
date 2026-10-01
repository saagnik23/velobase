import http from 'http';

const HEALTH_PORT = process.env.HEALTH_PORT || 4002;
let isRunning = true;
let jobsProcessed = 0;

// Internal HTTP server for Kubernetes readiness/liveness probes
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: isRunning ? 'healthy' : 'terminating',
      service: 'velora-worker',
      jobs_processed: jobsProcessed,
      uptime: process.uptime()
    }));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(HEALTH_PORT, () => {
  console.log(`VELORA Worker health check on port ${HEALTH_PORT}`);
});

// Continuous worker poll loop
async function processLoop() {
  while (isRunning) {
    try {
      // Simulate job dequeue
      await new Promise((r) => setTimeout(r, 1000));
      jobsProcessed++;
    } catch (err) {
      console.error('Worker loop error:', err);
    }
  }
}

processLoop();

// Graceful shutdown handling for zero-downtime rolling updates
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Finishing in-flight jobs...');
  isRunning = false;
  server.close(() => {
    process.exit(0);
  });
});
