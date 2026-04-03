import { handle } from '@hono/node-server/vercel';
import { app } from '../../src/app';

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
};

export default handle(app);
