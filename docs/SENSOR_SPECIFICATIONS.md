# QUARTZSENTRY — Multi-Modal Precursor Sensing Specification

**Application Domain:** Battery Energy Storage Systems (BESS) & Lithium-Ion Safety  
**Implementation Stage:** Stage 2 (`Implemented in software` / Synthetic Telemetry Demonstrator)  
**Status Lifecycle:** Prototype Evaluation & Telemetry Visualization

---

## 1. Overview & Multi-Modal Detection Philosophy

Catastrophic thermal runaway in lithium-ion battery cells is preceded by distinct multi-physical warning indicators occurring across four sequential operational regimes:

```
[Phase 1: Electrochemical] ──> [Phase 2: Mechanical / Micro-Cracking] ──> [Phase 3: Off-Gas Venting] ──> [Phase 4: Thermal Escalation]
   EIS Impedance Shift             Acoustic Emission (AE) Burst             Volatile VOC Off-Gas              Rapid dT/dt Rise
```

QUARTZSENTRY monitors four multi-modal sensing channels to demonstrate early anomaly detection prior to irrevocable thermal runaway.

---

## 2. Sensor Channel Specifications

### 2.1 Core Temperature ($T_{\text{core}}$) & Thermal Gradient
- **Sensor Type**: NTC Thermistor matrix / Digital temperature transducer.
- **Sampling Frequency**: $10\text{ Hz}$.
- **Measurement Range**: $-20^\circ\text{C}$ to $+120^\circ\text{C}$ ($\pm 0.5^\circ\text{C}$ accuracy).
- **Early Warning Threshold**: $T \ge 60^\circ\text{C}$ OR rate of rise $\frac{dT}{dt} \ge 1.5^\circ\text{C/min}$.
- **Critical Threshold**: $T \ge 80^\circ\text{C}$ (instantaneous safety interlock trigger).

### 2.2 Electrochemical Impedance Spectroscopy (EIS)
- **Signal Frequency**: Multi-sine perturbation ($100\text{ Hz} - 10\text{ kHz}$).
- **Monitored Parameter**: Charge-transfer resistance ($R_{\text{ct}}$) and Solid Electrolyte Interphase (SEI) impedance.
- **Indication**: An anomalous drop or abrupt upward shift in $R_{\text{ct}}$ signifies internal dendritic growth, separator micro-puncture, or accelerated SEI layer decomposition.

### 2.3 Acoustic Emission ($AE$)
- **Sensor Type**: Piezoelectric acoustic emission transducer ($100\text{ kHz} - 1\text{ MHz}$ bandpass).
- **Sampling Mode**: Envelope detection and hit-rate counting.
- **Indication**: High-frequency acoustic bursts indicate micro-cracking of electrode coatings, cathode lattice degradation, or internal gas bubble nucleation prior to external cell swelling.

### 2.4 Off-Gas Volatile Organic Compound (VOC) Detection
- **Sensor Type**: Micro-machined Metal Oxide Semiconductor (MOX) gas sensor array.
- **Target Chemical Species**: Dimethyl Carbonate (DMC), Ethyl Methyl Carbonate (EMC), Diethyl Carbonate (DEC), and hydrogen gas ($H_2$).
- **Detection Limit**: $1 - 1,000\text{ ppm}$.
- **Significance**: Early cell venting releases electrolyte solvent vapors $60 - 300\text{ seconds}$ before thermal runaway occurs, providing the earliest actionable physical alert.

---

## 3. Evidence & Simulation Disclosure

> [!IMPORTANT]
> **Synthetic Demonstrator Classification:**
> - The current implementation of QUARTZSENTRY is a **software demonstrator** with synthetic telemetry waveforms.
> - Transducer analog front-ends (AFEs) and physical battery test chamber connections have **not** been physically integrated or bench-tested.
> - This software must not be employed as an operational Battery Management System (BMS) or life-safety fire protection control.
