import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  calculateChildPugh,
  calculateMeld,
  calculateMeld3,
  calculateMeldNa,
  checkLiverEnzymes,
  GITHUB_REPOSITORY_URL,
  interpretFibroScan,
} from '@livertracker/clinical-scores';
import {
  parseChildPughBody,
  parseEnzymeBody,
  parseFibroScanBody,
  parseMeld3Body,
  parseMeldBody,
  parseMeldNaBody,
  runUniversal,
} from './engine';
import { jsonErr, jsonOk } from './meta';
import { scoringSystemsPayload } from './scoring-systems';

const v1 = new Hono();

v1.get('/health', (c) => c.json(jsonOk({ status: 'ok' as const })));

v1.get('/scoring-systems', (c) => c.json(jsonOk({ ...scoringSystemsPayload })));

v1.post('/calculate', async (c) => {
  let body: Record<string, unknown>;
  try {
    body = (await c.req.json()) as Record<string, unknown>;
  } catch {
    return c.json(jsonErr('INVALID_INPUT', 'Request body must be JSON'), 400);
  }
  try {
    const result = runUniversal(body);
    return c.json(jsonOk(result));
  } catch (e) {
    console.error(e);
    return c.json(jsonErr('INTERNAL_ERROR', 'Calculation failed'), 500);
  }
});

v1.post('/meld', async (c) => {
  let body: Record<string, unknown>;
  try {
    body = (await c.req.json()) as Record<string, unknown>;
  } catch {
    return c.json(jsonErr('INVALID_INPUT', 'Request body must be JSON'), 400);
  }
  try {
    const input = parseMeldBody(body);
    return c.json(jsonOk({ result: calculateMeld(input) }));
  } catch (e) {
    if (e instanceof Error && e.message === 'MISSING_REQUIRED_FIELD') {
      return c.json(jsonErr('MISSING_REQUIRED_FIELD', 'bilirubin, creatinine, and inr are required'), 400);
    }
    return c.json(jsonErr('INVALID_INPUT', 'Invalid payload'), 400);
  }
});

v1.post('/meld-na', async (c) => {
  let body: Record<string, unknown>;
  try {
    body = (await c.req.json()) as Record<string, unknown>;
  } catch {
    return c.json(jsonErr('INVALID_INPUT', 'Request body must be JSON'), 400);
  }
  try {
    const input = parseMeldNaBody(body);
    return c.json(jsonOk({ result: calculateMeldNa(input) }));
  } catch (e) {
    if (e instanceof Error && e.message === 'MISSING_REQUIRED_FIELD') {
      return c.json(
        jsonErr('MISSING_REQUIRED_FIELD', 'bilirubin, creatinine, inr, sodium required; onDialysis optional'),
        400,
      );
    }
    return c.json(jsonErr('INVALID_INPUT', 'Invalid payload'), 400);
  }
});

v1.post('/meld3', async (c) => {
  let body: Record<string, unknown>;
  try {
    body = (await c.req.json()) as Record<string, unknown>;
  } catch {
    return c.json(jsonErr('INVALID_INPUT', 'Request body must be JSON'), 400);
  }
  try {
    const input = parseMeld3Body(body);
    return c.json(jsonOk({ result: calculateMeld3(input) }));
  } catch (e) {
    if (e instanceof Error && e.message === 'MISSING_REQUIRED_FIELD') {
      return c.json(
        jsonErr(
          'MISSING_REQUIRED_FIELD',
          'bilirubin, creatinine, inr, sodium, albumin, sex required; onDialysis optional',
        ),
        400,
      );
    }
    return c.json(jsonErr('INVALID_INPUT', 'Invalid payload'), 400);
  }
});

v1.post('/child-pugh', async (c) => {
  let body: Record<string, unknown>;
  try {
    body = (await c.req.json()) as Record<string, unknown>;
  } catch {
    return c.json(jsonErr('INVALID_INPUT', 'Request body must be JSON'), 400);
  }
  try {
    const input = parseChildPughBody(body);
    return c.json(jsonOk({ result: calculateChildPugh(input) }));
  } catch (e) {
    if (e instanceof Error && e.message === 'MISSING_REQUIRED_FIELD') {
      return c.json(
        jsonErr('MISSING_REQUIRED_FIELD', 'All Child-Pugh fields are required'),
        400,
      );
    }
    return c.json(jsonErr('INVALID_INPUT', 'Invalid payload'), 400);
  }
});

v1.post('/liver-enzymes', async (c) => {
  let body: Record<string, unknown>;
  try {
    body = (await c.req.json()) as Record<string, unknown>;
  } catch {
    return c.json(jsonErr('INVALID_INPUT', 'Request body must be JSON'), 400);
  }
  try {
    const input = parseEnzymeBody(body);
    return c.json(jsonOk({ result: checkLiverEnzymes(input) }));
  } catch (e) {
    if (e instanceof Error && e.message === 'MISSING_REQUIRED_FIELD') {
      return c.json(
        jsonErr('MISSING_REQUIRED_FIELD', 'Provide at least one of alt, ast, ggt, alp, bilirubin'),
        400,
      );
    }
    return c.json(jsonErr('INVALID_INPUT', 'Invalid payload'), 400);
  }
});

v1.post('/fibroscan', async (c) => {
  let body: Record<string, unknown>;
  try {
    body = (await c.req.json()) as Record<string, unknown>;
  } catch {
    return c.json(jsonErr('INVALID_INPUT', 'Request body must be JSON'), 400);
  }
  try {
    const input = parseFibroScanBody(body);
    const capScore = input.capScore;
    return c.json(
      jsonOk({
        result: interpretFibroScan({
          liverStiffness: input.liverStiffness,
          ...(capScore !== undefined ? { capScore } : {}),
        }),
      }),
    );
  } catch (e) {
    if (e instanceof Error && e.message === 'MISSING_REQUIRED_FIELD') {
      return c.json(jsonErr('MISSING_REQUIRED_FIELD', 'liverStiffness (kPa) is required'), 400);
    }
    return c.json(jsonErr('INVALID_INPUT', 'Invalid payload'), 400);
  }
});

export const app = new Hono();

app.use('*', cors());

app.route('/api/v1', v1);

app.get('/', (c) =>
  c.json({
    service: 'LiverTracker clinical scores API',
    docs: `${GITHUB_REPOSITORY_URL}/tree/main/apps/api`,
    basePath: '/api/v1',
    health: '/api/v1/health',
  }),
);
