# FuelEU Maritime Compliance Platform

A production-quality compliance management system for shipping companies under the FuelEU Maritime regulation.

## Features (Planned)

- **Route Management** — Manage vessel routes and voyages
- **Emission Comparison** — Compare GHG emission intensities across fuel types
- **Compliance Balance (CB)** — Compute and track compliance balance per vessel
- **Banking** — Bank surplus compliance for future periods
- **Pooling** — Pool compliance across multiple vessels

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Backend  | Node.js, Express, TypeScript (strict), PostgreSQL |
| Frontend | React, TypeScript, Vite, TailwindCSS            |
| Testing  | Jest + Supertest (backend), Vitest + Testing Library (frontend) |
| CI/CD    | GitHub Actions                                  |

## Architecture

**Hexagonal Architecture (Ports & Adapters)**

```
src/
├── core/              # Pure domain logic — NO framework imports
│   ├── domain/        # Entities, value objects
│   ├── application/   # Use cases, services
│   └── ports/         # Interfaces (inbound & outbound)
├── adapters/          # Framework-specific implementations
│   ├── inbound/       # HTTP controllers (Express)
│   └── outbound/      # Database repositories (PostgreSQL)
├── infrastructure/    # Server bootstrap, DB connections
│   ├── server/
│   └── db/
└── shared/            # Cross-cutting utilities
```

> **Rule:** The `core/` layer MUST NOT import any framework (`express`, `pg`, `react`).

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm ≥ 9

### Backend

```bash
cd backend
npm install
cp .env.example .env   # edit DATABASE_URL
npm run dev             # starts on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev             # starts on http://localhost:5173
```

### Verify

```bash
# Backend health check
curl http://localhost:3001/health
# → {"status":"ok","service":"FuelEU Backend"}
```

## Scripts

### Backend

| Script          | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start dev server (ts-node-dev) |
| `npm run build` | Compile TypeScript           |
| `npm start`     | Run compiled JS              |
| `npm test`      | Run Jest tests               |
| `npm run lint`  | Run ESLint                   |

### Frontend

| Script          | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start Vite dev server    |
| `npm run build` | Production build         |
| `npm test`      | Run Vitest tests         |
| `npm run lint`  | Run ESLint               |

## License

See [LICENSE](./LICENSE).