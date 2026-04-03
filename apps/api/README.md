# LiverTracker clinical scores API

Serverless HTTP API for **MELD**, **MELD-Na**, **MELD 3.0**, **Child-Pugh**, **liver enzyme** interpretation, and **FibroScan** staging. Implements the same logic as `@livertracker/clinical-scores`.

## Base path

All versioned routes live under **`/api/v1`** (required shape on [Vercel](https://vercel.com) serverless).

Examples (after you attach a domain):

- `https://meldapi.livertracker.com/api/v1/health`
- `https://<project>.vercel.app/api/v1/health`

## Vercel note (monorepo root)

The live deployment uses the **repository root** as the Vercel project root (leave **Root Directory** in the Vercel dashboard **empty**). That avoids dashboard errors like “`apps/api` does not exist.”

- Repo-root [`vercel.json`](../vercel.json) — `installCommand`, `buildCommand`, `outputDirectory: apps/api/public`
- Repo-root [`api/[[...path]].ts`](../api/[[...path]].ts) — Vercel serverless entry (imports this package’s `src/app.ts`)

Your HTTP routes are still **`/api/v1/...`** (Hono `basePath`), not the filesystem folder name.

## Deploy on Vercel (monorepo)

1. **Import** [MELD-CHILD-PUGH](https://github.com/priyamjyotsna/MELD-CHILD-PUGH).
2. **Root Directory:** leave **blank** (`.` / repository root). **Do not** set `apps/api`.
3. **Production branch:** `main`.  
   Install/build are taken from root `vercel.json` (`npm ci` + build `clinical-scores`).
4. **Add domain:** e.g. `meldapi.livertracker.com` → CNAME per Vercel.

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
