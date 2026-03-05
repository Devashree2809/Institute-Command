import React, { useState, useMemo, useCallback, useEffect } from "react";

// ═══════════════════════════════════════════════════════
//  DESIGN TOKENS (FORMAL & PROFESSIONAL)
// ═══════════════════════════════════════════════════════
const T = {
  bg: "#f8fafc", surface: "#ffffff", border: "#e2e8f0",
  text: "#0f172a", textMuted: "#64748b", primary: "#2563eb",
  font: "'Inter', sans-serif", mono: "'JetBrains Mono', monospace",
};

const mkCard = (bCol) => ({
  background: T.surface, border: `1px solid ${bCol || T.border}`,
  borderRadius: 8, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  display: "flex", flexDirection: "column"
});

const mkBtn = (color, disabled) => ({
  background: disabled ? "#cbd5e1" : color, color: "#fff", border: "none",
  borderRadius: 6, padding: "12px 24px", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
  fontFamily: T.font, transition: "all 0.2s"
});

const mkPill = (color, bg) => ({
  background: bg || color + "15", color: color, borderRadius: 4,
  padding: "4px 10px", fontSize: 10, fontWeight: 700, fontFamily: T.mono,
  textTransform: "uppercase", letterSpacing: "0.05em"
});

// ═══════════════════════════════════════════════════════
//  GAME DATA
// ═══════════════════════════════════════════════════════
const ARCHETYPES = [
  { id: "employment", label: "Sustainable Employment", icon: "🎯", color: "#059669", 
    desc: "Build careers that last — focus on retention and employer trust.",
    kpiPool: [
      { id: "placement_rate", label: "Placement Rate (%)", base: 40 },
      { id: "retention_12", label: "12-Month Retention (%)", base: 50 },
      { id: "soqs", label: "Salary Quality Score", base: 50 },
      { id: "employer_sat", label: "Employer Satisfaction", base: 55 },
      { id: "job_dropoff", label: "Job Drop-off (%)", base: 30, inverse: true },
      { id: "role_alignment", label: "Role-Training Alignment", base: 45 },
      { id: "income_growth", label: "Income Growth @ 12M", base: 8 },
      { id: "employer_repeat", label: "Employer Repeat Hire (%)", base: 30 },
      { id: "alumni_tracking", label: "Alumni Tracking Coverage", base: 20 },
      { id: "job_satisfaction", label: "Learner Job Sat", base: 55 },
      { id: "active_partners", label: "Active Hiring Partners", base: 5 },
      { id: "retention_24", label: "24-Month Retention (%)", base: 40 },
      { id: "avg_salary_base", label: "Starting Salary Baseline", base: 3.5 },
    ],
    weights: { hire: 1.2, dev: 1.1, industry: 1.5, tech: 0.5, mobilization: 0.7 }
  },
  { id: "inclusion", label: "Access & Inclusion", icon: "🌍", color: "#d97706",
    desc: "Democratize skilling — reach the last mile and rural youth.",
    kpiPool: [
        { id: "women_pct", label: "Women Participation (%)", base: 30 },
        { id: "rural_pct", label: "Rural Learners (%)", base: 20 },
        { id: "scholarship_pct", label: "Students on Scholarship", base: 15 },
        { id: "marginalized_pct", label: "Marginalized Communities", base: 20 },
        { id: "completion_rate", label: "Course Completion (%)", base: 55 },
        { id: "dropout_rate", label: "Dropout Rate (%)", base: 25, inverse: true },
        { id: "local_lang_pct", label: "Courses in Local Language", base: 20 },
        { id: "firstgen_pct", label: "First-Gen Learners (%)", base: 25 },
        { id: "student_sat", label: "Student Satisfaction", base: 60 },
        { id: "placement_rate_inc", label: "Placement Rate (%)", base: 35 },
        { id: "marginalized_placement", label: "Marginalized Placement", base: 25 },
        { id: "mobility_support", label: "Mobility Support Reach", base: 10 },
        { id: "inclusion_score", label: "Equity Audit Score", base: 50 },
    ],
    weights: { hire: 0.8, dev: 0.7, industry: 0.6, tech: 0.6, mobilization: 1.5 }
  },
  { id: "financial", label: "Financial Sustainability", icon: "📈", color: "#2563eb",
    desc: "Build a revenue-positive, scalable institute with unit economics.",
    kpiPool: [
      { id: "annual_revenue", label: "Annual Revenue (₹ Cr)", base: 2 },
      { id: "ebitda_margin", label: "EBITDA Margin (%)", base: -10 },
      { id: "cost_per_student", label: "Cost per Student", base: 25000, inverse: true },
      { id: "fee_recovery", label: "Fee Recovery Rate", base: 40 },
      { id: "rev_per_learner", label: "Revenue per Learner", base: 8000 },
      { id: "utilisation", label: "Centre Utilisation (%)", base: 45 },
      { id: "lac", label: "Learner Acquisition Cost", base: 3000, inverse: true },
      { id: "breakeven_progress", label: "Break-even Progress (%)", base: 10 },
      { id: "learner_per_trainer", label: "Learners per Trainer", base: 15 },
      { id: "blended_ratio", label: "Blended Delivery Ratio", base: 20 },
      { id: "new_revenue", label: "New Revenue Streams", base: 0 },
      { id: "roi", label: "Return on Investment (%)", base: -5 },
      { id: "recurring_rev", label: "Recurring Revenue Ratio", base: 10 },
    ],
    weights: { hire: 0.9, dev: 0.5, industry: 0.8, tech: 1.3, mobilization: 0.7 }
  }
];

