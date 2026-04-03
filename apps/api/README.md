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
- [`api/v1/[...route].ts`](../api/v1/[...route].ts) — serverless entry → `src/app.ts`.
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

## Usage examples (`curl`)

Use `BASE` = production API origin (e.g. `https://meld-child-pugh.vercel.app` or your custom domain) or `http://127.0.0.1:8787` locally. Optional: pipe to `jq` for readability.

```bash
export BASE="https://meld-child-pugh.vercel.app"

# Liveness + citation metadata
curl -sS "$BASE/api/v1/health"

# Client catalog
curl -sS "$BASE/api/v1/scoring-systems"

# MELD
curl -sS -X POST "$BASE/api/v1/meld" \
  -H "Content-Type: application/json" \
  -d '{"bilirubin":2.0,"creatinine":1.2,"inr":1.4,"onDialysis":false}'

# MELD-Na
curl -sS -X POST "$BASE/api/v1/meld-na" \
  -H "Content-Type: application/json" \
  -d '{"bilirubin":2.0,"creatinine":1.2,"inr":1.4,"sodium":132,"onDialysis":false}'

# MELD 3.0 (sex: "male" | "female")
curl -sS -X POST "$BASE/api/v1/meld3" \
  -H "Content-Type: application/json" \
  -d '{"bilirubin":2.0,"creatinine":1.2,"inr":1.4,"sodium":132,"albumin":3.2,"sex":"female","onDialysis":false}'

# Child-Pugh — ascites: none | mild | moderate_severe; encephalopathy: none | grade_1_2 | grade_3_4
curl -sS -X POST "$BASE/api/v1/child-pugh" \
  -H "Content-Type: application/json" \
  -d '{"bilirubin":2.0,"albumin":3.0,"inr":1.5,"ascites":"mild","encephalopathy":"none"}'

# Liver enzymes — at least one of alt, ast, ggt, alp, bilirubin
curl -sS -X POST "$BASE/api/v1/liver-enzymes" \
  -H "Content-Type: application/json" \
  -d '{"alt":120,"ast":90,"alp":200,"ggt":65,"bilirubin":1.0}'

# FibroScan — liverStiffness (kPa) required; capScore (dB/m) optional
curl -sS -X POST "$BASE/api/v1/fibroscan" \
  -H "Content-Type: application/json" \
  -d '{"liverStiffness":10.2,"capScore":280}'

# Universal calculator — fills in every tool possible from one JSON body
curl -sS -X POST "$BASE/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -d '{"bilirubin":2,"creatinine":1.2,"inr":1.4,"sodium":132,"albumin":3.2,"sex":"female","onDialysis":false,"ascites":"none","encephalopathy":"none","alt":85,"liverStiffness":8.5}'
```

### Errors

On 4xx/5xx, responses include `meta` and `error`: `{ "code", "message" }` (e.g. `INVALID_INPUT`, `MISSING_REQUIRED_FIELD`).

## How to cite the API and software

- **Live API:** In methods, state the base URL you used, approximate access date, and (if needed) the `calculationEngine` value from `/api/v1/health` for reproducibility.
- **Repository:** Use GitHub’s **Cite this repository** ([`CITATION.cff`](../../CITATION.cff) at monorepo root).
- **Per-tool OSF DOIs:** MELD family [10.17605/OSF.IO/WAM6K](https://doi.org/10.17605/OSF.IO/WAM6K), Child-Pugh [10.17605/OSF.IO/XJWA8](https://doi.org/10.17605/OSF.IO/XJWA8), FibroScan [10.17605/OSF.IO/CSBWN](https://doi.org/10.17605/OSF.IO/CSBWN), liver enzymes [10.17605/OSF.IO/3XEWC](https://doi.org/10.17605/OSF.IO/3XEWC).
- **Detail:** [`docs/CITATION.md`](../../docs/CITATION.md).

## Troubleshooting

- **`jq: parse error`** — The response is not JSON (often a Vercel plain-text error or **504** timeout page). Run `curl` without `| jq .`. In shells, ensure `\` at the end of a continued line has **no space after it**, or put the whole `curl` on one line.
- **POST hangs / 504 while GET works** — The serverless entry buffers the Node request body and calls `app.fetch` (see `src/node-serverless-bridge.ts`). Streaming POST bodies through older `@hono/node-server/vercel` adapters can hang on Vercel ([upstream issue](https://github.com/honojs/node-server/issues/306)).

## Rate limiting

Not enforced in this revision (serverless has no shared counter). For production, add [Vercel KV](https://vercel.com/docs/storage/vercel-kv), Upstash, or an API gateway.

## License

MIT (same as monorepo).
