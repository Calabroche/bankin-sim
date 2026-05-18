# bankin-sim

Simulateur de capacité d'emprunt — concept produit Bankin'.

A full-stack Next.js 13 application:

- **Frontend** — a mobile-first iOS-style simulator UI (4 steps: profil → revenus → projet → résultat).
- **Backend** — Next.js Route Handlers under `/api/*`:
  - `GET  /api/rates` — current borrowing rate grid by duration.
  - `POST /api/simulate` — server-side capacity & monthly-payment computation.
  - `POST /api/leads` — submit a lead (name, email, phone, capacity).

## Stack

- Next.js 13.5 (App Router)
- React 18
- TypeScript (strict)
- Node ≥ 16.15.1

## Local development

```bash
npm install
npm run dev
# → http://localhost:3000
```

## API examples

```bash
# Get rates
curl http://localhost:3000/api/rates

# Simulate
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"netMonthly":4500,"charges":300,"duration":20,"apport":20000,"propertyType":"p","kids":2,"situation":"l"}'

# Submit lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","phone":"0600000000","capacity":250000}'
```

## Deploy

Hosted on Vercel — pushes to `main` deploy automatically.
