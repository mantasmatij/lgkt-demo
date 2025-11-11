import { Router } from 'express';

export const healthRouter = Router();

/**
 * Basic health check - returns 200 if service is responding
 */
healthRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'api',
  });
});

/**
 * Readiness check - verifies database connectivity
 */
healthRouter.get('/ready', async (_req, res) => {
  try {
    const { getDb } = await import('db');
    const db = getDb();
    // Simple query to verify DB connection
    await db.execute('SELECT 1 as health');
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'error',
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Liveness check - returns 200 if process is alive
 * Used by container orchestration to restart unhealthy containers
 */
healthRouter.get('/live', (_req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
