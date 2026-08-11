# TEDO landing deployment

The browser talks only to same-origin `/api/*` routes. The Next.js server proxies consultation traffic to the private backend through `TEDO_BACKEND_URL`, so OpenRouter, PostgreSQL, Qdrant, and Zalo credentials never enter the browser bundle.

## Runtime variables

- `TEDO_BACKEND_URL`: private backend origin, for example `http://tedo-backend:3030`
- `SITE_URL`: canonical public landing origin
- `CONTACT_WEBHOOK_URL`: optional destination for the legacy contact form
- `NEXT_PUBLIC_ZALO_OA_URL`: optional public OA link

## Image lifecycle

```powershell
docker build -t tedo-landing:latest .
docker run -d --restart unless-stopped --name tedo-landing --env-file .env.production -p 127.0.0.1:3020:3020 tedo-landing:latest
```

Reverse proxy the public domain to port 3020 and verify `GET /api/health`. Keep port 3030 private except for an explicitly configured Zalo webhook route.

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
