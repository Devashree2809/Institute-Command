import React, { useState } from "react";

// ════════════════════════════════════════════════════════════════
//  GAME DATA (Archetypes, Sectors, Events)
// ════════════════════════════════════════════════════════════════

const ARCHETYPES = [
  {
    id: "employment", label: "Sustainable Employment", icon: "🎯", color: "#059669", 
    desc: "Build careers that last — retention, salary quality & employer trust over 24 months.",
    pros: ["Employer repeat hiring", "Outcome-based funding eligibility", "Long-term impact credibility"],
    cons: ["Needs 24-month tracking infra", "Vulnerable to market downturns", "Heavy employer dependency"],
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
      { id: "mass_placement", label: "Mass Placement at Scale", desc: "80%+ placement rate with diverse employer base", kpiTargets: { placement_rate: 80, retention_12: 70, active_employers: 50 } },
      { id: "salary_excellence", label: "Premium Salary Outcomes", desc: "Avg 10 LPA with strong 24-month retention", kpiTargets: { avg_salary: 10, retention_24: 70, soqs: 80 } },
      { id: "employer_trust", label: "Employer Trust Network", desc: "60%+ repeat hiring, 80+ employer satisfaction", kpiTargets: { employer_repeat: 60, employer_sat: 80, role_alignment: 75 } },
    ],
    paramWeights: { capex: 0.5, trainer_hire: 1.0, trainer_dev: 0.9, tech: 0.4, mobilization: 0.7, digital_mkt: 0.5, industry_eng: 1.2, ops_team: 0.6, admin: 0.3, subsidy: 0.5 },
  },
  {
    id: "inclusion", label: "Access & Inclusion", icon: "🌍", color: "#d97706",
    desc: "Democratize skilling — reach the last mile, rural youth, women & marginalized communities.",
    pros: ["CSR & govt funding alignment", "High social ROI", "Community trust building"],
    cons: ["Lower salary outcomes possible", "High cost-per-student", "Employer hesitancy in rural"],
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
      { id: "marginalized_placement", label: "Marginalized Placement (%)", base: 25, unit: "%" },
      { id: "women_income_uplift", label: "Women Income Uplift (%)", base: 10, unit: "%" },
      { id: "local_lang_pct", label: "Courses in Local Language (%)", base: 20, unit: "%" },
    ],
    endGoals: [
      { id: "rural_reach", label: "Deep Rural Penetration", desc: "50%+ rural learners, 3 states covered", kpiTargets: { rural_pct: 50, total_learners: 5000, local_lang_pct: 60 } },
      { id: "gender_equity", label: "Gender Equity Leader", desc: "55%+ women participation with income uplift", kpiTargets: { women_pct: 55, women_income_uplift: 25, completion_rate: 75 } },
      { id: "mass_inclusion", label: "Mass Inclusion at Scale", desc: "40%+ marginalized, 80%+ completion rate", kpiTargets: { marginalized_pct: 40, completion_rate: 80, dropout_rate: 10 } },
    ],
    paramWeights: { capex: 0.3, trainer_hire: 0.8, trainer_dev: 0.7, tech: 0.5, mobilization: 1.4, digital_mkt: 0.4, industry_eng: 0.6, ops_team: 0.7, admin: 0.5, subsidy: 1.3 },
  },
  {
    id: "financial", label: "Financial Sustainability", icon: "📈", color: "#2563eb",
    desc: "Build a revenue-positive, scalable institute — efficiency, unit economics & investor returns.",
    pros: ["Attracts private capital", "Long-term operational freedom", "Drives innovation through revenue"],
    cons: ["Inclusion risk if ROI-first", "Investor timeline pressure", "Brand stress if quality slips"],
    kpiPool: [
      { id: "annual_revenue", label: "Annual Revenue (₹ Cr)", base: 2, unit: "Cr" },
      { id: "ebitda_margin", label: "EBITDA Margin (%)", base: -10, unit: "%" },
      { id: "cost_per_student", label: "Cost per Student (₹)", base: 25000, unit: "₹", inverse: true },
      { id: "fee_recovery", label: "Fee Recovery Rate (%)", base: 40, unit: "%" },
      { id: "rev_per_learner", label: "Revenue per Learner (₹)", base: 8000, unit: "₹" },
      { id: "learner_per_trainer", label: "Learners per Trainer", base: 15, unit: "" },
      { id: "centre_utilisation", label: "Centre Utilisation (%)", base: 45, unit: "%" },
      { id: "lac", label: "Learner Acquisition Cost (₹)", base: 3000, unit: "₹", inverse: true },
      { id: "blended_ratio", label: "Blended Delivery Ratio (%)", base: 20, unit: "%" },
      { id: "new_revenue_streams", label: "New Revenue Streams", base: 0, unit: "" },
      { id: "breakeven_progress", label: "Break-even Progress (%)", base: 10, unit: "%" },
      { id: "roi", label: "Return on Investment (%)", base: -5, unit: "%" },
      { id: "recurring_rev_ratio", label: "Recurring Revenue Ratio (%)", base: 10, unit: "%" },
    ],
    endGoals: [
      { id: "breakeven_fast", label: "Break-Even by Year 3", desc: "EBITDA positive by Y3, 15% margin by Y5", kpiTargets: { ebitda_margin: 15, breakeven_progress: 100, roi: 20 } },
      { id: "scale_revenue", label: "Revenue Scale Leader", desc: "₹50Cr+ annual revenue, 3+ revenue streams", kpiTargets: { annual_revenue: 50, new_revenue_streams: 3, recurring_rev_ratio: 40 } },
      { id: "efficiency_model", label: "Lean Efficiency Model", desc: "Low cost-per-student, high utilisation", kpiTargets: { centre_utilisation: 85, cost_per_student: 8000, learner_per_trainer: 35 } },
    ],
    paramWeights: { capex: 0.7, trainer_hire: 0.9, trainer_dev: 0.5, tech: 1.1, mobilization: 0.6, digital_mkt: 1.0, industry_eng: 0.8, ops_team: 1.2, admin: 0.9, subsidy: 0.3 },
  },
  {
    id: "innovation", label: "Innovation & Flexibility", icon: "⚡", color: "#7c3aed",
    desc: "Redefine skilling through modular, tech-first & future-ready learning models.",
    pros: ["Highly scalable digitally", "Fast to pivot to new skills", "Resilient to market shifts"],
    cons: ["High dropout in self-paced", "Employer credibility lag", "Tech infrastructure burden"],
    kpiPool: [
      { id: "online_learner_pct", label: "Online Learners (%)", base: 30, unit: "%" },
      { id: "digital_completion", label: "Digital Completion (%)", base: 40, unit: "%" },
      { id: "microcred_pct", label: "Micro-credentials (%)", base: 10, unit: "%" },
      { id: "launch_time", label: "Course Launch Time (days)", base: 90, unit: "d", inverse: true },
      { id: "curriculum_refresh", label: "Curriculum Refresh Rate (%)", base: 10, unit: "%" },
      { id: "learner_sat", label: "Learner Satisfaction", base: 60, unit: "pts" },
      { id: "return_upskill_pct", label: "Return for Upskilling (%)", base: 8, unit: "%" },
      { id: "flexibility_rating", label: "Course Flexibility Rating", base: 55, unit: "pts" },
      { id: "online_dropoff", label: "Online Drop-off Rate (%)", base: 35, unit: "%", inverse: true },
      { id: "codesign_pct", label: "Co-designed with Employers (%)", base: 10, unit: "%" },
      { id: "role_versatility", label: "Job Role Versatility Score", base: 40, unit: "pts" },
      { id: "new_pilots", label: "New Program Pilots / Yr", base: 1, unit: "" },
      { id: "placement_rate", label: "Placement Rate (%)", base: 38, unit: "%" },
    ],
    endGoals: [
      { id: "digital_scale", label: "Digital Scale Champion", desc: "80%+ online learners, under 15% dropout", kpiTargets: { online_learner_pct: 80, online_dropoff: 15, digital_completion: 75 } },
      { id: "modular_leader", label: "Modular Learning Leader", desc: "50%+ micro-credentials, fast launch cycles", kpiTargets: { microcred_pct: 50, launch_time: 14, new_pilots: 8 } },
      { id: "codesign_future", label: "Industry Co-Design Pioneer", desc: "60%+ courses co-designed, high versatility", kpiTargets: { codesign_pct: 60, role_versatility: 80, curriculum_refresh: 50 } },
    ],
    paramWeights: { capex: 0.3, trainer_hire: 0.6, trainer_dev: 1.0, tech: 1.5, mobilization: 0.5, digital_mkt: 0.9, industry_eng: 0.8, ops_team: 0.7, admin: 0.4, subsidy: 0.4 },
  },
  {
    id: "premium", label: "Premium Brand & Reputation", icon: "🏆", color: "#c2410c",
    desc: "Build India's most aspirational skilling brand — prestige, selectivity & alumni success.",
    pros: ["Premium pricing power", "Tier-1 employer access", "Policy influence & recognition"],
    cons: ["Slow to build brand equity", "Infra & faculty intensive", "Risk of elitism perception"],
    kpiPool: [
      { id: "alumni_nps", label: "Alumni NPS Score", base: 20, unit: "pts" },
      { id: "employer_nps", label: "Employer NPS Score", base: 25, unit: "pts" },
      { id: "tier1_placement", label: "Tier-1 Placements (%)", base: 10, unit: "%" },
      { id: "offer_app_ratio", label: "Offer-to-Application Ratio", base: 3, unit: "x" },
      { id: "industry_exp_faculty", label: "Industry-Exp Faculty (%)", base: 30, unit: "%" },
      { id: "tier1_partners", label: "Tier-1 Industry Partners", base: 2, unit: "" },
      { id: "curriculum_endorsement", label: "Curriculum Endorsement (%)", base: 15, unit: "%" },
      { id: "alumni_recognition", label: "Alumni Recognition Rate (%)", base: 10, unit: "%" },
      { id: "media_mentions", label: "Media Mentions & Awards", base: 1, unit: "" },
      { id: "intl_collab", label: "International Collaborations", base: 0, unit: "" },
      { id: "campus_exp", label: "Campus Experience Score", base: 50, unit: "pts" },
      { id: "employer_recall", label: "Employer Brand Recall (%)", base: 5, unit: "%" },
      { id: "repeat_applicants", label: "Repeat Applicants YoY (%)", base: 5, unit: "%" },
    ],
    endGoals: [
      { id: "brand_equity", label: "Top National Brand", desc: "80+ employer NPS, 70%+ brand recall", kpiTargets: { employer_nps: 80, employer_recall: 70, media_mentions: 15 } },
      { id: "elite_placements", label: "Elite Placement Network", desc: "50%+ Tier-1 placements, high alumni NPS", kpiTargets: { tier1_placement: 50, alumni_nps: 70, offer_app_ratio: 8 } },
      { id: "global_recognition", label: "Global Recognition Leader", desc: "5+ intl collaborations, endorsed curriculum", kpiTargets: { intl_collab: 5, curriculum_endorsement: 70, industry_exp_faculty: 80 } },
    ],
    paramWeights: { capex: 1.1, trainer_hire: 0.9, trainer_dev: 1.0, tech: 0.7, mobilization: 0.3, digital_mkt: 1.2, industry_eng: 1.1, ops_team: 0.6, admin: 0.7, subsidy: 0.2 },
  },
];

