import React, { useState } from "react";

// ════════════════════════════════════════════════════════════════
//  GAME DATA (UNTOUCHED LOGIC)
// ════════════════════════════════════════════════════════════════

const ARCHETYPES = [
  {
    id: "employment", label: "Sustainable Employment", icon: "🎯", color: "#059669", glow: "rgba(5,150,105,0.15)",
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
    id: "inclusion", label: "Access & Inclusion", icon: "🌍", color: "#d97706", glow: "rgba(217,119,6,0.15)",
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
    id: "financial", label: "Financial Sustainability", icon: "📈", color: "#2563eb", glow: "rgba(37,99,235,0.15)",
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
    id: "innovation", label: "Innovation & Flexibility", icon: "⚡", color: "#7c3aed", glow: "rgba(124,58,237,0.15)",
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
    id: "premium", label: "Premium Brand & Reputation", icon: "🏆", color: "#c2410c", glow: "rgba(194,65,12,0.15)",
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
  { id: "manufacturing", label: "Manufacturing & Mechatronics", capex: "High", salary: "₹14-16K/mo", faculty: "Medium", govtPriority: 9, demand: "Growing", techRisk: "Medium", affordability: "Medium", placement: "Medium", rarity: "Common", constraint: "Requires physical labs & CNC equipment", salaryMult: 1.10, placementMult: 1.15 },
  { id: "healthcare", label: "Healthcare & Allied Services", capex: "Medium", salary: "₹12-15K/mo", faculty: "Medium", govtPriority: 8, demand: "Growing", techRisk: "Low", affordability: "Medium", placement: "High", rarity: "Moderate", constraint: "Certified trainers mandatory; clinical labs needed", salaryMult: 1.05, placementMult: 1.08 },
  { id: "bfsi", label: "BFSI", capex: "Low", salary: "₹14-18K/mo", faculty: "High", govtPriority: 7, demand: "Stable", techRisk: "High", affordability: "High", placement: "High", rarity: "Saturated", constraint: "Compliance-heavy; constant cert updates needed", salaryMult: 1.18, placementMult: 1.10 },
  { id: "it", label: "IT & Digital Services", capex: "Low", salary: "₹12-20K/mo", faculty: "High", govtPriority: 8, demand: "Volatile", techRisk: "Very High", affordability: "High", placement: "Medium", rarity: "Saturated", constraint: "AI disruption accelerating; constant refresh required", salaryMult: 1.20, placementMult: 1.08 },
  { id: "logistics", label: "Logistics & Supply Chain", capex: "Low", salary: "₹11-14K/mo", faculty: "Low", govtPriority: 7, demand: "Growing", techRisk: "Medium", affordability: "Medium", placement: "High", rarity: "Opportunity", constraint: "Last-mile hiring volatile; seasonal demand spikes", salaryMult: 1.00, placementMult: 1.05 },
  { id: "retail", label: "Retail & Sales", capex: "Very Low", salary: "₹10-13K/mo", faculty: "Low", govtPriority: 5, demand: "Stable", techRisk: "Medium", affordability: "High", placement: "High", rarity: "Common", constraint: "High attrition sector; retention KPIs at risk", salaryMult: 0.95, placementMult: 1.12 },
  { id: "construction", label: "Construction & Infrastructure", capex: "High", salary: "₹12-15K/mo", faculty: "Low", govtPriority: 9, demand: "Booming", techRisk: "Low", affordability: "Low", placement: "Medium", rarity: "Opportunity", constraint: "Informal sector dominant; safety certification critical", salaryMult: 1.05, placementMult: 1.00 },
  { id: "hospitality", label: "Hospitality & Food Services", capex: "Medium", salary: "₹10-14K/mo", faculty: "Medium", govtPriority: 6, demand: "Recovering", techRisk: "Low", affordability: "Medium", placement: "High", rarity: "Moderate", constraint: "Seasonal demand; international placement pathways possible", salaryMult: 1.00, placementMult: 1.10 },
  { id: "green", label: "Green Jobs & Renewable Energy", capex: "Medium", salary: "₹13-17K/mo", faculty: "Very Low", govtPriority: 10, demand: "Emerging", techRisk: "Medium", affordability: "Low", placement: "Low", rarity: "Rare Opportunity", constraint: "Job market immature yet; 2-3 yr absorption lag expected", salaryMult: 1.12, placementMult: 0.85 },
  { id: "beauty", label: "Beauty, Wellness & Personal Care", capex: "Low", salary: "₹9-12K/mo", faculty: "Low", govtPriority: 4, demand: "Growing", techRisk: "Low", affordability: "High", placement: "High", rarity: "Moderate", constraint: "Self-employment dominant; placement metrics hard to verify", salaryMult: 0.90, placementMult: 0.95 },
];

const FUNDING_SOURCES = [
  { id: "csr", label: "CSR Grant", icon: "🤝", desc: "Corporate Social Responsibility — non-repayable, outcome-linked", budgetMult: 1.0, expectation: "Social KPIs must be strong. Inclusion & completion tracked.", patience: 2, kpiBonus: { women_pct: 5, marginalized_pct: 5 } },
  { id: "govt", label: "Government Scheme", icon: "🏛️", desc: "Central/State govt schemes — placement-linked milestone payments", budgetMult: 1.15, expectation: "Placement % and enrollment targets are mandatory deliverables.", patience: 3, kpiBonus: { placement_rate: 5, total_learners: 200 } },
  { id: "investor", label: "Impact Investor / PE", icon: "💼", desc: "ROI-focused capital — scale, EBITDA & revenue growth expected", budgetMult: 1.25, expectation: "EBITDA & Revenue must improve every single year.", patience: 1, kpiBonus: { annual_revenue: 3, ebitda_margin: 3 } },
  { id: "self", label: "Bootstrapped", icon: "💰", desc: "Own capital or founder reserves — full control, high personal risk", budgetMult: 0.85, expectation: "Must reach sustainability within 3 years or you run out.", patience: 5, kpiBonus: {} },
  { id: "philanthropy", label: "Philanthropy / Foundation", icon: "🌐", desc: "Mission-driven patient capital — equity and innovation rewarded", budgetMult: 1.05, expectation: "Innovation, equity, and long-term systems thinking valued.", patience: 4, kpiBonus: { rural_pct: 5, curriculum_refresh: 5 } },
];

const DELIVERY_MODES = [
  { id: "classroom", label: "Classroom Only", icon: "🏫", capexMult: 1.2, satisfactionBonus: 5, completionBonus: 8, bestFor: ["manufacturing", "construction", "hospitality"] },
  { id: "handson", label: "Hands-On / Workshop", icon: "🔧", capexMult: 1.5, satisfactionBonus: 12, completionBonus: 10, bestFor: ["manufacturing", "healthcare", "construction"] },
  { id: "online_async", label: "Online Self-Paced", icon: "💻", capexMult: 0.4, satisfactionBonus: -5, completionBonus: -15, bestFor: ["it", "bfsi", "beauty"] },
  { id: "online_live", label: "Online Instructor-Led", icon: "📡", capexMult: 0.6, satisfactionBonus: 5, completionBonus: -5, bestFor: ["it", "bfsi", "retail"] },
  { id: "hybrid", label: "Hybrid / Blended", icon: "🔀", capexMult: 0.9, satisfactionBonus: 8, completionBonus: 5, bestFor: ["healthcare", "logistics", "green"] },
  { id: "mobile", label: "Mobile / Community", icon: "🚐", capexMult: 0.5, satisfactionBonus: 3, completionBonus: -3, bestFor: ["construction", "beauty", "retail"] },
];

const YEAR_EVENTS = [
  { year: 1, name: "Year 1 — Establishing Ground", desc: "Your first year. Build credibility. Stakeholders are watching.", mod: 1.0, sectorMod: {} },
  { year: 2, name: "China+1 Manufacturing Surge", desc: "Global firms shift production to India. PLI scheme is live. Manufacturing & logistics demand jumps 20%. Employers want certified talent now.", mod: 1.05, sectorMod: { manufacturing: 1.20, logistics: 1.10, construction: 1.15 } },
  { year: 3, name: "New Government — Budget Realignment", desc: "Post-election Union Budget. Digital skilling gets a boost. Rural scheme funds cut 15%. CSR mandates tightened by MCA.", mod: 0.95, sectorMod: { it: 1.10, green: 1.20, construction: 0.90 } },
  { year: 4, name: "Global Recession Signal", desc: "IT hiring freeze. BFSI layoffs hit mid-level. Healthcare and green jobs hold steady. Investor confidence drops. Students anxious about job prospects.", mod: 0.88, sectorMod: { it: 0.75, bfsi: 0.85, healthcare: 1.05, green: 1.10 } },
  { year: 5, name: "AI & Digital Disruption Wave", desc: "AI tools reshape job roles across all sectors. Micro-credential demand surges. Institutes that adapted are thriving. Those that didn't are scrambling.", mod: 1.08, sectorMod: { it: 1.15, manufacturing: 1.05, retail: 0.90 } },
];

const PARAMS = [
  { id: "capex", label: "CapEx", sub: "Infrastructure & Equipment", icon: "🏗️", desc: "Labs, centres, machines & tools for physical or hybrid delivery" },
  { id: "trainer_hire", label: "Trainer Hiring", sub: "Faculty & SMEs", icon: "👩‍🏫", desc: "Full-time/contract trainers and subject matter experts" },
  { id: "trainer_dev", label: "Trainer Development", sub: "Capability Building", icon: "📚", desc: "Training-of-Trainers, industry exposure, faculty upskilling" },
  { id: "tech", label: "Technology", sub: "LMS & Digital Infra", icon: "💻", desc: "LMS, virtual classrooms, digital tools, learner tracking" },
  { id: "mobilization", label: "Mobilization", sub: "Field Outreach", icon: "🚌", desc: "On-ground outreach teams, school visits, rural camps" },
  { id: "digital_mkt", label: "Digital Marketing", sub: "Campaigns & SEO", icon: "📣", desc: "Social media, paid campaigns, SEO for lead generation" },
  { id: "industry_eng", label: "Industry Engagement", sub: "Employer Relations", icon: "🏭", desc: "Employer tie-ups, job fairs, apprenticeship partnerships" },
  { id: "ops_team", label: "Operations Team", sub: "Program Management", icon: "⚙️", desc: "Program managers, MIS, data teams, finance & compliance" },
  { id: "admin", label: "Admin & Support", sub: "Back Office", icon: "🗂️", desc: "Logistics, centre admin, procurement & utilities" },
  { id: "subsidy", label: "Student Subsidies", sub: "Incentives & Scholarships", icon: "🎓", desc: "Travel, meals, stipends, scholarships & insurance" },
];

// ════════════════════════════════════════════════════════════════
//  SIMULATION ENGINE (UNTOUCHED)
// ════════════════════════════════════════════════════════════════

function simulateYear({ kpis, params, archetype, sectors, fundingSource, deliveryMode, year, stress }) {
  const arch = ARCHETYPES.find(a => a.id === archetype);
  const event = YEAR_EVENTS.find(e => e.year === year);
  const delivery = DELIVERY_MODES.find(d => d.id === deliveryMode);

  // Normalize params to 0-1 scale
  const total = Object.values(params).reduce((s, v) => s + v, 0) || 100;
  const np = {};
  Object.keys(params).forEach(k => { np[k] = params[k] / total; });

  // Stress logic
  let newStress = stress;
  if (np.trainer_hire < 0.06) newStress = Math.min(10, newStress + 2.5);
  else if (np.trainer_hire > 0.15) newStress = Math.max(0, newStress - 1.5);
  else newStress = Math.max(0, newStress - 0.5);
  const stressMult = newStress > 7 ? 0.82 : newStress > 4 ? 0.93 : 1.0;

  // Focus penalty
  const focusMult = sectors.length === 1 ? 1.0 : sectors.length === 2 ? 0.85 : 0.70;

  // Sector multipliers
  let sectorSalary = 1.0, sectorPlacement = 1.0;
  sectors.forEach(sid => {
    const s = SECTORS.find(x => x.id === sid);
    if (s) { sectorSalary += (s.salaryMult - 1); sectorPlacement += (s.placementMult - 1); }
  });

  // Event modifier
  const primary = sectors[0];
  const evtSector = event.sectorMod[primary] || 1.0;
  const evtGlobal = event.mod;

  // Delivery compatibility
  const compatible = delivery.bestFor.includes(primary);
  const delivMult = compatible ? 1.08 : 0.88;

  // CapEx diminishing returns (over 30% allocation hurts ROI)
  const capexOver = Math.max(0, np.capex - 0.30);
  const capexROIPenalty = 1 - capexOver * 1.2;

  // Influence factors
  const fI = np.industry_eng * arch.paramWeights.industry_eng;
  const fF = (np.trainer_hire * arch.paramWeights.trainer_hire) + (np.trainer_dev * arch.paramWeights.trainer_dev);
  const fT = np.tech * arch.paramWeights.tech;
  const fO = (np.mobilization * arch.paramWeights.mobilization) + (np.digital_mkt * arch.paramWeights.digital_mkt);
  const fS = np.subsidy * arch.paramWeights.subsidy;
  const fOP = np.ops_team * arch.paramWeights.ops_team;
  const fC = np.capex * arch.paramWeights.capex;
  const fM = np.digital_mkt * arch.paramWeights.digital_mkt;

  // KPI delta table — each entry is how much the KPI changes this year
  const deltas = {
    // Employment
    placement_rate: (fI * 14 + fF * 8 + fO * 5) * sectorPlacement * focusMult * evtSector * evtGlobal * delivMult * stressMult,
    retention_12: (fF * 11 + fS * 7 + fOP * 5) * stressMult,
    retention_24: (fF * 9 + fI * 6) * stressMult * evtGlobal,
    soqs: (fF * 11 + fI * 9 + fT * 4) * sectorSalary * stressMult,
    employer_repeat: (fI * 15 + fF * 6) * stressMult,
    employer_sat: (fF * 10 + fOP * 6 + fC * 4) * stressMult,
    job_dropoff: -(fF * 7 + fS * 6),
    role_alignment: (fF * 13 + fI * 10) * stressMult,
    alumni_tracking: (fT * 11 + fOP * 8),
    job_satisfaction: (fF * 9 + fS * 6 + fC * 4) * delivMult,
    income_growth_12: (fF * 5 + fI * 5) * sectorSalary,
    active_employers: (fI * 12 + fO * 4),
    avg_salary: (fF * 0.35 + fI * 0.45) * sectorSalary * evtSector * evtGlobal,
    // Inclusion
    total_learners: (fO * 600 + fS * 450 + fC * 250),
    women_pct: (fO * 7 + fS * 6),
    rural_pct: (fO * 9 + fS * 7),
    firstgen_pct: (fO * 8 + fS * 5),
    marginalized_pct: (fO * 7 + fS * 8),
    scholarship_pct: (fS * 14),
    completion_rate: (fF * 9 + fS * 7 + fT * 5) * delivMult * stressMult,
    dropout_rate: -(fS * 7 + fF * 6),
    student_sat: (fF * 9 + fS * 5 + fC * 4) * delivMult,
    marginalized_placement: (fI * 9 + fO * 6) * focusMult,
    women_income_uplift: (fF * 4 + fI * 5) * sectorSalary,
    local_lang_pct: (fO * 11 + fS * 5),
    // Financial
    annual_revenue: (fO * 3.5 + fT * 2.5 + fI * 2.5) * capexROIPenalty * evtGlobal,
    ebitda_margin: (fOP * 7 + fT * 5 - np.capex * 6) * capexROIPenalty,
    cost_per_student: -(fOP * 1800 + fT * 1200),
    fee_recovery: (fO * 9 + fOP * 7),
    rev_per_learner: (fI * 600 + fT * 500) * sectorSalary,
    learner_per_trainer: (fT * 3 + fOP * 2),
    centre_utilisation: (fO * 9 + fC * 4) * capexROIPenalty,
    lac: -(fO * 250 + fM * 200),
    blended_ratio: (fT * 12),
    new_revenue_streams: (fI * 0.5 + fT * 0.5),
    breakeven_progress: (fOP * 9 + fT * 6 - np.capex * 7) * capexROIPenalty,
    roi: (fOP * 5 + fT * 4 - np.capex * 6) * capexROIPenalty * evtGlobal,
    recurring_rev_ratio: (fI * 5 + fT * 3),
    // Innovation
    online_learner_pct: (fT * 13 + fO * 5),
    digital_completion: (fT * 11 + fF * 7) * delivMult,
    microcred_pct: (fT * 9 + fOP * 4),
    launch_time: -(fT * 9 + fOP * 7 + fF * 4),
    curriculum_refresh: (fF * 7 + fI * 5 + fT * 5),
    learner_sat: (fF * 8 + fT * 7 + fS * 4) * delivMult,
    return_upskill_pct: (fI * 5 + fT * 5 + fF * 4),
    flexibility_rating: (fT * 11 + fOP * 5),
    online_dropoff: -(fT * 7 + fS * 5 + fF * 6),
    codesign_pct: (fI * 13 + fF * 5),
    role_versatility: (fI * 9 + fF * 7 + fT * 4),
    new_pilots: (fT * 0.7 + fI * 0.6 + fF * 0.5),
    // Premium
    alumni_nps: (fF * 9 + fS * 6 + fC * 4) * stressMult,
    employer_nps: (fI * 11 + fF * 7) * stressMult,
    tier1_placement: (fI * 7 + fF * 6) * focusMult * stressMult,
    offer_app_ratio: (fI * 0.45 + fF * 0.35),
    industry_exp_faculty: (fF * 11 + fI * 7),
    tier1_partners: (fI * 0.9 + fO * 0.3),
    curriculum_endorsement: (fI * 9 + fF * 7),
    alumni_recognition: (fF * 5 + fI * 4 + fS * 3),
    media_mentions: (fM * 16 + fI * 8),
    intl_collab: (fI * 0.6 + fO * 0.2),
    campus_exp: (fC * 15 + fOP * 6) * capexROIPenalty,
    employer_recall: (fM * 13 + fI * 9),
    repeat_applicants: (fO * 7 + fS * 4 + fOP * 5),
  };

  // Add funding KPI bonuses
  const funder = FUNDING_SOURCES.find(f => f.id === fundingSource);
  if (funder) {
    Object.entries(funder.kpiBonus).forEach(([k, v]) => {
      if (deltas[k] !== undefined) deltas[k] = (deltas[k] || 0) + v * 0.25;
    });
  }

  // Scale all deltas — 0.08 controls speed of change per year
  const SCALE = 0.08;
  const newKpis = { ...kpis };
  Object.keys(newKpis).forEach(k => {
    const d = (deltas[k] || 0) * SCALE;
    newKpis[k] = Math.round((newKpis[k] + d) * 10) / 10;
    if (k !== "cost_per_student" && k !== "lac" && k !== "total_learners" && k !== "annual_revenue" && k !== "rev_per_learner") {
      newKpis[k] = Math.max(0, Math.min(k === "ebitda_margin" || k === "roi" ? 60 : 100, newKpis[k]));
    } else {
      newKpis[k] = Math.max(0, newKpis[k]);
    }
  });

  // Year score — how many selected KPIs improved
  let improved = 0;
  Object.keys(kpis).forEach(k => {
    const kpiDef = arch.kpiPool.find(kp => kp.id === k);
    const inv = kpiDef?.inverse;
    if (inv ? newKpis[k] < kpis[k] : newKpis[k] > kpis[k]) improved++;
  });
  const yearScore = Math.round((improved / Object.keys(kpis).length) * 100);

  // Budget model
  const budgetChange = (yearScore - 50) * 0.4 + evtGlobal * 8 - 5;
  const nextBudget = Math.max(65, Math.min(160, 100 + budgetChange));

  // Narrative triggers per KPI
  const narratives = {};
  Object.keys(kpis).forEach(k => {
    const before = kpis[k];
    const after = newKpis[k];
    const kpiDef = arch.kpiPool.find(kp => kp.id === k);
    const inv = kpiDef?.inverse;
    const good = inv ? after < before : after > before;
    const msgs = {
      placement_rate: good ? "Industry engagement is paying dividends — employers are turning up." : "Weak employer engagement left seats unfilled this year.",
      retention_12: good ? "Post-placement support is keeping students in jobs longer." : "Students leaving early — check trainer quality and job matching.",
      soqs: good ? "Salary distribution is healthy across bands. Quality placements." : "Salary quality uneven — too many outliers at the low end.",
      employer_repeat: good ? "Employers are coming back. Trust is building." : "Employer repeat rate stagnant. Deepen your industry relationships.",
      job_dropoff: good ? "Fewer early job exits — good sign of placement quality." : "Job drop-offs rising. Placement-training alignment needs work.",
      ebitda_margin: good ? "Operational efficiency improving — margin moving in right direction." : "Margins under pressure. Watch CapEx and ops cost.",
      completion_rate: good ? "Strong faculty and subsidies keeping learners engaged to the end." : "Completion slipping. Learner support or pedagogy needs review.",
      dropout_rate: good ? "Drop-out reducing — subsidies and field support are working." : "Dropout rising. Mobilisation alone won't fix this.",
      online_dropoff: good ? "Digital learner retention improving — content and support working." : "Online drop-offs still high. Consider more live sessions or nudges.",
      employer_nps: good ? "Employers are increasingly satisfied — brand is growing." : "Employer NPS flat. Freshen your talent quality and engagement.",
      default_good: "Strategic investment in this area is paying off steadily.",
      default_bad: "This KPI needs more focused investment next year.",
    };
    narratives[k] = msgs[k] || (good ? msgs.default_good : msgs.default_bad);
  });

  return { newKpis, newStress, yearScore, nextBudget, event, narratives, improved, total: Object.keys(kpis).length };
}

// ════════════════════════════════════════════════════════════════
//  REFINED FORMAL STYLE HELPERS
// ════════════════════════════════════════════════════════════════

const design = {
  font: "'Inter', -apple-system, sans-serif",
  fontMono: "'JetBrains Mono', 'Roboto Mono', monospace",
  radius: "8px",
  border: "1px solid #e2e8f0",
  shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  primary: "#2563eb"
};

const pill = (color, bg) => ({
  background: bg || (color + "12"),
  color,
  borderRadius: "4px",
  padding: "4px 10px",
  fontSize: "10px",
  fontWeight: 600,
  fontFamily: design.fontMono,
  display: "inline-flex",
  alignItems: "center",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  border: `1px solid ${color}25`
});

const card = (color = "#cbd5e1", selected = false) => ({
  background: "#ffffff",
  border: selected ? `2px solid ${color}` : design.border,
  borderRadius: design.radius,
  padding: "20px",
  boxShadow: selected ? `0 4px 6px -1px rgba(0, 0, 0, 0.1)` : design.shadow,
  transition: "all 0.15s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column"
});

const btn = (color, outline = false) => ({
  background: outline ? "transparent" : color,
  color: outline ? color : "#ffffff",
  border: `1px solid ${color}`,
  borderRadius: "6px",
  padding: "10px 20px",
  fontWeight: 600,
  fontFamily: design.font,
  cursor: "pointer",
  fontSize: "13px",
  transition: "filter 0.1s",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px"
});

// ════════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ════════════════════════════════════════════════════════════════

function KPIBar({ label, value, color, inverse }) {
  const displayPct = inverse ? Math.max(0, 100 - value) : Math.min(100, value);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
        <span style={{ color: "#475569", fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: design.fontMono, color, fontWeight: 600 }}>{typeof value === "number" ? value.toFixed(1) : value}</span>
      </div>
      <div style={{ background: "#f1f5f9", borderRadius: 4, height: 6 }}>
        <div style={{ width: `${Math.max(2, displayPct)}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function StepIndicator({ current }) {
  const steps = ["Archetype", "Sectors", "Funding", "KPIs", "Play"];
  return (
    <div style={{ display: "flex", gap: 0, alignItems: "center", justifyContent: "center", marginBottom: 32, flexWrap: "wrap" }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", margin: "4px" }}>
          <div style={{
            width: 24, height: 24, borderRadius: "4px", border: `1px solid ${i + 1 <= current ? design.primary : "#cbd5e1"}`,
            background: i + 1 < current ? design.primary : i + 1 === current ? "#eff6ff" : "#fff",
            color: i + 1 < current ? "#fff" : i + 1 === current ? design.primary : "#94a3b8",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
          }}>{i + 1 < current ? "✓" : i + 1}</div>
          <div style={{ fontSize: 11, color: i + 1 === current ? "#0f172a" : "#64748b", fontWeight: i + 1 === current ? 600 : 400, marginLeft: 8, marginRight: 8, textTransform: "uppercase", letterSpacing: "0.02em" }}>{s}</div>
          {i < steps.length - 1 && <div style={{ width: 16, height: 1, background: "#e2e8f0", marginRight: 8 }} className="hide-mobile" />}
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SCREENS
// ════════════════════════════════════════════════════════════════

function Welcome({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: 640, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>🏛️</div>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(32px, 5vw, 42px)", color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 16 }}>
          Institute<span style={{ color: design.primary }}>Command</span>
        </h1>
        <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 32 }}>
          Strategic planning simulation for technical vocational education in India. Manage a 5-year scaling roadmap through policy shifts and market volatility.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {[["🎭", "Archetypes"], ["🎯", "Goals"], ["📊", "KPIs"], ["💰", "Budgeting"], ["⚡", "Market Events"]].map(([icon, label]) => (
            <span key={label} style={pill("#475569", "#f1f5f9")}>{icon} {label}</span>
          ))}
        </div>
        <button onClick={onStart} style={{ ...btn(design.primary), padding: "14px 40px", fontSize: 15, borderRadius: 8 }}>
          Begin Simulation →
        </button>
      </div>
    </div>
  );
}

function ArchetypeStep({ onNext }) {
  const [arch, setArch] = useState(null);
  const [goal, setGoal] = useState(null);
  const a = ARCHETYPES.find(x => x.id === arch);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
      <StepIndicator current={1} />
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, color: "#0f172a", marginBottom: 8 }}>Strategic DNA</h2>
        <p style={{ color: "#64748b", fontSize: 14 }}>Identify your core institutional vision. This determines your operational weights.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
        {ARCHETYPES.map(x => (
          <div key={x.id} onClick={() => { setArch(x.id); setGoal(null); }} style={{ ...card(x.color, arch === x.id), cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{x.icon}</span>
              {arch === x.id && <span style={{ color: x.color, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 8 }}>{x.label}</div>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 16, flexGrow: 1 }}>{x.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {x.pros.slice(0, 2).map(p => <span key={p} style={{ ...pill(x.color), fontSize: 9 }}>{p}</span>)}
            </div>
          </div>
        ))}
      </div>

      {a && (
        <div style={{ marginBottom: 32, padding: "24px", background: "#f8fafc", borderRadius: design.radius, border: design.border }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 16, textTransform: "uppercase" }}>Primary Outcome Target</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {a.endGoals.map(g => (
              <div key={g.id} onClick={() => setGoal(g.id)} style={{ ...card(a.color, goal === g.id), cursor: "pointer", background: "#fff", padding: "16px" }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: goal === g.id ? a.color : "#0f172a", marginBottom: 6 }}>{g.label}</div>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4, marginBottom: 12 }}>{g.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {Object.entries(g.kpiTargets).map(([k, v]) => (
                    <span key={k} style={{ fontFamily: design.fontMono, fontSize: 9, color: "#94a3b8" }}>{k.replace(/_/g, " ")}: {v}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => arch && goal && onNext({ archetype: arch, endGoal: goal })}
          style={{ ...btn(a?.color || "#94a3b8"), opacity: arch && goal ? 1 : 0.4 }}>
          Next: Sector Specialization →
        </button>
      </div>
    </div>
  );
}

function SectorStep({ archetype, onNext, onBack }) {
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const a = ARCHETYPES.find(x => x.id === archetype);

  const toggle = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
    else if (selected.length < 3) setSelected([...selected, id]);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
      <StepIndicator current={2} />
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, color: "#0f172a", marginBottom: 8 }}>Sector Specialization</h2>
        <p style={{ color: "#64748b", fontSize: 14 }}>Choose up to 3 industry verticals. Diversification increases resilience but decreases operational focus.</p>
        {selected.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <span style={pill(a.color)}>
              {selected.length} Sector{selected.length > 1 ? 's' : ''} · Multiplier: {selected.length === 1 ? "1.00x" : selected.length === 2 ? "0.85x" : "0.70x"}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12, marginBottom: 32 }}>
        {SECTORS.map(sec => {
          const isSel = selected.includes(sec.id);
          const exp = expanded === sec.id;
          const demandColor = { Growing: "#059669", Booming: "#059669", Stable: "#d97706", Volatile: "#dc2626", Emerging: "#7c3aed", Recovering: "#d97706" }[sec.demand] || "#64748b";
          return (
            <div key={sec.id} style={{ ...card(a.color, isSel), cursor: "pointer" }} onClick={() => toggle(sec.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{sec.label}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: design.fontMono }}>{sec.salary}</div>
                </div>
                {isSel && <div style={{ width: 18, height: 18, borderRadius: 99, background: a.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</div>}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                <span style={pill(demandColor)}>{sec.demand}</span>
                <span style={pill("#475569")}>CapEx: {sec.capex}</span>
              </div>
              <button onClick={e => { e.stopPropagation(); setExpanded(exp ? null : sec.id); }}
                style={{ background: "none", border: "none", color: a.color, fontSize: 11, cursor: "pointer", fontWeight: 600, padding: 0, textAlign: "left" }}>
                {exp ? "Hide Intelligence Card" : "View Intelligence Card"}
              </button>
              {exp && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9", fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
                  <div>Govt Priority: {sec.govtPriority}/10 · Faculty: {sec.faculty}</div>
                  <div style={{ marginTop: 4, fontWeight: 500, color: "#b45309" }}>⚠ {sec.constraint}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={btn("#64748b", true)}>← Previous</button>
        <button onClick={() => selected.length > 0 && onNext({ sectors: selected })}
          style={{ ...btn(a.color), opacity: selected.length > 0 ? 1 : 0.4 }}>
          Next: Funding & Delivery →
        </button>
      </div>
    </div>
  );
}

function FundingStep({ archetype, sectors, onNext, onBack }) {
  const [funding, setFunding] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const a = ARCHETYPES.find(x => x.id === archetype);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
      <StepIndicator current={3} />
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, color: "#0f172a", marginBottom: 8 }}>Operational Context</h2>
        <p style={{ color: "#64748b", fontSize: 14 }}>Select your primary capital source and instructional delivery framework.</p>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 12, textTransform: "uppercase" }}>Capital Allocation</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {FUNDING_SOURCES.map(f => (
            <div key={f.id} onClick={() => setFunding(f.id)} style={{ ...card(a.color, funding === f.id), cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{f.label}</div>
              </div>
              <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 12, flexGrow: 1 }}>{f.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: a.color, fontWeight: 600 }}>Budget Mult: {f.budgetMult}x</span>
                <span style={pill("#94a3b8")}>Patience: {f.patience}/5</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 12, textTransform: "uppercase" }}>Instructional Design</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {DELIVERY_MODES.map(d => {
            const compatible = d.bestFor.some(s => sectors.includes(s));
            return (
              <div key={d.id} onClick={() => setDelivery(d.id)} style={{ ...card(a.color, delivery === d.id), cursor: "pointer" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <span>{d.icon}</span>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{d.label}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <span style={pill(compatible ? "#059669" : "#dc2626")}>{compatible ? "Optimum Compatibility" : "High Overhead Risk"}</span>
                </div>
                <div style={{ fontSize: 11, color: "#64748b", fontFamily: design.fontMono }}>CapEx Weight: {d.capexMult}x</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={btn("#64748b", true)}>← Previous</button>
        <button onClick={() => funding && delivery && onNext({ fundingSource: funding, deliveryMode: delivery })}
          style={{ ...btn(a.color), opacity: funding && delivery ? 1 : 0.4 }}>
          Next: Performance Metrics →
        </button>
      </div>
    </div>
  );
}

function KPIStep({ archetype, sectors, fundingSource, onNext, onBack }) {
  const a = ARCHETYPES.find(x => x.id === archetype);
  const funder = FUNDING_SOURCES.find(f => f.id === fundingSource);
  
  const [pool] = useState(() => {
    const p = [...a.kpiPool];
    if (funder?.kpiBonus) {
      Object.keys(funder.kpiBonus).forEach(k => {
        if (!p.find(kp => kp.id === k)) {
          const found = ARCHETYPES.flatMap(x => x.kpiPool).find(kp => kp.id === k);
          if (found) p.push({ ...found, tag: funder.label });
        }
      });
    }
    sectors.forEach(sid => {
      const sec = SECTORS.find(s => s.id === sid);
      if (sec?.salaryMult > 1.1 && !p.find(kp => kp.id === "avg_salary")) {
        p.push({ id: "avg_salary", label: "Avg Starting Salary (LPA)", base: 3.5, unit: "L", tag: sec.label });
      }
    });
    return p;
  });

  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
    else if (selected.length < 10) setSelected([...selected, id]);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
      <StepIndicator current={4} />
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, color: "#0f172a", marginBottom: 8 }}>Performance Framework</h2>
        <p style={{ color: "#64748b", fontSize: 14 }}>Select exactly 10 metrics. These define your institutional scorecard for the next 5 years.</p>
        <div style={{ marginTop: 12 }}>
          <span style={pill(selected.length === 10 ? "#059669" : a.color)}>
            Selected: {selected.length} / 10
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10, marginBottom: 32 }}>
        {pool.map(kpi => {
          const isSel = selected.includes(kpi.id);
          const disabled = !isSel && selected.length === 10;
          return (
            <div key={kpi.id} onClick={() => !disabled && toggle(kpi.id)} style={{
              ...card(a.color, isSel),
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
              padding: "16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: isSel ? a.color : "#1e293b", marginBottom: 4 }}>{kpi.label}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: design.fontMono }}>Baseline: {kpi.base}{kpi.unit}</div>
                  {kpi.tag && <div style={{ ...pill("#9333ea"), fontSize: 8, marginTop: 4 }}>{kpi.tag} context</div>}
                </div>
                {isSel && <div style={{ width: 16, height: 16, borderRadius: 99, background: a.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>✓</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={btn("#64748b", true)}>← Previous</button>
        <button onClick={() => selected.length === 10 && onNext({ selectedKPIs: selected, kpiPool: pool })}
          style={{ ...btn(a.color), opacity: selected.length === 10 ? 1 : 0.4 }}>
          Initialize Dashboard →
        </button>
      </div>
    </div>
  );
}

function YearPlay({ gameState, onSubmit }) {
  const { year, archetype, sectors, stress, budget, kpis, kpiPool, selectedKPIs } = gameState;
  const a = ARCHETYPES.find(x => x.id === archetype);
  const event = YEAR_EVENTS.find(e => e.year === year);

  const [params, setParams] = useState(() => {
    const init = {};
    PARAMS.forEach(p => { init[p.id] = 10; });
    return init;
  });
  
  const [preview, setPreview] = useState(null);
  const total = Object.values(params).reduce((s, v) => s + v, 0);
  const rem = 100 - total;

  const runPreview = () => {
    setPreview(simulateYear({ ...gameState, params }));
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
      {/* Formal Dashboard Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16, borderBottom: "1px solid #e2e8f0", paddingBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={pill(a.color)}>{a.label}</span>
            <span style={pill("#475569")}>Fiscal Year {year}</span>
            <span style={pill(stress > 7 ? "#dc2626" : "#059669")}>Operational Stress: {stress.toFixed(1)}</span>
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 24, color: "#0f172a" }}>Budgetary Allocation</h2>
        </div>
        <div style={{ background: "#f8fafc", border: design.border, borderRadius: "6px", padding: "12px 24px", textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Available Liquidity</div>
          <div style={{ fontFamily: design.fontMono, fontWeight: 700, fontSize: 28, color: "#0f172a" }}>₹{budget.toFixed(2)} Cr</div>
        </div>
      </div>

      {/* Intelligence Bulletin */}
      <div style={{ background: "#fff", border: "1px solid #fcd34d", borderLeft: "4px solid #f59e0b", borderRadius: "6px", padding: "16px", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>📡</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 4, textTransform: "uppercase" }}>{event.name}</div>
            <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.5, margin: 0 }}>{event.desc}</p>
          </div>
        </div>
      </div>

      <div className="responsive-dashboard-grid">
        {/* Metric Overview */}
        <div style={card()}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 16, textTransform: "uppercase" }}>Real-time Scorecard</div>
          <div style={{ overflowY: "auto", maxHeight: "500px", paddingRight: "8px" }}>
            {selectedKPIs.map(kpiId => {
              const kpiDef = kpiPool.find(k => k.id === kpiId);
              if (!kpiDef) return null;
              return <KPIBar key={kpiId} label={kpiDef.label} value={kpis[kpiId]} color={a.color} inverse={kpiDef.inverse} />;
            })}
          </div>
        </div>

        {/* Resource Management */}
        <div style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Strategic Controls</div>
            <span style={pill(Math.abs(rem) < 1 ? "#059669" : "#dc2626")}>
              {total} / 100 Utilization
            </span>
          </div>
          <div style={{ overflowY: "auto", maxHeight: "500px", paddingRight: "8px" }}>
            {PARAMS.map(p => (
              <div key={p.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{p.icon} {p.label}</span>
                  <span style={{ fontFamily: design.fontMono, color: design.primary, fontWeight: 700 }}>{params[p.id]}%</span>
                </div>
                <input type="range" min={0} max={40} value={params[p.id]}
                  onChange={e => setParams(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                  style={{ width: "100%", accentColor: a.color, cursor: "pointer", height: "4px" }} />
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 6, lineHeight: 1.4 }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button onClick={runPreview} style={btn("#64748b", true)}>Simulation Preview</button>
          </div>
        </div>
      </div>

      {/* Analytics Preview */}
      {preview && (
        <div style={{ ...card(a.color), marginTop: 24, background: "#f8fafc" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 16, textTransform: "uppercase" }}>Forecasted Impact</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
            {selectedKPIs.slice(0, 8).map(kpiId => {
              const kpiDef = kpiPool.find(k => k.id === kpiId);
              const before = kpis[kpiId];
              const after = preview.newKpis[kpiId];
              const diff = after - before;
              const good = kpiDef?.inverse ? diff < 0 : diff > 0;
              return (
                <div key={kpiId} style={{ background: "#fff", border: design.border, borderRadius: "4px", padding: "10px" }}>
                  <div style={{ fontSize: 9, color: "#94a3b8", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{kpiDef?.label}</div>
                  <div style={{ fontFamily: design.fontMono, fontWeight: 700, fontSize: 14, color: good ? "#059669" : "#dc2626" }}>
                    {after.toFixed(1)} <span style={{ fontSize: 10 }}>{good ? "↑" : "↓"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
        <button onClick={() => onSubmit(params)} style={{ ...btn(a.color), padding: "12px 48px", fontSize: 14, borderRadius: 8 }}>
          Commit Strategy for Year {year}
        </button>
      </div>
    </div>
  );
}

function YearResult({ year, result, kpisBefore, gameState, onNext }) {
  const a = ARCHETYPES.find(x => x.id === gameState.archetype);
  const { newKpis, newStress, yearScore, nextBudget } = result;
  const scoreColor = yearScore >= 70 ? "#059669" : yearScore >= 40 ? "#d97706" : "#dc2626";

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <span style={pill(a.color)}>Fiscal Year {year} Performance Review</span>
        <h2 style={{ fontWeight: 700, fontSize: 32, color: "#0f172a", marginTop: 12 }}>
          {yearScore >= 70 ? "Above Target" : yearScore >= 40 ? "On Target" : "Below Target"}
        </h2>
      </div>

      <div className="responsive-result-grid" style={{ marginBottom: 32 }}>
        <div style={{ ...card(scoreColor), textAlign: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: design.fontMono, fontWeight: 800, fontSize: 56, color: scoreColor }}>{yearScore}%</div>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Performance Index</div>
        </div>
        
        <div style={card()}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b", fontSize: 13 }}>Next Cycle Appropriation</span>
              <span style={{ fontFamily: design.fontMono, fontWeight: 700 }}>₹{nextBudget.toFixed(2)} Cr</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b", fontSize: 13 }}>Operational Friction</span>
              <span style={{ fontFamily: design.fontMono, fontWeight: 700, color: newStress > 7 ? "#dc2626" : "#059669" }}>{newStress.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 40 }}>
        {gameState.selectedKPIs.map(kpiId => {
          const kpiDef = gameState.kpiPool.find(k => k.id === kpiId);
          const after = newKpis[kpiId];
          const diff = after - (kpisBefore[kpiId] || 0);
          const good = kpiDef?.inverse ? diff < 0 : diff > 0;
          return (
            <div key={kpiId} style={{ ...card(), padding: "16px" }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>{kpiDef?.label}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ fontFamily: design.fontMono, fontWeight: 700, fontSize: 18, color: good ? "#059669" : "#dc2626" }}>{after.toFixed(1)}</span>
                <span style={{ fontSize: 11, color: good ? "#059669" : "#dc2626", fontWeight: 600 }}>{good ? "▲" : "▼"} {Math.abs(diff).toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onNext} style={{ ...btn(a.color), padding: "12px 40px" }}>
          Proceed to Cycle {year < 5 ? year + 1 : "Final Report"} →
        </button>
      </div>
    </div>
  );
}

function FinalResults({ gameState, yearHistory }) {
  const a = ARCHETYPES.find(x => x.id === gameState.archetype);
  const endGoal = a.endGoals.find(g => g.id === gameState.endGoal);
  const finalKPIs = gameState.kpis;

  let goalMet = 0, goalTotal = 0;
  Object.entries(endGoal.kpiTargets).forEach(([kpiId, target]) => {
    goalTotal++;
    const val = finalKPIs[kpiId];
    if (val !== undefined && (ARCHETYPES.flatMap(x=>x.kpiPool).find(kp=>kp.id===kpiId)?.inverse ? val <= target : val >= target)) goalMet++;
  });
  const goalPct = Math.round((goalMet / goalTotal) * 100);

  let totalGood = 0, totalKPIs = 0;
  gameState.selectedKPIs.forEach(kpiId => {
    const kpiDef = gameState.kpiPool.find(k => k.id === kpiId);
    if (!kpiDef) return;
    totalKPIs++;
    const start = kpiDef.base;
    const end = finalKPIs[kpiId] || start;
    if (kpiDef.inverse ? end < start : end > start) totalGood++;
  });
  const kpiScore = Math.round((totalGood / totalKPIs) * 100);
  const avgStress = yearHistory.length ? yearHistory.reduce((s, y) => s + (y.stress || 0), 0) / yearHistory.length : 3;
  const stability = Math.round(Math.max(0, 100 - avgStress * 9));
  const overall = Math.round(goalPct * 0.4 + kpiScore * 0.35 + stability * 0.25);
  const grade = overall >= 85 ? "S" : overall >= 70 ? "A" : overall >= 55 ? "B" : overall >= 40 ? "C" : "D";
  const gc = { S: "#059669", A: "#2563eb", B: "#d97706", C: "#c2410c", D: "#dc2626" }[grade];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🏛️</div>
        <h2 style={{ fontWeight: 800, fontSize: 32, color: "#0f172a", marginBottom: 8 }}>Final Institutional Assessment</h2>
        <p style={{ color: "#64748b", textTransform: "uppercase", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>5-Year Strategic Review Roadmap</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 40 }}>
        <div style={{ ...card(gc), textAlign: "center", padding: "32px", justifyContent: "center" }}>
          <div style={{ fontFamily: design.fontMono, fontSize: 80, fontWeight: 800, color: gc, lineHeight: 1 }}>{grade}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginTop: 8 }}>Composite Strategy Grade</div>
        </div>

        <div style={card()}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 20 }}>Metric Breakdown</div>
          {[
            { label: "Target Achievement", score: goalPct, color: a.color },
            { label: "KPI Growth Velocity", score: kpiScore, color: "#2563eb" },
            { label: "Operational Stability", score: stability, color: "#059669" },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                <span>{s.label}</span>
                <span style={{ fontWeight: 700, fontFamily: design.fontMono }}>{s.score}%</span>
              </div>
              <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${s.score}%`, background: s.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#0f172a", borderRadius: "8px", padding: "32px", color: "#f1f5f9" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 20 }}>Board Observations</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Vision alignment was recorded at <span style={{ color: "#fff", fontWeight: 700 }}>{goalPct}%</span>. 
            The institution navigated the AI disruption cycle with 
            {stability > 70 ? " high operational maturity." : " moderate structural friction."}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Sectoral diversification strategy with <span style={{ color: "#fff", fontWeight: 700 }}>{gameState.sectors.length} sectors</span> 
            resulted in a final composite score of <span style={{ color: "#fff", fontWeight: 700 }}>{overall}/100</span>.
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button onClick={() => window.location.reload()} style={{ ...btn(design.primary), padding: "12px 48px" }}>
          Re-initialize Simulation Cycle
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  MAIN CONTROLLER
// ════════════════════════════════════════════════════════════════

export default function InstituteCommand() {
  const [screen, setScreen] = useState("welcome");
  const [gs, setGs] = useState({});
  const [history, setHistory] = useState([]);
  const [lastResult, setLastResult] = useState(null);

  const buildKPIs = (ids, pool) => {
    const kpis = {};
    ids.forEach(id => {
      const def = pool.find(k => k.id === id);
      if (def) kpis[id] = def.base;
    });
    return kpis;
  };

  const handleSetup = (step, data) => {
    if (step === "archetype") { setGs(g => ({ ...g, ...data })); setScreen("sectors"); }
    else if (step === "sectors") { setGs(g => ({ ...g, ...data })); setScreen("funding"); }
    else if (step === "funding") { setGs(g => ({ ...g, ...data })); setScreen("kpis"); }
    else if (step === "kpis") {
      const funder = FUNDING_SOURCES.find(f => f.id === gs.fundingSource);
      const budgetStart = Math.round(100 * (funder?.budgetMult || 1));
      const kpis = buildKPIs(data.selectedKPIs, data.kpiPool);
      setGs(g => ({ ...g, ...data, year: 1, budget: budgetStart, stress: 0, kpis }));
      setScreen("year");
    }
  };

  const handleYearSubmit = (params) => {
    const result = simulateYear({ ...gs, params });
    const kpisBefore = { ...gs.kpis };
    setLastResult({ ...result, kpisBefore, year: gs.year });
    setGs(g => ({ ...g, kpis: result.newKpis, stress: result.newStress, budget: result.nextBudget }));
    setHistory(h => [...h, { year: gs.year, yearScore: result.yearScore, stress: result.newStress }]);
    setScreen("yearResult");
  };

  const handleNext = () => {
    if (gs.year >= 5) setScreen("final");
    else { setGs(g => ({ ...g, year: g.year + 1 })); setScreen("year"); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { 
          font-family: ${design.font}; 
          background-color: #fcfcfd; 
          color: #0f172a; 
          -webkit-font-smoothing: antialiased;
        }

        .responsive-dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 20px;
        }

        .responsive-result-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 16px;
        }

        input[type=range] { -webkit-appearance: none; background: transparent; }
        input[type=range]:focus { outline: none; }
        input[type=range]::-webkit-slider-runnable-track { height: 4px; background: #e2e8f0; border-radius: 2px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 99px; background: #fff; border: 2px solid ${design.primary}; cursor: pointer; margin-top: -6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

        @media (max-width: 850px) {
          .responsive-dashboard-grid, .responsive-result-grid { grid-template-columns: 1fr; }
          .hide-mobile { display: none; }
        }

        button:active { filter: brightness(0.9); transform: translateY(1px); }
        button:hover { filter: brightness(1.05); }
      `}</style>

      <div style={{ minHeight: "100vh", position: "relative" }}>
        {screen !== "welcome" && (
          <div style={{ background: "#fff", borderBottom: design.border, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>
              🏛️ Institute<span style={{ color: design.primary }}>Command</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {gs.archetype && (() => { const a = ARCHETYPES.find(x => x.id === gs.archetype); return a ? <span style={pill(a.color)}>{a.label}</span> : null; })()}
              {gs.year && <span style={pill("#1e293b")}>Cycle {gs.year}/5</span>}
            </div>
          </div>
        )}

        {screen === "welcome" && <Welcome onStart={() => setScreen("archetype")} />}
        {screen === "archetype" && <ArchetypeStep onNext={d => handleSetup("archetype", d)} />}
        {screen === "sectors" && <SectorStep archetype={gs.archetype} onNext={d => handleSetup("sectors", d)} onBack={() => setScreen("archetype")} />}
        {screen === "funding" && <FundingStep archetype={gs.archetype} sectors={gs.sectors || []} onNext={d => handleSetup("funding", d)} onBack={() => setScreen("sectors")} />}
        {screen === "kpis" && <KPIStep archetype={gs.archetype} sectors={gs.sectors || []} fundingSource={gs.fundingSource} onNext={d => handleSetup("kpis", d)} onBack={() => setScreen("funding")} />}
        {screen === "year" && <YearPlay gameState={gs} onSubmit={handleYearSubmit} />}
        {screen === "yearResult" && lastResult && <YearResult year={lastResult.year} result={lastResult} kpisBefore={lastResult.kpisBefore} gameState={gs} onNext={handleNext} />}
        {screen === "final" && <FinalResults gameState={gs} yearHistory={history} />}
      </div>
    </>
  );
}
