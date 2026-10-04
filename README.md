# QUARTZSENTRY — Thermal Runaway Shield

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Oxlint](https://img.shields.io/badge/Oxlint-Passing-green)](https://oxc.rs/)
[![WCAG](https://img.shields.io/badge/WCAG-2.2_AA_Compliant-blue)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Academic Engineering Prototype & Software Demonstrator**  
> **Team:** METRYPHOR  
> **Institution:** S.A. Engineering College (Autonomous), Chennai, Tamil Nadu, India  

---

## Executive Summary

**QUARTZSENTRY** is an engineering proof-of-concept and research demonstrator designed to evaluate early-warning detection strategies for thermal runaway in lithium-ion battery modules. By fusing multi-frequency Electrochemical Impedance Spectroscopy (EIS), ultrasonic acoustic emission tracking, electrolyte off-gas analysis (H₂ / VOC), and thermodynamic telemetry (V, I, T), the system models early precursor detection significantly prior to uncontrollable cell venting and thermal propagation.

---

## Technical Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        QUARTZSENTRY PIPELINE                           │
└────────────────────────────────────────────────────────────────────────┘
  [Transducers]       [Analog Front End]      [Edge Processing]
   • Voltage (V)       • AD5933 Impedance      • TinyML TCN Engine
   • Current (I)       • Piezoelectric AFE     • Multi-Sensor Fusion
   • Temperature (T)   • MOX Gas Sensor        • 4-Level Safety Ladder
   • Acoustic Wave     • Signal Filtering      • Low-Voltage Relay Actuation
   • Hydrogen Off-Gas  • Normalization         • CAN-TWAI Diagnostics
```

### 1. Multimodal Sensing Modalities
- **Galvanostatic Dynamic EIS (GD-EIS)**: Real-time impedance spectroscopy tracking ohmic resistance ($R_\text{ohm}$), charge-transfer resistance ($R_\text{ct}$), and phase shift on Nyquist Cole-Cole curves to detect SEI layer degradation and micro-dendrite growth.
- **Acoustic Anomaly Detection (DAWN Concept)**: High-frequency piezoelectric monitoring tracking acoustic energy envelope (RMS) to identify mechanical stress, internal micro-cracking, and structural shockwaves.
- **Electrolyte Off-Gas Analysis**: MOX sensor array measuring hydrogen ($H_2$) concentration and rate of rise ($dp/dt$) for early off-gassing detection.
- **Thermodynamic Pack Telemetry**: Cell-by-cell voltage distribution (simulated 16-cell module) and module temperature tracking.

### 2. TinyML Edge Inference
- Temporal Convolutional Network (TCN) evaluating windowed time-series features across normalized multimodal sensor buffers.
- Softmax probability distribution driving a four-level progressive risk ladder:
  - **Level 0 (Normal)**: Nominal background monitoring; standard CAN broadcast.
  - **Level 1 (Anomaly)**: Minor EIS/acoustic deviation; driver warning indicator & 4x diagnostic sample rate.
  - **Level 2 (High Risk)**: Multimodal agreement (EIS + gas); 50% power derating request dispatched to VCU.
  - **Level 3 (Critical)**: Imminent thermal runaway threshold breach; low-voltage demonstrator isolation command dispatched.

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/RONALD-REX-7/QUARTZSENTRY.git
cd QUARTZSENTRY
npm install
```

### Development
Start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will be available at `http://localhost:5173/`.

### Production Build & Type Checking
Compile TypeScript and build the production bundle:
```bash
npm run build
```
Build output will be generated in `dist/`.

### Linting
Run Oxlint code analysis:
```bash
npm run lint
```

### Preview Production Build Locally
```bash
npm run preview
```

---

## Accessibility & Design Standards (WCAG 2.2 AA)

- **Keyboard Navigation**: Full keyboard traversal using <kbd>Tab</kbd>, <kbd>Shift + Tab</kbd>, <kbd>Enter</kbd>, and <kbd>Space</kbd>. Modals and the mobile navigation drawer close on <kbd>Escape</kbd>.
- **Skip Link**: "Skip to main content" link provided as the first focusable element.
- **Contrast Ratios**: Body text, data labels, and interactive button states meet or exceed the 4.5:1 contrast ratio against dark surface backgrounds.
- **Semantic HTML**: Proper heading structure, ARIA landmarks, grid semantics, and screen-reader accessible names.
- **Data Minimization**: Zero cookies, zero local storage, zero external telemetry tracking, and zero personal data collection.

---

## Deployment Configuration

This repository includes native Vercel configuration ([`vercel.json`](./vercel.json)):
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Routing**: Automatic rewrite of subpaths to `/index.html`

---

## Engineering Notice & Academic Disclaimers

1. **Student Prototype**: QUARTZSENTRY is a student engineering proof-of-concept developed by Team METRYPHOR at S.A. Engineering College for academic research and competition demonstration.
2. **Simulated Telemetry**: All sensor waveforms, Nyquist plots, gas ppm values, and risk scores displayed in this web dashboard are client-side synthetic simulations computed in-memory.
3. **No Safety Certification**: This software is **NOT** certified under ISO 26262 (ASIL-A/B/C/D), UL 9540A, or UNECE R100/AIS-156 automotive battery safety regulations.
4. **Low-Voltage Demonstrator Only**: The prototype does not perform high-voltage physical switching and must **never** be used for actual battery protection without certified BMS hardware interlocks.

---

## Institutional Attribution & Contact

- **Institution**: S.A. Engineering College (Autonomous), Poonamallee–Avadi High Road, Thiruverkadu, Chennai 600077, Tamil Nadu, India
- **Team**: METRYPHOR
- **Institutional Contact Placeholder**: `[Department of Electrical & Electronics Engineering / Department of Computer Science & Engineering, S.A. Engineering College — Inquiries: contact@saec.ac.in (To be configured by project owner)]`
- **Licensing Registry**: Complete asset, font, and dependency licensing details are cataloged in [`ASSET_LICENSES.md`](./ASSET_LICENSES.md).
