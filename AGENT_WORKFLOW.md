# Agent Workflow

This document records how AI coding agents were used during the development of the FuelEU Maritime Compliance Platform.

---

## 1. Agents Used

| Agent | Role in Development |
|-------|-------------------|
| **Antigravity** (Google DeepMind) | Primary development agent — scaffolded the full-stack architecture, implemented all modules (Routes, Compare, Banking, Pooling), wrote tests, created CI pipeline, and generated documentation |

### What the Agent Helped With

- **Project Scaffolding**: Initialized the Vite + React frontend and Express + TypeScript backend with hexagonal architecture folder structures
- **Domain Modeling**: Generated TypeScript interfaces for `Route`, `ComplianceBalance`, `PoolMember`, and application service signatures
- **UI Component Development**: Built React components (`RoutesTable`, `CompareTable`, `ComparisonChart`, `BankingInfo`, `PoolMemberList`, `PoolSummary`) with TailwindCSS styling
- **Backend Use Cases**: Implemented `ComputeCB`, `CompareRoutes`, `BankSurplus`, `ApplyBanked`, and `CreatePool` with correct regulatory formulas
- **HTTP Adapter Layer**: Created Express controllers, routers, and Zod validation schemas
- **Testing Infrastructure**: Generated Jest/Supertest backend tests and Vitest/RTL frontend tests covering 101 test cases
- **CI/CD**: Created GitHub Actions workflow for automated lint, type-check, and test execution

---

## 2. Prompts and Outputs

### Example 1: Domain Model Generation

**Prompt:**
> "Define banking state interface in `src/core/domain/ComplianceBalance.ts`"

**Generated Output:**

```typescript
export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbBefore: number;
  bankedAmount: number;
  cbAfter: number;
}
```

**Usage:** Adopted directly as the domain contract between the BankingPage UI and the backend API.

---

### Example 2: Application Use Case

**Prompt:**
> "Implement CreatePool with pooling rules: sum(CB) >= 0, deficit ships must not become worse, surplus ships must not become negative"

**Generated Output:**

```typescript
export function createPool(ships: PoolInputShip[]): PoolOutputShip[] {
  const totalBalance = ships.reduce((sum, ship) => sum + ship.complianceBalance, 0);
  if (totalBalance < 0) {
    throw new Error('Total pooling compliance balance must be >= 0');
  }
  // ... surplus-to-deficit allocation algorithm
}
```

**Usage:** Adopted with manual verification that the algorithm satisfies Article 21 constraints.

---

### Example 3: Test Scaffolding

**Prompt:**
> "Create Vitest tests for PoolingPage: mock API, verify pool validity, test Create Pool button"

**Generated Output:** Complete test file with 5 test cases covering data loading, valid/invalid pools, pool creation, and error handling.

**Usage:** Adopted after adjusting assertions for multiple element matches (e.g., `getAllByText` instead of `getByText` for duplicated values).

---

## 3. Validation and Corrections

All AI-generated code underwent manual review. Key corrections made:

| Area | Issue | Correction |
|------|-------|------------|
| **TypeScript types** | Verified all interfaces matched backend API contracts | Minor adjustments to optional fields |
| **Floating point** | `computeComplianceBalance(120, 0)` returned `-0` instead of `0` | Changed assertion to `toBeCloseTo(0)` |
| **Test selectors** | `getByText` failed when multiple elements shared the same text | Replaced with `getAllByText` and count assertions |
| **Navigation tests** | Tab layout test referenced old placeholder header text | Updated assertion to match production component |
| **Compliance formulas** | Verified `TARGET_INTENSITY = 89.3368` and `ENERGY_PER_TON_FUEL = 41000` | Confirmed against FuelEU regulation values |

---

## 4. Observations

### Where AI Excelled

- **Boilerplate generation** — React components, Express controllers, and test scaffolding were produced rapidly
- **Architecture adherence** — When given explicit hexagonal architecture rules, the agent consistently placed files in correct layers
- **Iterative debugging** — The agent identified and fixed test failures autonomously across multiple iterations
- **Pattern consistency** — Once a pattern was established (e.g., in the Routes module), subsequent modules followed the same structure

### Where Manual Review Was Essential

- **Regulatory correctness** — FuelEU formulas and compliance thresholds required human verification
- **Edge cases** — The `-0` floating point issue and multiple-element DOM selectors required manual debugging
- **Test data accuracy** — Ensuring mock data matched realistic compliance scenarios

---

## 5. Best Practices Followed

1. **Used AI to scaffold, humans to validate** — Agent generated structure; developer verified business logic
2. **Provided architectural constraints in prompts** — Specifying hexagonal architecture rules ensured proper separation of concerns
3. **Iterative refinement** — Each module was built, tested, and verified before moving to the next
4. **Centralized state management** — All API calls stayed in page-level components per architectural rules
5. **Comprehensive testing** — 101 tests across 27 suites ensure confidence in correctness
