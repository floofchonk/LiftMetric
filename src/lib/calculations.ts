import type { CalculatorResults, ROIData, TimelinePhase, StaffingOption } from '../types/calculator';

export function calculateROI(scenario: any): CalculatorResults {
  const totalRevenue = 1000000;
  const totalCosts = 500000;
  const netProfit = totalRevenue - totalCosts;
  
  const roi: ROIData = {
    percentage: (netProfit / totalCosts) * 100,
    amount: netProfit,
    paybackMonths: 12,
    npv: 450000,
    totalProjectCost: totalCosts,
    expectedAnnualBenefit: totalRevenue,
    timeToFullBenefit: 6,
    projectLifetimeYears: 5,
    discountRate: 0.1,
    residualValue: 100000,
    roiPercentage: (netProfit / totalCosts) * 100,
  };
  
  const timeline: TimelinePhase[] = [
    {
      period: 1,
      revenue: 100000,
      costs: 50000,
      profit: 50000,
      cumulativeROI: 10,
    }
  ];

  const directHire: StaffingOption = { type: 'direct-hire', cost: 400000, timeline: 12, risk: 'medium', pros: ['Full control'], cons: ['Higher upfront cost'] };
  const contractor: StaffingOption = { type: 'contractor', cost: 550000, timeline: 10, risk: 'low', pros: ['Flexible'], cons: ['Less control'] };
  const vendor: StaffingOption = { type: 'vendor', cost: 600000, timeline: 8, risk: 'low', pros: ['Fast delivery'], cons: ['Premium cost'] };

  return {
    totalRevenue,
    totalCosts,
    netProfit,
    roi,
    timeline,
    options: [directHire, contractor, vendor],
    staffingOptions: [directHire, contractor, vendor],
    recommendations: [],
    bestOption: 'hybrid',
    paybackPeriod: 12,
    directHire,
    contractor,
    vendor,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
