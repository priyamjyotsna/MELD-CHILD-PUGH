# LiverTracker clinical scores API

Serverless HTTP API for **MELD**, **MELD-Na**, **MELD 3.0**, **Child-Pugh**, **liver enzyme** interpretation, and **FibroScan** staging. Implements the same logic as `@livertracker/clinical-scores`.

## Base path

All versioned routes live under **`/api/v1`** (required shape on [Vercel](https://vercel.com) serverless).

Examples (after you attach a domain):

- `https://meldapi.livertracker.com/api/v1/health`
- `https://<project>.vercel.app/api/v1/health`

## Vercel note (output directory)

This project is **serverless API** + an empty **`public/`** folder so Vercel’s static output step succeeds. Your routes are still served from **`api/`** (`/api/v1/...`). If the dashboard overrides `outputDirectory`, set it to **`public`**.

## Deploy on Vercel (monorepo)

1. In Vercel, **Import** the [MELD-CHILD-PUGH](https://github.com/priyamjyotsna/MELD-CHILD-PUGH) repo.
2. Set **Root Directory** to **`apps/api`** (or deploy from repo root and point configuration at this folder—see Vercel monorepo docs).
3. **Install command:** `cd ../.. && npm ci`  
   **Build command:** `cd ../.. && npm run build -w @livertracker/clinical-scores`  
   (Already mirrored in `vercel.json`.)
4. **Add domain:** `meldapi.livertracker.com` → CNAME to Vercel (DNS at your registrar).

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
