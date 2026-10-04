import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AuditEvent,
  CellData,
  HistoryBuffers,
  RiskState,
  Signals,
  SimulationState,
  TriggerType,
} from './types';
import { STATES } from './types';

// ─── Constants ────────────────────────────────────────────────────────────────
const NUM_CELLS = 16;
const TARGET_CELL = 7;
const HISTORY_LENGTH = 100;
const TICK_MS = 100;
const MAX_EVENTS = 50;

// ─── Initial state factory ───────────────────────────────────────────────────
function createInitialState(): SimulationState {
  const cells: CellData[] = Array.from({ length: NUM_CELLS }, (_, i) => ({
    id: i,
    v: 4.1,
    t: 32.0,
    isFaulty: false,
  }));

  const history: HistoryBuffers = {
    packV: Array(HISTORY_LENGTH).fill(4.1 * NUM_CELLS),
    temp: Array(HISTORY_LENGTH).fill(32.1),
    eisMag: Array(HISTORY_LENGTH).fill(2.15),
    gas: Array(HISTORY_LENGTH).fill(10),
    micRms: Array(HISTORY_LENGTH).fill(0.05),
    risk: Array(HISTORY_LENGTH).fill(0),
  };

  return {
    time: 0,
    state: STATES.NORMAL,
    confidence: 98.5,
    soc: 85.0,
    packI: 45.2,
    maxTemp: 32.1,
    cells,
    signals: {
      eis_rohm: 2.15,
      eis_rct: 1.02,
      eis_phase: 0.5,
      mic_rms: 0.05,
      mic_score: 0.01,
      gas_h2: 10,
      gas_rate: 0.0,
    },
    fusion: { eis: 0, mic: 0, gas: 0, vit: 0 },
    history,
    events: [
      {
        timestamp: new Date().toISOString().split('T')[1].slice(0, -1),
        signal: 'System Boot',
        state: STATES.NORMAL,
        confidence: 98.5,
        action: 'Monitoring Started',
      },
    ],
    demoMode: false,
    demoTime: 0,
  };
}

// ─── Trigger application ─────────────────────────────────────────────────────
function applyTrigger(
  sim: SimulationState,
  type: TriggerType,
): { state: SimulationState; newEvent: AuditEvent | null } {
  // Reset all cells to non-faulty first
  const cells = sim.cells.map((c) => ({ ...c, isFaulty: false, v: 4.1 }));
  let signals: Signals = { ...sim.signals };
  let riskState: RiskState = sim.state;
  let confidence = sim.confidence;
  let maxTemp = sim.maxTemp;
  let signalStr = '';
  let actionStr = '';
  let changed = false;

  switch (type) {
    case 'NORMAL':
      signals = {
        eis_rohm: 2.15, eis_rct: 1.02, eis_phase: 0.5,
        mic_rms: 0.05, mic_score: 0.01, gas_h2: 10, gas_rate: 0.0,
      };
      confidence = 98.5;
      maxTemp = 32.1;
      if (sim.state.id !== STATES.NORMAL.id) {
        riskState = STATES.NORMAL;
        signalStr = 'System Reset';
        actionStr = 'None';
        changed = true;
      }
      break;

    case 'EIS':
      cells[TARGET_CELL].isFaulty = true;
      signals.eis_rohm = 3.8;
      signals.eis_rct = 0.5;
      signals.eis_phase = -1.2;
      confidence = 65.0;
      if (sim.state.id !== STATES.ANOMALY.id) {
        riskState = STATES.ANOMALY;
        signalStr = 'EIS Abnormality (R_ohm ↑)';
        actionStr = 'Intensified Diagnostics';
        changed = true;
      }
      break;

    case 'ACOUSTIC':
      cells[TARGET_CELL].isFaulty = true;
      signals.mic_rms = 0.85;
      signals.mic_score = 0.92;
      confidence = 70.0;
      if (sim.state.id !== STATES.ANOMALY.id) {
        riskState = STATES.ANOMALY;
        signalStr = 'Acoustic Transient Detected';
        actionStr = 'Intensified Diagnostics';
        changed = true;
      }
      break;

    case 'GAS':
      cells[TARGET_CELL].isFaulty = true;
      signals.gas_rate = 5.5;
      confidence = 85.0;
      if (sim.state.id !== STATES.HIGH_RISK.id) {
        riskState = STATES.HIGH_RISK;
        signalStr = 'Gas H₂ Rapid Rise';
        actionStr = 'Load Derating Request';
        changed = true;
      }
      break;

    case 'MULTI':
    case 'HIGH_RISK':
      cells[TARGET_CELL].isFaulty = true;
      signals.eis_rohm = 4.2;
      signals.mic_rms = 0.9;
      signals.gas_rate = 8.0;
      signals.gas_h2 = 150;
      maxTemp = 45.5;
      confidence = 95.0;
      if (sim.state.id !== STATES.HIGH_RISK.id) {
        riskState = STATES.HIGH_RISK;
        signalStr = 'Multi-Modal Agreement (EIS+Gas+Mic)';
        actionStr = 'Load Derating Request';
        changed = true;
      }
      break;

    case 'CRITICAL':
      cells[TARGET_CELL].isFaulty = true;
      cells[TARGET_CELL].v = 3.2;
      signals.eis_rohm = 8.0;
      signals.mic_rms = 1.5;
      signals.gas_h2 = 800;
      maxTemp = 85.0;
      confidence = 99.9;
      if (sim.state.id !== STATES.CRITICAL.id) {
        riskState = STATES.CRITICAL;
        signalStr = 'Severe Limit Violation / TR Imminent';
        actionStr = 'Critical Isolation Command';
        changed = true;
      }
      break;
  }

  const newEvent: AuditEvent | null = changed
    ? {
        timestamp: new Date().toISOString().split('T')[1].slice(0, -1),
        signal: signalStr,
        state: riskState,
        confidence,
        action: actionStr,
      }
    : null;

  return {
    state: {
      ...sim,
      state: riskState,
      confidence,
      maxTemp,
      cells,
      signals,
      events: newEvent
        ? [newEvent, ...sim.events].slice(0, MAX_EVENTS)
        : sim.events,
    },
    newEvent,
  };
}

