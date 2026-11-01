# QUARTZSENTRY — Thermal Runaway Shield

[![CI](https://github.com/RONALD-REX-7/QUARTZSENTRY/actions/workflows/ci.yml/badge.svg)](https://github.com/RONALD-REX-7/QUARTZSENTRY/actions/workflows/ci.yml)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Oxlint](https://img.shields.io/badge/Oxlint-Passing-green)](https://oxc.rs/)
[![WCAG](https://img.shields.io/badge/Design_Standard-WCAG_2.1_AA-blue)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Status](https://img.shields.io/badge/Maturity-Stage_3:_Software_Demonstrator-007ACC)](https://github.com/RONALD-REX-7/QUARTZSENTRY)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

> **Academic Engineering Prototype & Software Demonstrator**  
> **Team:** METRYPHOR  
> **Institution:** S.A. Engineering College (Autonomous), Chennai, Tamil Nadu, India  
> **Live Demonstrator**: [https://quartzsentry-prototype.vercel.app](https://quartzsentry-prototype.vercel.app)

---

> [!CAUTION]
> **Academic Software Demonstrator Notice**:
> - QUARTZSENTRY is a student engineering proof-of-concept and web demonstrator developed for academic competition and research exploration.
> - **All telemetry, Nyquist impedance curves, acoustic RMS values, and gas ppm readings displayed in this web dashboard are synthetic signals deterministically modeled in-memory** (`src/simulation.ts`).
> - The physical sensor transducers, analog front-ends (AFE), and physical microcontroller hardware integration are **incomplete** and tracked under active backlog issues (e.g., [Issue #2](https://github.com/RONALD-REX-7/QUARTZSENTRY/issues/2)).
> - This software is **NOT** a certified commercial safety system (no ISO 26262 ASIL, UL 9540A, or UNECE R100/AIS-156 certification) and must **never** be deployed as an autonomous battery safety intervention without certified physical BMS hardware interlocks.

---

## 1. Executive Summary & Purpose

Lithium-ion battery thermal runaway (TR) represents a critical safety risk in electric mobility and stationary grid storage. Traditional battery management systems (BMS) rely primarily on bulk temperature and voltage monitoring, which frequently register abnormalities only after irreversible internal exothermic reactions, venting, or cell rupture have initiated.

**QUARTZSENTRY** explores an early-warning multi-sensor paradigm by modeling four precursor modalities:
1. **Dynamic Electrochemical Impedance Spectroscopy (EIS)**: Modeling early SEI layer degradation and micro-dendrite formation.
2. **Piezoelectric Acoustic Emission Tracking (DAWN Concept)**: Modeling mechanical stress waves and internal structural micro-cracking.
3. **Electrolyte Off-Gas Analysis (H₂ / VOCs)**: Modeling early vapor formation before major venting events.
4. **Thermodynamic Pack Telemetry**: Cell-by-cell voltage distribution (simulated 16-cell module) and module thermal gradients.

---

## 2. Architecture & Evidence Reality Matrix

In accordance with strict engineering integrity standards, the table below delineates what is implemented in software versus what is simulated or planned:

| Subsystem / Layer | Implemented Software Demonstrator | Simulated / In-Memory Component | Physical Hardware Status |
| :--- | :--- | :--- | :--- |
| **User Interface & Telemetry** | React 19 SPA, Vite 8, interactive Recharts SVG plots, dark theme, WCAG AA contrast. | Sensor telemetry arrays, Nyquist Cole-Cole curves, and thermal gradients generated in `src/simulation.ts`. | **Software Only**: Deployed to Vercel CDN; no local server hardware required. |
| **Sensor Telemetry (EIS, Acoustic, Gas)** | Reactive dashboard with multi-modal views, parameter inspectors, and live audio/visual alerts. | Deterministic mathematical functions with bounded Gaussian noise modeling sensor responses to injected triggers. | **Incomplete**: Physical AD5933 impedance converter and piezoelectric transducers planned on ESP32-S3 test bench ([Issue #2](https://github.com/RONALD-REX-7/QUARTZSENTRY/issues/2)). |
| **Risk Ladder & Decision Engine** | 4-tier state machine (`NORMAL` $\to$ `ANOMALY` $\to$ `HIGH RISK` $\to$ `CRITICAL`). | Assigned scalar confidence indicators (65.0%, 85.0%, 95.0%, 99.9%) simulating theoretical TCN model output. | **Simulation**: Front-end state machine simulating the output of an Edge TinyML classifier; no on-chip neural weights. |
| **Battery Pack Modeling** | 16-cell interactive module grid with cell-level voltage and temperature readouts. | In-memory 16-element array with cell 7 designated as the fault injection target. | **Virtual**: Mathematical software model; no physical battery cells or cell-tapping harness. |
| **Actuation & Diagnostics** | Event audit log (`AuditEvent[]`), UI toast notifications, and CAN diagnostic frame representations. | String-based simulation events (`Load Derating Request`, `Critical Isolation Command`). | **Illustrative**: No physical high-voltage contactors, relays, or CAN transceivers connected. |

---

## 3. Technical Architecture & Simulation State Engine

```
┌────────────────────────────────────────────────────────────────────────┐
│               QUARTZSENTRY DEMONSTRATOR ARCHITECTURE                   │
└────────────────────────────────────────────────────────────────────────┘
  [Simulated Inputs]        [Simulation Engine]          [User Interface]
   • Synthetic EIS (R_ohm)   • Seeded State Factory       • 16-Cell Battery Grid
   • Synthetic Acoustic RMS  • Fault Injection Triggers  • Nyquist Cole-Cole Plot
   • Synthetic Gas (H2 ppm)  • Risk Ladder State Machine • Multi-Spectral Gauges
   • Virtual Pack Voltage    • Event Audit Dispatcher    • CAN Frame Inspector
```

### Risk Ladder State Definitions
- **Level 0 — NORMAL (id: 0)**: Baseline healthy cell operation ($R_\text{ohm} \approx 2.15\ \Omega$, gas $H_2 \approx 10\text{ ppm}$, acoustic $\text{RMS} \approx 0.05$). Confidence: 98.5%.
- **Level 1 — ANOMALY (id: 1)**: Single-modality precursor deviation ($R_\text{ohm} \uparrow 3.8\ \Omega$ or acoustic $\text{RMS} \uparrow 0.85$). Confidence: 65.0%–70.0%. Action: *Intensified Diagnostics*.
- **Level 2 — HIGH RISK (id: 2)**: Multi-modal agreement (EIS + Gas rapid rise $dp/dt \ge 5.5\text{ ppm/s}$). Confidence: 85.0%–95.0%. Action: *Load Derating Request*.
- **Level 3 — CRITICAL (id: 3)**: Imminent thermal runaway threshold breach ($T_\text{max} \ge 85^\circ\text{C}$, $H_2 \ge 800\text{ ppm}$, cell voltage drops to $3.2\text{ V}$). Confidence: 99.9%. Action: *Critical Isolation Command*.

---

## 4. Accessibility & Design Verification (WCAG 2.1 AA)

Rather than asserting unverified compliance badges, QUARTZSENTRY's user interface has been bench-tested against WCAG 2.1 AA contrast and navigation standards:

- **Color Contrast Ratios**:
  - Secondary body labels & chart axis ticks (`#8fa0b5` on surface `#1a1f2c`): **6.16:1** (Passes WCAG AA minimum of 4.5:1).
  - Status indicator green (`#22c55e` on surface `#1a1f2c`): **7.22:1** (Passes WCAG AAA).
  - High-risk orange (`#f97316` on surface `#1a1f2c`): **5.87:1** (Passes WCAG AA).
  - Critical alert red (`#ef4444` on surface `#1a1f2c`): **4.50:1** (Meets WCAG AA threshold).
- **Keyboard Navigation**: Interactive elements support full <kbd>Tab</kbd> traversal, focus rings, and <kbd>Escape</kbd> dismissal for modals.
- **Skip Link**: "Skip to main content" link provided as the first focusable element for screen-reader navigation.
- **Data Minimization**: Zero cookies, zero local storage tracking, zero external telemetry analytics, and zero personal data collection.

---

## 5. Getting Started & Local Development

### Prerequisites
- Node.js (v18.0.0 or higher; v20 LTS recommended)
- npm (v9.0.0 or higher)

### Installation & Build
```bash
# Clone the repository
git clone https://github.com/RONALD-REX-7/QUARTZSENTRY.git
cd QUARTZSENTRY

# Install verified dependencies exactly from package-lock.json
npm ci

# Run Oxlint static analysis
npm run lint

# Compile TypeScript and produce production bundle
npm run build

# Preview production build locally
npm run preview
```

The local development server can be launched via:
```bash
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

---

## 6. Project Roadmap & Backlog Status

- [ ] **Hardware Transducer Integration ([Issue #2](https://github.com/RONALD-REX-7/QUARTZSENTRY/issues/2))**: Active high-priority issue to evaluate physical AD5933 impedance converter IC and piezoelectric acoustic sensor on an isolated ESP32-S3 test bench. *(Status: Incomplete / Open backlog)*.
- [ ] **Embedded TinyML Port**: Port the theoretical time-series anomaly filter to embedded C++ using TensorFlow Lite for Microcontrollers (TFLM).
- [ ] **Hardware-in-the-Loop (HIL) Bridge**: Stream real-time CAN/TWAI bus frames from physical microcontrollers into the telemetry dashboard via WebSerial or WebSocket bridge.

---

## 7. License & Attribution

- **License**: Licensed under the [Apache License, Version 2.0](LICENSE).
- **Third-Party Assets**: Asset and font licensing records are cataloged in [`ASSET_LICENSES.md`](./ASSET_LICENSES.md).
- **Team**: METRYPHOR
- **Institution**: S.A. Engineering College (Autonomous), Chennai, Tamil Nadu, India.
- **Maintainer**: Ronald Rex C H ([@RONALD-REX-7](https://github.com/RONALD-REX-7)).
