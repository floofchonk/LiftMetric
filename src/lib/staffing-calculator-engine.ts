import {
  ProjectInputs,
  TShirtSizeConfig,
  Role,
  Location,
  RoleLocationAssignment,
  StaffingModel,
  Phase,
  PhaseResult,
  ModelResult,
  CalculationResult,
  DirectHireCostInputs,
  OnsiteContractorCostInputs,
  OutsourcedVendorCostInputs,
  ROIMetrics,
} from '../types/staffing-calculator';

const PHASES: Phase[] = ['Discovery', 'Design', 'Build', 'Testing', 'Launch', 'Hypercare'];

/**
 * Calculate adjusted effort hours based on T-shirt size and complexity factor
 */
export function calculateAdjustedEffort(
  tShirtConfig: TShirtSizeConfig,
  complexityFactor: number
): number {
  return tShirtConfig.baseEffortHours * complexityFactor;
}

/**
 * Calculate hours per role based on allocation percentage
 */
export function calculateRoleHours(
  role: Role,
  totalEffortHours: number
): number {
  if (role.overrideHours !== undefined) {
    return role.overrideHours;
  }
  return (totalEffortHours * role.allocationPercentage) / 100;
}

/**
 * Calculate Direct Hire costs for a role
 */
export function calculateDirectHireCost(
  hours: number,
  costInputs: DirectHireCostInputs,
  location: Location
): { hourlyRate: number; totalCost: number } {
  const fullyLoadedAnnualCost =
    costInputs.baseSalary *
    (1 + costInputs.benefitsPercentage / 100 + costInputs.taxesPercentage / 100 + costInputs.overheadPercentage / 100);
  
  const locationAdjustedCost = (fullyLoadedAnnualCost * location.costIndex) + costInputs.fixedCosts;
  const hourlyRate = locationAdjustedCost / 2080; // Standard work hours per year
  const totalCost = hourlyRate * hours;

  return { hourlyRate, totalCost };
}

/**
 * Calculate Onsite Contractor costs for a role
 */
export function calculateOnsiteContractorCost(
  hours: number,
  costInputs: OnsiteContractorCostInputs,
  location: Location
): { hourlyRate: number; totalCost: number } {
  const effectiveRate =
    costInputs.billRate *
    (1 + costInputs.markupPercentage / 100 + costInputs.overheadManagementPercentage / 100) *
    location.costIndex;
  
  const totalCost = effectiveRate * hours;

  return { hourlyRate: effectiveRate, totalCost };
}

/**
 * Calculate Outsourced Vendor costs
 */
export function calculateOutsourcedVendorCost(
  totalHours: number,
  costInputs: OutsourcedVendorCostInputs,
  phaseHours: { phase: Phase; hours: number }[]
): { hourlyRate: number; totalCost: number; breakdown: { vendor: number; buffer: number; oversight: number } } {
  let vendorCost = 0;

  if (costInputs.rateType === 'TimeAndMaterials' && costInputs.hourlyRate) {
    vendorCost = totalHours * costInputs.hourlyRate;
  } else if (costInputs.rateType === 'FixedPrice' && costInputs.fixedFee) {
    vendorCost = costInputs.fixedFee;
  } else if (costInputs.rateType === 'Milestone' && costInputs.milestoneFees) {
    vendorCost = costInputs.milestoneFees.reduce((sum, m) => sum + m.amount, 0);
  }

  // Apply discount
  vendorCost = vendorCost * (1 - costInputs.discountPercentage / 100);

  // Add SLA buffer
  const bufferCost = vendorCost * (costInputs.slaBufferPercentage / 100);

  // Add internal oversight cost
  const oversightCost = costInputs.internalOversightHours * costInputs.oversightHourlyRate;

  const totalCost = vendorCost + bufferCost + oversightCost;
  const hourlyRate = totalHours > 0 ? totalCost / totalHours : 0;

  return {
    hourlyRate,
    totalCost,
    breakdown: {
      vendor: vendorCost,
      buffer: bufferCost,
      oversight: oversightCost,
    },
  };
}

/**
 * Calculate timeline and phase dates
 */
