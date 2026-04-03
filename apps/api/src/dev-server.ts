import { serve } from '@hono/node-server';
import { app } from './app';

const port = Number(process.env.PORT) || 8787;
console.log(`LiverTracker API dev: http://127.0.0.1:${port}  (try GET /api/v1/health)`);
serve({ fetch: app.fetch, port });
