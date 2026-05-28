# School MIS Backend

![CI](https://github.com/Smalljoe1/school-mis/actions/workflows/ci.yml/badge.svg)

Node.js + Express + PostgreSQL backend for a School Management Information System.

## CI

A GitHub Actions workflow is configured at `.github/workflows/ci.yml`.

- Triggers on `push` and `pull_request`
- Uses Node.js LTS
- Installs dependencies with `npm ci`
- Runs tests with `npm test`

## Deploying to Render

This repository includes a Render Blueprint in `render.yaml`.

### 1) Create services from Blueprint

1. Push this repository to GitHub.
2. In Render, choose **New +** → **Blueprint**.
3. Connect this repository and deploy.
4. Render will create:
   - `school-mis-backend` (Node web service)
   - `school-mis-db` (PostgreSQL database)

### 2) Environment variables

The Blueprint sets/defaults these variables:

- `NODE_ENV=production`
- `PORT=10000`
- `DATABASE_URL` (auto-linked from the Render PostgreSQL service)
- `JWT_SECRET` (auto-generated)
- `JWT_EXPIRES_IN=1d`

If your backend requires additional variables, add them in Render dashboard:
**Service → Environment**.

### 3) Build and start commands

- Build: `npm ci`
- Start: `npm start`

If your app uses a different entry command, update `startCommand` in `render.yaml`.

## Database initialization on hosted environment

After first deploy, initialize the schema and seed data using Render Shell (or any psql client) with `DATABASE_URL`:

```bash
psql "$DATABASE_URL" -f sql/schema.sql
psql "$DATABASE_URL" -f sql/seed.sql
```

Run these once per new database.

## Post-deploy smoke checks

After deployment:

1. Health endpoint:
   - `GET /health` should return a healthy response.
2. Authentication:
   - Log in with a seeded/test user and confirm token issuance.
3. Protected route:
   - Call one protected API route with the bearer token and confirm `200` response.

Example health check:

```bash
curl https://<your-render-service>.onrender.com/health
```