export function calculateTimeline(
  startDate: string,
  tShirtConfig: TShirtSizeConfig,
  complexityFactor: number
): { phases: { phase: Phase; startDate: string; endDate: string; durationDays: number }[]; totalDuration: number } {
  const baseDurationDays = tShirtConfig.baseDurationMonths * 30;
  const adjustedDurationDays = Math.round(baseDurationDays * complexityFactor);

  const start = new Date(startDate);
  const phases: { phase: Phase; startDate: string; endDate: string; durationDays: number }[] = [];

  let currentDate = new Date(start);

  PHASES.forEach((phase) => {
    const phasePercentage = tShirtConfig.phaseDistribution[phase] / 100;
    const phaseDuration = Math.round(adjustedDurationDays * phasePercentage);

    const phaseStart = new Date(currentDate);
    const phaseEnd = new Date(currentDate);
    phaseEnd.setDate(phaseEnd.getDate() + phaseDuration);

    phases.push({
      phase,
      startDate: phaseStart.toISOString().split('T')[0],
      endDate: phaseEnd.toISOString().split('T')[0],
      durationDays: phaseDuration,
    });

    currentDate = new Date(phaseEnd);
  });

  return { phases, totalDuration: adjustedDurationDays };
}

/**
 * Calculate cost for a single staffing model
 */
