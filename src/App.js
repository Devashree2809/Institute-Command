import React, { useState, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════════════
//  DESIGN TOKENS
// ═══════════════════════════════════════════════════════
const T = {
  bg:"#f8fafc", surface:"#ffffff", surfaceAlt:"#f1f5f9",
  border:"#e2e8f0", text:"#0f172a", textMuted:"#64748b", textFaint:"#94a3b8",
  track:"#e2e8f0", primary:"#2563eb",
  font:"'Inter',-apple-system,sans-serif", mono:"'JetBrains Mono','Roboto Mono',monospace",
};
const mkPill=(color,bg)=>({ background:bg||color+"18", color, borderRadius:4, padding:"3px 9px", fontSize:10, fontWeight:600, fontFamily:T.mono, display:"inline-flex", alignItems:"center", textTransform:"uppercase", letterSpacing:"0.04em", border:`1px solid ${color}30` });
const mkCard=(bColor,sel)=>({ background:T.surface, border:sel?`2px solid ${bColor}`:`1px solid ${T.border}`, borderRadius:8, padding:"18px 20px", boxShadow:sel?`0 0 0 3px ${bColor}18`:"none", transition:"border-color 0.15s", display:"flex", flexDirection:"column" });
const mkBtn=(color,outline)=>({ background:outline?"transparent":color, color:outline?color:"#fff", border:`1px solid ${color}`, borderRadius:6, padding:"10px 20px", fontWeight:600, fontFamily:T.font, cursor:"pointer", fontSize:13, display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6 });

// ═══════════════════════════════════════════════════════
//  GAME DATA
// ═══════════════════════════════════════════════════════
const ARCHETYPES = [
  { id:"employment", label:"Sustainable Employment", icon:"🎯", color:"#059669",
    desc:"Build careers that last — retention, salary quality & employer trust over 24 months.",
    pros:["Employer repeat hiring","Outcome-based funding eligibility","Long-term impact credibility"],
    cons:["Needs 24-month tracking infra","Vulnerable to market downturns","Heavy employer dependency"],
    kpiPool:[
      {id:"placement_rate",label:"Placement Rate (%)",base:40,unit:"%"},
      {id:"retention_12",label:"12-Month Retention (%)",base:50,unit:"%"},
      {id:"retention_24",label:"24-Month Retention (%)",base:40,unit:"%"},
      {id:"soqs",label:"Salary Quality Score",base:50,unit:"pts"},
      {id:"employer_repeat",label:"Employer Repeat Hiring (%)",base:30,unit:"%"},
      {id:"employer_sat",label:"Employer Satisfaction",base:55,unit:"pts"},
      {id:"job_dropoff",label:"Job Drop-off <6M (%)",base:30,unit:"%",inverse:true},
      {id:"role_alignment",label:"Role-Training Alignment (%)",base:45,unit:"%"},
      {id:"alumni_tracking",label:"Alumni Tracking Coverage (%)",base:20,unit:"%"},
      {id:"job_satisfaction",label:"Learner Job Satisfaction",base:55,unit:"pts"},
      {id:"income_growth_12",label:"Income Growth @ 12M (%)",base:8,unit:"%"},
      {id:"active_employers",label:"Active Hiring Partners",base:5,unit:""},
      {id:"avg_salary",label:"Avg Starting Salary (LPA)",base:3.5,unit:"L"},
    ],
    endGoals:[
      {id:"mass_placement",label:"Mass Placement at Scale",desc:"80%+ placement with diverse employer base",kpiTargets:{placement_rate:80,retention_12:70,active_employers:50}},
      {id:"salary_excellence",label:"Premium Salary Outcomes",desc:"Avg 10 LPA with strong 24-month retention",kpiTargets:{avg_salary:10,retention_24:70,soqs:80}},
      {id:"employer_trust",label:"Employer Trust Network",desc:"60%+ repeat hiring, 80+ employer satisfaction",kpiTargets:{employer_repeat:60,employer_sat:80,role_alignment:75}},
    ],
    paramWeights:{capex:0.5,trainer_hire:1.0,trainer_dev:0.9,tech:0.4,mobilization:0.7,digital_mkt:0.5,industry_eng:1.2,ops_team:0.6,admin:0.3,subsidy:0.5},
  },
  { id:"inclusion", label:"Access & Inclusion", icon:"🌍", color:"#d97706",
    desc:"Democratize skilling — reach the last mile, rural youth, women & marginalized communities.",
    pros:["CSR & govt funding alignment","High social ROI","Community trust building"],
    cons:["Lower salary outcomes possible","High cost-per-student","Employer hesitancy in rural"],
    kpiPool:[
      {id:"total_learners",label:"Total Learners / Year",base:500,unit:""},
      {id:"women_pct",label:"Women Participation (%)",base:30,unit:"%"},
      {id:"rural_pct",label:"Rural Learners (%)",base:20,unit:"%"},
      {id:"firstgen_pct",label:"First-Gen Learners (%)",base:25,unit:"%"},
      {id:"marginalized_pct",label:"Marginalized Communities (%)",base:20,unit:"%"},
      {id:"scholarship_pct",label:"Students on Scholarship (%)",base:15,unit:"%"},
      {id:"completion_rate",label:"Course Completion (%)",base:55,unit:"%"},
      {id:"dropout_rate",label:"Dropout Rate (%)",base:25,unit:"%",inverse:true},
      {id:"student_sat",label:"Student Satisfaction",base:60,unit:"pts"},
      {id:"placement_rate",label:"Placement Rate (%)",base:35,unit:"%"},
      {id:"marginalized_placement",label:"Marginalized Placement (%)",base:25,unit:"%"},
      {id:"women_income_uplift",label:"Women Income Uplift (%)",base:10,unit:"%"},
      {id:"local_lang_pct",label:"Courses in Local Language (%)",base:20,unit:"%"},
    ],
    endGoals:[
      {id:"rural_reach",label:"Deep Rural Penetration",desc:"50%+ rural learners, 3 states covered",kpiTargets:{rural_pct:50,total_learners:5000,local_lang_pct:60}},
      {id:"gender_equity",label:"Gender Equity Leader",desc:"55%+ women participation with income uplift",kpiTargets:{women_pct:55,women_income_uplift:25,completion_rate:75}},
      {id:"mass_inclusion",label:"Mass Inclusion at Scale",desc:"40%+ marginalized, 80%+ completion rate",kpiTargets:{marginalized_pct:40,completion_rate:80,dropout_rate:10}},
    ],
    paramWeights:{capex:0.3,trainer_hire:0.8,trainer_dev:0.7,tech:0.5,mobilization:1.4,digital_mkt:0.4,industry_eng:0.6,ops_team:0.7,admin:0.5,subsidy:1.3},
  },
  { id:"financial", label:"Financial Sustainability", icon:"📈", color:"#2563eb",
    desc:"Build a revenue-positive, scalable institute — efficiency, unit economics & investor returns.",
    pros:["Attracts private capital","Long-term operational freedom","Drives innovation through revenue"],
    cons:["Inclusion risk if ROI-first","Investor timeline pressure","Brand stress if quality slips"],
    kpiPool:[
      {id:"annual_revenue",label:"Annual Revenue (₹ Cr)",base:2,unit:"Cr"},
      {id:"ebitda_margin",label:"EBITDA Margin (%)",base:-10,unit:"%"},
      {id:"cost_per_student",label:"Cost per Student (₹)",base:25000,unit:"₹",inverse:true},
      {id:"fee_recovery",label:"Fee Recovery Rate (%)",base:40,unit:"%"},
      {id:"rev_per_learner",label:"Revenue per Learner (₹)",base:8000,unit:"₹"},
      {id:"learner_per_trainer",label:"Learners per Trainer",base:15,unit:""},
      {id:"centre_utilisation",label:"Centre Utilisation (%)",base:45,unit:"%"},
      {id:"lac",label:"Learner Acquisition Cost (₹)",base:3000,unit:"₹",inverse:true},
      {id:"blended_ratio",label:"Blended Delivery Ratio (%)",base:20,unit:"%"},
      {id:"new_revenue_streams",label:"New Revenue Streams",base:0,unit:""},
      {id:"breakeven_progress",label:"Break-even Progress (%)",base:10,unit:"%"},
      {id:"roi",label:"Return on Investment (%)",base:-5,unit:"%"},
      {id:"recurring_rev_ratio",label:"Recurring Revenue Ratio (%)",base:10,unit:"%"},
    ],
    endGoals:[
      {id:"breakeven_fast",label:"Break-Even by Year 3",desc:"EBITDA positive by Y3, 15% margin by Y5",kpiTargets:{ebitda_margin:15,breakeven_progress:100,roi:20}},
      {id:"scale_revenue",label:"Revenue Scale Leader",desc:"₹50Cr+ annual revenue, 3+ revenue streams",kpiTargets:{annual_revenue:50,new_revenue_streams:3,recurring_rev_ratio:40}},
      {id:"efficiency_model",label:"Lean Efficiency Model",desc:"Low cost-per-student, high utilisation",kpiTargets:{centre_utilisation:85,cost_per_student:8000,learner_per_trainer:35}},
    ],
    paramWeights:{capex:0.7,trainer_hire:0.9,trainer_dev:0.5,tech:1.1,mobilization:0.6,digital_mkt:1.0,industry_eng:0.8,ops_team:1.2,admin:0.9,subsidy:0.3},
  },
  { id:"innovation", label:"Innovation & Flexibility", icon:"⚡", color:"#7c3aed",
    desc:"Redefine skilling through modular, tech-first & future-ready learning models.",
    pros:["Highly scalable digitally","Fast to pivot to new skills","Resilient to market shifts"],
    cons:["High dropout in self-paced","Employer credibility lag","Tech infrastructure burden"],
    kpiPool:[
      {id:"online_learner_pct",label:"Online Learners (%)",base:30,unit:"%"},
      {id:"digital_completion",label:"Digital Completion (%)",base:40,unit:"%"},
      {id:"microcred_pct",label:"Micro-credentials (%)",base:10,unit:"%"},
      {id:"launch_time",label:"Course Launch Time (days)",base:90,unit:"d",inverse:true},
      {id:"curriculum_refresh",label:"Curriculum Refresh Rate (%)",base:10,unit:"%"},
      {id:"learner_sat",label:"Learner Satisfaction",base:60,unit:"pts"},
      {id:"return_upskill_pct",label:"Return for Upskilling (%)",base:8,unit:"%"},
      {id:"flexibility_rating",label:"Course Flexibility Rating",base:55,unit:"pts"},
      {id:"online_dropoff",label:"Online Drop-off Rate (%)",base:35,unit:"%",inverse:true},
      {id:"codesign_pct",label:"Co-designed with Employers (%)",base:10,unit:"%"},
      {id:"role_versatility",label:"Job Role Versatility Score",base:40,unit:"pts"},
      {id:"new_pilots",label:"New Program Pilots / Yr",base:1,unit:""},
      {id:"placement_rate",label:"Placement Rate (%)",base:38,unit:"%"},
    ],
    endGoals:[
      {id:"digital_scale",label:"Digital Scale Champion",desc:"80%+ online learners, under 15% dropout",kpiTargets:{online_learner_pct:80,online_dropoff:15,digital_completion:75}},
      {id:"modular_leader",label:"Modular Learning Leader",desc:"50%+ micro-credentials, fast launch cycles",kpiTargets:{microcred_pct:50,launch_time:14,new_pilots:8}},
      {id:"codesign_future",label:"Industry Co-Design Pioneer",desc:"60%+ courses co-designed, high versatility",kpiTargets:{codesign_pct:60,role_versatility:80,curriculum_refresh:50}},
    ],
    paramWeights:{capex:0.3,trainer_hire:0.6,trainer_dev:1.0,tech:1.5,mobilization:0.5,digital_mkt:0.9,industry_eng:0.8,ops_team:0.7,admin:0.4,subsidy:0.4},
  },
  { id:"premium", label:"Premium Brand & Reputation", icon:"🏆", color:"#c2410c",
    desc:"Build India's most aspirational skilling brand — prestige, selectivity & alumni success.",
    pros:["Premium pricing power","Tier-1 employer access","Policy influence & recognition"],
    cons:["Slow to build brand equity","Infra & faculty intensive","Risk of elitism perception"],
    kpiPool:[
      {id:"alumni_nps",label:"Alumni NPS Score",base:20,unit:"pts"},
      {id:"employer_nps",label:"Employer NPS Score",base:25,unit:"pts"},
      {id:"tier1_placement",label:"Tier-1 Placements (%)",base:10,unit:"%"},
      {id:"offer_app_ratio",label:"Offer-to-Application Ratio",base:3,unit:"x"},
      {id:"industry_exp_faculty",label:"Industry-Exp Faculty (%)",base:30,unit:"%"},
      {id:"tier1_partners",label:"Tier-1 Industry Partners",base:2,unit:""},
      {id:"curriculum_endorsement",label:"Curriculum Endorsement (%)",base:15,unit:"%"},
      {id:"alumni_recognition",label:"Alumni Recognition Rate (%)",base:10,unit:"%"},
      {id:"media_mentions",label:"Media Mentions & Awards",base:1,unit:""},
      {id:"intl_collab",label:"International Collaborations",base:0,unit:""},
      {id:"campus_exp",label:"Campus Experience Score",base:50,unit:"pts"},
      {id:"employer_recall",label:"Employer Brand Recall (%)",base:5,unit:"%"},
      {id:"repeat_applicants",label:"Repeat Applicants YoY (%)",base:5,unit:"%"},
    ],
    endGoals:[
      {id:"brand_equity",label:"Top National Brand",desc:"80+ employer NPS, 70%+ brand recall",kpiTargets:{employer_nps:80,employer_recall:70,media_mentions:15}},
      {id:"elite_placements",label:"Elite Placement Network",desc:"50%+ Tier-1 placements, high alumni NPS",kpiTargets:{tier1_placement:50,alumni_nps:70,offer_app_ratio:8}},
      {id:"global_recognition",label:"Global Recognition Leader",desc:"5+ intl collaborations, endorsed curriculum",kpiTargets:{intl_collab:5,curriculum_endorsement:70,industry_exp_faculty:80}},
    ],
    paramWeights:{capex:1.1,trainer_hire:0.9,trainer_dev:1.0,tech:0.7,mobilization:0.3,digital_mkt:1.2,industry_eng:1.1,ops_team:0.6,admin:0.7,subsidy:0.2},
  },
];

const SECTORS=[
  {id:"manufacturing",label:"Manufacturing & Mechatronics",salary:"₹14-16K/mo",capex:"High",govtPriority:9,demand:"Growing",constraint:"Requires physical labs & CNC equipment",salaryMult:1.10,placementMult:1.15},
  {id:"healthcare",label:"Healthcare & Allied Services",salary:"₹12-15K/mo",capex:"Medium",govtPriority:8,demand:"Growing",constraint:"Certified trainers mandatory; clinical labs needed",salaryMult:1.05,placementMult:1.08},
  {id:"bfsi",label:"BFSI",salary:"₹14-18K/mo",capex:"Low",govtPriority:7,demand:"Stable",constraint:"Compliance-heavy; constant cert updates needed",salaryMult:1.18,placementMult:1.10},
  {id:"it",label:"IT & Digital Services",salary:"₹12-20K/mo",capex:"Low",govtPriority:8,demand:"Volatile",constraint:"AI disruption accelerating; constant refresh required",salaryMult:1.20,placementMult:1.08},
  {id:"logistics",label:"Logistics & Supply Chain",salary:"₹11-14K/mo",capex:"Low",govtPriority:7,demand:"Growing",constraint:"Last-mile hiring volatile; seasonal demand spikes",salaryMult:1.00,placementMult:1.05},
  {id:"retail",label:"Retail & Sales",salary:"₹10-13K/mo",capex:"Very Low",govtPriority:5,demand:"Stable",constraint:"High attrition sector; retention KPIs at risk",salaryMult:0.95,placementMult:1.12},
  {id:"construction",label:"Construction & Infrastructure",salary:"₹12-15K/mo",capex:"High",govtPriority:9,demand:"Booming",constraint:"Informal sector dominant; safety certification critical",salaryMult:1.05,placementMult:1.00},
  {id:"hospitality",label:"Hospitality & Food Services",salary:"₹10-14K/mo",capex:"Medium",govtPriority:6,demand:"Recovering",constraint:"Seasonal demand; international placement pathways possible",salaryMult:1.00,placementMult:1.10},
  {id:"green",label:"Green Jobs & Renewable Energy",salary:"₹13-17K/mo",capex:"Medium",govtPriority:10,demand:"Emerging",constraint:"Job market immature; 2-3 yr absorption lag expected",salaryMult:1.12,placementMult:0.85},
  {id:"beauty",label:"Beauty, Wellness & Personal Care",salary:"₹9-12K/mo",capex:"Low",govtPriority:4,demand:"Growing",constraint:"Self-employment dominant; placement metrics hard to verify",salaryMult:0.90,placementMult:0.95},
];

const FUNDING_SOURCES=[
  {id:"csr",label:"CSR Grant",icon:"🤝",desc:"Corporate Social Responsibility — non-repayable, outcome-linked",budgetMult:1.0,patience:2,kpiBonus:{women_pct:5,marginalized_pct:5}},
  {id:"govt",label:"Government Scheme",icon:"🏛️",desc:"Central/State govt schemes — placement-linked milestone payments",budgetMult:1.15,patience:3,kpiBonus:{placement_rate:5,total_learners:200}},
  {id:"investor",label:"Impact Investor / PE",icon:"💼",desc:"ROI-focused capital — scale, EBITDA & revenue growth expected",budgetMult:1.25,patience:1,kpiBonus:{annual_revenue:3,ebitda_margin:3}},
  {id:"self",label:"Bootstrapped",icon:"💰",desc:"Own capital or founder reserves — full control, high personal risk",budgetMult:0.85,patience:5,kpiBonus:{}},
  {id:"philanthropy",label:"Philanthropy / Foundation",icon:"🌐",desc:"Mission-driven patient capital — equity and innovation rewarded",budgetMult:1.05,patience:4,kpiBonus:{rural_pct:5,curriculum_refresh:5}},
];

const DELIVERY_MODES=[
  {id:"classroom",label:"Classroom Only",icon:"🏫",capexMult:1.2,bestFor:["manufacturing","construction","hospitality"]},
  {id:"handson",label:"Hands-On / Workshop",icon:"🔧",capexMult:1.5,bestFor:["manufacturing","healthcare","construction"]},
  {id:"online_async",label:"Online Self-Paced",icon:"💻",capexMult:0.4,bestFor:["it","bfsi","beauty"]},
  {id:"online_live",label:"Online Instructor-Led",icon:"📡",capexMult:0.6,bestFor:["it","bfsi","retail"]},
  {id:"hybrid",label:"Hybrid / Blended",icon:"🔀",capexMult:0.9,bestFor:["healthcare","logistics","green"]},
  {id:"mobile",label:"Mobile / Community",icon:"🚐",capexMult:0.5,bestFor:["construction","beauty","retail"]},
];

const YEAR_EVENTS=[
  {year:1,name:"Year 1 — Establishing Ground",desc:"Your first year. Build credibility. Stakeholders are watching.",mod:1.0,sectorMod:{}},
  {year:2,name:"China+1 Manufacturing Surge",desc:"Global firms shift production to India. PLI scheme live. Manufacturing & logistics demand jumps 20%.",mod:1.05,sectorMod:{manufacturing:1.20,logistics:1.10,construction:1.15}},
  {year:3,name:"New Government — Budget Realignment",desc:"Post-election Union Budget. Digital skilling gets a boost. Rural scheme funds cut 15%. CSR mandates tightened.",mod:0.95,sectorMod:{it:1.10,green:1.20,construction:0.90}},
  {year:4,name:"Global Recession Signal",desc:"IT hiring freeze. BFSI layoffs hit mid-level. Healthcare and green jobs hold steady. Investor confidence drops.",mod:0.88,sectorMod:{it:0.75,bfsi:0.85,healthcare:1.05,green:1.10}},
  {year:5,name:"AI & Digital Disruption Wave",desc:"AI tools reshape job roles across all sectors. Micro-credential demand surges. Adapted institutes thriving.",mod:1.08,sectorMod:{it:1.15,manufacturing:1.05,retail:0.90}},
];

// Y1-Y2: annual (1 period), Y3-Y4: half-yearly (2 periods), Y5: quarterly (4 periods)
const getCadence=(year)=>{
  if(year<=2) return {periods:1,label:"Annual",pLabel:(i)=>`Year ${year}`};
  if(year<=4) return {periods:2,label:"Half-Yearly",pLabel:(i)=>`H${i+1} · Y${year}`};
  return {periods:4,label:"Quarterly",pLabel:(i)=>`Q${i+1} · Y${year}`};
};

const PARAMS=[
  {id:"capex",label:"CapEx",sub:"Infrastructure",icon:"🏗️",desc:"Labs, centres, machines & tools",color:"#0ea5e9"},
  {id:"trainer_hire",label:"Trainer Hiring",sub:"Faculty & SMEs",icon:"👩‍🏫",desc:"Full-time/contract trainers and SMEs",color:"#8b5cf6"},
  {id:"trainer_dev",label:"Trainer Development",sub:"Capability Building",icon:"📚",desc:"Training-of-Trainers, faculty upskilling",color:"#6366f1"},
  {id:"tech",label:"Technology",sub:"LMS & Digital Infra",icon:"💻",desc:"LMS, virtual classrooms, learner tracking",color:"#0284c7"},
  {id:"mobilization",label:"Mobilization",sub:"Field Outreach",icon:"🚌",desc:"On-ground outreach, school visits, rural camps",color:"#d97706"},
  {id:"digital_mkt",label:"Digital Marketing",sub:"Campaigns & SEO",icon:"📣",desc:"Social media, paid campaigns, SEO",color:"#db2777"},
  {id:"industry_eng",label:"Industry Engagement",sub:"Employer Relations",icon:"🏭",desc:"Employer tie-ups, job fairs, partnerships",color:"#059669"},
  {id:"ops_team",label:"Operations Team",sub:"Program Management",icon:"⚙️",desc:"Program managers, MIS, data & compliance",color:"#475569"},
  {id:"admin",label:"Admin & Support",sub:"Back Office",icon:"🗂️",desc:"Logistics, centre admin, procurement",color:"#94a3b8"},
  {id:"subsidy",label:"Student Subsidies",sub:"Incentives",icon:"🎓",desc:"Travel, meals, stipends, scholarships",color:"#f59e0b"},
];

// ═══════════════════════════════════════════════════════
//  SIMULATION ENGINE (UNTOUCHED LOGIC)
// ═══════════════════════════════════════════════════════
function simulateYear({kpis,params,archetype,sectors,fundingSource,deliveryMode,year,stress}){
  const arch=ARCHETYPES.find(a=>a.id===archetype);
  const event=YEAR_EVENTS.find(e=>e.year===year)||YEAR_EVENTS[0];
  const delivery=DELIVERY_MODES.find(d=>d.id===deliveryMode);
  const total=Object.values(params).reduce((s,v)=>s+v,0)||100;
  const np={};Object.keys(params).forEach(k=>{np[k]=params[k]/total;});
  let newStress=stress;
  if(np.trainer_hire<0.06) newStress=Math.min(10,newStress+2.5);
  else if(np.trainer_hire>0.15) newStress=Math.max(0,newStress-1.5);
  else newStress=Math.max(0,newStress-0.5);
  const stressMult=newStress>7?0.82:newStress>4?0.93:1.0;
  const focusMult=sectors.length===1?1.0:sectors.length===2?0.85:0.70;
  let sectorSalary=1.0,sectorPlacement=1.0;
  sectors.forEach(sid=>{const s=SECTORS.find(x=>x.id===sid);if(s){sectorSalary+=(s.salaryMult-1);sectorPlacement+=(s.placementMult-1);}});
  const primary=sectors[0];
  const evtSector=event.sectorMod[primary]||1.0;
  const evtGlobal=event.mod;
  const compatible=delivery?.bestFor.includes(primary);
  const delivMult=compatible?1.08:0.88;
  const capexOver=Math.max(0,np.capex-0.30);
  const capexROIPenalty=1-capexOver*1.2;
  const fI=np.industry_eng*arch.paramWeights.industry_eng;
  const fF=(np.trainer_hire*arch.paramWeights.trainer_hire)+(np.trainer_dev*arch.paramWeights.trainer_dev);
  const fT=np.tech*arch.paramWeights.tech;
  const fO=(np.mobilization*arch.paramWeights.mobilization)+(np.digital_mkt*arch.paramWeights.digital_mkt);
  const fS=np.subsidy*arch.paramWeights.subsidy;
  const fOP=np.ops_team*arch.paramWeights.ops_team;
  const fC=np.capex*arch.paramWeights.capex;
  const fM=np.digital_mkt*arch.paramWeights.digital_mkt;
  const deltas={
    placement_rate:(fI*14+fF*8+fO*5)*sectorPlacement*focusMult*evtSector*evtGlobal*delivMult*stressMult,
    retention_12:(fF*11+fS*7+fOP*5)*stressMult,
    retention_24:(fF*9+fI*6)*stressMult*evtGlobal,
    soqs:(fF*11+fI*9+fT*4)*sectorSalary*stressMult,
    employer_repeat:(fI*15+fF*6)*stressMult,
    employer_sat:(fF*10+fOP*6+fC*4)*stressMult,
    job_dropoff:-(fF*7+fS*6),
    role_alignment:(fF*13+fI*10)*stressMult,
    alumni_tracking:(fT*11+fOP*8),
    job_satisfaction:(fF*9+fS*6+fC*4)*delivMult,
    income_growth_12:(fF*5+fI*5)*sectorSalary,
    active_employers:(fI*12+fO*4),
    avg_salary:(fF*0.35+fI*0.45)*sectorSalary*evtSector*evtGlobal,
    total_learners:(fO*600+fS*450+fC*250),
    women_pct:(fO*7+fS*6),rural_pct:(fO*9+fS*7),firstgen_pct:(fO*8+fS*5),
    marginalized_pct:(fO*7+fS*8),scholarship_pct:(fS*14),
    completion_rate:(fF*9+fS*7+fT*5)*delivMult*stressMult,
    dropout_rate:-(fS*7+fF*6),
    student_sat:(fF*9+fS*5+fC*4)*delivMult,
    marginalized_placement:(fI*9+fO*6)*focusMult,
    women_income_uplift:(fF*4+fI*5)*sectorSalary,
    local_lang_pct:(fO*11+fS*5),
    annual_revenue:(fO*3.5+fT*2.5+fI*2.5)*capexROIPenalty*evtGlobal,
    ebitda_margin:(fOP*7+fT*5-np.capex*6)*capexROIPenalty,
    cost_per_student:-(fOP*1800+fT*1200),
    fee_recovery:(fO*9+fOP*7),
    rev_per_learner:(fI*600+fT*500)*sectorSalary,
    learner_per_trainer:(fT*3+fOP*2),
    centre_utilisation:(fO*9+fC*4)*capexROIPenalty,
    lac:-(fO*250+fM*200),
    blended_ratio:(fT*12),
    new_revenue_streams:(fI*0.5+fT*0.5),
    breakeven_progress:(fOP*9+fT*6-np.capex*7)*capexROIPenalty,
    roi:(fOP*5+fT*4-np.capex*6)*capexROIPenalty*evtGlobal,
    recurring_rev_ratio:(fI*5+fT*3),
    online_learner_pct:(fT*13+fO*5),
    digital_completion:(fT*11+fF*7)*delivMult,
    microcred_pct:(fT*9+fOP*4),
    launch_time:-(fT*9+fOP*7+fF*4),
    curriculum_refresh:(fF*7+fI*5+fT*5),
    learner_sat:(fF*8+fT*7+fS*4)*delivMult,
    return_upskill_pct:(fI*5+fT*5+fF*4),
    flexibility_rating:(fT*11+fOP*5),
    online_dropoff:-(fT*7+fS*5+fF*6),
    codesign_pct:(fI*13+fF*5),
    role_versatility:(fI*9+fF*7+fT*4),
    new_pilots:(fT*0.7+fI*0.6+fF*0.5),
    alumni_nps:(fF*9+fS*6+fC*4)*stressMult,
    employer_nps:(fI*11+fF*7)*stressMult,
    tier1_placement:(fI*7+fF*6)*focusMult*stressMult,
    offer_app_ratio:(fI*0.45+fF*0.35),
    industry_exp_faculty:(fF*11+fI*7),
    tier1_partners:(fI*0.9+fO*0.3),
    curriculum_endorsement:(fI*9+fF*7),
    alumni_recognition:(fF*5+fI*4+fS*3),
    media_mentions:(fM*16+fI*8),
    intl_collab:(fI*0.6+fO*0.2),
    campus_exp:(fC*15+fOP*6)*capexROIPenalty,
    employer_recall:(fM*13+fI*9),
    repeat_applicants:(fO*7+fS*4+fOP*5),
  };
  const funder=FUNDING_SOURCES.find(f=>f.id===fundingSource);
  if(funder) Object.entries(funder.kpiBonus).forEach(([k,v])=>{if(deltas[k]!==undefined) deltas[k]=(deltas[k]||0)+v*0.25;});
  const SCALE=0.08;
  const newKpis={...kpis};
  Object.keys(newKpis).forEach(k=>{
    const d=(deltas[k]||0)*SCALE;
    newKpis[k]=Math.round((newKpis[k]+d)*10)/10;
    if(!["cost_per_student","lac","total_learners","annual_revenue","rev_per_learner"].includes(k)){
      newKpis[k]=Math.max(0,Math.min(["ebitda_margin","roi"].includes(k)?60:100,newKpis[k]));
    } else { newKpis[k]=Math.max(0,newKpis[k]); }
  });

  // ─── FIXED PERFORMANCE INDEX ───
  // Score = average % of movement toward target (or toward improvement from base)
  // Range 0-100. Bad allocation → low score. Good → higher.
  let totalScore=0, count=0;
  Object.keys(kpis).forEach(k=>{
    const def=arch.kpiPool.find(kp=>kp.id===k)||ARCHETYPES.flatMap(x=>x.kpiPool).find(kp=>kp.id===k);
    const inv=def?.inverse;
    const before=kpis[k], after=newKpis[k];
    const diff=inv?(before-after):(after-before); // positive = improvement
    // Normalize by a reasonable reference band (10 units per period)
    const refBand=10;
    const periodScore=Math.max(0,Math.min(100,(diff/refBand)*100));
    totalScore+=periodScore; count++;
  });
  const yearScore=count>0?Math.round(totalScore/count):0;

  const budgetChange=(yearScore-50)*0.4+evtGlobal*8-5;
  const nextBudget=Math.max(65,Math.min(160,100+budgetChange));
  const narratives={};
  Object.keys(kpis).forEach(k=>{
    const before=kpis[k],after=newKpis[k];
    const inv=arch.kpiPool.find(kp=>kp.id===k)?.inverse;
    const good=inv?after<before:after>before;
    const msgs={
      placement_rate:good?"Industry engagement paying off — employers showing up.":"Weak employer engagement left seats unfilled.",
      retention_12:good?"Post-placement support keeping students in jobs longer.":"Students leaving early — check trainer quality.",
      soqs:good?"Salary distribution healthy across bands.":"Salary quality uneven — too many low-end outliers.",
      employer_repeat:good?"Employers returning. Trust is building.":"Employer repeat rate stagnant — deepen relationships.",
      ebitda_margin:good?"Operational efficiency improving — margin heading right.":"Margins under pressure. Watch CapEx and ops cost.",
      completion_rate:good?"Faculty and subsidies keeping learners engaged.":"Completion slipping — learner support needs review.",
      dropout_rate:good?"Dropout reducing — field support is working.":"Dropout rising. Mobilisation alone won't fix this.",
    };
    narratives[k]=msgs[k]||(good?"Strategic investment paying off.":"Needs more focused investment next period.");
  });
  return {newKpis,newStress,yearScore,nextBudget,event,narratives};
}

// ═══════════════════════════════════════════════════════
//  LIVE IMPACT ENGINE
// ═══════════════════════════════════════════════════════
function computeImpact({params,archetype,selectedKPIs,kpiPool,kpis}){
  const arch=ARCHETYPES.find(a=>a.id===archetype);
  if(!arch) return {};
  const total=Object.values(params).reduce((s,v)=>s+v,0)||100;
  const np={};Object.keys(params).forEach(k=>{np[k]=params[k]/total;});
  const fI=np.industry_eng*arch.paramWeights.industry_eng;
  const fF=(np.trainer_hire*arch.paramWeights.trainer_hire)+(np.trainer_dev*arch.paramWeights.trainer_dev);
  const fT=np.tech*arch.paramWeights.tech;
  const fO=(np.mobilization*arch.paramWeights.mobilization)+(np.digital_mkt*arch.paramWeights.digital_mkt);
  const fS=np.subsidy*arch.paramWeights.subsidy;
  const fOP=np.ops_team*arch.paramWeights.ops_team;
  const fC=np.capex*arch.paramWeights.capex;
  const fM=np.digital_mkt*arch.paramWeights.digital_mkt;
  const raw={
    placement_rate:fI*14+fF*8+fO*5, retention_12:fF*11+fS*7+fOP*5,
    retention_24:fF*9+fI*6, soqs:fF*11+fI*9+fT*4,
    employer_repeat:fI*15+fF*6, employer_sat:fF*10+fOP*6+fC*4,
    job_dropoff:fF*7+fS*6, role_alignment:fF*13+fI*10,
    alumni_tracking:fT*11+fOP*8, job_satisfaction:fF*9+fS*6+fC*4,
    income_growth_12:fF*5+fI*5, active_employers:fI*12+fO*4,
    avg_salary:(fF*0.35+fI*0.45)*20,
    total_learners:(fO*600+fS*450+fC*250)/50,
    women_pct:fO*7+fS*6, rural_pct:fO*9+fS*7, firstgen_pct:fO*8+fS*5,
    marginalized_pct:fO*7+fS*8, scholarship_pct:fS*14,
    completion_rate:fF*9+fS*7+fT*5, dropout_rate:fS*7+fF*6,
    student_sat:fF*9+fS*5+fC*4, marginalized_placement:fI*9+fO*6,
    women_income_uplift:fF*4+fI*5, local_lang_pct:fO*11+fS*5,
    annual_revenue:(fO*3.5+fT*2.5+fI*2.5)*5, ebitda_margin:fOP*7+fT*5,
    fee_recovery:fO*9+fOP*7, rev_per_learner:(fI*600+fT*500)/100,
    centre_utilisation:fO*9+fC*4, breakeven_progress:fOP*9+fT*6,
    roi:fOP*5+fT*4, online_learner_pct:fT*13+fO*5,
    digital_completion:fT*11+fF*7, microcred_pct:fT*9+fOP*4,
    launch_time:fT*9+fOP*7+fF*4, curriculum_refresh:fF*7+fI*5+fT*5,
    learner_sat:fF*8+fT*7+fS*4, return_upskill_pct:fI*5+fT*5+fF*4,
    flexibility_rating:fT*11+fOP*5, online_dropoff:fT*7+fS*5+fF*6,
    codesign_pct:fI*13+fF*5, role_versatility:fI*9+fF*7+fT*4,
    new_pilots:(fT*0.7+fI*0.6+fF*0.5)*5,
    alumni_nps:fF*9+fS*6+fC*4, employer_nps:fI*11+fF*7,
    tier1_placement:fI*7+fF*6, industry_exp_faculty:fF*11+fI*7,
    curriculum_endorsement:fI*9+fF*7, alumni_recognition:fF*5+fI*4+fS*3,
    media_mentions:(fM*16+fI*8)*2, campus_exp:fC*15+fOP*6,
    employer_recall:fM*13+fI*9, repeat_applicants:fO*7+fS*4+fOP*5,
  };
  const maxRaw=Math.max(...selectedKPIs.map(id=>raw[id]||0),0.01);
  const result={};
  selectedKPIs.forEach(id=>{
    const def=kpiPool.find(k=>k.id===id);
    const r=raw[id]||0;
    const delta=r*0.08;
    result[id]={ pct:Math.min(100,(r/maxRaw)*100), delta:def?.inverse?-delta:delta };
  });
  return result;
}

// ═══════════════════════════════════════════════════════
//  SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════
function StepIndicator({current}){
  const steps=["Vision","KPIs","Sectors","Funding","Play"];
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28,flexWrap:"wrap",gap:4}}>
      {steps.map((s,i)=>(
        <div key={s} style={{display:"flex",alignItems:"center"}}>
          <div style={{width:24,height:24,borderRadius:4,border:`1px solid ${i+1<=current?T.primary:T.border}`,background:i+1<current?T.primary:i+1===current?"#eff6ff":T.surface,color:i+1<current?"#fff":i+1===current?T.primary:T.textFaint,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700}}>{i+1<current?"✓":i+1}</div>
          <div style={{fontSize:10,color:i+1===current?T.text:T.textFaint,fontWeight:i+1===current?600:400,margin:"0 8px",textTransform:"uppercase",letterSpacing:"0.03em"}}>{s}</div>
          {i<steps.length-1&&<div style={{width:12,height:1,background:T.border,marginRight:4}}/>}
        </div>
      ))}
    </div>
  );
}

