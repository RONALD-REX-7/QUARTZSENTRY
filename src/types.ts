// ─── Risk State Definitions ───────────────────────────────────────────────────
export interface RiskState {
  id: number;
  text: string;
  cssVar: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export const STATES: Record<string, RiskState> = {
  NORMAL:    { id: 0, text: 'NORMAL',    cssVar: '--state-normal',    severity: 'Low' },
  ANOMALY:   { id: 1, text: 'ANOMALY',   cssVar: '--state-anomaly',   severity: 'Medium' },
  HIGH_RISK: { id: 2, text: 'HIGH RISK', cssVar: '--state-high-risk', severity: 'High' },
  CRITICAL:  { id: 3, text: 'CRITICAL',  cssVar: '--state-critical',  severity: 'Critical' },
} as const;

/** Canonical state-to-hex color map — single source of truth (audit #9) */
export const STATE_COLORS: Record<number, string> = {
  0: '#22c55e',
  1: '#eab308',
  2: '#f97316',
  3: '#ef4444',
};

/** State-id to CSS class for the status dot */
export const STATE_DOT_CLASS: Record<number, string> = {
  0: 'normal',
  1: 'anomaly',
  2: 'high-risk',
  3: 'critical',
};

/** Shared Recharts tooltip content style — single source of truth (audit #8) */
export const CHART_TOOLTIP_STYLE: React.CSSProperties = {
  background: '#1a1f2c',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 6,
  fontSize: 11,
  fontFamily: "'JetBrains Mono', monospace",
  color: '#e2e8f0',
};

/** Shared Recharts axis tick props — #8fa0b5 for WCAG AA 4.5:1+ contrast on dark surfaces */
export const CHART_AXIS_TICK = { fontSize: 10, fill: '#8fa0b5' };

// ─── Cell Telemetry ───────────────────────────────────────────────────────────
export interface CellData {
  id: number;
  v: number;
  t: number;
  isFaulty: boolean;
}

// ─── Signal Readings ──────────────────────────────────────────────────────────
export interface Signals {
  eis_rohm: number;
  eis_rct: number;
  eis_phase: number;
  mic_rms: number;
  mic_score: number;
  gas_h2: number;
  gas_rate: number;
}

// ─── Sensor Fusion Weights ────────────────────────────────────────────────────
export interface FusionWeights {
  eis: number;
  mic: number;
  gas: number;
  vit: number;
}

// ─── Historical Data Buffers ──────────────────────────────────────────────────
export interface HistoryBuffers {
  packV: number[];
  temp: number[];
  eisMag: number[];
  gas: number[];
  micRms: number[];
  risk: number[];
}

// ─── Audit Event ──────────────────────────────────────────────────────────────
export interface AuditEvent {
  timestamp: string;
  signal: string;
  state: RiskState;
  confidence: number;
  action: string;
}

// ─── Complete Simulation State ────────────────────────────────────────────────
export interface SimulationState {
  time: number;
  state: RiskState;
  confidence: number;
  soc: number;
  packI: number;
  maxTemp: number;
  cells: CellData[];
  signals: Signals;
  fusion: FusionWeights;
  history: HistoryBuffers;
  events: AuditEvent[];
  demoMode: boolean;
  demoTime: number;
}

// ─── Trigger Types ────────────────────────────────────────────────────────────
export type TriggerType =
  | 'NORMAL'
  | 'EIS'
  | 'ACOUSTIC'
  | 'GAS'
  | 'MULTI'
  | 'HIGH_RISK'
  | 'CRITICAL';

// ─── View Identifiers ─────────────────────────────────────────────────────────
export type ViewId =
  | 'overview'
  | 'fusion'
  | 'eis'
  | 'acoustic'
  | 'gas'
  | 'ai'
  | 'safety'
  | 'events'
  | 'health'
  | 'arch'
  | 'privacy'
  | 'terms';

// ─── Verified Project Metadata ───────────────────────────────────────────────
export const PROJECT_METADATA = {
  name: 'QUARTZSENTRY',
  subtitle: 'Thermal Runaway Shield',
  team: 'METRYPHOR',
  institution: 'S.A. Engineering College (Autonomous)',
  location: 'Poonamallee–Avadi High Road, Thiruverkadu, Chennai 600077, Tamil Nadu, India',
  nature: 'Student Engineering Prototype & Demonstrator',
  academicNotice:
    'Academic research demonstrator for early thermal runaway prediction. Not a commercially certified automotive safety product.',
  contactPlaceholder:
    '[Institutional / Team Contact Placeholder: Department of Electrical & Electronics Engineering / Department of Computer Science & Engineering, S.A. Engineering College — Inquiries: contact@saec.ac.in (To be configured by project owner)]',
  repositoryNotice: 'Open academic prototype codebase developed for competition and engineering demonstration.',
} as const;


