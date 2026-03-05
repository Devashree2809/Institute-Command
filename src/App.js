import React, { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════
//  DESIGN TOKENS (FORMAL & PROFESSIONAL)
// ═══════════════════════════════════════════════════════
const T = {
  bg: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  text: "#0f172a",
  textMuted: "#64748b",
  primary: "#2563eb",
  font: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const mkCard = (selColor) => ({
  background: T.surface,
  border: `1px solid ${selColor || T.border}`,
  borderRadius: 8,
  padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column"
});

const mkBtn = (color) => ({
  background: color,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "12px 24px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: T.font
});

// ═══════════════════════════════════════════════════════
//  DATA & CONSTANTS
// ═══════════════════════════════════════════════════════
const ARCHETYPES = [
  { id: "employment", label: "Sustainable Employment", icon: "🎯", color: "#059669", 
    desc: "Long-term career focus, retention, and employer repeat hiring.",
    paramWeights: { trainer_hire: 1.2, trainer_dev: 1.0, industry_eng: 1.5, tech: 0.5, mobilization: 0.8 },
    kpiPool: [
        { id: "placement_rate", label: "Placement Rate (%)", base: 40 },
        { id: "retention_12", label: "12-Month Retention (%)", base: 50 },
        { id: "soqs", label: "Salary Quality Score", base: 50 },
        { id: "employer_repeat", label: "Employer Repeat (%)", base: 30 },
        { id: "avg_salary", label: "Avg Salary (LPA)", base: 3.5 },
        { id: "job_dropoff", label: "Job Drop-off (%)", base: 30, inverse: true },
        { id: "role_alignment", label: "Role Alignment (%)", base: 45 },
        { id: "employer_sat", label: "Employer Satisfaction", base: 55 },
        { id: "income_growth", label: "Income Growth (%)", base: 8 },
        { id: "active_partners", label: "Active Partners", base: 5 },
        { id: "alumni_coverage", label: "Alumni Tracking (%)", base: 20 },
        { id: "learner_job_sat", label: "Job Satisfaction", base: 55 },
        { id: "career_progression", label: "Career Growth Rate", base: 10 }
    ]
  },
  { id: "inclusion", label: "Access & Inclusion", icon: "🌍", color: "#d97706",
    desc: "Reaching rural youth, women, and marginalized communities.",
    paramWeights: { trainer_hire: 0.8, trainer_dev: 0.7, industry_eng: 0.6, tech: 0.5, mobilization: 1.6 },
    kpiPool: [
        { id: "women_pct", label: "Women Participation (%)", base: 30 },
        { id: "rural_pct", label: "Rural Learners (%)", base: 20 },
        { id: "scholarship_pct", label: "Scholarship Coverage (%)", base: 15 },
        { id: "marginalized_pct", label: "Marginalized Participation", base: 20 },
        { id: "total_learners", label: "Total Enrollment", base: 500 },
        { id: "completion_rate", label: "Course Completion (%)", base: 55 },
        { id: "local_lang", label: "Local Lang Coverage (%)", base: 20 },
        { id: "dropout_rate", label: "Dropout Rate (%)", base: 25, inverse: true },
        { id: "student_sat", label: "Student Satisfaction", base: 60 },
        { id: "first_gen", label: "First-Gen Learners (%)", base: 25 },
        { id: "rural_placements", label: "Rural Placements (%)", base: 25 },
        { id: "mobility_support", label: "Mobility Support Rate", base: 10 },
        { id: "inclusive_hiring", label: "Inclusive Hiring Rate", base: 15 }
    ]
  }
];

const PARAMS = [
  { id: "trainer_hire", label: "Trainer Hiring", icon: "👩‍🏫", color: "#8b5cf6" },
  { id: "trainer_dev", label: "Trainer Development", icon: "📚", color: "#6366f1" },
  { id: "industry_eng", label: "Industry Engagement", icon: "🏭", color: "#059669" },
  { id: "tech", label: "Technology & LMS", icon: "💻", color: "#0284c7" },
  { id: "mobilization", label: "Field Mobilization", icon: "🚌", color: "#d97706" }
];

const getCadence = (year) => {
  if (year <= 2) return { periods: 1, label: "Annual Cycle" };
  if (year <= 4) return { periods: 2, label: "Half-Yearly Cycle" };
  return { periods: 4, label: "Quarterly Cycle" };
};

// ═══════════════════════════════════════════════════════
//  SIMULATION LOGIC (THE HEART)
// ═══════════════════════════════════════════════════════

function calculateLiveDelta(params, kpiId, archetype, currentVal) {
    const arch = ARCHETYPES.find(a => a.id === archetype);
    const weights = arch.paramWeights;
    
    // Logic: Impact = (Budget * Weight)
    let impact = (
        (params.trainer_hire * (weights.trainer_hire || 1)) +
        (params.trainer_dev * (weights.trainer_dev || 1)) +
        (params.industry_eng * (weights.industry_eng || 1)) +
        (params.tech * (weights.tech || 1)) +
        (params.mobilization * (weights.mobilization || 1))
    ) / 50;

    // Normalizing to a professional change rate (0.1 to 1.5 units per period)
    return impact * 0.15;
}

// ═══════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════

const KPIUnifiedRow = ({ kpi, value, delta, color }) => {
  const isGood = kpi.inverse ? delta < 0 : delta > 0;
  const displayDelta = delta.toFixed(2);
  
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
        <span style={{ color: T.textMuted }}>{kpi.label}</span>
        <div>
            <span style={{ fontFamily: T.mono, marginRight: 8 }}>{value.toFixed(1)}</span>
            <span style={{ fontFamily: T.mono, color: isGood ? "#059669" : "#dc2626", fontSize: 11 }}>
                {delta >= 0 ? "+" : ""}{displayDelta}
            </span>
        </div>
      </div>
      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, position: "relative", overflow: "hidden" }}>
        {/* Current Value Bar */}
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(100, value)}%`, background: color, opacity: 0.3, borderRadius: 4 }} />
        {/* Live Projection Bar */}
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(100, value + delta)}%`, background: color, borderRadius: 4, transition: "width 0.2s ease" }} />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  MAIN APP CONTROLLER
// ═══════════════════════════════════════════════════════

