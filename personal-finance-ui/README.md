# Personal Finance UI (TypeScript + React + Vite)

## Prerequisites

- Node.js 18+ (LTS)
- npm 9+
- Auth0 account (or other OIDC) to issue JWTs

## Env variables (in `.env` file at project root for local dev)


VITE_AUTH0_DOMAIN=<your-tenant.us.auth0.com>
VITE_AUTH0_CLIENT_ID=<your-client-id>
VITE_AUTH0_AUDIENCE=<your-api-audience>
VITE_API_BASE=<your-api-base-url>

## Dev

1. npm install
2. npm run dev
3. Open http://localhost:5173

## Production

1. npm run build
2. docker build -t personal-finance-ui .
3. docker run -p 80:80 -e VITE_API_BASE="https://api.yourdomain.com/api" personal-finance-ui

## Auth0 setup (quick)

- Create an API in Auth0; note its Identifier (audience).
- Create an SPA application; configure Allowed Callback URLs: `http://localhost:5173/callback`
- Enable Refresh Token Rotation for SPA if you want persistent sessions.
- Set env vars above.

## Notes

- This client expects the API to be available at `/api` (proxied in dev).
- For production, configure `VITE_API_BASE` to the actual API endpoint.
