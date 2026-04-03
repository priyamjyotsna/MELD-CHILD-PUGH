# LiverTracker clinical scores API

Serverless HTTP API for **MELD**, **MELD-Na**, **MELD 3.0**, **Child-Pugh**, **liver enzyme** interpretation, and **FibroScan** staging. Implements the same logic as `@livertracker/clinical-scores`.

## Base path

All versioned routes live under **`/api/v1`** (required shape on [Vercel](https://vercel.com) serverless).

Examples (after you attach a domain):

- `https://meldapi.livertracker.com/api/v1/health`
- `https://<project>.vercel.app/api/v1/health`

## Vercel note (monorepo root)

Deploy from the **Git repository root** with **Root Directory** in Vercel **empty** (not `apps/api`).

- [`vercel.json`](../vercel.json) — `npm ci` + build `clinical-scores` only (**no `outputDirectory`** so `/api` serverless routes are not suppressed).
- [`api/[[...path]].ts`](../api/[[...path]].ts) — serverless entry → `src/app.ts`.
- [`public/index.html`](../public/index.html) — landing page at `/`.

HTTP routes remain **`/api/v1/...`**.

## Deploy on Vercel (monorepo)

**Recommended:** repository root as project root.

1. **Import** [MELD-CHILD-PUGH](https://github.com/priyamjyotsna/MELD-CHILD-PUGH).
2. **Root Directory:** leave **blank** (repo root). Root [`vercel.json`](../vercel.json) + [`api/`](../api/) + [`public/`](../public/) apply.
3. **Alternative:** set **Root Directory** to **`apps/api`** if you prefer (uses [`vercel.json`](vercel.json) in this folder + nested `api/`). Do **not** set `outputDirectory` to a custom path (it can drop serverless routes).
4. **Production branch:** `main`.
5. **Domain:** e.g. `meldapi.livertracker.com` → CNAME per Vercel.

Use the Vercel-assigned URL first to verify, then attach the custom subdomain.

## Local development

From repository root:

```bash
npm ci
npm run build -w @livertracker/clinical-scores
cd apps/api
npm install
npm run dev
```

- Health: `GET http://127.0.0.1:8787/api/v1/health`
- List systems: `GET http://127.0.0.1:8787/api/v1/scoring-systems`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Liveness |
| GET | `/api/v1/scoring-systems` | Metadata for clients |
| POST | `/api/v1/calculate` | All applicable tools from one JSON body |
| POST | `/api/v1/meld` | MELD only |
| POST | `/api/v1/meld-na` | MELD-Na |
| POST | `/api/v1/meld3` | MELD 3.0 |
| POST | `/api/v1/child-pugh` | Child-Pugh |
| POST | `/api/v1/liver-enzymes` | Enzyme checker (≥1 analyte) |
| POST | `/api/v1/fibroscan` | Stiffness (+ optional CAP) |

Every successful JSON body includes a `meta` object (`apiVersion`, `calculationEngine`, `citation`, `disclaimer`).

## Rate limiting

Not enforced in this revision (serverless has no shared counter). For production, add [Vercel KV](https://vercel.com/docs/storage/vercel-kv), Upstash, or an API gateway.

## License

MIT (same as monorepo).
