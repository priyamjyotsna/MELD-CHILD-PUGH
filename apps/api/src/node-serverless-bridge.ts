import type { IncomingMessage, ServerResponse } from 'node:http';

type AppFetch = (request: Request) => Response | Promise<Response>;

function requestUrl(req: IncomingMessage): string {
  const host = req.headers.host ?? 'localhost';
  const forwarded = req.headers['x-forwarded-proto'];
  const proto =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0]!.trim()
      : 'https';
  return `${proto}://${host}${req.url ?? '/'}`;
}

async function readBody(req: IncomingMessage): Promise<Buffer | undefined> {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return undefined;
  }
  const maybeRaw = (req as IncomingMessage & { rawBody?: Buffer }).rawBody;
  if (maybeRaw instanceof Buffer) {
    return maybeRaw;
  }
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function incomingToHeaders(req: IncomingMessage): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }
  return headers;
}

const skipResponseHeader = new Set(['transfer-encoding', 'connection', 'keep-alive']);

/**
 * Vercel Node invokes (req, res). `@hono/node-server/vercel` streams POST bodies via Web Streams in
 * a way that can hang on Vercel (GET works). Buffering the Node stream and calling `fetch()` avoids
 * that — see https://github.com/honojs/node-server/issues/306
 */
export function createNodeServerlessHandler(fetchImpl: AppFetch) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
      const url = requestUrl(req);
      const body = await readBody(req);
      const init: RequestInit = {
        method: req.method,
        headers: incomingToHeaders(req),
      };
      if (body !== undefined && body.length > 0) {
        init.body = body;
      }
      const request = new Request(url, init);
      const response = await fetchImpl(request);
      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        if (skipResponseHeader.has(key.toLowerCase())) return;
        res.appendHeader(key, value);
      });
      if (response.body) {
        const reader = response.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value?.byteLength) res.write(Buffer.from(value));
        }
      }
      res.end();
    } catch (e) {
      console.error(e);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      } else {
        res.destroy(e instanceof Error ? e : undefined);
      }
    }
  };
}
