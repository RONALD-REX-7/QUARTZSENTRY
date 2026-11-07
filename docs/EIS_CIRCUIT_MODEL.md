# Electrochemical Impedance Spectroscopy (EIS) Equivalent Circuit Model

**Specification Version:** 1.0.0  
**Target Architecture:** QUARTZSENTRY Battery Health & Thermal Runaway Early Warning System  
**Chemistry Focus:** Li-ion ($LiFePO_4$ / $NMC$ 18650 & 21700 cells)

---

## 1. Randles Equivalent Circuit Topology

The dynamic interface of a lithium-ion cell under alternating small-signal sinusoidal excitation is parameterized using the classical Randles network with Warburg diffusion:

```
          ┌─────── R_ct ─────── [ Z_W ] ───────┐
          │                                    │
─── R_s ──┴─────────────── [ C_dl ] ───────────┴───
```

Where:
- $R_s$: Ohmic bulk series resistance (electrolyte, separator, current collectors, wiring).
- $R_{ct}$: Charge-transfer resistance across the electrode-electrolyte solid-electrolyte interphase (SEI).
- $C_{dl}$: Double-layer capacitance at the porous electrode surface.
- $Z_W$: Generalized Warburg impedance characterizing solid-state lithium-ion semi-infinite linear diffusion.

---

## 2. Mathematical Impedance Transfer Function

The complex impedance $Z(\omega)$ as a function of angular frequency $\omega = 2\pi f$ is:

$$Z(\omega) = R_s + \frac{R_{ct} + Z_W(\omega)}{1 + j\omega C_{dl}(R_{ct} + Z_W(\omega))}$$

The semi-infinite Warburg element frequency response:

$$Z_W(\omega) = \frac{\sigma}{\sqrt{\omega}} (1 - j) = \frac{\sigma}{\sqrt{\omega}} - j \frac{\sigma}{\sqrt{\omega}}$$

Where $\sigma$ is the Warburg coefficient ($\Omega\cdot\text{s}^{-0.5}$).

---

## 3. Nyquist Impedance Signature & Thermal Runaway Drift

In a pristine Li-ion cell at $25^\circ\text{C}$:
- $R_s \approx 15\,\text{m}\Omega - 25\,\text{m}\Omega$
- $R_{ct} \approx 30\,\text{m}\Omega - 50\,\text{m}\Omega$

### Pre-Runaway Degradation Signature ($T > 60^\circ\text{C}$):
1. **SEI Decomposition Phase**: $R_{ct}$ contracts transiently as kinetic barrier thins, followed by sharp spike as resistive decomposition byproducts precipitate.
2. **Internal Short Formation**: Nyquist mid-frequency arc radius collapses by $> 40\%$ within $120\,\text{s}$ prior to thermal excursion.
3. **Trigger Threshold**: When $\frac{\Delta R_{ct}}{\Delta t} > 15\,\text{m}\Omega/\text{min}$, QUARTZSENTRY asserts Level 3 Emergency Disconnect.
