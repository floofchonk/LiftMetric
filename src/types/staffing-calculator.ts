// Core project configuration types
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
export type RiskProfile = 'Low' | 'Medium' | 'High';
export type TShirtSize = 'S' | 'M' | 'L' | 'XL';
export type StrategicPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Phase = 'Discovery' | 'Design' | 'Build' | 'Testing' | 'Launch' | 'Hypercare';

// Project input configuration
export interface ProjectInputs {
  projectName: string;
  description: string;
  businessUnit: string;
  currency: Currency;
  startDate: string;
  targetGoLiveDate: string;
  riskProfile: RiskProfile;
  tShirtSize: TShirtSize;
  complexityFactor: number; // 0.5 - 2.0
  strategicPriority: StrategicPriority;
  discountRate: number; // for ROI calculations
}

// T-shirt size configuration with phase breakdown
export interface TShirtSizeConfig {
  size: TShirtSize;
  baseEffortHours: number;
  baseDurationMonths: number;
  phaseDistribution: {
    Discovery: number;
    Design: number;
    Build: number;
    Testing: number;
    Launch: number;
    Hypercare: number;
  };
}

// Role configuration
export type RoleCategory = 'Leadership' | 'Design' | 'Engineering' | 'QA' | 'Product' | 'Operations';
export type Seniority = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Principal';

export interface Role {
  id: string;
  name: string;
  category: RoleCategory;
  seniority: Seniority;
  allocationPercentage: number; // % of total effort
  calculatedHours?: number;
  overrideHours?: number;
}

// Location configuration
export interface Location {
  id: string;
  building: string;
  city: string;
  state: string;
  country: string;
  costIndex: number; // 1.0 = baseline, >1 more expensive, <1 less expensive
  fxRate: number; // exchange rate to base currency
}

// Staffing model types
export type StaffingModel = 'DirectHire' | 'OnsiteContractor' | 'OutsourcedVendor';
export type RateType = 'TimeAndMaterials' | 'FixedPrice' | 'Milestone';

// Direct Hire cost inputs
export interface DirectHireCostInputs {
  baseSalary: number;
  benefitsPercentage: number;
  taxesPercentage: number;
  overheadPercentage: number;
  fixedCosts: number;
}

// Onsite Contractor cost inputs
export interface OnsiteContractorCostInputs {
  billRate: number;
  markupPercentage: number;
  overheadManagementPercentage: number;
}

// Outsourced Vendor cost inputs
export interface OutsourcedVendorCostInputs {
  rateType: RateType;
  hourlyRate?: number;
  fixedFee?: number;
  milestoneFees?: { phase: Phase; amount: number }[];
  discountPercentage: number;
  slaBufferPercentage: number;
  internalOversightHours: number;
  oversightHourlyRate: number;
}

// Role assignment to location per model
export interface RoleLocationAssignment {
  roleId: string;
  locationId: string;
  staffingModel: StaffingModel;
  costInputs: DirectHireCostInputs | OnsiteContractorCostInputs | OutsourcedVendorCostInputs;
}

// Phase calculation result
export interface PhaseResult {
  phase: Phase;
  startDate: string;
  endDate: string;
  durationDays: number;
  effortHours: number;
  cost: number;
  roles: {
    roleId: string;
    roleName: string;
    hours: number;
    cost: number;
  }[];
}

// Model comparison result
export interface ModelResult {
  staffingModel: StaffingModel;
  totalCost: number;
  totalDuration: number;
  totalEffortHours: number;
  meetsTargetDate: boolean;
  phases: PhaseResult[];
  roleBreakdown: {
    roleId: string;
    roleName: string;
    totalHours: number;
    totalCost: number;
    hourlyRate: number;
  }[];
  costByPhase: { phase: Phase; cost: number }[];
  timeline: {
    startDate: string;
    endDate: string;
    targetDate: string;
    daysEarly: number;
    daysLate: number;
  };
}

// ROI metrics
export interface ROIMetrics {
  netPresentValue: number;
  returnOnInvestment: number;
  paybackPeriodMonths: number;
  breakEvenDate: string;
  expectedRevenue: number;
  totalInvestment: number;
}

