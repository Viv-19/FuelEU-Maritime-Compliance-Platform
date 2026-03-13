# Reflection

## Experience Using AI Agents

Building the FuelEU Maritime Compliance Platform with an AI coding agent was an exercise in collaborative engineering. The Antigravity agent served as a highly capable pair programmer — one that could scaffold entire modules, write comprehensive tests, and maintain architectural consistency across a multi-module full-stack application. The experience demonstrated that AI agents are most effective when treated not as autonomous developers, but as force multipliers that operate within clearly defined architectural boundaries.

The development process followed a structured phase-by-phase approach: backend scaffolding, domain modeling, HTTP adapter implementation, frontend initialization, and then iterative module implementation (Routes → Compare → Banking → Pooling). At each phase, the agent received detailed specifications including architecture rules, data models, API contracts, and expected behaviors. This structured prompting approach ensured that outputs were immediately usable with minimal modification.

## Efficiency Gains

The most significant efficiency gains came from **boilerplate elimination**. Tasks that would typically consume hours — setting up Express controllers with Zod validation, creating React components with TailwindCSS styling, writing Jest and Vitest test suites — were completed in minutes. The agent generated 101 test cases across 27 test suites, covering unit tests, integration tests, and UI component tests. This level of test coverage would have taken substantially longer to achieve manually.

**Pattern replication** was another major advantage. Once the Routes module established the architectural pattern (domain interface → UI components → page orchestrator → tests), subsequent modules (Compare, Banking, Pooling) followed the same structure automatically. The agent internalized the hexagonal architecture constraints and consistently placed files in the correct layers without reminders.

The **iterative debugging cycle** was also accelerated. When tests failed — whether due to multiple DOM elements matching the same selector, floating-point edge cases like `-0`, or stale assertion text — the agent identified root causes, applied fixes, and re-ran verification within a single interaction cycle. This tight feedback loop reduced the time between writing code and achieving a green test suite.

## Challenges

The primary challenge was **regulatory correctness**. The FuelEU Maritime regulation defines specific formulas, thresholds, and compliance rules that require domain expertise to validate. While the agent correctly implemented the Compliance Balance formula `CB = (Target − Actual) × Energy`, and the pooling allocation algorithm, these required manual verification against the regulatory text. An AI agent cannot independently confirm that `TARGET_INTENSITY = 89.3368 gCO2e/MJ` is the correct value — that responsibility remains with the developer.

**Test assertion precision** was a recurring friction point. The agent initially used `getByText` selectors that failed when identical values appeared in multiple table cells (e.g., `4,500` appearing in both "CB Before" and "CB After" columns). These issues were resolved by switching to `getAllByText` with count assertions, but they highlighted that AI-generated tests require careful review of DOM structure assumptions.

**Floating-point arithmetic** surfaced subtly: `(89.3368 - 120) × 0` produces `-0` in JavaScript, which fails a strict `toBe(0)` assertion. This is the kind of edge case that AI agents occasionally miss because the logic is mathematically correct but practically brittle.

## Lessons Learned

1. **Clear, constrained prompts produce better results.** Specifying hexagonal architecture rules, file locations, and interface shapes upfront eliminated most architectural drift.

2. **AI excels at pattern replication.** Once a working pattern exists, the agent reproduces it accurately and consistently across new modules.

3. **Human oversight remains essential for domain logic.** Regulatory formulas, compliance thresholds, and business rules must be verified by a domain expert, not delegated to the agent.

4. **Test review is as important as code review.** AI-generated tests can have subtle assertion issues (selector ambiguity, floating-point comparisons) that only surface during execution.

5. **Iterative, phased development works well with AI.** Building one module at a time, verifying it, and then proceeding to the next maintains quality and context better than attempting everything at once.

## Future Improvements

Looking ahead, several areas could enhance the AI-assisted development workflow:

- **Prompt templates** for common architectural patterns would reduce the specificity needed in each prompt
- **Automated coverage threshold enforcement** in CI would catch gaps that manual review might miss
- **Visual regression testing** for the frontend would complement the existing component tests
- **Architecture diagram generation** from code analysis would keep documentation synchronized with implementation
- **Domain-specific AI fine-tuning** on maritime compliance regulations could improve the agent's ability to independently validate business rules
