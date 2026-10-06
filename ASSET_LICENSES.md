# Asset & Dependency Licensing Registry — QUARTZSENTRY

**Project License**: QUARTZSENTRY original source code is licensed under the Apache License, Version 2.0. See [`LICENSE`](./LICENSE).

This document provides a comprehensive audit of all fonts, icons, third-party libraries, and graphic assets utilized in the **QUARTZSENTRY** prototype, documenting their identifiable sources, versions, and licenses.

---

## 1. Typography & Web Fonts

| Asset | Source / CDN | Version | License | License URL / Notice | Permissible Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Inter** | Google Fonts CDN (`fonts.googleapis.com`) | Variable (400, 500, 600, 700) | SIL Open Font License 1.1 | [scripts.sil.org/OFL](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL) | Commercial & academic software interface usage permitted. |
| **JetBrains Mono** | Google Fonts CDN (`fonts.googleapis.com`) | Variable (400, 500, 600, 700) | Apache License 2.0 | [apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0) | Permissible for open-source and commercial applications. |

---

## 2. Iconography & Graphical Assets

| Asset / Package | Source | Identifier / Path | License | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Lucide Icons** | NPM package `lucide-react` (v1.50.0) | Bundled React components | ISC / MIT License | Clean open-source icon set; zero telemetry or network calls. |
| **Favicon** | `public/favicon.svg` | Vector SVG shield | Original Project Graphic | Authored for QUARTZSENTRY; CC0 / public domain equivalent. |

---

## 3. Core Software Dependencies

| Dependency | Purpose | Runtime Location | License | Telemetry / Privacy Impact |
| :--- | :--- | :--- | :--- | :--- |
| **React** (19.2.8) | UI rendering library | Client bundle | MIT License | Zero telemetry. |
| **ReactDOM** (19.2.8) | DOM mounting | Client bundle | MIT License | Zero telemetry. |
| **Recharts** (3.10.1) | SVG Telemetry charts | Client bundle | MIT License | Zero telemetry; SVG generated locally in browser. |
| **Vite** (8.3.0) | Frontend dev & build tool | Build-time devDependency | MIT License | Developer tool only; no client footprint. |
| **TypeScript** (6.0.2) | Static type analysis | Build-time devDependency | Apache 2.0 | Developer tool only; no client footprint. |
| **Oxlint** (1.81.0) | High-performance linter | Build-time devDependency | MIT / Apache 2.0 | Developer tool only; no client footprint. |

---

## 4. Privacy & Network Call Audit Summary

- **Zero User Tracking**: No analytics libraries (Google Analytics, Mixpanel, Segment), no social tracking scripts, no session replay tools (Hotjar, FullStory).
- **Single Remote Network Call**: The only external asset loaded over the network is the Google Fonts stylesheet (`@import url('https://fonts.googleapis.com/css2?...')`) in `src/index.css`.
- **Offline / Local Simulation**: All mathematical simulation logic (`simulation.ts`) operates entirely within the user's browser runtime. No sensor signals or simulated pack telemetry are transmitted to any remote backend or API.
