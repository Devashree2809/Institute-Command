import React, { useState, useMemo, useCallback } from "react"; trainer_hire: 1.0, trainer_dev: 0.9, tech: 0.4, mobilization: 0.7, digital_mkt: 0.5, industry_eng: 1.2, ops_team:

// ═══════════════════════════════════════════════════════
//  DESIGN SYSTEM & TOKENS
// ════ 0.6, admin: 0.3, subsidy: 0.5 },
  },
  {
    id: "inclusion", label: "Access & Inclusion", icon: "🌍", color: "#d═══════════════════════════════════════════════════
const T = {
  bg: "#f8fafc",
  surface: "#ffffff",
  surfaceAlt: "#f1f5f997706",
    desc: "Reach the last mile, rural youth, and marginalized communities.",
    ",
  border: "#e2e8f0",
  text: "#0f172a",
  textMuted: "#64748b",
  textFaint: "#94a3b8",
  track: "#e2e8f0",
  primary: "#2563eb",
  font: "'Inter', -apple-system, sans-serif",
  mono:kpiPool: [
      { id: "total_learners", label: "Total Learners / Year", base: 500, unit: "" },
      { id: "women_pct", label: "Women Participation (%)", base: 30, unit: "%" },
      { id: "rural_pct "'JetBrains Mono', 'Roboto Mono', monospace",
};

const mkPill = (color, bg) => ({
  background: bg", label: "Rural Learners (%)", base: 20, unit: "%" },
      { id: "marginalized_pct", label: "Marginalized Communities (%)", base: 20, unit: "%" },
 || color + "18",
  color,
  borderRadius: 4,
  padding: "3px 9px",      { id: "scholarship_pct", label: "Students on Scholarship (%)", base: 15, unit: "%" },

  fontSize: 10,
  fontWeight: 600,
  fontFamily: T.      { id: "completion_rate", label: "Course Completion (%)", base: 55, unit:mono,
  display: "inline-flex",
  alignItems: "center",
  textTransform: "uppercase",
  letter "%" },
      { id: "dropout_rate", label: "Dropout Rate (%)", base: 2Spacing: "0.04em",
  border: `1px solid ${color}30`
5, unit: "%", inverse: true },
      { id: "student_sat", label: "Student});

const mkCard = (bColor, sel) => ({
  background: T.surface,
   Satisfaction", base: 60, unit: "pts" },
      { id: "placement_rate",border: sel ? `2px solid ${bColor}` : `1px solid ${T.border}`,
  borderRadius: 8,
 label: "Placement Rate (%)", base: 35, unit: "%" },
      { id: "  padding: "18px 20px",
  boxShadow: sel ? `0 4px 12px ${bColorlocal_lang_pct", label: "Local Lang Courses (%)", base: 20, unit: "%" },
      }15` : "0 1px 2px rgba(0,0,0,0.05)",
  transition: "{ id: "marginalized_placement", label: "Marginalized Placement (%)", base: 25,all 0.2s ease",
  display: "flex",
  flexDirection: "column"
});

const mkBtn = ( unit: "%" },
      { id: "women_income_uplift", label: "Women Income Uplcolor, outline) => ({
  background: outline ? "transparent" : color,
  color: outline ?ift (%)", base: 10, unit: "%" },
      { id: "firstgen_pct color : "#fff",
  border: `1px solid ${color}`,
  borderRadius: 6,
", label: "First-Gen Learners (%)", base: 25, unit: "%" },
    ],
    endGoals: [
      { id: "rural_reach", label: "Deep Rural Reach", desc  padding: "10px 20px",
  fontWeight: 600,
  fontFamily: T.font,
  cursor: "pointer",
  fontSize: 13,
  display: "50%+ rural learners, 3 states", kpiTargets: { rural_pct: 50, total_learn: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  ers: 5000 } },
      { id: "gender_equity", label: "Gender Equitygap: 6,
});

// ═══════════════════════════════════════════════════════
//  GAME DATA", desc: "55%+ women participation", kpiTargets: { women_pct: 55, women_income_uplift: 25 } },
    ],
    paramWeights: { capex: 
// ═══════════════════════════════════════════════════════
const ARCHETYPES = [
  {
0.3, trainer_hire: 0.8, trainer_dev: 0.7, tech:    id: "employment", label: "Sustainable Employment", icon: "🎯", color: "#0596 0.5, mobilization: 1.4, digital_mkt: 0.4, industry_eng: 0.6, ops_team: 0.7, admin: 0.5, subsidy69",
    desc: "Focus on long-term retention and employer trust over a 24-month horizon: 1.3 },
  }
];

const SECTORS = [
  { id: "manufacturing.",
    paramWeights: { capex: 0.5, trainer_hire: 1.0, trainer_dev: 0.9, tech: 0.4, mobilization: 0.7, digital_mkt:", label: "Manufacturing", salary: "₹14-16K/mo", salaryMult: 1.10, 0.5, industry_eng: 1.2, ops_team: 0.6, admin placementMult: 1.15 },
  { id: "it", label: "IT & Digital",: 0.3, subsidy: 0.5 },
    kpiPool: [
      { id salary: "₹12-20K/mo", salaryMult: 1.20, placementMult: 1.08 },
  { id: "healthcare", label: "Healthcare", salary: "₹: "placement_rate", label: "Placement Rate (%)", base: 40, unit: "%" },
      { id12-15K/mo", salaryMult: 1.05, placementMult: 1.: "retention_12", label: "12-Month Retention (%)", base: 50, unit: "%" },
      { id: "retention_24", label: "24-Month08 },
];

const FUNDING_SOURCES = [
  { id: "csr", label: "CSR Grant", icon: "🤝", budgetMult: 1.0 },
  { id: "govt", label: "Government", icon: "🏛️", budgetMult: 1.15 },
  { id Retention (%)", base: 40, unit: "%" },
      { id: "soqs", label: "Salary Quality Score", base: 50, unit: "pts" },
      { id: "employer_repeat", label: "Employer Repeat Hiring (%)", base: 30, unit: "%" },
      {: "investor", label: "Investor", icon: "💼", budgetMult: 1.25 }, id: "employer_sat", label: "Employer Satisfaction", base: 55, unit: "pts"
];

const DELIVERY_MODES = [
  { id: "classroom", label: "Classroom", icon: "🏫" },
  { id: "online_live", label: "Online Live", icon: "📡" },
  { id: "hybrid", label: "Hybrid", icon: "🔀" },
]; },
      { id: "job_dropoff", label: "Job Drop-off <6M (%)", base: 30, unit: "%", inverse: true },
      { id: "role_alignment",

const YEAR_EVENTS = [
  { year: 1, name: "Year 1: Startup", desc label: "Role-Training Alignment (%)", base: 45, unit: "%" },
      { id: "job: "Establishing basic operations.", mod: 1.0, sectorMod: {} },
  { year: 2, name:_satisfaction", label: "Learner Job Satisfaction", base: 55, unit: "pts" },
      { id: "avg_salary", label: "Avg Starting Salary (LPA)", base: 3.5, unit: "L" },
    ],
    endGoals: [
      { id: " "Market Shift", desc: "Demand for certified talent increases.", mod: 1.05, sectorMod: {} },mass_placement", label: "Mass Placement", desc: "80%+ placement with diverse employer base", kpiTargets: {
  { year: 3, name: "Policy Boost", desc: "Government increases skilling subsidies.", mod: 0. placement_rate: 80, retention_12: 70 } },
      { id: "95, sectorMod: {} },
  { year: 4, name: "Economic Correction", desc:salary_excellence", label: "Premium Salaries", desc: "Avg 10 LPA with strong 24-month retention", kpiTargets: { avg_salary: 10, retention_24: 70 "General hiring slowdown.", mod: 0.88, sectorMod: {} },
  { year: 5, name: } },
    ]
  },
  {
    id: "inclusion", label: "Access & Inclusion", icon: "🌍", "AI Surge", desc: "Demand for future-skills doubles.", mod: 1.08, sectorMod: {} },
 color: "#d97706",
    desc: "Reach the last mile, rural youth, and marginalized communities.",
    ];

const PARAMS = [
  { id: "capex", label: "CapEx", icon:paramWeights: { capex: 0.3, trainer_hire: 0.8, trainer_dev "🏗️", desc: "Labs & equipment", color: "#0ea5e9" },
  { id:: 0.7, tech: 0.5, mobilization: 1.4, digital_mkt "trainer_hire", label: "Faculty", icon: "👩‍🏫", desc: "Trainer salaries", color: "#8b5: 0.4, industry_eng: 0.6, ops_team: 0.7, admin: 0.5, subsidy: 1.3 },
    kpiPool: [
      {cf6" },
  { id: "trainer_dev", label: "Training", icon: "📚", id: "total_learners", label: "Total Learners / Year", base: 500, unit: "" },
      { id: "women_pct", label: "Women Participation (%)", base: 3 desc: "Faculty upskilling", color: "#6366f1" },
  { id: "tech", label:0, unit: "%" },
      { id: "rural_pct", label: "Rural Learners (%)", "Tech Stack", icon: "💻", desc: "LMS & Tracking", color: "#0284c7" },
  { id: "mobilization", label: "Mobilization", icon: "🚌", base: 20, unit: "%" },
      { id: "marginalized_pct", label: "Marginal desc: "Field outreach", color: "#d97706" },
  { id: "industryized Communities (%)", base: 20, unit: "%" },
      { id: "scholarship_pct", label: "Students on Scholarship (%)", base: 15, unit: "%" },
      {_eng", label: "Employer Relations", icon: "🏭", desc: "Placement tie-ups", color: "#05 id: "completion_rate", label: "Course Completion (%)", base: 55, unit: "%"9669" },
  { id: "ops_team", label: "Operations", icon: " },
      { id: "dropout_rate", label: "Dropout Rate (%)", base: 25,⚙️", desc: "MIS & compliance", color: "#475569" },
  { id unit: "%", inverse: true },
      { id: "student_sat", label: "Student Satisfaction", base: 60, unit: "pts" },
      { id: "placement_rate", label:: "subsidy", label: "Student Support", icon: "🎓", desc: "Incentives & Scholarships "Placement Rate (%)", base: 35, unit: "%" },
      { id: "local_lang_pct", label: "Courses in Local Language (%)", base: 20, unit: "%" },", color: "#f59e0b" },
];

const getCadence = (year) => {
  if (year <= 2) return { periods: 1, label: "Annual decision", pLabel: (i) =>
    ],
    endGoals: [
      { id: "rural_reach", label: "Rural Reach", desc: "50%+ `Year ${year}` };
  if (year <= 4) return { periods: 2, label: rural learners, 3 states covered", kpiTargets: { rural_pct: 50, total_learners: 5000 } },
      { id: "mass_inclusion", label: "Mass Inclusion", desc: "40%+ "Half-Yearly decisions", pLabel: (i) => `H${i + 1} - Year ${year}` };
   marginalized, 80%+ completion", kpiTargets: { marginalized_pct: 40, completion_rate: 80 } },
return { periods: 4, label: "Quarterly decisions", pLabel: (i) => `Q${i + 1} - Year ${year}` };
};

// ════════════════════════════════    ]
  },
  {
    id: "financial", label: "Financial Sustainability", icon: "📈", color: "#2563eb",
    desc: "Build a revenue-positive institute with strong═══════════════════════
//  LOGIC & ENGINE
// ════════════════════════════════ unit economics.",
    paramWeights: { capex: 0.7, trainer_hire: 0.═══════════════════════
function simulateYear({ kpis, params, archetype, year, stress }) {
  const9, trainer_dev: 0.5, tech: 1.1, mobilization: 0.6 arch = ARCHETYPES.find(a => a.id === archetype);
  const event = YEAR_EVENTS.find(e, digital_mkt: 1.0, industry_eng: 0.8, ops_team: => e.year === year) || YEAR_EVENTS[0];
  const total = Object.values(params 1.2, admin: 0.9, subsidy: 0.3 },
    kpiPool).reduce((s, v) => s + v, 0) || 100;
  const: [
      { id: "annual_revenue", label: "Annual Revenue (₹ Cr)", base:  np = {}; Object.keys(params).forEach(k => { np[k] = params[k] /2, unit: "Cr" },
      { id: "ebitda_margin", label: "EBITDA Margin (%)", base: total; });

  let newStress = stress;
  if (np.trainer_hire < 0. -10, unit: "%" },
      { id: "cost_per_student", label: "08) newStress = Math.min(10, newStress + 1.5);
  elseCost per Student (₹)", base: 25000, unit: "₹", inverse: true }, newStress = Math.max(0, newStress - 0.5);

  const SCALE = 0.09
      { id: "fee_recovery", label: "Fee Recovery Rate (%)", base: 40,;
  const newKpis = { ...kpis };
  let performanceSum = 0;

  Object. unit: "%" },
      { id: "rev_per_learner", label: "Revenue per Learner (₹)", base: 8000, unit: "₹" },
      { id: "learnerkeys(kpis).forEach(k => {
    const change = (np.trainer_hire * 15_per_trainer", label: "Learners per Trainer", base: 15, unit: "" },
 + np.industry_eng * 10 + np.tech * 5) * event.mod * SCALE;
    newKpis[      { id: "centre_utilisation", label: "Centre Utilisation (%)", base: 45, unit: "%" },
      { id: "breakeven_progress", label: "Break-even Progress (%)k] = Math.round((kpis[k] + change) * 10) / 10;
    if (newKpis[k] > 100) newKpis[k] = 100", base: 10, unit: "%" },
      { id: "roi", label: "Return on Investment (%)", base: -5, unit: "%" },
    ],
    endGoals: [
      { id: "breakeven_fast", label: "Fast Break-Even", desc: "EBITDA positive by Y3, ;

    // Correct performance index logic: How well did you improve compared to an 8% benchmark?
    const benchmark = k15% margin by Y5", kpiTargets: { ebitda_margin: 15, breakeven_progress: 100 } },
      { id: "scale_revenue", label: "pis[k] * 0.05 || 5;
    const score = Math.min(100,Revenue Scale", desc: "₹50Cr+ annual revenue, strong recovery", kpiTargets: { annual_revenue: 50, bre Math.max(0, (change / benchmark) * 100));
    performanceSum += score;
  });

  const yearakeven_progress: 100 } },
    ]
  }
];

const SECTORSScore = Math.round(performanceSum / Object.keys(kpis).length);
  const nextBudget = = [
  { id: "manufacturing", label: "Manufacturing", salaryMult: 1.10, placement Math.max(70, Math.min(160, 100 + (yearScore - 50) * 0.5));

  return { newKpis, newStress, yearScore,Mult: 1.15 },
  { id: "bfsi", label: "BFSI", salaryMult: 1.18, placementMult: 1.10 },
  { id: "it nextBudget };
}

function getLiveImpact({ params, archetype, selectedKPIs }) {
  const arch =", label: "IT & Digital", salaryMult: 1.20, placementMult: 1.08 },
  { id: "healthcare", label: "Healthcare", salaryMult: 1.05, placementMult: 1.08 },
];

const FUNDING_SOURCES = [
  { id: ARCHETYPES.find(a => a.id === archetype);
  const results = {};
  selectedKPIs.forEach(id => {
    // Simplified logic for UI visualization
    const impact = (params.trainer_hire * "csr", label: "CSR Grant", icon: "🤝", budgetMult: 1.0 },
  { id: "govt", 1.5 + params.industry_eng * 1.2 + params.tech * 0.5);
    results label: "Government", icon: "🏛️", budgetMult: 1.15 },
  { id[id] = Math.min(100, (impact / 40) * 100);: "investor", label: "Impact Investor", icon: "💼", budgetMult: 1.30 },
];

const DELIVERY_
  });
  return results;
}

// ════════════════════════════════════════════MODES = [
  { id: "classroom", label: "Classroom", icon: "🏫" },
  { id: "online═══════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════

function Welcome({_live", label: "Online Live", icon: "📡" },
  { id: "hybrid", label onStart }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: ": "Blended/Hybrid", icon: "🔀" },
];

const PARAMS = [
  { id: "capex", label: "CapEx", icon: "🏗️", color: "#0ea5e9"center", justifyContent: "center", textAlign: "center", padding: 20 }}>
      <div style={{ maxWidth: 600 }}> },
  { id: "trainer_hire", label: "Faculty Salary", icon: "👩‍🏫", color: "#8b5cf6" },
  { id: "trainer_dev", label: "Faculty
        <h1 style={{ fontSize: 48, fontWeight: 800 }}>Institute<span style={{ color: T.primary Dev", icon: "📚", color: "#6366f1" },
  { id: " }}>Command</span></h1>
        <p style={{ fontSize: 18, color: T.textMuted,tech", label: "Technology", icon: "💻", color: "#0284c7" },
 margin: "20px 0" }}>Strategic planning simulator for skilling institutes.</p>
        <button onClick={onStart} style={  { id: "mobilization", label: "Enrollment", icon: "🚌", color: "#d9mkBtn(T.primary)}>Launch Strategy →</button>
      </div>
    </div>
  );
}

function7706" },
  { id: "industry_eng", label: "Placements", icon: "🏭", color ArchetypeStep({ onNext }) {
  const [sel, setSel] = useState(null);
  : "#059669" },
  { id: "ops_team", label: "Operationsconst [goal, setGoal] = useState(null);
  const a = ARCHETYPES.find(x", icon: "⚙️", color: "#475569" },
  { id: "subsidy", label: "Student => x.id === sel);
  return (
    <div style={{ maxWidth: 900, margin: "40 Aid", icon: "🎓", color: "#f59e0b" },
];

const getCadence = (year) => {
  if (year <= 2) return { periods: 1, labelpx auto", padding: "0 20px" }}>
      <h2 style={{ textAlign: "center", fontWeight: 8: "Annual", pLabel: (i) => `Year ${year}` };
  if (year <= 4) return { periods:00 }}>1. Choose Vision</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr  2, label: "Half-Yearly", pLabel: (i) => `H${i + 1fr", gap: 15, marginTop: 30 }}>
        {ARCHETYPES.map(x => (
          <div1} · Y${year}` };
  return { periods: 4, label: "Quarterly", p key={x.id} onClick={() => setSel(x.id)} style={mkCard(x.colorLabel: (i) => `Q${i + 1} · Y${year}` };
};

// ════════════════════, sel === x.id)}>
            <div style={{ fontSize: 24 }}>{x.icon}</div>
            <h3 style={{ margin: "10px 0" }}>{x.label}</h3>
            <p style═══════════════════════════════════
//  CORE SIMULATION LOGIC (FIXED PERFORMANCE INDEX)
// ════════════={{ fontSize: 12, color: T.textMuted }}>{x.desc}</p>
          </div>
        ))}═══════════════════════════════════════════

function simulateYear({ kpis, params, archetype, sectors, stress
      </div>
      {a && (
        <div style={{ marginTop: 20, background: T.surfaceAlt, padding:, year }) {
  const arch = ARCHETYPES.find(a => a.id === archetype);
  const total = Object.values(params).reduce((s, v) => s + v, 0) 20, borderRadius: 8 }}>
          <h4 style={{ fontSize: 11, fontWeight: 800, marginBottom: || 100;
  const np = {}; Object.keys(params).forEach(k => { np[k] = 10 }}>SELECT END GOAL</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr  params[k] / total; });

  // Stress calculation
  let newStress = stress;
  if1fr", gap: 10 }}>
            {a.endGoals.map(g => (
               (np.trainer_hire < 0.08) newStress = Math.min(10, new<div key={g.id} onClick={() => setGoal(g.id)} style={mkCard(aStress + 2);
  else newStress = Math.max(0, newStress - 0.5.color, goal === g.id)}>
                <div style={{ fontWeight: 700 }}>{g.label}</div>
                <div style={{ fontSize: 11 }}>{g.desc}</div>
              </div>
            ))}
);

  const stressPenalty = newStress > 7 ? 0.8 : 1.0;
  
          </div>
        </div>
      )}
      <div style={{ textAlign: "right", marginTop: 20 }}>
        <button disabled={  // Base logic for KPI movement
  const fI = np.industry_eng * arch.paramWeights.industry_eng;
  !goal} onClick={() => onNext({ archetype: sel, endGoal: goal })} style={mkBtn(T.primary)}>Next →</buttonconst fF = (np.trainer_hire * arch.paramWeights.trainer_hire) + (np.trainer_dev *>
      </div>
    </div>
  );
}

function KPISelectionStep({ archetype, onNext }) {
  const a = ARCHETY arch.paramWeights.trainer_dev);
  const fO = np.mobilization * 1.0PES.find(x => x.id === archetype);
  const [selected, setSelected] = useState([]);
;
  
  const rawDeltas = {
    placement_rate: (fI * 1  const toggle = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
    else if (selected.length < 10) setSelected([...selected,5 + fF * 8 + fO * 5) * stressPenalty,
    retention_12: (fF *  id]);
  };
  return (
    <div style={{ maxWidth: 900, margin:12 + np.subsidy * 8) * stressPenalty,
    soqs: (fF * 1 "40px auto", padding: "0 20px" }}>
      <h2 style={{ textAlign1 + fI * 10),
    total_learners: (fO * 400 + np.subsidy *: "center" }}>2. Select 10 Metrics</h2>
      <div style={{ display: "grid", gridTemplateColumns: 200),
    annual_revenue: (fO * 5 + fI * 5),
    ebitda_margin "repeat(auto-fill, minmax(200px, 1fr))", gap: 1: (np.ops_team * 12 - np.capex * 6),
    completion_0, marginTop: 24 }}>
        {a.kpiPool.map(kpi => (
          <div key={kpirate: (fF * 10 + np.subsidy * 5) * stressPenalty,
  };

  .id} onClick={() => toggle(kpi.id)} style={mkCard(a.color, selected.const SCALE = 0.08;
  const newKpis = { ...kpis };
  letincludes(kpi.id))}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{kpi. qualitySum = 0;
  let kpiCount = 0;

  Object.keys(kpis).forEachlabel}</div>
            <div style={{ fontSize: 11, color: T.textFaint }}>Baseline: {kpi.base}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign(k => {
    const change = (rawDeltas[k] || 10) * SCALE;
    const before = kpis[k];
    newKpis[k] = Math.round((before + change) * : "right", marginTop: 20 }}>
        <span style={{ marginRight: 20 }}>{selected.length}/10 selected</span>
        <button disabled={selected.length < 10} onClick={() => onNext({ selectedKPIs10) / 10;
    
    // Performance Index Calculation:
    // How good was this period: selected, kpiPool: a.kpiPool })} style={mkBtn(T.primary)}>Next →</button>
      </div>
    </div>
  );
}

function SectorStep({ onNext }) {
? 100% means you hit max potential growth.
    // 0-40% means strategy  const [sel, setSel] = useState([]);
  const toggle = (id) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : s.length < 2 ? [...s was weak.
    const benchmark = before * 0.1 || 5; 
    const kpiQuality = Math.max(0, Math.min(100, (change / benchmark) * 10, id] : s);
  return (
    <div style={{ maxWidth: 800, margin: "400));
    qualitySum += kpiQuality;
    kpiCount++;
  });

  const yearpx auto", padding: "0 20px" }}>
      <h2 style={{ textAlign: "centerScore = Math.round(qualitySum / kpiCount);
  const nextBudget = Math.max(70, Math.min" }}>3. Market Focus</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1(160, 100 + (yearScore - 50) * 0.4));

  return { newKpis, newStress, yearScore, nextBudget };
}

function getProjectedImpact({ params, archetype, selectedKPIsfr 1fr", gap: 10, marginTop: 20 }}>
        {SECTORS.map }) {
  const arch = ARCHETYPES.find(a => a.id === archetype);
  const(s => (
          <div key={s.id} onClick={() => toggle(s.id)} style={mkCard(T.primary, sel.includes(s.id))}>
            <div style={{ fontWeight: 700 }}> total = Object.values(params).reduce((s, v) => s + v, 0) || 100;
  const np = {}; Object.keys(params).forEach(k => { np[k{s.label}</div>
            <div style={{ fontSize: 11 }}>Salaries: {s.salary}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right", marginTop: 2] = params[k] / total; });
  
  const fI = np.industry_eng * arch.paramWeights.industry_0 }}>
        <button disabled={sel.length === 0} onClick={() => onNext({ sectors: seleng;
  const fF = (np.trainer_hire * arch.paramWeights.trainer_hire); })} style={mkBtn(T.primary)}>Next →</button>
      </div>
    </div>
  );

  const raw = {
    placement_rate: fI * 20 + fF * 5
}

function FundingStep({ onNext }) {
  const [f, setF] = useState(null,
    retention_12: fF * 15,
    soqs: fF *);
  const [d, setD] = useState(null);
  return (
    <div style={{ maxWidth: 80 10 + fI * 10,
    annual_revenue: np.mobilization * 10, margin: "40px auto", padding: "0 20px" }}>
      <h0 + fI * 5,
    total_learners: np.mobilization * 20,
    2 style={{ textAlign: "center" }}>4. Final Setup</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <divebitda_margin: np.ops_team * 15 - np.capex * 10
  };

  const out = {};
  selectedKPIs.forEach(id => {
    out[id] = Math.max( style={mkCard()}>
          <div style={T.textMuted}>FUNDING</div>
          {FUNDING_5, Math.min(100, ( (raw[id] || 5) / 25) * 100));
  });
  return out;
}

// ════════════════════════SOURCES.map(x => <div key={x.id} onClick={() => setF(x.id)} style={{ padding: 10, cursor: "pointer", border: `1px solid ${f === x.id ? T.primary : T.border}`, borderRadius: 4, marginTop: 5 }}>{x.icon} {x.label}</div>)}
        </div>
        <div style={mkCard()}>
          <div style={T.textMuted}>DELIVERY</div>
          {DELIVERY_MODES.map(x => <div key={x.id} onClick={() => setD(x.id)} style={{ padding: 10, cursor: "pointer", border: `1px solid ${d === x.id ? T.primary : T.border}`, borderRadius: 4, marginTop: 5 }}>{x═══════════════════════════════
//  UI COMPONENTS
// ═══════════════════════════════════════════════════════

const KPIBar = ({ label, value, color, unit }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
      <span style={{ color: T.text.icon} {x.label}</div>)}
        </div>
      </div>
      <div style={{ textAlign: "right", marginTop: 2Muted }}>{label}</span>
      <span style={{ fontFamily: T.mono, color }}>{value.toFixed(1)}{unit}</span>
    </div>
    <div style={{ height: 6, background: T.track, borderRadius0 }}>
        <button disabled={!f || !d} onClick={() => onNext({ fundingSource: f: 3 }}>
      <div style={{ width: `${Math.min(100, value)}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
, deliveryMode: d })} style={mkBtn(T.primary)}>Start Simulation →</button>
      </div>
    </div>
  );    </div>
  </div>
);

const ColorSlider = ({ param, value, onChange }) => {
  const
}

function KPIBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 1 pct = (value / 40) * 100;
  return (
    <div style={{ marginBottom: 12 }}>2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11,
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 7 fontWeight: 700, marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ fontFamily:00, marginBottom: 3 }}>
        <span>{param.icon} {param.label}</span>
        <span style={{ color: param T.mono, color }}>{value.toFixed(1)}</span>
      </div>
      <div style={{ height.color }}>{value}%</span>
      </div>
      <div style={{ position: "relative", height: 6, background: T.track, borderRadius: 3 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: param.color, borderRadius: 3 }} />
        <input type="range: 6, background: T.track, borderRadius: 3 }}>
        <div style={{ width: `${Math.min(100, value)}%`, height: "100%", background: color, borderRadius: 3, transition: "width" min={0} max={40} value={value} onChange={e => onChange(parseInt(e.target.value))}
          style={{ position: "absolute", top: -7, left: 0, width: "10 0.4s" }} />
      </div>
    </div>
  );
}

function ColorSlider({ param, value, onChange }) {
  const pct = (value / 40) * 100;
  return (
0%", opacity: 0, cursor: "pointer" }} />
      </div>
    </div>
  );
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600 }}>
        <span>{param.icon};

// ═══════════════════════════════════════════════════════
//  SCREENS
// ═══════════════════════════════════════════════════════

const Welcome = ({ onStart }) => (} {param.label}</span>
        <span style={{ color: param.color }}>{value}%</span>
      </div>
      <div style={{ position: "relative", height: 6, background: T.track, borderRadius: 3, marginTop
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
    <div style={{ maxWidth: 500, textAlign: "center: 4 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: param." }}>
      <h1 style={{ fontSize: 50 }}>🏛️</h1>
      <h1 style={{ fontSize: color, borderRadius: 3 }} />
        <input type="range" min={0} max={40} value={value} onChange36, fontWeight: 800, marginBottom: 12 }}>InstituteCommand</h1>
      <p style={e => onChange(parseInt(e.target.value))} style={{ position: "absolute", top: -5, left: 0={{ color: T.textMuted, marginBottom: 30 }}>A 5-year strategic simulation. Design, width: "100%", opacity: 0, cursor: "pointer" }} />
      </div>
    </div>
  );
}

function YearPlay({ gameState, onYearComplete }) {
  const { year, archetype, budget, kpis, selectedKPIs, kpiPool, stress } = gameState;
  const your institute, manage budgets across fiscal periods, and optimize KPIs.</p>
      <button onClick={onStart} style={{ ...mkBtn(T.primary), padding: "12px 40px", fontSize: 15 arch = ARCHETYPES.find(x => x.id === archetype);
  const cadence = getCadence( }}>Begin Simulation</button>
    </div>
  </div>
);

const ArchetypeStep = ({ onNext }) => {
  year);

  const [period, setPeriod] = useState(0);
  const [periodKpis, setPeriodKpis] = useState(kpis);
  const [periodStress, setPeriodStress] = useState(stress);
  constconst [sel, setSel] = useState(null);
  const [goal, setGoal] = useState( [periodHistory, setPeriodHistory] = useState([]);
  const [params, setParams] = useState({ canull);
  return (
    <div style={{ maxWidth: 900, margin: "40pex: 10, trainer_hire: 20, trainer_dev: 10, tech: 10,px auto", padding: "20px" }}>
      <h2 style={{ fontWeight: 800 mobilization: 10, industry_eng: 20, ops_team: 10, subsidy: 10 });, textAlign: "center", marginBottom: 24 }}>Strategic Vision</h2>
      <div style={{ display: "grid", grid

  const totalAlloc = Object.values(params).reduce((s, v) => s + v, 0);
  TemplateColumns: "1fr 1fr 1fr", gap: 15 }}>
        {ARCHETYconst impacts = getLiveImpact({ params, archetype, selectedKPIs });

  const commit = () => {
    const res =PES.map(a => (
          <div key={a.id} onClick={() => { setSel(a.id); setGoal(null); }} style={mkCard(a.color, sel === a.id)}>
            < simulateYear({ ...gameState, kpis: periodKpis, params, stress: periodStress });
    const newHist = [...periodHistory, resdiv style={{ fontSize: 24 }}>{a.icon}</div>
            <h3 style={{ margin: "10px ];
    setPeriodHistory(newHist);
    setPeriodKpis(res.newKpis);
    setPeriodStress(res.newStress);

    if (period + 1 >= cadence.periods) {
      const avgScore = Math0" }}>{a.label}</h3>
            <p style={{ fontSize: 12, color: T.textMuted }}>.round(newHist.reduce((s, h) => s + h.yearScore, 0) /{a.desc}</p>
          </div>
        ))}
      </div>
      {sel && (
        <div style={{ marginTop newHist.length);
      onYearComplete({ finalKpis: res.newKpis, finalStress:: 30, background: T.surfaceAlt, padding: 20, borderRadius: 8 }}>
          <div res.newStress, nextBudget: res.nextBudget, yearScore: avgScore });
    } else {
      setPeriod(period + 1);
    }
  };

  return (
    <div style={{ fontSize: 11, fontWeight: 800, color: T.textFaint, marginBottom style={{ maxWidth: 1200, margin: "20px auto", padding: "0 20px" }}>
: 12 }}>SELECT END GOAL</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {ARCHETYPES.find(a => a.id ===      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", sel).endGoals.map(g => (
              <div key={g.id} onClick={() => set borderBottom: `1px solid ${T.border}`, paddingBottom: 15 }}>
        <div>
          Goal(g.id)} style={mkCard(ARCHETYPES.find(a => a.id === sel).color, goal === g.id)}>
                <h4 style={{ margin: 0 }}>{g.label<span style={mkPill(arch.color)}>{cadence.label} - {cadence.pLabel(period)}</span>
          <h2 style={{ fontWeight: 800 }}>Institutional Dashboard</h2>
        </div>
        <div}</h4>
                <p style={{ fontSize: 11, margin: "5px 0" }}>{g.desc}</ style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, fontWeight: 8p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "right", marginTop: 20 }}>
            <button disabled={!goal} onClick={() => onNext({ archetype: sel, endGoal: goal })} style={mkBtn(T.primary)}>Next Step</button>
          </div>
        </div>
      )}
    </div>
  );
};

const KPISelectionStep = ({ archetype, onNext }) => {
  const arch = ARCHETYPES.find(a => a.id === archetype);
  const [selected, setSelected] = useState([]);
  const toggle = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(x => x !== id));
    else if (selected.length < 10) setSelected([...selected, id]);
  };
  return (
00, color: T.textFaint }}>PERIOD BUDGET</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>₹{budget.toFixed(1)} Cr</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 24, marginTop: 24 }}>
        {/* LEFT PANEL */}
        <div style={mkCard()}>
          <h4 style={{ fontSize: 11, fontWeight: 800, color: T.textMuted, marginBottom: 15 }}>SCORECARD</h4>
          {selectedKPIs.    <div style={{ maxWidth: 900, margin: "40px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", fontWeight: 800 }}>Performance Framework</h2>
      <p style={{ textAlign: "center", color: T.textMuted }}>Select 10 metrics to track over 5 years.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 24 }}>
        {arch.kpiPool.map(k => (
          <div key={k.id} onClick={() => toggle(k.id)} style={mkCard(arch.color, selected.includes(k.id))}>
            <div style={{ fontWeight: 700 }}>{k.label}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right", marginTop: map(id => {
            const def = kpiPool.find(k => k.id === id);
            return <KPIBar key={id} label={def.label} value={periodKpis[id]} color={arch.color} />;
          })}
        </div>

        {/* RIGHT PANEL */}
        <div style={mkCard()}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: T.textMuted }}>STRATEGIC SLIDERS</h4>
            <span style={mkPill(Math.abs(totalAlloc - 100) < 2 ? "#059669" : "#dc2626")}>{totalAlloc}/100 units</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 30 }}>
        <button disabled={selected.length < 10} onClick={() => onNext({ selectedKPIs: selected })} style={mkBtn(T.primary)}>Set Metrics</button>
      </div>
    </div>
  );
1fr", gap: "0 20px" }}>
            {PARAMS.map(p => <ColorSlider key={p.id} param={p} value={params[p.id]} onChange={v => setParams};

const SectorStep = ({ onNext }) => {
  const [sel, setSel] = useState([]);
  const toggle = (id) => {
    if (sel.includes(id)) setSel(sel.filter(x => x !== id));
    else if (sel.length < 2) setSel([...sel, id]);
  };
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", fontWeight: 800 }}>Market Verticals</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginTop: 20 }}>
        {SECTORS.map(s => (
          <div key={s.id} onClick={() => toggle(s.id)} style={mkCard(T.primary, sel.includes(s.id))}>
            <div style={{ fontWeight: 700 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right", marginTop: 30 }}>
        <button disabled={sel.length === 0} onClick={()({ ...params, [p.id]: v })} />)}
          </div>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: T.textFaint, marginBottom: 15 }}>LIVE IMPACT FORECAST</h4>
            {selectedKPIs.slice(0, 6).map(id => {
              const def = kpiPool.find(k => k.id === id);
              const score = impacts[id] || 0;
              return (
                <div key={id} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700 }}>
                    <span>{def.label}</span>
                    <span style={{ color: arch.color }}>{score > 60 ? "HIGH" : "MODERATE"}</span>
                  </div>
                  <div style={{ height: 4, background: T.track, borderRadius: 2 }}>
                    <div style={{ width: `${score}%`, height: "100%", background: arch.color, borderRadius: 2 }} />
                  </div>
                 => onNext({ sectors: sel })} style={mkBtn(T.primary)}>Next Step</button>
      </div>
    </div>
  );
};

const FundingStep = ({ onNext }) => {
  const [fund, setFund] = useState(null);
  const [mode, setMode] = useState(null);
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", fontWeight: 800 }}>Operations Setup</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 30 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: T.textFaint, marginBottom: 10 }}>FUNDING SOURCE</div>
          {FUNDING_SOURCES.map(f => (
            <div key={f.id} onClick={() => setFund(f.id)} style={{ ...mkCard(T.primary, fund === f.id), marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>{f.icon} {f.label}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: T.textFaint, marginBottom: 10 }}>DELIVERY MODE</div>
          {DELIVERY_MODES.map(m => (
            <div key={m.id} onClick={() => setMode(m.id)} style={{ ...mkCard(T.primary, mode === m.id), marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>{m.icon} {m.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "right", marginTop: 30 }}>
        <button disabled={!fund || !mode} onClick={() => onNext({ fundingSource: fund, deliveryMode: mode })} style={mkBtn(T.primary)}>Launch Year 1</button>
      </div>
    </div>
  );
};

const YearPlay = ({ gameState, onYearComplete }) => {
  const { year, archetype, budget, kpis, selectedKPIs, stress } = gameState;
  const arch = ARCHETYPES.find(a => a.id === archetype);
  const cadence = getCadence(year);
  
  const [period, setPeriod] = useState(0);
  const [periodKpis</div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "right", marginTop: 20 }}>
        <button onClick={commit} disabled={Math.abs(totalAlloc - 100) > 2} style={mkBtn(arch.color)}>Commit Decision →</button>
      </div>
    </div>
  );
}

function YearResult({ result, year, gs, onNext }) {
  return (
    <div style={{ maxWidth: 600, margin: "60px auto", textAlign: "center" }}>
      <h2 style={{ fontSize: 80, fontWeight: 800, color: T.primary }}>{result.yearScore}%</h2>
      <p>Performance Index for Year {year}</p>
      <div style={mkCard(T.primary, true)}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Operational Stress:</span><span>{result.finalStress.toFixed(1)}/10</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}><span>Budget Next Year:</span><span>₹{result.nextBudget.toFixed(1)} Cr</span></div>
      </div>
      <button onClick={onNext} style={{ ...mkBtn(T.primary), marginTop: 30 }}>Next Year →</button>
    </div>
  );
}

function FinalResults({ history }) {
  const avg = Math.round(history.reduce((s, x) => s + x.yearScore, 0) / 5);
  return (
    <div style={{ maxWidth: 600, margin: "60px auto", textAlign: "center" }}>
      <h1 style={{ fontSize: 100, fontWeight: 800 }}>{avg}%</h1>
      <h3>Final Strategy Rating</h3>
      <button onClick={() => window.location.reload()} style={mkBtn(T.primary)}>Restart Simulation</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN CONTROLLER
// ═══════════════════════════════════════════════════════

export default function InstituteCommand() {
  const [screen, setScreen] = useState("welcome");
  const [gs, setGs] = useState({ year: 1, stress: 0, budget: 100 });
  const [history, set, setPeriodKpis] = useState(kpis);
  const [periodStress, setPeriodStress] = useState(stress);
  const [periodHistory, setPeriodHistory] = useState([]);
  const [params, setParams] = useState(() => {
    const init = {}; PARAMS.forEach(p => { init[p.id] = History] = useState([]);
  const [lastRes, setLastRes] = useState(null);

  const handleSetup = (screenId, data) => {
    setGs(prev => ({ ...prev, ...data }));
    setScreen(screenId);
  };

  const handleYearEnd = (res) => {
    setLastRes(res);
    setGs(prev => ({ ...prev, kpis: res.finalKpis, stress: res.finalStress, budget: res.nextBudget }));
    setHistory(prev => [...prev, res]);
    setScreen("year_result");
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.text }}>
      {screen === "welcome" && <Welcome onStart={() => setScreen("archetype")} />}
      {screen === "archetype" && <ArchetypeStep onNext={d => handleSetup("kpi_select", d)} />}
      {screen === "kpi_select" && <KPISelectionStep archetype={gs.archetype} onNext={d => handleSetup("sectors", d)} />}
      {screen === "sectors" && <SectorStep10; }); return init;
  });

  const impacts = useMemo(() => getProjectedImpact({ params, archetype, selectedKPIs }), [params, archetype, selectedKPIs]);
  const totalAlloc = Object.values(params).reduce((s, v) => s + v, 0);

  const commitPeriod = () => {
    const res = simulateYear({ ...gameState, kpis: periodKpis, params, stress: periodStress });
    const newHist = [...periodHistory, res];
    setPeriodHistory(newHist);
    setPeriodKpis(res.newKpis);
    setPeriodStress(res.newStress);

    if (period + 1 >= cadence.periods) {
      const avgScore = Math.round(newHist.reduce((s, h) => s + h.yearScore, 0) / newHist.length);
      onYearComplete({ finalKpis: res.newKpis, finalStress: res.newStress, nextBudget: res.nextBudget, yearScore: avgScore });
    } else {
      setPeriod(period + 1);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center onNext={d => handleSetup("funding", d)} />}
      {screen === "funding" && <FundingStep onNext={d => {
        const kpis = {}; d.fundingSource && gs.selectedKPIs.forEach(id => { kpis[id] = gs.kpiPool.find(k => k.id === id).base; });
        handleSetup("year", { ...d, kpis, year: 1, budget: 100, stress: 0 });
      }} />}
      {screen === "year" && <YearPlay gameState={gs}", borderBottom: `1px solid ${T.border}`, paddingBottom: 15 }}>
        <div>
          <span style={mkPill(arch.color)}>{arch.label}</span>
          <h2 style={{ fontWeight: 800, margin: "5px 0" }}>{cadence.pLabel(period)} onYearComplete={handleYearEnd} />}
      {screen === "year_result" && <YearResult result={lastRes} year={gs.year} gs={gs} onNext={() => gs.year < 5 ? (setGs({ ...gs, year: gs.year + 1 }), setScreen("year")) : setScreen("final")} />}
      {screen === "final" && <FinalResults history={history} />}
    </div>
  );
}
