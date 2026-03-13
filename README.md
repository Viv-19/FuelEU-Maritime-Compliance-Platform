# FuelEU Maritime Compliance Platform

A full-stack web application that simulates compliance calculations under **EU FuelEU Maritime regulations**. The platform enables maritime operators to manage ship routes, compare emissions intensity against regulatory targets, bank surplus compliance balance, and pool compliance across fleets.

---

## Overview

The FuelEU Maritime regulation mandates that ships operating in EU waters progressively reduce their greenhouse gas (GHG) intensity. This platform provides four core modules to support compliance management:

| Module | Purpose |
|--------|---------|
| **Routes** | View, filter, and manage ship routes; designate a baseline route for comparisons |
| **Compare** | Analyze route emissions against the baseline; visualize compliance against the FuelEU target intensity (89.3368 gCO2e/MJ) |
| **Banking** | Bank surplus Compliance Balance (CB > 0) for future use, or apply banked surplus to offset deficits (Article 20) |
| **Pooling** | Form compliance pools across ships so surplus ships offset deficit ships (Article 21) |

---

## Architecture

The project follows **Hexagonal Architecture** (Ports & Adapters), ensuring strict separation between business logic and infrastructure concerns.

### Backend Structure

```
backend/src/
├── core/
│   ├── domain/           # Domain entities (Route, ShipCompliance, BankEntry, PoolMember)
│   ├── application/      # Use cases (ComputeCB, CompareRoutes, BankSurplus, ApplyBanked, CreatePool)
│   └── ports/            # Interfaces for inbound/outbound communication
├── adapters/
│   └── inbound/http/     # Express controllers & routers
├── infrastructure/
│   ├── db/               # PostgreSQL migrations, seeds, connection
│   └── server/           # Express server bootstrap
```

### Frontend Structure

```
frontend/src/
├── core/
│   └── domain/           # TypeScript interfaces (Route, ComplianceBalance, PoolMember)
├── adapters/
│   ├── ui/               # React page components and UI elements
│   └── infrastructure/   # API client (fetch wrapper)
├── shared/
│   └── components/       # Reusable layout components (TabLayout)
├── __tests__/            # Vitest + React Testing Library tests
```

### System Architecture Diagram

```
┌─────────────────────────────┐
│   Frontend (React + Vite)   │
│   Routes │ Compare │ Banking│ Pooling
└─────────────┬───────────────┘
              │ HTTP/REST
┌─────────────▼───────────────┐
│  API Layer (Express Router) │
│  Controllers ← Zod Schemas │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│   Application Use Cases     │
│   ComputeCB │ CompareRoutes │
│   BankSurplus │ CreatePool  │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│      Domain Models          │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│    PostgreSQL Database      │
└─────────────────────────────┘
```

---

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Node.js, Express, TypeScript, PostgreSQL, Zod |
| **Frontend** | React 18, TypeScript (strict), Vite, TailwindCSS, React Router, Recharts |
| **Testing** | Jest, Supertest (backend); Vitest, React Testing Library (frontend) |
| **CI/CD** | GitHub Actions |
| **Architecture** | Hexagonal Architecture (Ports & Adapters) |

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 20
- PostgreSQL ≥ 14
- npm ≥ 9

### Clone & Install

```bash
git clone https://github.com/Viv-19/FuelEU-Maritime-Compliance-Platform.git
cd FuelEU-Maritime-Compliance-Platform

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## Run Development Servers

### Backend

```bash
cd backend
npm run dev
```

Runs on **http://localhost:3000**

### Frontend

```bash
cd frontend
npm run dev
```

Runs on **http://localhost:5173**

---

## Database Setup

Configure your `.env` file in `backend/` with PostgreSQL connection details, then run:

```bash
cd backend

# Run migrations (creates tables)
npm run db:migrate

# Seed initial data (inserts 5 sample routes)
npm run db:seed
```

---

## Running Tests

### Backend (Jest + Supertest)

```bash
cd backend
npm run test              # Run all tests
npm run test:coverage     # Run with coverage report
```

### Frontend (Vitest + React Testing Library)

```bash
cd frontend
npm run test              # Run all tests
npm run test:coverage     # Run with coverage report
```

### Test Coverage Summary

| Stack | Tests | Suites | Status |
|-------|-------|--------|--------|
| Backend | 56 | 14 | ✅ All pass |
| Frontend | 45 | 13 | ✅ All pass |
| **Total** | **101** | **27** | ✅ |

---

## API Examples

### Get All Routes

```http
GET /routes
```

```json
[
  {
    "routeId": "R001",
    "vesselType": "Container",
    "fuelType": "VLSFO",
    "year": 2024,
    "ghgIntensity": 91.2,
    "fuelConsumption": 5000,
    "distance": 12000,
    "totalEmissions": 45600,
    "isBaseline": true
  }
]
```

### Set Baseline Route

```http
POST /routes/R001/baseline
```

### Get Route Comparison

```http
GET /routes/comparison
```

### Bank Surplus Compliance

```http
POST /banking/bank
Content-Type: application/json

{
  "shipId": "SHIP001",
  "year": 2024,
  "amount": 5000
}
```

### Apply Banked Surplus

```http
POST /banking/apply
Content-Type: application/json

{
  "shipId": "SHIP001",
  "year": 2024,
  "amount": 3000
}
```

### Create Compliance Pool

```http
POST /pools
Content-Type: application/json

{
  "year": 2024,
  "members": [
    { "shipId": "Ship-A", "cb_before": 6000 },
    { "shipId": "Ship-B", "cb_before": -4000 },
    { "shipId": "Ship-C", "cb_before": -1000 }
  ]
}
```

---

## Screenshots

> *Screenshots to be added after deployment.*

| Module | Description |
|--------|-------------|
| Routes Dashboard | View and filter ship routes, set baseline |
| Compare Dashboard | Emissions intensity comparison chart and table |
| Banking Dashboard | Compliance balance cards with bank/apply actions |
| Pooling Dashboard | Ship pool summary with validity indicator |

---

## License

ISC