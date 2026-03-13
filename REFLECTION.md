# Reflection

## Architecture Decision: Hexagonal Architecture

### Why Hexagonal?

The FuelEU Maritime regulation involves complex compliance calculations (GHG intensity, compliance balance, banking, pooling) that are inherently **domain-heavy**. Hexagonal architecture isolates this business logic from infrastructure concerns.

### Key Benefits

1. **Testability** — Domain logic can be tested without spinning up Express or PostgreSQL
2. **Flexibility** — Swapping databases or frameworks requires changing only adapters
3. **Clarity** — Clear boundaries between "what the system does" (core) and "how it connects" (adapters)

### Trade-offs

- **More boilerplate** — Port interfaces and adapter implementations add files
- **Learning curve** — Contributors must understand the dependency rule
- **Over-engineering risk** — For a small MVP this could be excessive, but given the regulatory complexity it's justified

## TypeScript Strict Mode

Strict mode (`noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters`) catches entire categories of bugs at compile time. For a compliance system where correctness matters, this is non-negotiable.

## Monorepo Structure

Keeping backend and frontend in a single repo simplifies:
- CI/CD pipeline management
- Shared type definitions (future)
- Code review workflows

A workspace-based monorepo (e.g., npm workspaces) could be adopted later if the project grows.