const SECTORS = [
  { id: "manufacturing", label: "Manufacturing", capex: "High", salary: "₹14-16K/mo", faculty: "Medium", govtPriority: 9, demand: "Growing", techRisk: "Medium", affordability: "Medium", placement: "Medium", rarity: "Common", constraint: "Requires physical labs & CNC equipment", salaryMult: 1.10, placementMult: 1.15 },
  { id: "healthcare", label: "Healthcare", capex: "Medium", salary: "₹12-15K/mo", faculty: "Medium", govtPriority: 8, demand: "Growing", techRisk: "Low", affordability: "Medium", placement: "High", rarity: "Moderate", constraint: "Certified trainers mandatory; clinical labs needed", salaryMult: 1.05, placementMult: 1.08 },
  { id: "bfsi", label: "BFSI", capex: "Low", salary: "₹14-18K/mo", faculty: "High", govtPriority: 7, demand: "Stable", techRisk: "High", affordability: "High", placement: "High", rarity: "Saturated", constraint: "Compliance-heavy; constant cert updates needed", salaryMult: 1.18, placementMult: 1.10 },
  { id: "it", label: "IT & Digital Services", capex: "Low", salary: "₹12-20K/mo", faculty: "High", govtPriority: 8, demand: "Volatile", techRisk: "Very High", affordability: "High", placement: "Medium", rarity: "Saturated", constraint: "AI disruption accelerating; constant refresh required", salaryMult: 1.20, placementMult: 1.08 },
  { id: "logistics", label: "Logistics", capex: "Low", salary: "₹11-14K/mo", faculty: "Low", govtPriority: 7, demand: "Growing", techRisk: "Medium", affordability: "Medium", placement: "High", rarity: "Opportunity", constraint: "Last-mile hiring volatile; seasonal demand spikes", salaryMult: 1.00, placementMult: 1.05 },
];

