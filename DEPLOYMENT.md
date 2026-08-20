# TEDO landing deployment

The browser talks only to same-origin `/api/*` routes. The Next.js server proxies consultation traffic to the private backend through `TEDO_BACKEND_URL`, so OpenRouter, PostgreSQL, Qdrant, and Zalo credentials never enter the browser bundle. Internally, the `/api/consultations/[conversationId]` (GET), `/api/consultations/[conversationId]/lead`, `/api/projects/[projectId]/confirm`, and `/api/projects/[projectId]/proposals` routes speak GraphQL to the backend's `/graphql` endpoint (`src/lib/consultation/graphql.ts`) instead of REST — the browser-facing path, method, and JSON shape on each route are unchanged. No route under `/api/*` exposes GraphQL to the browser, and no browser bundle carries a GraphQL client; only server-side route handlers reach `/graphql`.

## Runtime variables

- `TEDO_BACKEND_URL`: private backend origin, for example `http://tedo-backend:3003`
- `SITE_URL`: canonical public landing origin
- `CONTACT_WEBHOOK_URL`: optional destination for the legacy contact form
- `NEXT_PUBLIC_ZALO_OA_URL`: optional public OA link

## Image lifecycle

```powershell
docker build -t tedo-landing:latest .
docker run -d --restart unless-stopped --name tedo-landing --env-file .env.production -p 127.0.0.1:3002:3002 tedo-landing:latest
```

Reverse proxy the public domain to port 3002 and verify `GET /api/health`. Keep port 3003 private except for an explicitly configured Zalo webhook route.

## Release checks

```powershell
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
npm audit --omit=dev
docker build -t tedo-landing:latest .
```
