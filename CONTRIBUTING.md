# Contributing to QUARTZSENTRY

Thank you for your interest in contributing to **QUARTZSENTRY**!

## Scope & Philosophy

QUARTZSENTRY is an academic engineering demonstrator modeling early-precursor thermal runaway detection in Li-ion battery modules (EIS impedance drift, ultrasonic acoustic emissions, electrolyte off-gas, and thermodynamic telemetry).

---

## Local Development Workflow

```bash
# 1. Install dependencies
npm ci

# 2. Run linter
npm run lint

# 3. Run build validation
npm run build

# 4. Preview build locally
npm run preview
```

---

## Verification Standards

1. **Linter Gate**: Must pass `npm run lint` (Oxlint) with 0 errors and 0 warnings.
2. **Typecheck & Build**: Must pass `tsc -b && vite build` with 0 errors.
3. **Accessibility**: All interactive telemetry controls must maintain WCAG 2.1 AA keyboard navigation and screen reader semantics.
4. **Honesty In Engineering**: Any modifications to mathematical models in `src/simulation.ts` must maintain deterministic reproducibility and transparent disclaimers.
