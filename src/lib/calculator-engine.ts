import type {
  ProjectInputs,
  TShirtSize,
  Role,
  Location,
  CostModels,
  ROIInputs,
  CalculationResults,
  StaffingMetrics,
} from '../types/calculator';

export function calculateROI(
  totalRevenue: number,
  totalCosts: number,
  projectLifetime: number = 3
): CalculationResults {
  const netProfit = totalRevenue - totalCosts;
  const roiPercentage = totalCosts > 0 ? (netProfit / totalCosts) * 100 : 0;
  const roiAmount = netProfit;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const paybackPeriod = totalRevenue > 0 ? Math.ceil((totalCosts / (totalRevenue / 12))) : 0;

  const timeline = [];
  for (let period = 1; period <= projectLifetime * 12; period++) {
    const periodRevenue = totalRevenue / 12;
    const periodCosts = totalCosts / (projectLifetime * 12);
    const periodProfit = periodRevenue - periodCosts;
    const cumulativeROI = ((period * periodRevenue - totalCosts) / totalCosts) * 100;

    timeline.push({
      period,
      revenue: periodRevenue,
      costs: periodCosts,
      profit: periodProfit,
      cumulativeROI: Math.max(cumulativeROI, -100),
    });
  }

  const staffingMetrics: StaffingMetrics = {
    totalHeadcount: 10,
    totalCost: totalCosts,
    averageRate: totalCosts / 10,
    utilizationRate: 85,
  };

  return {
    totalRevenue,
    totalCosts,
    totalCost: totalCosts,
    netProfit,
    roi: { percentage: roiPercentage, amount: roiAmount },
    profitMargin,
    paybackPeriod,
    costSavings: netProfit,
    annualSavings: netProfit / projectLifetime,
    totalSavings: netProfit,
    staffingMetrics,
    timeline,
    options: [],
    recommendations: [],
    bestOption: 'direct-hire',
  };
}

export function calculateProjectMetrics(
  projectInputs: ProjectInputs,
  roles: Role[],
  costModels: CostModels
): CalculationResults {
  const totalCosts = roles.reduce((sum, role) => sum + (role.hours || role.estimatedHours || 0) * (role.hourlyRate || 100), 0);
  const totalRevenue = totalCosts * 1.5;
  
  return calculateROI(totalRevenue, totalCosts, projectInputs.projectDuration || 3);
}

export function calculateNPV(
  cashFlows: number[],
  discountRate: number
): number {
  return cashFlows.reduce((npv, cashFlow, period) => {
    return npv + cashFlow / Math.pow(1 + discountRate, period);
  }, 0);
}

export function calculateIRR(
  cashFlows: number[],
  guess: number = 0.1
): number {
  const maxIterations = 100;
  const tolerance = 0.0001;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(cashFlows, rate);
    const npvDerivative = cashFlows.reduce((sum, cf, period) => {
      return sum - period * cf / Math.pow(1 + rate, period + 1);
    }, 0);

    const newRate = rate - npv / npvDerivative;
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100;
    }
    rate = newRate;
  }

  return rate * 100;
}

export function calculatePaybackPeriod(
  initialInvestment: number,
  annualCashFlow: number
): number {
  if (annualCashFlow <= 0) return Infinity;
  return initialInvestment / annualCashFlow;
}