export function calculateModelCost(
  projectInputs: ProjectInputs,
  tShirtConfig: TShirtSizeConfig,
  roles: Role[],
  locations: Location[],
  assignments: RoleLocationAssignment[],
  staffingModel: StaffingModel
): ModelResult {
  const adjustedEffortHours = calculateAdjustedEffort(tShirtConfig, projectInputs.complexityFactor);
  const timeline = calculateTimeline(projectInputs.startDate, tShirtConfig, projectInputs.complexityFactor);

  const roleBreakdown: ModelResult['roleBreakdown'] = [];
  const phaseResults: PhaseResult[] = [];

  let totalCost = 0;

  // Calculate cost for each role
  roles.forEach((role) => {
    const roleHours = calculateRoleHours(role, adjustedEffortHours);
    const assignment = assignments.find((a) => a.roleId === role.id && a.staffingModel === staffingModel);

    if (!assignment) return;

    const location = locations.find((l) => l.id === assignment.locationId);
    if (!location) return;

    let roleCost = 0;
    let hourlyRate = 0;

    if (staffingModel === 'DirectHire') {
      const result = calculateDirectHireCost(roleHours, assignment.costInputs as DirectHireCostInputs, location);
      roleCost = result.totalCost;
      hourlyRate = result.hourlyRate;
    } else if (staffingModel === 'OnsiteContractor') {
      const result = calculateOnsiteContractorCost(
        roleHours,
        assignment.costInputs as OnsiteContractorCostInputs,
        location
      );
      roleCost = result.totalCost;
      hourlyRate = result.hourlyRate;
    } else if (staffingModel === 'OutsourcedVendor') {
      const phaseHours = PHASES.map((phase) => ({
        phase,
        hours: (roleHours * tShirtConfig.phaseDistribution[phase]) / 100,
      }));
      const result = calculateOutsourcedVendorCost(
        roleHours,
        assignment.costInputs as OutsourcedVendorCostInputs,
        phaseHours
      );
      roleCost = result.totalCost;
      hourlyRate = result.hourlyRate;
    }

    totalCost += roleCost;

    roleBreakdown.push({
      roleId: role.id,
      roleName: role.name,
      totalHours: roleHours,
      totalCost: roleCost,
      hourlyRate,
    });
  });

  // Calculate cost per phase
  PHASES.forEach((phase, index) => {
    const phasePercentage = tShirtConfig.phaseDistribution[phase] / 100;
    const phaseEffortHours = adjustedEffortHours * phasePercentage;
    const phaseCost = totalCost * phasePercentage;

    const phaseRoles = roleBreakdown.map((rb) => ({
      roleId: rb.roleId,
      roleName: rb.roleName,
      hours: rb.totalHours * phasePercentage,
      cost: rb.totalCost * phasePercentage,
    }));

    phaseResults.push({
      phase,
      startDate: timeline.phases[index].startDate,
      endDate: timeline.phases[index].endDate,
      durationDays: timeline.phases[index].durationDays,
      effortHours: phaseEffortHours,
      cost: phaseCost,
      roles: phaseRoles,
    });
  });

  const endDate = timeline.phases[timeline.phases.length - 1].endDate;
  const targetDate = new Date(projectInputs.targetGoLiveDate);
  const actualEndDate = new Date(endDate);
  const daysDifference = Math.round((actualEndDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

  return {
    staffingModel,
    totalCost,
    totalDuration: timeline.totalDuration,
    totalEffortHours: adjustedEffortHours,
    meetsTargetDate: daysDifference <= 0,
    phases: phaseResults,
    roleBreakdown,
    costByPhase: phaseResults.map((p) => ({ phase: p.phase, cost: p.cost })),
    timeline: {
      startDate: projectInputs.startDate,
      endDate,
      targetDate: projectInputs.targetGoLiveDate,
      daysEarly: daysDifference < 0 ? Math.abs(daysDifference) : 0,
      daysLate: daysDifference > 0 ? daysDifference : 0,
    },
  };
}

/**
 * Calculate ROI metrics
 */
export function calculateROI(
  totalInvestment: number,
  expectedRevenue: number,
  discountRate: number,
  durationMonths: number
): ROIMetrics {
  const netProfit = expectedRevenue - totalInvestment;
  const roi = (netProfit / totalInvestment) * 100;

  // Simple NPV calculation (assuming revenue comes at end)
  const npv = expectedRevenue / Math.pow(1 + discountRate / 100, durationMonths / 12) - totalInvestment;

  // Payback period calculation
  const monthlyProfit = netProfit / durationMonths;
  const paybackPeriodMonths = monthlyProfit > 0 ? totalInvestment / monthlyProfit : 0;

  const startDate = new Date();
  const breakEvenDate = new Date(startDate);
  breakEvenDate.setMonth(breakEvenDate.getMonth() + Math.ceil(paybackPeriodMonths));

  return {
    netPresentValue: npv,
    returnOnInvestment: roi,
    paybackPeriodMonths,
    breakEvenDate: breakEvenDate.toISOString().split('T')[0],
    expectedRevenue,
    totalInvestment,
  };
}

/**
 * Complete calculation comparing all staffing models
 */
export function calculateAllModels(
  projectInputs: ProjectInputs,
  tShirtConfig: TShirtSizeConfig,
  roles: Role[],
  locations: Location[],
  assignments: RoleLocationAssignment[],
  expectedRevenue?: number
): CalculationResult {
  const models: ModelResult[] = [];

  // Calculate each staffing model
  const staffingModels: StaffingModel[] = ['DirectHire', 'OnsiteContractor', 'OutsourcedVendor'];
  
  staffingModels.forEach((model) => {
    const modelAssignments = assignments.filter((a) => a.staffingModel === model);
    if (modelAssignments.length > 0) {
      const result = calculateModelCost(projectInputs, tShirtConfig, roles, locations, assignments, model);
      models.push(result);
    }
  });

  // Determine recommended model (lowest cost that meets target date)
  const validModels = models.filter((m) => m.meetsTargetDate);
  const recommendedModel =
    validModels.length > 0
      ? validModels.sort((a, b) => a.totalCost - b.totalCost)[0].staffingModel
      : models.sort((a, b) => a.totalCost - b.totalCost)[0].staffingModel;

  // Calculate comparisons
  const costs = models.map((m) => m.totalCost);
  const minCost = Math.min(...costs);

  const costSavings = models.map((m) => ({
    model: m.staffingModel,
    savingsAmount: m.totalCost - minCost,
    savingsPercentage: minCost > 0 ? ((m.totalCost - minCost) / minCost) * 100 : 0,
  }));

  const timeToMarket = models.map((m, index) => ({
    model: m.staffingModel,
    duration: m.totalDuration,
    difference: index > 0 ? m.totalDuration - models[0].totalDuration : 0,
  }));

  const riskAssessment = models.map((m) => {
    const factors: string[] = [];
    let riskScore = 0;

    if (!m.meetsTargetDate) {
      factors.push('Does not meet target date');
      riskScore += 30;
    }

    if (m.staffingModel === 'DirectHire') {
      factors.push('Higher upfront commitment');
      riskScore += 10;
    } else if (m.staffingModel === 'OutsourcedVendor') {
      factors.push('Dependency on external vendor');
      riskScore += 20;
    }

    if (projectInputs.riskProfile === 'High') {
      riskScore += 15;
    }

    return {
      model: m.staffingModel,
      riskScore,
      factors,
    };
  });

  // Calculate ROI if revenue provided
  let roiMetrics: ROIMetrics | undefined;
  if (expectedRevenue && models.length > 0) {
    const recommendedModelData = models.find((m) => m.staffingModel === recommendedModel);
    if (recommendedModelData) {
      roiMetrics = calculateROI(
        recommendedModelData.totalCost,
        expectedRevenue,
        projectInputs.discountRate,
        recommendedModelData.totalDuration / 30
      );
    }
  }

  return {
    projectInputs,
    models,
    recommendedModel,
    comparison: {
      costSavings,
      timeToMarket,
      riskAssessment,
    },
    roiMetrics,
  };
}
