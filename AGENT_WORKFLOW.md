# Agent Workflow

## Development Phases

### Phase 1 — Scaffolding (Current)
1. Initialize monorepo with backend and frontend projects
2. Set up strict TypeScript, linting, and testing frameworks
3. Establish hexagonal architecture folder structure
4. Create minimal server and UI bootstraps
5. Configure CI pipeline

### Phase 2 — Domain Modeling
1. Define core domain entities (Vessel, Route, Voyage, Fuel, Emission)
2. Create value objects and domain rules
3. Define port interfaces for inbound and outbound operations

### Phase 3 — Use Cases
1. Implement application services (route management, CB computation, banking, pooling)
2. Wire ports to adapters

### Phase 4 — Infrastructure
1. Database migrations and schema
2. PostgreSQL repository adapters
3. Express route controllers

### Phase 5 — Frontend Integration
1. API client integration
2. Dashboard components
3. Route and compliance views

## Architecture Rules

- **Core** layer is framework-free — no `express`, `pg`, or `react` imports
- **Adapters** implement port interfaces using framework-specific code
- **Infrastructure** handles bootstrapping (server, DB connections)
- All dependencies point **inward** toward the core

## Testing Strategy

| Layer          | Tool           | Focus                        |
| -------------- | -------------- | ---------------------------- |
| Domain         | Jest / Vitest  | Pure unit tests              |
| Application    | Jest / Vitest  | Use case logic               |
| Adapters       | Supertest      | HTTP integration tests       |
| Frontend       | Testing Library| Component rendering & behavior |
