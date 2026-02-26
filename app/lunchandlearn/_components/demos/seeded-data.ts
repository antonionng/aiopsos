export const DEPARTMENT_INFO: Record<
  string,
  { label: string; icon: string; color: string; description: string }
> = {
  sales: {
    label: "Sales",
    icon: "TrendingUp",
    color: "#d4d4d8",
    description: "Pipeline, prospecting, and client engagement",
  },
  finance: {
    label: "Finance",
    icon: "PoundSterling",
    color: "#a1a1aa",
    description: "Claims analysis, budgeting, and ROI forecasting",
  },
  marketing: {
    label: "Marketing",
    icon: "Megaphone",
    color: "#d4d4d8",
    description: "Campaigns, content strategy, and brand awareness",
  },
  engineering: {
    label: "Engineering",
    icon: "Code",
    color: "#71717a",
    description: "Product development, infrastructure, and automation",
  },
  product: {
    label: "Product",
    icon: "Layout",
    color: "#a1a1aa",
    description: "Roadmap, user research, and feature prioritization",
  },
  operations: {
    label: "Operations",
    icon: "Settings",
    color: "#d4d4d8",
    description: "Sensor networks, monitoring, and service delivery",
  },
};

export const SALES_PROSPECTS = [
  { company: "Thames Water", sector: "Water Utility", riskScore: 87, dealValue: "£450K", stage: "Proposal Sent" },
  { company: "Aviva Insurance", sector: "Insurance", riskScore: 72, dealValue: "£320K", stage: "Qualified Lead" },
  { company: "Zurich Municipal", sector: "Insurance", riskScore: 91, dealValue: "£580K", stage: "Negotiation" },
  { company: "National Grid", sector: "Energy", riskScore: 65, dealValue: "£290K", stage: "Discovery" },
  { company: "Barratt Developments", sector: "Construction", riskScore: 78, dealValue: "£210K", stage: "Demo Scheduled" },
  { company: "United Utilities", sector: "Water Utility", riskScore: 83, dealValue: "£390K", stage: "Contract Review" },
];

export const FINANCE_METRICS = {
  claims: { total: 847, avgCost: "£12,400", totalValue: "£10.5M" },
  bySeverity: [
    { level: "Critical", pct: 12, value: "£4.2M" },
    { level: "High", pct: 28, value: "£3.8M" },
    { level: "Medium", pct: 35, value: "£1.9M" },
    { level: "Low", pct: 25, value: "£0.6M" },
  ],
  budget: { aiInvestment: "£150K", projectedSavings: "£420K", breakEvenMonths: 8 },
};

export const MARKETING_CAMPAIGNS = [
  { name: "Flood Preparedness Q4", reach: "45K", ctr: "3.2%", leads: 12 },
  { name: "LinkedIn Thought Leadership", impressions: "23K/mo", engagement: "8.4%" },
  { name: "Future of Flood Risk Webinar", signups: 340, attendance: "62%", leads: 28 },
];

export const ENGINEERING_METRICS = {
  sprintVelocity: 34,
  sprintsCompleted: 12,
  backlog: { total: 47, p0: 3, p1: 6, p2: 9, techDebt: 11, features: 18 },
  deployFrequency: "4.2/week",
  incidentRate: "0.3/week",
};

export const PRODUCT_METRICS = {
  dau: 1240,
  mau: 3890,
  dauMauRatio: 31.9,
  nps: 52,
  csat: 4.2,
  featureAdoption: [
    { feature: "Dashboard", adoption: 94 },
    { feature: "Alerts", adoption: 87 },
    { feature: "Reports", adoption: 61 },
    { feature: "API", adoption: 42 },
  ],
  topRequests: [
    { feature: "Mobile App", pct: 67 },
    { feature: "Custom Alerts", pct: 54 },
    { feature: "Trend Analysis", pct: 49 },
  ],
};

export const SENSOR_NETWORK = {
  totalSensors: 1847,
  regions: 12,
  uptime: "99.2%",
  dataInterval: "15 min",
  coverageGaps: [
    { region: "Southwest", deficit: "14%" },
    { region: "East Anglia", deficit: "22%" },
  ],
  maintenanceBacklog: 43,
  offlineSensors: 12,
  regionalDistribution: [
    { region: "Midlands", pct: 34 },
    { region: "North", pct: 22 },
    { region: "South", pct: 18 },
    { region: "London", pct: 14 },
    { region: "East", pct: 12 },
  ],
};