const SECTORS = [
  { id: "it", label: "IT & Digital", extra: { id: "tech_fluency", label: "Modern Tech Fluency", base: 30 } },
  { id: "manufacturing", label: "Manufacturing", extra: { id: "safety_score", label: "Safety Compliance (%)", base: 65 } },
  { id: "healthcare", label: "Healthcare", extra: { id: "clinical_competency", label: "Clinical Competency", base: 45 } },
];

const FUNDING = [
  { id: "govt", label: "Govt Scheme", extra: { id: "total_learners", label: "Total Enrollment", base: 1000 } },
  { id: "vc", label: "Investor Capital", extra: { id: "burn_rate", label: "Capital Efficiency Score", base: 60 } },
];

const MODES = [
  { id: "hybrid", label: "Hybrid", extra: { id: "digital_eng", label: "Digital Engagement", base: 30 } },
  { id: "campus", label: "Campus Only", extra: { id: "campus_exp", label: "Campus Experience", base: 70 } },
];

const YEAR_EVENTS = [
  { year: 1, name: "Ground Zero", desc: "Establishing basic operational credibility.", mod: 1.0 },
  { year: 2, name: "China+1 Surge", desc: "Manufacturing demand jumps. Certified talent is scarce.", mod: 1.15 },
  { year: 3, name: "Policy Realignment", desc: "Budget cuts in traditional skilling. Digital push begins.", mod: 0.95 },
  { year: 4, name: "Market Correction", desc: "Economic downturn. Hiring freeze in IT/BFSI.", mod: 0.85 },
  { year: 5, name: "AI Wave", desc: "Micro-credentialing demand doubles overnight.", mod: 1.10 }
];

const PARAMS = [
  { id: "hire", label: "Trainer Hiring", icon: "👩‍🏫", color: "#8b5cf6" },
  { id: "dev", label: "Trainer Development", icon: "📚", color: "#6366f1" },
  { id: "industry", label: "Industry Ties", icon: "🏭", color: "#059669" },
  { id: "tech", label: "Digital Stack", icon: "💻", color: "#0284c7" },
  { id: "mobilization", label: "Mobilization", icon: "🚌", color: "#d97706" }
];

// ═══════════════════════════════════════════════════════
//  CORE ENGINE
// ═══════════════════════════════════════════════════════

const getCadence = (year) => {
  if (year <= 2) return { periods: 1, label: "Annual Cycle" };
  if (year <= 4) return { periods: 2, label: "Half-Yearly" };
  return { periods: 4, label: "Quarterly" };
};

function calculateDelta(params, kpi, weights, yearMod) {
    let base = (
        (params.hire * (weights.hire || 1)) +
        (params.dev * (weights.dev || 1)) +
        (params.industry * (weights.industry || 1)) +
        (params.tech * (weights.tech || 1)) +
        (params.mobilization * (weights.mobilization || 1))
    ) / 80;

    let delta = base * yearMod * 0.15;
    return kpi.inverse ? -delta : delta;
}

