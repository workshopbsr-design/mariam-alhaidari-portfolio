# Reference Architecture Document: Atelier Mariam

## 1. Purpose of This Document
This document defines the reference architecture for the Portfolio System. It is intended to:
- Serve as a long-term architectural contract.
- Prevent boundary violations as the system evolves.
- Act as a shared mental model for future contributors.
- Justify design decisions at a professional / jury / client-review level.

> This is not a tutorial document. It is an architectural specification.

---

## 2. Architectural Philosophy

### 2.1 Core Principle
> **Structure expresses intent.**

The system is designed as a narrative-driven frontend architecture where technical layers map directly to conceptual responsibility.
Key philosophical drivers:
- Separation of concerns is enforced structurally.
- Direction of dependency is strictly downward.
- UI is treated as an orchestration layer, not a logic container.
- The architecture remains legible under growth.

---

## 3. High-Level System Model

```
User Interaction
      ↓
Pages (Orchestration Layer)
      ↓
Components (Presentation Layer)
      ↓
Hooks / Context (Behavior & State)
      ↓
Utils / Data / Types (Pure Logic & Contracts)
      ↓
Services (External Systems)
```

**Rules:**
1. Dependencies flow downward only.
2. No upward or lateral coupling is permitted.
3. Each layer may only depend on layers below it.

---

## 4. Directory Structure as Architectural Contract

### 4.1 Root Layer (System Entry)
- **Responsibility:** Application bootstrap, tooling, and deployment configuration.
- **Contains:** `index.html`, `index.tsx`, `App.tsx`, `vite.config.ts`, `vercel.json`.
- **Rules:** No business logic or domain knowledge.

### 4.2 Pages Layer (`/pages`)
- **Role:** Orchestration & Narrative Flow.
- **Responsibilities:** Page-level composition, UX flow control, high-level state coordination.
- **Forbidden:** Importing other pages or containing reusable business logic.

### 4.3 Components Layer (`/components`)
- **Role:** Presentation.
- **Responsibilities:** Rendering UI, accepting data via props, local UI state only.
- **Forbidden:** Global state ownership or direct service calls.

### 4.4 Hooks Layer (`/hooks`)
- **Role:** Behavioral Logic.
- **Responsibilities:** Encapsulating side effects, data synchronization, reusable behavior.
- **Forbidden:** JSX or UI-specific markup.

### 4.5 Context Layer (`/context`)
- **Role:** Global State Coordination.
- **Responsibilities:** Cross-application state, policy enforcement (e.g., language, direction).

### 4.6 Utils Layer (`/utils`)
- **Role:** Pure Logic Core.
- **Responsibilities:** Stateless computation, data transformation, domain-neutral helpers.
- **Rules:** No React, no side effects, no environment access.

### 4.7 Types Layer (`/types`)
- **Role:** Domain Contract.
- **Responsibilities:** Define shared data shapes, enforce consistency across the app.
- **Rules:** No logic, no framework awareness. This is the semantic backbone.

### 4.8 Services Layer (`/services`)
- **Role:** External System Integration.
- **Responsibilities:** Firebase, APIs, Third-party SDKs.
- **Rules:** No UI awareness. Services are infrastructural boundaries.

---

## 5. Boundary Enforcement Rules (Non-Negotiable)
- **No upward imports.**
- **No circular dependencies.**
- **No shared mutable state outside context.**
- **No logic in presentation layers.**

> Violations are architectural defects, not style issues.

---

## 6. Architectural Identity Statement
This system is designed as a narrative space and a long-lived architectural artifact. The structure itself communicates intent, discipline, and authorship.

**If a future change feels "convenient" but breaks a boundary — it is wrong.**

---
*End of Reference Architecture Document*