const FUNDING_SOURCES = [
  { id: "csr", label: "CSR Grant", icon: "🤝", budgetMult: 1.0, expectation: "Social KPIs focused", kpiBonus: { women_pct: 5, marginalized_pct: 5 } },
  { id: "govt", label: "Government Scheme", icon: "🏛️", budgetMult: 1.15, expectation: "Placement targets mandatory", kpiBonus: { placement_rate: 5, total_learners: 200 } },
  { id: "investor", label: "Venture/PE", icon: "💼", budgetMult: 1.25, expectation: "ROI & Scale focused", kpiBonus: { annual_revenue: 3, ebitda_margin: 3 } },
];

const DELIVERY_MODES = [
  { id: "classroom", label: "Physical Centre", icon: "🏫", capexMult: 1.2, bestFor: ["manufacturing", "healthcare"] },
  { id: "online_live", label: "Live Online", icon: "📡", capexMult: 0.6, bestFor: ["it", "bfsi"] },
  { id: "hybrid", label: "Blended", icon: "🔀", capexMult: 0.9, bestFor: ["healthcare", "logistics"] },
];

const PARAMS = [
  { id: "capex", label: "CapEx", sub: "Infrastructure", icon: "🏗️", desc: "Labs, centres, machines" },
  { id: "trainer_hire", label: "Faculty Hiring", sub: "Trainers", icon: "👩‍🏫", desc: "Salaries for expert trainers" },
  { id: "trainer_dev", label: "Faculty Dev", sub: "Upskilling", icon: "📚", desc: "ToT & industry exposure" },
  { id: "tech", label: "Digital Infra", sub: "LMS/Tech", icon: "💻", desc: "Tracking and learning tools" },
  { id: "mobilization", label: "Field Outreach", sub: "Enrollment", icon: "🚌", desc: "Ground teams & rural camps" },
  { id: "digital_mkt", label: "Growth Mkt", sub: "Ads/SEO", icon: "📣", desc: "Social & lead generation" },
  { id: "industry_eng", label: "Industry Tie-ups", sub: "Placements", icon: "🏭", desc: "Employer relations & job fairs" },
  { id: "ops_team", label: "Program Mgmt", sub: "Operations", icon: "⚙️", desc: "MIS, data & compliance" },
  { id: "admin", label: "Support", sub: "Back Office", icon: "🗂️", desc: "Admin, rent & utilities" },
  { id: "subsidy", label: "Scholarships", sub: "Incentives", icon: "🎓", desc: "Stipends & travel support" },
];

