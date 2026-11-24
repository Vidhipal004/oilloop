# OilLoop — premium UCO collection & traceability workspace

OilLoop is a React + Vite application with an Express API and optional PostgreSQL persistence. It includes the company operations dashboard, restaurant pickup portal, collector workflow, intake/quality capture, batch trace view, route planning, CSV exports and illustrative traceability records.

> **Deployment mode:** the included Render blueprint deploys the app as a free web service. In free demo mode, records are saved in each user's browser. A free web service does not itself provide durable shared database storage. For shared persistence, connect a PostgreSQL database and deliberately enable `ALLOW_PUBLIC_DEMO_STATE=true` only for non-sensitive demonstration data. The current UI is a role-switching demo and does not yet enforce tenant isolation or production-grade user permissions; do not use it for live customer, payment, identity or regulated operational data.

## Run locally

Requirements: Node.js 20+.

```bash
npm ci
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`). The Express API runs on port 4000. Without `DATABASE_URL`, the app falls back to browser storage.

## Build and run as one service

```bash
npm ci
npm run build
npm start
```

The Express server serves the Vite `dist/` build and exposes `/api/health`. This is the Render deployment path. Render supplies `PORT`; do not hard-code a production port.

## Deploy on Render (free web service)

1. Push this project to a GitHub repository.
2. In Render, choose **New → Blueprint** and select the repository (the included `render.yaml` configures the service).
3. Wait for the build and open the generated `onrender.com` URL.
4. The default deployment uses browser-local demo storage. Each visitor/browser has its own local dataset.
5. If you attach PostgreSQL for a shared demo, set `DATABASE_URL` and `ALLOW_PUBLIC_DEMO_STATE=true` in Render environment variables. Use only synthetic/demo records because the shared-state API is intentionally public in this demo configuration.

The free web service may sleep when idle and take time to wake. Browser-local records remain in that browser; they are not a backup and can be lost if browser storage is cleared. For reliable multi-user persistence, use a secured database and complete the authentication/tenant work listed below.

## Optional admin account API

The backend includes password-hashed registration/login and JWT helpers. The current front-end role switcher is for demonstration and does not authenticate requests or apply per-tenant access rules. Do not treat the admin API as a complete production identity system.

## Quality and traceability guardrails

- OilLoop's A/B/C grades are internal commercial workflow labels, not official FSSAI grades.
- A TPC reading is a recorded quality metric; a value below 25% is not a blanket declaration that oil is safe for reuse in food.
- QR/traceability downloads are illustrative records, not statutory manifests, government certificates or regulatory approvals.
- GPS, payments, buyer/processor integrations and regulatory portal integrations are not connected.

## Production hardening still required

Before live operations, implement authenticated UI sessions, tenant-scoped data access, server-side role enforcement for every state mutation, audit-event immutability, concurrency-safe domain APIs (instead of whole-state replacement), database migrations/backups, CSRF/session strategy, rate limiting, monitoring, and formal security testing. Configure a managed PostgreSQL service with backups and TLS.

## Project structure

- `src/` — React dashboard and design system
- `server/` — Express API and optional PostgreSQL integration
- `db/schema.sql` — relational schema reference
- `design-reference/` — original visual references
- `render.yaml` — Render Blueprint

### Same-browser demo synchronization
All roles now share the same seed and browser state. For this demo, existing browser records take priority over the API snapshot to avoid losing locally added partners. Open all roles on the same origin (e.g. localhost:5173), in the same browser profile. Verify a partner before booking. Open portal tabs refresh on storage changes or focus. This is not a multi-device conflict-resolution system. Do not use for production records. Run `node tests/sync.mjs` for the shared-state regression check.

### Buyer marketplace demo
Open `/buyers.html` from the landing page, or Buyer sales & revenue from the admin sidebar. Use depot-ready batch OL-2026-0079 to request a purchase as the fictional biodiesel buyer. Switch to Company sales & revenue, approve, dispatch with a reference and vehicle, switch back to Buyer workspace, confirm matching destination and quantity with receipt reference and officer, then confirm processing with evidence reference. Switch back to company and record settlement reference. Revenue is received litres × rate; contribution margin subtracts recorded source payout and estimated logistics (not net profit). Missing source costs are excluded from margin. Quantity discrepancies block receipt until manually reconciled. Animal-feed buyers are listed but blocked pending legal/safety clearance. Roles and evidence are simulated, not secure independent verification. Existing shared-state API stores sales in JSONB when enabled; public demo state must never contain real data. Browser fallback and existing whole-state sync limitations remain. Tests: `node tests/trade.mjs` and `node tests/sync.mjs`. Render build: `npm ci --include=dev && npm run build`.