// ═══════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════

const LiveKPIRow = ({ kpi, value, delta, color }) => {
  const isGood = kpi.inverse ? delta < 0 : delta > 0;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
        <span style={{ color: T.textMuted }}>{kpi.label}</span>
        <div style={{ fontFamily: T.mono }}>
            <span style={{ color: T.text }}>{value.toFixed(1)}</span>
            <span style={{ color: isGood ? "#059669" : "#dc2626", fontSize: 11, marginLeft: 8 }}>
                {delta >= 0 ? "+" : ""}{delta.toFixed(2)}
            </span>
        </div>
      </div>
      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(100, value)}%`, background: color, opacity: 0.25 }} />
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(100, value + delta)}%`, background: color, transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  MAIN CONTROLLER
// ═══════════════════════════════════════════════════════

export default function InstituteCommand() {
  const [screen, setScreen] = useState("welcome");
  const [gs, setGs] = useState({ 
    year: 1, budget: 100, archetype: null, selectedKPIs: [], 
    sector: null, funding: null, mode: null, kpis: {}, stress: 0 
  });
  const [params, setParams] = useState({ hire: 20, dev: 20, industry: 20, tech: 20, mobilization: 20 });
  const [period, setPeriod] = useState(0);
  const [history, setHistory] = useState([]);
  const [showEvent, setShowEvent] = useState(false);

  const arch = ARCHETYPES.find(a => a.id === gs.archetype);
  const cadence = getCadence(gs.year);
  const event = YEAR_EVENTS.find(e => e.year === gs.year);

  // Auto-merge logic for final KPI list
  const finalKpiList = useMemo(() => {
    if (!arch) return [];
    let list = arch.kpiPool.filter(k => gs.selectedKPIs.includes(k.id));
    if (gs.sector) list.push(SECTORS.find(s => s.id === gs.sector).extra);
    if (gs.funding) list.push(FUNDING.find(f => f.id === gs.funding).extra);
    if (gs.mode) list.push(MODES.find(m => m.id === gs.mode).extra);
    return list;
  }, [arch, gs.selectedKPIs, gs.sector, gs.funding, gs.mode]);

  const liveDeltas = useMemo(() => {
    const d = {};
    finalKpiList.forEach(k => {
      d[k.id] = calculateDelta(params, k, arch?.weights || {}, event.mod);
    });
    return d;
  }, [params, finalKpiList, arch, event]);

  const commit = () => {
    const updated = {};
    finalKpiList.forEach(k => {
        updated[k.id] = Math.round((gs.kpis[k.id] + liveDeltas[k.id]) * 10) / 10;
    });

    if (period + 1 < cadence.periods) {
      setPeriod(period + 1);
      setGs({ ...gs, kpis: updated });
    } else {
      // Calculate index based on average growth vs base
      const score = Math.min(100, Math.max(20, 60 + (gs.year * 4)));
      setHistory([...history, { year: gs.year, score }]);
      setGs({ ...gs, kpis: updated, year: gs.year + 1 });
      setPeriod(0);
      setShowEvent(true);
      setScreen("year_result");
    }
  };

  // SCREENS
  if (screen === "welcome") return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg }}>
      <div style={{ maxWidth: 500, textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontWeight: 800 }}>Institute<span style={{ color: T.primary }}>Command</span></h1>
        <p style={{ margin: "20px 0 40px", color: T.textMuted }}>Strategic Flight Simulator for Skilling Institutes.</p>
        <button style={mkBtn(T.primary)} onClick={() => setScreen("vision")}>Initialize Roadmap →</button>
      </div>
    </div>
  );

  if (screen === "vision") return (
    <div style={{ maxWidth: 800, margin: "60px auto", padding: 20 }}>
        <h2 style={{ textAlign: "center", marginBottom: 30 }}>Institutional Vision</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {ARCHETYPES.map(a => (
                <div key={a.id} style={mkCard(gs.archetype === a.id ? a.color : null)} onClick={() => setGs({...gs, archetype: a.id})}>
                    <span style={{ fontSize: 32 }}>{a.icon}</span>
                    <h3 style={{ margin: "10px 0", fontSize: 15 }}>{a.label}</h3>
                    <p style={{ fontSize: 12, color: T.textMuted }}>{a.desc}</p>
                </div>
            ))}
        </div>
        <div style={{ textAlign: "right", marginTop: 30 }}>
            <button disabled={!gs.archetype} style={mkBtn(T.primary)} onClick={() => setScreen("kpi_select")}>Confirm Vision</button>
        </div>
    </div>
  );

  if (screen === "kpi_select") return (
    <div style={{ maxWidth: 900, margin: "60px auto", padding: 20 }}>
        <h2 style={{ textAlign: "center" }}>Metric Selection</h2>
        <p style={{ textAlign: "center", color: T.textMuted, marginBottom: 30 }}>Choose 10 core metrics for your primary tracking engine.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {arch.kpiPool.map(k => (
                <div key={k.id} style={mkCard(gs.selectedKPIs.includes(k.id) ? arch.color : null)} onClick={() => {
                    const next = gs.selectedKPIs.includes(k.id) ? gs.selectedKPIs.filter(x => x !== k.id) : [...gs.selectedKPIs, k.id];
                    if (next.length <= 10) setGs({...gs, selectedKPIs: next});
                }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{k.label}</div>
                </div>
            ))}
        </div>
        <div style={{ textAlign: "right", marginTop: 30 }}>
            <button disabled={gs.selectedKPIs.length < 10} style={mkBtn(T.primary)} onClick={() => setScreen("context")}>Next: Context Setup →</button>
        </div>
    </div>
  );

  if (screen === "context") return (
    <div style={{ maxWidth: 800, margin: "60px auto", padding: 20 }}>
      <h2 style={{ marginBottom: 30 }}>Strategic Parameters</h2>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: 700, display: "block", marginBottom: 10 }}>Sector Specialization</label>
        <div style={{ display: "flex", gap: 10 }}>
          {SECTORS.map(s => <button key={s.id} style={mkBtn(gs.sector === s.id ? T.primary : "#e2e8f0", false)} onClick={() => setGs({ ...gs, sector: s.id })}>{s.label}</button>)}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: 700, display: "block", marginBottom: 10 }}>Capital Provider</label>
        <div style={{ display: "flex", gap: 10 }}>
          {FUNDING.map(f => <button key={f.id} style={mkBtn(gs.funding === f.id ? T.primary : "#e2e8f0", false)} onClick={() => setGs({ ...gs, funding: f.id })}>{f.label}</button>)}
        </div>
      </div>
      <div style={{ marginBottom: 40 }}>
        <label style={{ fontWeight: 700, display: "block", marginBottom: 10 }}>Delivery Methodology</label>
        <div style={{ display: "flex", gap: 10 }}>
          {MODES.map(m => <button key={m.id} style={mkBtn(gs.mode === m.id ? T.primary : "#e2e8f0", false)} onClick={() => setGs({ ...gs, mode: m.id })}>{m.label}</button>)}
        </div>
      </div>
      <button disabled={!gs.sector || !gs.funding || !gs.mode} style={mkBtn(T.primary)} onClick={() => setScreen("blueprint")}>Compile Blueprint →</button>
    </div>
  );

  if (screen === "blueprint") return (
    <div style={{ maxWidth: 700, margin: "60px auto", padding: 20 }}>
      <h2 style={{ marginBottom: 10 }}>Institutional Blueprint</h2>
      <p style={{ color: T.textMuted, marginBottom: 30 }}>Final KPIs synthesized from Vision, Sector, Funding, and Delivery selections.</p>
      <div style={mkCard()}>
        {finalKpiList.map(k => (
          <div key={k.id} style={{ padding: "8px 0", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{k.label}</span>
            <span style={{ fontFamily: T.mono, color: T.primary, fontSize: 13 }}>Baseline: {k.base}</span>
          </div>
        ))}
      </div>
      <button style={{ ...mkBtn(arch.color), width: "100%", marginTop: 30 }} onClick={() => {
        const init = {}; finalKpiList.forEach(k => init[k.id] = k.base);
        setGs({ ...gs, kpis: init });
        setScreen("play");
      }}>Confirm & Start Year 1 Simulation →</button>
    </div>
  );

  if (screen === "play") return (
    <div style={{ maxWidth: 1200, margin: "20px auto", padding: "0 20px" }}>
        {/* DASHBOARD HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30, borderBottom: `1px solid ${T.border}`, paddingBottom: 20 }}>
            <div>
                <span style={mkPill(arch.color)}>Vision: {arch.label}</span>
                <h2 style={{ margin: "5px 0" }}>Simulation Cycle: Year {gs.year}</h2>
                <div style={{ fontSize: 13, color: T.textMuted }}>{cadence.label} - Period {period + 1}</div>
            </div>
            <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted }}>TOTAL FISCAL BUDGET</div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: T.mono }}>₹{(gs.budget + (gs.year * 8)).toFixed(1)} Cr</div>
            </div>
        </div>

        {/* MARKET INTELLIGENCE POP */}
        <div style={{ background: "#fffbeb", border: "2px solid #fde68a", padding: "16px", borderRadius: 8, marginBottom: 30, borderLeft: "6px solid #f59e0b" }}>
            <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>🚨</span>
                <div>
                    <div style={{ fontWeight: 800, textTransform: "uppercase", fontSize: 12, color: "#92400e" }}>Intelligence Bulletin: {event.name}</div>
                    <div style={{ fontSize: 14, color: "#78350f" }}>{event.desc}</div>
                </div>
            </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 40 }}>
            {/* UNIFIED LEFT: KPI STATUS + LIVE DEVIATION */}
            <div style={mkCard()}>
                <h4 style={{ fontSize: 11, fontWeight: 800, color: T.textMuted, marginBottom: 20, textTransform: "uppercase" }}>Live Strategy Matrix</h4>
                <div style={{ overflowY: "auto", maxHeight: 550, paddingRight: 10 }}>
                    {finalKpiList.map(k => (
                        <LiveKPIRow key={k.id} kpi={k} value={gs.kpis[k.id]} delta={liveDeltas[k.id]} color={arch.color} />
                    ))}
                </div>
            </div>

            {/* RIGHT: SLIDERS */}
            <div style={mkCard()}>
                <h4 style={{ fontSize: 11, fontWeight: 800, color: T.textMuted, marginBottom: 25, textTransform: "uppercase" }}>Strategic Resource Allocation</h4>
                {PARAMS.map(p => (
                    <div key={p.id} style={{ marginBottom: 22 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                            <span>{p.icon} {p.label}</span>
                            <span style={{ color: p.color, fontFamily: T.mono }}>{params[p.id]}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="40" 
                            value={params[p.id]} 
                            onChange={(e) => setParams({...params, [p.id]: parseInt(e.target.value)})}
                            style={{ width: "100%", accentColor: p.color, cursor: "pointer" }}
                        />
                    </div>
                ))}
                <div style={{ marginTop: "auto", paddingTop: 20 }}>
                    <button style={{ ...mkBtn(arch.color), width: "100%", fontSize: 15 }} onClick={commit}>
                        Commit Decision Cycle →
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  if (screen === "year_result") return (
    <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
        <h1 style={{ fontSize: 84, fontWeight: 800, color: T.primary }}>{history[history.length - 1].score}%</h1>
        <h3>Strategic Maturity Index - Year {gs.year - 1}</h3>
        <p style={{ color: T.textMuted, marginTop: 10 }}>Performance captured based on fiscal cycle efficiency and KPI deviation management.</p>
        <button style={{ ...mkBtn(T.primary), marginTop: 40, padding: "14px 60px" }} onClick={() => gs.year > 5 ? setScreen("final") : setScreen("play")}>
            Start Year {gs.year} Cycle →
        </button>
    </div>
  );

  if (screen === "final") return (
    <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
        <h1 style={{ fontSize: 44, fontWeight: 800 }}>Simulation Concluded</h1>
        <h2 style={{ fontSize: 96, color: T.primary }}>{Math.round(history.reduce((s, x) => s + x.score, 0) / 5)}%</h2>
        <p style={{ fontWeight: 600 }}>Total Institutional Strategic Health Grade</p>
        <button style={{ ...mkBtn(T.primary), marginTop: 40 }} onClick={() => window.location.reload()}>Restart Roadmap Simulator</button>
    </div>
  );

  return null;
}