const YEAR_EVENTS = [
  { year: 1, name: "Establishment", desc: "Initial setup. Stakeholders are observing quality.", mod: 1.0, sectorMod: {} },
  { year: 2, name: "Manufacturing Surge", desc: "Global firms shift production. Manufacturing & logistics demand +20%.", mod: 1.05, sectorMod: { manufacturing: 1.20, logistics: 1.10 } },
  { year: 3, name: "Digital Skilling Push", desc: "Government increases IT skilling budget, rural schemes cut.", mod: 0.95, sectorMod: { it: 1.10, construction: 0.85 } },
  { year: 4, name: "Market Correction", desc: "Hiring freeze in IT/BFSI. Healthcare remains resilient.", mod: 0.88, sectorMod: { it: 0.75, healthcare: 1.10 } },
  { year: 5, name: "AI Integration", desc: "AI tools reshape roles. Micro-credentials demand surges.", mod: 1.08, sectorMod: { it: 1.15, manufacturing: 1.05 } },
];

// ════════════════════════════════════════════════════════════════
//  STYLED COMPONENTS & DESIGN SYSTEM
// ════════════════════════════════════════════════════════════════

const design = {
  card: (color = "#2563eb", selected = false) => ({
    background: "#ffffff",
    border: `1px solid ${selected ? color : "#e2e8f0"}`,
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: selected ? `0 8px 24px -6px ${color}25` : "0 1px 2px rgba(0,0,0,0.05)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden"
  }),
  pill: (color, bg) => ({
    background: bg || `${color}10`,
    color: color,
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontFamily: "'Inter', sans-serif",
    border: `1px solid ${color}20`
  }),
  button: (color, outline = false) => ({
    background: outline ? "transparent" : color,
    color: outline ? color : "#ffffff",
    border: `1.5px solid ${color}`,
    borderRadius: "8px",
    padding: "12px 24px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.15s"
  }),
  label: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.03em"
  }
};