// ─── Physics tick ────────────────────────────────────────────────────────────
function tick(sim: SimulationState): SimulationState {
  let { signals, maxTemp, history, fusion } = sim;
  signals = { ...signals };
  history = {
    packV: [...history.packV],
    temp: [...history.temp],
    eisMag: [...history.eisMag],
    gas: [...history.gas],
    micRms: [...history.micRms],
    risk: [...history.risk],
  };

  // Dynamics & noise
  if (sim.state.id >= 1) {
    if (signals.gas_rate > 0) signals.gas_h2 += signals.gas_rate * 0.1;
    if (maxTemp < 120 && sim.state.id >= 2)
      maxTemp += sim.state.id === 3 ? 2.5 : 0.2;
  } else {
    signals.gas_h2 = Math.max(10, signals.gas_h2 - 1.0);
    maxTemp = Math.max(32.1, maxTemp - 0.5);
  }

  // Fusion weights
  fusion = {
    eis: Math.min(1.0, (signals.eis_rohm - 2.15) / 3.0),
    mic: Math.min(1.0, signals.mic_rms / 1.0),
    gas: Math.min(1.0, (signals.gas_h2 - 10) / 200.0),
    vit: Math.min(1.0, (maxTemp - 32) / 40.0),
  };

  // History shift
  history.packV.shift();
  history.packV.push(
    NUM_CELLS * 4.1 + (Math.random() - 0.5) * 0.2 - (sim.state.id === 3 ? 2 : 0),
  );
  history.temp.shift();
  history.temp.push(maxTemp + (Math.random() - 0.5) * 0.5);
  history.eisMag.shift();
  history.eisMag.push(signals.eis_rohm + (Math.random() - 0.5) * 0.1);
  history.gas.shift();
  history.gas.push(signals.gas_h2 + (Math.random() - 0.5) * 2);
  history.micRms.shift();
  history.micRms.push(signals.mic_rms + (Math.random() - 0.5) * 0.01);
  history.risk.shift();
  history.risk.push(sim.state.id);

  return {
    ...sim,
    time: sim.time + 0.1,
    signals,
    maxTemp,
    fusion,
    history,
  };
}

// ─── Demo mode sequencer ─────────────────────────────────────────────────────
function runDemoStep(sim: SimulationState): SimulationState {
  if (!sim.demoMode) return sim;

  const dt = sim.demoTime + 0.1;
  let result = { ...sim, demoTime: dt };

  if (dt > 10 && dt < 10.2 && result.state.id === 0) {
    const r = applyTrigger(result, 'EIS');
    result = r.state;
  }
  if (dt > 25 && dt < 25.2 && result.state.id === 1 && result.signals.gas_rate === 0) {
    const r = applyTrigger(result, 'ACOUSTIC');
    result = r.state;
  }
  if (dt > 40 && dt < 40.2 && result.signals.gas_rate === 0) {
    const r = applyTrigger(result, 'GAS');
    result = r.state;
  }
  if (dt > 55 && dt < 55.2 && result.state.id === 2 && result.maxTemp < 40) {
    const r = applyTrigger(result, 'HIGH_RISK');
    result = r.state;
  }
  if (dt > 70 && dt < 70.2 && result.state.id === 2) {
    const r = applyTrigger(result, 'CRITICAL');
    result = r.state;
  }
  if (dt > 85) {
    const r = applyTrigger(result, 'NORMAL');
    result = { ...r.state, demoMode: false, demoTime: 0 };
  }

  return result;
}

// ─── React Hook ──────────────────────────────────────────────────────────────
export function useSimulation() {
  const [sim, setSim] = useState<SimulationState>(createInitialState);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setSim((prev) => {
        let next = runDemoStep(prev);
        next = tick(next);
        return next;
      });
    }, TICK_MS);

    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, []);

  const trigger = useCallback((type: TriggerType) => {
    setSim((prev) => {
      const updated = { ...prev, demoMode: false, demoTime: 0 };
      return applyTrigger(updated, type).state;
    });
  }, []);

  const reset = useCallback(() => {
    setSim((prev) => {
      const updated = { ...prev, demoMode: false, demoTime: 0 };
      return applyTrigger(updated, 'NORMAL').state;
    });
  }, []);

  const toggleDemo = useCallback(() => {
    setSim((prev) => {
      if (prev.demoMode) {
        return { ...prev, demoMode: false, demoTime: 0 };
      }
      const started = applyTrigger(prev, 'NORMAL').state;
      const evt: AuditEvent = {
        timestamp: new Date().toISOString().split('T')[1].slice(0, -1),
        signal: 'DEMO MODE STARTED',
        state: STATES.NORMAL,
        confidence: 98.5,
        action: 'Sequence Initiated',
      };
      return {
        ...started,
        demoMode: true,
        demoTime: 0,
        events: [evt, ...started.events].slice(0, MAX_EVENTS),
      };
    });
  }, []);

  return { sim, trigger, reset, toggleDemo };
}