function KPIBar({label,value,color,inverse,targetVal}){
  const v=typeof value==="number"?value:0;
  const pct=inverse?Math.max(0,100-Math.min(100,v)):Math.min(100,Math.max(0,v));
  const tPct=targetVal!=null?(inverse?Math.max(0,100-Math.min(100,targetVal)):Math.min(100,Math.max(0,targetVal))):null;
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
        <span style={{color:T.textMuted,fontWeight:500,maxWidth:"72%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</span>
        <span style={{fontFamily:T.mono,color,fontWeight:700}}>{v.toFixed(1)}</span>
      </div>
      <div style={{background:T.track,borderRadius:3,height:6,position:"relative"}}>
        <div style={{width:`${Math.max(2,pct)}%`,height:"100%",background:color,borderRadius:3,transition:"width 0.4s ease"}}/>
        {tPct!=null&&<div style={{position:"absolute",top:-2,bottom:-2,left:`${tPct}%`,width:2,background:"#f59e0b",borderRadius:1}} title={`Target: ${targetVal}`}/>}
      </div>
    </div>
  );
}

function ColorSlider({param,value,onChange}){
  const pct=(value/40)*100;
  return (
    <div style={{marginBottom:13,paddingBottom:13,borderBottom:`1px solid ${T.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        <span style={{fontWeight:600,fontSize:12,color:T.text}}>{param.icon} {param.label}</span>
        <span style={{fontFamily:T.mono,color:param.color,fontWeight:700,fontSize:13}}>{value}%</span>
      </div>
      <div style={{position:"relative",height:20,display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",left:0,right:0,height:5,borderRadius:3,background:T.track,overflow:"hidden"}}>
          <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${param.color}cc,${param.color})`,borderRadius:3,transition:"width 0.08s"}}/>
        </div>
        <input type="range" min={0} max={40} value={value} onChange={e=>onChange(Number(e.target.value))}
          style={{position:"absolute",left:0,right:0,opacity:0,cursor:"pointer",height:20,width:"100%",zIndex:2}}/>
        <div style={{position:"absolute",left:`calc(${pct}% - 7px)`,width:14,height:14,borderRadius:"50%",background:"#fff",border:`2px solid ${param.color}`,boxShadow:`0 1px 4px ${param.color}60`,pointerEvents:"none",transition:"left 0.08s"}}/>
      </div>
      <div style={{fontSize:9,color:T.textFaint,marginTop:3}}>{param.desc}</div>
    </div>
  );
}

function LiveImpactChart({impacts,selectedKPIs,kpiPool,archColor}){
  return (
    <div>
      <div style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>
        Live Parameter Impact on KPIs
      </div>
      {selectedKPIs.map(id=>{
        const def=kpiPool.find(k=>k.id===id);
        if(!def) return null;
        const imp=impacts[id]||{pct:0,delta:0};
        const pct=imp.pct;
        const delta=imp.delta;
        const good=delta>=0;
        const barCol=pct>65?archColor:pct>35?archColor+"bb":archColor+"55";
        return (
          <div key={id} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:3}}>
              <span style={{color:T.textMuted,maxWidth:"70%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{def.label}</span>
              <span style={{fontFamily:T.mono,fontSize:10,color:good?"#059669":"#dc2626",fontWeight:600}}>
                {good?"+":""}{delta.toFixed(2)}
              </span>
            </div>
            <div style={{background:T.track,borderRadius:2,height:5}}>
              <div style={{width:`${Math.max(1,pct)}%`,height:"100%",background:barCol,borderRadius:2,transition:"width 0.12s ease"}}/>
            </div>
          </div>
        );
      })}
      <div style={{marginTop:8,fontSize:9,color:T.textFaint}}>Bar = impact strength · +/− = projected change per period</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SCREENS
// ═══════════════════════════════════════════════════════
function Welcome({onStart}){
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px",background:T.bg}}>
      <div style={{maxWidth:560,textAlign:"center",width:"100%"}}>
        <div style={{fontSize:44,marginBottom:20}}>🏛️</div>
        <h1 style={{fontWeight:800,fontSize:"clamp(28px,5vw,40px)",color:T.text,letterSpacing:"-0.02em",marginBottom:14}}>
          Institute<span style={{color:T.primary}}>Command</span>
        </h1>
        <p style={{fontSize:15,color:T.textMuted,lineHeight:1.65,marginBottom:28,maxWidth:460,margin:"0 auto 28px"}}>
          A 5-year strategic simulation for skilling institutes in India. Navigate policy shifts, market volatility, and operational trade-offs.
        </p>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:36}}>
          {[["🎭","5 Archetypes"],["📊","10 KPIs"],["💰","Budget Controls"],["📈","Live Impact"],["⚡","Market Events"]].map(([icon,label])=>(
            <span key={label} style={{...mkPill(T.textMuted,T.surfaceAlt),padding:"5px 10px"}}>{icon} {label}</span>
          ))}
        </div>
        <button onClick={onStart} style={{background:T.primary,color:"#fff",border:"none",borderRadius:8,padding:"13px 40px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>
          Begin Simulation →
        </button>
      </div>
    </div>
  );
}

function ArchetypeStep({onNext}){
  const [arch,setArch]=useState(null);
  const [goal,setGoal]=useState(null);
  const a=ARCHETYPES.find(x=>x.id===arch);
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"28px 20px"}}>
      <StepIndicator current={1}/>
      <div style={{marginBottom:22,textAlign:"center"}}>
        <h2 style={{fontWeight:700,fontSize:26,color:T.text,marginBottom:6}}>Strategic DNA</h2>
        <p style={{color:T.textMuted,fontSize:13}}>Choose your institutional vision and 5-year target outcome.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14,marginBottom:28}}>
        {ARCHETYPES.map(x=>(
          <div key={x.id} onClick={()=>{setArch(x.id);setGoal(null);}} style={{...mkCard(x.color,arch===x.id),cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:22}}>{x.icon}</span>
              {arch===x.id&&<span style={{width:18,height:18,borderRadius:99,background:x.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>✓</span>}
            </div>
            <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:6}}>{x.label}</div>
            <p style={{fontSize:12,color:T.textMuted,lineHeight:1.55,marginBottom:12,flexGrow:1}}>{x.desc}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {x.pros.slice(0,2).map(p=><span key={p} style={{...mkPill(x.color),fontSize:9}}>{p}</span>)}
            </div>
          </div>
        ))}
      </div>
      {a&&(
        <div style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:8,padding:20,marginBottom:28}}>
          <div style={{fontSize:10,fontWeight:700,color:T.textMuted,marginBottom:14,textTransform:"uppercase"}}>Primary Outcome Target</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
            {a.endGoals.map(g=>(
              <div key={g.id} onClick={()=>setGoal(g.id)} style={{...mkCard(a.color,goal===g.id),cursor:"pointer",padding:"14px 16px"}}>
                <div style={{fontWeight:600,fontSize:13,color:goal===g.id?a.color:T.text,marginBottom:5}}>{g.label}</div>
                <p style={{fontSize:12,color:T.textMuted,lineHeight:1.45,marginBottom:10}}>{g.desc}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                  {Object.entries(g.kpiTargets).map(([k,v])=>(
                    <span key={k} style={{fontSize:9,color:T.textFaint,fontFamily:T.mono}}>{k.replace(/_/g," ")}: {v}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={()=>arch&&goal&&onNext({archetype:arch,endGoal:goal})} style={{...mkBtn(a?.color||"#94a3b8"),opacity:arch&&goal?1:0.4}}>
          Next: Select KPIs →
        </button>
      </div>
    </div>
  );
}

function KPIStep({archetype,extraKpiIds,onNext,onBack}){
  const a=ARCHETYPES.find(x=>x.id===archetype);
  const pool=useMemo(()=>{ const p=[...a.kpiPool]; (extraKpiIds||[]).forEach(k=>{if(!p.find(kp=>kp.id===k.id)) p.push(k);}); return p; },[a,extraKpiIds]);
  const [selected,setSelected]=useState([]);
  const toggle=(id)=>{ if(selected.includes(id)) setSelected(selected.filter(s=>s!==id)); else if(selected.length<10) setSelected([...selected,id]); };
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"28px 20px"}}>
      <StepIndicator current={2}/>
      <div style={{marginBottom:20,textAlign:"center"}}>
        <h2 style={{fontWeight:700,fontSize:26,color:T.text,marginBottom:6}}>Performance Framework</h2>
        <p style={{color:T.textMuted,fontSize:13}}>Select exactly 10 metrics. These define your scorecard for 5 years.</p>
        <div style={{marginTop:10}}>
          <span style={{...mkPill(selected.length===10?"#059669":a.color),padding:"4px 12px",fontSize:11}}>{selected.length} / 10 Selected {selected.length===10?"✓":""}</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:9,marginBottom:28}}>
        {pool.map(kpi=>{
          const isSel=selected.includes(kpi.id),disabled=!isSel&&selected.length===10;
          return (
            <div key={kpi.id} onClick={()=>!disabled&&toggle(kpi.id)} style={{...mkCard(a.color,isSel),cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.45:1,padding:"12px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:12,color:isSel?a.color:T.text,marginBottom:3,lineHeight:1.3}}>{kpi.label}</div>
                  <div style={{fontSize:10,color:T.textFaint,fontFamily:T.mono}}>Base: {kpi.base}{kpi.unit}</div>
                  <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
                    {kpi.inverse&&<span style={{...mkPill("#ef4444"),fontSize:8}}>↓ lower=better</span>}
                    {kpi.tag&&<span style={{...mkPill("#9333ea"),fontSize:8}}>{kpi.tag}</span>}
                  </div>
                </div>
                {isSel&&<div style={{width:16,height:16,borderRadius:99,background:a.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,flexShrink:0,marginLeft:6}}>✓</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={onBack} style={mkBtn(T.textMuted,true)}>← Back</button>
        <button onClick={()=>selected.length===10&&onNext({selectedKPIs:selected,kpiPool:pool})} style={{...mkBtn(a.color),opacity:selected.length===10?1:0.4}}>
          Next: Sector Selection →
        </button>
      </div>
    </div>
  );
}

function SectorStep({archetype,onNext,onBack}){
  const [selected,setSelected]=useState([]);
  const [expanded,setExpanded]=useState(null);
  const a=ARCHETYPES.find(x=>x.id===archetype);
  const toggle=(id)=>{ if(selected.includes(id)) setSelected(selected.filter(s=>s!==id)); else if(selected.length<3) setSelected([...selected,id]); };
  const dc={Growing:"#059669",Booming:"#059669",Stable:"#d97706",Volatile:"#dc2626",Emerging:"#7c3aed",Recovering:"#d97706"};
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"28px 20px"}}>
      <StepIndicator current={3}/>
      <div style={{marginBottom:22,textAlign:"center"}}>
        <h2 style={{fontWeight:700,fontSize:26,color:T.text,marginBottom:6}}>Sector Specialization</h2>
        <p style={{color:T.textMuted,fontSize:13}}>Choose up to 3 verticals. More sectors = lower focus (2: 0.85×, 3: 0.70×).</p>
        {selected.length>0&&<div style={{marginTop:10}}><span style={{...mkPill(a.color),padding:"4px 12px",fontSize:11}}>{selected.length} Sector{selected.length>1?"s":""} · Focus: {selected.length===1?"1.00×":selected.length===2?"0.85×":"0.70×"}</span></div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:11,marginBottom:28}}>
        {SECTORS.map(sec=>{
          const isSel=selected.includes(sec.id),exp=expanded===sec.id;
          return (
            <div key={sec.id} style={{...mkCard(a.color,isSel),cursor:"pointer"}} onClick={()=>toggle(sec.id)}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div>
                  <div style={{fontWeight:600,fontSize:13,color:T.text}}>{sec.label}</div>
                  <div style={{fontSize:10,color:T.textFaint,fontFamily:T.mono}}>{sec.salary}</div>
                </div>
                {isSel&&<div style={{width:18,height:18,borderRadius:99,background:a.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,flexShrink:0}}>✓</div>}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
                <span style={{...mkPill(dc[sec.demand]||T.textMuted),fontSize:9}}>{sec.demand}</span>
                <span style={{...mkPill(T.textMuted),fontSize:9}}>CapEx: {sec.capex}</span>
                <span style={{...mkPill(sec.govtPriority>=8?"#059669":T.textMuted),fontSize:9}}>Govt: {sec.govtPriority}/10</span>
              </div>
              <button onClick={e=>{e.stopPropagation();setExpanded(exp?null:sec.id);}} style={{background:"none",border:"none",color:a.color,fontSize:11,cursor:"pointer",fontWeight:600,padding:0,textAlign:"left"}}>
                {exp?"▲ Hide":"▼ View"} SID
              </button>
              {exp&&<div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`,fontSize:11,color:T.textMuted,lineHeight:1.6}}>
                <div>CapEx: {sec.capex} · Govt Priority: {sec.govtPriority}/10</div>
                <div style={{marginTop:4,fontWeight:600,color:"#b45309"}}>⚠ {sec.constraint}</div>
              </div>}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={onBack} style={mkBtn(T.textMuted,true)}>← Back</button>
        <button onClick={()=>selected.length>0&&onNext({sectors:selected})} style={{...mkBtn(a.color),opacity:selected.length>0?1:0.4}}>
          Next: Funding & Delivery →
        </button>
      </div>
    </div>
  );
}

function FundingStep({archetype,sectors,onNext,onBack}){
  const [funding,setFunding]=useState(null);
  const [delivery,setDelivery]=useState(null);
  const a=ARCHETYPES.find(x=>x.id===archetype);
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"28px 20px"}}>
      <StepIndicator current={4}/>
      <div style={{marginBottom:28,textAlign:"center"}}>
        <h2 style={{fontWeight:700,fontSize:26,color:T.text,marginBottom:6}}>Operational Context</h2>
        <p style={{color:T.textMuted,fontSize:13}}>Select your capital source and instructional delivery framework.</p>
      </div>
      <div style={{marginBottom:32}}>
        <div style={{fontSize:10,fontWeight:700,color:T.textMuted,marginBottom:10,textTransform:"uppercase"}}>Capital Allocation</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:11}}>
          {FUNDING_SOURCES.map(f=>(
            <div key={f.id} onClick={()=>setFunding(f.id)} style={{...mkCard(a.color,funding===f.id),cursor:"pointer"}}>
              <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                <span style={{fontSize:18}}>{f.icon}</span>
                <div style={{fontWeight:600,fontSize:13,color:T.text}}>{f.label}</div>
              </div>
              <p style={{fontSize:12,color:T.textMuted,lineHeight:1.45,marginBottom:10,flexGrow:1}}>{f.desc}</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:a.color,fontWeight:700}}>Budget ×{f.budgetMult}</span>
                <span style={{...mkPill(T.textFaint),fontSize:9}}>Patience {f.patience}/5</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:10,fontWeight:700,color:T.textMuted,marginBottom:10,textTransform:"uppercase"}}>Instructional Design</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:11}}>
          {DELIVERY_MODES.map(d=>{
            const compat=d.bestFor.some(s=>sectors.includes(s));
            return (
              <div key={d.id} onClick={()=>setDelivery(d.id)} style={{...mkCard(a.color,delivery===d.id),cursor:"pointer"}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                  <span>{d.icon}</span>
                  <div style={{fontWeight:600,fontSize:13,color:T.text}}>{d.label}</div>
                </div>
                <div style={{marginBottom:8}}>
                  <span style={{...mkPill(compat?"#059669":"#dc2626"),fontSize:9}}>{compat?"Sector Compatible":"Overhead Risk"}</span>
                </div>
                <div style={{fontSize:10,color:T.textFaint,fontFamily:T.mono}}>CapEx Weight: {d.capexMult}×</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={onBack} style={mkBtn(T.textMuted,true)}>← Back</button>
        <button onClick={()=>funding&&delivery&&onNext({fundingSource:funding,deliveryMode:delivery})} style={{...mkBtn(a.color),opacity:funding&&delivery?1:0.4}}>
          Launch Simulation →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  YEAR PLAY — 2-panel, period-aware
// ═══════════════════════════════════════════════════════
function YearPlay({gameState,onYearComplete}){
  const {year,archetype,sectors,budget,kpis,kpiPool,selectedKPIs,endGoal,stress,fundingSource,deliveryMode}=gameState;
  const a=ARCHETYPES.find(x=>x.id===archetype);
  const event=YEAR_EVENTS.find(e=>e.year===year);
  const cadence=getCadence(year);
  const endGoalDef=a.endGoals.find(g=>g.id===endGoal);

  const [period,setPeriod]=useState(0);
  const [periodKpis,setPeriodKpis]=useState(kpis);
  const [periodStress,setPeriodStress]=useState(stress);
  const [periodBudget,setPeriodBudget]=useState(budget);
  const [periodHistory,setPeriodHistory]=useState([]);
  const [params,setParams]=useState(()=>{const i={};PARAMS.forEach(p=>{i[p.id]=10;});return i;});

  const totalAlloc=Object.values(params).reduce((s,v)=>s+v,0);
  const setParam=useCallback((id,val)=>setParams(prev=>({...prev,[id]:val})),[]);
  const liveImpacts=useMemo(()=>computeImpact({params,archetype,selectedKPIs,kpiPool,kpis:periodKpis}),[params,archetype,selectedKPIs,kpiPool,periodKpis]);

  const commitPeriod=()=>{
    const result=simulateYear({kpis:periodKpis,params,archetype,sectors,fundingSource,deliveryMode,year,stress:periodStress});
    const newHist=[...periodHistory,{period,kpisBefore:periodKpis,result}];
    setPeriodHistory(newHist);
    setPeriodKpis(result.newKpis);
    setPeriodStress(result.newStress);
    setPeriodBudget(result.nextBudget);
    if(period+1>=cadence.periods){
      const avgScore=Math.round(newHist.reduce((s,h)=>s+h.result.yearScore,0)/newHist.length);
      onYearComplete({finalKpis:result.newKpis,finalStress:result.newStress,nextBudget:result.nextBudget,yearScore:avgScore,periodHistory:newHist,event});
    } else {
      setPeriod(period+1);
      setParams(()=>{const i={};PARAMS.forEach(p=>{i[p.id]=10;});return i;});
    }
  };

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"22px 20px"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:14,borderBottom:`1px solid ${T.border}`,paddingBottom:16}}>
        <div>
          <div style={{display:"flex",gap:6,marginBottom:7,flexWrap:"wrap"}}>
            <span style={mkPill(a.color)}>{a.label}</span>
            <span style={mkPill(T.textMuted)}>Year {year}/5</span>
            <span style={mkPill("#7c3aed")}>{cadence.label}</span>
            <span style={mkPill(periodStress>7?"#dc2626":periodStress>4?"#d97706":"#059669")}>Stress: {periodStress.toFixed(1)}</span>
            {sectors.length>1&&<span style={mkPill("#0284c7")}>Focus: {sectors.length===2?"0.85×":"0.70×"}</span>}
          </div>
          <h2 style={{fontWeight:700,fontSize:21,color:T.text}}>Budget Allocation — {cadence.pLabel(period)}</h2>
          {cadence.periods>1&&(
            <div style={{marginTop:8}}>
              <div style={{display:"flex",gap:5}}>
                {Array.from({length:cadence.periods}).map((_,i)=>(
                  <div key={i} style={{height:4,flex:1,borderRadius:2,background:i<period?"#059669":i===period?a.color:T.track,transition:"background 0.3s"}}/>
                ))}
              </div>
              <div style={{fontSize:9,color:T.textFaint,marginTop:3}}>Period {period+1} of {cadence.periods}</div>
            </div>
          )}
        </div>
        <div style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 20px",textAlign:"right"}}>
          <div style={{fontSize:9,color:T.textFaint,fontWeight:700,textTransform:"uppercase",marginBottom:2}}>Available Budget</div>
          <div style={{fontFamily:T.mono,fontWeight:800,fontSize:26,color:T.text}}>₹{periodBudget.toFixed(1)} Cr</div>
          <div style={{fontSize:9,fontWeight:700,fontFamily:T.mono,marginTop:2,color:Math.abs(totalAlloc-100)<=2?"#059669":"#dc2626"}}>{totalAlloc}/100 units</div>
        </div>
      </div>

      {/* Event */}
      <div style={{background:"#fffbeb",border:`1px solid ${T.border}`,borderLeft:"4px solid #f59e0b",borderRadius:6,padding:"11px 15px",marginBottom:16}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:15}}>📡</span>
          <div>
            <div style={{fontWeight:700,fontSize:11,color:"#92400e",textTransform:"uppercase",letterSpacing:"0.03em",marginBottom:2}}>{event.name}</div>
            <p style={{fontSize:12,color:"#78350f",lineHeight:1.5,margin:0}}>{event.desc}</p>
          </div>
        </div>
      </div>

      {/* 2-PANEL LAYOUT */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}} className="play-grid">

        {/* LEFT: KPI Scorecard */}
        <div style={{...mkCard(),padding:"16px 18px",display:"flex",flexDirection:"column"}}>
          <div style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",marginBottom:12}}>Performance Scorecard</div>
          <div style={{overflowY:"auto",flex:1,maxHeight:440,paddingRight:4}}>
            {selectedKPIs.map(kpiId=>{
              const def=kpiPool.find(k=>k.id===kpiId);
              if(!def) return null;
              const target=endGoalDef?.kpiTargets?.[kpiId];
              return <KPIBar key={kpiId} label={def.label} value={periodKpis[kpiId]??def.base} color={a.color} inverse={def.inverse} targetVal={target}/>;
            })}
          </div>
          {periodHistory.length>0&&(
            <div style={{marginTop:10,borderTop:`1px solid ${T.border}`,paddingTop:10}}>
              <div style={{fontSize:9,fontWeight:700,color:T.textMuted,textTransform:"uppercase",marginBottom:6}}>Period Results</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {periodHistory.map(h=>(
                  <div key={h.period} style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:5,padding:"4px 10px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:T.textFaint}}>{cadence.pLabel(h.period)}</div>
                    <div style={{fontFamily:T.mono,fontWeight:700,fontSize:14,color:h.result.yearScore>=35?"#059669":"#dc2626"}}>{h.result.yearScore}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Sliders (top) + Live Chart (bottom) */}
        <div style={{...mkCard(),padding:"16px 18px",display:"flex",flexDirection:"column"}}>
          <div style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",marginBottom:10}}>Strategic Controls</div>
          <div style={{overflowY:"auto",maxHeight:230,paddingRight:4}}>
            {PARAMS.map(p=><ColorSlider key={p.id} param={p} value={params[p.id]} onChange={v=>setParam(p.id,v)}/>)}
          </div>
          <div style={{borderTop:`1px solid ${T.border}`,margin:"12px 0"}}/>
          {/* Live impact chart — auto-updates with slider */}
          <div style={{overflowY:"auto",flex:1,maxHeight:210}}>
            <LiveImpactChart impacts={liveImpacts} selectedKPIs={selectedKPIs} kpiPool={kpiPool} archColor={a.color}/>
          </div>
        </div>
      </div>

      {/* Commit */}
      <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:14}}>
        {Math.abs(totalAlloc-100)>2&&<span style={{fontSize:12,color:"#d97706"}}>⚠ Allocation: {totalAlloc}/100 — adjust before committing</span>}
        <button onClick={commitPeriod} style={{...mkBtn(a.color),padding:"12px 40px",fontSize:14}}>
          Commit — {cadence.pLabel(period)} →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  YEAR RESULT
// ═══════════════════════════════════════════════════════
function YearResult({yearData,gameState,onNext}){
  const {yearScore,finalKpis,finalStress,nextBudget,periodHistory}=yearData;
  const a=ARCHETYPES.find(x=>x.id===gameState.archetype);
  const sc=yearScore>=55?"#059669":yearScore>=30?"#d97706":"#dc2626";
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"28px 20px"}}>
      <div style={{marginBottom:20}}>
        <span style={mkPill(a.color)}>Year {gameState.year} — Performance Review</span>
        <h2 style={{fontWeight:700,fontSize:28,color:T.text,marginTop:8}}>
          {yearScore>=55?"Above Target":yearScore>=30?"On Target":"Below Target"}
        </h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:16,marginBottom:28}} className="result-header-grid">
        <div style={{...mkCard(sc,true),justifyContent:"center",alignItems:"center"}}>
          <div style={{fontFamily:T.mono,fontWeight:800,fontSize:52,color:sc,textAlign:"center",lineHeight:1}}>{yearScore}%</div>
          <div style={{fontSize:10,color:T.textMuted,textAlign:"center",textTransform:"uppercase",marginTop:6}}>Performance Index</div>
        </div>
        <div style={mkCard()}>
          <div style={{display:"flex",flexDirection:"column",gap:14,padding:"4px 0"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:T.textMuted,fontSize:13}}>Next Cycle Budget</span><span style={{fontFamily:T.mono,fontWeight:700,color:T.text}}>₹{nextBudget.toFixed(1)} Cr</span></div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:T.textMuted,fontSize:13}}>Operational Friction</span><span style={{fontFamily:T.mono,fontWeight:700,color:finalStress>7?"#dc2626":"#059669"}}>{finalStress.toFixed(1)} / 10</span></div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:T.textMuted,fontSize:13}}>Periods Completed</span><span style={{fontFamily:T.mono,fontWeight:700,color:a.color}}>{periodHistory.length}</span></div>
            {finalStress>7&&<div style={{fontSize:12,color:"#dc2626",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"8px 12px"}}>⚠ High stress penalising KPI delivery. Invest more in trainer hiring next year.</div>}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10,marginBottom:32}}>
        {gameState.selectedKPIs.map(kpiId=>{
          const def=gameState.kpiPool.find(k=>k.id===kpiId);
          const after=finalKpis[kpiId]??def?.base??0;
          const before=gameState.kpis[kpiId]??def?.base??0;
          const diff=after-before;
          const good=def?.inverse?diff<0:diff>0;
          const note=yearData.periodHistory.at(-1)?.result?.narratives?.[kpiId]||(good?"Improving steadily.":"Needs more investment.");
          return (
            <div key={kpiId} style={{...mkCard(),padding:"14px 16px"}}>
              <div style={{fontSize:9,color:T.textFaint,fontWeight:700,textTransform:"uppercase",marginBottom:7,lineHeight:1.3}}>{def?.label}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                <span style={{fontFamily:T.mono,fontWeight:700,fontSize:18,color:good?"#059669":"#dc2626"}}>{after.toFixed(1)}</span>
                <span style={{fontSize:11,color:good?"#059669":"#dc2626",fontWeight:600}}>{good?"▲":"▼"} {Math.abs(diff).toFixed(1)}</span>
              </div>
              <div style={{fontSize:10,color:T.textFaint,lineHeight:1.45}}>{note}</div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={onNext} style={{...mkBtn(a.color),padding:"12px 36px"}}>
          {gameState.year<5?`Proceed to Year ${gameState.year+1} →`:"View Final Report →"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  FINAL RESULTS
// ═══════════════════════════════════════════════════════
function FinalResults({gameState,yearHistory}){
  const a=ARCHETYPES.find(x=>x.id===gameState.archetype);
  const endGoal=a.endGoals.find(g=>g.id===gameState.endGoal);
  const finalKPIs=gameState.kpis;
  let goalMet=0,goalTotal=0;
  Object.entries(endGoal.kpiTargets).forEach(([kpiId,target])=>{
    goalTotal++;
    const val=finalKPIs[kpiId];
    const def=ARCHETYPES.flatMap(x=>x.kpiPool).find(kp=>kp.id===kpiId);
    if(val!==undefined&&(def?.inverse?val<=target:val>=target)) goalMet++;
  });
  const goalPct=Math.round((goalMet/goalTotal)*100);
  let totalGood=0,totalKPIs=0;
  gameState.selectedKPIs.forEach(kpiId=>{
    const def=gameState.kpiPool.find(k=>k.id===kpiId);
    if(!def) return;
    totalKPIs++;
    if(def.inverse?finalKPIs[kpiId]<def.base:finalKPIs[kpiId]>def.base) totalGood++;
  });
  const kpiScore=Math.round((totalGood/totalKPIs)*100);
  const avgStress=yearHistory.length?yearHistory.reduce((s,y)=>s+(y.stress||0),0)/yearHistory.length:3;
  const stability=Math.round(Math.max(0,100-avgStress*9));
  const overall=Math.round(goalPct*0.4+kpiScore*0.35+stability*0.25);
  const grade=overall>=85?"S":overall>=70?"A":overall>=55?"B":overall>=40?"C":"D";
  const gc={S:"#059669",A:"#2563eb",B:"#d97706",C:"#c2410c",D:"#dc2626"}[grade];
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"36px 20px"}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{fontSize:36,marginBottom:16}}>🏛️</div>
        <h2 style={{fontWeight:800,fontSize:30,color:T.text,marginBottom:6}}>Final Institutional Assessment</h2>
        <p style={{color:T.textMuted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>5-Year Strategic Review</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20,marginBottom:32}}>
        <div style={{...mkCard(gc,true),justifyContent:"center",alignItems:"center",padding:28}}>
          <div style={{fontFamily:T.mono,fontSize:76,fontWeight:800,color:gc,lineHeight:1}}>{grade}</div>
          <div style={{fontSize:10,fontWeight:700,color:T.textFaint,textTransform:"uppercase",marginTop:6}}>Composite Strategy Grade</div>
          <div style={{fontFamily:T.mono,fontSize:22,color:T.text,marginTop:6}}>{overall} / 100</div>
        </div>
        <div style={mkCard()}>
          <div style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",marginBottom:18}}>Score Breakdown</div>
          {[
            {label:"Target Achievement",score:goalPct,color:a.color,sub:`${goalMet}/${goalTotal} targets met`},
            {label:"KPI Growth Velocity",score:kpiScore,color:"#2563eb",sub:`${totalGood}/${totalKPIs} KPIs improved`},
            {label:"Operational Stability",score:stability,color:"#059669",sub:`Avg stress: ${avgStress.toFixed(1)}`},
          ].map(s=>(
            <div key={s.label} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                <div><span style={{color:T.text,fontWeight:600}}>{s.label}</span><span style={{color:T.textFaint,fontSize:10,marginLeft:6}}>{s.sub}</span></div>
                <span style={{fontWeight:700,fontFamily:T.mono,color:s.color}}>{s.score}%</span>
              </div>
              <div style={{height:5,background:T.track,borderRadius:3}}><div style={{height:"100%",width:`${s.score}%`,background:s.color,borderRadius:3}}/></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{...mkCard(),marginBottom:24}}>
        <div style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",marginBottom:14}}>5-Year KPI Journey</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:9}}>
          {gameState.selectedKPIs.map(kpiId=>{
            const def=gameState.kpiPool.find(k=>k.id===kpiId);
            if(!def) return null;
            const start=def.base,end=finalKPIs[kpiId]??start;
            const good=def.inverse?end<start:end>start;
            const target=endGoal.kpiTargets[kpiId];
            const met=target!=null?(def.inverse?end<=target:end>=target):null;
            return (
              <div key={kpiId} style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:6,padding:"10px 12px"}}>
                <div style={{fontSize:9,color:T.textFaint,marginBottom:4}}>{def.label}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontFamily:T.mono,fontSize:10,color:T.textFaint}}>{start}{def.unit}</span>
                  <span style={{color:T.textFaint}}>→</span>
                  <span style={{fontFamily:T.mono,fontWeight:700,fontSize:14,color:good?a.color:"#dc2626"}}>{end.toFixed(1)}{def.unit}</span>
                </div>
                {met!=null&&<span style={{...mkPill(met?"#059669":"#dc2626"),fontSize:8}}>{met?"✓ Target Met":"✗ Missed"}</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{background:"#0f172a",borderRadius:8,padding:"24px 28px",color:"#f1f5f9",marginBottom:28}}>
        <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",marginBottom:16}}>Board Observations</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
          <p style={{fontSize:13,lineHeight:1.65,color:"#cbd5e1"}}>Vision alignment at <b style={{color:"#fff"}}>{goalPct}%</b>. Operated under {a.label} across {gameState.sectors.length} sector{gameState.sectors.length>1?"s":""}.</p>
          <p style={{fontSize:13,lineHeight:1.65,color:"#cbd5e1"}}>{stability>70?"Operational maturity was high.":"Operational friction elevated — underinvestment in faculty compounded over time."} Final score: <b style={{color:"#fff"}}>{overall}/100 (Grade {grade})</b>.</p>
        </div>
      </div>
      <div style={{textAlign:"center"}}>
        <button onClick={()=>window.location.reload()} style={{...mkBtn(T.primary),padding:"12px 40px"}}>Re-initialize Simulation</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN CONTROLLER
// ═══════════════════════════════════════════════════════
export default function InstituteCommand(){
  const [screen,setScreen]=useState("welcome");
  const [gs,setGs]=useState({});
  const [history,setHistory]=useState([]);
  const [lastYearData,setLastYearData]=useState(null);

  const buildKPIs=(ids,pool)=>{ const k={}; ids.forEach(id=>{const d=pool.find(x=>x.id===id);if(d) k[id]=d.base;}); return k; };
  const getExtras=(sectors,fundingSource,archetype)=>{
    const arch=ARCHETYPES.find(a=>a.id===archetype);
    const extras=[];
    const funder=FUNDING_SOURCES.find(f=>f.id===fundingSource);
    if(funder?.kpiBonus) Object.keys(funder.kpiBonus).forEach(k=>{if(!arch.kpiPool.find(kp=>kp.id===k)){const found=ARCHETYPES.flatMap(x=>x.kpiPool).find(kp=>kp.id===k);if(found&&!extras.find(e=>e.id===k)) extras.push({...found,tag:funder.label});}});
    sectors.forEach(sid=>{const sec=SECTORS.find(s=>s.id===sid);if(sec?.salaryMult>1.1){const k="avg_salary";if(!arch.kpiPool.find(kp=>kp.id===k)&&!extras.find(e=>e.id===k)) extras.push({id:k,label:"Avg Starting Salary (LPA)",base:3.5,unit:"L",tag:sec.label});}});
    return extras;
  };

  const handleSetup=(step,data)=>{
    if(step==="archetype"){setGs(g=>({...g,...data}));setScreen("kpis");}
    else if(step==="kpis"){setGs(g=>({...g,...data}));setScreen("sectors");}
    else if(step==="sectors"){setGs(g=>({...g,...data}));setScreen("funding");}
    else if(step==="funding"){
      const funder=FUNDING_SOURCES.find(f=>f.id===data.fundingSource);
      const budgetStart=Math.round(100*(funder?.budgetMult||1));
      const extras=getExtras(gs.sectors||[],data.fundingSource,gs.archetype);
      const mergedPool=[...gs.kpiPool||[]];
      extras.forEach(e=>{if(!mergedPool.find(k=>k.id===e.id)) mergedPool.push(e);});
      let mergedSelected=[...gs.selectedKPIs||[]];
      extras.forEach(e=>{if(mergedSelected.length<10&&!mergedSelected.includes(e.id)) mergedSelected.push(e.id);});
      const kpis=buildKPIs(mergedSelected,mergedPool);
      setGs(g=>({...g,...data,selectedKPIs:mergedSelected,kpiPool:mergedPool,year:1,budget:budgetStart,stress:0,kpis}));
      setScreen("year");
    }
  };

  const handleYearComplete=(yearData)=>{
    setLastYearData({...yearData,year:gs.year});
    setGs(g=>({...g,kpis:yearData.finalKpis,stress:yearData.finalStress,budget:yearData.nextBudget}));
    setHistory(h=>[...h,{year:gs.year,yearScore:yearData.yearScore,stress:yearData.finalStress}]);
    setScreen("yearResult");
  };

  const handleNext=()=>{
    if(gs.year>=5) setScreen("final");
    else {setGs(g=>({...g,year:g.year+1}));setScreen("year");}
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Inter',-apple-system,sans-serif;-webkit-font-smoothing:antialiased;background:#f8fafc;}
        button:hover{opacity:0.88;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px;}
        .play-grid{grid-template-columns:1fr 1fr;}
        .result-header-grid{grid-template-columns:180px 1fr;}
        @media(max-width:860px){.play-grid,.result-header-grid{grid-template-columns:1fr!important;}}
      `}</style>
      <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:T.font}}>
        {screen!=="welcome"&&(
          <div style={{background:"rgba(255,255,255,0.95)",borderBottom:`1px solid ${T.border}`,padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(8px)"}}>
            <div style={{fontWeight:800,fontSize:14,color:T.text}}>🏛️ Institute<span style={{color:T.primary}}>Command</span></div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              {gs.archetype&&(()=>{const a=ARCHETYPES.find(x=>x.id===gs.archetype);return a?<span style={mkPill(a.color)}>{a.label}</span>:null;})()}
              {gs.year&&<span style={mkPill("#475569")}>Year {gs.year}/5</span>}
            </div>
          </div>
        )}
        {screen==="welcome"&&<Welcome onStart={()=>setScreen("archetype")}/>}
        {screen==="archetype"&&<ArchetypeStep onNext={d=>handleSetup("archetype",d)}/>}
        {screen==="kpis"&&<KPIStep archetype={gs.archetype} extraKpiIds={[]} onNext={d=>handleSetup("kpis",d)} onBack={()=>setScreen("archetype")}/>}
        {screen==="sectors"&&<SectorStep archetype={gs.archetype} onNext={d=>handleSetup("sectors",d)} onBack={()=>setScreen("kpis")}/>}
        {screen==="funding"&&<FundingStep archetype={gs.archetype} sectors={gs.sectors||[]} onNext={d=>handleSetup("funding",d)} onBack={()=>setScreen("sectors")}/>}
        {screen==="year"&&<YearPlay gameState={gs} onYearComplete={handleYearComplete}/>}
        {screen==="yearResult"&&lastYearData&&<YearResult yearData={lastYearData} gameState={gs} onNext={handleNext}/>}
        {screen==="final"&&<FinalResults gameState={gs} yearHistory={history}/>}
      </div>
    </>
  );
}