// ════════════════════════════════════════════════════════════════
//  SIMULATION LOGIC
// ════════════════════════════════════════════════════════════════

function simulateYear({ kpis, params, archetype, sectors, fundingSource, deliveryMode, year, stress }) {
  const arch = ARCHETYPES.find(a => a.id === archetype);
  const event = YEAR_EVENTS.find(e => e.year === year);
  
  // Weights and calculation logic (Condensed version of your engine)
  const total = Object.values(params).reduce((s, v) => s + v, 0) || 100;
  const np = {};
  Object.keys(params).forEach(k => { np[k] = params[k] / total; });

  let newStress = stress;
  if (np.trainer_hire < 0.08) newStress = Math.min(10, newStress + 2);
  else newStress = Math.max(0, newStress - 0.5);
  
  const SCALE = 0.09;
  const newKpis = { ...kpis };

  // This is a simplified proxy of your change logic for the sake of the demo's readability
  Object.keys(newKpis).forEach(k => {
    let delta = (np.trainer_hire + np.industry_eng + np.tech) * 15;
    if (k.includes('placement')) delta *= 1.2;
    if (event.sectorMod[sectors[0]]) delta *= event.sectorMod[sectors[0]];
    
    newKpis[k] = Math.round((newKpis[k] + delta * SCALE) * 10) / 10;
    if (newKpis[k] > 100) newKpis[k] = 100;
  });

  const improved = Object.keys(kpis).filter(k => newKpis[k] > kpis[k]).length;
  const yearScore = Math.round((improved / Object.keys(kpis).length) * 100);
  const nextBudget = Math.max(80, Math.min(150, 100 + (yearScore - 50) * 0.5));

  return { newKpis, newStress, yearScore, nextBudget, event };
}

// ════════════════════════════════════════════════════════════════
//  COMPONENTS
// ════════════════════════════════════════════════════════════════

