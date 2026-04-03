/**
 * Use @hono/node-server/vercel (not hono/vercel): Vercel Node invokes (req, res).
 * hono/vercel only passes one arg to app.fetch, so the response never finishes → timeout.
 */
import { handle } from '@hono/node-server/vercel';
import { app } from '../../apps/api/src/app';

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
};

export default handle(app);
