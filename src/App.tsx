import { useState, useEffect, useCallback } from 'react';
import type { ViewId } from './types';
import { STATE_DOT_CLASS, STATE_COLORS } from './types';
import { useSimulation } from './simulation';
import {
  OverviewView,
  FusionView,
  EISView,
  AcousticView,
  GasView,
  AIView,
  SafetyView,
  EventsView,
  HealthView,
  ArchView,
  PrivacyView,
  TermsView,
} from './views';
import { PROJECT_METADATA } from './types';
import {
  LayoutDashboard,
  Layers,
  Zap,
  AudioLines,
  Cloud,
  Brain,
  ShieldCheck,
  FileText,
  HeartPulse,
  Cpu,
  RotateCcw,
  Play,
  Square,
  Menu,
  X,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
} from 'lucide-react';

// ─── Navigation config ───────────────────────────────────────────────────────
interface NavEntry {
  id: ViewId;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

const NAV: NavEntry[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} />, section: 'Monitoring' },
  { id: 'fusion', label: 'Sensor Fusion', icon: <Layers size={16} /> },
  { id: 'eis', label: 'EIS Diagnostics', icon: <Zap size={16} />, section: 'Diagnostics' },
  { id: 'acoustic', label: 'Acoustic Analysis', icon: <AudioLines size={16} /> },
  { id: 'gas', label: 'Gas Analysis', icon: <Cloud size={16} /> },
  { id: 'ai', label: 'AI Risk Engine', icon: <Brain size={16} />, section: 'Intelligence' },
  { id: 'safety', label: 'Safety Response', icon: <ShieldCheck size={16} /> },
  { id: 'events', label: 'Events & Audit', icon: <FileText size={16} />, section: 'System' },
  { id: 'health', label: 'System Health', icon: <HeartPulse size={16} /> },
  { id: 'arch', label: 'Architecture', icon: <Cpu size={16} /> },
];

