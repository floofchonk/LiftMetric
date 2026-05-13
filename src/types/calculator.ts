// Core calculator types

export type TShirtSizeCode = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface TShirtSize {
  size: string;
  baseHours: number;
  baseDurationMonths: number;
  phases: {
    discovery: number;
    design: number;
    build: number;
    testing: number;
    launch: number;
    hypercare: number;
  };
}

export interface Location {
  id: string;
  name?: string;
  building?: string;
  city?: string;
  state?: string;
  country?: string;
  region?: string;
  costMultiplier?: number;
  costIndex?: number;
  fxRate?: number;
  timezone?: string;
}

export interface DirectHireCosts {
  baseSalary?: number;
  benefits?: number;
  overhead?: number;
  recruitingCost?: number;
  trainingCost?: number;
  rampUpMonths?: number;
  [key: string]: number | undefined;
}

export interface ContractorCosts {
  hourlyRate?: number;
  agencyFee?: number;
  estimatedHours?: number;
  contractDuration?: number;
  [key: string]: number | undefined;
}

export interface VendorCosts {
  projectFee?: number;
  managementFee?: number;
  changeOrderBuffer?: number;
  supportCost?: number;
  [key: string]: number | undefined;
}

export interface CostModels {
  directHire: DirectHireCosts;
  contractor: ContractorCosts;
  vendor: VendorCosts;
}

export interface ROIInputs {
  initialInvestment: number;
  annualBenefit: number;
  annualCosts: number;
  projectDuration: number;
  discountRate: number;
  growthRate?: number;
  inflationRate?: number;
  taxRate?: number;
  residualValue?: number;
  expectedAnnualBenefit?: number;
  timeToFullBenefit?: number;
  projectLifetimeYears?: number;
  totalProjectCost?: number;
}

export interface CalculatorInputs {
  companySize: string;
  industry: string;
  projectScope: string;
  annualVolume: string;
  currentSpend: string;
  timelineMonths?: number;
}

export interface ProjectInputs {
  projectName?: string;
  startDate?: string;
  projectDuration?: number;
  initialInvestment?: number;
  annualRevenue?: number;
  operatingCosts?: number;
  discountRate?: number;
  description?: string;
  businessUnit?: string;
  currency?: string;
  targetGoLive?: string;
  tshirtSize?: string;
  riskProfile?: string;
  strategicPriority?: string;
  complexityFactor?: number;
}

export interface ROIData {
  percentage: number;
  amount: number;
  paybackMonths?: number;
  npv?: number;
  totalProjectCost?: number;
  expectedAnnualBenefit?: number;
  timeToFullBenefit?: number;
  projectLifetimeYears?: number;
  discountRate?: number;
  residualValue?: number;
  roiPercentage?: number;
}

export interface TimelinePhase {
  period: number;
  revenue: number;
  costs: number;
  profit: number;
  cumulativeROI: number;
  name?: string;
  duration?: number;
  startDate?: string;
  endDate?: string;
}

export interface TimelineData {
  phases: TimelinePhase[];
  totalDuration: number;
  goLiveDate?: string;
  meetsTarget?: boolean;
}

export interface StaffingOption {
  type: string;
  cost: number;
  timeline: number;
  risk: string;
  pros: string[];
  cons: string[];
}

export interface StaffingMetrics {
  totalHeadcount: number;
  totalCost: number;
  averageRate: number;
  utilizationRate: number;
  efficiencyScore?: number;
}

// Unified ROI type - always use ROIData for consistency
export interface CalculationResults {
  totalRevenue: number;
  totalCosts: number;
  totalCost?: number;
  netProfit: number;
  roi: ROIData;
  npv?: number;
  irr?: number;
  timeline: TimelinePhase[] | TimelineData;
  options: StaffingOption[];
  staffingOptions?: StaffingOption[];
  recommendations: string[];
  bestOption: string;
  paybackPeriod: number;
  directHire?: StaffingOption;
  contractor?: StaffingOption;
  vendor?: StaffingOption;
  profitMargin?: number;
  costSavings?: number;
  annualSavings?: number;
  totalSavings?: number;
  staffingMetrics?: StaffingMetrics;
}

export interface CalculatorResults extends CalculationResults {}

export interface Scenario {
  id: string;
  name: string;
  inputs: CalculatorInputs;
  results: CalculatorResults;
  createdAt: string;
  updatedAt?: string;
  lastModified?: string;
  description?: string;
  mode?: 'basic' | 'scientific';
  tags?: string[];
}

export interface Role {
  id: string;
  title?: string;
  name?: string;
  level?: string;
  quantity?: number;
  hourlyRate?: number;
  annualSalary?: number;
  estimatedHours?: number;
  hours?: number;
  category?: string;
  seniority?: string;
  allocationPercentage?: number;
}

export interface VendorConfig {
  vendorName: string;
  hourlyRate: number;
  estimatedHours: number;
  managementFee: number;
  oversightRate?: number;
}

export interface ReportCustomization {
  showExecutiveSummary: boolean;
  showDetailedBreakdown: boolean;
  showCharts: boolean;
  showRecommendations: boolean;
  showTimeline: boolean;
  showRiskAnalysis: boolean;
  companyLogo?: string;
  companyName?: string;
  reportTitle?: string;
  preparedBy?: string;
  preparedFor?: string;
}

export interface SensitivityAnalysis {
  variable: string;
  baseValue: number;
  variations: {
    percentage: number;
    value: number;
    roi: number;
    npv: number;
    profitable: boolean;
  }[];
  breakEvenPoint?: number;
}

export interface PremiumFeatures {
  sensitivityAnalysis: boolean;
  advancedReporting: boolean;
  scenarioComparison: boolean;
  pdfExport: boolean;
  apiAccess: boolean;
  whiteLabeling: boolean;
}

// Helper function to safely get ROI percentage
export function getRoiPercentage(roi: ROIData | number | undefined): number {
  if (!roi) return 0;
  if (typeof roi === 'number') return roi;
  return roi.percentage || 0;
}

// Helper function to normalize ROI to ROIData
export function normalizeRoi(roi: ROIData | number | undefined): ROIData {
  if (!roi) return { percentage: 0, amount: 0 };
  if (typeof roi === 'number') return { percentage: roi, amount: 0 };
  return roi;
}
