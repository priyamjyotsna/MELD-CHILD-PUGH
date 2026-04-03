import { app } from '../../apps/api/src/app';
import { createNodeServerlessHandler } from '../../apps/api/src/node-serverless-bridge';

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
};

/** POST body streaming via `@hono/node-server/vercel` can hang on Vercel; buffer + `app.fetch` does not. */
export default createNodeServerlessHandler((request) => app.fetch(request));
