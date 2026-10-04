import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';
import type { SimulationState, TriggerType } from './types';
import {
  STATE_COLORS,
  CHART_TOOLTIP_STYLE,
  CHART_AXIS_TICK,
  PROJECT_METADATA,
} from './types';
import {
  ChevronRight,
  ArrowRight,
  Inbox,
  ArrowLeft,
  Shield,
  Lock,
  FileCheck,
  Info,
} from 'lucide-react';

function stateColor(id: number): string {
  return STATE_COLORS[id] ?? '#22c55e';
}

function getSeverityBadgeClass(id: number): string {
  switch (id) {
    case 0: return 'badge-low';
    case 1: return 'badge-medium';
    case 2: return 'badge-high';
    case 3: return 'badge-critical';
    default: return 'badge-low';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   OVERVIEW VIEW
   ═══════════════════════════════════════════════════════════════════════════ */
export function OverviewView({
  sim,
  trigger,
}: {
  sim: SimulationState;
  trigger: (t: TriggerType) => void;
}) {
  const color = stateColor(sim.state.id);

  // Memoize chart data to avoid GC pressure on 100ms ticks (audit #17)
  const tempData = useMemo(
    () => sim.history.temp.map((v, i) => ({ i, value: v })),
    [sim.history.temp]
  );

  return (
    <div className="view-enter">
      {/* Edge Intelligence Pipeline */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Edge Intelligence Data Pipeline</span>
          <span className="text-xs text-muted mono">End-to-End Processing Chain</span>
        </div>
        <div className="pipeline">
          {[
            { label: 'Sensors', sub: 'V, I, T, Gas, Mic' },
            { label: 'Signal Conditioning', sub: 'AFE & Filtering' },
            { label: 'Feature Extraction', sub: 'Impedance, RMS' },
            { label: 'Edge Intelligence', sub: 'TinyML / TCN' },
            { label: 'Multimodal Fusion', sub: 'Kalman / Bayesian' },
            { label: 'Risk Assessment', sub: '4-State Ladder' },
            { label: 'Safety Response', sub: 'Derate / LV Relay' },
          ].map((node, i, arr) => (
            <div key={i} className="pipeline-step">
              <div className="pipeline-node">
                {node.label}
                {node.sub && <div className="pipeline-node-sub">{node.sub}</div>}
              </div>
              {i < arr.length - 1 && (
                <div className="pipeline-arrow" aria-hidden="true">
                  <ChevronRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2-1">
        {/* Left column */}
        <div>
          {/* Battery pack visualization with cell tooltips (audit #12) */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Battery Pack Visualization (Simulated 16-Cell Module)</span>
              <span className="text-xs text-muted mono">Target Cell: C8</span>
            </div>
            <div className="battery-grid" role="grid" aria-label="16-cell battery module telemetry">
              {sim.cells.map((c) => {
                const cellTooltip = `Cell C${c.id + 1}: ${c.v.toFixed(2)}V, ${c.t.toFixed(1)}°C — ${
                  c.isFaulty ? 'FAULT DETECTED (Impedance Anomaly)' : 'Nominal'
                }`;
                return (
                  <div
                    key={c.id}
                    role="gridcell"
                    tabIndex={0}
                    title={cellTooltip}
                    aria-label={cellTooltip}
                    className={`cell-block${c.isFaulty ? ' faulty' : ' normal'}`}
                    style={c.isFaulty ? { backgroundColor: color } : undefined}
                  >
                    <span>C{c.id + 1}</span>
                    <span className="cell-voltage">{c.v.toFixed(2)}V</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Temperature chart with shared tooltip style (audit #8) */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Real-Time Pack Telemetry</span>
              <span className="text-xs text-muted mono">Max Temp (°C) / Historical Buffer</span>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={tempData} margin={{ top: 4, right: 6, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="i" tick={false} />
                  <YAxis domain={[20, 100]} tick={CHART_AXIS_TICK} />
                  <Tooltip
                    contentStyle={CHART_TOOLTIP_STYLE}
                    labelFormatter={() => ''}
                    formatter={(val: any) => [`${Number(val).toFixed(1)} °C`, 'Max Temp']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    fill={color}
                    fillOpacity={0.14}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Status cards */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Pack Operational Health</span>
            </div>
            <div className="grid-2 gap-3">
              <div className="tel-item">
                <div className="tel-label">AI Confidence</div>
                <div className="tel-value">{sim.confidence.toFixed(1)}%</div>
              </div>
              <div className="tel-item">
                <div className="tel-label">Battery SOC</div>
                <div className="tel-value">{sim.soc.toFixed(1)}%</div>
              </div>
              <div className="tel-item">
                <div className="tel-label">Max Temp</div>
                <div
                  className="tel-value"
                  style={{ color: sim.maxTemp > 50 ? '#f97316' : undefined }}
                >
                  {sim.maxTemp.toFixed(1)} °C
                </div>
              </div>
              <div className="tel-item">
                <div className="tel-label">Pack Current</div>
                <div className="tel-value">{sim.packI.toFixed(1)} A</div>
              </div>
            </div>
          </div>

          {/* Fault injection simulation controls */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Fault Injection Controls</span>
            </div>
            <p className="card-subtitle">
              Inject synthetic anomalies to evaluate multi-sensor fusion and safety response latency.
            </p>
            <div className="flex-col gap-2">
              <button className="control-btn" onClick={() => trigger('NORMAL')}>
                <span>Nominal Operation</span>
                <span>✓</span>
              </button>
              <button className="control-btn" onClick={() => trigger('EIS')}>
                <span>Electrochemical Anomaly (GD-EIS)</span>
                <span>⚡</span>
              </button>
              <button className="control-btn" onClick={() => trigger('ACOUSTIC')}>
                <span>Acoustic Transient (DAWN)</span>
                <span>🔊</span>
              </button>
              <button className="control-btn" onClick={() => trigger('GAS')}>
                <span>Gas Outgassing (H₂ / VOC)</span>
                <span>☁️</span>
              </button>
              <button className="control-btn" onClick={() => trigger('MULTI')}>
                <span>Multi-Sensor Agreement</span>
                <span>⚠️</span>
              </button>
              <button className="control-btn" onClick={() => trigger('HIGH_RISK')}>
                <span>Escalate to High Risk</span>
                <span>🔥</span>
              </button>
              <button className="control-btn danger" onClick={() => trigger('CRITICAL')}>
                <span>Trigger Critical State</span>
                <span>🛑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SENSOR FUSION VIEW
   ═══════════════════════════════════════════════════════════════════════════ */
export function FusionView({ sim }: { sim: SimulationState }) {
  function level(val: number): string {
    return val > 0.7 ? 'High' : val > 0.3 ? 'Medium' : 'Low';
  }
  function levelColor(val: number): string {
    return val > 0.7 ? '#ef4444' : val > 0.3 ? '#eab308' : '#22c55e';
  }

  const barData = [
    { name: 'EIS (Electrochemical)', value: sim.fusion.eis, weight: '0.35' },
    { name: 'MIC (Acoustic)', value: sim.fusion.mic, weight: '0.25' },
    { name: 'GAS (H₂/VOC)', value: sim.fusion.gas, weight: '0.30' },
    { name: 'V/I/T (Thermodynamic)', value: sim.fusion.vit, weight: '0.10' },
  ];

  return (
    <div className="view-enter">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Multimodal Fusion Engine</span>
          <span className="text-xs text-muted mono">Bayesian / Weighted Contribution</span>
        </div>
        <p className="card-subtitle">
          Combines independent sensor streams to calculate consolidated risk severity and statistical confidence.
        </p>
        <div className="grid-4">
          {barData.map((item) => (
            <div className="tel-item" key={item.name}>
              <div className="tel-label">{item.name}</div>
              <div className="tel-value compact" style={{ color: levelColor(item.value) }}>
                {level(item.value)}
              </div>
              <div className="tel-sub">Weight: {item.weight} | Score: {item.value.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Severity-encoded bar chart (audit #21) */}
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 12, right: 16, bottom: 8, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={CHART_AXIS_TICK} />
              <YAxis domain={[0, 1]} tick={CHART_AXIS_TICK} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(val: any) => [Number(val).toFixed(2), 'Anomaly Weight']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={levelColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EIS DIAGNOSTICS VIEW — audit #24: includes Nyquist plot & impedance trend
   ═══════════════════════════════════════════════════════════════════════════ */
export function EISView({ sim }: { sim: SimulationState }) {
  const eisData = useMemo(
    () => sim.history.eisMag.map((v, i) => ({ i, value: v })),
    [sim.history.eisMag]
  );

  // Generate synthetic Nyquist spectrum points for Lithium-ion cell Cole-Cole curve
  const nyquistData = useMemo(() => {
    const rOhm = sim.signals.eis_rohm;
    const rCt = sim.signals.eis_rct;
    const nominalROhm = 2.15;
    const nominalRCt = 1.02;

    const points = [];
    const fMin = 0.1;
    const fMax = 2000;
    const steps = 18;
    const tau = 0.0016; // characteristic relaxation time (~100 Hz apex)

    for (let i = 0; i <= steps; i++) {
      const logF = Math.log10(fMin) + (i / steps) * (Math.log10(fMax) - Math.log10(fMin));
      const f = Math.pow(10, logF);
      const w = 2 * Math.PI * f;
      const wTau = w * tau;
      const denom = 1 + wTau * wTau;

      // Active scan values
      const zReActive = Number((rOhm + rCt / denom + (f < 5 ? 0.3 / Math.sqrt(f) : 0)).toFixed(2));
      const negZImActive = Number(((rCt * wTau) / denom + (f < 5 ? 0.15 / Math.sqrt(f) : 0)).toFixed(2));

      // Nominal baseline values for comparison
      const zReBase = Number((nominalROhm + nominalRCt / denom + (f < 5 ? 0.3 / Math.sqrt(f) : 0)).toFixed(2));
      const negZImBase = Number(((nominalRCt * wTau) / denom + (f < 5 ? 0.15 / Math.sqrt(f) : 0)).toFixed(2));

      points.push({
        freq: Math.round(f),
        zReal: zReActive,
        negZImag: negZImActive,
        baselineZReal: zReBase,
        baselineNegZImag: negZImBase,
      });
    }
    return points.sort((a, b) => a.zReal - b.zReal);
  }, [sim.signals.eis_rohm, sim.signals.eis_rct]);

  const isAnomalous = sim.state.id > 0;
  const activeColor = isAnomalous ? '#f97316' : '#6366f1';

  return (
    <div className="view-enter">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Galvanostatic Dynamic EIS Diagnostics</span>
          <span className="text-xs text-muted mono">AD5933 AFE Frontend Concept</span>
        </div>
        <p className="card-subtitle">
          Electrochemical Impedance Spectroscopy (EIS) sensing concept designed to track indicators of internal cell degradation, SEI layer shifts, and micro-dendrite growth.
        </p>

        {/* Diagnostic Telemetry Summary */}
        <div className="grid-4 mb-3">
          <div className="tel-item">
            <div className="tel-label">Ohmic Resistance (R_ohm)</div>
            <div className="tel-value" style={{ color: sim.signals.eis_rohm > 3.0 ? '#ef4444' : undefined }}>
              {sim.signals.eis_rohm.toFixed(2)} mΩ
            </div>
            <div className="tel-sub">Baseline: 2.15 mΩ</div>
          </div>
          <div className="tel-item">
            <div className="tel-label">Charge Transfer (R_ct)</div>
            <div className="tel-value" style={{ color: sim.signals.eis_rct > 2.0 ? '#f97316' : undefined }}>
              {sim.signals.eis_rct.toFixed(2)} mΩ
            </div>
            <div className="tel-sub">Baseline: 1.02 mΩ</div>
          </div>
          <div className="tel-item">
            <div className="tel-label">Phase Shift (1 kHz)</div>
            <div className="tel-value">{sim.signals.eis_phase.toFixed(1)}°</div>
            <div className="tel-sub">Nominal: 0.5°</div>
          </div>
          <div className="tel-item">
            <div className="tel-label">SEI Layer Condition</div>
            <div
              className="tel-value compact"
              style={{ color: isAnomalous ? '#f97316' : '#22c55e' }}
            >
              {isAnomalous ? 'DEGRADATION DETECTED' : 'HEALTHY / NOMINAL'}
            </div>
            <div className="tel-sub">Target resolution: Sub-milliohm (simulated)</div>
          </div>
        </div>

        {/* Dual Chart: Nyquist Plot + Time-Domain Impedance */}
        <div className="grid-2">
          {/* Nyquist Plot */}
          <div>
            <div className="card-header" style={{ marginBottom: 4 }}>
              <span className="card-title">Nyquist Spectrum (Cole-Cole Curve)</span>
              <span className="text-xs text-muted mono">Z' vs -Z'' (mΩ)</span>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={nyquistData} margin={{ top: 8, right: 12, bottom: 4, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="zReal"
                    domain={[1.5, 'auto']}
                    tick={CHART_AXIS_TICK}
                    label={{ value: "Z' Real (mΩ)", position: 'insideBottomRight', offset: -4, fill: '#7b8ca0', fontSize: 9 }}
                  />
                  <YAxis
                    domain={[0, 'auto']}
                    tick={CHART_AXIS_TICK}
                    label={{ value: "-Z'' Imag (mΩ)", angle: -90, position: 'insideLeft', fill: '#7b8ca0', fontSize: 9 }}
                  />
                  <Tooltip
                    contentStyle={CHART_TOOLTIP_STYLE}
                    formatter={(val: any) => [`${val} mΩ`, 'Impedance']}
                    labelFormatter={(label) => `Z' Real: ${label} mΩ`}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
                  <Line
                    type="monotone"
                    name="Current Active Scan"
                    dataKey="negZImag"
                    stroke={activeColor}
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: activeColor }}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    name="Nominal Baseline"
                    dataKey="baselineNegZImag"
                    stroke="#5b6478"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time-Domain Impedance Trend */}
          <div>
            <div className="card-header" style={{ marginBottom: 4 }}>
              <span className="card-title">Impedance Trend (|Z| Over Time)</span>
              <span className="text-xs text-muted mono">Buffer: 100 Samples</span>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={eisData} margin={{ top: 8, right: 12, bottom: 4, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="i" tick={false} />
                  <YAxis domain={[1, 10]} tick={CHART_AXIS_TICK} />
                  <Tooltip
                    contentStyle={CHART_TOOLTIP_STYLE}
                    labelFormatter={() => ''}
                    formatter={(val: any) => [`${Number(val).toFixed(2)} mΩ`, '|Z| Magnitude']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={activeColor}
                    fill={activeColor}
                    fillOpacity={0.12}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACOUSTIC ANALYSIS VIEW
   ═══════════════════════════════════════════════════════════════════════════ */
export function AcousticView({ sim }: { sim: SimulationState }) {
  const micData = useMemo(
    () => sim.history.micRms.map((v, i) => ({ i, value: v })),
    [sim.history.micRms]
  );

  return (
    <div className="view-enter">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Acoustic Anomaly Detection (DAWN Concept)</span>
          <span className="text-xs text-muted mono">Piezoelectric / Ultrasound Emission</span>
        </div>
        <p className="card-subtitle">
          Investigative sensing concept designed to detect acoustic emissions from mechanical stress, micro-cracking, and venting precursors prior to rapid thermal escalation.
        </p>
        <div className="grid-2-1">
          <div>
            <div className="tel-label">Waveform Energy Envelope (RMS)</div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={micData} margin={{ top: 4, right: 6, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="i" tick={false} />
                  <YAxis domain={[0, 1.5]} tick={CHART_AXIS_TICK} />
                  <Tooltip
                    contentStyle={CHART_TOOLTIP_STYLE}
                    labelFormatter={() => ''}
                    formatter={(val: any) => [`${Number(val).toFixed(3)} V`, 'Acoustic RMS']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.12}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex-col gap-3">
            <div className="tel-item">
              <div className="tel-label">RMS Energy Level</div>
              <div className="tel-value">{sim.signals.mic_rms.toFixed(3)} V</div>
              <div className="tel-sub">Baseline: 0.050 V</div>
            </div>
            <div className="tel-item">
              <div className="tel-label">Dominant Frequency</div>
              <div className="tel-value">
                {(450 + sim.signals.mic_score * 1000).toFixed(0)} Hz
              </div>
              <div className="tel-sub">Structural resonance window</div>
            </div>
            <div className="tel-item">
              <div className="tel-label">Acoustic Anomaly Score</div>
              <div
                className="tel-value"
                style={{ color: sim.signals.mic_score > 0.5 ? '#f97316' : undefined }}
              >
                {sim.signals.mic_score.toFixed(2)}
              </div>
              <div className="tel-sub">Threshold: 0.50 (Trigger)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GAS ANALYSIS VIEW
   ═══════════════════════════════════════════════════════════════════════════ */
export function GasView({ sim }: { sim: SimulationState }) {
  const gasData = useMemo(
    () => sim.history.gas.map((v, i) => ({ i, value: v })),
    [sim.history.gas]
  );

  return (
    <div className="view-enter">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Electrolyte Off-Gas Analysis (H₂ / VOC)</span>
          <span className="text-xs text-muted mono">Pre-Thermal Venting Detection</span>
        </div>
        <p className="card-subtitle">
          Monitors simulated hydrogen gas concentration and rate-of-rise as an exploratory indicator of early electrolyte outgassing.
        </p>
        <div className="grid-2-1">
          <div>
            <div className="tel-label">Gas Concentration History (ppm)</div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={gasData} margin={{ top: 4, right: 6, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="i" tick={false} />
                  <YAxis domain={[0, 800]} tick={CHART_AXIS_TICK} />
                  <Tooltip
                    contentStyle={CHART_TOOLTIP_STYLE}
                    labelFormatter={() => ''}
                    formatter={(val: any) => [`${Number(val).toFixed(1)} ppm`, 'H₂ Level']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.12}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex-col gap-3">
            <div className="tel-item">
              <div className="tel-label">Simulated H₂ Concentration</div>
              <div
                className="tel-value"
                style={{ color: sim.signals.gas_h2 > 100 ? '#f97316' : undefined }}
              >
                {sim.signals.gas_h2.toFixed(1)} ppm
              </div>
              <div className="tel-sub">Baseline: ~10 ppm</div>
            </div>
            <div className="tel-item">
              <div className="tel-label">Rate of Rise (dp/dt)</div>
              <div className="tel-value">{sim.signals.gas_rate.toFixed(2)} ppm/s</div>
              <div className="tel-sub">Warning threshold: &gt; 2.0 ppm/s</div>
            </div>
            <div className="tel-item">
              <div className="tel-label">Cross-Sensitivity Status</div>
              <div className="tel-value compact">
                {sim.signals.gas_h2 > 50 ? 'ELEVATED GAS DETECTED' : 'LOW (BACKGROUND NOISE)'}
              </div>
              <div className="tel-sub">Compensation filter active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AI RISK ENGINE VIEW
   ═══════════════════════════════════════════════════════════════════════════ */
export function AIView({ sim }: { sim: SimulationState }) {
  const probs = [
    { name: 'Normal', value: sim.state.id === 0 ? 0.98 : 0.05, color: '#22c55e' },
    { name: 'Anomaly', value: sim.state.id === 1 ? 0.85 : 0.1, color: '#eab308' },
    { name: 'High Risk', value: sim.state.id === 2 ? 0.9 : sim.state.id > 2 ? 0.2 : 0.02, color: '#f97316' },
    { name: 'Critical', value: sim.state.id === 3 ? 0.99 : 0.01, color: '#ef4444' },
  ];

  return (
    <div className="view-enter">
      <div className="card">
        <div className="card-header">
          <span className="card-title">AI Edge Inference Pipeline</span>
          <span className="text-xs text-muted mono">Temporal Convolutional Network (TCN)</span>
        </div>
        <p className="card-subtitle">
          Proposed on-device TinyML classification pipeline designed to evaluate windowed time-series features across simulated multimodal sensor inputs.
        </p>

        {/* Model Pipeline Steps */}
        <div className="grid-5 mb-3">
          {[
            { step: '01', label: 'Signal Normalization', sub: 'StandardScaler' },
            { step: '02', label: 'Temporal Windowing', sub: '256-sample buffer' },
            { step: '03', label: 'Lightweight TCN', sub: 'Dilated causal conv' },
            { step: '04', label: 'Ensemble Fusion', sub: 'Multimodal weights' },
            { step: '05', label: 'State Probability', sub: 'Softmax output' },
          ].map((n, i) => (
            <div
              key={i}
              className="arch-box"
              style={i === 2 ? { borderColor: 'var(--accent-primary)', borderWidth: 2 } : undefined}
            >
              <div className="text-xs text-muted mono">{n.step}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{n.label}</div>
              <div className="text-xs text-muted" style={{ marginTop: 2 }}>{n.sub}</div>
            </div>
          ))}
        </div>

        <div className="card-header" style={{ marginTop: 16 }}>
          <span className="card-title">Predicted Risk State Probability Distribution</span>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={probs} margin={{ top: 8, right: 16, bottom: 4, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={CHART_AXIS_TICK} />
              <YAxis domain={[0, 1]} tick={CHART_AXIS_TICK} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(val: any) => [`${(Number(val) * 100).toFixed(1)}%`, 'Confidence']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {probs.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SAFETY RESPONSE VIEW — audit #4, #15: replaced alert() with showToast
   ═══════════════════════════════════════════════════════════════════════════ */
export function SafetyView({
  sim,
  showToast,
}: {
  sim: SimulationState;
  showToast?: (msg: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
}) {
  const levels = [
    {
      num: 0,
      title: 'Level 0: Baseline Nominal Monitoring',
      desc: 'Continuous background sampling of Cell Voltages, Current, Temperature, EIS, Acoustic, and Gas.',
      action: 'Safety Action: No active intervention required. Standard CAN broadcast.',
      actionClass: '',
    },
    {
      num: 1,
      title: 'Level 1: Anomaly Alert & Intensified Diagnostics',
      desc: 'Triggered by minor EIS deviation or acoustic transient. Potential early dendrite or SEI degradation.',
      action: 'Safety Action: Broadcast Driver Warning Indicator, increase EIS sample rate 4x.',
      actionClass: '',
    },
    {
      num: 2,
      title: 'Level 2: High-Risk Charge / Discharge Derating',
      desc: 'Triggered by multi-modal agreement (e.g. EIS anomaly confirmed by early gas outgassing).',
      action: 'Safety Action: Request 50% power derate to VCU, trigger maximum battery thermal cooling.',
      actionClass: 'text-warning',
    },
    {
      num: 3,
      title: 'Level 3: Critical Low-Voltage Isolation Command',
      desc: 'Triggered by severe multi-sensor threshold breach confirming imminent thermal event.',
      action: 'Safety Action: Issue high-priority isolation request to low-voltage safety relay & notify driver.',
      actionClass: 'text-danger',
    },
  ];

  return (
    <div className="view-enter">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Four-Level Safety Response Ladder</span>
          <span className="text-xs text-muted mono">Intervention Protocol</span>
        </div>
        <p className="card-subtitle text-warning" style={{ fontWeight: 600 }}>
          LOW-VOLTAGE DEMONSTRATOR ONLY — NO DIRECT HIGH-VOLTAGE SWITCHING IN PROTOTYPE.
        </p>

        {levels.map((l) => (
          <div
            key={l.num}
            className={`ladder-step${sim.state.id === l.num ? ' active' : ''}`}
            role="region"
            aria-label={l.title}
          >
            <div className="ladder-num">{l.num}</div>
            <div>
              <div className="ladder-title">{l.title}</div>
              <div className="ladder-desc">{l.desc}</div>
              <div className={`ladder-action ${l.actionClass}`}>{l.action}</div>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
          <button
            className="btn"
            onClick={() => {
              showToast?.(
                'Manual Derating Command dispatched to Vehicle Control Unit (VCU) via CAN-TWAI',
                'warning'
              );
            }}
          >
            Manual Derate Request
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              showToast?.(
                'Manual Emergency Isolation Command sent to Low-Voltage Demonstrator Relay',
                'danger'
              );
            }}
          >
            Manual Isolate Request
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EVENTS & AUDIT LOG VIEW — audit #13: empty state support
   ═══════════════════════════════════════════════════════════════════════════ */
export function EventsView({ sim }: { sim: SimulationState }) {
  return (
    <div className="view-enter">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Safety Events & Audit Trail</span>
          <span className="text-xs text-muted mono">{sim.events.length} entries recorded</span>
        </div>

        {sim.events.length === 0 ? (
          <div className="empty-state">
            <Inbox size={28} />
            <p>No safety events logged yet.</p>
            <span className="text-xs text-muted">
              System is operating within nominal thresholds. Use simulation controls to inject faults.
            </span>
          </div>
        ) : (
          <div style={{ overflowY: 'auto', maxHeight: 440 }}>
            <table className="log-table" aria-label="Simulation audit event log">
              <thead>
                <tr>
                  <th scope="col">Timestamp</th>
                  <th scope="col">Signal Detected</th>
                  <th scope="col">Severity</th>
                  <th scope="col">Confidence</th>
                  <th scope="col">Risk State</th>
                  <th scope="col">Action Taken</th>
                </tr>
              </thead>
              <tbody>
                {sim.events.map((evt, i) => (
                  <tr key={`${evt.timestamp}-${i}`}>
                    <td>{evt.timestamp}</td>
                    <td>{evt.signal}</td>
                    <td>
                      <span className={`badge ${getSeverityBadgeClass(evt.state.id)}`}>
                        {evt.state.severity}
                      </span>
                    </td>
                    <td>{evt.confidence.toFixed(1)}%</td>
                    <td style={{ color: stateColor(evt.state.id), fontWeight: 600 }}>
                      {evt.state.text}
                    </td>
                    <td>{evt.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SYSTEM HEALTH VIEW
   ═══════════════════════════════════════════════════════════════════════════ */
export function HealthView() {
  const items = [
    { label: 'Core Microcontroller Target', value: 'TARGET (ESP32-S3 Dual-Core)', online: true },
    { label: 'Hardware Watchdog Design', value: 'ACTIVE / FED (Simulated)', online: true },
    { label: 'Vehicle Bus Comm Spec', value: 'TWAI / Classical CAN (250 kbps)', online: true },
    { label: 'Sensor AFE Frontend Spec', value: 'AD5933 Concept (Simulated)', online: true },
    { label: 'Acoustic Sensor Interface', value: 'Piezo AFE In-Spec (Simulated)', online: true },
    { label: 'Gas Sensor Interface', value: 'MOX Gas Sensor Array (Simulated)', online: true },
  ];

  return (
    <div className="view-enter">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Embedded System Health Telemetry</span>
          <span className="text-xs text-muted mono">Simulated Hardware Demonstrator State</span>
        </div>
        <div className="grid-2 gap-3">
          {items.map((item) => (
            <div className="health-item" key={item.label}>
              <span className="health-label">{item.label}</span>
              <span className={`health-value${item.online ? ' online' : ''}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-4">
          Engineering Scope Note: CAN-FD via external SPI transceiver (e.g. MCP2518FD) is planned for future revisions; prototype demonstrates Classical CAN (TWAI).
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHITECTURE VIEW — audit #20: visual flow indicators & #30: accessible list
   ═══════════════════════════════════════════════════════════════════════════ */
export function ArchView() {
  return (
    <div className="view-enter">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Hardware Architecture & Signal Flow</span>
          <span className="text-xs text-muted mono">Modular Physical Topology</span>
        </div>

        {/* Visual architecture flow layout with flow indicators */}
        <div className="arch-grid mt-3">
          {/* Column 1: Sensing Layer */}
          <div className="arch-col">
            <div className="arch-box">
              <div>Sensing Transducers</div>
              <div className="text-xs text-muted">V, I, T, Piezo Mic, MOX Gas</div>
            </div>
            <div className="arch-box">
              <div>Analog Front End (AFE)</div>
              <div className="text-xs text-muted">AD5933 Impedance Converter</div>
            </div>
          </div>

          {/* Flow Connector 1 */}
          <div className="arch-connector" aria-hidden="true">
            <ArrowRight size={22} />
          </div>

          {/* Column 2: Embedded Processing */}
          <div className="arch-box arch-box-core">
            <strong style={{ fontSize: 14 }}>Edge Intelligence Core</strong>
            <div className="text-sm" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
              ESP32-S3 (240MHz Xtensa Dual-Core)
            </div>
            <div className="text-xs text-muted" style={{ maxWidth: 220 }}>
              Feature Extraction • TinyML TCN • Multimodal Sensor Fusion
            </div>
          </div>

          {/* Flow Connector 2 */}
          <div className="arch-connector" aria-hidden="true">
            <ArrowRight size={22} />
          </div>

          {/* Column 3: Actuation & Vehicle Bus */}
          <div className="arch-col">
            <div className="arch-box">
              <div>Vehicle Network</div>
              <div className="text-xs text-muted">CAN / TWAI Diagnostic Bus</div>
            </div>
            <div className="arch-box arch-box-danger">
              <div>Safety Actuator</div>
              <div className="text-xs text-muted">Galvanically Isolated LV Relay</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted text-center mt-4">
          Architectural Notice: Web interface demonstrates simulated real-time telemetry representing the intended embedded hardware design pattern.
        </p>
      </div>

      {/* Accessible Checklist (audit #30) */}
      <div className="card mt-3">
        <div className="card-header">
          <span className="card-title">Calibration & Validation Roadmap</span>
          <span className="text-xs text-muted mono">Engineering Milestones</span>
        </div>
        <ul className="checklist" aria-label="Hardware and software validation milestones">
          <li>
            <input
              type="checkbox"
              checked
              readOnly
              aria-label="Milestone 1: Baseline Electrochemical Parameters Configured (Simulated)"
            />
            <span>Baseline Electrochemical Parameters Configured (Simulated)</span>
          </li>
          <li>
            <input
              type="checkbox"
              checked
              readOnly
              aria-label="Milestone 2: Multimodal Signal Fusion Weighting Implemented"
            />
            <span>Multimodal Signal Fusion Weighting Implemented</span>
          </li>
          <li>
            <input
              type="checkbox"
              disabled
              readOnly
              aria-label="Milestone 3: Controlled Destructive Fault-Data Collection (Pending Battery Lab Testing)"
            />
            <span>Controlled Destructive Fault-Data Collection (Pending Lab Testing)</span>
          </li>
          <li>
            <input
              type="checkbox"
              disabled
              readOnly
              aria-label="Milestone 4: Multi-Frequency EIS Feature Extraction Validation"
            />
            <span>Multi-Frequency EIS Feature Extraction Validation</span>
          </li>
          <li>
            <input
              type="checkbox"
              disabled
              readOnly
              aria-label="Milestone 5: Target False-Alarm Rejection Rate Benchmarking (< 0.1% design target)"
            />
            <span>Target False-Alarm Rejection Rate Benchmarking (&lt; 0.1% design target)</span>
          </li>
          <li>
            <input
              type="checkbox"
              disabled
              readOnly
              aria-label="Milestone 6: Target Early Detection Lead-Time Verification (> 30s design objective)"
            />
            <span>Target Early Detection Lead-Time Verification (&gt; 30s design objective)</span>
          </li>
          <li>
            <input
              type="checkbox"
              disabled
              readOnly
              aria-label="Milestone 7: Hardware-in-the-Loop (HIL) Safety Relay Interlock Testing (Planned)"
            />
            <span>Hardware-in-the-Loop (HIL) Safety Relay Interlock Testing (Planned)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIVACY POLICY VIEW
   ═══════════════════════════════════════════════════════════════════════════ */
export function PrivacyView({ onBack }: { onBack?: () => void }) {
  return (
    <div className="view-enter">
      <div className="legal-card">
        <div className="legal-header">
          <div>
            <h1 className="legal-title">Privacy Policy</h1>
            <div className="legal-subtitle">
              {PROJECT_METADATA.name} — {PROJECT_METADATA.subtitle} | Team {PROJECT_METADATA.team} • {PROJECT_METADATA.institution}
            </div>
          </div>
          {onBack && (
            <button
              className="legal-back-btn"
              onClick={onBack}
              aria-label="Return to live simulation dashboard"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
          )}
        </div>

        <div className="legal-callout">
          <strong>Summary of Actual Data Processing:</strong> QUARTZSENTRY is a student engineering software demonstrator.
          This website processes <strong>zero personally identifiable information (PII)</strong>, sets <strong>no persistent tracking cookies</strong>,
          and transmits <strong>no telemetry data to external servers</strong>. All battery simulation signals are computed entirely
          in-memory within your local browser runtime.
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">
            <Shield size={16} /> 1. Project Identity & Nature
          </h2>
          <div className="legal-section-body">
            <p>
              QUARTZSENTRY is an academic engineering prototype developed by student researchers of <strong>Team {PROJECT_METADATA.team}</strong> at <strong>{PROJECT_METADATA.institution}</strong>.
              It serves solely as an interactive demonstration of a multimodal battery early warning system concept (incorporating Electrochemical Impedance Spectroscopy, acoustic emissions, and gas sensing).
            </p>
            <p>
              This is not a commercial enterprise or certified production automotive product. There are no user accounts, subscription tiers, customer records, or cloud databases connected to this prototype.
            </p>
          </div>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">
            <Lock size={16} /> 2. Personal Information Collection & Handling
          </h2>
          <div className="legal-section-body">
            <p>
              In accordance with strict data minimization principles:
            </p>
            <ul>
              <li><strong>Personal Data Collected:</strong> None. No names, email addresses, phone numbers, IP addresses, geolocation data, or device fingerprints are collected, recorded, or requested by this application.</li>
              <li><strong>Telemetry & Simulation Data:</strong> All cell voltages, temperatures, impedance metrics, acoustic energy readings, and gas concentrations displayed in the charts are synthetic numbers generated locally by client-side JavaScript algorithms (in <code>src/simulation.ts</code>).</li>
              <li><strong>Forms & Input Fields:</strong> There are no user registration forms, contact collection fields, newsletter subscriptions, or payment gateways on this site.</li>
            </ul>
          </div>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">
            <FileCheck size={16} /> 3. Cookies, Local Storage & Tracking
          </h2>
          <div className="legal-section-body">
            <p>
              An inspection of the codebase confirms:
            </p>
            <ul>
              <li><strong>Cookies:</strong> Zero first-party or third-party cookies are set or read (<code>document.cookie</code> is never accessed). Because no non-essential cookies or analytics exist, no disruptive cookie consent popups are displayed.</li>
              <li><strong>Local & Session Storage:</strong> No personal or identifying data is persisted in browser <code>localStorage</code> or <code>sessionStorage</code>.</li>
              <li><strong>Web Analytics & Tracking:</strong> No Google Analytics, Meta Pixel, Hotjar, telemetry beacons, or advertising SDKs are embedded in this project.</li>
            </ul>
          </div>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">
            <Info size={16} /> 4. Third-Party Services & Assets
          </h2>
          <div className="legal-section-body">
            <p>
              The application utilizes minimal, strictly necessary third-party assets:
            </p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th scope="col">Resource</th>
                  <th scope="col">Provider</th>
                  <th scope="col">Purpose</th>
                  <th scope="col">Data Transferred</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Inter & JetBrains Mono Fonts</td>
                  <td>Google Fonts CDN</td>
                  <td>Typography rendering via CSS <code>@import</code></td>
                  <td>Standard HTTP request for font files; no cookies or PII transferred by QUARTZSENTRY</td>
                </tr>
                <tr>
                  <td>Lucide React Icons</td>
                  <td>Local NPM package</td>
                  <td>Interface iconography (embedded SVG)</td>
                  <td>None (bundled locally in build)</td>
                </tr>
                <tr>
                  <td>Recharts (D3)</td>
                  <td>Local NPM package</td>
                  <td>Telemetry graphing (client-side SVG)</td>
                  <td>None (bundled locally in build)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">
            <Shield size={16} /> 5. Data Retention & Deletion Requests
          </h2>
          <div className="legal-section-body">
            <p>
              <strong>Data Retention:</strong> Because QUARTZSENTRY does not store or transmit any personal data, retention is zero.
            </p>
            <p>
              <strong>Deletion / Subject Requests:</strong> Because no personal data exists in any database, log file, or client storage,
              there is no stored personal information to delete or purge. If you have questions regarding the project or academic research materials, you may reach out using the institutional contact channels below.
            </p>
          </div>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">
            <Info size={16} /> 6. Institutional & Project Contact
          </h2>
          <div className="legal-section-body">
            <p>
              This prototype is developed and administered by Team {PROJECT_METADATA.team} at {PROJECT_METADATA.institution}.
            </p>
            <div className="legal-meta-box">
              <div><strong>Project:</strong> {PROJECT_METADATA.name} — {PROJECT_METADATA.subtitle}</div>
              <div><strong>Development Team:</strong> Team {PROJECT_METADATA.team}</div>
              <div><strong>Institution:</strong> {PROJECT_METADATA.institution}, Chennai, India</div>
              <div><strong>Institutional Contact Placeholder:</strong> <code>{PROJECT_METADATA.contactPlaceholder}</code></div>
              <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text-muted)' }}>
                Notice: Configuration placeholder provided for human site administrator. No fabricated corporate registration number, phone number, or fake business entity is claimed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TERMS OF SERVICE VIEW
   ═══════════════════════════════════════════════════════════════════════════ */
export function TermsView({ onBack }: { onBack?: () => void }) {
  return (
    <div className="view-enter">
      <div className="legal-card">
        <div className="legal-header">
          <div>
            <h1 className="legal-title">Terms of Service</h1>
            <div className="legal-subtitle">
              {PROJECT_METADATA.name} — {PROJECT_METADATA.subtitle} | Student Engineering Prototype Agreement
            </div>
          </div>
          {onBack && (
            <button
              className="legal-back-btn"
              onClick={onBack}
              aria-label="Return to live simulation dashboard"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
          )}
        </div>

        <div className="legal-callout warning">
          <strong>Important Engineering Disclaimer:</strong> QUARTZSENTRY is an academic and student engineering demonstrator developed by <strong>Team {PROJECT_METADATA.team}</strong> at <strong>{PROJECT_METADATA.institution}</strong>.
          It is <strong>NOT</strong> an automotive-certified safety system (it is not ASIL-D certified and does not have AIS regulatory certification).
          It does <strong>NOT</strong> possess actual high-voltage isolation capability and must <strong>NEVER</strong> be relied upon to protect life, property, or operational battery packs without formal independent verification and BMS hardware interlocks.
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">1. Prototype Nature & Demonstration Purpose</h2>
          <div className="legal-section-body">
            <p>
              This website and its associated software components are provided exclusively for academic evaluation, hackathon/project presentation, and engineering research demonstration.
              The telemetry data, Nyquist Cole-Cole curves, acoustic envelopes, gas ppm levels, and state escalations shown on this site are synthetic simulations intended to illustrate a multi-sensor fusion architecture.
            </p>
          </div>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">2. No Real-World Safety Performance Guarantees</h2>
          <div className="legal-section-body">
            <p>
              The authors and {PROJECT_METADATA.institution} make no warranty, representation, or guarantee regarding:
            </p>
            <ul>
              <li>The prevention of battery thermal runaway, fire, explosion, or cell venting in any actual energy storage system or electric vehicle.</li>
              <li>The accuracy, timing, or false-alarm rate of the simulated TinyML classification engine in commercial operating environments.</li>
              <li>The availability, uptime, or uninterrupted operation of this web interface or its simulation engine.</li>
            </ul>
          </div>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">3. Acceptable Use</h2>
          <div className="legal-section-body">
            <p>
              You are welcome to explore the dashboard, trigger simulated fault scenarios, examine the architecture views, and evaluate the conceptual engineering pipeline for non-commercial educational and evaluation purposes.
            </p>
            <p>
              You agree not to use this prototype or its documentation to misrepresent safety certifications, claim commercial compliance, or market the concept as an approved commercial automotive safety device.
            </p>
          </div>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">4. Intellectual Property & Third-Party Materials</h2>
          <div className="legal-section-body">
            <p>
              <strong>Project Ownership:</strong> The design concepts, simulation models, and prototype code of {PROJECT_METADATA.name} were developed by the student members of Team {PROJECT_METADATA.team} at {PROJECT_METADATA.institution}. All rights are reserved by their respective student creators and institution.
            </p>
            <p>
              <strong>Third-Party Open-Source Components:</strong>
            </p>
            <ul>
              <li><strong>React & ReactDOM:</strong> MIT License (Meta Platforms, Inc.)</li>
              <li><strong>Recharts:</strong> MIT License (recharts.org)</li>
              <li><strong>Lucide React:</strong> ISC License (Lucide Contributors)</li>
              <li><strong>Inter Font:</strong> SIL Open Font License 1.1 (Rasmus Andersson)</li>
              <li><strong>JetBrains Mono Font:</strong> SIL Open Font License 1.1 / Apache 2.0 (JetBrains s.r.o.)</li>
            </ul>
          </div>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">5. Limitation of Liability</h2>
          <div className="legal-section-body">
            <p>
              To the maximum extent permitted by applicable law, in no event shall Team {PROJECT_METADATA.team}, {PROJECT_METADATA.institution}, its faculty, or student contributors be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services, loss of use, data, or profits, or business interruption) arising in any way out of the use of this prototype software.
            </p>
          </div>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title">6. Inquiries & Project Verification</h2>
          <div className="legal-section-body">
            <p>
              For academic inquiries, collaboration proposals, or project verification:
            </p>
            <div className="legal-meta-box">
              <div><strong>Project:</strong> {PROJECT_METADATA.name} — {PROJECT_METADATA.subtitle}</div>
              <div><strong>Team:</strong> {PROJECT_METADATA.team}</div>
              <div><strong>Institution:</strong> {PROJECT_METADATA.institution}, Chennai, India</div>
              <div><strong>Institutional Inquiries:</strong> <code>{PROJECT_METADATA.contactPlaceholder}</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

