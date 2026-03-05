import React, { useState, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════════════
//  DESIGN SYSTEM & TOKENS
// ═══════════════════════════════════════════════════════
const T = {
  bg: "#f8fafc",
  surface: "#ffffff",
  surfaceAlt: "#f1f5f9",
  border: "#e2e8f0",
  text: "#0f172a",
  textMuted: "#64748b",
  textFaint: "#94a3b8",
  track: "#e2e8f0",
  primary: "#2563eb",
  font: "'Inter', -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'Roboto Mono', monospace",
};

const mkPill = (color, bg) => ({
  background: bg || color + "18",
  color,
  borderRadius: 4,
  padding: "3px 9px",
  fontSize: 10,
  fontWeight: 600,
  fontFamily: T.mono,
  display: "inline-flex",
  alignItems: "center",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  border: `1px solid ${color}30`
});

const mkCard = (bColor, sel) => ({
  background: T.surface,
  border: sel ? `2px solid ${bColor}` : `1px solid ${T.border}`,
  borderRadius: 8,
  padding: "18px 20px",
  boxShadow: sel ? `0 0 0 3px ${bColor}18` : "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  display: "flex",
  flexDirection: "column"
});

const mkBtn = (color, outline) => ({
  background: outline ? "transparent" : color,
  color: outline ? color : "#fff",
  border: `1px solid ${color}`,
  borderRadius: 6,
  padding: "10px 20px",
  fontWeight: 600,
  fontFamily: T.font,
  cursor: "pointer",
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  transition: "all 0.1s"
});

// ═══════════════════════════════════════════════════════
//  DATA CONSTANTS
// ═══════════════════════════════════════════════════════
const ARCHETYPES = [
  {
    id: "employment", label: "Sustainable Employment", icon: "🎯", color: "#059669",
    desc: "Focus on long-term retention, salary quality & employer trust (24-month horizon).",
    pros: ["Employer repeat hiring", "High credibility"],
    cons: ["High market dependency"],
    kpiPool: [
      { id: "placement_rate", label: "Placement Rate (%)", base: 40, unit: "%" },
      { id: "retention_12", label: "12-Month Retention (%)", base: 50, unit: "%" },
      { id: "retention_24", label: "24-Month Retention (%)", base: 40, unit: "%" },
      { id: "soqs", label: "Salary Quality Score", base: 50, unit: "pts" },
      { id: "employer_repeat", label: "Employer Repeat Hiring (%)", base: 30, unit: "%" },
      { id: "employer_sat", label: "Employer Satisfaction", base: 55, unit: "pts" },
      { id: "job_dropoff", label: "Job Drop-off <6M (%)", base: 30, unit: "%", inverse: true },
      { id: "role_alignment", label: "Role-Training Alignment (%)", base: 45, unit: "%" },
      { id: "alumni_tracking", label: "Alumni Tracking Coverage (%)", base: 20, unit: "%" },
      { id: "job_satisfaction", label: "Learner Job Satisfaction", base: 55, unit: "pts" },
      { id: "income_growth_12", label: "Income Growth @ 12M (%)", base: 8, unit: "%" },
      { id: "active_employers", label: "Active Hiring Partners", base: 5, unit: "" },
      { id: "avg_salary", label: "Avg Starting Salary (LPA)", base: 3.5, unit: "L" },
    ],
    endGoals: [
      { id: "mass_placement", label: "Mass Placement at Scale", desc: "80%+ placement with diverse employer base", kpiTargets: { placement_rate: 80, retention_12: 70, active_employers: 50 } },
      { id: "salary_excellence", label: "Premium Salary Outcomes", desc: "Avg 10 LPA with strong 24-month retention", kpiTargets: { avg_salary: 10, retention_24: 70, soqs: 80 } },
    ],
    paramWeights: { capex: 0.5, trainer_hire: 1.0, trainer_dev: 0.9, tech: 0.4, mobilization: 0.7, digital_mkt: 0.5, industry_eng: 1.2, ops_team: 0.6, admin: 0.3, subsidy: 0.5 },
  },
  {
    id: "inclusion", label: "Access & Inclusion", icon: "🌍", color: "#d97706",
    desc: "Reach the last mile, rural youth, and marginalized communities.",
    pros: ["CSR alignment", "Social ROI"],
    cons: ["Higher cost per student"],
    kpiPool: [
      { id: "total_learners", label: "Total Learners / Year", base: 500, unit: "" },
      { id: "women_pct", label: "Women Participation (%)", base: 30, unit: "%" },
      { id: "rural_pct", label: "Rural Learners (%)", base: 20, unit: "%" },
      { id: "firstgen_pct", label: "First-Gen Learners (%)", base: 25, unit: "%" },
      { id: "marginalized_pct", label: "Marginalized Communities (%)", base: 20, unit: "%" },
      { id: "scholarship_pct", label: "Students on Scholarship (%)", base: 15, unit: "%" },
      { id: "completion_rate", label: "Course Completion (%)", base: 55, unit: "%" },
      { id: "dropout_rate", label: "Dropout Rate (%)", base: 25, unit: "%", inverse: true },
      { id: "student_sat", label: "Student Satisfaction", base: 60, unit: "pts" },
      { id: "placement_rate", label: "Placement Rate (%)", base: 35, unit: "%" },
      { id: "women_income_uplift", label: "Women Income Uplift (%)", base: 10, unit: "%" },
      { id: "local_lang_pct", label: "Courses in Local Language (%)", base: 20, unit: "%" },
    ],
    endGoals: [
      { id: "rural_reach", label: "Deep Rural Penetration", desc: "50%+ rural learners, 3 states covered", kpiTargets: { rural_pct: 50, total_learners: 5000, local_lang_pct: 60 } },
      { id: "mass_inclusion", label: "Mass Inclusion at Scale", desc: "40%+ marginalized, 80%+ completion", kpiTargets: { marginalized_pct: 40, completion_rate: 80, dropout_rate: 10 } },
    ],
    paramWeights: { capex: 0.3, trainer_hire: 0.8, trainer_dev: 0.7, tech: 0.5, mobilization: 1.4, digital_mkt: 0.4, industry_eng: 0.6, ops_team: 0.7, admin: 0.5, subsidy: 1.3 },
  },
  {
    id: "financial", label: "Financial Sustainability", icon: "📈", color: "#2563eb",
    desc: "Build a revenue-positive institute with strong unit economics.",
    pros: ["Private capital appeal", "Innovation driver"],
    cons: ["Inclusion risk"],
    kpiPool: [
      { id: "annual_revenue", label: "Annual Revenue (₹ Cr)", base: 2, unit: "Cr" },
      { id: "ebitda_margin", label: "EBITDA Margin (%)", base: -10, unit: "%" },
      { id: "cost_per_student", label: "Cost per Student (₹)", base: 25000, unit: "₹", inverse: true },
      { id: "fee_recovery", label: "Fee Recovery Rate (%)", base: 40, unit: "%" },
      { id: "rev_per_learner", label: "Revenue per Learner (₹)", base: 8000, unit: "₹" },
      { id: "learner_per_trainer", label: "Learners per Trainer", base: 15, unit: "" },
      { id: "centre_utilisation", label: "Centre Utilisation (%)", base: 45, unit: "%" },
      { id: "breakeven_progress", label: "Break-even Progress (%)", base: 10, unit: "%" },
      { id: "roi", label: "Return on Investment (%)", base: -5, unit: "%" },
    ],
    endGoals: [
      { id: "breakeven_fast", label: "Break-Even by Year 3", desc: "EBITDA positive by Y3, 15% margin by Y5", kpiTargets: { ebitda_margin: 15, breakeven_progress: 100, roi: 20 } },
      { id: "scale_revenue", label: "Revenue Scale Leader", desc: "₹50Cr+ annual revenue, 3+ streams", kpiTargets: { annual_revenue: 50, breakeven_progress: 100 } },
    ],
    paramWeights: { capex: 0.7, trainer_hire: 0.9, trainer_dev: 0.5, tech: 1.1, mobilization: 0.6, digital_mkt: 1.0, industry_eng: 0.8, ops_team: 1.2, admin: 0.9, subsidy: 0.3 },
  }
];

const SECTORS = [
  { id: "manufacturing", label: "Manufacturing", salary: "₹14-16K/mo", capex: "High", govtPriority: 9, salaryMult: 1.10, placementMult: 1.15 },
  { id: "bfsi", label: "BFSI", salary: "₹14-18K/mo", capex: "Low", govtPriority: 7, salaryMult: 1.18, placementMult: 1.10 },
  { id: "it", label: "IT & Digital", salary: "₹12-20K/mo", capex: "Low", govtPriority: 8, salaryMult: 1.20, placementMult: 1.08 },
  { id: "healthcare", label: "Healthcare", salary: "₹12-15K/mo", capex: "Medium", govtPriority: 8, salaryMult: 1.05, placementMult: 1.08 },
  { id: "logistics", label: "Logistics", salary: "₹11-14K/mo", capex: "Low", govtPriority: 7, salaryMult: 1.00, placementMult: 1.05 },
];

const FUNDING_SOURCES = [
  { id: "csr", label: "CSR Grant", icon: "🤝", budgetMult: 1.0, kpiBonus: { women_pct: 5, marginalized_pct: 5 } },
  { id: "govt", label: "Government", icon: "🏛️", budgetMult: 1.15, kpiBonus: { placement_rate: 5, total_learners: 200 } },
  { id: "investor", label: "Investor", icon: "💼", budgetMult: 1.25, kpiBonus: { annual_revenue: 3, ebitda_margin: 3 } },
];

const DELIVERY_MODES = [
  { id: "classroom", label: "Classroom", icon: "🏫", capexMult: 1.2 },
  { id: "online_live", label: "Online Live", icon: "📡", capexMult: 0.6 },
  { id: "hybrid", label: "Hybrid", icon: "🔀", capexMult: 0.9 },
];

const YEAR_EVENTS = [
  { year: 1, name: "Year 1: Setup", desc: "Establishing basic operations.", mod: 1.0, sectorMod: {} },
  { year: 2, name: "Manufacturing Surge", desc: "Global firms shift production. Manufacturing demand +20%.", mod: 1.05, sectorMod: { manufacturing: 1.20, logistics: 1.10 } },
  { year: 3, name: "Policy Shift", desc: "Digital skilling receives massive boost. IT sector +10%.", mod: 0.95, sectorMod: { it: 1.10 } },
  { year: 4, name: "Recession Signal", desc: "IT hiring freeze. Healthcare remains steady.", mod: 0.88, sectorMod: { it: 0.75, healthcare: 1.05 } },
  { year: 5, name: "AI Integration Wave", desc: "New job roles emerge. IT sector demand bounces back.", mod: 1.08, sectorMod: { it: 1.15 } },
];

const PARAMS = [
  { id: "capex", label: "CapEx", icon: "🏗️", desc: "Labs, equipment, centres", color: "#0ea5e9" },
  { id: "trainer_hire", label: "Trainer Hiring", icon: "👩‍🏫", desc: "Faculty salaries & SMEs", color: "#8b5cf6" },
  { id: "trainer_dev", label: "Trainer Dev", icon: "📚", desc: "Upskilling & industry exposure", color: "#6366f1" },
  { id: "tech", label: "Technology", icon: "💻", desc: "LMS, digital tools", color: "#0284c7" },
  { id: "mobilization", label: "Mobilization", icon: "🚌", desc: "On-ground outreach", color: "#d97706" },
  { id: "industry_eng", label: "Industry Eng", icon: "🏭", desc: "Employer relations", color: "#059669" },
  { id: "ops_team", label: "Operations", icon: "⚙️", desc: "PMs, MIS & compliance", color: "#475569" },
  { id: "subsidy", label: "Scholarships", icon: "🎓", desc: "Incentives & stipends", color: "#f59e0b" },
];

const getCadence = (year) => {
  if (year <= 2) return { periods: 1, label: "Annual", pLabel: (i) => `Year ${year}` };
  if (year <= 4) return { periods: 2, label: "Half-Yearly", pLabel: (i) => `H${i + 1} · Y${year}` };
  return { periods: 4, label: "Quarterly", pLabel: (i) => `Q${i + 1} · Y${year}` };
};

// ═══════════════════════════════════════════════════════
//  SIMULATION LOGIC
// ═══════════════════════════════════════════════════════
function simulateYear({ kpis, params, archetype, sectors, fundingSource, deliveryMode, year, stress }) {
  const arch = ARCHETYPES.find(a => a.id === archetype);
  const event = YEAR_EVENTS.find(e => e.year === year) || YEAR_EVENTS[0];
  const total = Object.values(params).reduce((s, v) => s + v, 0) || 100;
  const np = {}; Object.keys(params).forEach(k => { np[k] = params[k] / total; });

  // Stress logic
  let newStress = stress;
  if (np.trainer_hire < 0.08) newStress = Math.min(10, newStress + 2.0);
  else newStress = Math.max(0, newStress - 0.5);
  const stressMult = newStress > 7 ? 0.82 : 1.0;

  // Sector mods
  let sectorSalMult = 1.0, sectorPlaceMult = 1.0;
  sectors.forEach(sid => {
    const s = SECTORS.find(x => x.id === sid);
    if (s) { sectorSalMult += (s.salaryMult - 1); sectorPlaceMult += (s.placementMult - 1); }
  });

  const evtMod = event.mod * (event.sectorMod[sectors[0]] || 1.0);

  // Performance weights
  const fI = np.industry_eng * arch.paramWeights.industry_eng;
  const fF = (np.trainer_hire * arch.paramWeights.trainer_hire) + (np.trainer_dev * arch.paramWeights.trainer_dev);
  const fO = np.mobilization * arch.paramWeights.mobilization;
  const fT = np.tech * arch.paramWeights.tech;
  const fS = np.subsidy * arch.paramWeights.subsidy;

  const rawDeltas = {
    placement_rate: (fI * 15 + fF * 8 + fO * 5) * sectorPlaceMult * evtMod * stressMult,
    retention_12: (fF * 12 + fS * 8) * stressMult,
    soqs: (fF * 11 + fI * 10) * sectorSalMult * stressMult,
    total_learners: (fO * 500 + fS * 300),
    women_pct: (fO * 8 + fS * 6),
    annual_revenue: (fO * 4 + fI * 3) * evtMod,
    ebitda_margin: (np.ops_team * 10 - np.capex * 5),
    completion_rate: (fF * 10 + fS * 5) * stressMult,
    cost_per_student: -(np.tech * 1500),
  };

  const SCALE = 0.08;
  const newKpis = { ...kpis };
  let totalDelta = 0;
  let count = 0;

  Object.keys(kpis).forEach(k => {
    const d = (rawDeltas[k] || 10) * SCALE;
    const def = ARCHETYPES.flatMap(a => a.kpiPool).find(kp => kp.id === k);
    const before = kpis[k];
    newKpis[k] = Math.round((before + d) * 10) / 10;
    
    // Calculate performance quality (0-100)
    // Benchmark: improving a KPI by 8% of its current value per period is "Perfect"
    const benchmark = before * 0.08 || 5;
    const kpiScore = Math.max(0, Math.min(100, (d / benchmark) * 100));
    totalDelta += kpiScore;
    count++;
  });

  const yearScore = Math.round(totalDelta / count);
  const nextBudget = Math.max(70, Math.min(160, 100 + (yearScore - 50) * 0.5));

  return { newKpis, newStress, yearScore, nextBudget };
}

// Live calculation for the dashboard chart
function getProjectedDeltas({ params, archetype, selectedKPIs, kpis }) {
  const arch = ARCHETYPES.find(a => a.id === archetype);
  const total = Object.values(params).reduce((s, v) => s + v, 0) || 100;
  const np = {}; Object.keys(params).forEach(k => { np[k] = params[k] / total; });
  
  const fI = np.industry_eng * arch.paramWeights.industry_eng;
  const fF = (np.trainer_hire * arch.paramWeights.trainer_hire) + (np.trainer_dev * arch.paramWeights.trainer_dev);
  
  const raw = {
    placement_rate: fI * 15 + fF * 8, retention_12: fF * 12, soqs: fF * 11 + fI * 10,
    total_learners: np.mobilization * 500, women_pct: np.mobilization * 8,
    annual_revenue: np.mobilization * 4 + fI * 3, ebitda_margin: np.ops_team * 10 - np.capex * 5,
    completion_rate: fF * 10, cost_per_student: -np.tech * 1500
  };

  const result = {};
  selectedKPIs.forEach(id => {
    const val = raw[id] || 2;
    // Map raw value to a 0-100 impact bar
    result[id] = Math.max(5, Math.min(100, (Math.abs(val) / 25) * 100));
  });
  return result;
}

// ═══════════════════════════════════════════════════════
//  UI COMPONENTS
// ═══════════════════════════════════════════════════════

function ColorSlider({ param, value, onChange }) {
  const pct = (value / 40) * 100;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
        <span>{param.icon} {param.label}</span>
        <span style={{ fontFamily: T.mono, color: param.color }}>{value}%</span>
      </div>
      <div style={{ position: "relative", height: 6, background: T.track, borderRadius: 3 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: param.color, borderRadius: 3, transition: "width 0.1s" }} />
        <input type="range" min={0} max={40} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", top: -7, left: 0, width: "100%", opacity: 0, cursor: "pointer" }} />
        <div style={{ position: "absolute", top: -5, left: `calc(${pct}% - 8px)`, width: 16, height: 16, borderRadius: "50%", background: "#fff", border: `2px solid ${param.color}`, pointerEvents: "none" }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SCREENS
// ═══════════════════════════════════════════════════════

function KPISelectionStep({ archetype, onNext }) {
  const a = ARCHETYPES.find(x => x.id === archetype);
  const [selected, setSelected] = useState([]);
  const toggle = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
    else if (selected.length < 10) setSelected([...selected, id]);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
      <StepIndicator current={2} />
      <h2 style={{ textAlign: "center", fontWeight: 800 }}>Select 10 Performance Metrics</h2>
      <p style={{ textAlign: "center", color: T.textMuted }}>These KPIs will define your 5-year legacy.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginTop: 24 }}>
        {a.kpiPool.map(kpi => (
          <div key={kpi.id} onClick={() => toggle(kpi.id)} style={mkCard(a.color, selected.includes(kpi.id))}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{kpi.label}</div>
            <div style={{ fontSize: 11, color: T.textFaint }}>Base: {kpi.base}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, textAlign: "right" }}>
        <button disabled={selected.length < 10} onClick={() => onNext({ selectedKPIs: selected, kpiPool: a.kpiPool })} style={mkBtn(a.color)}>Next: Sectors →</button>
      </div>
    </div>
  );
}

function YearPlay({ gameState, onYearComplete }) {
  const { year, archetype, budget, kpis, selectedKPIs, stress, kpiPool } = gameState;
  const a = ARCHETYPES.find(x => x.id === archetype);
  const cadence = getCadence(year);
  const [period, setPeriod] = useState(0);
  const [periodKpis, setPeriodKpis] = useState(kpis);
  const [periodStress, setPeriodStress] = useState(stress);
  const [periodHistory, setPeriodHistory] = useState([]);
  const [params, setParams] = useState(() => { const i = {}; PARAMS.forEach(p => { i[p.id] = 10; }); return i; });

  const totalAlloc = Object.values(params).reduce((s, v) => s + v, 0);
  const projected = getProjectedDeltas({ params, archetype, selectedKPIs, kpis: periodKpis });

  const commitPeriod = () => {
    const result = simulateYear({ ...gameState, kpis: periodKpis, params, stress: periodStress });
    const newHist = [...periodHistory, { period, result }];
    setPeriodHistory(newHist);
    setPeriodKpis(result.newKpis);
    setPeriodStress(result.newStress);
    if (period + 1 >= cadence.periods) {
      const avgScore = Math.round(newHist.reduce((s, h) => s + h.result.yearScore, 0) / newHist.length);
      onYearComplete({ finalKpis: result.newKpis, finalStress: result.newStress, nextBudget: result.nextBudget, yearScore: avgScore });
    } else {
      setPeriod(period + 1);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "20px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}`, paddingBottom: 15 }}>
        <div>
          <span style={mkPill(a.color)}>Fiscal Year {year}</span>
          <h2 style={{ fontWeight: 800, margin: "5px 0" }}>{cadence.pLabel(period)} Allocation</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: T.textFaint, fontWeight: 700 }}>AVAILABLE BUDGET</div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: T.mono }}>₹{budget.toFixed(1)} Cr</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
        {/* LEFT PANEL: PERMANENT KPI SCORECARD */}
        <div style={mkCard()}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.textMuted, marginBottom: 20 }}>INSTITUTIONAL PERFORMANCE</h3>
          <div style={{ overflowY: "auto", maxHeight: 500 }}>
            {selectedKPIs.map(id => {
              const def = kpiPool.find(k => k.id === id);
              return <KPIBar key={id} label={def.label} value={periodKpis[id]} color={a.color} inverse={def.inverse} />;
            })}
          </div>
        </div>

        {/* RIGHT PANEL: SLIDERS + LIVE IMPACT CHART */}
        <div style={mkCard()}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.textMuted }}>STRATEGIC CONTROLS</h3>
            <span style={mkPill(Math.abs(totalAlloc - 100) < 1 ? "#059669" : "#dc2626")}>{totalAlloc}/100 Units</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            {PARAMS.map(p => <ColorSlider key={p.id} param={p} value={params[p.id]} onChange={v => setParams(prev => ({ ...prev, [p.id]: v }))} />)}
          </div>
          
          <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 20, paddingTop: 20 }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: T.textFaint, marginBottom: 15 }}>LIVE ALLOCATION IMPACT</h4>
            {selectedKPIs.slice(0, 6).map(id => {
              const def = kpiPool.find(k => k.id === id);
              const score = projected[id] || 0;
              return (
                <div key={id} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, marginBottom: 3 }}>
                    <span>{def.label}</span>
                    <span style={{ color: a.color }}>{score >= 60 ? "STRONG" : score >= 30 ? "MODERATE" : "WEAK"}</span>
                  </div>
                  <div style={{ height: 4, background: T.track, borderRadius: 2 }}>
                    <div style={{ width: `${score}%`, height: "100%", background: a.color, borderRadius: 2, transition: "width 0.2s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: "right" }}>
        <button onClick={commitPeriod} disabled={Math.abs(totalAlloc - 100) > 2} style={{ ...mkBtn(a.color), padding: "14px 60px", fontSize: 15 }}>
          Commit Strategy →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN CONTROLLER (Logic preserved)
// ═══════════════════════════════════════════════════════

export default function InstituteCommand() {
  const [screen, setScreen] = useState("welcome");
  const [gs, setGs] = useState({});
  const [history, setHistory] = useState([]);
  const [lastYear, setLastYear] = useState(null);

  const handleSetup = (step, data) => {
    if (step === "archetype") { setGs(g => ({ ...g, ...data })); setScreen("kpi_select"); }
    else if (step === "kpis") { setGs(g => ({ ...g, ...data })); setScreen("sectors"); }
    else if (step === "sectors") { setGs(g => ({ ...g, ...data })); setScreen("funding"); }
    else if (step === "funding") {
      const funder = FUNDING_SOURCES.find(f => f.id === data.fundingSource);
      const kpis = {}; data.selectedKPIs.forEach(id => { kpis[id] = gs.kpiPool.find(k => k.id === id).base; });
      setGs(g => ({ ...g, ...data, year: 1, budget: 100 * (funder.budgetMult), stress: 0, kpis }));
      setScreen("year");
    }
  };

  const handleYearComplete = (res) => {
    setLastYear(res);
    setGs(g => ({ ...g, kpis: res.finalKpis, stress: res.finalStress, budget: res.nextBudget }));
    setHistory(h => [...h, res]);
    setScreen("year_result");
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.text }}>
      {screen === "welcome" && <Welcome onStart={() => setScreen("archetype")} />}
      {screen === "archetype" && <ArchetypeStep onNext={d => handleSetup("archetype", d)} />}
      {screen === "kpi_select" && <KPISelectionStep archetype={gs.archetype} onNext={d => handleSetup("kpis", d)} />}
      {screen === "sectors" && <SectorStep archetype={gs.archetype} onNext={d => handleSetup("sectors", d)} />}
      {screen === "funding" && <FundingStep archetype={gs.archetype} sectors={gs.sectors} onNext={d => handleSetup("funding", d)} />}
      {screen === "year" && <YearPlay gameState={gs} onYearComplete={handleYearComplete} />}
      {screen === "year_result" && <YearResult result={lastYear} year={gs.year} gs={gs} onNext={() => gs.year >= 5 ? setScreen("final") : (setGs(g => ({ ...g, year: g.year + 1 })), setScreen("year"))} />}
      {screen === "final" && <FinalResults gs={gs} history={history} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  UTILITIES & WRAPPERS
// ═══════════════════════════════════════════════════════

function StepIndicator({ current }) {
  const steps = ["Vision", "KPIs", "Sectors", "Funding", "Simulation"];
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 4, background: i + 1 <= current ? T.primary : T.border, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{i + 1}</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: i + 1 === current ? T.text : T.textFaint }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

function ArchetypeStep({ onNext }) {
  const [sel, setSel] = useState(null);
  const [goal, setGoal] = useState(null);
  const a = ARCHETYPES.find(x => x.id === sel);
  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
      <StepIndicator current={1} />
      <h2 style={{ textAlign: "center", fontWeight: 800 }}>Choose Your Institutional Vision</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 15, marginTop: 30 }}>
        {ARCHETYPES.map(x => (
          <div key={x.id} onClick={() => setSel(x.id)} style={mkCard(x.color, sel === x.id)}>
            <div style={{ fontSize: 24 }}>{x.icon}</div>
            <h3 style={{ fontSize: 15, margin: "10px 0" }}>{x.label}</h3>
            <p style={{ fontSize: 12, color: T.textMuted }}>{x.desc}</p>
          </div>
        ))}
      </div>
      {a && (
        <div style={{ marginTop: 30, background: T.surfaceAlt, padding: 20, borderRadius: 8 }}>
          <h4 style={{ fontSize: 11, fontWeight: 800, color: T.textFaint, marginBottom: 15 }}>SELECT END GOAL</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {a.endGoals.map(g => (
              <div key={g.id} onClick={() => setGoal(g.id)} style={mkCard(a.color, goal === g.id)}>
                <div style={{ fontWeight: 700 }}>{g.label}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: 32, textAlign: "right" }}>
        <button disabled={!goal} onClick={() => onNext({ archetype: sel, endGoal: goal })} style={mkBtn(a?.color || T.border)}>Next: KPIs →</button>
      </div>
    </div>
  );
}

function SectorStep({ onNext }) {
  const [sel, setSel] = useState([]);
  const toggle = (id) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : s.length < 2 ? [...s, id] : s);
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
      <StepIndicator current={3} />
      <h2 style={{ textAlign: "center", fontWeight: 800 }}>Select Market Sectors (Max 2)</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 15, marginTop: 30 }}>
        {SECTORS.map(s => (
          <div key={s.id} onClick={() => toggle(s.id)} style={mkCard(T.primary, sel.includes(s.id))}>
            <div style={{ fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: 11 }}>Start Salary: {s.salary}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, textAlign: "right" }}>
        <button disabled={sel.length === 0} onClick={() => onNext({ sectors: sel })} style={mkBtn(T.primary)}>Next: Funding →</button>
      </div>
    </div>
  );
}

function FundingStep({ onNext }) {
  const [fund, setFund] = useState(null);
  const [mode, setMode] = useState(null);
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
      <StepIndicator current={4} />
      <h2 style={{ textAlign: "center", fontWeight: 800 }}>Capital & Delivery</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 30 }}>
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 800, color: T.textFaint, marginBottom: 15 }}>FUNDING SOURCE</h4>
          {FUNDING_SOURCES.map(f => (
            <div key={f.id} onClick={() => setFund(f.id)} style={{ ...mkCard(T.primary, fund === f.id), marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>{f.icon} {f.label}</div>
              <div style={{ fontSize: 11 }}>Budget Multiplier: {f.budgetMult}x</div>
            </div>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 800, color: T.textFaint, marginBottom: 15 }}>DELIVERY MODE</h4>
          {DELIVERY_MODES.map(m => (
            <div key={m.id} onClick={() => setMode(m.id)} style={{ ...mkCard(T.primary, mode === m.id), marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>{m.icon} {m.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 32, textAlign: "right" }}>
        <button disabled={!fund || !mode} onClick={() => onNext({ fundingSource: fund, deliveryMode: mode })} style={mkBtn(T.primary)}>Start Year 1 →</button>
      </div>
    </div>
  );
}

function KPIBar({ label, value, color, inverse, targetVal }) {
  const pct = inverse ? 100 - value : value;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ fontFamily: T.mono, color }}>{value.toFixed(1)}</span>
      </div>
      <div style={{ height: 6, background: T.track, borderRadius: 3 }}>
        <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

function YearResult({ result, year, gs, onNext }) {
  const a = ARCHETYPES.find(x => x.id === gs.archetype);
  const color = result.yearScore >= 60 ? "#059669" : "#d97706";
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", textAlign: "center" }}>
      <span style={mkPill(color)}>YEAR {year} PERFORMANCE REVIEW</span>
      <h2 style={{ fontSize: 80, fontWeight: 800, margin: "20px 0", color }}>{result.yearScore}%</h2>
      <p style={{ color: T.textMuted }}>Overall strategy execution score based on KPI progression.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginTop: 40 }}>
        <div style={mkCard()}>
          <div style={{ fontSize: 11, color: T.textFaint, fontWeight: 700 }}>STRESS LEVEL</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{result.finalStress.toFixed(1)}/10</div>
        </div>
        <div style={mkCard()}>
          <div style={{ fontSize: 11, color: T.textFaint, fontWeight: 700 }}>NEXT BUDGET</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>₹{result.nextBudget.toFixed(1)} Cr</div>
        </div>
      </div>
      <button onClick={onNext} style={{ ...mkBtn(a.color), marginTop: 40, padding: "14px 60px" }}>Continue to Next Phase →</button>
    </div>
  );
}

function FinalResults({ gs, history }) {
  const overall = Math.round(history.reduce((s, h) => s + h.yearScore, 0) / 5);
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", textAlign: "center" }}>
      <h1 style={{ fontSize: 40, fontWeight: 800 }}>Simulation Complete</h1>
      <h2 style={{ fontSize: 100, fontWeight: 800, color: T.primary }}>{overall}%</h2>
      <p>Institutional Strategic Health Grade</p>
      <button onClick={() => window.location.reload()} style={{ ...mkBtn(T.primary), marginTop: 40 }}>Restart Simulation</button>
    </div>
  );
}

const mkBtnStyle = (color) => ({ background: color, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 6, fontWeight: 700, cursor: "pointer" });
const mkCardStyle = (color, sel) => ({ background: "#fff", padding: 20, borderRadius: 8, border: `2px solid ${sel ? color : "#e2e8f0"}`, cursor: "pointer" });