export interface ToastItem {
  id: number;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [activeView, setActiveView] = useState<ViewId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataDeletionModalOpen, setDataDeletionModalOpen] = useState(false);
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { sim, trigger, reset, toggleDemo } = useSimulation();

  // Toast notification dispatcher
  const showToast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  // Close sidebar and open modals on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (dataDeletionModalOpen) {
          setDataDeletionModalOpen(false);
        } else if (accessibilityModalOpen) {
          setAccessibilityModalOpen(false);
        } else if (sidebarOpen) {
          setSidebarOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, dataDeletionModalOpen, accessibilityModalOpen]);

  // Demo mode progress calculation (90 second demo)
  const demoProgress = Math.min(100, Math.max(0, (sim.demoTime / 90) * 100));
  const demoRemaining = Math.max(0, 90 - Math.floor(sim.demoTime));

  function renderView() {
    switch (activeView) {
      case 'overview':  return <OverviewView sim={sim} trigger={trigger} />;
      case 'fusion':    return <FusionView sim={sim} />;
      case 'eis':       return <EISView sim={sim} />;
      case 'acoustic':  return <AcousticView sim={sim} />;
      case 'gas':       return <GasView sim={sim} />;
      case 'ai':        return <AIView sim={sim} />;
      case 'safety':    return <SafetyView sim={sim} showToast={showToast} />;
      case 'events':    return <EventsView sim={sim} />;
      case 'health':    return <HealthView />;
      case 'arch':      return <ArchView />;
      case 'privacy':   return <PrivacyView onBack={() => setActiveView('overview')} />;
      case 'terms':     return <TermsView onBack={() => setActiveView('overview')} />;
    }
  }

  return (
    <div className="app-layout">
      {/* ─── Skip-to-content link for accessibility (audit #3) ─────── */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ─── Mobile sidebar backdrop overlay ──────────────────────── */}
      <div
        className={`sidebar-backdrop${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ─── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`sidebar${sidebarOpen ? ' open' : ''}`}
        aria-label="Main Navigation"
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon" aria-hidden="true">
            <ShieldCheck size={16} aria-hidden="true" />
          </div>
          <div className="sidebar-brand-name">QUARTZSENTRY</div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <div key={item.id}>
              {item.section && (
                <div className="nav-section-label">{item.section}</div>
              )}
              <button
                className={`nav-item${activeView === item.id ? ' active' : ''}`}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
                aria-current={activeView === item.id ? 'page' : undefined}
              >
                <span aria-hidden="true" style={{ display: 'inline-flex' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </nav>

        {/* Semantic list for notes (audit #19) */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-title">Engineering Notice</div>
          <ul>
            <li>Student prototype software concept.</li>
            <li>Team {PROJECT_METADATA.team} • {PROJECT_METADATA.institution}.</li>
            <li>Intended to complement BMS, not replace it.</li>
            <li>Simulated AI inference; no validated dataset yet.</li>
            <li>NO high-voltage isolation in demonstrator.</li>
            <li>Not ASIL or AIS certified.</li>
          </ul>
          <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              className="app-footer-link"
              onClick={() => {
                setActiveView('privacy');
                setSidebarOpen(false);
              }}
            >
              Privacy Policy
            </button>
            <button
              className="app-footer-link"
              onClick={() => {
                setActiveView('terms');
                setSidebarOpen(false);
              }}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ────────────────────────────────────────── */}
      <main id="main-content" className="main-area" tabIndex={-1}>
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            {/* Mobile hamburger menu toggle (audit #10) */}
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="topbar-status">
              <div
                className={`status-dot ${STATE_DOT_CLASS[sim.state.id] ?? 'normal'}`}
                aria-hidden="true"
              />
              <span className="topbar-status-label">RISK STATE:</span>
              <span
                className="topbar-status-value"
                style={{ color: STATE_COLORS[sim.state.id] }}
              >
                {sim.state.text}
              </span>
            </div>

            {/* Global prototype credibility badge (audit #14) */}
            <span
              className="prototype-badge"
              title="Conceptual demonstration with simulated sensor signals"
            >
              SIMULATED PROTOTYPE
            </span>
          </div>

          <div className="topbar-actions">
            <button
              className="btn"
              onClick={() => {
                reset();
                showToast('Simulation reset to nominal operating parameters', 'info');
              }}
              title="Reset simulation parameters to default baseline"
            >
              <RotateCcw size={13} aria-hidden="true" /> Reset
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                toggleDemo();
                if (!sim.demoMode) {
                  showToast('Automated 90-second fault escalation scenario started', 'info');
                } else {
                  showToast('Demo sequence stopped', 'warning');
                }
              }}
            >
              {sim.demoMode ? (
                <>
                  <Square size={13} aria-hidden="true" /> Stop Demo
                </>
              ) : (
                <>
                  <Play size={13} aria-hidden="true" /> Start Demo (90s)
                </>
              )}
            </button>
          </div>
        </header>

        {/* Demo mode progress bar (audit #5) */}
        {sim.demoMode && (
          <div
            className="demo-bar"
            role="progressbar"
            aria-valuenow={Math.round(demoProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Demo sequence progress"
          >
            <div
              className="demo-bar-fill"
              style={{ width: `${demoProgress}%` }}
            />
            <span className="demo-bar-label">
              DEMO ESCALATION: {demoRemaining}s REMAINING
            </span>
          </div>
        )}

        {/* Content View */}
        <div className="content-area">
          {renderView()}

          {/* Global Accessible Footer & Transparency Disclosures */}
          <footer className="app-footer" role="contentinfo" aria-label="Project information and legal notices">
            <div className="app-footer-top">
              <div className="app-footer-brand">
                <ShieldCheck size={18} aria-hidden="true" style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <div className="app-footer-title">
                    {PROJECT_METADATA.name} — {PROJECT_METADATA.subtitle}
                  </div>
                  <div className="app-footer-tagline">
                    Team {PROJECT_METADATA.team} • {PROJECT_METADATA.institution}
                  </div>
                </div>
              </div>
              <span className="app-footer-badge">
                Student Engineering Prototype
              </span>
            </div>

            <div className="app-footer-meta">
              {PROJECT_METADATA.academicNotice} All sensor waveforms, Nyquist plots, and risk metrics are client-side synthetic simulations for research evaluation.
            </div>

            <nav className="app-footer-nav" aria-label="Legal and technical links">
              <button
                className="app-footer-link"
                onClick={() => setActiveView('privacy')}
                aria-current={activeView === 'privacy' ? 'page' : undefined}
              >
                Privacy Policy
              </button>
              <button
                className="app-footer-link"
                onClick={() => setActiveView('terms')}
                aria-current={activeView === 'terms' ? 'page' : undefined}
              >
                Terms of Service
              </button>
              <button
                className="app-footer-link"
                onClick={() => setDataDeletionModalOpen(true)}
                aria-haspopup="dialog"
              >
                Data Deletion &amp; Inquiries
              </button>
              <button
                className="app-footer-link"
                onClick={() => setAccessibilityModalOpen(true)}
                aria-haspopup="dialog"
              >
                Accessibility Statement
              </button>
              <button
                className="app-footer-link"
                onClick={() => setActiveView('health')}
                aria-current={activeView === 'health' ? 'page' : undefined}
              >
                System Health
              </button>
              <button
                className="app-footer-link"
                onClick={() => setActiveView('arch')}
                aria-current={activeView === 'arch' ? 'page' : undefined}
              >
                Hardware Architecture &amp; Signal Flow
              </button>
              <button
                className="app-footer-link"
                onClick={() => {
                  reset();
                  showToast('Simulation reset to baseline nominal parameters', 'info');
                }}
              >
                Reset Simulation State
              </button>
            </nav>
          </footer>
        </div>
      </main>

      {/* ─── Data Deletion & Privacy Inquiry Modal ─────────────────── */}
      {dataDeletionModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setDataDeletionModalOpen(false)}
          role="presentation"
        >
          <div
            className="modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deletion-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div id="deletion-modal-title" className="modal-title">
                <ShieldCheck size={18} aria-hidden="true" style={{ color: 'var(--accent-primary)' }} />
                <span>Data Deletion &amp; Privacy Request Notice</span>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setDataDeletionModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Zero Personal Data Retention:</strong> {PROJECT_METADATA.name} is an academic engineering demonstrator developed by Team {PROJECT_METADATA.team} at {PROJECT_METADATA.institution}.
              </p>
              <p>
                This application does <strong>not store, record, transmit, or process any personal data</strong>, login credentials, IP logs, or identifying device information. No persistent database or third-party user tracking exists.
              </p>
              <ul>
                <li><strong>Browser Memory:</strong> All simulation signals (voltages, temperatures, impedance metrics, acoustic energy levels) exist strictly in transient React component state.</li>
                <li><strong>Instant Erasure:</strong> Reloading or closing this browser tab immediately clears all in-memory telemetry, risk states, and audit trail entries.</li>
                <li><strong>Subject Rights &amp; Deletion Requests:</strong> Because no personal records are retained, there is no personal data record to modify, extract, or delete.</li>
              </ul>
              <p>
                For official project inquiries, academic research correspondence, or verification from faculty advisors, please use the verified institutional channel:
              </p>
              <div className="legal-meta-box" style={{ marginTop: 8 }}>
                <div><strong>Institution:</strong> {PROJECT_METADATA.institution}</div>
                <div><strong>Location:</strong> {PROJECT_METADATA.location}</div>
                <div><strong>Department Inquiries:</strong> <code>{PROJECT_METADATA.contactPlaceholder}</code></div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => setDataDeletionModalOpen(false)}
              >
                Acknowledge &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Accessibility Statement Modal ─────────────────────────── */}
      {accessibilityModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setAccessibilityModalOpen(false)}
          role="presentation"
        >
          <div
            className="modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div id="a11y-modal-title" className="modal-title">
                <Info size={18} aria-hidden="true" style={{ color: 'var(--accent-primary)' }} />
                <span>Accessibility Statement (WCAG 2.2 AA)</span>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setAccessibilityModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="modal-body">
              <p>
                {PROJECT_METADATA.name} is engineered to meet <strong>WCAG 2.2 Level AA</strong> accessibility standards, ensuring full usability for screen readers, keyboard-only operators, and low-vision users.
              </p>
              <h3 style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 12, marginBottom: 6 }}>
                Keyboard Navigation
              </h3>
              <ul>
                <li><kbd>Tab</kbd> / <kbd>Shift + Tab</kbd>: Sequentially navigates all interactive elements, navigation tabs, buttons, and grid cells.</li>
                <li><kbd>Enter</kbd> or <kbd>Space</kbd>: Activates buttons, navigation views, and simulation triggers.</li>
                <li><kbd>Escape</kbd>: Closes open dialogs and dismisses the mobile navigation drawer.</li>
                <li><strong>Skip Link:</strong> A dedicated "Skip to main content" link is available as the first focusable element on every page.</li>
              </ul>
              <h3 style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 12, marginBottom: 6 }}>
                Visual &amp; Contrast Standards
              </h3>
              <ul>
                <li><strong>Contrast Compliance:</strong> Normal body text and interactive controls maintain a contrast ratio of ≥ 4.5:1 against dark surface backgrounds.</li>
                <li><strong>Visible Focus Indicators:</strong> High-contrast focus rings (<code>2px offset / 4px indigo</code>) highlight the currently active element during keyboard traversal.</li>
                <li><strong>No Color-Only Information:</strong> All risk states provide explicit textual labels (<code>NORMAL</code>, <code>ANOMALY</code>, <code>HIGH RISK</code>, <code>CRITICAL</code>) in addition to color accents.</li>
                <li><strong>Reduced Motion:</strong> Respects the system-level <code>prefers-reduced-motion</code> preference.</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => setAccessibilityModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast System (audit #4, #15) ────────────────────────── */}
      {toasts.length > 0 && (
        <div className="toast-container" aria-live="polite" aria-atomic="true">
          {toasts.map((toast) => (
            <div key={toast.id} className="toast" role="status">
              {toast.type === 'danger' ? (
                <AlertOctagon size={16} />
              ) : toast.type === 'warning' ? (
                <AlertTriangle size={16} />
              ) : toast.type === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <Info size={16} />
              )}
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