// Complete calculation result
export interface CalculationResult {
  projectInputs: ProjectInputs;
  models: ModelResult[];
  recommendedModel: StaffingModel;
  comparison: {
    costSavings: { model: StaffingModel; savingsAmount: number; savingsPercentage: number }[];
    timeToMarket: { model: StaffingModel; duration: number; difference: number }[];
    riskAssessment: { model: StaffingModel; riskScore: number; factors: string[] }[];
  };
  roiMetrics?: ROIMetrics;
}

// Default T-shirt size configurations
export const DEFAULT_TSHIRT_CONFIGS: TShirtSizeConfig[] = [
  {
    size: 'S',
    baseEffortHours: 1000,
    baseDurationMonths: 3,
    phaseDistribution: {
      Discovery: 15,
      Design: 20,
      Build: 35,
      Testing: 15,
      Launch: 10,
      Hypercare: 5,
    },
  },
  {
    size: 'M',
    baseEffortHours: 3000,
    baseDurationMonths: 6,
    phaseDistribution: {
      Discovery: 12,
      Design: 18,
      Build: 40,
      Testing: 15,
      Launch: 10,
      Hypercare: 5,
    },
  },
  {
    size: 'L',
    baseEffortHours: 6000,
    baseDurationMonths: 9,
    phaseDistribution: {
      Discovery: 10,
      Design: 15,
      Build: 45,
      Testing: 15,
      Launch: 10,
      Hypercare: 5,
    },
  },
  {
    size: 'XL',
    baseEffortHours: 12000,
    baseDurationMonths: 12,
    phaseDistribution: {
      Discovery: 10,
      Design: 15,
      Build: 45,
      Testing: 15,
      Launch: 10,
      Hypercare: 5,
    },
  },
];

// Default roles template
export const DEFAULT_ROLES: Role[] = [
  { id: 'r1', name: 'Project Manager', category: 'Leadership', seniority: 'Senior', allocationPercentage: 15 },
  { id: 'r2', name: 'Tech Lead', category: 'Leadership', seniority: 'Lead', allocationPercentage: 20 },
  { id: 'r3', name: 'UX Designer', category: 'Design', seniority: 'Senior', allocationPercentage: 12 },
  { id: 'r4', name: 'UI Designer', category: 'Design', seniority: 'Mid', allocationPercentage: 10 },
  { id: 'r5', name: 'Senior Engineer', category: 'Engineering', seniority: 'Senior', allocationPercentage: 25 },
  { id: 'r6', name: 'Mid Engineer', category: 'Engineering', seniority: 'Mid', allocationPercentage: 20 },
  { id: 'r7', name: 'Junior Engineer', category: 'Engineering', seniority: 'Junior', allocationPercentage: 15 },
  { id: 'r8', name: 'QA Engineer', category: 'QA', seniority: 'Senior', allocationPercentage: 18 },
  { id: 'r9', name: 'Product Owner', category: 'Product', seniority: 'Senior', allocationPercentage: 12 },
  { id: 'r10', name: 'DevOps Engineer', category: 'Operations', seniority: 'Senior', allocationPercentage: 13 },
];

// Default locations
export const DEFAULT_LOCATIONS: Location[] = [
  { id: 'l1', building: 'HQ', city: 'San Francisco', state: 'CA', country: 'USA', costIndex: 1.4, fxRate: 1.0 },
  { id: 'l2', building: 'East Coast', city: 'New York', state: 'NY', country: 'USA', costIndex: 1.3, fxRate: 1.0 },
  { id: 'l3', building: 'Midwest', city: 'Chicago', state: 'IL', country: 'USA', costIndex: 1.0, fxRate: 1.0 },
  { id: 'l4', building: 'Remote - APAC', city: 'Bangalore', state: 'Karnataka', country: 'India', costIndex: 0.3, fxRate: 83.0 },
  { id: 'l5', building: 'Remote - EMEA', city: 'London', state: 'England', country: 'UK', costIndex: 1.2, fxRate: 0.79 },
];
