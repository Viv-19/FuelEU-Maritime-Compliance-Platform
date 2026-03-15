

# REFLECTION.md

# Reflection

## Experience Using AI Agents

Building the **FuelEU Maritime Compliance Platform** using AI agents was an exercise in structured, AI-assisted software engineering. Rather than treating the AI as an autonomous developer, it was used as a **collaborative engineering assistant** that accelerated development while operating within clearly defined architectural constraints.

The project was implemented through a **phase-based workflow**, where each stage of development had a specific focus. The phases included project scaffolding, domain modeling, database schema design, API integration, frontend architecture setup, feature implementation, and final integration testing.

For each phase, the AI agent received **structured prompts containing architectural rules, expected outputs, validation criteria, and domain constraints**. This approach ensured that the generated code adhered to the project’s **hexagonal architecture**, maintained strong TypeScript typing, and respected the separation between domain, application, adapters, and infrastructure layers.

Using this method, the AI agent effectively acted as a **pair programmer** capable of generating production-quality scaffolding, implementing modules, and producing test suites while the developer focused on architecture decisions, validation, and domain correctness.

---

## Efficiency Gains

The most noticeable efficiency gain was in **eliminating repetitive boilerplate work**.

Tasks that would normally take significant setup time—such as creating Express controllers, defining TypeScript interfaces, configuring database migrations, building React components with Tailwind styling, and generating test suites—were completed in minutes with AI assistance.

Another major advantage was **pattern replication**. Once an architectural pattern was established in one module, the agent consistently reproduced the same structure across other modules. For example, once the **Routes module** established the pattern of:

* domain model
* application use case
* adapter/controller
* UI page
* tests

the same structure was automatically followed for the **Compare, Banking, and Pooling modules**.

This consistency significantly improved development speed while maintaining architectural integrity.

The **debugging cycle** was also accelerated. When integration issues occurred—such as API communication errors or failing tests—the AI agent helped quickly identify potential causes, propose fixes, and verify solutions. This reduced the feedback loop between writing code and achieving a working implementation.

---

## Challenges

Despite the productivity gains, several areas still required careful human oversight.

The most important challenge was **domain correctness**. The FuelEU Maritime regulation defines precise formulas, thresholds, and compliance rules. While the AI agent implemented the Compliance Balance formula correctly,

```
CB = (Target − Actual) × Energy
```

the values and assumptions used in the implementation had to be manually verified against the regulatory documentation. AI agents can implement logic quickly, but **they cannot independently confirm regulatory accuracy without explicit verification**.

Another challenge appeared in **automatically generated tests**. Some test assertions assumed unique DOM elements and used selectors such as `getByText`. In cases where multiple elements contained identical values (like in the Pooling module where a ship ID appeared both in a filter dropdown and in the results table), the tests failed due to selector ambiguity. These were corrected by switching to `getAllByText`, adding count-based assertions, and selecting checkboxes by index rather than assuming text singularity.

**Floating-point arithmetic** also introduced subtle issues. For example, calculations such as:

```
(89.3368 − 120) × 0
```

produce `-0` in JavaScript, which fails strict equality tests. These cases required adjusting assertions to use `toBeCloseTo(0)` instead of strict equality comparisons.

These challenges reinforced the need for **manual validation even when AI generates most of the implementation**.

---

## Lessons Learned

Several key lessons emerged from this AI-assisted development process.

First, **clear and constrained prompts dramatically improve output quality**. Explicitly specifying architecture rules, file structures, and expected behaviors prevented architectural drift and reduced the need for refactoring.

Second, **AI excels at pattern recognition and replication**. Once a clean architectural pattern was established, the agent consistently reproduced it across multiple modules with minimal additional guidance.

Third, **human oversight remains essential for domain logic and system correctness**. AI can accelerate implementation, but the developer must verify regulatory requirements, edge cases, and integration behavior.

Fourth, **reviewing AI-generated tests is just as important as reviewing code**. Automated tests may contain assumptions about the UI or numerical precision that require adjustment.

Finally, **phase-based development works extremely well with AI agents**. Breaking the system into small, well-defined phases maintained context, reduced hallucination risk, and ensured each component was validated before moving forward.

---

## Future Improvements

Several improvements could further enhance the AI-assisted development workflow in future projects.

Creating **reusable prompt templates** for common architectural tasks—such as domain modeling, API adapter creation, and React module scaffolding—would reduce the need to write highly detailed prompts each time.

Integrating **automated coverage thresholds in CI** would ensure that the generated test suites maintain consistent quality as the project evolves.

Adding **visual regression testing for the frontend** could complement the existing component tests and catch UI changes that traditional tests might miss.

Generating **architecture diagrams automatically from the codebase** would also help keep documentation synchronized with implementation.

Finally, domain-specific AI fine-tuning using **maritime compliance datasets or regulatory documentation** could improve the agent’s ability to reason about compliance rules without relying entirely on manual verification.

---

## Final Reflection

Overall, this project demonstrated that AI agents can significantly accelerate full-stack development when used within a **structured engineering workflow**. By combining AI-generated code with careful architectural planning and human validation, it is possible to build complex systems more efficiently while maintaining high standards of code quality and design discipline.

---