export default function InstituteCommand() {
  const [screen, setScreen] = useState("welcome");
  const [gs, setGs] = useState({ year: 1, budget: 100, archetype: null, selectedKPIs: [], kpis: {} });
  const [params, setParams] = useState({ trainer_hire: 20, trainer_dev: 20, industry_eng: 20, tech: 20, mobilization: 20 });
  const [history, setHistory] = useState([]);
  const [period, setPeriod] = useState(0);

  const arch = ARCHETYPES.find(a => a.id === gs.archetype);
  const cadence = getCadence(gs.year);

  // REAL-TIME DEVIATION CALCULATION
  const liveDeltas = useMemo(() => {
    const d = {};
    gs.selectedKPIs.forEach(id => {
      const kpiDef = arch?.kpiPool.find(k => k.id === id);
      d[id] = calculateLiveDelta(params, id, gs.archetype, gs.kpis[id]);
      if (kpiDef?.inverse) d[id] = -d[id];
    });
    return d;
  }, [params, gs.selectedKPIs, gs.kpis, gs.archetype, arch]);

  const handleCommit = () => {
    // Update actual KPI values
    const nextKpis = { ...gs.kpis };
    Object.keys(nextKpis).forEach(id => {
      nextKpis[id] = Math.round((nextKpis[id] + liveDeltas[id]) * 10) / 10;
    });

    if (period + 1 < cadence.periods) {
      setPeriod(period + 1);
      setGs({ ...gs, kpis: nextKpis });
    } else {
      // Calculate Year Score (Performance Index)
      let score = 0;
      gs.selectedKPIs.forEach(id => { if (Math.abs(liveDeltas[id]) > 0.5) score += 10; });
      const yearScore = Math.min(100, score + 40);

      setHistory([...history, { year: gs.year, score: yearScore }]);
      setGs({ ...gs, year: gs.year + 1, kpis: nextKpis });
      setPeriod(0);
      setScreen("year_result");
    }
  };

  // SCREEN: WELCOME
  if (screen === "welcome") return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg }}>
      <div style={{ maxWidth: 500, textAlign: "center" }}>
        <h1 style={{ fontSize: 44, fontWeight: 800 }}>Institute<span style={{ color: T.primary }}>Command</span></h1>
        <p style={{ margin: "20px 0", color: T.textMuted }}>Professional simulator for institutional scaling and KPI management.</p>
        <button style={mkBtn(T.primary)} onClick={() => setScreen("vision")}>Initialize Simulation →</button>
      </div>
    </div>
  );

  // SCREEN: VISION
  if (screen === "vision") return (
    <div style={{ maxWidth: 800, margin: "60px auto", padding: 20 }}>
        <h2 style={{ textAlign: "center", marginBottom: 30 }}>Select Institutional Vision</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {ARCHETYPES.map(a => (
                <div key={a.id} style={mkCard(gs.archetype === a.id ? a.color : null)} onClick={() => setGs({...gs, archetype: a.id})}>
                    <span style={{ fontSize: 32 }}>{a.icon}</span>
                    <h3 style={{ margin: "10px 0" }}>{a.label}</h3>
                    <p style={{ fontSize: 13, color: T.textMuted }}>{a.desc}</p>
                </div>
            ))}
        </div>
        <div style={{ textAlign: "right", marginTop: 30 }}>
            <button disabled={!gs.archetype} style={mkBtn(T.primary)} onClick={() => setScreen("kpi_select")}>Confirm Vision</button>
        </div>
    </div>
  );

  // SCREEN: KPI SELECT
  if (screen === "kpi_select") return (
    <div style={{ maxWidth: 900, margin: "60px auto", padding: 20 }}>
        <h2 style={{ textAlign: "center" }}>Performance Matrix</h2>
        <p style={{ textAlign: "center", color: T.textMuted, marginBottom: 30 }}>Select 10 metrics to track over 5 years.</p>
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
            <button disabled={gs.selectedKPIs.length < 10} style={mkBtn(T.primary)} onClick={() => {
                const initKpis = {};
                gs.selectedKPIs.forEach(id => initKpis[id] = arch.kpiPool.find(x => x.id === id).base);
                setGs({...gs, kpis: initKpis});
                setScreen("play");
            }}>Launch Year 1</button>
        </div>
    </div>
  );

  // SCREEN: MAIN PLAY DASHBOARD
  if (screen === "play") return (
    <div style={{ maxWidth: 1200, margin: "20px auto", padding: "0 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30, borderBottom: `1px solid ${T.border}`, paddingBottom: 20 }}>
            <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: T.primary, textTransform: "uppercase" }}>Year {gs.year} of 5</div>
                <h2 style={{ margin: "5px 0" }}>{cadence.label} - {period + 1}</h2>
            </div>
            <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted }}>FISCAL BUDGET</div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: T.mono }}>₹{gs.budget.toFixed(1)} Cr</div>
            </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            {/* LEFT PANEL: SINGLE UNIFIED KPI CHART */}
            <div style={mkCard()}>
                <h4 style={{ fontSize: 11, fontWeight: 800, color: T.textMuted, marginBottom: 20, textTransform: "uppercase" }}>Institutional Performance Chart</h4>
                {gs.selectedKPIs.map(id => (
                    <KPIUnifiedRow 
                        key={id} 
                        kpi={arch.kpiPool.find(k => k.id === id)} 
                        value={gs.kpis[id]} 
                        delta={liveDeltas[id]} 
                        color={arch.color}
                    />
                ))}
            </div>

            {/* RIGHT PANEL: BUDGET SLIDERS */}
            <div style={mkCard()}>
                <h4 style={{ fontSize: 11, fontWeight: 800, color: T.textMuted, marginBottom: 20, textTransform: "uppercase" }}>Strategic Budget Allocation</h4>
                {PARAMS.map(p => (
                    <div key={p.id} style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                            <span>{p.icon} {p.label}</span>
                            <span style={{ color: p.color, fontFamily: T.mono }}>{params[p.id]}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="40" 
                            value={params[p.id]} 
                            onChange={(e) => setParams({...params, [p.id]: parseInt(e.target.value)})}
                            style={{ width: "100%", accentColor: p.color }}
                        />
                    </div>
                ))}
                
                <div style={{ marginTop: "auto", paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
                    <button style={{ ...mkBtn(arch.color), width: "100%" }} onClick={handleCommit}>
                        Commit Decision for {cadence.label} →
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  // SCREEN: YEAR RESULT
  if (screen === "year_result") return (
    <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
        <h1 style={{ fontSize: 80, fontWeight: 800, color: T.primary }}>{history[history.length - 1].score}%</h1>
        <h3>Strategic Health Index: Year {gs.year - 1}</h3>
        <p style={{ color: T.textMuted }}>Budget allocation efficiency and KPI growth captured for this fiscal cycle.</p>
        <button style={{ ...mkBtn(T.primary), marginTop: 30 }} onClick={() => gs.year > 5 ? setScreen("final") : setScreen("play")}>
            Next Fiscal Year →
        </button>
    </div>
  );

  return null;
}
