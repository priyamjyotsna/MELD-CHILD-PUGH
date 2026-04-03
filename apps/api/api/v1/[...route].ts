import { app } from '../../src/app';
import { createNodeServerlessHandler } from '../../src/node-serverless-bridge';

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
};

export default createNodeServerlessHandler((request) => app.fetch(request));