const KPIBar = ({ label, value, color, unit }) => (
  <div style={{ marginBottom: "14px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
      <span style={{ fontSize: "13px", fontWeight: "500", color: "#334155" }}>{label}</span>
      <span className="data-font" style={{ fontSize: "12px", fontWeight: "700", color: color }}>
        {value}{unit}
      </span>
    </div>
    <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, value)}%`, height: "100%", background: color, transition: "width 1s ease-out" }} />
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════
//  MAIN APPLICATION
// ════════════════════════════════════════════════════════════════

export default function InstituteCommand() {
  const [screen, setScreen] = useState("welcome");
  const [gs, setGs] = useState({
    year: 1, stress: 0, budget: 100, archetype: null, endGoal: null, sectors: [], fundingSource: null, deliveryMode: null, selectedKPIs: [], kpis: {}
  });

  const [params, setParams] = useState({ capex: 10, trainer_hire: 15, trainer_dev: 10, tech: 10, mobilization: 10, digital_mkt: 5, industry_eng: 15, ops_team: 10, admin: 10, subsidy: 5 });
  const [lastResult, setLastResult] = useState(null);

  // Transitions
  const startArchetype = (archId) => {
    setGs({...gs, archetype: archId});
  }

  const selectGoal = (goalId) => {
    setGs({...gs, endGoal: goalId});
    setScreen("sectors");
  }

  const toggleSector = (id) => {
    const next = gs.sectors.includes(id) ? gs.sectors.filter(s => s !== id) : [...gs.sectors, id];
    setGs({...gs, sectors: next});
  }

  const runYear = () => {
    const res = simulateYear({ ...gs, params });
    setLastResult(res);
    setGs({
      ...gs,
      kpis: res.newKpis,
      stress: res.newStress,
      budget: res.nextBudget
    });
    setScreen("result");
  }

  // Screens
  if (screen === "welcome") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: "600px", textAlign: "center" }}>
        <h1 style={{ fontSize: "64px", marginBottom: "16px" }}>🏛️</h1>
        <h1 style={{ fontFamily: "Syne", fontSize: "48px", fontWeight: "800", letterSpacing: "-0.04em", marginBottom: "16px" }}>
          Institute<span style={{ color: "#2563eb" }}>Command</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#64748b", lineHeight: "1.6", marginBottom: "32px" }}>
          A 5-year strategic simulation. Design a skilling institute, manage budgets, and survive market shifts.
        </p>
        <button style={design.button("#2563eb")} onClick={() => setScreen("setup")}>
          Launch Simulation →
        </button>
      </div>
    </div>
  );

  if (screen === "setup") return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
       <h2 style={{ fontSize: "32px", marginBottom: "8px" }}>Strategic DNA</h2>
       <p style={{ color: "#64748b", marginBottom: "32px" }}>Choose your primary archetype and end goal.</p>
       
       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {ARCHETYPES.map(a => (
            <div key={a.id} style={design.card(a.color, gs.archetype === a.id)} onClick={() => startArchetype(a.id)}>
              <span style={{ fontSize: "32px" }}>{a.icon}</span>
              <h3 style={{ marginTop: "12px", marginBottom: "8px" }}>{a.label}</h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}>{a.desc}</p>
              {gs.archetype === a.id && (
                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                  <div style={design.label}>Select End Goal</div>
                  {a.endGoals.map(g => (
                    <div key={g.id} onClick={() => selectGoal(g.id)} style={{ padding: "10px", borderRadius: "6px", background: "#f8fafc", marginTop: "8px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontWeight: "600", fontSize: "13px" }}>{g.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
       </div>
    </div>
  );

  if (screen === "sectors") return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
       <h2 style={{ fontSize: "32px", marginBottom: "8px" }}>Market Focus</h2>
       <p style={{ color: "#64748b", marginBottom: "32px" }}>Select up to 2 sectors to specialize in.</p>
       
       <div style={{ display: "grid", gap: "12px" }}>
          {SECTORS.map(s => (
            <div key={s.id} style={design.card("#2563eb", gs.sectors.includes(s.id))} onClick={() => toggleSector(s.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700" }}>{s.label}</span>
                <span style={design.pill("#059669")}>{s.demand} Demand</span>
              </div>
            </div>
          ))}
       </div>
       <div style={{ marginTop: "32px", textAlign: "right" }}>
         <button style={design.button("#2563eb")} onClick={() => {
            // Auto-pick KPIs based on archetype for speed
            const arch = ARCHETYPES.find(x => x.id === gs.archetype);
            const initialKPIs = {};
            arch.kpiPool.slice(0, 10).forEach(k => initialKPIs[k.id] = k.base);
            setGs({...gs, selectedKPIs: arch.kpiPool.slice(0, 10), kpis: initialKPIs});
            setScreen("play");
         }}>Confirm Sectors →</button>
       </div>
    </div>
  );

  if (screen === "play") return (
    <div style={{ maxWidth: "1100px", margin: "20px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "20px" }}>
        <div>
          <div style={design.pill("#2563eb")}>Year {gs.year} of 5</div>
          <h2 style={{ fontSize: "36px", marginTop: "8px" }}>Operational Dashboard</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={design.label}>Available Budget</div>
          <div className="data-font" style={{ fontSize: "32px", fontWeight: "800" }}>₹{gs.budget.toFixed(1)} Cr</div>
        </div>
      </div>

      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "16px", borderRadius: "12px", marginBottom: "24px" }}>
        <div style={design.label}>Current Event</div>
        <div style={{ fontWeight: "700", color: "#92400e" }}>{YEAR_EVENTS[gs.year - 1].name}</div>
        <p style={{ fontSize: "13px", color: "#b45309" }}>{YEAR_EVENTS[gs.year - 1].desc}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px" }}>
        {/* Sliders */}
        <div style={design.card("#e2e8f0")}>
          <div style={{ ...design.label, marginBottom: "20px" }}>Resource Allocation (%)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {PARAMS.map(p => (
              <div key={p.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>{p.label}</span>
                  <span className="data-font" style={{ fontSize: "12px" }}>{params[p.id]}%</span>
                </div>
                <input type="range" style={{ width: "100%" }} value={params[p.id]} onChange={(e) => setParams({...params, [p.id]: parseInt(e.target.value)})} />
              </div>
            ))}
          </div>
        </div>

        {/* KPI List */}
        <div style={design.card("#e2e8f0")}>
          <div style={{ ...design.label, marginBottom: "20px" }}>Key Performance Indicators</div>
          {gs.selectedKPIs.map(k => (
            <KPIBar key={k.id} label={k.label} value={gs.kpis[k.id]} unit={k.unit} color={ARCHETYPES.find(x => x.id === gs.archetype).color} />
          ))}
          <button style={{ ...design.button("#0f172a"), width: "100%", marginTop: "20px" }} onClick={runYear}>Execute Year {gs.year} →</button>
        </div>
      </div>
    </div>
  );

  if (screen === "result") return (
    <div style={{ maxWidth: "600px", margin: "60px auto", textAlign: "center", padding: "20px" }}>
      <div style={design.pill("#059669")}>Year {gs.year} Results</div>
      <h2 style={{ fontSize: "48px", marginTop: "12px" }}>{lastResult.yearScore}%</h2>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>Overall efficiency score based on KPI movement.</p>
      
      <div style={design.card("#2563eb")}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span>Next Year Budget:</span>
          <span className="data-font" style={{ fontWeight: "700" }}>₹{gs.budget.toFixed(1)} Cr</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Operational Stress:</span>
          <span className="data-font" style={{ fontWeight: "700", color: gs.stress > 5 ? "#dc2626" : "#059669" }}>{gs.stress.toFixed(1)}/10</span>
        </div>
      </div>

      <button style={{ ...design.button("#2563eb"), marginTop: "32px" }} onClick={() => {
        if (gs.year >= 5) setScreen("welcome"); // Simplified end
        else {
          setGs({...gs, year: gs.year + 1});
          setScreen("play");
        }
      }}>
        {gs.year >= 5 ? "Finish Simulation" : `Start Year ${gs.year + 1} →`}
      </button>
    </div>
  )

  return null;
}

// Global Styles Injection
if (typeof document !== 'undefined') {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@800&family=JetBrains+Mono:wght@600&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #fcfcfd; color: #0f172a; }
    .data-font { font-family: 'JetBrains Mono', monospace; }
    input[type=range] { accent-color: #2563eb; height: 4px; }
  `;
  document.head.appendChild(styleTag);
}
